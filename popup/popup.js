$(function () {
    whale.storage.sync.get(['toggle'], function(result) {
        if(result.toggle) $('.checkbox[data-type=toggle]').click();
    });


    $('.checkbox[data-type=toggle]').on('click', function () {
        var color = $('#lever').css('background-color');
        //alert(color);
        if(color!=='rgba(0, 0, 0, 0.38)') { //눌러지는 타이밍 기준 배경색이 회색이 아니면 
            whale.storage.sync.set({'toggle': false});
        }else {
            whale.storage.sync.set({'toggle': true});
        }
    });

});