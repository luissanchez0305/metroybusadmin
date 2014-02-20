window.addEventListener('load', function () {
    new FastClick(document.body);
}, false);

// The dynamically built HTML pages. In a real-life app, In a real-life app, use Handlerbar.js, Mustache.js or another template engine
var homePage =
    '<div>' +
        '<div class="header"><h1>Administrador</h1></div>' +
        '<div class="scroller">' +
            '<ul class="list">' +
                '<li><a href="#page1"><img src="images/Bus-icon.jpg" class="titleIcon"/><strong>Paradas</strong></a></li>' +
                '<li><a href="#page2"><img src="images/busroute.jpg" class="titleIcon"/><strong>Rutas</strong></a></li>' +
                '<li style="display:none;"><a href="#page3"><strong>Ripple Bot</strong></a></li>' +
            '</ul>' +
        '</div>' +
    '</div>';

var detailsPage =
    '<div>' +
        '<div class="header"><a href="#" class="btn">Atras</a><img src="images/{{img}}" class="titleIcon"/><h1>{{title}} - {{instructions}}</h1></div>' +
        '<div class="scroller">' +
            '<div class="robot">' +
                '{{map}}' +
            '</div>' +
        '</div>' +
    '</div>';


var slider = new PageSlider($("#container"));
$(window).on('hashchange', route);

// Basic page routing
function route(event) {
    var page,
        hash = window.location.hash,
        mapId;
	
    if (hash === "#page1") {
        page = merge(detailsPage, {
        	img: "Bus-icon.jpg", 
        	title: "Paradas", 
        	instructions: "Click en la parada", 
        	map: "<div id=\"map1\" class=\"map-canvas\"></div>"
        });
        mapId="map1";
//        slider.slide($(page), "right");
    } else if (hash === "#page2") {
        page = merge(detailsPage, {
        	img: "busroute.jpg", 
        	title: "Rutas", 
        	instructions: "Traza la ruta", 
        	map: "<div id=\"map2\" class=\"map-canvas\"></div>"
        });
        mapId="map2";
//        slider.slide($(page), "right");
    } /*else if (hash === "#page3") {
        page = merge(detailsPage, {img: "ripplebot.jpg", name: "Ripple Bot", description: "Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur."});
//        slider.slide($(page), "right");
    }*/
    else {
        page = homePage;
//        slider.slide($(homePage), "left");
    }

    slider.slidePage($(page));   
    
    // onSuccess Callback
	//  This method accepts a `Position` object, which contains
	//  the current GPS coordinates
	//
	var onSuccess = function(position) {
		loadMap(position);
	}
	
	function placeMarker(location) {
		var marker = new google.maps.Marker({
		    position: location,
		    map: map
		});

		map.setCenter(location);
	}
	
	//onError Callback receives a PositionError object
	//
	function onError(error) {
		if(error.code == 1){
			
		}else{
			   alert('code: '    + error.code    + '\n' +
				         'message: ' + error.message + '\n');
			
		}
	}
	function loadMap(location){
		alert(position.coords.latitude + ' ' + position.coords.longitude);
		var lat = position.coords.latitude;
	   	var lng = position.coords.longitude;
	    var myLatlng = new google.maps.LatLng(lat,lng);
		var mapOptions = {
			      center: myLatlng,
			      zoom: 12
			    };
		
		var map = new google.maps.Map(document.getElementById(mapId), mapOptions);
		var marker = new google.maps.Marker({
		      position: myLatlng,
		      map: map,
		      title: 'Tu estas aqui'
		});
		
		google.maps.event.addListener(map, 'click', function(event) {
		    placeMarker(event.latLng);
		 });
		//google.maps.event.addDomListener(window, 'load', initialize);	
	}
	navigator.geolocation.getCurrentPosition(onSuccess, onError);
}

// Primitive template processing. In a real-life app, use Handlerbar.js, Mustache.js or another template engine
function merge(tpl, data) {
    
    return tpl.replace("{{img}}", data.img)
		    .replace("{{instructions}}", data.instructions)
		    .replace("{{title}}", data.title)
            .replace("{{map}}", data.map);
}

route();