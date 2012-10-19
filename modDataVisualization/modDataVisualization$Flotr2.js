/**
 * @properties={typeid:35,uuid:"E4A3D57C-AECE-4CF9-9817-D47A3306EEE3",variableType:-4}
 */
var init = function(){
	scopes.modDataVisualization.includeExCanvasForIE(8)
//	plugins.WebClientUtils.addJsReference('https://raw.github.com/HumbleSoftware/Flotr2/master/flotr2.min.js')
	plugins.WebClientUtils.addJsReference('media:///flotr2.min.js')
	//TODO: don't duplicate the generic part 
	var code = <script type='text/javascript'>
	<![CDATA[
		if (window.svyDataViz == undefined) var svyDataViz = {
			dynConstructor: function (Constructor) {
				//Helper function form dynamically calling a constructor function with arguments
				//http://stackoverflow.com/questions/3362471/how-can-i-call-a-javascript-constructor-using-call-or-apply
				var args = Array.prototype.slice.call(arguments, 1);
				return function() {

					var Temp = function() {}, // temporary constructor
						inst, ret; // other vars

					// Give the Temp constructor the Constructor's prototype
					Temp.prototype = Constructor.prototype;

					// Create a new instance
					inst = new Temp;

					// Call the original Constructor with the temp
					// instance as its context (i.e. its 'this' value)
					ret = Constructor.apply(inst, args);

					// If an object has been returned then return it otherwise
					// return the original instance.
					// (consistent with behaviour of the new operator)
					return Object(ret) === ret ? ret : inst;
				}
			},
			reviver: function (key, value) {
				//Helper function to deserialize JSON containing special objects that should map to clientside API
	    		if (value.hasOwnProperty('svySpecial') && value.svySpecial == true) {
	    			var object = value.scope||window
					for (var i = 0; i < value.parts.length; i++) {
						object = object[value.parts[i] ]
					}
					switch (value.type) {
						case 'call':
							return object.apply(value.scope ? window[value.scope] : null, value.args)
						case 'constructor':
							return svyDataViz.dynConstructor.apply(this, [object].concat(value.args))()
						case 'reference':
							return object
//								case 'domReference':
//									return document.getElementbyId(args[0])
						default:
							return
					}
	    		}
	    		return value
	    	}
		}
		svyDataViz.flotr2 = {
			charts: { },
			initialize: function() {
				for (var i = 0; i < arguments.length; i++) {
					var node = JSON.parse(this[arguments[i] ], svyDataViz.reviver)
					if (node.id) {
						Flotr.draw(document.getElementById(node.id),
							node.data,
							node.options
						);
					}
				}
			},
//			callbackIntermediate: function(id, eventType, event){
//				//Intermediate function to retrieve relevant data when events occur on a map and then send them to the server
//				var data
//				var chart = svyDataViz.googleGeoChart.charts[id]
//				switch (eventType) {
//					case 'select':
//						data = chart.getSelection()
//						break;
//					case 'regionClick':
//						data = event.region
//						break;
//					default:
//						break;
//				}
//				svyDataViz.googleGeoChart.chartEventHandler('geoChart', id, eventType,data)
//			}
		}
	]]>
	</script>
	
	//TODO: find a better way to do this: adding the UUID will prevent browsers caching the .js file
	var bytes = new Packages.java.lang.String(code).getBytes('UTF-8')
	var uuid = application.getUUID();
	solutionModel.newMedia('flotr2Handler_'+uuid+'.js', bytes)
	plugins.WebClientUtils.addJsReference('media:///flotr2Handler_'+uuid+'.js')
	
	//TODO: make the callback script generic on DataVizualization level, instead of having to add one on every impl.
	var callback = plugins.WebClientUtils.generateCallbackScript(browserCallback,['objectType', 'id', 'eventType', 'data'], false);
	var script = 'svyDataViz.flotr2.chartEventHandler = function(objectType, id, eventType, data){' + callback + '}';
	bytes = new Packages.java.lang.String(script).getBytes('UTF-8')
	uuid = application.getUUID();
	solutionModel.newMedia('flotr2HandlerCallback_'+uuid+'.js', bytes)
	plugins.WebClientUtils.addJsReference('media:///flotr2HandlerCallback_'+uuid+'.js')
}()

