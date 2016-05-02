/*
 * The MIT License
 * 
 * This file is part of the Servoy Business Application Platform, Copyright (C) 2012-2016 Servoy BV 
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 * 
 */

/*
 * This scope should handle the parts of data visualization that are generic:
 * - the creation of a container object for the Component
 * - switching the super form for ComponentBase at runtime to a client specific implementation
 * - @runtime setup the callback mechanism from the client to the scripting layer
 * - Generic reviver to restore date strings to dates when parsing JSON 
 * 
 * TODO namespace components inside the browser to prevent clashes
 * TODO provide boilerplate solution to have a startingPoint to develop new Components
 * TODO Make processing the TODO's in the client generic and shared between components
 * Provide a component prototype function to use as basis for the main constructors
 * TODO Extract the intelligent loop for processing initializations in the right order from the GoogleMaps/FullCalendarHandler initialize method and put it in code
 * TODO put custom logger initialization into AbstractComponent
 * TODO Use constants for identifiers, like com.servoy.component.google.maps
 * TODO Create "factory" functions for generating the JSON to send back and forth
 * TODO Create helper method to call methods on objects with arguments in the browser, from the server
 * TODO Add method to enable the clientside debug mode 
 * TODO Add mechanism to forward clientside log events on in the console in Developer (maybe also in production?)
 */

 /**
  * @private 
  * @properties={typeid:35,uuid:"1ECADEE7-69C4-4CE8-B2D2-1CDD8C6428BD",variableType:-4}
  */
 var log = scopes.svyLogManager.getLogger('com.servoy.bap.components')

/**
 * Variable with self executing function as value to run some initialization code when the scope gets instantiated on solution start.
 * - Dynamically created an .js entry in the Media Lib and includes it in the Web CLient 
 * @private
 * @SuppressWarnings(unused)
 * @properties={typeid:35,uuid:"C88DB00A-27F8-4CAB-A8FB-C1D2D50FC5C4",variableType:-4}
 */
var init = function() {
	//Modify the parent of ComponentBase to be the client specific AbstractComponent impl.
	var clientSpecificAbstractComponentName = 'AbstractComponent' + (scopes.svySystem.isWebClient() ? '$webClient' : '$smartClient');
	solutionModel.getForm('ComponentBase').extendsForm = solutionModel.getForm(clientSpecificAbstractComponentName)
	
	var callbackScript
	if (scopes.svySystem.isSwingClient()) {
		callbackScript = "var retval = servoy.executeMethod('scopes.svyComponent.clientCallback', [objectType, objectId, componentId, eventType, data]);"
		callbackScript += "if (typeof callback == 'function') {callback.call(this, retval)};"
	} else {
		var url = scopes.svyWebClientUtils.getCallbackUrl(clientCallback)
		url += "&p=' + encodeURIComponent(" + ['objectType', 'objectId', 'componentId', 'eventType', 'data'].join(") + '&p=' + encodeURIComponent(") + ")"
		
		callbackScript = "if (typeof callback == 'function') {$.ajax({url: '" + url + ", headers: {'Wicket-Ajax': true}}).done(function(data) {callback.call(this, data)});} else {"
		callbackScript += scopes.svyWebClientUtils.getCallbackScript(clientCallback, ['objectType', 'objectId', 'componentId', 'eventType', 'data'], {showLoading: false})
		callbackScript += '}'
	}
	var script = 'svyComp.callbackHandler = function(objectType, objectId, componentId, eventType, data, callback){' + callbackScript + '}';
	
	var media = solutionModel.getMedia('svyComponent/svyComponentCallback.js')
	media.bytes = scopes.svyDataUtils.StringToByteArray(script)
	media.mimeType = 'text/javascript' /*When setting the bytes of a media entry, Servoy tries to set the mimeType accordingly, but fails*/
}()

/**
 * TODO move to utils scope
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
 * @param {String} body
 * @param {Object<Array<String>>} args
 * @properties={typeid:24,uuid:"2B8B17B3-42F6-46AA-86B1-9A8D49ABA53E"}
 */
function clientCallback(body, args) {
	var objectType, objectId, instanceId, eventType
	/** @type {String} */
	var data	
	/* Normalize how the arguments are send in between SC and WC and in the WC between calls with and without callback
	 * SC w. callback  : objectType, objectId, componentId, eventType, data
	 * SC w/o callback : objectType, objectId, componentId, eventType, data
	 * WC w. callback  : body, {p: Array<String>}
	 * WC w/o callback : objectType, objectId, componentId, eventType, data
	 */
	if (arguments.length > 2) { 
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
		log.warn('Callback for unknown component instance:  id=' + instanceId + ' (' + Array.prototype.slice.call(arguments) + ')')
		return;
	}
	if (forms[instanceId].allObjectCallbackHandlers[objectId]) {
		forms[instanceId].allObjectCallbackHandlers[objectId](eventType, JSON.parse(data, reviver))
	} else {
		log.warn('Callback for unknown object: type=' + objectType + ', id=' + objectId + ', eventType=' + eventType + ', instanceId=' + instanceId)
	}
}

/**
 * @private 
 * @type {Number}
 *
 * @properties={typeid:35,uuid:"3DF48842-7E60-4644-828B-D980AD8C4CC6",variableType:4}
 */
var counter = 0

/**
 * Helper method to generate unique ID values per session
 * @properties={typeid:24,uuid:"A56D719A-1D17-47A9-BB9C-68C79F608209"}
 */
function getUID() {
	return 'bap' + counter++
}

/**
 * Internal API: DO NOT CALL
 * TODO: convert into a generic util function with just a thin wrapper for returning the right type, as also needed for other components 
 * @param {RuntimeTabPanel} panel the panel to which the visualization gets added
 * @param {String} componentFormName Name of the subclass of RuntimeForm<ComponentBase> for the specific Component
 * 
 * @return {RuntimeForm<ComponentBase>}
 * @properties={typeid:24,uuid:"23E83A2C-6B8E-4CF9-A031-A29F02B3DF3E"}
 */
function createVisualizationContainer(panel, componentFormName) {
	var formName = getUID()
	application.createNewFormInstance(componentFormName, formName)
	
	/**@type {RuntimeForm<ComponentBase>}*/
	var componentInstance = forms[formName]
	
	panel.removeAllTabs()
	panel.addTab(componentInstance)

	return componentInstance
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
 * @param {RuntimeForm<ComponentBase>} container
 * @param {Number} maxVersion the max version of IE for which excanvas ought to be included. (default is IE8)
 * @properties={typeid:24,uuid:"FB38F277-182A-4971-8534-401EEC07EBFF"}
 */
function includeExCanvasForIE(container, maxVersion) {
	if (scopes.svySystem.isSwingClient()) {
		return;
	}
	
	if (maxVersion > maxIEVersion) {
		maxIEVersion = maxVersion
	}
	
	//Add excanvas to conditionally only in IE to compensate for the lack of canvas support in IE up to and including IE8
	var clientProperties = scopes.svyWebClientUtils.getBrowserInfo().getProperties()
	if (clientProperties.isBrowserInternetExplorer() && clientProperties.getBrowserVersionMajor() <= maxIEVersion) {
		container.addJavaScriptDependancy('media:///svyComponent/excanvas.compiled.js')
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