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
		var sw = new scopes.modGoogleMaps.LatLng((Math.random() * 180).toFixed(0)-90, (Math.random() * 360).toFixed(0)-180)
		var ne = new scopes.modGoogleMaps.LatLng((Math.random() * 180).toFixed(0)-90, (Math.random() * 360).toFixed(0)-180)
		var bounds = new scopes.modGoogleMaps.LatLngBounds(sw,ne)
		maps[i].setZoom(parseInt((Math.random() * 10).toFixed(0)))
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
	gauges.push(new scopes.modJustGauge.JustGauge(elements.gauge1,{
		value: 67, 
	    min: 0,
	    max: 100,
	    title: "Visitors"
	}))
	
	gauges.push(new scopes.modJustGauge.JustGauge(elements.gauge2,{
		title: 'Features',
		value: (Math.random() * 100).toFixed(0)
	}))
	
	gauges.push(new scopes.modJustGauge.JustGauge(elements.gauge3,{
		title: 'Tasks',
		value: (Math.random() * 100).toFixed(0)
	}))
	
	gauges.push(new scopes.modJustGauge.JustGauge(elements.gauge4,{
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
	scopes.modGoogleCharts.GeoChart(elements.geochart, data, options)
	
	//Instantiate GoogleMaps
	var map = new scopes.modGoogleMaps.GoogleMap(elements.maps, {
		zoom: 8,
		center: new scopes.modGoogleMaps.LatLng(-34.397, 150.644),
		mapTypeId: scopes.modGoogleMaps.MapTypeIds.HYBRID
	})
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
	
		
	var m = new scopes.modGoogleMaps.Marker({
		position: new scopes.modGoogleMaps.LatLng(10,20),
		draggable: true,
		title: 'Hello Paul',
		map: map
	});
	m.addEventListener(markerCallback,m.EVENT_TYPES.CLICK);
	m.addEventListener(markerCallback,m.EVENT_TYPES.DBLCLICK);
	m.addEventListener(markerCallback,m.EVENT_TYPES.RIGHTCLICK);
	m.addEventListener(markerCallback,m.EVENT_TYPES.DRAGEND);
	
	m = new scopes.modGoogleMaps.Marker({
		position: new scopes.modGoogleMaps.LatLng(52,5),
		draggable: true,
		title: 'Hello Joas',
		map: map
	});
	m.addEventListener(markerCallback,m.EVENT_TYPES.CLICK);
	
	
	var lineChart = new scopes.modFlotr2.LineChart(elements.flotr2$line)
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
	
	var barChart = new scopes.modFlotr2.PieChart(elements.flotr2$pie)
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

