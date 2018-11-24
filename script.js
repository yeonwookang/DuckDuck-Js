var fileUrl = '';
var bytes = 0;
var fileArray = new Array();
var i =0;

var url; // 다운로드 url
var mime; // 파일 종류
var file_type; // 파일 종류 => 파일 확장자
var filename; // 인물 이름
var toggle = true; // 토글 버튼 초기 상태

// 다운로드 클릭시
// 파일 경로 및 이름 지정
whale.downloads.onDeterminingFilename.addListener(function(item, suggest) {
    // 켜져있을 때만
     if(toggle) {
       // download url 가져오기
       url = item.url;
       mime = item.mime; //mime

       // 중복 체크
       var isDuplicated = bytesCheck(url, item.totalBytes);
       if(isDuplicated) {
         confirm("중복된 이미지입니다.");
       }

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
              async: false, // 동기식으로 호출
              url: "http://ec2-52-79-137-54.ap-northeast-2.compute.amazonaws.com/duckduck/cfr.py", // 파이썬 모듈 호출
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
                      var fail_confirm = confirm("인물을 찾지 못했어요. :(\n원본이름으로 저장할까요?");
                      // 원본 이름으로 저장
                      if(fail_confirm) {
                        suggest({filename: item.filename});
                      } else { // 파일 이름 수정
                        filename = prompt("어떤 이름으로 저장할까요?", "");
                        if(filename == null) { // 공백을 입력하면 원본이름으로 저장
                          suggest({filename: item.filename});
                        }
                      }

                    } else {

                      // 인물 정보 배열에 저장하기
                      for(var i = 0; i < faces.length; i++) {
                        people[i] = faces[i].celebrity.value;
                        confidences[i] = faces[i].celebrity.confidence;
                      }

                      // 기본 파일 이름은 가장 신뢰도가 높은 인물로
                      var max_confidences = confidences[0];
                      var max_index = 0;
                      for(var i = 0; i < count; i++) {
                        if(max_confidences < confidences[i]) {
                          max_confidences = confidences[i];
                          max_index = i;
                        }
                      }
                      // 신뢰도가 최고값인 인물의 이름
                      filename = people[max_index];

                      // 가장 높은 신뢰도가 60%이하인 경우 인식 실패 알림
                      if(confidences[max_index] <= 0.6) {
                        var fail_confirm = confirm("인식 신뢰도가 낮아요.\n결과: " + people[max_index] + "(" + confidences[max_index] + ")\n이대로 저장하시겠어요?");

                        // 원본 이름으로 저장
                        if(!fail_confirm) { // 파일 이름 수정
                          filename = prompt("어떤 이름으로 저장할까요?", "");
                          if(filename == null) { // 공백을 입력하면 원본이름으로 저장
                            suggest({filename: item.filename});
                          }
                        }
                      }

                      // 사용자 설정
                      // 가장 신뢰도가 높은 인물로 저장하기

                      // 아닌 경우 선택할 수 있도록

                      // 최종 경로: .../download/인물이름/인물이름(n).xxx
                      suggest({filename:  filename + "/" + filename + file_type});
                    }

                }
                catch(exception){
                  var fail_confirm = confirm("인물 인식 처리 중 문제가 발생했어요. :(\n원본이름으로 저장할까요?");
                  // 원본 이름으로 저장
                  if(fail_confirm) {
                    suggest({filename: item.filename});
                  } else { // 파일 이름 수정
                    filename = prompt("어떤 이름으로 저장할까요?", "");
                    if(filename == null) { // 공백을 입력하면 원본이름으로 저장
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

//이미지의 url과 bytes를 인자로 넣어준다.
function bytesCheck(fileUrl, bytes) {
    /* 최근 순으로 bytes가 같고, 현재 존재하는 다운로드 아이템 5개를 가지고 온다.
    다운로드된 파일의 경로를 fileArray 배열에 담는다. */
    whale.downloads.search({
        orderBy: ['-startTime'],
        totalBytes: bytes,
        exists: true,
        limit: 5
    }, downloadedItems => {
        downloadedItems.forEach(item => {
            fileArray[i++] = item.filename;

            //다운로드 한 파일의 url과 기존 파일의 다운로드 url이 같다면 중복 가능성이 있으므로 treu값을 넘긴다.
            if(fileUrl == item.url)
                return true;
        });
    });

    //같은 바이트인 파일은 중복 가능성이 있으므로 ture값 넘긴다.
    if(fileArray.length!=0)

        return true;
    else
        return false;
}

//이미지 좌표의 rgb값 비교 메소드










// 최초 다운로드시에 true
whale.runtime.onInstalled.addListener(function (details) {
    whale.storage.sync.set({'toggle': true});
});

// toggle 버튼 변화되면 스토리지에 상태 저장
whale.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        if (key == "toggle") toggle = storageChange.newValue;
        console.log("toggle: " + toggle);
    }
});
