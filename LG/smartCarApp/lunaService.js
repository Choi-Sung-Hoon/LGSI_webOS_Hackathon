    var arduinoAddress = "";
    var channelID= "";
    var adapterAddress ="";


    function createToast(message) {
        var responseTag = document.querySelector("#response");
        var request = webOS.service.request("luna://com.webos.notification", {
            method: "createToast",
            parameters: {
                "sourceId": "com.domain.app",
                "message": message,
                "iconUrl": "ambulance.png"
            },

            onSuccess: function(args) {
                responseTag.innerHTML += "<li> createToast returnValue:" + args.returnValue + "</li>";
                responseTag.innerHTML += "<li> createToast toastId:" + args.subscribed + "</li>";
            },
            onFailure: function(args) {
                responseTag.innerHTML += "<li> createToast() errorText :" + args.errorText + "</li>";
            }
        });
    }


    function adapter_startDiscovery() //주변 디바이스 스캔
    {
        var responseTag = document.querySelector("#response");
        var request = webOS.service.request("luna://com.webos.service.bluetooth2", {
            method: "adapter/startDiscovery",
            parameters: {},

            onSuccess: function(args) {
                responseTag.innerHTML += "<li> adapter/startDiscovery returnValue:" + args.returnValue + "</li>";
                responseTag.innerHTML += "<li> adapter/startDiscovery adapterAddress:" + args.adapterAddress + "</li>";
                adapterAddress = args.adapterAddress;
            },
            onFailure: function(args) {
                responseTag.innerHTML += "<li> adapter/startDiscovery errorText :" + args.errorText + "</li>";

            }
        });
        device_getStatus();
        //adapter_pair();
    }

    function adapter_cancelDiscovery() //주변 디바이스 스캔
    {
        var responseTag = document.querySelector("#response");
        var request = webOS.service.request("luna://com.webos.service.bluetooth2", {
            method: "adapter/cancelDiscovery",
            parameters: {},

            onSuccess: function(args) {
                responseTag.innerHTML += "<li> adapter/cancelDiscovery returnValue:" + args.returnValue + "</li>";
                responseTag.innerHTML += "<li> adapter/cancelDiscovery adapterAddress:" + args.adapterAddress + "</li>";
            },
            onFailure: function(args) {
                responseTag.innerHTML += "<li> adapter_cancelDiscovery errorText :" + args.errorText + "</li>";

            }
        });
        device_getStatus();
        //adapter_pair();
    }

    function device_getStatus() //디바이스 리스트 주소 확인
    {
        var responseTag = document.querySelector("#slist");
        var responseTag2 = document.querySelector("#response");
        var request = webOS.service.request("luna://com.webos.service.bluetooth2", {
            method: "device/getStatus",
            parameters: {},

            onSuccess: function(args) {
                responseTag2.innerHTML += "<li> device/getStatus returnValue:" + args.returnValue + "</li>";
                responseTag2.innerHTML += "<li> device/getStatus subscribed:" + args.subscribed + "</li>";
                responseTag2.innerHTML += "<li> device/getStatus adapterAddress:" + args.adapterAddress + "</li>";
                
/* **parsing code (test success) -- don't remove
                var devicesData = JSON.stringify(args.devices); //json array
                var jsonData = JSON.parse(devicesData);
                for (var i = 0; i < jsonData.length; i++) {
                    var counter = jsonData[i]; //counter.속성명 하면 parsing 되는 상태
                    responseTag.innerHTML += "<li> <ul> <li> address : " + counter.address + "</li>" 
                    + "<li> name : " + counter.name + "</li>" + "</ul> </li>";
                }
*/

                var devicesData = JSON.stringify(args.devices); 
                var jsonData = JSON.parse(devicesData);
                for (var i = 0; i < jsonData.length; i++) {
                    var counter = jsonData[i]; 
                    if(counter.name == "sendGPS")
                    {
                        arduinoAddress = args.address;
                        responseTag.innerHTML += "<li> <ul> " +
                        "<li> address : " + counter.address + "</li>" +
                        "<li> name : " + counter.name + "</li>" + 
                         "<li> classOfDevice : " + counter.classOfDevice + "</li>" +
                          "<li> typeOfDevice : " + counter.typeOfDevice + "</li>" +
                        "<li> serviceClasses : " + counter.serviceClasses + "</li>" + 
                        "<li> pairing : " + counter.pairing + "</li>" + 
                        "<li> paired : " + counter.paired + "</li>" + 
                         "<li> adapterAddress : " + counter.adapterAddress + "</li>" + 
                        "<li> connectedProfiles : " + counter.connectedProfiles + "</li>" + 
                        "<li> trusted : " + counter.trusted + "</li>" + 
                        "<li> blocked : " + counter.blocked + "</li>" + 
                        "<li> rssi : " + counter.rssi + "</li>" + 
                        "<li> txPowe : " + counter.txPowe + "</li>" + 
                        "</ul> </li>";
                    }
                }
            },
            onFailure: function(args) {
                responseTag2.innerHTML += "<li> device/getStatus errorText :" + args.errorText + "</li>";
            }
        });
    }

    function adapter_pair() 
    {
        var responseTag = document.querySelector("#response");
        var request = webOS.service.request("luna://com.webos.service.bluetooth2", {
            method: "adapter/pair",
            parameters: {
                address : "98:d3:51:f9:34:47",
                subscribe : true,
                adapterAddress : adapterAddress

            },

            onSuccess: function(args) {
                responseTag.innerHTML += "<li> adapter/pair returnValue:" + args.returnValue + "</li>";
                responseTag.innerHTML += "<li> adapter/pair subscription returns: request message:" + args.request + "</li>";
              //  createToast("pairt to bluetooth success ");
            },
            onFailure: function(args) {
                responseTag.innerHTML += "<li> adapter/pair errorText :" + args.errorText + "</li>";

            }
        });
        //(args.request=="enterPinCode")
                   // adapter_supplyPinCode();
    }

    function adapter_supplyPinCode() 
    {
        var responseTag = document.querySelector("#response");
        var request = webOS.service.request("luna://com.webos.service.bluetooth2", {
            method: "adapter/supplyPinCode",
            parameters: {
                address : "98:d3:51:f9:34:47",
                pin : "0000" //enter by user
            },

            onSuccess: function(args) {
                responseTag.innerHTML += "<li> adapter_supplyPinCode returnValue:" + args.returnValue + "</li>";
                createToast("pair to bluetooth success ");
            },
            onFailure: function(args) {
                responseTag.innerHTML += "<li> adapter_supplyPinCode errorText :" + args.errorText + "</li>";

            }
        });
    }