/**
 * @param {Any} args
 *
 * @properties={typeid:24,uuid:"D4DDD2B0-D830-45B0-AC21-D44BB8286730"}
 */
function browserCallback(args) {
	application.output(args)
}

// Attempt to create a base class for all chart types, to prevent code duplication. Didn't continue due to lack of prototype support in the JS editor
///**
// * @properties={typeid:24,uuid:"246F66E8-E857-43BF-96B1-6B770CB02070"}
// */
//function Flotr2Chart() {
//	/**@type {RuntimeForm<GoogleGeoChart>}*/
//	var dv = scopes.modDataVisualization.createVisualizationContainer(container, forms.Flotr2)
//
//	var setup = {
//		id: dv.getId(),
//		data: null,
//		options: null
//	}
//
//	dv = null;
//	
//	/**
//	 * @param {String} [incrementalUpdateCode]
//	 */
//	function updateState(incrementalUpdateCode) {
//		if (setup.id in forms) {
//			forms[setup.id].storeState(scopes.modDataVisualization.serializeObject(setup))
//			
//			if (forms[setup.id].isRendered()) {
//				plugins.WebClientUtils.executeClientSideJS(incrementalUpdateCode)
//			}
//		} else {
//			application.output('Invalid DataVisualizer reference') //TODO: better error messages
//		}
//	}
//}

/**
 * @constructor
 * 
 * @param {RuntimeTabPanel} container
 * 
 * @properties={typeid:24,uuid:"0541D364-9DF2-473D-B72F-E8D6F9DE6857"}
 */
