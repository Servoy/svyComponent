/*
 * This scope should handle the parts of data visualization that are generic:
 *
 * - the creation of a container object for the DataVisualization.
 *   In Web Client create an HTML Area, in SC create a BrowserBean instance (phase 2)
 *   The container object should not be the form directly, but an object with convenient methods to get done what needs to be done
 *
 * - Conversion of Servoy's dataTypes (JSFoundSet/JSDataSet,JSrecord to proper formats)
 * 
 * TODO's
 * - Refactor core logic of svyDataVis to svyBrowserServerBridge
 * - Use 1 global object store, instead of one per impl.
 * - Use constants for identifiers, like com.servoy.datavisualization.google.maps
 * - Create "factory" functions for generating the JSON to send back and forth
 * - Create helper method to call methods on objects with arguments in the browser, from the server
 * - get rid of plugins.WebClientUtils.generateCallbackScript(...)
 */

/**
 * Variable with self executing function as value to run some initialization code when the scope gets instantiated on solution start.
 * - Dynamically created an .js entry in the Media Lib and includes it in the Web CLient 
 * - Sets up several .toObjectPresentation prototypes on constructors, needed for serialization of objects to browser side
 * @private
 * @SuppressWarnings(unused)
 * @properties={typeid:35,uuid:"C88DB00A-27F8-4CAB-A8FB-C1D2D50FC5C4",variableType:-4}
 */
 var init = function() {
 	var callback = plugins.WebClientUtils.generateCallbackScript(browserCallback,['objectType', 'objectId', 'mapId', 'eventType', 'data'], false);
 	var script = 'svyDataVis.callbackHandler = function(objectType, objectId, mapId, eventType, data){' + callback + '}';
	solutionModel.getMedia('svyDataVisCallback.js').bytes = new Packages.java.lang.String(script).getBytes('UTF-8')
 }()
 
/**
 * Generic callbackHandler for events send from the browser to the server
 * @private 
 * @properties={typeid:24,uuid:"2B8B17B3-42F6-46AA-86B1-9A8D49ABA53E"}
 */
function browserCallback(objectType, objectId, mapId, eventType, data) {
	if (!mapId in forms) {
		application.output('Callback for unknown DataVisualization:  id=' + mapId)
	}
	if (forms[mapId].allObjectCallbackHandlers[objectId]) {
		forms[mapId].allObjectCallbackHandlers[objectId](eventType, JSON.parse(data))
	} else {
		application.output('Callback for unknown object: type=' + objectType + ', id=' + objectId + ', eventType=' + eventType)
	}
}

//TODO: add this as a 'static' method to AbstractDataVisualizer
/**
 * Internal API: DO NOT CALL
 * 
 * @param {RuntimeTabPanel} panel the panel to which the visualization gets added
 * @param {RuntimeForm<AbstractDataVisualizer>} form
 * 
 * @return {RuntimeForm<AbstractDataVisualizer>}
 * @properties={typeid:24,uuid:"23E83A2C-6B8E-4CF9-A031-A29F02B3DF3E"}
 */
function createVisualizationContainer(panel, form) {
	var formName = application.getUUID().toString()
	application.createNewFormInstance(form.getId(), formName)
	
	/**@type {RuntimeForm<AbstractDataVisualizer>}*/
	var dataVisualizerInstance = forms[formName]
	
	panel.removeAllTabs()
	panel.addTab(dataVisualizerInstance)

	return dataVisualizerInstance
}

/**
 * @private
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"2156677A-6133-40CB-A2B4-2090BE039B62",variableType:4}
 */
var maxIEVersion = 8

/**
 * Utility method to conditionally include excanvas.js when running IE <= 8, to add canvas support in those IE version
 * @param {RuntimeComponent} container
 * @param {Number} maxVersion the max version of IE for which excanvas ought to be included. (default is IE8)
 * @properties={typeid:24,uuid:"FB38F277-182A-4971-8534-401EEC07EBFF"}
 */
function includeExCanvasForIE(container, maxVersion) {
	if (maxVersion > maxIEVersion) {
		maxIEVersion = maxVersion
	}
	//Add excanvas to conditionally only in IE to compensate for the lack of canvas support in IE up to and including IE8
	var clientProperties = scopes.modUtils$WebClient.getBrowserInfo().getProperties()
	if (clientProperties.isBrowserInternetExplorer() && clientProperties.getBrowserVersionMajor() <= maxIEVersion) {
		scopes.modUtils$WebClient.addJavaScriptDependancy('media:///excanvas.compiled.js', container)
	}	
}

//TODO: implement option to enable/disable debug mode
///**
// * @private
// * @type {Boolean}
// *
// * @properties={typeid:35,uuid:"8EFA0BAF-BF91-4FDE-A232-EAAE1F2DC740",variableType:-4}
// */
//var debugMode = false
//
///**
// * Enables or disables clientSide debug logging
// * @param {Boolean} debugMode Enables or disables debug mode
// *
// * @properties={typeid:24,uuid:"A62A58A7-EE9E-4CB8-A20D-7BB047275E9C"}
// */
//function setDebugMode(state) {
//	this.debugMode = state
//}