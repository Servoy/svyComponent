/*
 * Base class for Datavisualization impl.
 * 
 * Implemenations that extend this base class must implement the methods marked as abstract
 * 
 * TODO: cleaning up of objects browserside when form gets unloaded
 * TODO: Figure out how to best allow hiding and showing the DV again, without too much overhead
 * - Guess that wicket isn't inserting the script tags again if they have been inserted previously
 */

/**
 * Variable containing the strinified version of the DOM variable after the render cycle. 
 * This variable is dataprovider for the non-editable HMTL area through which the markup gets inserted into the browser
 * @private
 * @type {String}
 *
 * @properties={typeid:35,uuid:"97DEF22B-2844-41D3-9EF4-CADA14063C14"}
 */
var html;

/**
 * Basic HTML in XMl format for easy manipulation. Used by {@link #render()} which copies this template, adds scripts and stringifies the XMl and puts it in the HTML variable
 * @private 
 * @type {XML}
 * @properties={typeid:35,uuid:"E2EA30EC-9DF9-4FE4-A5B7-E102DB54CC0E",variableType:-4}
 */
var dom = <html>
	<head>
	</head>
	<body>
		<div id={getId()} style="width: 100%; height: 100%; overflow: hidden"><![CDATA[&nbsp;]]></div>
	</body>
</html>

/**
 * @private
 * @type {Object<String>}
 * @properties={typeid:35,uuid:"EB18FD74-CBBD-4CF9-BAC3-6ACE7C79DBA9",variableType:-4}
 */
var scripts = {};

/**
 * 
 * @param {String} jsonString
 *
 * @properties={typeid:24,uuid:"0FB00B1F-C956-484C-9C50-595675A57E54"}
 */
function storeState(jsonString) {
	/** @type {{id: String}} */
	var obj = JSON.parse(jsonString);
	
	//TODO: content of script tag ought to be wrapped in CDATA tags to prevent the XML impl. from escaping invalid XMl characters
	//Testcase: GMap with InfoWindow containing HTML content
	scripts[obj.id] = 'svyDataViz.' + getBrowserId() + '[\'' + obj.id + '\']=\'' +  jsonString + '\''
	
	dom.body.@onLoad = 'svyDataViz.' + getBrowserId() + '.initialize(\'' + Object.keys(scripts).join("','") +'\');'
	var copy = dom.copy()
	for (var script in scripts) {
		copy.head.appendChild(new XML('<script><![CDATA[' + scripts[script] + ']]></script>'))
	}
	render(copy)
	html = scopes.modDataVisualization.stripCDataTags(copy);
	
	//Making sure that updates from the browser to the server don't cause the server to update the browser again. Wicket ignores this if the complete form needs to be rendered
	plugins.WebClientUtils.setRendered(elements.visualizationContainer); 
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
	//TODO: maybe optimize the inclusion of json2, only when JSON isn't supported out of the box?
	scopes.modUtils$WebClient.addJavaScriptDependancy('media:///svyDataVis.js', this)
		.addJavaScriptDependancy('media:///json2.js', this)
	dom.body.@onLoad = 'svyDataViz.' + getBrowserId() + '.initialize();'
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
	//TODO: browserSide cleanup?
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
	//TODO Implement whatever is needed to perform cleanup of references
}
