downloadHistory();


// 사이드바 아이콘 클릭시 sidebar.html 새로고침
document.addEventListener(`visibilitychange`, function() {
    location.reload();
});


// 다운로드 히스토리 
function downloadHistory () {
    var fileHistory = [];
    whale.downloads.search({
        orderBy: ['-startTime']
    }, downloadedItems => {
        var i=0;
        downloadedItems.forEach(item => {
            if(item.filename.length!=0) {                
                switch(item.mime) {
                    case 'image/gif':
                    case 'image/png':
                    case 'image/jpeg':
                    case 'image/bmp':
                    case 'image/webp':
                    case 'image/vnd.microsoft.icon':
                        var file_name = item.filename.split('\\');
                        var date = item.startTime.substring(0,10);
                        fileHistory[i] = [date,file_name[file_name.length-1],item.filename, item.url];
                        $('#historyTable > tbody:last').append('<tr><td>'+fileHistory[i][0]+'</td><td>'+fileHistory[i][1] +'</td><td>'+fileHistory[i++][2] +'</td></tr>');
                }
            }
        });
        $('#thumb_img').attr('src',fileHistory[0][3]);
        $('#date').html(fileHistory[0][0]);
        $('#filename').html(fileHistory[0][1]);
        $('#path').html(fileHistory[0][2]);
    });
}
