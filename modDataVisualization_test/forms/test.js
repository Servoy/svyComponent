/**
 * @type {Array<scopes.modDataVisualization$JustGauge.JustGauge>}
 *
 * @properties={typeid:35,uuid:"8151F77F-6C93-49A3-81E8-03DBE7CA0FBB",variableType:-4}
 */
var gauges = []

/**
 * @type {Array<scopes.modDataVisualization$GoogleMaps.Map>}
 *
 * @properties={typeid:35,uuid:"0236ED8A-A80D-4577-B3E3-7603CA724ABD",variableType:-4}
 */
var maps = []

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"742136BD-C97B-4989-8739-D4E86830A46D",variableType:-4}
 */
var autoUpdate = false

/**
 * @properties={typeid:24,uuid:"4E2FEE74-8C57-42B5-9750-B8C5BA1098DF"}
 */
function manualUpdate() {
	update(true)
}

/**
 * @param {Boolean} force
 * @properties={typeid:24,uuid:"6339D4F4-0D29-445C-A833-68D97EAA7C2E"}
 */
function update(force) {
	if (!force && !autoUpdate) return
	
	for (var i = 0; i < gauges.length; i++) {
		gauges[i].refresh((Math.random() * 100).toFixed(0))
	}
	
	for (i = 0; i < maps.length; i++) {
		addMarker(null, maps[i]);
		
		var bounds = getMarkerBounds(maps[i])
		if (bounds) {
			maps[i].fitBounds(bounds);
		}
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
	gauges.push(new scopes.modDataVisualization$JustGauge.JustGauge(elements.gauge1,{
		value: 67, 
	    min: 0,
	    max: 100,
	    title: "Visitors"
	}))
	
	gauges.push(new scopes.modDataVisualization$JustGauge.JustGauge(elements.gauge2,{
		title: 'Features',
		value: (Math.random() * 100).toFixed(0)
	}))
	
	gauges.push(new scopes.modDataVisualization$JustGauge.JustGauge(elements.gauge3,{
		title: 'Tasks',
		value: (Math.random() * 100).toFixed(0)
	}))
	
	gauges.push(new scopes.modDataVisualization$JustGauge.JustGauge(elements.gauge4,{
		title: 'Bugs',
		value: (Math.random() * 100).toFixed(0)
	}))
	
	//Instantiate Google GeoChart
	var data = [
		['Country', 'weight'],
		['NL', 1000],
		['GB', 500],
		['RO', 50],
		['US', 750]
	]
	
	var options = {
		 colorAxis: {colors: ['yellow','red']}
	}
	scopes.modDataVisualization$GoogleCharts.GeoChart(elements.geochart, data, options)
	
	//Instantiate GoogleMaps
	var map = new scopes.modDataVisualization$GoogleMaps.Map(elements.maps, {
		zoom: 8,
		center: new scopes.modDataVisualization$GoogleMaps.LatLng(-34.397, 150.644),
		mapTypeId: scopes.modDataVisualization$GoogleMaps.MapTypeIds.HYBRID
	})
	maps.push(map)
	
	var map2 = new scopes.modDataVisualization$GoogleMaps.Map(elements.map2, {
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
	
	//Adding markers	
	var m = new scopes.modDataVisualization$GoogleMaps.Marker({
		position: new scopes.modDataVisualization$GoogleMaps.LatLng(10,20),
		draggable: true,
		title: 'Hello Paul'
	});
	m.setMap(map2)
	m.addEventListener(markerCallback,m.EVENT_TYPES.CLICK);
	
	m = new scopes.modDataVisualization$GoogleMaps.Marker({
		position: new scopes.modDataVisualization$GoogleMaps.LatLng(48.16780746339156,59.84375),
		draggable: true,
		title: 'hoi',
//		title: '<span style=\'color: red\'>Hello Joas</span><br/>Check <a href="http://www.servoy.com" target="new">this site</a>',
		map: map2
	});
	m.addEventListener(markerCallback,m.EVENT_TYPES.CLICK);
	m.addEventListener(markerCallback,m.EVENT_TYPES.DBLCLICK);
	m.addEventListener(markerCallback,m.EVENT_TYPES.RIGHTCLICK);
	m.addEventListener(markerCallback,m.EVENT_TYPES.DRAGEND);
	
	//Adding infoWindows
	var i = new scopes.modDataVisualization$GoogleMaps.InfoWindow({
		content: 'Hello India'
	});
	i.open(map2, m);
	
	var pos = getLatLng('De Brand 65 3823 LJ Amersfoort')
	
	var i2 = new scopes.modDataVisualization$GoogleMaps.InfoWindow({
		position: new scopes.modDataVisualization$GoogleMaps.LatLng(pos.lat,pos.lng),
		content: scopes.modDataVisualization.stripCDataTags(<div>
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
	i2.open(map2);	
	
	var lineChart = new scopes.modDataVisualization$Flotr2.LineChart(elements.flotr2$line)
	lineChart.draw({
				data: [[1, 7000], [2, 13000], [3, 11000], [4, 15500], [5, 17000], [6, 21500], [7, 15136], [8, 8764], [9, 7345], [10, 11874], [11, 9837] ],
				lines: {
					lineWidth: 0.5, show: true, fill: true, fillColor: ['#fcefe3', '#efbc93'], fillOpacity: 0.34
				}, 
				points: { show: true, fill: true, fillColor: '#e79a70', hitRadius: 7 }
	}, {
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
	
	var barChart = new scopes.modDataVisualization$Flotr2.PieChart(elements.flotr2$pie)
	var d1 = [[0, 4]],
    d2 = [[0, 3]],
    d3 = [[0, 1.03]],
    d4 = [[0, 3.5]]
	barChart.draw([
    { data : d1, label : 'Comedy' },
    { data : d2, label : 'Action' },
    { data : d3, label : 'Romance',
      pie : {
        explode : 50
      }
    },
    { data : d4, label : 'Drama' }
  ], {
	    HtmlText : false,
	    grid : {
	      outline: '',
	      verticalLines : false,
	      horizontalLines : false
	    },
	    xaxis : { showLabels : false },
	    yaxis : { showLabels : false },
	    pie : {
	      show : true, 
	      explode : 6
	    },
	    mouse : { track : true },
	    legend : {
	      position : 'se',
	      backgroundColor : '#D2E8FF'
	    }
	  })
	
//This bit is clientside code for Flotr to allow zooming... how to integrate this?
//	// Draw graph with default options, overwriting with passed options
//	function drawGraph(opts) {
//		// Clone the options, so the 'options' variable always keeps intact.
//		o = Flotr._.extend(Flotr._.clone(options), opts || { });
//
//		// Return a new graph.
//		return Flotr.draw(container,
//			[d2],
//			o
//		);
//	}
//
//	graph = drawGraph();
//
//	Flotr.EventAdapter.observe(container, 'flotr:select', function(area) {
//			// Draw selected area
//			graph = drawGraph({
//				xaxis: { min: area.x1, max: area.x2, tickFormatter: monthValue},
//				yaxis: { min: area.y1, max: area.y2, margin: false}
//			});
//		});
//
//	// When graph is clicked, draw the graph with default area.
//	Flotr.EventAdapter.observe(container, 'flotr:click', function() {
//			graph = drawGraph();
//		});
	
	//Start automatic update
	plugins.scheduler.addJob('test',new Date(Date.now()+10000),update,10000)
}

/**
 * @properties={typeid:24,uuid:"90F7FE19-B6F1-4DB4-8437-6F56E5C4C035"}
 */
function markerCallback(event, data) {
	application.output("MARKERCALLBACK: " + data);
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} [event] the event that triggered the action
 * @param {scopes.modDataVisualization$GoogleMaps.Map} map
 *
 * @properties={typeid:24,uuid:"BC59C8F4-194C-44B9-996C-4DA40ABD1AC5"}
 */
function addMarker(event, map) {
	//Adding random marker
	var marker = new scopes.modDataVisualization$GoogleMaps.Marker({
		position: new scopes.modDataVisualization$GoogleMaps.LatLng((Math.random() * 180).toFixed(0)-90, (Math.random() * 360).toFixed(0)-180),
		draggable: true,
		title: 'Random marker'
	})
	marker.setMap(map);
	
	//Add infowindow on the click event
	marker.addEventListener(addInfoWindow, marker.EVENT_TYPES.CLICK);
}

/**
 * @param {Object} event
 * @param {Object} args
 *
 * @properties={typeid:24,uuid:"884AC979-A6FC-4E1B-AD24-C8BF439AA98E"}
 */
function addInfoWindow(event, args) {
	if (args) {
		/** @type {scopes.modDataVisualization$GoogleMaps.Marker} */
		var marker;
		
		var marker_id = args[1];
		
		var mapid = JSON.parse(args[3]).mapid;
		if (mapid && forms[mapid]) {
			marker = forms[mapid].markers[marker_id];
		}
	}
	
	//Get content from marker if available 
	var content;
	if (marker) {
		content = "<b>" + marker.getTitle() + "</b><br>Position: (" + marker.getPosition().lat() + "," + marker.getPosition().lng() + ")";
	}
	
	//Adding infoWindow
	var infoWindow = new scopes.modDataVisualization$GoogleMaps.InfoWindow({
		content: content
	});
//	infoWindow.addEventListener(infoWindow, infoWindow.EVENT_TYPES.CLOSECLICK);
	infoWindow.open(maps[mapid], marker);
}

/**
 * Warning: this function utilizes Google Maps API. See https://developers.google.com/maps/terms#section_10_12 for the Terms of Service
 * 
 * TODO: properly handle exceptions, like other status codes than OK, figure out what to return or to throw exceptions 
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
	if (response.getStatusCode() == plugins.http.HTTP_STATUS.SC_OK) {
		/** @type {{results: Array<{}>, status: String}}*/
		var result = JSON.parse(response.getResponseBody())
		if (result.status == 'OK') {
			return {lat: result.results[0].geometry.location.lat, lng: result.results[0].geometry.location.lng}
		}
	}
	return null
}

/**
 * @properties={typeid:24,uuid:"A275C2E0-4BA2-423E-80E9-49E02C03705F"}
 */
function testCCCFail() {
	jsunit.assertEquals(1,2)
}

/**
 * Creates a LatLngBound including all markers and calls fitBounds on the map, so it zooms to show all markers 
 *
 * @param {Object} event
 *
 * @properties={typeid:24,uuid:"BDFE1CC7-EBF4-4DDE-9261-59EB31E39150"}
 */
function fitBounds(event) {
	for (var i = 0; i < maps.length; i++) {
		var bounds = getMarkerBounds(maps[i])
		if (bounds) {
			maps[i].fitBounds(bounds);
		}
	}
}

/**
 * Returns LatLngBounds including all markers on the map
 * 
 * @param {scopes.modDataVisualization$GoogleMaps.Map} map
 * 
 * @return {scopes.modDataVisualization$GoogleMaps.LatLngBounds}
 *
 * @properties={typeid:24,uuid:"92C09082-F003-4165-92F9-0D1FE182DA12"}
 */
function getMarkerBounds(map) {
	var bounds, pos1, index = 1;
	if (forms[map.getId()].markers) {
		for (var i in forms[map.getId()].markers) {
			//TODO: make this nicer
			if (index == 1) {
				pos1 = forms[map.getId()].markers[i].getPosition();
			} else if (index == 2) {
				bounds = new scopes.modDataVisualization$GoogleMaps.LatLngBounds(forms[map.getId()].markers[i].getPosition(), pos1);
			} else {
				bounds.extend(forms[map.getId()].markers[i].getPosition());
			}
			index++;
		}
	}
	return bounds;
}