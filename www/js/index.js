/*
App-o-Mat jQuery Mobile Cordova starter template
https://github.com/app-o-mat/jqm-cordova-template-project
http://app-o-mat.com

MIT License
https://github.com/app-o-mat/jqm-cordova-template-project/LICENSE.md
*/

var appomat = {};

appomat.app = {
	
    initialize: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
    },

    onDeviceReady: function() {
		FastClick.attach(document.body);
    }

};




$(document).on("pageshow", "#maps", function() {


        var container = document.getElementById('map');
        var options = {
            center: new daum.maps.LatLng(33.450701, 126.570667),
            level: 3
        };

        var map = new daum.maps.Map(container, options);

        map.relayout();
    });


    $(document).on("pageshow", "#select_animal", function(event) {
        alert("pageshow event fired - select_animal page is now shown");
    });



    $(function() {

        $(".menubar").click(function() {
            if ($("#right-panel").hasClass('menu-open')) {
                $("#right-panel").removeClass('menu-open');
                $('.content').removeClass('background-active');
                $('.animal_list').removeClass('unclickable');

            } else {
                $("#right-panel").addClass('menu-open');
                $('.content').addClass('background-active');
                $('.animal_list').addClass('unclickable');
            }
        })


        $(".main_content").click(function() {
            if ($("#right-panel").hasClass('menu-open')) {
                $("#right-panel").removeClass('menu-open');
                $('.content').removeClass('background-active');
                $('.animal_list').removeClass('unclickable');
            }

        });
    });