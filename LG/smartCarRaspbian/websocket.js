var serverIp = "13.233.212.10";
var serverPort = "9999";
var wsUri = "ws://" + serverIp + ":" + serverPort;

var deviceId = 1;			// this should be same with raspbian device,
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
function sendResponses()
{
	var message =
	{
		"deviceIp": deviceIp,
		"method": "updateLocation",
		"payload":
		{
			"deviceId": deviceId,
			// intersection
			"latitude": "12.936969",
			"longitude": "77.601741",
			"count": x++
		}
	}
	webSocket.send(JSON.stringify(message));
	output.innerHTML = "Sent message to server: <br>" + JSON.stringify(message, null, '\t').replace(/\n/g, '<br>') + "<br>";
}

// attach callback function to the event.
// This should be done before load
window.addEventListener("load", createWebSocket, false);