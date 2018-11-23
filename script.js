var fileUrl = '';
var bytes = 0;
var fileArray = new Array();
var i =0;

bytesCheck('https://search.pstatic.net/common?type=a&size=120x150&quality=95&direct=true&src=http%3A%2F%2Fsstatic.naver.net%2Fpeople%2Fportrait%2F201810%2F2018102613430260-9986508.jpg', 8812);


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

            /*test code: 이미지를 바꿔봄*/
            var img = document.getElementById('img1');
            img.src=item.url;
            whale.sidebarAction.show();
            /*test code---------------*/

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
