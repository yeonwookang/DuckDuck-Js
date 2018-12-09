var fileUrl = '';
var bytes = 0;
var fileArray = new Array();

var toggle = true; // 토글 버튼 초기 상태
var many = true; // 인물 여러명 감지시 알림 여부 상태
var flag2 = null; // 이미지 주소에 확장자가 없는 경우 확장자를 저장할 변수



//이미지 주소에 확장자가 없는 경우 확장자를 저장
function getImageInfoHandler(item, callback) {
  return function() {
    var imageinfo = ImageInfo.getAllFields(item.srcUrl);
    file_type = imageinfo['format'];
    callback(item, file_type);
  };
};

function duple_callback(item,file_type){
  duple_check(item, file_type, "temp");
}




//파일 이름 확인
function validCheck(obj){
  if(obj == null ) {
    alert('유효하지 않은 이름입니다.');
    return false;
  }
	if(obj.length==0){
    alert('유효하지 않은 이름입니다.');
		return false;
	}
	var special_pattern = /[:|?<>*"\\\/\s]/gi;
	if(special_pattern.test(obj) == true){
    alert('유효하지 않은 이름입니다.');
		return false;
  }
  return true;
}

//콘텍스트 메뉴 클릭시 실행 - 토글 상태 확인, 중복 체크 
function ctmClick(item) {
  var img_url= item.srcUrl;
  var file_type = img_url.split('.');
  var file_name = img_url.split('/');


  //원본 파일 이름
  file_name = file_name[file_name.length-1];
  file_name = (file_name.split('.'))[0];
  //toggle 상태 확인
  if(!toggle) {
    alert('어덕편덕 OFF 상태입니다. ');
    return;
  }

  //맨 뒤 확장자 추출
  switch(file_type[file_type.length-1]) {
    case 'gif':
      file_type = ".gif";
    break;
    case 'png':
      file_type = ".png";
    break;
    case 'jpeg':
      file_type = ".jpg";
    break;
    case 'jpg':
    file_type = ".jpg";
  break;
    case 'bmp':
      file_type = ".bmp";
    break;
    case 'webp':
      file_type = ".webp";
    break;
    case 'icon':
      file_type = ".ico";
    break;

    default:

      //이미지 주소에 확장자 있는 경우
      if(img_url.toLowerCase().includes('jpg') || img_url.toLowerCase().includes('jpeg') )
        file_type = ".jpg";     
      else if(img_url.toLowerCase().includes('gif')) 
        file_type = ".gif";    
      else if(img_url.toLowerCase().includes('png')) 
        file_type = ".png";     
      else if(img_url.toLowerCase().includes('bmp')) 
        file_type = ".bmp";     
      else if(img_url.toLowerCase().includes('webp')) 
        file_type = ".webp";     
      else if(img_url.toLowerCase().includes('ico')) 
        file_type = ".ico";  
      
      //이미지 주소에 확장자 없는 경우
      else {        
        //이미지를 분석해 확장자 알아냄
        file_type=null;
        ImageInfo.loadInfo(img_url, getImageInfoHandler(item, duple_callback));
      }
    break;
    
  }

 //중복체크
  if(file_type!=null)
    duple_check(item, file_type, file_name);

}


function duple_check(item, file_type, file_name) {
  var img_url =  item.srcUrl;
  var flag = false;  
 
  whale.downloads.search({
    orderBy: ['-startTime'],
    exists: true,
    url: img_url
  }, downloadedItems => {  
    downloadedItems.some(item => {
      if((item.filename).length!=0) {
        flag = true;
        return true;
      }
    });
    
    //콜백함수 whale.downloads.search 완료 후 실행
    //중복일 때
    if(flag == true) {
      var duple_confirm =  confirm("중복된 이미지입니다. 계속 저장하겠습니까?");
      if(duple_confirm) {
        img_recognition(img_url, file_type, file_name);
      }
      else 
        return; 
    }

    //중복이 아닐때
    else {
      img_recognition(img_url, file_type, file_name);
    }
  });
}

//이미지 얼굴인식
function img_recognition(file_url, filetype, file_name) {
  var url = file_url; // 다운로드 url
  var file_type = filetype; // 파일 종류 => 파일 확장자
  var filename = file_name;
  var newDownload = false; // 원본이름으로 저장(false), 새로운 이름으로 저장(true)

  $.ajax({
    method: "POST",
    async: false, // 동기식으로 통신
    url: "http://ec2-52-79-137-54.ap-northeast-2.compute.amazonaws.com/duckduck/cfr.py", // 파이썬 모듈 호출
    beforeSend: function() {
      whale.sidebarAction.setBadgeBackgroundColor({ color: [255, 187, 0, 255] });// 로딩중 배지 색상 변경 (주황), 알림창
    },
    complete: function() {whale.sidebarAction.setBadgeBackgroundColor({ color: [29, 219 ,22, 255] });}, // 완료후 배지 색상 (초록)
    data: {img_url : url, file_type: file_type }, // 원본 url, 확장자
    error: function() {alert("서버와의 통신에 실패했습니다. 다시 시도해주세요.");}
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
          if(!fail_confirm) {
          // 파일 이름 수정
            filename = prompt("어떤 이름으로 저장할까요?", "");
            if(validCheck(filename)) {
              fullname = filename+filetype;
              img_download(url, filename+filetype);
              return;
            } 
          }
          img_download_original(url);
          return;

          // 인물을 찾은 경우
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
              if(validCheck(filename))
                newDownload = true;

            } else if(count == 1) {
              if(conf <= 60.0) {
                var fail_confirm = confirm("인물 신뢰도가 낮아요.:(\n결과: " + filename + "(" + conf + "%)\n이대로 저장하시겠어요?");
                // 파일 이름 수정
                if(!fail_confirm) { 
                  filename = prompt("어떤 이름으로 저장할까요?", "");
                  if(validCheck(filename))
                    newDownload = true;
                // 지정한 파일 이름 
                } else
                  newDownload = true;
              } else { // 60% 이상이면 파일 이름 자동 수정
                newDownload = true;
              }
              
            }

          } else {
            // 신뢰도가 60%이하인 경우 인식 실패 알림
            if(conf <= 60.0) {
              var fail_confirm = confirm("인물 신뢰도가 낮아요.:(\n결과: " + filename + "(" + conf + "%)\n이대로 저장하시겠어요?");
              if(!fail_confirm) { // 파일 이름 수정
                filename = prompt("어떤 이름으로 저장할까요?", "");
                if(validCheck(filename))
                  newDownload = true;
              } else {
                newDownload = true;
              }
            } else {
              newDownload = true;
            }
          }

          // 최종 경로: .../download/인물이름/인물이름(n).xxx
          try {
            //새로운 이름으로 저장
            if(newDownload)
              img_download(url, filename + "/" +filename+file_type);

            //원본 이름으로 저장
            else
              img_download_original(url);

          } catch(e) {
            img_download_original(url);
          }
        }
    }


    
    catch(exception){
      var fail_confirm = confirm("인물 인식 처리 중 문제가 발생했어요. :(\n원본 이름으로 저장할까요?");
      // 원본 이름으로 저장
      if(fail_confirm) {
        img_download_original(url);
      } else { // 파일 이름 수정
        filename = prompt("어떤 이름으로 저장할까요?", "");
        if(validCheck(filename))
          img_download(url, filename + "/" +filename+file_type);
        else
        img_download_original(url);
      }
    } finally {
      console.log("filename(script.js): " + filename);
    }
});
}


