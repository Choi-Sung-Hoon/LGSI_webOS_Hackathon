// local network : 192.168.43.138
// AWS : 13.233.212.10
var serverIp = "172.16.6.104";
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
	// var output = document.getElementById("output");
	// output.innerHTML = "Message from server: <br>" + JSON.stringify(message, null, '\t').replace(/\n/g, '<br>') + "<br>";

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
				myMarker = createMarker(latitude, longitude);
			else
				moveMarker(myMarker, latitude, longitude);
			setMapPosition(myMap, new google.maps.LatLng(latitude, longitude));

			ambulanceList = message.payload.ambulanceList;
			if (ambulanceList.length != 0) //엠뷸런스 on 상태
			{
				if (ambulanceMarkers.length == 0) //만들어진 마커가 없다는 거니까
				{
					for (var i = 0; i < ambulanceList.length; i++)
					{
						marker = createMarker(parseFloat(ambulanceList[i].latitude), parseFloat(ambulanceList[i].longitude));
						marker.setIcon('ambulance.png');
						ambulanceMarkers.push(marker);
					}
				}
				else
				{
					for (var i = 0; i < ambulanceMarkers.length; i++)
						deleteMarker(ambulanceMarkers[i]);
					for (var i = 0; i < ambulanceList.length; i++)
					{
						marker = createMarker(parseFloat(ambulanceList[i].latitude), parseFloat(ambulanceList[i].longitude));
						marker.setIcon('ambulance.png');
						ambulanceMarkers.push(marker);
					}
				}
			}
			else
			{
				if (ambulanceMarkers.length != 0)
					for (var i = 0; i < ambulanceMarkers.length; i++)
						deleteMarker(ambulanceMarkers[i]);
			}
			break;
		}
		case "sendNotification":
		{
			distance = message.payload.distance;
			createToast("An ambulance is " + distance + "m away!\nPlease make a way!");
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