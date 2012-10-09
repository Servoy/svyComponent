/**
 * @properties={typeid:35,uuid:"E4A3D57C-AECE-4CF9-9817-D47A3306EEE3",variableType:-4}
 */
var init = function(){
	//TODO: include excanvas for IE, through the main modDatavisualization scope, to prevent duplication
//	//Add excanvas to conditionally only in IE to compensate for the lack of canvas support in IE up to IE9
//	/**@type {Packages.org.apache.wicket.protocol.http.ClientProperties}*/
//	var clientProperties = Packages.org.apache.wicket.RequestCycle.get().getClientInfo().getProperties() 
//    if (clientProperties.isBrowserInternetExplorer()) {
//		html.head.prependChild(<script type="text/javascript" src="media:///excanvas.js"></script>)
//	}
	
	plugins.WebClientUtils.addJsReference('https://raw.github.com/HumbleSoftware/Flotr2/master/flotr2.min.js')
	
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
			todos: [],
			initialize: function() {
				for (var i = 0; i < svyDataViz.flotr2.todos.length; i++) {
					console.log(svyDataViz.flotr2.todos[i])
					var node = JSON.parse(svyDataViz.flotr2.todos[i], svyDataViz.reviver)
					if (node.id) {
						Flotr.draw(document.getElementById(node.id),
							node.data,
							node.options
						);
						
//						var chart = new google.visualization.GeoChart(document.getElementById(node.id))
//						
//						//Add eventhandlers
//						google.visualization.events.addListener(chart, 'select', new Function ('event', "svyDataViz.googleGeoChart.callbackIntermediate.call(this, '"+node.id+"', 'select', event)"));
//						google.visualization.events.addListener(chart, 'regionClick', new Function ('event', "svyDataViz.googleGeoChart.callbackIntermediate.call(this, '"+node.id+"', 'regionClick', event)"));
//						
//						var data = google.visualization.arrayToDataTable(node.data)
//						chart.draw(data, node.options)
//						svyDataViz.googleGeoChart.charts[node.id] = chart
					}
				}
				svyDataViz.flotr2.todos = []
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
//			if (forms[setup.id].rendered) {
//				plugins.WebClientUtils.executeClientSideJS(incrementalUpdateCode)
//			}
//		} else {
//			application.output('Invalid DataVisualizer reference') //TODO: better error messages
//		}
//	}
//}

/**
 * @constructor
 * @param {RuntimeTabPanel} container
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
			
			if (forms[setup.id].rendered) {
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
			
			if (forms[setup.id].rendered) {
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
			
			if (forms[setup.id].rendered) {
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