//새로운 이름으로 이미지 다운로드
function img_download(file_url, file_name) {
  whale.downloads.download({
    url: file_url,
    filename: file_name });
}

//원본 이름으로 이미지 다운로드
function img_download_original(file_url) {
  whale.downloads.download({
    url: file_url  });
}

//콘텍스트 메뉴 생성
whale.contextMenus.create({
  title: '이미지 저장하기',
  contexts: ['image'],
  onclick: ctmClick  //콘텍스트 메뉴 클릭시 ctmClick 메소드 실행

});

// toggle: 최초 다운로드시에 true /  many: 최초 다운로드시에 true
whale.runtime.onInstalled.addListener(function (details) {
    whale.storage.sync.set({'toggle': true});
    whale.storage.sync.set({'many': true});

});

// 웨일 브라우저 실행할 때 아이콘 설정
whale.storage.sync.get(['toggle'], function(result) {
    console.log("toggle(storage): " + result.toggle);
    if(result.toggle == true) {
      whale.sidebarAction.setBadgeText({text: "O"});
      whale.sidebarAction.setBadgeBackgroundColor({ color: [29, 219 ,22, 255] });
    } else {
      whale.sidebarAction.setBadgeText({text: ""});
    }

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
            whale.sidebarAction.setBadgeBackgroundColor({ color: [29, 219 ,22, 255] });
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
