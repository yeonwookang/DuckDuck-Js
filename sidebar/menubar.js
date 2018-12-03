$(document).ready(function() {
  var home_status = 'true';
  var history_status = 'false';
  var faq_status = 'false';

  $('#home_btn').on('click', function() {
    if(home_status === 'false') {
      home_status = 'true';
      history_status = 'false';
      faq_status = 'false';

      // 네비게이션 설정
      $(this).addClass('selected');
      $('#history_btn').removeClass('selected');
      $('#faq_btn').removeClass('selected');

      // inner 설정
      $('#home').removeClass('selected_v2');
      $('#history').addClass('selected_v2');
      $('#faq').addClass('selected_v2');
    }
    document.reload();
  });

  $('#history_btn').on('click', function() {
    if(history_status === 'false') {
      home_status = 'false';
      history_status = 'true';
      faq_status = 'false';

      // 네비게이션 설정
      $(this).addClass('selected');
      $('#home_btn').removeClass('selected');
      $('#faq_btn').removeClass('selected');

      // inner 설정
      $('#home').addClass('selected_v2');
      $('#history').removeClass('selected_v2');
      $('#faq').addClass('selected_v2');
    }

    document.reload();
  });
  $('#faq_btn').on('click', function() {
    if(faq_status === 'false') {
      home_status = 'false';
      history_status = 'false';
      faq_status = 'true';

        // 네비게이션 설정
      $(this).addClass('selected');
      $('#history_btn').removeClass('selected');
      $('#home_btn').removeClass('selected');

      // inner 설정
      $('#home').addClass('selected_v2');
      $('#history').addClass('selected_v2');
      $('#faq').removeClass('selected_v2');
    }
    document.reload();
  });
});
