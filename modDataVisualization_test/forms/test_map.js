/**
 * @properties={typeid:35,uuid:"7172DDE1-FC96-4CEE-9EB1-A35109AD7AF6",variableType:-4}
 */
var m, m2;

/**
 *
 * @properties={typeid:35,uuid:"20C57850-3FDF-4EDA-8407-8E1A0AA82CB7",variableType:-4}
 */
var i, map2;

/**
 * @properties={typeid:24,uuid:"74895BB9-A55A-4492-AC67-9D6A19E11F4E"}
 */
function manualUpdate() {
	update(true)
}

/**
 * @param {Boolean} force
 * @properties={typeid:24,uuid:"659B9B41-A153-4B09-8991-254B47A65C01"}
 */
function update(force) {
	if (!force && !autoUpdate) return
	
	for (i = 0; i < maps.length; i++) {
//		var sw = new scopes.modDataVisualization$GoogleMaps.LatLng((Math.random() * 180).toFixed(0)-90, (Math.random() * 360).toFixed(0)-180)
//		var ne = new scopes.modDataVisualization$GoogleMaps.LatLng((Math.random() * 180).toFixed(0)-90, (Math.random() * 360).toFixed(0)-180)
//		var bounds = new scopes.modDataVisualization$GoogleMaps.LatLngBounds(sw,ne)
//		maps[i].setZoom(parseInt((Math.random() * 10).toFixed(0)))
//		maps[i].panToBounds(bounds)
		
		//Add random marker;
		addMarker(null, maps[i]);
	}
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"75FD526E-F7F5-4491-90BA-2235847E74F9"}
 */
function onLoad(event) {
	
//	//Instantiate GoogleMaps
	
	map2 = new scopes.modDataVisualization$GoogleMaps.Map(elements.map2, {
		zoom: 2,
		center: new scopes.modDataVisualization$GoogleMaps.LatLng(30, 20),
		mapTypeId: scopes.modDataVisualization$GoogleMaps.MapTypeIds.TERRAIN,
		overviewMapControl: true,
		panControl: true,
		rotateControl: true,
		scaleControl: true,
		zoomControl: true,
		mapMaker: false
	})
	maps.push(map2)
	
		
//	m = new scopes.modDataVisualization$GoogleMaps.Marker({
//		position: new scopes.modDataVisualization$GoogleMaps.LatLng(10,20),
//		draggable: false,
//		title: 'Hello Paul',
//		map: map2
//	});
//	m.addEventListener(markerCallback,m.EVENT_TYPES.CLICK);
	
	m = new scopes.modDataVisualization$GoogleMaps.Marker({
		position: new scopes.modDataVisualization$GoogleMaps.LatLng(42,5),
		draggable: true,
		title: 'Hello Joas'
	});
	m.setMap(map2);
	m.addEventListener(addInfoWindow,m.EVENT_TYPES.CLICK);
	m.addEventListener(markerCallback,m.EVENT_TYPES.DBLCLICK);
	m.addEventListener(markerCallback,m.EVENT_TYPES.RIGHTCLICK);
	m.addEventListener(markerCallback,m.EVENT_TYPES.DRAGEND);
	
	m2 = new scopes.modDataVisualization$GoogleMaps.Marker({
		position: new scopes.modDataVisualization$GoogleMaps.LatLng(62,30),
		draggable: true,
		title: 'Hello Joas'
	});
	m2.setMap(map2);
	
//	m.addInfoWindow()
	
//	i = new scopes.modDataVisualization$GoogleMaps.InfoWindow({
//		position: new scopes.modDataVisualization$GoogleMaps.LatLng(5,52),
//		content: 'Hello Joas'
//	});
	
//	i = new scopes.modDataVisualization$GoogleMaps.InfoWindow({
//		content: '<span style=\'color: red\'>Hello Joas</span><br/>Check <a href="http://www.servoy.com" target="new">this site</a>'
//	});
//	i.addEventListener(infoWindowCallback, i.EVENT_TYPES.CLOSECLICK);
//	i.open(map2, m);
//	
//	i = new scopes.modDataVisualization$GoogleMaps.InfoWindow({
//		position: new scopes.modDataVisualization$GoogleMaps.LatLng(25,80),
//		content: 'Hello Joas'
//	});
//	i.addEventListener(infoWindowCallback, i.EVENT_TYPES.CLOSECLICK);
////	i.open(maps[0]);
//
//	i.open(map2, m);	
	
	//Start automatic update
//	plugins.scheduler.addJob('test',new Date(Date.now()+10000),update,10000)
}

/**
 * @properties={typeid:24,uuid:"A5E83270-9AF5-4D09-811F-A91B45D6374C"}
 */
function markerCallback(event, data) {
	application.output("MARKERCALLBACK: " + data);
//	var i = new scopes.modDataVisualization$GoogleMaps.InfoWindow({
//		position: new scopes.modDataVisualization$GoogleMaps.LatLng(5,52),
//		content: 'Hello Joas'
//	});
//	i.open(maps[0], m);
}

/**
 * @param {Object} event
 * @param {Object} data
 * @param {{test:Array<{id:String, description:String}>}} ok
 *
 * @properties={typeid:24,uuid:"23B372AA-7272-403D-8CD8-3850F4BF78EA"}
 */
function infoWindowCallback(event, data, ok) {
	ok.test[0].description
	application.output("INFOWINDOWCALLBACK: " + data);
}


/**
 * @properties={typeid:24,uuid:"B5E8B0AA-CF7C-4CDF-B540-1DE9597EAEF3"}
 */
function openInfoWindow() {
	i.open(map2, m);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"B05AF299-FA0F-48F8-81AB-B9C6C8A1F538"}
 */
function panToBounds(event) {
	var bounds = new scopes.modDataVisualization$GoogleMaps.LatLngBounds(m2.getPosition(),m.getPosition());
//	map2.fitBounds(bounds);
	map2.panToBounds(bounds);
}
