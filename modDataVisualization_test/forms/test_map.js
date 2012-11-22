/**
 * @type {scopes.modDataVis$googleMaps.Map}
 *
 * @properties={typeid:35,uuid:"0950DF83-B81B-43F6-B159-1E0898DDFDD0",variableType:-4}
 */
var map2;

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
	
	for (var j = 0; j < maps.length; j++) {
		//Add random marker;
		addMarker(null, maps[j]);
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
	//Instantiate GoogleMaps
	map2 = new scopes.modDataVis$googleMaps.Map(elements.map2, {
		zoom: 2,
		center: new scopes.modDataVis$googleMaps.LatLng(30, 20),
		mapTypeId: scopes.modDataVis$googleMaps.MapTypeIds.TERRAIN,
		overviewMapControl: true,
		panControl: true,
		rotateControl: true,
		scaleControl: true,
		zoomControl: true,
		mapMaker: false
	})
	maps.push(map2)
	
	//Create marker
	var m = new scopes.modDataVis$googleMaps.Marker({
		position: new scopes.modDataVis$googleMaps.LatLng(42,5),
		draggable: true,
		title: 'Hello Joas'
	});
	m.setMap(map2);
	m.addEventListener(addInfoWindow,m.EVENT_TYPES.CLICK);
	m.addEventListener(markerCallback,m.EVENT_TYPES.DBLCLICK);
	m.addEventListener(markerCallback,m.EVENT_TYPES.RIGHTCLICK);
	m.addEventListener(markerCallback,m.EVENT_TYPES.DRAGEND);
	
	var m2 = new scopes.modDataVis$googleMaps.Marker({
		position: new scopes.modDataVis$googleMaps.LatLng(62,30),
		draggable: true,
		title: 'Hello Joas'
	});
	m2.setMap(map2);
}

/**
 * @properties={typeid:24,uuid:"A5E83270-9AF5-4D09-811F-A91B45D6374C"}
 */
function markerCallback(event, data) {
	application.output("MARKERCALLBACK: " + data);
}
