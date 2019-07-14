function createToast(message)
{
	webOS.service.request("luna://com.webos.notification", {
		method: "createToast",
		parameters: {
			"sourceId": "com.domain.app",
			"message": message,
			"iconUrl": "ambulance.png",
			"noaction": true
		},
		onSuccess: function(args) {},
		onFailure: function(args) {}
	});
}