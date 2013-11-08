/*
 * This file is part of the Servoy Business Application Platform, Copyright (C) 2012-2013 Servoy BV 
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * 
 * You should have received a copy of the GNU Lesser General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/*
 * This scope should handle the parts of data visualization that are generic:
 * - the creation of a container object for the DataVisualization
 * - switching the super form for DataVisualizerBase at runtime to a client specific implementation
 * - @runtime setup the callback mechanism from the client to the scripting layer
 * - Generic reviver to restore date strings to dates when parsing JSON 
 * 
 * TODO Extract the intelligent loop for processing initializations in the right order from the GoogleMaps/FullCalendarHandler initialize method and put it in code
 * TODO refactor to modComponent
 * TODO put custom logger initialization into AbstractDataVisualizer
 * TODO get rid of UUID's everywhere and have a global Id generator for dataVisualizations
 * TODO Refactor core logic of svyDataVis to modComponent
 * TODO Use constants for identifiers, like com.servoy.datavisualization.google.maps
 * TODO Create "factory" functions for generating the JSON to send back and forth
 * TODO Create helper method to call methods on objects with arguments in the browser, from the server
 */

 /**
  * @private 
  * @properties={typeid:35,uuid:"1ECADEE7-69C4-4CE8-B2D2-1CDD8C6428BD",variableType:-4}
  */
 var log = scopes.modUtils$log.getLogger('com.servoy.bap.components')

/**
 * Variable with self executing function as value to run some initialization code when the scope gets instantiated on solution start.
 * - Dynamically created an .js entry in the Media Lib and includes it in the Web CLient 
 * @private
 * @SuppressWarnings(unused)
 * @properties={typeid:35,uuid:"C88DB00A-27F8-4CAB-A8FB-C1D2D50FC5C4",variableType:-4}
 */
var init = function() {
	//Modify the parent of DataVisualizerBase to be the client specific AbstractDataVisualizer impl.
	var clientSpecificAbstractDataVisualizerName = 'AbstractDataVisualizer' + (scopes.modUtils$system.isWebClient() ? '$webClient' : '$smartClient');
	solutionModel.getForm('DataVisualizerBase').extendsForm = solutionModel.getForm(clientSpecificAbstractDataVisualizerName)
	
	//TODO: these changes don't work yet: probably need to separate callback methods: one that fires and forgets and one with callback
	var callback
	if (scopes.utils.system.isSwingClient()) {
		callback = "var retval = servoy.executeMethod('scopes.modDataVisualization.clientCallback', [objectType, objectId, componentId, eventType, data, callback]);"
		callback += "if (typeof callback == 'function') {callback.call(this, retval)};"
	} else {
		var url = scopes.modUtils$webClient.getCallbackUrl(clientCallback)
		url += "&p=' + encodeURIComponent(" + ['objectType', 'objectId', 'componentId', 'eventType', 'data'].join(") + '&p=' + encodeURIComponent(") + ")"
		callback = "if (typeof callback == 'function') {$.ajax({url: '" + url + "}).done(function(data) {callback.call(this, data)});} else {"
		//callback = plugins.WebClientUtils.generateCallbackScript(browserCallback, ['objectType', 'objectId', 'mapId', 'eventType', 'data'], false);
		callback += scopes.modUtils$webClient.getCallbackScript(clientCallback, ['objectType', 'objectId', 'componentId', 'eventType', 'data'], {showLoading: false})
		callback += '}'
	}
	var script = 'svyDataVis.callbackHandler = function(objectType, objectId, componentId, eventType, data, callback){' + callback + '}';
	
	solutionModel.getMedia('modComponent/svyDataVisCallback.js').bytes = scopes.modUtils$data.StringToByteArray(script)
}()
 
