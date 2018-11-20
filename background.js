var url; // 다운로드 url
var mime; // 파일 종류
var file_type; // 파일 종류 => 파일 확장자
var filename = "unknown"; // 인물 이름
var confidence = 0.0; // 신뢰도
var toggle = false; // 토글 버튼 초기 상태

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

// 다운로드 클릭시
whale.downloads.onCreated.addListener(evt => {
    // alert('다운로드가 시작되었습니다.');

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

});


// 파일 경로 및 이름 지정
whale.downloads.onDeterminingFilename.addListener(function(item, suggest) {
  // 켜져있을 때만
   if(toggle) {
	   	//alert(mime);

	    switch(mime) {
	    	//이미지: image/gif, image/png, image/jpeg, image/bmp, image/webp, image/vnd.microsoft.icon
	    	// CFR API에서 이미지 포멧에 제약은 없으나 gif의 경우 첫프레임 기준으로 판별
	    	// 이미지인 경우에만 API 호출
	    	case 'image/gif':
	    	case 'image/png':
	    	case 'image/jpeg':
	    	case 'image/bmp':
	    	case 'image/webp':
	    	case 'image/vnd.microsoft.icon':

	    	// person 변수에 인물값 저장, confidence에 정확도 저장
	    	// CFR API 호출
	    	confidence = 0.00; // 정확도
	    	// 인물을 찾은 경우
	    	if(confidence >= 80.0) {

	    		// 파일이름을 인물로

	    	} else { // 인물을 찾지 못한 경우

		    	// 'unknown' 폴더에 'unknown'이라는 이름으로 이미지 저장
		    	filename = "unknown";
	    	}

	    	// alert('이미지 파일입니다.');
	    	// 저장방식: downlonad/인물이름/인물이름.jpg
			  suggest({filename:  filename + "/" + filename + file_type});
	    	break;

	    	default: // 이미지 파일이 아닌 경우
	    	//alert('기타 파일입니다.');
	    	//alert(item.filename);
	    	suggest({filename: item.filename}); // 원본 이름
	    	break;
	    }

   } else { // 서비스가 꺼져있는 경우
   		//alert(item.filename);
	    suggest({filename: item.filename}); // 원본 이름
   }
});
