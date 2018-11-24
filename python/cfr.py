#!/usr/bin/env python
# coding: utf-8
#-- coding: utf-8 --

# AWS에 올라가있는 코드

#import nltk # is not in Javascript
import os
import sys
import requests
import urllib.request
import json
import cgi
import time
from threading import Thread
import codecs
import cgi
import cgitb
cgitb.enable()
sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

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
print("content-type:text/html; charset=utf-8\r\n\n")

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
    print(result)

else:
    # 인물이 아니거나 호출이 제대로 되지 않은 경우에 에러코드
    print("Error Code:" + rescode)
