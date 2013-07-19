/*
 * Base class for Datavisualization impl.
 * 
 * Implemenations that extend this base class must implement the methods marked as abstract
 */

/**
 * Variable containing the stringified version of the DOM variable after the render cycle. 
 * This variable is dataprovider for the non-editable HMTL area through which the markup gets inserted into the browser
 * @private
 * @type {String}
 * @SuppressWarnings(unused)
 * @properties={typeid:35,uuid:"97DEF22B-2844-41D3-9EF4-CADA14063C14"}
 */
var html;

/**
 * @private
 * @type {Object<String>}
 * @properties={typeid:35,uuid:"EB18FD74-CBBD-4CF9-BAC3-6ACE7C79DBA9",variableType:-4}
 */
var scripts = {};

/**
 * Internal API: DO NOT CALL
 * @param {Object} o
 * @param {Array} [specialTypes]
 * @return {String}
 * @properties={typeid:24,uuid:"B8DED9AD-3C2C-49BE-A3A0-2EDE44A1ACD1"}
 */
function serializeObject(o, specialTypes) {
	if (o['toObjectPresentation'] instanceof Function) {
		var oo = o['toObjectPresentation']()
		return serializeObject(oo, specialTypes);
	}
	var str = JSON.stringify(o, function(key, value) {
		if (typeof value === 'string') {
			return escape(value)
		} else if (specialTypes && specialTypes.some(function(element, index, array) {return value instanceof element})) {
			return value.toObjectPresentation();
		}
		return value
	})
	return str;
}

/**
 * @private 
 * @properties={typeid:24,uuid:"AB230B38-0AFA-4F94-B007-77C7F934EDAB"}
 */
function setState(){
	var dom = <html>
		<head>
		</head>
		<body>
			<div id={getId()} style="width: 100%; height: 100%; overflow: hidden"><![CDATA[&nbsp;]]></div>
		</body>
	</html>
	dom.body.@onLoad = 'svyDataVis.' + getBrowserId() + '.initialize(\'' + Object.keys(scripts).join("','") +'\');'
	for (var script in scripts) {
		dom.head.appendChild(new XML('<script><![CDATA[' + scripts[script] + ']]></script>'))
	}
	render(dom)
	html = scopes.modUtils$webClient.XHTML2Text(dom);
	
	//Making sure that updates from the browser to the server don't cause the server to update the browser again. Wicket ignores this if the complete form needs to be rendered
	scopes.modUtils$webClient.setRendered(elements.visualizationContainer); 
}

/**
 * @param {{id: String}} object
 * @param {Boolean} [isSubType] To indicate a subType is being persisted. If the main DataVisualization is already rendered and a new subType is added, setting this flag to true will push the new type straight to the browser. Default: false
 *
 * @properties={typeid:24,uuid:"7BA8B0CC-3122-43B0-B8A0-0D68ADCC9004"}
 */
function persistObject(object, isSubType) {
	var script = 'svyDataVis.' + getBrowserId() + '[\'' + object.id + '\']=\'' +  serializeObject(object) + '\''
	
	//If rendered and a new subType is added, send to browser straight away
	if (isRendered() && isSubType && !scripts[object.id]) {
		scopes.modUtils$webClient.executeClientsideScript(script)
		scopes.modUtils$webClient.executeClientsideScript('svyDataVis.' + getBrowserId() + '.initialize(\'' + object.id +'\');')
	}
	
	scripts[object.id] = script
	//TODO: instead of calling setState for every persist, maybe attach an org.apache.wicket.behavior.AbstractBehavior and use it's beforeRender method to call setState?
	//Taken even further, it would also be possible to just store the passed object and only generate the script when onRender is performed
	//If storing the object, the object doesn't have to be updated with every change, as an object is just a reference, so it stays in sync automatically
	//	var impl = {
	//		afterRender: function(component) {
	//			application.output('After Rendering: ' + component)
	//		},
	//		onRendered: function(component) {
	//			application.output('onRendered: ' + component)
	//		},	
	//		beforeRender: function(component) {
	//			application.output('Before Rendering: ' + component)
	//		}
	//	}
	//	
	//	var behavior  = new JavaAdapter(Packages.org.apache.wicket.behavior.AbstractBehavior, impl)
	//	scopes.modUtils$webClient.unwrapElement(elements.visualizationContainer).add(behavior)
	setState() 
}

