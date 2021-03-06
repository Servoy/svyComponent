/**
 * @type {Array<scopes.modDataVis$justGage.JustGauge>}
 *
 * @properties={typeid:35,uuid:"8151F77F-6C93-49A3-81E8-03DBE7CA0FBB",variableType:-4}
 */
var gauges = []

/**
 * @type {Array<{map: scopes.svyGoogleMaps.Map, markers: Array<scopes.svyGoogleMaps.Marker>}>}
 *
 * @properties={typeid:35,uuid:"0236ED8A-A80D-4577-B3E3-7603CA724ABD",variableType:-4}
 */
var maps = []

/**
 * @type {scopes.modDataVis$googleCharts.GeoChart}
 *
 * @properties={typeid:35,uuid:"93E9F4E9-B041-4B2B-9C8D-AA9CEFB23F36",variableType:-4}
 */
var geoChart
/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"742136BD-C97B-4989-8739-D4E86830A46D",variableType:-4}
 */
var autoUpdate = false

/**
 * @param {JSEvent} event
 * @properties={typeid:24,uuid:"4E2FEE74-8C57-42B5-9750-B8C5BA1098DF"}
 */
function manualUpdate(event) {
	application.output(event)
	update(true)
}

/**
 * @param {Boolean} force
 * @properties={typeid:24,uuid:"6339D4F4-0D29-445C-A833-68D97EAA7C2E"}
 */
