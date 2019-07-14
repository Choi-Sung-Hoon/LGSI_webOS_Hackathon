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
			"count": (x++ % latitudes.length)
		}
	}
	webSocket.send(JSON.stringify(message));
	output.innerHTML = "Sent message to server: <br>" + JSON.stringify(message, null, '\t').replace(/\n/g, '<br>') + "<br>";
}

var latitudes = [12.942068, 12.941716, 12.941654, 12.941391, 12.940960]
var longitudes = [77.597428, 77.597446, 77.597473, 77.597500, 77.597556]

// attach callback function to the event.
// This should be done before load
window.addEventListener("load", createWebSocket, false);