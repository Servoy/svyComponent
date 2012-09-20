/*
 * Implementation of http://justgage.com/
*/
/**
 * @private 
 * @SuppressWarnings(unused)
 * @properties={typeid:35,uuid:"B4689D91-3D5D-4E8E-86DC-C598ED52B960",variableType:-4}
 */
var init = function() {
	//TODO: allow devs to optimalizise external lib inclusion
	plugins.WebClientUtils.addJsReference('media:///raphael.2.1.0.min.js')
	plugins.WebClientUtils.addJsReference('media:///justgage.1.0.1.min.js')
	
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
//							case 'domReference':
//								return document.getElementbyId(args[0])
						default:
							return
					}
	    		}
	    		return value
	    	}
		}
		svyDataViz.justGauge = {
			gauges: { },
			todos: [],
			initialize: function() {
				for (var i = 0; i < svyDataViz.justGauge.todos.length; i++) {
					console.log(svyDataViz.justGauge.todos[i])
					var node = JSON.parse(svyDataViz.justGauge.todos[i], svyDataViz.reviver)
					svyDataViz.justGauge.gauges[node.id] = node.gauge
				}
				svyDataViz.justGauge.todos = []
			}
		}
	]]>
	</script>
	
	//TODO: find a better way to do this: adding the UUID will prevent browsers caching the .js file
	var bytes = new Packages.java.lang.String(code).getBytes('UTF-8')
	var uuid = application.getUUID();
	solutionModel.newMedia('justGaugeHandler_'+uuid+'.js', bytes)
	plugins.WebClientUtils.addJsReference('media:///justGaugeHandler_'+uuid+'.js')
}()

/**
 * @constructor
 * 
 * TODO: check types of all options
 * @param {RuntimeTabPanel} container
 * @param {Object} options
 * @param options.id {String}  container element id
 * @param options.title {String}  gauge title text
 * @param options.titleFontColor {String} color title text
 * @param options.value {Number}  value gauge is showing
 * @param options.valueFontColor {String}  color of value text
 * @param options.min {Number} minimum value
 * @param options.max {Number} maximum value
 * @param options.showMinMax {Boolean} hide or display min and max values
 * @param options.gaugeWidthScale {Number} width of the gauge element
 * @param options.gaugeColor {String} background color of gauge element
 * @param options.label {String} text to show below value
 * @param options.showInnerShadow {Boolean} whether to display inner shadow
 * @param options.shadowOpacity {Number} shadow opacity, values 0 ~ 1
 * @param options.shadowSize {Number} inner shadow size
 * @param options.shadowVerticalOffset {Number} how much is shadow offset from top
 * @param options.levelColors {Array<String>} colors of indicator, from lower to upper, in hex format
 * @param options.levelColorsGradient {Boolean} use gradual or sector-based color change
 * @param options.labelFontColor {String} color of label showing label under value
 * @param options.startAnimationTime {Number} length of initial load animation
 * @param options.startAnimationType {Number} type of initial animation (linear, >, <, <>, bounce)
 * @param options.refreshAnimationTime {Number} length of refresh animation
 * @param options.refreshAnimationType {String} type of refresh animation (linear, >, <, <>, bounce)
 * @properties={typeid:24,uuid:"26D1A70A-F906-4BC1-A950-744327B83E6E"}
 * 
 * @properties={typeid:24,uuid:"26D1A70A-F906-4BC1-A950-744327B83E6E"}
 */
function JustGauge(container, options) {
	/**@type {RuntimeForm<JustGauge>}*/
	var dv = scopes.modDataVisualization.createVisualizationContainer(container, forms.JustGauge)
	options.id = dv.getId()
	dv = null;

	var setup = {
		id: options.id,
		gauge: {
			svySpecial: true, 
			type: 'constructor', 
			id: options.id,
			parts: ['JustGage'],
			args: [options]
		}
	}

	function storeState() {
		if (options.id in forms) {
			forms[options.id].storeState(JSON.stringify(setup))
		} else {
			application.output('Invalid DataVisualizer reference') //TODO: better error messages
		}
	}

	storeState()

	this.refresh = function(value){
		options.value = value
		storeState()
		if (forms[options.id].rendered) {
			plugins.WebClientUtils.executeClientSideJS('svyDataViz.justGauge.gauges[\'' + options.id + '\'].refresh(' + value + ');')
		}
	}
}