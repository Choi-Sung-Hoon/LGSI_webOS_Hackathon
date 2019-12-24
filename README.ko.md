LG Soft India webOS Hackathon
==========

README: [한국어](README.ko.md), [English](README.md)  

</br>

프로젝트 목표
----------

프로젝트의 목표는 구급차가 접근하고 있다는 사전 알림을 통해 일반 운전자들이 통행하고 있는 차로를 비움으로써, 구급차 운전자들이 골든 타임을 확보하고, 구급차의 교통사고를 줄일 수 있도록 도와주는 IoT 장치를 개발하는 것입니다.  

</br>

배경
----------

현재 구급차 관련법은 골든 타임을 놓치지 않는 것과 동시에, '어떻게 환자 이송 시간을 줄일까'에 초점을 맞추고 있습니다.

예를 들어, 현재 해결책은 실력이 뛰어난 운전자를 고용하거나, 법을 어기는 사람들에게 높은 벌금을 부과하는 것입니다.

하지만, 이런 해결책들은 구급차로 환자를 이송시키는 시간을 지연시키는 근본적인 문제를 해결해주지 않습니다.

예를 들어, 구급차가 도로 위를 질주하는 긴급한 상황에서 일반 운전자들은 당황할 지도 모르며, 당황한 운전자들은 구급차가 빠르게 지나갈 수 있도록 차를 움직여 비켜주지 않거나, 차로를 비워주는 것이 필요하다고 생각하지 않을 수도 있습니다.

이러한 문제는 환자를 이송하는데 또 다른 지연이나 사고를 초래할 수 있습니다.

</br>

시스템 개요도
----------

![System Architecture](https://user-images.githubusercontent.com/33472400/71403633-acc66880-2673-11ea-84b4-ce657d47eb7e.png)

</br>

전제 조건
----------

### Client

- [webOS Open Source Edition](https://github.com/webosose/build-webos)  
- [webOS Open Source Edition CLI](https://www.webosose.org/docs/tools/sdk/cli/cli-user-guide/#installing-cli)  
- 2 of Raspberry Pi 3 Model B (one for GPS module, another one for webOS)  
- Raspberry Pi GPS Module  
- [python 3](https://www.python.org/downloads/)
- [Python 3 websocket_client module](https://pypi.org/project/websocket_client/)

### Server

- [Python 3](https://www.python.org/downloads/)  
- [Python 3 SimpleWebSocketServer module](https://github.com/dpallot/simple-websocket-server)  

</br>

설치
----------

### 클라이언트

1. [이 주소](https://www.webosose.org/docs/tools/sdk/cli/cli-user-guide/#ares-generate)로부터 **ares-package**부터 **ares-install**까지의 안내를 따르세요. 이 과정은 당신의 Raspberry Pi 기기에 webOS 애플리케이션을 설치할 것입니다.  

2. 이 레포지토리가 복제된 곳으로 이동하세요.  
  
    ```
    cd ~/Hackathon/LG
    ```

3. **./raspbian.py** 파일 속의 서버 정보를 업데이트 해주세요.  
  
    ```python3
    serverIp = "xxx.xxx.xxx.xxx"
    serverPort = "9999"
    wsUri = "ws://" + serverIp + ":" + serverPort
    ```

4. **./ambulanceApp/websocket.js**, **./ambulanceRaspbian/websocket.js**, **./smartCarApp/websocket.js** 그리고 **./smartCarRaspbian/websocket.js** 파일 속의 서버 정보를 업데이트 해주세요.  

    ```python3
    serverIp = "xxx.xxx.xxx.xxx"
    serverPort = "9999"
    wsUri = "ws://" + serverIp + ":" + serverPort

</br>

사용법
----------

### 서버

1. 이 레포지토리가 복제된 곳으로 이동하세요.  

    ```
    cd ~/Hackathon/LG
    ```

2. 서버를 실행해주세요.  
  
    ```
    python server.py
    ```

### Client

1. 이 레포지토리가 복제된 곳으로 이동하세요.  

    ```
    cd ~/Hackathon/LG
    ```
2. **./raspbian.py**을 실행하시고, Raspberry Pi 기기에서 webOS 애플리케이션을 실행해주세요.  

    ```
    python raspbian.py
    ```

</br>

데모 영상
----------

[<img src="http://img.youtube.com/vi/dAUQOtzMZbk/0.jpg" width="600">](http://www.youtube.com/watch?v=dAUQOtzMZbk)
