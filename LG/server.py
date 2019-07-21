from SimpleWebSocketServer import SimpleWebSocketServer, WebSocket
from math import sin, cos, sqrt, atan2, radians
import socket
import json
import re
import requests

debug = 0

class Device:
    def __init__(self, deviceId=0, deviceIp="", deviceType="normal", latitude=0.0, longitude=0.0):
        self.__deviceId = deviceId
        self.__deviceIp = deviceIp
        self.__deviceType = deviceType
        self.__latitude = latitude
        self.__longitude = longitude

    def setId(self, deviceId):
        self.__deviceId = deviceId
    
    def getId(self):
        return self.__deviceId

    def setIp(self, deviceIp):
        self.__deviceIp = deviceIp
    
    def getIp(self):
        return self.__deviceIp

    def setType(self, deviceType):
        self.__deviceType = deviceType
    
    def getType(self):
        return self.__deviceType

    def setLatitude(self, value):
        self.__latitude = value

    def getLatitude(self):
        return self.__latitude

    def setLongitude(self, value):
        self.__longitude = value

    def getLongitude(self):
        return self.__longitude


socketList = dict()
deviceList = list()
ambulanceList = list()
pattern = re.compile('\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}')
serverIp = socket.gethostbyname(socket.gethostname())
class socketHandler(WebSocket):
    # when a device is connected
    def handleConnected(self):
        # add device object to the list
        deviceIp = re.search(pattern, self.address[0]).group()
        if deviceIp not in socketList.keys():
            socketList[deviceIp] = self
            device = Device()
            device.setIp(deviceIp)
            deviceList.append(device)

        if debug:
            print("Device {0} connected.".format(deviceIp))
            print("*****************************************")

        # request device information
        message = {
            "method": "requestInformation",
            "payload":
            {
                "serverIp": serverIp,
                "deviceIp": deviceIp
            }
        }
        self.sendMessage(json.dumps(message))

    # when a connection is closed
    def handleClose(self):
        deviceIp = re.search(pattern, self.address[0]).group()
        print("Device {0} has disconnected.".format(deviceIp))
        print("*****************************************")
        # remove device object
        del socketList[deviceIp]

    # when a message is received from device
    def handleMessage(self):
        message = json.loads(self.data)
        deviceIp = message["deviceIp"]
        device = getDeviceByIp(deviceIp)

        if debug:
            print("Message from device {0}".format(deviceIp))
            print(json.dumps(message, indent=4, separators=(',', ':')))
            print("*****************************************")

        # update device information
        if message["method"] == "updateInformation":
            deviceId = message["payload"]["deviceId"]
            deviceType = message["payload"]["deviceType"]
            device.setId(deviceId)
            device.setType(deviceType)

        # update location to webos device from raspbian
        elif message["method"] == "updateLocation":
            deviceId = message["payload"]["deviceId"]
            latitude = message["payload"]["latitude"]
            longitude = message["payload"]["longitude"]
            # get webos device by id
            webos = getWebosById(deviceId)
            # create message
            message = {
                "method": "updateLocation",
                "payload":
                {
                    "latitude": latitude,
                    "longitude": longitude,
                    "ambulanceList": list(),
                    "count": message["payload"]["count"]
                }
            }
            # add all ambulances coordination
            for i, ambulance in enumerate(ambulanceList):
                if deviceId != ambulance.getId():
                    message["payload"]["ambulanceList"].append(dict())
                    message["payload"]["ambulanceList"][i]["latitude"] = ambulance.getLatitude()
                    message["payload"]["ambulanceList"][i]["longitude"] = ambulance.getLongitude()

            if webos is not None:
                # set location
                webos.setLatitude(latitude)
                webos.setLongitude(longitude)
                # find socket by webos ip and send a message
                socketList[webos.getIp()].sendMessage(json.dumps(message))
                if debug:
                    print("Send coordinations to the device {0}".format(webos.getIp()))
                    print(json.dumps(message, indent=4, separators=(',', ':')))
                    print("*****************************************")
                # calculate distance from all ambulances
                handleDistance()

        # add ambulance to the list
        elif message["method"] == "ambulanceOn":
            deviceId = message["payload"]["deviceId"]
            ambulance = getWebosById(deviceId)
            if ambulance not in ambulanceList:
                ambulanceList.append(ambulance)
                if debug:
                    print("An ambulance is added to the list")
                    print(json.dumps(message, indent=4, separators=(',', ':')))
                    print("*****************************************")

        # delete aubulance from the list
        elif message["method"] == "ambulanceOff":
            deviceId = message["payload"]["deviceId"]
            ambulance = getWebosById(deviceId)
            if ambulance in ambulanceList:
                ambulanceList.remove(ambulance)
                if debug:
                    print("An ambulance is deleted from the list")
                    print(json.dumps(message, indent=4, separators=(',', ':')))
                    print("*****************************************")

def getDeviceByIp(ip):
    for i, device in enumerate(deviceList):
        if deviceList[i].getIp() == ip:
            return deviceList[i]
    return None

def getWebosById(id):
    for i, device in enumerate(deviceList):
        if deviceList[i].getType() == "webos" and deviceList[i].getId() == id:
            return deviceList[i]
    return None

def handleDistance():
    for device in deviceList:
        # for webos devices
        if device.getType() == "webos":
            # if it's normal car
            if device not in ambulanceList:
                lat1 = float(device.getLatitude())
                lon1 = float(device.getLongitude())
                for ambulance in ambulanceList:
                    lat2 = float(ambulance.getLatitude())
                    lon2 = float(ambulance.getLongitude())
                    d = round(distance(lat1, lon1, lat2, lon2) * 1000)
                    # if ambulance is in 500m
                    if d < 500:
                        # create message
                        message = {
                            "method": "sendNotification",
                            "payload": {
                                "distance": d
                            }
                        }
                        # find socket by device ip and send notification
                        socketList[device.getIp()].sendMessage(json.dumps(message))
                        if debug:
                            print("Send notification to the device {0}".format(device.getIp()))
                            print(json.dumps(message, indent=4, separators=(',', ':')))
                            print("*****************************************")

# calculate distance based on GPS coordination
def distance(lat1, lon1, lat2, lon2):
    R = 6373.0
    dLongitude = radians(abs(lon2)) - radians(abs(lon1))
    dLatitude = radians(abs(lat2)) - radians(abs(lat1))
    a = sin(dLatitude / 2)**2 + cos(lat1) * cos(lat2) * sin(dLongitude / 2)**2
    c = 2 * atan2(sqrt(a), sqrt(1 - a))
    distance = R * c
    return distance


print("Start listening on " + serverIp + ":9999...")
server = SimpleWebSocketServer('',9999, socketHandler)
server.serveforever()