function update(force) {
	if (!force && !autoUpdate) {
		return
	}
	
	for (var i = 0; i < gauges.length; i++) {
		gauges[i].refresh(parseInt((Math.random() * 100).toFixed(0)))
	}
	
	for (i = 0; i < maps.length; i++) {
		addMarker(null, maps[i]);
		fitBounds()
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
	gauges.push(new scopes.modDataVis$justGage.JustGauge(elements.gauge1, {
			value: 67,
			min: 0,
			max: 100,
			title: "Visitors"
		}))

	
	gauges.push(new scopes.modDataVis$justGage.JustGauge(elements.gauge2, {
			title: 'Features',
			value: parseInt( (Math.random() * 100).toFixed(0))
		}))

	gauges.push(new scopes.modDataVis$justGage.JustGauge(elements.gauge3, {
			title: 'Tasks',
			value: parseInt( (Math.random() * 100).toFixed(0)),
			donut: true
		}))

	gauges.push(new scopes.modDataVis$justGage.JustGauge(elements.gauge4, {
			title: 'Bugs',
			value: parseInt( (Math.random() * 100).toFixed(0)),
			donut: true
		}))

	//Instantiate Google GeoChart
	geoChart = new scopes.modDataVis$googleCharts.GeoChart(elements.geochart)
	var data = [['Country', 'weight'],
		['NL', 1000],
		['GB', 500],
		['RO', 50],
		['US', 750]]

	var options = {
		colorAxis: { colors: ['yellow', 'red'] }
	}
	geoChart.draw(data, options)
	geoChart.addRegionClickListener(callbackLogger)
	geoChart.addSelectListener(callbackLogger)

	//Instantiate GoogleMaps
	var gmaps = scopes.svyGoogleMaps;
	var map = new gmaps.Map(elements.maps, {
				zoom: 8,
				center: new gmaps.LatLng(-34.397, 150.644),
				mapTypeId: gmaps.MapTypeIds.HYBRID
			})
	maps.push({ map: map, markers: [] })

	var map2 = new gmaps.Map(elements.map2, {
				zoom: 2,
				center: new gmaps.LatLng(30, 20),
				mapTypeId: gmaps.MapTypeIds.TERRAIN,
				overviewMapControl: true,
				panControl: true,
				rotateControl: true,
				scaleControl: true,
				zoomControl: true,
				mapMaker: false
			})

	//Adding markers
	var m = new gmaps.Marker({
			position: new gmaps.LatLng(10, 20),
			draggable: true,
			title: 'Hello you'
		});
	m.setMap(map2)
	m.addClickListener(callbackLogger)
	m.addDoubleClickListener(callbackLogger)
	m.addRightClickListener(callbackLogger)
	m.addPositionChangedListener(callbackLogger)

	var pos = getLatLng('De Brand 65 3823 LJ Amersfoort')
	if (!pos) {
		maps.push({ map: map2, markers: [m] })
	} else {
		var m2 = new gmaps.Marker({
				position: new gmaps.LatLng(pos.lat, pos.lng),
				draggable: false,
				title: 'Servoy HQ',
				map: map2
			});
		m2.addClickListener(addInfoWindow)
		m2.addDoubleClickListener(callbackLogger)
		m2.addRightClickListener(callbackLogger)

		maps.push({ map: map2, markers: [m, m2] })

		var i2 = new gmaps.InfoWindow({
				content: scopes.svyWebClientUtils.XHTML2Text(<div>
				<b>Servoy BV</b>   <a href="http://www.servoy.com" target="new">more information</a>
				<p>De Brand 65<br/>
				3823 LJ Amersfoort<br/>
				The Netherlands<br/>
				Voice: +31 33 455 9877<br/>
				Fax: +31 84 883 2297<br/>
				<br/>
				<span style="display: block;width: 100%; height: 1px; border: 0px solid lightgray; border-bottom-width: 1px"/>
				<br/>
				<a href="javascript:void()">20 likes</a>
				</p>
			</div>)

			});
		i2.open(map2, m2);
	}
	
	//scopes.svyWebClientUtils.addJavaScriptDependancy('media:///ClientSideCode.js')
	
	var lineChart = new scopes.modDataVis$flotr2.FlotrChart(elements.flotr2$line, scopes.modDataVis$flotr2.CHART_TYPES.LINES)
	lineChart.draw([{
			data: [[1, 7000], [2, 13000], [3, 11000], [4, 15500], [5, 17000], [6, 21500], [7, 15136], [8, 8764], [9, 7345], [10, 11874], [11, 9837]],
			lines: {
				lineWidth: 0.5, show: true, fill: true, fillColor: ['#fcefe3', '#efbc93'], fillOpacity: 0.34
			},
			points: { show: true, fill: true, fillColor: '#e79a70', hitRadius: 7 }
		}], {
			colors: ['#e79a70'],
			shadowSize: 0,
			fontColor: '#e1e1e1',
			fontSize: 20,
			xaxis: {
				noTicks: 9,
				min: 1.5,
				max: 10.5
			},
			yaxis: {
				showLabels: true,
				min: 0,
				max: 25100,
				margin: false
			},
			grid: {
				outline: 's',
				verticalLines: false,
				hoverable: true,
				clickable: true,
				color: '#a7a7a7'

			},
			selection: {
				mode: 'x'
			},
			mouse: {
				track: true,
				relative: true,
				position: 'n',

				lineColor: '#e79a70',
				fillOpacity: 0,
				sensibility: 20
			}
		})

	lineChart.addClickListener(callbackLogger)
	lineChart.addSelectListener(callbackLogger)

	var pieChart = new scopes.modDataVis$flotr2.FlotrChart(elements.flotr2$pie, scopes.modDataVis$flotr2.CHART_TYPES.PIES)
	pieChart.draw([
	    { data : [[0, 4]], label : 'Comedy' },
	    { data : [[0, 3]], label : 'Action' },
	    { data : [[0, 1.03]], label : 'Romance', pie : { explode : 50}},
	    { data : [[0, 3.5]], label : 'Drama' }
	  ], {
	  		HtmlText: false,
			grid: {
				outline: '',
				verticalLines: false,
				horizontalLines: false
			},
			xaxis: { showLabels: false },
			yaxis: { showLabels: false },
			pie: {
				show: true,
				explode: 6
			},
			mouse: { track: true },
			legend: {
				position: 'se',
				backgroundColor: '#D2E8FF'
			}
		})

	//Start automatic update
	plugins.scheduler.addJob('test', new Date(Date.now() + 10000), update, 10000)
}

/**
 * @properties={typeid:24,uuid:"90F7FE19-B6F1-4DB4-8437-6F56E5C4C035"}
 * @param {scopes.svyGoogleMaps.Event} event
 */
function callbackLogger(event) {
	application.output("CALLBACK: " + event)
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} [event] the event that triggered the action
 * @param {{map: scopes.svyGoogleMaps.Map, markers: Array<scopes.svyGoogleMaps.Marker>}} map
 *
 * @properties={typeid:24,uuid:"BC59C8F4-194C-44B9-996C-4DA40ABD1AC5"}
 */
function addMarker(event, map) {
	//Adding random marker
	var marker = new scopes.svyGoogleMaps.Marker({
		position: new scopes.svyGoogleMaps.LatLng((Math.random() * 180).toFixed(0)-90, (Math.random() * 360).toFixed(0)-180),
		draggable: true,
		title: 'Random marker'
	})
	marker.setMap(map.map);
	
	map.markers.push(marker)
	//Add infowindow on the click event
	marker.addClickListener(addInfoWindow)
}

/**
 * @type {scopes.svyGoogleMaps.InfoWindow}
 *
 * @properties={typeid:35,uuid:"D96A0A49-CE6F-4D58-AE1C-34FEE29E1289",variableType:-4}
 */
var infoWindow

/**
 * @param {scopes.svyGoogleMaps.Event} event
 *
 * @properties={typeid:24,uuid:"884AC979-A6FC-4E1B-AD24-C8BF439AA98E"}
 */
function addInfoWindow(event) {
	/** @type {scopes.svyGoogleMaps.Marker} */
	var marker = event.getSource()
	//Adding infoWindow
	infoWindow = new scopes.svyGoogleMaps.InfoWindow({
		position: new scopes.svyGoogleMaps.LatLng(20,20),
		content: scopes.svyWebClientUtils.XHTML2Text(<div>
			<b>Servoy BV</b>   <a href="http://www.servoy.com" target="new">more information</a>
			<p>De Brand 65<br/>
			3823 LJ Amersfoort<br/>
			The Netherlands<br/>
			Voice: +31 33 455 9877<br/>
			Fax: +31 84 883 2297<br/>
			<br/>
			<span style="display: block;width: 100%; height: 1px; border: 0px solid lightgray; border-bottom-width: 1px"/>
			<a href="javascript:void()">20 likes</a>
			</p>
		</div>)
	});
//	infoWindow.addEventListener(infoWindow, infoWindow.EVENT_TYPES.CLOSECLICK);
	infoWindow.open(marker.getMap(), marker);
	
	scopes.svyWebClientUtils.updateUI()
	infoWindow.setPosition(new scopes.svyGoogleMaps.LatLng(50,50))
}

/**
 * Warning: this function utilizes Google Maps API. See https://developers.google.com/maps/terms#section_10_12 for the Terms of Service
 * 
 * @see https://developers.google.com/maps/documentation/geocoding/
 * 
 * @param {String} address
 * @return {{lat: Number, lng: Number}}
 *
 * @properties={typeid:24,uuid:"3D54D77D-7B61-4094-B980-A87669315F75"}
 */
function getLatLng(address) {
	var baseUrl = 'http://maps.googleapis.com/maps/api/geocode/json?'
	var url = baseUrl + 'address=' + encodeURIComponent(address) + '&sensor=false'
	var client = plugins.http.createNewHttpClient()
	var request = client.createGetRequest(url)
	var response = request.executeRequest()
	if (response && response.getStatusCode() == plugins.http.HTTP_STATUS.SC_OK) {
		/** @type {{results: Array<{}>, status: String}}*/
		var result = JSON.parse(response.getResponseBody())
		if (result.status == 'OK') {
			return {lat: result.results[0]['geometry'].location.lat, lng: result.results[0]['geometry'].location.lng}
		}
	}
	return null
}

/**
 * @properties={typeid:24,uuid:"47735676-7D85-4E08-9FAD-4B788B9B47D8"}
 */
function fitBounds() {
	for (var i = 0; i < maps.length; i++) {
		var markers = maps[i].markers
		if (markers.length) {
			var bounds = new scopes.svyGoogleMaps.LatLngBounds(markers[0].getPosition(), markers[0].getPosition())
			for (var z = 1; z < markers.length; z++) {
				bounds.extend(markers[z].getPosition())
			}
			maps[i].map.fitBounds(bounds);
		}
	}
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"54802030-AC4C-41B8-AD3C-03AF6DEB98CD"}
 */
function changeGeoChartContent(event) {
//	var data = [
//	    ['Country', 'Popularity'],
//	    ['Germany', 200],
//	    ['United States', 300],
//	    ['Brazil', 400],
//	    ['Canada', 500],
//	    ['France', 600],
//	    ['RU', 700]
//	  ]
//	  
//	var options = {}
//	
    var data = [
	    ['City',   'Population', 'Area'],
	    ['Rome',      2761477,    1285.31],
	    ['Milan',     1324110,    181.76],
	    ['Naples',    959574,     117.27],
	    ['Turin',     907563,     130.17],
	    ['Palermo',   655875,     158.9],
	    ['Genoa',     607906,     243.60],
	    ['Bologna',   380181,     140.7],
	    ['Florence',  371282,     102.41],
	    ['Fiumicino', 67370,      213.44],
	    ['Anzio',     52192,      43.43],
	    ['Ciampino',  38262,      11]
	  ]
	
	  var options = {
	    region: 'IT',
	    displayMode: 'markers',
	    colorAxis: {colors: ['green', 'blue']}
	  };
	geoChart.draw(data,options)
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"69DF2D0D-2ACB-4142-9023-FB549FFAB975"}
 */
function showMapIndialog(event) {
	var win = application.createWindow('mapdialog', JSWindow.DIALOG)
	win.title = 'Dialog Test'
	win.show(forms.mapDialog)
}
