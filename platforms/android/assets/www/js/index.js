/*
App-o-Mat jQuery Mobile Cordova starter template
https://github.com/app-o-mat/jqm-cordova-template-project
http://app-o-mat.com

MIT License
https://github.com/app-o-mat/jqm-cordova-template-project/LICENSE.md
*/
$(document).on("pageshow", "#maps", function(event) {

    initMap(); //지도생성함수 호출
});

$(document).on("pageshow", "#select_animal", function(event) {

});

$(document).on("pageshow", "#select_symptom", function(event) {





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


var map;
var service;
var infowindow;
var lat;
var lon;
var markers = [];
var iw;
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

        mapLoad();
    };

    function onError(error) {
        alert('code: ' + error.code + '\n' + 'message: ' + error.message + '\n');
    }
}



//지도 생성 함수
function initMap() {

    getPosition();

}

function mapLoad() {


    var pyrmont = { lat: lat, lng: lon }; //여기 현재위치
    var myLatLng = new google.maps.LatLng(lat,lon);

    var currentMarker = new google.maps.Marker({
   		 position: myLatLng
	});

    map = new google.maps.Map(document.getElementById('map'), {
        center: pyrmont,
        zoom: 15
    });

    infowindow = new google.maps.InfoWindow({
        content: document.getElementById('info-content')

    });

    currentMarker.setMap(map);

    var request = {
        location: pyrmont,
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

function clearResults() {
  var results = document.getElementById('results');
  while (results.childNodes[0]) {
    results.removeChild(results.childNodes[0]);
  }
}

function clearMarkers() {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i]) {
      markers[i].setMap(null);
    }
  }
  markers = [];
}



function dropMarker(i) {
  return function() {
    markers[i].setMap(map);
  };
}

/*function getDetails(result, i) {
	return function () {
		service.getDetails({
			reference: result.reference
		}, showInfoWindow(i));
	}
}*/

function showInfoWindow() {
    var marker = this;
    service.getDetails({ placeId: marker.placeResult.place_id },
        function(place, status) {
            if (status !== google.maps.places.PlacesServiceStatus.OK) {
                return;
            }
            infowindow.open(map, marker);
            buildIWContent(place);
        });
}

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
                alert(ratingHtml);
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


/*function getIWContent(place) {
	var content = '<table style="border:0"><tr><td style="border:0;">';
	content += '<img class="placeIcon" src="' + place.icon + '"></td>';
	content += '<td style="border:0;"><b><a href="' + place.url + '">' + place.name + '</a></b>';
	content += '</td></tr></table>';
	return content;
}*/
var phone;
var address;
function addResult(result, i) {
	

	service.getDetails(result, function(place, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        
        return;
      }
      phone = document.createTextNode(place.formatted_phone_number);
      address = document.createTextNode(place.vicinity);

      addTable(result, i);
      
    });

}

function addTable(result, i) {
	var results = document.getElementById('results');
    var tr = document.createElement('tr');
    tr.style.backgroundColor = (i % 2 == 0 ? '#F0F0F0' : '#FFFFFF');
    tr.onclick = function() {
        google.maps.event.trigger(markers[i], 'click');
    };
    var iconTd = document.createElement('td');
    var nameTd = document.createElement('td');
    var phoneTd = document.createElement('td');
    var addressTd = document.createElement('td');
    var icon = document.createElement('img');
    icon.src = result.icon.replace('http:', '');
    icon.setAttribute('class', 'placeIcon');
    var name = document.createTextNode(result.name);
    iconTd.appendChild(icon);
    nameTd.appendChild(name);
    phoneTd.appendChild(phone);
    addressTd.appendChild(address);
    tr.appendChild(iconTd);
    tr.appendChild(nameTd);
    tr.appendChild(phoneTd);
    tr.appendChild(addressTd);
    results.appendChild(tr);
}

//////////////////////////////////////////////////////////지도끝///////////




var successDiseaseList = function(data) {
    $.each(data, function(key, value) {
        alert(key + value);
    })


}

var failDiseaseList = function() {
    alert("질병리스트 가져오기 실패");
}




var category;
$(function() {

    $("#search_button").click(function() {
        alert(category);
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
            list: list
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
