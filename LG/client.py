import websocket
import thread
import time
import sys
import json

serverIp = "192.168.43.138"
serverPort = "9999"
wsUri = "ws://" + serverIp + ":" + serverPort

deviceId = 1
deviceType = "raspbian"
deviceIp = ""

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
            time.sleep(1)
            response = {
                "deviceIp": deviceIp,
                "method": "updateLocation",
                "payload":
                {
                    "deviceId": deviceId,
                    "latitude": "12.933507",
                    "longitude": "77.6046419",
                    "count": count
                }
            }
            count += 1
            ws.send(json.dumps(response))
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