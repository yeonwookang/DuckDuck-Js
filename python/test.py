#!C:/Users/rk/Anaconda3/python.exe
#-*- coding: utf-8 -*-
#import nltk # is not in Javascript
import os
import sys
import requests
import urllib.request
import json
import cgi
import time
from threading import Thread

def get_image(image_url, image_type) :

    # 전달 받은 url로 임시 파일 다운로드 (속도가 다소 느린 문제)
    with urllib.request.urlopen(image_url) as url:
        with open("temp" + image_type, 'wb') as f:
            f.write(url.read())

# 이미지 url과 확장자를 전달 받음
param = cgi.FieldStorage()
image_url = param['img_url'].value
image_type = param['file_type'].value

t1 = Thread(target = get_image, args=(image_url, image_type))
t1.start()
t1.join()

# 페이지 인코딩
print("content-type:text/html; charset=euc-kr\n\n")

# CFR API 호출 값
client_id = "26DDSZNATQ1heWVfoHOS"
client_secret = "t7s2UAUBOF"
url = "https://openapi.naver.com/v1/vision/celebrity"  # 유명인 얼굴인식

#임시 이미지 열기
files = {'image': open("temp" + image_type, 'rb')}

# API를 호출해서 결과값 출력 json 형태
headers = {'X-Naver-Client-Id': client_id, 'X-Naver-Client-Secret': client_secret}
response = requests.post(url, files=files, headers=headers)
rescode = response.status_code
if (rescode == 200):

    result = response.text
    # 결과값을 json 객체로 변환
    j = json.loads(result)

    #count = len(j['faces']) # 찾은 인물의 수
    name = j['faces'][0]['celebrity']['value'] # 첫 번째 인물의 이름
    confidence = j['faces'][0]['celebrity']['confidence'] # 첫 번째 인물의 신뢰도

    # 신뢰도가 60%이상인 경우만 이름 반환 - 어떻게 신뢰도도 같이 반환할지?
    if(confidence >= 0.6) :
        print(name)
    else :
        print("unknown") # 인물 인식에 실패한 경우
else:
    # 인물이 아니거나 호출이 제대로 되지 않은 경우에 에러코드
    print("Error Code:" + rescode)
