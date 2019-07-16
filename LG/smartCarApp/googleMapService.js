var myMap;
var geocoder;

// create marker
var myMarker;
var ambulanceMarkers = new Array();

function initialize()
{
    geocoder = new google.maps.Geocoder();
    myMap = createMap(latitude, longitude);
    autoComplete(myMap);
}


function createMap(lat, lng)
{
    var mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 17,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };

    return new google.maps.Map(document.getElementById('map'), mapOptions);
}

function setMapPosition(map, LatLng)
{
    map.setCenter(LatLng);
}

function createMarker(lat, lng)
{
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: myMap,
        //draggable: false,
        //icon: "http://maps.google.com/mapfiles/ms/micons/man.png";
    });
    // marker.addListener('click', toggleBounce); //click evnet가 아니라 웹소켓에서 뭐가 날라오는 이벤트가 발생하면 저렇게 깜박이는 게 낫겠다.
    return marker;
}

function moveMarker(marker, lat, lng)
{
    marker.setPosition(new google.maps.LatLng(lat, lng));
}

function deleteMarker(marker)
{
    marker.setMap(null);
}

function toggleBounce()
{
    if (marker.getAnimation() !== null)
		marker.setAnimation(null);
	else
		marker.setAnimation(google.maps.Animation.BOUNCE);
}