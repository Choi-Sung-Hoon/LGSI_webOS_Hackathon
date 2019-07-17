import websocket
import thread
import time
import sys
import json
import gps
import requests

# local network : 192.168.43.138
# AWS : 13.233.212.10
serverIp = "13.233.212.10"
serverPort = "9999"
wsUri = "ws://" + serverIp + ":" + serverPort

deviceId = 1
deviceType = "raspbian"
deviceIp = ""

# gps data
session = gps.gps("localhost", "2947")
session.stream(gps.WATCH_ENABLE | gps.WATCH_NEWSTYLE)

def on_message(ws, message):
    parsed = json.loads(message)
    print("Message from server {0}".format(serverIp))
    print(json.dumps(parsed, indent=4, separators=(',', ':')))
    print("*****************************************")

    if parsed["method"] == "requestInformation":
        deviceIp = parsed["payload"]["deviceIp"]
        
        response = {
            "deviceIp": deviceIp,
            "method": "updateInformation",
            "payload":
            {
                "deviceId": deviceId,
                "deviceType": deviceType
            }
        }
        ws.send(json.dumps(response))
    
    def run(*args):
        count = 1
        while True:
            rep = session.next()
            try:
                if(rep["class"] == "TPV"):
                    response = {
                        "deviceIp": deviceIp,
                        "method": "updateLocation",
                        "payload":
                        {
                            "deviceId": deviceId,
                            "latitude": str(rep.lat),
                            "longitude": str(rep.lon),
                            "count": count
                        }
                    }
                    count += 1
                    ws.send(json.dumps(response))
                    print("Send coordinations to the server {0}".format(serverIp))
                    print(json.dumps(response, indent=4, separators=(',', ':')))
                    print("*****************************************")
                    time.sleep(1)
            except Exception as e:
                print("Error occured while getting GPS data: " + str(e))
        ws.close()
    thread.start_new_thread(run, ())

def on_error(ws, error):
    print (error)

def on_close(ws):
    print("### closed ###")

def on_open(ws):
    print("### open ###")

# websocket.enableTrace(True)
ws = websocket.WebSocketApp(wsUri,
        on_message = on_message,
        on_error = on_error,
        on_close = on_close)
on_open = on_open
ws.run_forever()