function LineChart(container){
	/**@type {RuntimeForm<GoogleGeoChart>}*/
	var dv = scopes.modDataVisualization.createVisualizationContainer(container, forms.Flotr2)

	var setup = {
		id: dv.getId(),
		data: null,
		options: null
	}

	dv = null;
	
	/**
	 * @param {String} [incrementalUpdateCode]
	 */
	function updateState(incrementalUpdateCode) {
		if (setup.id in forms) {
			forms[setup.id].storeState(scopes.modDataVisualization.serializeObject(setup))
			
			if (incrementalUpdateCode && forms[setup.id].isRendered()) {
				plugins.WebClientUtils.executeClientSideJS(incrementalUpdateCode)
			}
		} else {
			application.output('Invalid DataVisualizer reference') //TODO: better error messages
		}
	}
	
	var defaultOptions = {
		colors: ['#00A8F0', '#C0D800', '#CB4B4B', '#4DA74D', '#9440ED'], //=> The default colorscheme. When there are > 5 series, additional colors are generated.
		ieBackgroundColor: '#FFFFFF', // Background color for excanvas clipping
		title: null, // => The graph's title
		subtitle: null, // => The graph's subtitle
		shadowSize: 4, // => size of the 'fake' shadow
		defaultType: null, // => default series type
		HtmlText: true, // => whether to draw the text using HTML or on the canvas
		fontColor: '#545454', // => default font color
		fontSize: 7.5, // => canvas' text font size
		resolution: 1, // => resolution of the graph, to have printer-friendly graphs !
		parseFloat: true, // => whether to preprocess data for floats (ie. if input is string)
		xaxis: {
			ticks: null, // => format: either [1, 3] or [[1, 'a'], 3]
			minorTicks: null, // => format: either [1, 3] or [[1, 'a'], 3]
			showLabels: true, // => setting to true will show the axis ticks labels, hide otherwise
			showMinorLabels: false, // => true to show the axis minor ticks labels, false to hide
			labelsAngle: 0, // => labels' angle, in degrees
			title: null, // => axis title
			titleAngle: 0, // => axis title's angle, in degrees
			noTicks: 5, // => number of ticks for automagically generated ticks
			minorTickFreq: null, // => number of minor ticks between major ticks for autogenerated ticks
			tickFormatter: Function, // => fn: number, Object -> string
			tickDecimals: null, // => no. of decimals, null means auto
			min: null, // => min. value to show, null means set automatically
			max: null, // => max. value to show, null means set automatically
			autoscale: false, // => Turns autoscaling on with true
			autoscaleMargin: 0, // => margin in % to add if auto-setting min/max
			color: null, // => color of the ticks
			mode: 'normal', // => can be 'time' or 'normal'
			timeFormat: null,
			timeMode: 'UTC', // => For UTC time ('local' for local time).
			timeUnit: 'millisecond', // => Unit for time (millisecond, second, minute, hour, day, month, year)
			scaling: 'linear', // => Scaling, can be 'linear' or 'logarithmic'
			base: Math.E,
			titleAlign: 'center',
			margin: true // => Turn off margins with false
		},
		x2axis: { },
		yaxis: {
			ticks: null, // => format: either [1, 3] or [[1, 'a'], 3]
			minorTicks: null, // => format: either [1, 3] or [[1, 'a'], 3]
			showLabels: true, // => setting to true will show the axis ticks labels, hide otherwise
			showMinorLabels: false, // => true to show the axis minor ticks labels, false to hide
			labelsAngle: 0, // => labels' angle, in degrees
			title: null, // => axis title
			titleAngle: 90, // => axis title's angle, in degrees
			noTicks: 5, // => number of ticks for automagically generated ticks
			minorTickFreq: null, // => number of minor ticks between major ticks for autogenerated ticks
			tickFormatter: Function, // => fn: number, Object -> string
			tickDecimals: null, // => no. of decimals, null means auto
			min: null, // => min. value to show, null means set automatically
			max: null, // => max. value to show, null means set automatically
			autoscale: false, // => Turns autoscaling on with true
			autoscaleMargin: 0, // => margin in % to add if auto-setting min/max
			color: null, // => The color of the ticks
			scaling: 'linear', // => Scaling, can be 'linear' or 'logarithmic'
			base: Math.E,
			titleAlign: 'center',
			margin: true // => Turn off margins with false
		},
		y2axis: {
			titleAngle: 270
		},
		grid: {
			color: '#545454', // => primary color used for outline and labels
			backgroundColor: null, // => null for transparent, else color string or array of colors strings for gradient
			backgroundImage: null, // => background image. String or object with src, left and top
			watermarkAlpha: 0.4, // =>
			tickColor: '#DDDDDD', // => color used for the ticks
			labelMargin: 3, // => margin in pixels
			verticalLines: true, // => whether to show gridlines in vertical direction
			minorVerticalLines: null, // => whether to show gridlines for minor ticks in vertical dir.
			horizontalLines: true, // => whether to show gridlines in horizontal direction
			minorHorizontalLines: null, // => whether to show gridlines for minor ticks in horizontal dir.
			outlineWidth: 1, // => width of the grid outline/border in pixels
			outline: 'nsew', // => walls of the outline to display
			circular: false, // => if set to true, the grid will be circular, must be used when radars are drawn
			clickable: null, //?????
			hoverable: null //?????
		},
		selection: { //?????
			mode: 'x'
		},
		crosshair: {
			mode: 'xy'
		},
		bars: { //?????
			show: true,
			stacked: false,
			horizontal: false,
			shadowSize: 0,
			barWidth: 0.5,
			lineWidth: 1,
			centered: true, //?????
			grouped: false //?????
		},
		pie: { //?????
			show: true,
			explode: 6
		},
		radar: { //?????
			show: true
		},
		bubbles: { //?????
			show: true, 
			baseRadius: 5
		},
		candles: { //?????
			show: true, 
			candleWidth: 0.6 
		},
		mouse: {
			track: false, // => true to track the mouse, no tracking otherwise
			trackAll: false,
			position: 'se', // => position of the value box (default south-east)
			relative: false, // => next to the mouse cursor
			trackFormatter: Function, // => formats the values in the value box
			margin: 5, // => margin in pixels of the valuebox
			lineColor: '#FF3F19', // => line color of points that are drawn when mouse comes near a value of a series
			trackDecimals: 1, // => decimals for the track values
			sensibility: 2, // => the lower this number, the more precise you have to aim to show a value
			trackY: true, // => whether or not to track the mouse in the y axis
			radius: 3, // => radius of the track point
			fillColor: null, // => color to fill our select bar with only applies to bar and similar graphs (only bars for now)
			fillOpacity: 0.4 // => opacity of the fill color, set to 1 for a solid fill, 0 hides the fill
		},
		legend: {
			position: 'se', // Position the legend 'south-east'.
			labelFormatter: Function, // Format the labels.
			backgroundColor: '#D2E8FF' // A light blue background color.
		}
	};
	
	//TODO: select and click handlers, custom formatters
	
	
	/**
	 * @param {Array<{
	 * data: Array<Array<Number>>, 
	 * label: String, 
	 * lines: { 
	 * 		lineWidth: Number, 
	 * 		show: Boolean, 
	 * 		fill: Boolean, 
	 * 		fillColor: Array<String>, 
	 * 		fillOpacity: Number 
	 * 	}, 
	 * 	points: { 
	 * 		show: Boolean, 
	 * 		fill: Boolean, 
	 * 		fillColor: String, 
	 * 		hitRadius: Number 
	 * 	},
	 * bars: {
	 * 	show: Boolean,
     *  barWidth: Number,
     *  lineWidth: Number,
     *  fillColor: {
     *    colors: Array<String>,
     *    start: String,
     *    end: String
     *  },
     *  fillOpacity: Number
	 * },
	 * markers: {
     *   show: Boolean,
     *   position: String,
     *   fontSize: Number,
     *  labelFormatter : Function
     * },
	 * pie : {
     *   explode : Number
     * },
     * mouse : { 
     * 	track : Boolean
     * }
     * }>} data
	 * @param {Object} options
	 */
	this.draw = function (data, options){
		setup.data = data
		setup.options = options
		updateState()
	}
	
	/**
	 * @return {DataSet}
	 */
	function DataSet() {
		this.label = function(text){
			return this
		}
	}
}

