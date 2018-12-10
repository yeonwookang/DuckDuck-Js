# 어덕편덕
> 연예인 사진 자동 분류 웨일 확장앱

   *"어차피 하는 덕질 편하게 덕질하세요!"*

   [어덕편덕](https://store.whale.naver.com/detail/bghcbobamgkjbcpjdlcfmdkjeaahnoah)은 [Naver Clova Face Recognition API](https://developers.naver.com/docs/clova/api/CFR/API_Guide.md#Overview)를 이용해 유명인 사진 다운로드 시 얼굴을 인식하여 파일명을 추천해주고 자동으로 인물별 폴더를 생성해줍니다.

   또한, 기존 사진과 중복되는 사진을 저장하는 경우 알려주는 확장앱입니다.

   [웨일 브라우저](https://whale.naver.com/ko/)와 어덕편덕을 설치하고 좋아하는 연예인 사진 정리에 소요되는 시간을 아껴보세요!

   이제 편하게 덕질합시다 : )
   
   
   ### 주요 기능
   1. 인물 사진 자동 분류
   2. 사진 중복 저장 방지
   3. 최근 다운로드 받은 사진 확인
   4. 다운로드 내역 확인





--------------------------------------------------------------------------------------





# 어떻게 만들어졌나요?
>  어덕편덕은 이런 이유에서 이러한 방식으로 만들어졌어요!
    
  ### Pain points
 "전에 진짜 예쁘게 나온 울 쯔뭉이 사진 어디 저장했는지 못찾겠어요...ㅠㅠㅠㅠㅠㅠ" - 트와이스 덕후 직장인 OO씨<br>
 "하... 그날 아이린 음방 짤 너무 아름다워서 나도 모르게 32894729857번 저장했다... " - 레드벨벳 덕후 대학생 OO씨<br>
    
  웹 서핑을 하면서 좋아하는 연예인 사진을 저장하다 보면 일관적이지 못한 파일 이름과 저장경로 때문에 찾아 헤매는 일이 자주 있었습니다.<br>
  그리고 무아지경 상태로 연예인 사진을 저장하다 보면 이미 같은 파일을 다운로드한 적이 있는지 모르고 불필요하게 중복 저장해서 드라이브 용량만 낭비하기도 했었죠. <br>
  그래서 어덕편덕팀은 고민했습니다. '내가 좋아하는 연예인 사진을 좀 더 효율적으로 관리할 방법이 없을까...?'<br><br>

### 문제 해결 과정 
  1. CFR API 호출을 위한 서버의 필요성
  - Clova CFR API 호출을 위해서는 서버 구축이 필요했습니다. 그래서 AWS 서버를 구축하고 Ajax 통신으로 클라이언트 측에서 다운로드 url과 파일 확장자를 전달 받아 CFR API를 호출해 결과를 다시 클라이언트 측에 json파일로 반환하는 Python 모듈을 만들었습니다. 간단한 시스템 설계도는 아래의 이미지를 참고해주세요!<br><br>
  <img src="https://github.com/yeonwookang/DuckDuck-Js/blob/master/sidebar/src/img/intro/arch.png?raw=true" width="70%"></img><br><br>


  2. 신뢰도가 떨어져 결과가 의심되는 경우
  - CFR API의 특성상 모든 인물에 대해 분석 결과를 반환하지만, 그 신뢰도가 낮은 경우에는 인물과 결과가 일치하지 않는 경우가 빈번했습니다. 분석 결과가 신뢰도가 60% 미만인 경우 사용자의 피드백을 받아 파일 이름을 직접 입력하거나 그대로 저장할 수 있도록 처리했습니다. 

  3. 인물이 여러명 인식되는 경우 
  - 가장 처리가 까다로운 부분이였습니다. 같은 그룹 내의 인물들이더라도 사용자마다 가장 좋아하는 멤버가 다른점을 고려했을 때 획일적인 기준으로 저장하는 것은 적절하지 않은 방법이라고 판단했습니다. 대신 인식 신뢰도가 가장 높은 것부터 차례대로 나열하여 사용자로부터 직접 파일 이름을 입력받을 수 있는 대화상자로 처리했습니다.
    
   
----------------------------------------------------------------------------------------------------
   
   
   
# 어떻게 사용하나요?
> 이대로만 따라 해주세요!
  1. 웨일 스토어에서 어덕편덕을 다운로드 받으면 사이드바에 덕덕이 아이콘이 나타납니다. <br>
   <img src="https://github.com/yeonwookang/DuckDuck-Js/blob/master/sidebar/src/img/intro/1.PNG?raw=true"></img>
   <br><br>
  2. 사이드바 영역에서는 각종 설정, 최근에 다운로드 받은 이미지의 정보 및 이전 다운로드 내역을 확인할 수 있습니다. (단축키 Alt+A) <br>
   <img src="https://github.com/yeonwookang/DuckDuck-Js/blob/master/sidebar/src/img/intro/2.PNG?raw=true" width="30%"></img>
   <br><br>

  3. 사이드바 영역의 왼쪽 상단에 있는 스위치로 서비스를 키고 끌 수 있습니다. (단축키 Alt+S) <br>
   <img src="https://github.com/yeonwookang/DuckDuck-Js/blob/master/sidebar/src/img/intro/3.PNG?raw=true"></img>
   <br><br>

  4. 웹에서 저장할 인물 이미지에 마우스 오른쪽을 클릭하고 이미지 저장하기를 클릭합니다. <br>
   <img src="https://github.com/yeonwookang/DuckDuck-Js/blob/master/sidebar/src/img/intro/4(2).png?raw=true" width="30%"></img>
   <br><br>

  5. 덕덕이가 열심히 이미지를 분석합니다! <br>
    소요 시간은 평균 5초 정도이나 이미지 크기와 네트워크 상태에 따라 조금씩 달라집니다. <br>
   <img src="https://github.com/yeonwookang/DuckDuck-Js/blob/master/sidebar/src/img/intro/5.PNG?raw=true"></img>
   <br><br>
  
  6. 팝업으로 분석 결과를 보여줍니다.<br>
   <img src="https://github.com/yeonwookang/DuckDuck-Js/blob/master/sidebar/src/img/intro/6-1.PNG?raw=true" width="30%"></img><br>
   <img src="https://github.com/yeonwookang/DuckDuck-Js/blob/master/sidebar/src/img/intro/6-2.PNG?raw=true" width="30%"></img><br>
   <br><br>

  7. 덕덕이가 분석한 인물 신뢰도가 60% 이상인 경우 사용자 컴퓨터의 Download-인물이름 경로로 바로 저장됩니다.<br>
     이미지를 분석한 결과 신뢰도가 60% 이하인 경우 사용자가 직접 파일 이름을 입력할 수 있습니다.<br>
   <img src="https://github.com/yeonwookang/DuckDuck-Js/blob/master/sidebar/src/img/intro/7-1.PNG?raw=true" width="30%"></img><br>
   <img src="https://github.com/yeonwookang/DuckDuck-Js/blob/master/sidebar/src/img/intro/7-2.PNG?raw=true" width="30%"></img><br>
   <br><br>

  8. 인물 여러명 인식시 알림이 켜져 있는 경우, 2명 이상 인식 되면 사용자가 직접 파일 이름을 입력할 수 있습니다. <br>
   (해제된 경우에는 신뢰도가 가장 높은 인물을 기준으로 저장합니다.)<br>
   <img src="https://github.com/yeonwookang/DuckDuck-Js/blob/master/sidebar/src/img/intro/8-1.PNG?raw=true" width="30%"></img><br>
   <img src="https://github.com/yeonwookang/DuckDuck-Js/blob/master/sidebar/src/img/intro/8-2.PNG?raw=true" width="30%"></img><br>
   <br><br>

  9. 중복된 이미지를 저장하는 경우 사용자에게 알려줍니다. <br>
   <img src="https://github.com/yeonwookang/DuckDuck-Js/blob/master/sidebar/src/img/intro/9.png?raw=true" width="30%"></img><br>
   <br><br> 
   
  10. 기타 문의 사항이나 오류는 자주 묻는 질문을 참고해주세요.




--------------------------------------------------------------------------------------





# 자주 묻는 질문 (FAQ)
> 사용 방법을 확인했지만 충분하지 않은 경우 FAQ를 확인해주세요.
#### Q. 인물 분석 서비스가 작동하지 않아요.
먼저 서비스 서비스가 켜져있는지 확인하고, 꺼져 있는 경우 사이드바 영역 왼쪽 상단의 스위치를 켭니다. (단축키 Alt+S)

또는 이미지에서 마우스 오른쪽 클릭 후 기존의 '이미지 저장'이나 '다른 이름으로 저장'을 클릭하는 경우에는 서비스가 작동하지 않습니다. 대신,  이미지 저장하기를 클릭해주세요.

#### Q. 계속 '인물 인식 처리 중 문제가 발생했어요.' 창이 나타나요.

어덕편덕은 이미지의 용랑이 2MB 미만인 경우 가장 정확하게 작동합니다. 이미지 용량이 2MB 이상인 경우 이미지 크기를 줄여서 분석하기 때문에 신뢰도가 다소 낮아집니다. 

일명 움짤인 GIF 파일도 지원하나, 이경우 첫 프레임을 기준으로 인식하기에 신뢰도가 떨어집니다.

#### Q. 인물이 다른 이름으로 저장돼요.
어덕편덕은 네이버 Clova Face Recognition API로부터 분석 결과를 받아옵니다. 인물 이미지의 분석 결과는 이미지 저장시 팝업으로 확인하실 수 있습니다. 인물의 검색 빈도가 다소 낮은 경우 분석 결과가 정확하지 않을 수 있습니다.

#### Q. 계속 '서버와의 통신에 실패했습니다.' 창이 나타나요.
네트워크 상태가 불안정한 경우 인물 이미지 처리가 원할하지 않을 수 있습니다. 네트워크 상태를 확인해주세요. 네트워크 상태가 안정적이지만 해당 경고창이 지속적으로 나타난다면, 개발자 이메일로 문의주세요.

#### Q. 제가 다운로드 받은 사진이 서버에 저장되나요?
인물 인식 처리를 위해 임시 파일로 서버에 저장되지만, 주기적으로 임시 파일을 삭제하고 있으며 그외의 기록은 남기지 않습니다.

#### Q. 사진을 다른 위치에 저장하고 싶어요.
웨일 브라우저의 설정 - 다운로드와 캡처 - 위치에서 다운로드 위치를 변경할 수 있습니다.

#### Q. 특정 사이트에 있는 사진이 저장 안되요.
안타깝게도 어덕편덕은 기술적인 문제로 나무위키 및 일부 커뮤니티 사이트에서 지원이 안됩니다. 더 많은 사이트의 이미지를 편리하게 다운받을 수 있도록 더욱 더 노력할게요.





--------------------------------------------------------------------------------------




# 한계점
> 개선할 수 있도록 열심히 노력할게요!
* 어덕편덕은 Naver Clova Face Recognition API로부터 인물 분석 결과값을 받아옵니다. 종종 인물의 검색 빈도가 낮은 경우 분석 신뢰도의 정확도가 떨어지는 경우가 있습니다. 현재로서는 인물 신뢰도가 일정 수치 이하인 경우 사용자가 직접 이름을 입력할 수 있도록 처리하고 있습니다. 더 나은 해결 방안을 모색하도록 열심히 노력하겠습니다.

* 나무위키, 개드립닷컴 등 일부 커뮤니티 사이트에서 기능이 작동하지 않고 "서버와의 통신에 실패했습니다."라는 경고창이 뜹니다. 해당 사이트에서 보안상의 이유로 이미지 수집을 차단한 경우 어덕편덕 서버측에서 이미지를 저장하지 못하는 문제가 있습니다. 빠른 시일 내로 해결하도록 노력하겠습니다.
