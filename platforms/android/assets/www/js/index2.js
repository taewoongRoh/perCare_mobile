/*
App-o-Mat jQuery Mobile Cordova starter template
https://github.com/app-o-mat/jqm-cordova-template-project
http://app-o-mat.com

MIT License
https://github.com/app-o-mat/jqm-cordova-template-project/LICENSE.md
*/
$(document).on("pageshow", "#maps", function(event) {

    start(); //지도생성함수 호출
});

$(document).on("pageshow", "#select_animal", function(event) {

});

$(document).on("pageshow", "#select_symptom", function(event) {


});

$(document).on("pageshow", "#diseaseListPage", function(event) {
    var table= '';
    table += "<table>";

    $.each(diseaseList, function(key, value) {
        table += "<tr>";
        table += "<td>" + value.d_name; + "</td>";
        table += "</tr>";
    })

    table += "</table>";
    $("#diseaseList_content").html(table);

});






var appomat = {};

appomat.app = {

    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
        FastClick.attach(document.body);
    }

};


var map, places, infoWindow;
var markers = [];
var autocomplete;
var countryRestrict = {'country': 'us'};
var MARKER_PATH = 'https://maps.gstatic.com/intl/en_us/mapfiles/marker_green';
var hostnameRegexp = new RegExp('^https?://.+?/');


//////////////////////////////////////////////////////////
function getPosition() {

    var options = {
        enableHighAccuracy: true,
        maximumAge: 3600000
    }

    var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

    function onSuccess(position) {

        lat = position.coords.latitude;
        lon = position.coords.longitude;

        map.panTo({lat: lat, lng: lon});
        map.setZoom(15);

        search();
    };

    function onError(error) {
        alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    }
}



function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {lat: -34.397, lng: 150.644},
    mapTypeControl: false,
    panControl: false,
    zoomControl: false,
    streetViewControl: false
  });

  infoWindow = new google.maps.InfoWindow({
    content: document.getElementById('info-content')
  });

  // Create the autocomplete object and associate it with the UI input control.
  // Restrict the search to the default country, and to place type "cities".

  places = new google.maps.places.PlacesService(map);
}



// When the user selects a city, get the place details for the city and
// zoom the map in on the city.
function start() {
    getPosition();

}

// Search for hotels in the selected city, within the viewport of the map.
function search() {
 var request = {
        location: {lat: lat, lng : lon},
        keyword: '동물병원',
        rankBy: google.maps.places.RankBy.DISTANCE //이거를 하면 거리순으로 오름차순해준다함.
    };

    service = new google.maps.places.PlacesService(map);
    service.nearbySearch(request, function(results, status) {
        if (status == google.maps.places.PlacesServiceStatus.OK) {
            clearResults();
            clearMarkers();
            
            for (var i = 0; i < results.length; i++) {
                markers[i] = new google.maps.Marker({
                    position: results[i].geometry.location,
                    animation: google.maps.Animation.DROP
                });
                markers[i].placeResult = results[i];
                google.maps.event.addListener(markers[i], 'click', showInfoWindow);
                setTimeout(dropMarker(i), i * 100);
                addResult(results[i], i);

            }
        }
       
    });
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
}

// Set the country restriction based on user input.
// Also center and zoom the map on the given country.


function dropMarker(i) {
  return function() {
    markers[i].setMap(map);
  };
}

function addResult(result, i) {
  var results = document.getElementById('results');
  var markerLetter = String.fromCharCode('A'.charCodeAt(0) + i);
  var markerIcon = MARKER_PATH + markerLetter + '.png';

  var tr = document.createElement('tr');
  tr.style.backgroundColor = (i % 2 === 0 ? '#F0F0F0' : '#FFFFFF');
  tr.onclick = function() {
    google.maps.event.trigger(markers[i], 'click');
  };

  var iconTd = document.createElement('td');
  var nameTd = document.createElement('td');
  var icon = document.createElement('img');
  icon.src = markerIcon;
  icon.setAttribute('class', 'placeIcon');
  icon.setAttribute('className', 'placeIcon');
  var name = document.createTextNode(result.name);
  iconTd.appendChild(icon);
  nameTd.appendChild(name);
  tr.appendChild(iconTd);
  tr.appendChild(nameTd);
  results.appendChild(tr);
}

