/*
App-o-Mat jQuery Mobile Cordova starter template
https://github.com/app-o-mat/jqm-cordova-template-project
http://app-o-mat.com

MIT License
https://github.com/app-o-mat/jqm-cordova-template-project/LICENSE.md
*/
$(document).on("pageshow", "#maps", function(event) {

    
});

$(document).on("pageshow", "#select_animal", function(event) {

});

$(document).on("pageshow", "#select_symptom", function(event) {





});






function hospital(){
    getPosition()
   location.href = "#search";
}
//*주변 병원 보여주는 페이지로 넘어가는 함수*

function getPosition() {

   var options = {
      enableHighAccuracy: true,
      maximumAge: 3600000
   }
   
   var watchID = navigator.geolocation.getCurrentPosition(onSuccess, onError, options);

   function onSuccess(position) {

      keyword(position.coords.latitude,position.coords.longitude)

      
   };

   function onError(error) {
      alert('code: '    + error.code    + '\n' + 'message: ' + error.message + '\n');
   }
}

//*본인 위치 위도경도 구하기*




function keyword(lat,lon){

$.ajax({
   type : "GET",
   url : "http://maps.googleapis.com/maps/api/geocode/json?latlng="+lat+","+lon+"&language=ko",
   error:function(request,status,error){
      alert("통신실패")

        console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);

       },
   dataType: "json",
   success : function(data){   
      //category_id++;
      //alert("loc success")

      console.log('loc'+data.results[0].address_components[1].long_name)
      var loc=data.results[0].address_components[1].long_name;
      maptest(lat,lon,loc)
   }
});

}
//*위도경도 -> 주소로 변환 *




