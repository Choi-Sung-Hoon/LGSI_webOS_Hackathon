LG Soft India webOS Hackathon
==========

README: [한국어](README.ko.md), [English](README.md)  

</br>

Project Goal
----------
The project goals are to develop an IoT device that can help ambulance driver ensure golden time and reduce traffic accident of ambulances by sending signals to normal drivers to secure rescue lane earlier than an ambulance approach.

</br>

Background
----------
Current ambulance traffic laws are focused on ‘how to reduce patient transport time’ with not missing the golden time.

For example, current existing solutions are to hire good qualified drivers or to impose high fine to lawbreakers.

However, these solutions cannot solve the fundamental problem to delay transferring patients via ambulance.

For example, in a sudden situation like an ambulance is rushing on the road, normal drivers may be embarrassed, with not moving aside to clear the lane for the ambulance to pass quickly or the drivers may not think that clearing the lane is not necessary.

This problem may result in another delay or accident.

</br>

System Architecture
----------

![System Architecture](https://user-images.githubusercontent.com/33472400/71403633-acc66880-2673-11ea-84b4-ce657d47eb7e.png)

</br>

Prerequisite
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

Installation
----------

### Client

1. Follow the instructions from **ares-package** to **ares-install** from [here](https://www.webosose.org/docs/tools/sdk/cli/cli-user-guide/#ares-generate). This will install webOS application into your Raspberry Pi device.

2. Move to the directory where this repository is cloned.  
  
    ```
    cd ~/Hackathon/LG
    ```

3. Update server information in **./raspbian.py**  
  
    ```python3
    serverIp = "xxx.xxx.xxx.xxx"
    serverPort = "9999"
    wsUri = "ws://" + serverIp + ":" + serverPort
    ```

4. Update server information in **./ambulanceApp/websocket.js**, **./ambulanceRaspbian/websocket.js**, **./smartCarApp/websocket.js** and **./smartCarRaspbian/websocket.js**  

    ```python3
    serverIp = "xxx.xxx.xxx.xxx"
    serverPort = "9999"
    wsUri = "ws://" + serverIp + ":" + serverPort

</br>

How To Use
----------

### Server

1. Move to the directory where this repository is cloned.  

    ```
    cd ~/Hackathon/LG
    ```

2. Run the server.  
  
    ```
    python server.py
    ```

### Client

1. Move to the directory where this repository is cloned.  

    ```
    cd ~/Hackathon/LG
    ```
2. Run **./raspbian.py** and then run webOS application on Raspberry Pi device.

    ```
    python raspbian.py
    ```

</br>

Demo Video
----------

[<img src="http://img.youtube.com/vi/dAUQOtzMZbk/0.jpg" width="600">](http://www.youtube.com/watch?v=dAUQOtzMZbk)