/*
    function spp_createChannel() //ssp channel 생성
    {
        var responseTag = document.querySelector("#response");
        var request = webOS.service.request("luna://com.webos.service.bluetooth2", {
            method: "spp/createChannel",
            parameters: {
                name : "getGpsService",
                uuid : "43baacc0-a2f7-11e9-b475-0800200c9a66",
                subscribe : true
            },

            onSuccess: function(args) {
                responseTag.innerHTML += "<li> spp/createChannel returnValue:" + args.returnValue + "</li>";
                responseTag.innerHTML += "<li> spp/createChannel subscribed:" + args.subscribed + "</li>";
                createToast("successfully create ssp channel");
            },
            onFailure: function(args) {
                responseTag.innerHTML += "<li> spp/createChannel errorText :" + args.errorText + "</li>";

            }
        });
    }
*/
    function spp_connect() //ssp channle -- device connect
    {
        var responseTag = document.querySelector("#response");
        var request = webOS.service.request("luna://com.webos.service.bluetooth2", {
            method: "spp/connect",
            parameters: {
                address : "98:d3:51:f9:34:47",
                uuid : "00001101-0000-1000-8000-00805f9b34fb",
                subscribe : true
            },

            onSuccess: function(args) {
                responseTag.innerHTML += "<li> spp/connect returnValue:" + args.returnValue + "</li>";
                responseTag.innerHTML += "<li> spp/connect subscribed:" + args.subscribed + "</li>";
                responseTag.innerHTML += "<li> spp/connect channelId:" + args.channelId + "</li>";
                channelID = args.channelId;
                //이 채널 아이디 저장해둬야 겠다. 그리고 spp/readData channelId parameter 값으로 넘겨야지 
                createToast("successfully connect device to ssp channel");
            },
            onFailure: function(args) {
                responseTag.innerHTML += "<li> spp/connect errorText :" + args.errorText + "</li>";

            }
        });
    }

    function spp_readData() //ssp channle -- device connect
    {
        var responseTag = document.querySelector("#data");
        var request = webOS.service.request("luna://com.webos.service.bluetooth2", {
            method: "spp/readData",
            parameters: {
                "channelId" : "001",
                //"timeout" : 0,
                "subscribe": true,
                "adapterAddress": "b8:27:eb:64:62:a4"
            },

            onSuccess: function(args) {
                //responseTag.innerHTML += "<li> spp/readData returnValue:" + args.returnValue + "</li>";
                responseTag.innerHTML += "<li> spp/readData data:" + args.data + "</li>";
            },
            onFailure: function(args) {
                responseTag.innerHTML += "<li> spp/readData errorText :" + args.errorText + "</li>";

            }
        });
    }
