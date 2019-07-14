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
			"latitude": coordinationList[x][0],
			"longitude": coordinationList[x][1],
			"count": x++
		}
	}
	x = x % coordinationList.length;
	webSocket.send(JSON.stringify(message));
	output.innerHTML = "Sent message to server: <br>" + JSON.stringify(message, null, '\t').replace(/\n/g, '<br>') + "<br>";
}

var coordinationList =
[
	[12.933386, 77.611342], [12.933453, 77.611262], [12.933494, 77.611240],
	[12.933546, 77.611171], [12.933563, 77.611147], [12.933583, 77.611112],
	[12.933603, 77.611072], [12.933623, 77.611050], [12.933648, 77.611029],
	[12.933665, 77.610997], [12.933683, 77.610972], [12.933714, 77.610943],
	[12.933729, 77.610917], [12.933751, 77.610877], [12.933802, 77.610826],
	[12.933849, 77.610751], [12.933899, 77.610688], [12.933969, 77.610600],
	[12.934012, 77.610554], [12.934059, 77.610493], [12.934102, 77.610429],
	[12.934149, 77.610383], [12.934186, 77.610327], [12.934222, 77.610268],
	[12.934276, 77.610225], [12.934346, 77.610112], [12.934411, 77.610047],
	[12.934507, 77.609903], [12.934560, 77.609824], [12.934613, 77.609728],
	[12.934731, 77.609626], [12.934827, 77.609498], [12.934924, 77.609396],
	[12.935001, 77.609256], [12.935088, 77.609128], [12.935151, 77.609007],
	[12.935275, 77.608816], [12.935530, 77.608420], [12.935614, 77.608293],
	[12.935664, 77.608165], [12.935710, 77.608082], [12.935748, 77.607996],
	[12.935816, 77.607875], [12.935881, 77.607776], [12.936031, 77.607492],
	[12.936068, 77.607316], [12.936127, 77.607167], [12.936261, 77.606861],
	[12.936316, 77.606590], [12.936369, 77.606469], [12.936402, 77.606304],
	[12.936429, 77.606139], [12.936462, 77.605913], [12.936473, 77.605784]
]

// attach callback function to the event.
// This should be done before load
window.addEventListener("load", createWebSocket, false);