function clearResults() {
  var results = document.getElementById('results');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

// Get the place details for a hotel. Show the information in an info window,
// anchored on the marker for the hotel that the user selected.
function showInfoWindow() {
  var marker = this;
  places.getDetails({placeId: marker.placeResult.place_id},
      function(place, status) {
        if (status !== google.maps.places.PlacesServiceStatus.OK) {
          return;
        }
        infoWindow.open(map, marker);
        buildIWContent(place);
      });
}

// Load the place information into the HTML elements used by the info window.
function buildIWContent(place) {
  document.getElementById('iw-icon').innerHTML = '<img class="hotelIcon" ' +
      'src="' + place.icon + '"/>';
  document.getElementById('iw-url').innerHTML = '<b><a href="' + place.url +
      '">' + place.name + '</a></b>';
  document.getElementById('iw-address').textContent = place.vicinity;

  if (place.formatted_phone_number) {
    document.getElementById('iw-phone-row').style.display = '';
    document.getElementById('iw-phone').textContent =
        place.formatted_phone_number;
  } else {
    document.getElementById('iw-phone-row').style.display = 'none';
  }

  // Assign a five-star rating to the hotel, using a black star ('&#10029;')
  // to indicate the rating the hotel has earned, and a white star ('&#10025;')
  // for the rating points not achieved.
  if (place.rating) {
    var ratingHtml = '';
    for (var i = 0; i < 5; i++) {
      if (place.rating < (i + 0.5)) {
        ratingHtml += '&#10025;';
      } else {
        ratingHtml += '&#10029;';
      }
    document.getElementById('iw-rating-row').style.display = '';
    document.getElementById('iw-rating').innerHTML = ratingHtml;
    }
  } else {
    document.getElementById('iw-rating-row').style.display = 'none';
  }

  // The regexp isolates the first part of the URL (domain plus subdomain)
  // to give a short URL for displaying in the info window.
  if (place.website) {
    var fullUrl = place.website;
    var website = hostnameRegexp.exec(place.website);
    if (website === null) {
      website = 'http://' + place.website + '/';
      fullUrl = website;
    }
    document.getElementById('iw-website-row').style.display = '';
    document.getElementById('iw-website').textContent = website;
  } else {
    document.getElementById('iw-website-row').style.display = 'none';
  }
}

//////////////////////////////////////////////////////////지도끝///////////



var diseaseList=[];
var successDiseaseList = function(data) {
    diseaseList=data;

    $.mobile.changePage("#diseaseListPage");


}

var failDiseaseList = function() {
    alert("질병리스트 가져오기 실패");
}

function selectCategory(ctgory) {
    category = ctgory;
}



$(function() {


    $("#search_button").click(function() {

        var list = new Array();

        if ($("#sym-1").is(":checked")) {
            list.push($("#sym-label-1").text());
        }
        if ($("#sym-2").is(":checked")) {
            list.push($("#sym-label-2").text());
        }
        if ($("#sym-3").is(":checked")) {
            list.push($("#sym-label-3").text());
        }
        if ($("#sym-4").is(":checked")) {
            list.push($("#sym-label-4").text());
        }
        if ($("#sym-5").is(":checked")) {
            list.push($("#sym-label-5").text());
        }
        if ($("#sym-6").is(":checked")) {
            list.push($("#sym-label-6").text());
        }
        if ($("#sym-7").is(":checked")) {
            list.push($("#sym-label-7").text());
        }
        if ($("#sym-8").is(":checked")) {
            list.push($("#sym-label-8").text());
        }
        if ($("#sym-9").is(":checked")) {
            list.push($("#sym-label-9").text());
        }


        requestJsonData("http://localhost:8080/disease", "GET", {
            list: list,
            category: category
        }, successDiseaseList, failDiseaseList);


        list = null;

    });



    $(".menubar").click(function() {
        if ($("#right-panel_menu").hasClass('menu-open')) {
            $("#right-panel_menu").removeClass('menu-open');
            $('.content').removeClass('background-active');
            $('.symptom_list').removeClass('unclickable');

        } else {
            $("#right-panel_menu").addClass('menu-open');
            $('.content').addClass('background-active');
            $('.symptom_list').addClass('unclickable');
        }
    })


    $(".main_content").click(function() {
        if ($("#right-panel_menu").hasClass('menu-open')) {
            $("#right-panel_menu").removeClass('menu-open');
            $('.content').removeClass('background-active');
            $('.symptom_list').removeClass('unclickable');
        }

    });
});