/**
 * @param {String} id
 *
 * @properties={typeid:24,uuid:"07941164-8AE7-45BD-A993-22AC9D72F254"}
 */
function desistObject(id) {
	delete allObjectCallbackHandlers[id]
	delete scripts[id]
	setState()
}

/**
 * Extension point for impl. to override in order to extend and modify the generated HTML content that gets injected to the browsers markup
 * The render cycle does not remember state between invocations
 * @param {XML} DOM
 * @protected
 * @properties={typeid:24,uuid:"8E72F496-5DAE-4A2E-A763-F5EA640012A5"}
 */
function render(DOM) {
}

/**
 * Map holding references to the callbackEvent handlers of the main DataVisualization and all it's subtypes.<br>
 * Used by the browserCallback function to lookup the correct object to delegate the callback to,<br>
 * in order to persists browserside updates to the map, without causing another render cycle towards the browser
 * @type {Object<Function>}
 * @properties={typeid:35,uuid:"CFF2C67B-D83E-4577-AD0D-270C3F8CE897",variableType:-4}
 */
var allObjectCallbackHandlers = {}

/**
 * Returns the UUID by which to rever to this DataVisualization 
 * @final
 * @return {String}
 * 
 * @properties={typeid:24,uuid:"83DBC63F-DADD-4AE0-AE17-0B6F933F79B7"}
 */
function getId() {
	return controller.getName()
}

/**
 * Abstract identifier, should be overridden on DataVisualizer instances and return the id under which all browser interaction takes place
 * @abstract
 * @protected 
 * TODO: write UnitTest to check for this implementation
 * @properties={typeid:24,uuid:"67A9483F-B661-47CC-8E7A-5FB737C94A4A"}
 */
function getBrowserId(){}

/**
 * Flag to be used by implementations to check whether or not to execute the incremental update code
 * @private 
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"132449CC-9E6E-4AC2-8AEE-DD4163C6034C",variableType:-4}
 */
var rendered = false

/**
 * To check whether or not to execute the incremental update code
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"6439DFAC-70E6-46C5-93EE-F82030C04FCF"}
 */
function isRendered() {
	return rendered
}

/**
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected 
 *
 * @properties={typeid:24,uuid:"3BB316B5-1CFF-41F7-B96A-4626898897F1"}
 */
function onLoad(event) {
	scopes.modUtils$webClient.addJavaScriptDependancy('media:///svyDataVis.js', this)
	scopes.modUtils$webClient.addJavaScriptDependancy('media:///svyDataVisCallback.js', this)
	scopes.modUtils$webClient.addJavaScriptDependancy('media:///json3.js', this)
//	TODO: Using the code below to conditionally inject json2 break the order in which dependancies are added, which breaks the GeoChart implementation. No idea why yet
//	TODO: also, the code below adds the script for each datavisualization
//	var id = 'jsonPolyfill'
//	var script = 'if (!window.JSON) {script = document.createElement("script");script.type = "text/javascript";script.src = "' + scopes.modUtils$webClient.getExternalUrlForMedia("media:///json2.js") + '";document.head.appendChild(script);}'
//	scopes.modUtils$webClient.addDynamicJavaScript(script, id, null)
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"4C7A2CF9-E700-412C-BB7E-91E0A1002385"}
 */
function onShow(firstShow, event) {
	rendered = true
}

/**
 * Handle hide of DataVisualization
 *
 * @protected
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 *
 * @properties={typeid:24,uuid:"22CD8598-93D9-4261-952C-5129AE22778F"}
 */
function onHide(event) {
	//As a form gets hidden in de WC, the markup is removed, so the reference to the map becomes invalid, so we also delete the keys from the object store.
	scopes.modUtils$webClient.executeClientsideScript('$.each([\'' + Object.keys(scripts).join("\',\'") + '\'],function(key, value) {delete svyDataVis.objects[value]});')
	rendered = false
	return true
}

/**
 * Callback method when form is destroyed.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"0A8FE3BA-A64C-4298-AA00-AA0731573ABB"}
 */
function onUnload(event) {
}
