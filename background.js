var url; // 다운로드 url
var mime; // 파일 종류
var file_type = ""; // 파일 종류 => 파일 확장자
var filename = ""; // 인물 이름
var toggle = false; // 토글 버튼 초기 상태

// 다운로드 클릭시
whale.downloads.onCreated.addListener(evt => {
  // 켜져있을 때만
  if(toggle) {
        // download url 가져오기
        url = evt.url;
        mime = evt.mime; //mime

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

      if(file_type) {
        // CFR API 호출
        $.post( "http://localhost/whale/python/test.py", {
            img_url : url, // 이미지 url
            file_type: file_type},
            function(data, status){
                  filename = data;
                  filename = filename.replace(/\s+/, "");//왼쪽 공백제거
                  filename = filename.replace(/\s+$/g, "");//오른쪽 공백제거
                  filename = filename.replace(/\n/g, "");//행바꿈제거
                  filename = filename.replace(/\r/g, "");//엔터제거
                }

          );
      }

    }
});

// 파일 경로 및 이름 지정
whale.downloads.onDeterminingFilename.addListener(function(item, suggest) {
  // 켜져있을 때만
   if(toggle) {
	    switch(mime) {
	    	case 'image/gif':
	    	case 'image/png':
	    	case 'image/jpeg':
	    	case 'image/bmp':
	    	case 'image/webp':
	    	case 'image/vnd.microsoft.icon':

			  suggest({filename:  filename + "/" + filename + file_type});
	    	break;

	    	default:break;
	    }
   }
});

// 다운로드시에 false
whale.runtime.onInstalled.addListener(function (details) {
    whale.storage.sync.set({'toggle': false});
});

// toggle 버튼 변화되면 스토리지에 상태 저장
whale.storage.onChanged.addListener(function (changes, namespace) {
    for (key in changes) {
        var storageChange = changes[key];
        if (key == "toggle") toggle = storageChange.newValue;
        console.log("toggle: " + toggle);
    }
});