/**
 * CHECKME: do we need to take into account timezone differences between the client and server here?
 * Used in browserCallback when parsing incoming JSON data to revive dates stored as ISO Strings to JavaScript date objects
 * @private 
 * 
 * @param {String} key
 * @param {Object} value
 * @return {Object}
 * 
 * @see http://msdn.microsoft.com/en-us/library/ie/cc836466(v=vs.94).aspx
 *
 * @properties={typeid:24,uuid:"FDEB9112-ACFF-4CCE-B242-02FAB66D9D91"}
 */
function reviver(key, value) {
    if (typeof value === 'string') {
    	/** @type {String} */
    	var _value = value
	    /** @type {Array<Number>} */
	    var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(_value);
        if (a) {
            return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
        }
    }
    return value;
};

/**
 * Generic callbackHandler for events send from the client to the scripting layer
 * @private 
 * @properties={typeid:24,uuid:"2B8B17B3-42F6-46AA-86B1-9A8D49ABA53E"}
 */
function clientCallback(args) {
	var objectType, objectId, instanceId, eventType
	/** @type {String} */
	var data	
	//Normalize how the arguments are send in between SC and WC and in the WC between calls with and without callback
	if (arguments.length > 1) { 
		objectType = arguments[0]
		objectId = arguments[1]
		instanceId = arguments[2]
		eventType = arguments[3]
		data = arguments[4]
	} else {
		objectType = args.p[0]
		objectId = args.p[1]
		instanceId = args.p[2]
		eventType = args.p[3]
		data = args.p[4]	
	}
	
	if (!(instanceId in forms)) {
		log.warn('Callback for unknown component instance:  id=' + instanceId + '(' + Array.prototype.slice.call(arguments) + ')')
		return;
	}
	if (forms[instanceId].allObjectCallbackHandlers[objectId]) {
		forms[instanceId].allObjectCallbackHandlers[objectId](eventType, JSON.parse(data, reviver))
	} else {
		log.warn('Callback for unknown object: type=' + objectType + ', id=' + objectId + ', eventType=' + eventType + ', instanceId=' + instanceId)
	}
}

/**
 * Internal API: DO NOT CALL
 * TODO: convert into a generic util function with just a thin wrapper for returning the right type, as also needed for other components 
 * @param {RuntimeTabPanel} panel the panel to which the visualization gets added
 * @param {String} dataVisualizerFormName Name of the subclass of RuntimeForm<DataVisualizerBase> for the specific dataVisualization
 * 
 * @return {RuntimeForm<DataVisualizerBase>}
 * @properties={typeid:24,uuid:"23E83A2C-6B8E-4CF9-A031-A29F02B3DF3E"}
 */
function createVisualizationContainer(panel, dataVisualizerFormName) {
	var formName = application.getUUID().toString()
	application.createNewFormInstance(dataVisualizerFormName, formName)
	
	/**@type {RuntimeForm<DataVisualizerBase>}*/
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
 * @param {RuntimeForm<DataVisualizerBase>} container
 * @param {Number} maxVersion the max version of IE for which excanvas ought to be included. (default is IE8)
 * @properties={typeid:24,uuid:"FB38F277-182A-4971-8534-401EEC07EBFF"}
 */
function includeExCanvasForIE(container, maxVersion) {
	if (scopes.utils.system.isSwingClient()) {
		return;
	}
	
	if (maxVersion > maxIEVersion) {
		maxIEVersion = maxVersion
	}
	
	//Add excanvas to conditionally only in IE to compensate for the lack of canvas support in IE up to and including IE8
	var clientProperties = scopes.modUtils$webClient.getBrowserInfo().getProperties()
	if (clientProperties.isBrowserInternetExplorer() && clientProperties.getBrowserVersionMajor() <= maxIEVersion) {
		container.addJavaScriptDependancy('media:///excanvas.compiled.js')
	}	
}

//TODO: implement option to enable/disable debug mode
//See renderHead in AbstractDefaultAjaxBehavior how Wicket does this. Using a behavior would help us as well
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