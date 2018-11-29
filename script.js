var fileUrl = '';
var bytes = 0;
var fileArray = new Array();
var i =0;

var toggle = true; // 토글 버튼 초기 상태
var many = true; // 인물 여러명 감지시 알림 여부 상태
var flag = false;


// 다운로드 클릭시 파일 경로 및 이름 지정
whale.downloads.onDeterminingFilename.addListener(function(item, suggest) {
    var url; // 다운로드 url
    var mime; // 파일 종류
    var file_type; // 파일 종류 => 파일 확장자
    var filename; // 파일 이름
    


    //중복 체크. 함수로 빼두었더니 에러나고 순서가 이상.. 추후 수정예정
    whale.downloads.search({
      orderBy: ['-startTime'],
      exists: true,
      startedBefore: item.startTime,
      url: item.url
    }, downloadedItems => {
      downloadedItems.some(item => {
        if((item.filename).length!=0) {
          alert('중복된 이미지입니다. ');
          flag = true;
          return true;
        }
      });  
    });


    // 켜져있을 때만
     if(toggle) {
       // download url 가져오기
       url = item.url;
       mime = item.mime; //mime

       console.log("url(script.js): " + url +"\nmime(script.js): " + mime);

       // 이미지 mime을 확장자로 변환
       switch(mime) {
         case 'image/gif':
           file_type = ".gif";
         break;
         case 'image/png':
           file_type = ".png";
         break;
         case 'image/jpeg':
           file_type = ".jpg";
         break;
         case 'image/bmp':
           file_type = ".bmp";
         break;
         case 'image/webp':
           file_type = ".webp";
         break;
         case 'image/vnd.microsoft.icon':
           file_type = ".ico";
         break;

         default: break;
     }

      // 이미지인 경우만 CFR API 호출
	    switch(mime) {
	    	case 'image/gif':
	    	case 'image/png':
	    	case 'image/jpeg':
	    	case 'image/bmp':
	    	case 'image/webp':
	    	case 'image/vnd.microsoft.icon':

        if(file_type) {
          // Ajax
            $.ajax({
              method: "POST",
              async: false, // 동기식으로 통산
              url: "http://ec2-52-79-137-54.ap-northeast-2.compute.amazonaws.com/duckduck/cfr.py", // 파이썬 모듈 호출
              beforeSend: function() {whale.sidebarAction.setBadgeBackgroundColor({ color: [255, 187, 0, 255] });}, // 로딩중 배지 색상 변경 (주황), 알림창
              complete: function() {whale.sidebarAction.setBadgeBackgroundColor({ color: [29, 219 ,22, 255] });}, // 완료후 배지 색상 (초록)
              data: {img_url : url, file_type: file_type } // 원본 url, 확장자
            }).done(function( data ) {

              data = data.toString();
              data = data.replace(/\n/g, "");//행바꿈제거
              data = data.replace(/\r/g, "");//엔터제거
              data = data.replace(/'/g, '"');// 작은따옴표를 큰따옴표로 변경 (json 객체 생성시 에러 방지)

              console.log("data(script.js): " + data); // 문자열

              try {
                  var celObj = JSON.parse(data); // json 객체 생성

                  // json 객체에서 정보 추출
                  var count = celObj.info.faceCount; // 인물 수
                  var faces = celObj.faces; // 인물 정보가 담긴 json Array
                  var people = new Array(count); // 인물의 수만큼 배열 (인물이름)
                  var confidences = new Array(count); // 신뢰도

                  // 인물을 찾지 못한 경우
                  if(count <= 0) {
                    var fail_confirm = confirm("인물을 찾지 못했어요. :(\n원본 이름으로 저장할까요?");
                    // 원본 이름으로 저장
                    if(fail_confirm) {
                      suggest({filename: item.filename});
                    } else { // 파일 이름 수정
                      filename = prompt("어떤 이름으로 저장할까요?", "");
                      filename = characterCheck (filename);

                      if(filename == null) { // 공백을 입력하면 원본이름으로 저장
                        alert("유효하지 않은 파일 이름입니다.");
                        suggest({filename: item.filename});
                      }
                    }

                  } else {

                    var message = ""; // 인식된 인물 이름과 신뢰도 메시지
                    // 인물 정보 배열에 저장하기
                    for(var i = 0; i < faces.length; i++) {
                      people[i] = faces[i].celebrity.value;
                      confidences[i] = faces[i].celebrity.confidence;
                    }

                    // 신뢰도 높은 순으로 정렬
                    var temp;
                    for(var i=confidences.length; i>0; i--) {
                      for (var j=0; j<i-1; j++) {
                        if(confidences[j] < confidences[j+1]) {
                          temp = confidences[j];
                          confidences[j] = confidences[j+1];
                          confidences[j+1] = temp;

                          temp = people[j];
                          people[j] = people[j+1];
                          people[j+1] = temp;
                        }
                      }
                    }

                    for(var i = 0; i < people.length; i++) {
                      message = message + (i+1) + ". " + people[i] + " (" + (confidences[i] * 100).toFixed(2) + "%)\n";
                    }

                    // 신뢰도가 최고값인 인물의 이름
                    filename = people[0];
                    var conf = (confidences[0]*100).toFixed(2);

                    // 분석 결과 알림창
                    var mess = "분석결과\n" + filename + " (" + conf + "%)";
                    var opt = {
                      type: "basic",
                      title: "어덕편덕",
                      message: mess,
                      iconUrl: "icon/duck.PNG"
                    };

                    if(count == 1) {
                      whale.notifications.create(opt);
                    }

                    // '인물 여럿 인식시 알림' 체크되어있는 경우
                    if(many) {
                      if(count > 1) {
                        filename = prompt("인물이 여러명 인식되었어요.\n" + message + "어떤 이름으로 저장할까요?", filename);
                        filename = characterCheck(filename);
                        
                        if(filename == null) { // 공백을 입력하면 원본이름으로 저장
                          alert("유효하지 않은 파일 이름입니다.");
                          suggest({filename: item.filename});
                        }
                      } else if(count == 1) {
                        if(conf <= 60.0) {
                          var fail_confirm = confirm("인물 신뢰도가 낮아요.:(\n결과: " + filename + "(" + conf + "%)\n이대로 저장하시겠어요?");
                          if(!fail_confirm) { // 파일 이름 수정
                            filename = prompt("어떤 이름으로 저장할까요?", "");
                            filename = characterCheck (filename);

                            if(filename == null) { // 공백을 입력하면 원본이름으로 저장
                              alert("유효하지 않은 파일 이름입니다.");
                              suggest({filename: item.filename});
                            }
                          }
                        }
                      }

                    } else {
                      // 신뢰도가 60%이하인 경우 인식 실패 알림
                      if(conf <= 60.0) {
                        var fail_confirm = confirm("인물 신뢰도가 낮아요.:(\n결과: " + filename + "(" + conf + "%)\n이대로 저장하시겠어요?");
                        if(!fail_confirm) { // 파일 이름 수정
                          filename = prompt("어떤 이름으로 저장할까요?", "");
                          filename = characterCheck(filename);

                          if(filename == null) { // 공백을 입력하면 원본이름으로 저장
                            alert("유효하지 않은 파일 이름입니다.");
                            suggest({filename: item.filename});
                          }
                        }
                      }
                    }

                    // 최종 경로: .../download/인물이름/인물이름(n).xxx
                    try {
                      suggest({filename:  filename + "/" + filename + file_type});
                    } catch(e) {
                      suggest({filename:  item.filename});
                    }
                  }

              }
              catch(exception){
                var fail_confirm = confirm("인물 인식 처리 중 문제가 발생했어요. :(\n원본 이름으로 저장할까요?");
                // 원본 이름으로 저장
                if(fail_confirm) {
                  suggest({filename: item.filename});
                } else { // 파일 이름 수정
                  filename = prompt("어떤 이름으로 저장할까요?", "");
                  filename = characterCheck(filename);

                  if(filename == null) { // 공백을 입력하면 원본이름으로 저장
                    alert("유효하지 않은 파일 이름입니다.");
                    suggest({filename: item.filename});
                  }
                }
              } finally {
                console.log("filename(script.js): " + filename);
              }
          });
        }
	    	break;

	    	default:break;
	    }
   }
});


//특수문자 확인
function characterCheck (filename) {
  var name = filename;
  var special_pattern = /[`<>.~@#$%^&*|\\\'\";:\/?]/gi; 
  while(special_pattern.test(name)) { 
    name = prompt('특수문자가 포함되어 있습니다.\n다시 입력해주세요.');
  }
  return name;
}


// toggle: 최초 다운로드시에 true /  many: 최초 다운로드시에 true
whale.runtime.onInstalled.addListener(function (details) {
    whale.storage.sync.set({'toggle': true});
    whale.storage.sync.set({'many': true});
    whale.sidebarAction.setBadgeText({text: "O"});
    whale.sidebarAction.setBadgeBackgroundColor({ color: [29, 219 ,22, 255] });

});

// toggle, many 변화되면 스토리지에 상태 저장
whale.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        if (key == "toggle") {
          toggle = storageChange.newValue;
          console.log("toggle: " + toggle);
          if(toggle) {
            whale.sidebarAction.setBadgeText({text: "O"});
          } else {
            whale.sidebarAction.setBadgeText({text: ""});
          }

      } else if (key == "many") {
        many = storageChange.newValue;
        console.log("many: " + many);
      }
    }
});

// 사이드바 열려있는지 체크
var is_open = false;
whale.sidebarAction.onClicked.addListener(function(result) {
  if(result.opened) {
    is_open = true;
  } else {
    is_open = false;
  }
});


// 단축키
whale.commands.onCommand.addListener(function (command) {
    // 서비스 on/off 단축키
    if (command === "toggle") {
        if(toggle) {
          whale.storage.sync.set({'toggle': false}); // 서비스 끄기
        } else {
          whale.storage.sync.set({'toggle': true}); // 서비스 켜기
        }
    }

    // 사이드바 on/off 단축키
    if(command === "side-page") {
      if(is_open) {
        whale.sidebarAction.hide();
        is_open = false;
      } else {
        whale.sidebarAction.show();
        is_open = true;
      }
    }
});
