var map;
var geocoder;

// create marker
var myMarker;
var ambulanceMarkers = new Array();

function initialize()
{
    geocoder = new google.maps.Geocoder();
}

function setMapPosition(lat, lng)
{
    var mapOptions = {
        center: new google.maps.LatLng(lat, lng),
        zoom: 15,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
    };
    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function createMarker(lat, lng)
{
    var marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        //draggable: false,
        //icon: "http://maps.google.com/mapfiles/ms/micons/man.png";
    });
    //marker.addListener('click', toggleBounce); //click evnet가 아니라 웹소켓에서 뭐가 날라오는 이벤트가 발생하면 저렇게 깜박이는 게 낫겠다.
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

/*
function drawCircle(lat, lng) {
    // 현재 위치 기준 원 그리기 -- 엠뷸런스에 쓰면 좋겠다
    var populationOptions = {
        strokeColor: '#000000',
        strokeOpacity: 0.8,
        strokeWeight: 2,
        fillColor: '#808080',
        fillOpacity: 0.5,
        map: map,
        center: new google.maps.LatLng(lat, lng),
        radius: 10000
    };
    cityCircle = new google.maps.Circle(populationOptions);
}
*/

function toggleBounce()
{
    if (marker.getAnimation() !== null)
		marker.setAnimation(null);
	else
		marker.setAnimation(google.maps.Animation.BOUNCE);
}