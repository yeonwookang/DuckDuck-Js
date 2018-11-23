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
              url: "http://localhost/whale/python/test.py", // 서버에 디플로이하고 변경할 부분 (http://localhost/whale/python/test.py) (http://ec2-52-79-137-54.ap-northeast-2.compute.amazonaws.com/duckduck/cfr_api.py)
              data: {img_url : url, file_type: file_type } // 원본 url, 확장자
            }).done(function( data ) {
                filename = data; // 인물이름 받기
                filename = filename.replace(/\s+/, "");//왼쪽 공백제거
                filename = filename.replace(/\s+$/g, "");//오른쪽 공백제거
                filename = filename.replace(/\n/g, "");//행바꿈제거
                filename = filename.replace(/\r/g, "");//엔터제거

                console.log("filename(script.js): " + filename);
              });
        }

        // 에러나는 경우 결과값 없음
        if(filename == "") {
          var fail_confirm = confirm("인물 사진이 아닌 것 같아요. :(\n원본이름으로 저장할까요?");
          // 원본 이름으로 저장
          if(fail_confirm) {
            suggest({filename: item.filename});
          } else { // 파일 이름 수정
            filename = prompt("어떤 이름으로 저장할까요?", item.filename);
            if(filename == null) { // 공백을 입력하면 원본이름으로 저장
              suggest({filename: item.filename});
            }
          }

        // 인물이지만 이름을 찾지 못한 경우
        } else if(filename == "unknown") {
          filename = prompt("인물 인식에 실패했어요. :(\n어떤 이름으로 저장할까요?", filename);
          if(filename == null) { // 공백을 입력하면 원본이름으로 저장
            suggest({filename: item.filename});
          }
        }

        // 최종 경로: .../download/인물이름/인물이름(n).xxx
        suggest({filename:  filename + "/" + filename + file_type});

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
