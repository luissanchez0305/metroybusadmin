window.addEventListener('load', function () {
    new FastClick(document.body);
}, false);

// The dynamically built HTML pages. In a real-life app, In a real-life app, use Handlerbar.js, Mustache.js or another template engine
var homePage =
    '<div>' +
        '<div class="header"><h1>Administrador</h1></div>' +
        '<div class="scroller">' +
            '<ul class="list">' +
                '<li class="hide"><a href="#page1"><img src="images/Bus-icon.jpg" class="titleIcon"/><strong>Paradas</strong></a></li>' +
                '<li><a href="#page2"><img src="images/busroute.jpg" class="titleIcon"/><strong>Rutas</strong></a></li>' +
                '<li class="hide"><a href="#page3"><strong>Ripple Bot</strong></a></li>' +
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
        	map: "<div class=\"hide\" id=\"map1Text\">"+
        	"<input type=\"text\" id=\"name\" class=\"nameText\" /><input type=\"button\" value=\"Save\" /></div>"+
        	"<div id=\"map1\" class=\"map-canvas\"></div>"
        });
        mapId="map1";
//        slider.slide($(page), "right");
    } 
    else if (hash === "#page2") {
        page = merge(detailsPage, {
        	img: "busroute.png", 
        	title: "Rutas", 
        	instructions: "Traza la ruta", 
        	map: "<div style=\"width:100%;\"><select id=\"routesContainer\"><option value=\"-1\">Nueva</option></select>"+
        	"<input type=\"button\" value=\"Escoger\" id=\"chooseRoute\" /><input type=\"text\" id=\"nameEdit\" class=\"nameText hide\" />"+
        	"<input type=\"button\" value=\"Editar\" class=\"hide\" /></div>"+
        	"<div class=\"hide\" id=\"map2Text\">"+
        	"<input type=\"text\" id=\"nameAdd\" class=\"nameText\" /><input type=\"button\" value=\"Guardar\" />"+
        	"<input type=\"hidden\" id=\"routeChoosen\" /></div>"+
        	"<div id=\"map2\" class=\"map-canvas\"></div>"
        });
        mapId="map2";
//        slider.slide($(page), "right");
    }
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
	
	//onError Callback receives a PositionError object
	//
	function onError(error) {
		if(error.code == 1){
			
		}else{
			   alert('code: '    + error.code    + '\n' +
				         'message: ' + error.message + '\n');
			
		}
	}
	
	function placeMarker(map, location) {
		var marker = new google.maps.Marker({
		    position: location,
		    map: map
		});

		map.panTo(location);
	}
	
	function loadMap(position){
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
		      map: map
		});
		
		google.maps.event.addListener(map, 'click', function(event) {
		    placeMarker(map, event.latLng);
		    if(mapId == 'map1'){
		    	showCreateName(mapId, 
		    			function(){
		    				
		    			});
		    }
		 });
		//google.maps.event.addDomListener(window, 'load', initialize);	
	}
	
	var $choosenBtn = $('#chooseRoute');
	if($choosenBtn.length > 0){
		// ruta escogida del dropdown
		$choosenBtn.click(function(){
	    	showCreateName(mapId, function(){ 
	    		// crear ruta
	    		$.get('http://mybws.espherasoluciones.com', 
	    				{service: 2, n: $('#' + mapId + 'Text').find('input[type="button"]').prev().val()}, 
	    				function(data){
	    					$('#routeChoosen').val(data);
	    					$('#nameAdd').addClass('hide');
	    					$('#nameAdd').next().addClass('hide');
	    					$('#nameEdit').val($('#nameAdd').val());
	    					$('#nameAdd').val('');
	    					$('#nameEdit').removeClass('hide');
	    					$('#nameEdit').next().removeClass('hide');
	    					$('#nameEdit').next().click(function(){
	    						// editar ruta
	    			    		$.get('http://mybws.espherasoluciones.com', 
	    			    				{service: 4, i: $('#routeChoosen').val(), n: $('#nameEdit').val() }, 
	    			    				function(data){
	    			    					alert('Guardado');
	    			    				});	    						
	    					});
	    					navigator.geolocation.getCurrentPosition(onSuccess, onError);
	    				}
	    		);
	    	});			
		})
	}
}

// Primitive template processing. In a real-life app, use Handlerbar.js, Mustache.js or another template engine
function merge(tpl, data) {    
    return tpl.replace("{{img}}", data.img)
		    .replace("{{instructions}}", data.instructions)
		    .replace("{{title}}", data.title)
            .replace("{{map}}", data.map);
}

function showCreateName(mapId, callback){
    $('#' + mapId + 'Text').removeClass('hide');
    $('#' + mapId + 'Text').find('input[type="button"]').click(function(){
    	callback();
    });
}

route();