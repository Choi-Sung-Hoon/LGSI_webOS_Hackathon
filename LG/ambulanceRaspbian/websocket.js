var serverIp = "192.168.43.138";
var serverPort = "9999";
var wsUri = "ws://" + serverIp + ":" + serverPort;

var deviceId = 2;			// this should be same with raspbian device,
var deviceType = "raspbian"	// but different from webos device
var deviceIp, deviceType, latitude, longitude;

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
}

// when websocket opens
function onOpen(event)
{
	var output = document.getElementById("output");
	output.innerHTML += "<br>Successfully connected to " + wsUri + "<br>";
}

// when websocket closes
function onClose(event)
{
	if(interval)
	{
		clearInterval(interval);
		interval = undefined;
	}
	var output = document.getElementById("output");
	output.innerHTML += "<br>Socket is successfully closed<br>";
}

function onError(event)
{
	if(interval)
	{
		clearInterval(interval);
		interval = undefined;
	}
	var output = document.getElementById("output");
	output.innerHTML += "<br>Error ocurred!<br>";
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
				output.innerHTML = "Sent message to server: <br>" + JSON.stringify(message, null, '\t').replace(/\n/g, '<br>') + "<br>";
				createInterval();
			}
			break;
		}
	}
}

var interval;
function createInterval()
{
	if(interval)
		return;
	
	// send response to the server at every second
	interval = setInterval(sendResponses, 1000);
}

var x = 1;
// forum mall coordination
function sendResponses()
{
	var message =
	{
		"deviceIp": deviceIp,
		"method": "updateLocation",
		"payload":
		{
			"deviceId": deviceId,
			"latitude": latitudes[x],
			"longitude": longitudes[x],
			"count": x
		}
	}
	x = x % latitudes.length;
	webSocket.send(JSON.stringify(message));
	output.innerHTML = "Sent message to server: <br>" + JSON.stringify(message, null, '\t').replace(/\n/g, '<br>') + "<br>";
}

var latitudes = [12.942068, 12.941716, 12.941654, 12.941391, 12.940960,
				12.940079, 12.939881, 12.939588, 12.939295, 12.938971,
				12.938794, 12.938616, 12.938417, 12.938166, 12.937936,
				12.937717, 12.937633, 12.937518, 12.937434, 12.937392,
				12.937350, 12.937225, 12.937040, 12.936990, 12.936928,
				12.936866, 12.936766];
var longitudes = [77.597428, 77.597446, 77.597473, 77.597500, 77.597556,
				77.597593, 77.597636, 77.597829, 77.597936, 77.598097,
				77.598237, 77.598344, 77.598516, 77.598698, 77.598966,
				77.599267, 77.599514, 77.599750, 77.600039, 77.600060,
				77.600543, 77.600919, 77.601833, 77.602534, 77.603096,
				77.603504, 77.603861];

// attach callback function to the event.
// This should be done before load
window.addEventListener("load", createWebSocket, false);