var num=0;
var map;
function maptest(lat,lon,loc){
   var markers = [];

if(num==0){
        var container = document.getElementById('map');
        
        var options = {
            center: new daum.maps.LatLng(lat, lon),
            level: 10
        };
        
        map = new daum.maps.Map(container, options);
        alert('pageshow')

          var locPosition = new daum.maps.LatLng(lat, lon) // 마커가 표시될 위치를 geolocation으로 얻어온 좌표로 생성합니다
           alert('locPosition '+locPosition)
           var message = '<div style="padding:5px;border:1px solid red;">여기에 있다!</div>'; // 인포윈도우에 표시될 내용입니다
        
        // 마커와 인포윈도우를 표시합니다
        displayMarker(locPosition, message);
       
        map.relayout();
        num++;
    }


// 지도를 생성합니다    
//var map = new daum.maps.Map(mapContainer, mapOption); 

// 장소 검색 객체를 생성합니다
var ps = new daum.maps.services.Places();  

// 검색 결과 목록이나 마커를 클릭했을 때 장소명을 표출할 인포윈도우를 생성합니다
var infowindow = new daum.maps.InfoWindow({zIndex:1});

// 키워드로 장소를 검색합니다
searchPlaces();

// 키워드 검색을 요청하는 함수입니다
function searchPlaces() {

    var keyword =loc+'동물병원';
    alert(keyword)



//alert(keyword)
    if (!keyword.replace(/^\s+|\s+$/g, '')) {
        alert('키워드를 입력해주세요!');
        return false;
    }

    // 장소검색 객체를 통해 키워드로 장소검색을 요청합니다
    ps.keywordSearch( keyword, placesSearchCB); 
}

// 장소검색이 완료됐을 때 호출되는 콜백함수 입니다
function placesSearchCB(status, data, pagination) {
   //alert('placesSearchCB1')
    if (status === daum.maps.services.Status.OK) {
       //alert('placesSearchCB2')

        // 정상적으로 검색이 완료됐으면
        // 검색 목록과 마커를 표출합니다
        displayPlaces(data.places);

        // 페이지 번호를 표출합니다
        displayPagination(pagination);

    } else if (status === daum.maps.services.Status.ZERO_RESULT) {

        alert('검색 결과가 존재하지 않습니다.');
        return;

    } else if (status === daum.maps.services.Status.ERROR) {

        alert('검색 결과 중 오류가 발생했습니다.');
        return;

    }
}

// 검색 결과 목록과 마커를 표출하는 함수입니다
function displayPlaces(places) {
//alert('displayPlaces')
    var listEl = document.getElementById('placesList'), 
    menuEl = document.getElementById('menu_wrap'),
    fragment = document.createDocumentFragment(), 
    bounds = new daum.maps.LatLngBounds(), 
    listStr = '';
    
    // 검색 결과 목록에 추가된 항목들을 제거합니다
    removeAllChildNods(listEl);

    // 지도에 표시되고 있는 마커를 제거합니다
    removeMarker();
    
    for ( var i=0; i<places.length; i++ ) {

        // 마커를 생성하고 지도에 표시합니다
        var placePosition = new daum.maps.LatLng(places[i].latitude, places[i].longitude),
            marker = addMarker(placePosition, i), 
            itemEl = getListItem(i, places[i], marker); // 검색 결과 항목 Element를 생성합니다

        // 검색된 장소 위치를 기준으로 지도 범위를 재설정하기위해
        // LatLngBounds 객체에 좌표를 추가합니다
        bounds.extend(placePosition);

        // 마커와 검색결과 항목에 mouseover 했을때
        // 해당 장소에 인포윈도우에 장소명을 표시합니다
        // mouseout 했을 때는 인포윈도우를 닫습니다
        (function(marker, title) {
            daum.maps.event.addListener(marker, 'mouseover', function() {
                displayInfowindow(marker, title);
            });

            daum.maps.event.addListener(marker, 'mouseout', function() {
                infowindow.close();
            });

            itemEl.onmouseover =  function () {
                displayInfowindow(marker, title);
            };

            itemEl.onmouseout =  function () {
                infowindow.close();
            };
        })(marker, places[i].title);

        fragment.appendChild(itemEl);
    }

    // 검색결과 항목들을 검색결과 목록 Elemnet에 추가합니다
    listEl.appendChild(fragment);
    menuEl.scrollTop = 0;

    // 검색된 장소 위치를 기준으로 지도 범위를 재설정합니다
    map.setBounds(bounds);
}

// 검색결과 항목을 Element로 반환하는 함수입니다
function getListItem(index, places) {

   console.log('title> '+places.title+' newAddress> '+places.newAddress)
   console.log('address> '+places.address+" placesphone> "+places.phone)

    var el = document.createElement('li'),
    itemStr = 
               '<div class="info">' +
                '   <h5>' + places.title + '</h5>';

    if (places.newAddress) {
        itemStr += '    <span>' + places.newAddress + '</span>' +
                    '   <span class="jibun gray">' +  places.address  + '</span>';
    } else {
        itemStr += '    <span>' +  places.address  + '</span>'; 
    }
                 
      itemStr += '  <a class="tel" href="tel://'+places.phone+'">' + places.phone  + '</a>' +
                '</div>';           

    el.innerHTML = itemStr;
    el.className = 'item';

    return el;
}

// 마커를 생성하고 지도 위에 마커를 표시하는 함수입니다
function addMarker(position, idx, title) {
   //alert('addMarker')
    var imageSrc = 'http://i1.daumcdn.net/localimg/localimages/07/mapapidoc/marker_number_blue.png', // 마커 이미지 url, 스프라이트 이미지를 씁니다
        imageSize = new daum.maps.Size(36, 37),  // 마커 이미지의 크기
        imgOptions =  {
            spriteSize : new daum.maps.Size(36, 691), // 스프라이트 이미지의 크기
            spriteOrigin : new daum.maps.Point(0, (idx*46)+10), // 스프라이트 이미지 중 사용할 영역의 좌상단 좌표
            offset: new daum.maps.Point(13, 37) // 마커 좌표에 일치시킬 이미지 내에서의 좌표
        },
        markerImage = new daum.maps.MarkerImage(imageSrc, imageSize, imgOptions),
            marker = new daum.maps.Marker({
            position: position, // 마커의 위치
            image: markerImage 
        });

    marker.setMap(map); // 지도 위에 마커를 표출합니다
    markers.push(marker);  // 배열에 생성된 마커를 추가합니다

    return marker;
}

// 지도 위에 표시되고 있는 마커를 모두 제거합니다
function removeMarker() {
    for ( var i = 0; i < markers.length; i++ ) {
        markers[i].setMap(null);
    }   
    markers = [];
}

// 검색결과 목록 하단에 페이지번호를 표시는 함수입니다
function displayPagination(pagination) {
    var paginationEl = document.getElementById('pagination'),
        fragment = document.createDocumentFragment(),
        i; 

    // 기존에 추가된 페이지번호를 삭제합니다
    while (paginationEl.hasChildNodes()) {
        paginationEl.removeChild (paginationEl.lastChild);
    }

    for (i=1; i<=pagination.last; i++) {
        var el = document.createElement('a');
        el.href = "#";
        el.innerHTML = i;

        if (i===pagination.current) {
            el.className = 'on';
        } else {
            el.onclick = (function(i) {
                return function() {
                    pagination.gotoPage(i);
                }
            })(i);
        }

        fragment.appendChild(el);
    }
    paginationEl.appendChild(fragment);
}

// 검색결과 목록 또는 마커를 클릭했을 때 호출되는 함수입니다
// 인포윈도우에 장소명을 표시합니다
function displayInfowindow(marker, title) {
    var content = '<div style="padding:5px;z-index:1;">' + title + '</div>';

    infowindow.setContent(content);
    infowindow.open(map, marker);
}

 // 검색결과 목록의 자식 Element를 제거하는 함수입니다
function removeAllChildNods(el) {   
    while (el.hasChildNodes()) {
        el.removeChild (el.lastChild);
    }
 }


//*본인 위치 마커 보여주는 함수* 
function displayMarker(locPosition, message) {

    // 마커를 생성합니다
    var marker = new daum.maps.Marker({  
        map: map, 
        position: locPosition
    }); 
    
    var iwContent = message, // 인포윈도우에 표시할 내용
        iwRemoveable = true;

    // 인포윈도우를 생성합니다
    var infowindow = new daum.maps.InfoWindow({
        content : iwContent,
        removable : iwRemoveable
    });
    
    // 인포윈도우를 마커위에 표시합니다 
    infowindow.open(map, marker);
    
    // 지도 중심좌표를 접속위치로 변경합니다
    map.setCenter(locPosition);      
}  





}//*-maptest()end-*

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
