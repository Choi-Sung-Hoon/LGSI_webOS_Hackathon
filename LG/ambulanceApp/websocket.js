var serverIp = "192.168.43.138";
var serverPort = "9999";
var wsUri = "ws://" + serverIp + ":" + serverPort;

var deviceId = 2;			// this should be same with raspbian device,
var deviceType = "webos"	// but different from webos device
var deviceIp, deviceType, latitude, longitude;

var ambulanceList;

function createWebSocket()
{
	webSocket = new WebSocket(wsUri);
	if(webSocket)
	{
		// add event functions
		webSocket.onopen = function(event) { onOpen(event) };
		webSocket.onclose = function(event) { onClose(event) };
		webSocket.onmessage = function(event) { onMessage(event) };
		webSocket.onerror = function(event) { onError(event) };
	}
    initialize();
}

// when websocket opens
function onOpen(event)
{
	// var output = document.getElementById("output");
	// output.innerHTML += "<br>Successfully connected to " + wsUri + "<br>";
}

// when websocket closes
function onClose(event)
{
	// var output = document.getElementById("output");
	// output.innerHTML += "<br>Socket is successfully closed<br>";
}

function onError(event)
{
	// var output = document.getElementById("output");
	// output.innerHTML += "<br>Error ocurred!<br>";
}

// when a message is received from the server, parse it into JSON format output device_id and result on the screen
function onMessage(event)
{
	var message = JSON.parse(event.data);
	var output = document.getElementById("output");
	output.innerHTML = "Message from server: <br>" + JSON.stringify(message, null, '\t').replace(/\n/g, '<br>') + "<br>";

	switch(message.method)
	{
		case "requestInformation":
		{
			if(serverIp == message.payload.serverIp)
			{
				deviceIp = message.payload.deviceIp;
				// send device information back to server
				var message =
				{
					"deviceIp": deviceIp,
					"method": "updateInformation",
					"payload":
					{
						"deviceId": deviceId,
						"deviceType": deviceType
					}
				}
				webSocket.send(JSON.stringify(message));
				// output.innerHTML = "Sent message to server: <br>" + JSON.stringify(message, null, '\t').replace(/\n/g, '<br>') + "<br>";
			}
			break;
		}
		case "updateLocation":
		{
			latitude = parseFloat(message.payload.latitude);
			longitude = parseFloat(message.payload.longitude);
			
			if(myMarker == null)
			{
				setMapPosition(latitude, longitude);
				myMarker = createMarker(latitude, longitude);
			}
			else
				moveMarker(myMarker, latitude, longitude);

			ambulanceList = message.payload.ambulanceList;
			if (ambulanceList.length != 0) //엠뷸런스 on 상태
			{
				if (ambulanceMarkers.length == 0) //만들어진 마커가 없다는 거니까
				{
					for (var i = 0; i < ambulanceList.length; i++)
						ambulanceMarkers[i] = createMarker(parseFloat(ambulanceList[i].latitude), parseFloat(ambulanceList[i].longitude));
				}
				else if(ambulanceMarkers.length < ambulanceList.length)
				{
					for (var i = 0; i < ambulanceList.length; i++)
					{
						if(i < ambulanceMarkers.length)
							moveMarker(ambulanceMarkers[i], parseFloat(ambulanceList[i].latitude), parseFloat(ambulanceList[i].longitude));
						else
							ambulanceMarkers[i] = createMarker(parseFloat(ambulanceList[i].latitude), parseFloat(ambulanceList[i].longitude));
					}
				}
				else if(ambulanceMarkers.length == ambulanceList.length)
				{
					for (var i = 0; i < ambulanceList.length; i++)
						moveMarker(ambulanceMarkers[i], parseFloat(ambulanceList[i].latitude), parseFloat(ambulanceList[i].longitude));
				}
				else
				{
					for (var i = 0; i < ambulanceMarkers.length; i++)
					{
						if(!(ambulanceMarkers[i] in ambulanceList))
						{
							deleteMarker(ambulanceMarkers[i]);
							ambulanceMarkers.splice(i, 1);
						}
					}
				}
			}
			break;
		}
		case "sendNotification":
		{
			distance = message.payload.distance;
			createToast("An ambulance is " + distance + "m away! Please make a way!");
		}
	}
}

function ambulanceOn()
{
	var message = 
	{
		"deviceIp": deviceIp,
		"method": "ambulanceOn",
		"payload": { "deviceId": deviceId }
	}
	webSocket.send(JSON.stringify(message));
}

function ambulanceOff()
{
	var message = 
	{
		"deviceIp": deviceIp,
		"method": "ambulanceOff",
		"payload": { "deviceId": deviceId }
	}
	webSocket.send(JSON.stringify(message));
}

// attach callback function to the event.
// This should be done before load
window.addEventListener("load", createWebSocket, false);