// aws : 13.233.212.10
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
	[12.866171, 77.436511], [12.865960, 77.436330], [12.865767, 77.436151],
	[12.865665, 77.436044], [12.865455, 77.435864], [12.865255, 77.435664],
	[12.865109, 77.435513], [12.865020, 77.435420], [12.864916, 77.435324],
	[12.864811, 77.435230], [12.864760, 77.435172], [12.864702, 77.435129],
	[12.864666, 77.435085], [12.864600, 77.435030], [12.864545, 77.434969],
	[12.864473, 77.434913], [12.864402, 77.434849], [12.864337, 77.434781],
	[12.864282, 77.434729], [12.864275, 77.434724], [12.864219, 77.434671],
	[12.864146, 77.434603], [12.864077, 77.434543], [12.864006, 77.434473],
	[12.863943, 77.434418], [12.863906, 77.434432], [12.863875, 77.434512],
	[12.863849, 77.434594], [12.863810, 77.434735], [12.863779, 77.434819],
	[12.863757, 77.434905], [12.863724, 77.435003], [12.863692, 77.435099],
	[12.863664, 77.435187], [12.863635, 77.435285], [12.863605, 77.435386],
	[12.863569, 77.435507], [12.863539, 77.435610], [12.863493, 77.435744],
	[12.863461, 77.435860], [12.863421, 77.435986], [12.863381, 77.436103],
	[12.863349, 77.436213], [12.863312, 77.436320], [12.863260, 77.436429],
	[12.863207, 77.436581], [12.863136, 77.436742], [12.863073, 77.436924],
	[12.863002, 77.437074], [12.862941, 77.437227], [12.862846, 77.437393],
	[12.862710, 77.437507], [12.862621, 77.437699], [12.862605, 77.437744],
	[12.862527, 77.437891], [12.862440, 77.438095], [12.862378, 77.438242],
]

// attach callback function to the event.
// This should be done before load
window.addEventListener("load", createWebSocket, false);