/**
 * @properties={typeid:35,uuid:"DB2B4A22-779E-40DD-A9AF-4DA21C152156",variableType:-4}
 */
var init = function(){
	//TODO: don't duplicate the generic part 
	var code = <script type='text/javascript'>
	<![CDATA[
		var script = document.createElement("script");
	    script.type = "text/javascript";
	    script.src = 'http://www.google.com/jsapi?callback=svyDataVizGoogleAPICallback';
	    document.head.appendChild(script);
	
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
//							case 'domReference':
//								return document.getElementbyId(args[0])
						default:
							return
					}
	    		}
	    		return value
	    	}
		}
		svyDataViz.googleGeoChart = {
			charts: { },
			todos: [],
			initialize: function() {
				if (window.google && google.visualization && google.visualization.GeoChart) {	
					for (var i = 0; i < svyDataViz.googleGeoChart.todos.length; i++) {
						console.log(svyDataViz.googleGeoChart.todos[i])
						var node = JSON.parse(svyDataViz.googleGeoChart.todos[i], svyDataViz.reviver)
						if (node.id) {
							var chart = new google.visualization.GeoChart(document.getElementById(node.id))
							
							//Add eventhandlers
							google.visualization.events.addListener(chart, 'select', new Function ('event', "svyDataViz.googleGeoChart.callbackIntermediate.call(this, '"+node.id+"', 'select', event)"));
							google.visualization.events.addListener(chart, 'regionClick', new Function ('event', "svyDataViz.googleGeoChart.callbackIntermediate.call(this, '"+node.id+"', 'regionClick', event)"));
							
							var data = google.visualization.arrayToDataTable(node.data)
							chart.draw(data, node.options)
							svyDataViz.googleGeoChart.charts[node.id] = chart
						}
					}
					svyDataViz.googleGeoChart.todos = []
				}
			},
			callbackIntermediate: function(id, eventType, event){
				//Intermediate function to retrieve relevant data when events occur on a map and then send them to the server
				var data
				var chart = svyDataViz.googleGeoChart.charts[id]
				switch (eventType) {
					case 'select':
						data = chart.getSelection()
						break;
					case 'regionClick':
						data = event.region
						break;
					default:
						break;
				}
				svyDataViz.googleGeoChart.chartEventHandler('geoChart', id, eventType,data)
			}
		}
			
		function svyDataVizGoogleAPICallback(){
	    	google.load('visualization', '1', {'packages': ['geochart'], "callback" : svyDataViz.googleGeoChart.initialize});

		}
	]]>
	</script>
	
	//TODO: find a better way to do this: adding the UUID will prevent browsers caching the .js file
	var bytes = new Packages.java.lang.String(code).getBytes('UTF-8')
	var uuid = application.getUUID();
	solutionModel.newMedia('googleGeoChartHandler_'+uuid+'.js', bytes)
	plugins.WebClientUtils.addJsReference('media:///googleGeoChartHandler_'+uuid+'.js')
	
	//TODO: make the callback script generic on DataVizualization level, instead of having to add one on every impl.
	var callback = plugins.WebClientUtils.generateCallbackScript(browserCallback,['objectType', 'id', 'eventType', 'data'], false);
	var script = 'svyDataViz.googleGeoChart.chartEventHandler = function(objectType, id, eventType, data){' + callback + '}';
	bytes = new Packages.java.lang.String(script).getBytes('UTF-8')
	uuid = application.getUUID();
	solutionModel.newMedia('googleGeoChartHandlerCallback_'+uuid+'.js', bytes)
	plugins.WebClientUtils.addJsReference('media:///googleGeoChartHandlerCallback_'+uuid+'.js')
}()

/**
 * @properties={typeid:24,uuid:"42C9FF5A-9F17-4791-8120-5C49B31993BE"}
 */
//function browserCallback() {
//	application.output(arguments)
//}

/**
 * @properties={typeid:35,uuid:"0D213AFC-539E-4AF7-BD09-3D98671BF3F2",variableType:-4}
 */
var allInstances = {}