/**
 * @constructor
 * @param {RuntimeTabPanel} container
 * @properties={typeid:24,uuid:"AA567D33-980B-440B-8452-9D2C100C40A6"}
 */
function BarChart(container){
	/**@type {RuntimeForm<GoogleGeoChart>}*/
	var dv = scopes.modDataVisualization.createVisualizationContainer(container, forms.Flotr2)

	var setup = {
		id: dv.getId(),
		data: null,
		options: null
	}

	dv = null;
	
	/**
	 * @param {String} [incrementalUpdateCode]
	 */
	function updateState(incrementalUpdateCode) {
		if (setup.id in forms) {
			forms[setup.id].storeState(scopes.modDataVisualization.serializeObject(setup))
			
			if (incrementalUpdateCode && forms[setup.id].isRendered()) {
				plugins.WebClientUtils.executeClientSideJS(incrementalUpdateCode)
			}
		} else {
			application.output('Invalid DataVisualizer reference') //TODO: better error messages
		}
	}
	
	this.draw = function (data, options){
		setup.data = data
		setup.options = options
		updateState()
	}
}

/**
 * @constructor
 * @param {RuntimeTabPanel} container
 * @properties={typeid:24,uuid:"65F796B2-9CD4-490F-B5F1-CC768608D48C"}
 */
function PieChart(container){
	/**@type {RuntimeForm<GoogleGeoChart>}*/
	var dv = scopes.modDataVisualization.createVisualizationContainer(container, forms.Flotr2)

	var setup = {
		id: dv.getId(),
		data: null,
		options: null
	}

	dv = null;
	
	/**
	 * @param {String} [incrementalUpdateCode]
	 */
	function updateState(incrementalUpdateCode) {
		if (setup.id in forms) {
			forms[setup.id].storeState(scopes.modDataVisualization.serializeObject(setup))
			
			if (incrementalUpdateCode && forms[setup.id].isRendered()) {
				plugins.WebClientUtils.executeClientSideJS(incrementalUpdateCode)
			}
		} else {
			application.output('Invalid DataVisualizer reference') //TODO: better error messages
		}
	}
	
	this.draw = function (data, options){
		setup.data = data
		setup.options = options
		updateState()
	}
}

//Still to implement
///**
// * @constructor
// * @param {RuntimeTabPanel} container
// * @properties={typeid:24,uuid:"E1FBCD10-9C44-45B7-BDF3-99FFD668F071"}
// */
//function BubbleChart(container){
//	this.draw = function (data, options){}
//}
//
///**
// * @constructor
// * @param {RuntimeTabPanel} container
// * @properties={typeid:24,uuid:"7F899AE2-3D3B-441E-ABA3-7C7E26709D9D"}
// */
//function CandleStickChart(container){
//	this.draw = function (data, options){}
//}