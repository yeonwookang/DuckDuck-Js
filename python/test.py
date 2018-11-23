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

    # 전달 받은 url로 임시 파일 다운로드
    with urllib.request.urlopen(image_url) as url:
        with open("temp" + image_type, 'wb') as f:
            f.write(url.read())

# 이미지 url과 확장자를 전달 받는다.
param = cgi.FieldStorage()
image_url = param['img_url'].value
image_type = param['file_type'].value

#image_url = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/Suzy_at_a_fansigning_event%2C_31_January_2017_01.jpg/250px-Suzy_at_a_fansigning_event%2C_31_January_2017_01.jpg"
#image_type = ".jpg"

t1 = Thread(target = get_image, args=(image_url, image_type))
t1.start()
t1.join()

# 페이지 인코딩
print("content-type:text/html; charset=euc-kr\n\n")
#print("image_url: " + image_url)
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
    #print(result)

    # 결과값을 json 객체로 변환
    j = json.loads(result)

    # 인식한 유명인의 숫자
    #count = len(j['faces'])
    name = j['faces'][0]['celebrity']['value']
    confidence = j['faces'][0]['celebrity']['confidence']
    if(confidence >= 0.6) :
        print(name)
    else :
        print("unknown")
else:
    print("Error Code:" + rescode)
