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

// 검색창 아래 자동완성 및 위치 찾기 함수
function autoComplete(map) {
    var card = document.getElementById('pac-card');
    var input = document.getElementById('pac-input'); // 서치인풋
    var types = document.getElementById('type-selector'); // 타입 선택 라디오버튼
    var strictBounds = document.getElementById('strict-bounds-selector');

    var autocomplete = new google.maps.places.Autocomplete(input);

    autocomplete.bindTo('bounds', map);

    autocomplete.setFields(
        ['address_components', 'geometry', 'icon', 'name']);

    var infowindow = new google.maps.InfoWindow();
    var infowindowContent = document.getElementById('infowindow-content');
    infowindow.setContent(infowindowContent);
    var marker = new google.maps.Marker({
        map: map,
        anchorPoint: new google.maps.Point(0, -29)
    });

    autocomplete.addListener('place_changed', function () {
        infowindow.close();
        marker.setVisible(false);
        var place = autocomplete.getPlace();
        if (!place.geometry) {
            window.alert("No details available for input: '" + place.name + "'");
            return;
        }

        if (place.geometry.viewport) {
            map.fitBounds(place.geometry.viewport);
        } else {
            map.setCenter(place.geometry.location);
            map.setZoom(17);  // Why 17? Because it looks good.
        }
        marker.setPosition(place.geometry.location);
        marker.setVisible(true);

        var address = '';
        if (place.address_components) {
            address = [
                (place.address_components[0] && place.address_components[0].short_name || ''),
                (place.address_components[1] && place.address_components[1].short_name || ''),
                (place.address_components[2] && place.address_components[2].short_name || '')
            ].join(' ');
        }

        infowindowContent.children['place-icon'].src = place.icon;
        infowindowContent.children['place-name'].textContent = place.name;
        infowindowContent.children['place-address'].textContent = address;
        infowindow.open(map, marker);
    });

    // Autocomplete.
    function setupClickListener(id, types) {
        var radioButton = document.getElementById(id);
        radioButton.addEventListener('click', function () {
            autocomplete.setTypes(types);
        });
    }

    setupClickListener('changetype-all', []);
    setupClickListener('changetype-address', ['address']);
    setupClickListener('changetype-establishment', ['establishment']);
    setupClickListener('changetype-geocode', ['geocode']);

    document.getElementById('use-strict-bounds')
        .addEventListener('click', function () {
            console.log('Checkbox clicked! New state=' + this.checked);
            autocomplete.setOptions({strictBounds: this.checked});
        });

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