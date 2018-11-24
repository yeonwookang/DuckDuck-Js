$(function () {

    // 인물 여럿 감지시 알림 여부 (동기화)
    whale.storage.sync.get(['many'], function(result) {
        if(result.toggle){ $('#checkbox2[data-type=many]').click();}
    });

    // 체크박스 클릭 될 때
    $('#checkbox2[data-type=many]').on('click', function () {
        var checked = $('#checkbox2').is(":checked");
        if(checked) {
            whale.storage.sync.set({'many': true});
        }else {
            whale.storage.sync.set({'many': false});
        }
    });

});
