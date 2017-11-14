var testLat = 35.6895,
  testLng = 139.6917;

var tab, mapbox, googleMapsJs;

document.addEventListener("deviceready", function() {
  ons.ready(function() {
    var secondPage = document.getElementById("first-page");

    // Needed to be able to see the Cordova GM on Onsen UI
    if (secondPage) {
      secondPage.firstElementChild.style.backgroundColor = "rgba(0, 0, 0, 0)";
    }

    var modElement = document.getElementsByClassName("page--material__background");
    modElement[0].style.backgroundColor = "rgba(0, 0, 0, 0)";

    tab = document.getElementById("tab");

    initGoogleMapsCordova();
    initMapbox();
  })
}, false);

function initGoogleMapsJS() {
    googleMapsJs = new google.maps.Map(document.getElementById('gm_js'), {
      zoom: 10,
      center: {lat: testLat, lng: testLng}
    });

    var marker = new google.maps.Marker({
      position: {lat: testLat, lng: testLng},
      map: googleMapsJs
    });
}

function initGoogleMapsCordova() {
  var div = document.getElementById("gm_cordova");

  var options = {
    camera: {
      target: {lat: testLat, lng: testLng},
      zoom: 10
    }
  };

  // Initialize the map view
  map = plugin.google.maps.Map.getMap(div, options);

  // Wait until the map is ready status.
  map.addEventListener(plugin.google.maps.event.MAP_READY, function() {
    map.addMarker({
      position: {lat: testLat, lng: testLng}
    })
  });
}

function initMapbox() {
  // Provide your access token
  mapboxgl.accessToken = 'MY_KEY';

  // Create a map in the div #mapbox_js
  mapbox = new mapboxgl.Map({
    container: 'mapbox_js',
    style: 'mapbox://styles/mapbox/streets-v9',
    center: [testLng, testLat],
    zoom: 9
  });

}


var zoomIn = function() {
  var activeTab = tab.getActiveTabIndex();

  if (activeTab === 0) {
    map.animateCamera({
      target: {lat: testLat, lng: testLng},
      zoom: 16,
      duration: 2000
    });
  } else if (activeTab === 1) {
    googleMapsJs.setCenter(new google.maps.LatLng(testLat, testLng));
    googleMapsJs.setZoom(16);
  } else {
    mapbox.flyTo({
      speed: 1,
      zoom: 15
  });
  }
}

var zoomOut = function() {
  var activeTab = tab.getActiveTabIndex();

  if (activeTab === 0) {
    map.animateCamera({
      target: {lat: testLat, lng: testLng},
      zoom: 9,
      duration: 2000
    });
  } else if (activeTab === 1) {
    googleMapsJs.setCenter(new google.maps.LatLng(testLat, testLng));
    googleMapsJs.setZoom(9);
  } else {
    mapbox.flyTo({
      speed: 1,
      zoom: 8
    });
  }
}