/**
 * Implementation of https://google-developers.appspot.com/chart/interactive/docs/gallery/geochart
 *
 * @param {RuntimeTabPanel} container the panel to which the visualization gets added
 * @param {JSFoundSet|JSDataSet|JSRecord|Array<Array>|Object} data
 * @param {Object} options
 * @param {String|Object} [options.backgroundColor]  default='white'  The background color for the main area of the chart. Can be either a simple HTML color string, for example: 'red' or '#00cc00', or an object with the following properties.                                                                                                                                                                                                                                                                                                                                
 * @param {String} [options.backgroundColor.fill]  default='white' The chart fill color, as an HTML color string.                                                                                                                                                                                                                                                                                                                                                                                                                                                             
 * @param {String} [options.backgroundColor.stroke] default='#666' The color of the chart border, as an HTML color string.                                                                                                                                                                                                                                                                                                                                                                                                                                                    
 * @param {Number} [options.backgroundColor.strokeWidth] default=0 The border width, in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               
 * @param {Object} [options.colorAxis] default=null An object that specifies a mapping between color column values and colors or a gradient scale. To specify properties of this object, you can use object literal notation, as shown here: {minValue: 0, colors: ['#FF0000', '#00FF00']}                                                                                                                                                                                                                                                                     
 * @param {Number} [options.colorAxis.minValue] default=Minimum value of color column in chart data. If present, specifies a minimum value for chart color data. Color data values of this value and lower will be rendered as the first color in the colorAxis.colors range.                                                                                                                                                                                                                                                                                                                                   
 * @param {Number} [options.colorAxis.maxValue] default=Maximum value of color column in chart data. If present, specifies a maximum value for chart color data. Color data values of this value and higher will be rendered as the last color in the colorAxis.colors range.                                                                                                                                                                                                                                                                                                                                   
 * @param {Array<Number>} [options.colorAxis.values] default=null, if present, controls how values are associated with colors. Each value is associated with the corresponding color in the colorAxis.colors array. These values apply to the chart color data. Coloring is done according to a gradient of the values specified here. Not specifying a value for this option is equivalent to specifying [minValue, maxValue].                                                                                                                                               
 * @param {Array<String>} [options.colorAxis.colors] default=null Colors to assign to values in the visualization. An array of strings, where each element is an HTML color string, for example: colorAxis: {colors:['red','#004411']}. You must have at least two values; the gradient will include all your values, plus calculated intermediary values, with the first color as the smallest value, and the last color as the highest.                                                                                                                                    
 * @param {String} [options.datalessRegionColor] default='F5F5F5' Colors to assign to regions with no associated data.                                                                                                                                                                                                                                                                                                                                                                                                                                                       
 * @param {String} [options.displayMode] default='auto' Which type of map this is. The DataTable format must match the value specified. The following values are supported: 'auto' - Choose based on the format of the DataTable. 'regions' - This is a region map 'markers' - This is a marker map.                                                                                                                                                                                                                                                               
 * @param {Boolean} options.enableRegionInteractivity] default=true If true, enable region interactivity, including focus and tool-tip elaboration on mouse hover, and region selection and firing of regionClick and select events on mouse click. The default is true in region mode, and false in marker mode.                                                                                                                                                                                                                                                              
 * @param {Number} options.height] default='auto' Height of the visualization, in pixels. The default height is 347 pixels, unless the width option is specified and keepAspectRatio is set to true - in which case the height is calculated accordingly.                                                                                                                                                                                                                                                                                                    
 * @param {Boolean} options.keepAspectRatio] default=true If true, the map will be drawn at the largest size that can fit inside the chart area at its natural aspect ratio. If only one of the width and height options is specified, the other one will be calculated according to the aspect ratio. If false, the map will be stretched to the exact size of the chart as specified by the width and height options.                                                                                                                                              
 * @param {Object|String} options.legend] default=null An object with members to configure various aspects of the legend, or 'none', if no legend should appear. To specify properties of this object, you can use object literal notation, as shown here: {textStyle: {color: 'blue', fontSize: 16}}                                                                                                                                                                                                                                                             
 * @param {String} [options.legend.numberFormat] default='auto' A format string for numeric labels. This is a subset of the ICU pattern set. For instance, {numberFormat:'.##'} will display values "10.66", "10.6", and "10.0" for values 10.666, 10.6, and 10.                                                                                                                                                                                                                                                                                                           
 * @param {Object} [options.legend.textStyle] default={color: 'black', fontName: <global-font-name>, fontSize: <global-font-size>}	An object that specifies the legend text style. The object has this format: {color: <string>, fontName: <string>, fontSize: <number>} The color can be any HTML color string, for example: 'red' or '#00cc00'. Also see fontName and fontSize.                                                                                                                                                                                                                                                             
 * @param {String} [options.region] default='world' The area to display on the map. (Surrounding areas will be displayed as well.) Can be one of the following: 'world' - A map of the entire world. A continent or a sub-continent, specified by its 3-digit code, e.g., '011' for Western Africa. A country, specified by its ISO 3166-1 alpha-2 code, e.g., 'AU' for Australia. A state in the United States, specified by its ISO 3166-2:US code, e.g., 'US-AL' for Alabama. Note that the resolution option must be set to either 'provinces' or 'metros'.
 * @param {Object} [options.magnifyingGlass] default={enable: true, zoomFactor: 5.0} An object with members to configure various aspects of the magnifying glass. To specify properties of this object, you can use object literal notation, as shown here: {enable: true, zoomFactor: 7.5}                                                                                                                                                                                                                                                                                                     
 * @param {Boolean} [options.magnifyingGlass.enable] default=true If true, when the user lingers over a cluttered marker, a magnifiying glass will be opened. Note: this feature is not supported in browsers that do not support SVG, i.e. Internet Explorer version 8 or earlier.                                                                                                                                                                                                                                                                                          
 * @param {Number} [options.magnifyingGlass.zoomFactor] default=5.0 The zoom factor of the magnifying glass. Can be any number greater than 0.                                                                                                                                                                                                                                                                                                                                                                                                                                 
 * @param {Number} [options.markerOpacity] default=1.0 The opacity of the markers, where 0.0 is fully transparent and 1.0 is fully opaque.                                                                                                                                                                                                                                                                                                                                                                                                                        
 * @param {String} [options.resolution] default='countries' The resolution of the map borders. Choose one of the following values: 'countries' - Supported for all regions, except for US state regions. 'provinces' - Supported only for country regions and US state regions. Not supported for all countries; please test a country to see whether this option is supported. 'metros' - Supported for the US country region and US state regions only.                                                                                                              
 * @param {Object} [options.sizeAxis] default=null An object with members to configure how values are associated with bubble size. To specify properties of this object, you can use object literal notation, as shown here: {minValue: 0, maxSize: 20}                                                                                                                                                                                                                                                                                                       
 * @param {Number} [options.sizeAxis.maxSize] default=12 Maximum radius of the largest possible bubble, in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                  
 * @param {Number} [options.sizeAxis.maxValue] default=Maximum value of size column in chart data. The size value (as appears in the chart data) to be mapped to sizeAxis.maxSize. Larger values will be cropped to this value.                                                                                                                                                                                                                                                                                                                                                                               
 * @param {Number} [options.sizeAxis.minSize] default=3, Mininum radius of the smallest possible bubble, in pixels.                                                                                                                                                                                                                                                                                                                                                                                                                                                 
 * @param {Number} [options.sizeAxis.minValue] default=Minimum value of size column in chart data. The size value (as appears in the chart data) to be mapped to sizeAxis.minSize. Smaller values will be cropped to this value.                                                                                                                                                                                                                                                                                                                                                                              
 * @param {Object} [options.tooltip] default=null An object with members to configure various tooltip elements. To specify properties of this object, you can use object literal notation, as shown here: {textStyle: {color: '#FF0000'}, showColorCode: true}                                                                                                                                                                                                                                                                                               
 * @param {Object} [options.tooltip.textStyle] default={color: 'black', fontName: <global-font-name>, fontSize: <global-font-size>}	An object that specifies the tooltip text style. The object has this format: {color: <string>, fontName: <string>, fontSize: <number>} The color can be any HTML color string, for example: 'red' or '#00cc00'.                                                                                                                                                                                                                                                                                            
 * @param {Number} [options.width] default='auto' Width of the visualization, in pixels. The default width is 556 pixels, unless the height option is specified and keepAspectRatio is set to true - in which case the width is calculated accordingly.                                                                                                                                                                                                                                                                                                      
 *
 * @properties={typeid:24,uuid:"27F07D57-CD5E-4EE7-82F8-25658A3AAD75"}
 */
function GeoChart(container, data, options) {
	/**@type {RuntimeForm<GoogleGeoChart>}*/
	var dv = scopes.modDataVisualization.createVisualizationContainer(container, forms.GoogleGeoChart)
	options.id = dv.getId()
	dv = null;

	var setup = {
		id: options.id,
		data: data,
		options: options
	}

	/**
	 * @param {String} [incrementalUpdateCode]
	 */
	function updateState(incrementalUpdateCode) {
		if (options.id in forms) {
			forms[options.id].storeState(scopes.modDataVisualization.serializeObject(setup))
			
			if (forms[options.id].rendered) {
				plugins.WebClientUtils.executeClientSideJS(incrementalUpdateCode)
			}
		} else {
			application.output('Invalid DataVisualizer reference') //TODO: better error messages
		}
	}
	updateState()
	
	//Public API
	/**
	 * @param {Object} data
	 * @param {Object} options
	 */
	this.draw = function(data, options){}
	this.getSelection = function(){}
	this.setSelection = function(){}
	this.clearChart = function(){}
	
	allInstances[options.id] = []
}
