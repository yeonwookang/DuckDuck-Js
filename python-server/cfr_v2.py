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
import cv2
from PIL import Image, ImageDraw, ImageFont #dynamic import
cgitb.enable()
sys.stdout = codecs.getwriter("utf-8")(sys.stdout.detach())

# 이미지를 url로부터 저장하는 함수
def get_image(image_url, image_type) :
    # 전달 받은 url로 임시 파일 다운로드 (속도가 다소 느린 문제)
    with urllib.request.urlopen(image_url) as url:
        with open("temp" + image_type, 'wb') as f:
            f.write(url.read())

# 이미지 리사이즈 함수 (파일 이름을 매개 변수로 받음) - 가로폭 500으로 비율 맞춰서 줄임
def imgResize (file_name):
    img = cv2.imread(file_name, 1)  # 원본 이미지

    # 이미지 크기
    #print(img.shape[1])  # 가로
    #print(img.shape[0])  # 세로

    # 가로 폭이 500 보다 긴 경우에만 줄여줌
    if img.shape[1] > 500 :
            # 이미지 축소
            ratio = 500.0 / img.shape[1]  # 가로 세로 비율 맞추기 위해,
            ddim = (500, int(img.shape[0] * ratio))  # 가로, 세로
            resize = cv2.resize(img, ddim, interpolation=cv2.INTER_AREA)
            resized = cv2.bilateralFilter(resize, 9, 41, 41)

            #print("-- resized --")
            #print(resized.shape[1])
            #print(resized.shape[0])

            # 다시 저장
            cv2.imwrite(file_name, resized)

    else :
        print("이미지 축소 실패 (가로폭이 너무 좁음)")


# 이미지 url과 확장자를 전달 받음
param = cgi.FieldStorage()
image_url = param['img_url'].value
image_type = param['file_type'].value

t1 = Thread(target = get_image, args=(image_url, image_type))
t1.start()
t1.join()

# 이미지 용량이 2MB 넘는지 확인
file_name = "temp" + image_type # 파일 이름
n = os.path.getsize(file_name)  # 이미지의 용량
#print("원본 용량")
#print(n)

# 용량이 2MB 이상이면 크기 줄이기 (gif가 아닌 경우는 크기를 줄이고, gif이면 저장 확장자를 바꾼다)
if n > 2000000 :
    if image_type != ".gif" :
        imgResize(file_name)
        #print("줄인 용량")
        #print(n2)
    else :
        img = Image.open("temp.gif")
        img.save("temp.png",'png', optimize=True, quality=70)


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
    print(rescode)
