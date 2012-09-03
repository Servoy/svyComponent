/**
 * @type {Array<scopes.modJustGauge.JustGauge>}
 *
 * @properties={typeid:35,uuid:"8151F77F-6C93-49A3-81E8-03DBE7CA0FBB",variableType:-4}
 */
var gauges = []

/**
 * @type {Array<scopes.modGoogleMaps.GoogleMap>}
 *
 * @properties={typeid:35,uuid:"0236ED8A-A80D-4577-B3E3-7603CA724ABD",variableType:-4}
 */
var maps = []

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"742136BD-C97B-4989-8739-D4E86830A46D",variableType:-4}
 */
var autoUpdate = true

/**
 * @properties={typeid:24,uuid:"6339D4F4-0D29-445C-A833-68D97EAA7C2E"}
 */
function update() {
	if (!autoUpdate) return
	
	for (var i = 0; i < gauges.length; i++) {
		gauges[i].refresh((Math.random() * 100).toFixed(0))
	}
	
	for (i = 0; i < maps.length; i++) {
		var sw = new scopes.modGoogleMaps.LatLng((Math.random() * 180).toFixed(0)-90, (Math.random() * 360).toFixed(0)-180)
		var ne = new scopes.modGoogleMaps.LatLng((Math.random() * 180).toFixed(0)-90, (Math.random() * 360).toFixed(0)-180)
		var bounds = new scopes.modGoogleMaps.LatLngBounds(sw,ne)
		maps[i].setZoom((Math.random() * 10).toFixed(0))
		maps[i].panToBounds(bounds)
	}
}

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"9EF1BF38-81F1-4429-8683-BAD735FB0CEA"}
 */
function onLoad(event) {
	//Instantiate Gauges
	var option = {
		value: 67, 
	    min: 0,
	    max: 100,
	    title: "Visitors"
	}
	gauges.push(new scopes.modJustGauge.JustGauge(elements.gauge1,option))
		
	option = {
		title: 'Features',
		value: (Math.random() * 100).toFixed(0)
	}
	gauges.push(new scopes.modJustGauge.JustGauge(elements.gauge2,option))
	
	option = {
		title: 'Tasks',
		value: (Math.random() * 100).toFixed(0)
	}
	gauges.push(new scopes.modJustGauge.JustGauge(elements.gauge3,option))
	
	option = {
		title: 'Bugs',
		value: (Math.random() * 100).toFixed(0)
	}
	gauges.push(new scopes.modJustGauge.JustGauge(elements.gauge4,option))
	
//	//Instantiate Google GeoChart
//	var data = [
//		['NL', 1000],
//		['GB', 500],
//		['RO', 50],
//		['US', 750]
//	]
//	
//	var options = {
//		 colorAxis: {colors: ['green','orange']}
//	}
//	var geo = scopes.modGoogleCharts.GeoChart(elements.geochart, data, options)
	
	//Instantiate GoogleMaps
	var map = new scopes.modGoogleMaps.GoogleMap(elements.maps, {
		zoom: 8,
		center: new scopes.modGoogleMaps.LatLng(-34.397, 150.644),
		mapTypeId: scopes.modGoogleMaps.MapTypeIds.HYBRID
	})
	//map.render()
	maps.push(map)
	
	map = new scopes.modGoogleMaps.GoogleMap(elements.map2, {
		zoom: 2,
		center: new scopes.modGoogleMaps.LatLng(10, 20),
		mapTypeId: scopes.modGoogleMaps.MapTypeIds.TERRAIN,
		overviewMapControl: true,
		panControl: true,
		rotateControl: true,
		scaleControl: true,
		zoomControl: true,
		mapMaker: false
	})
	maps.push(map)
	
		
	var m = new scopes.modGoogleMaps.Marker()
	m.setPosition(new scopes.modGoogleMaps.LatLng(10,20))
	m.setTitle('Hello Paul')
	m.setDraggable(true)
	m.setMap(map)
//	//map.render()
	
	plugins.scheduler.addJob('test',new Date(Date.now()+10000),update,10000)
}
