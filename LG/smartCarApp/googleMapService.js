
window.onload = function() {
    initialize();
};

//var smartCar;
//var ambulance;
var marker;
var map;
var geocoder;
var infowindow = null;

//form mall 위치 (임의의 초기 값)
var latitude = 12.934674;
var longitude = 77.611170;

function initialize() {
    geocoder = new google.maps.Geocoder();
    var lat = latitude;
    var lng = longitude;
    setInitPosition(lat, lng);
    setMarker(lat, lng);
}

function moveMarker(lat, lng) { 
    var latv = parseFloat(lat);
    var lonv = parseFloat(lng);
    marker.setPosition(new google.maps.LatLng(latv, lonv));
}

function addMarker(lat, lng) { 
    var latv = parseFloat(lat);
    var lonv = parseFloat(lng);
    //setCurrentPosition(latv, lonv);
    setMarker(latv, lonv);
}

function setInitPosition(lat, lng) {
    var latitude = lat;
    var longitude = lng;

    var mapOptions = {
        zoom: 12,
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        center: new google.maps.LatLng(latitude, longitude)
    };

    map = new google.maps.Map(document.getElementById('map'), mapOptions);
}

function setMarker(lat, lng) {
    // 현재 위치 마커 생성
    marker = new google.maps.Marker({
        position: new google.maps.LatLng(lat, lng),
        map: map,
        //draggable: false,
        //icon: "http://maps.google.com/mapfiles/ms/micons/man.png";
    });
    marker.addListener('click', toggleBounce); //click evnet가 아니라 웹소켓에서 뭐가 날라오는 이벤트가 발생하면 저렇게 깜박이는 게 낫겠다.
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

function toggleBounce() {
    if (marker.getAnimation() !== null) {
        marker.setAnimation(null);
    } else {
        marker.setAnimation(google.maps.Animation.BOUNCE);
    }
}
