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
 * TODO: do we need an HTML area at all, or can we just attach behaviors?
 */

/**
 * Variable containing the stringified version of the DOM variable after the render cycle. 
 * This variable is dataprovider for the non-editable HMTL area through which the markup gets inserted into the browser
 * @private
 * @type {String}
 * @SuppressWarnings(unused)
 * @properties={typeid:35,uuid:"C4DD7C53-5CAB-4A11-AD72-83ECE6DB8038"}
 */
var html = '';

/**
 * @private
 * @type {Object<{id: String}>}
 * @properties={typeid:35,uuid:"95AF050B-A5A2-43F1-971F-AA01FAB9FC25",variableType:-4}
 */
var scripts = {};

/**
 * @param {{id: String}} object
 * @param {String} [incrementalUpdateCode]
 *
 * @properties={typeid:24,uuid:"C8482365-ED48-4509-88C2-93F6AE068D15"}
 */
function persistObject(object, incrementalUpdateCode) {
	//If rendered and a new object is added, send to browser straight away
	if (isRendered() && !scripts[object.id]) {
		executeClientsideScript('svyDataVis.' + getDataVisualizationId() + '[\'' + object.id + '\']=\'' +  serializeObject(object) + '\'')
		executeClientsideScript('svyDataVis.' + getDataVisualizationId() + '.initialize(\'' + object.id +'\');')
	}
	
	if (isRendered() && incrementalUpdateCode) {
		executeClientsideScript(incrementalUpdateCode)
	}
	
	scripts[object.id] = object
}

/**
 * @param {String} id
 *
 * @properties={typeid:24,uuid:"868147AB-BE89-4A84-B992-F5FAA1961DA1"}
 */
function desistObject(id) {
	//TODO: shouldn't this also immediately perform some clientSide cleanups?
	delete allObjectCallbackHandlers[id]
	delete scripts[id]
}

/**
 * TODO: don't provide direct access, but through setter (maybe the setter should be a param in persistObject(...))
 * Map holding references to the callbackEvent handlers of the main DataVisualization and all it's subtypes.<br>
 * Used by the browserCallback function to lookup the correct object to delegate the callback to,<br>
 * in order to persists browserside updates to the map, without causing another render cycle towards the browser
 * @type {Object<Function>}
 * @properties={typeid:35,uuid:"AC3FA29A-BF87-4E0E-B308-B8B1C305A893",variableType:-4}
 */
var allObjectCallbackHandlers = {};

/**
 * Abstract identifier, should be overridden on DataVisualizer instances and return the id under which all browser interaction takes place
 * @abstract
 * @protected 
 * TODO: write UnitTest to check for this implementation
 * @properties={typeid:24,uuid:"3C417883-A4EB-46EF-B15C-4D9605846954"}
 */
function getDataVisualizationId(){}

/**
 * Flag to be used by implementations to check whether or not to execute the incremental update code
 * @private 
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"DEE20855-E5AE-4F6B-B370-F7C5B5554863",variableType:-4}
 */
var rendered = false;

/**
 * To check whether or not to execute the incremental update code
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"9BDACC0A-274A-4145-BF5F-F98B7732E090"}
 */
function isRendered() {
	return rendered
}

/**
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected 
 *
 * @properties={typeid:24,uuid:"C7C3623F-41C5-48DD-9345-D153FC02D04E"}
 */
function onLoad(event) {
	_super.onLoad(event);
	addJavaScriptDependancy('media:///modComponent/json3.js') //Always including json3.js to solve browser incompatibility issues with date serialization
	
	var elementId = scopes.modUtils$webClient.getElementMarkupId(elements.visualizationContainer)
	var impl = {
		renderHead: function(/**@type {Packages.org.apache.wicket.markup.html.IHeaderResponse}*/ response) { //(IHeaderResponse response) 
			var ids = Object.keys(scripts)
			var script = ''
				
			var object
			for (var i = 0; i < ids.length; i++) {
				object = scripts[ids[i]]
				script += 'svyDataVis.' + getDataVisualizationId() + '[\'' + object.id + '\']=\'' +  serializeObject(object) + '\';\n'
			}
			response.renderJavascript(script, elementId)
			response.renderOnLoadJavascript('svyDataVis.' + getDataVisualizationId() + '.initialize(\'' + ids.join("','") +'\');') //CHECKME: do the references cause a mem leak?
		}
	}
	
	var behavior  = new Packages.org.apache.wicket.behavior.AbstractBehavior(impl)
	scopes.modUtils$webClient.unwrapElement(elements.visualizationContainer).add(behavior)
	
	html = scopes.modUtils$webClient.XHTML2Text(<html>
		<head>
		</head>
		<body>
			<div id={getId()} style="width: 100%; height: 100%; overflow: hidden"><![CDATA[&nbsp;]]></div>
		</body>
	</html>);
}

/**
 * @properties={typeid:24,uuid:"35FAD910-F9D1-4AF0-B172-69D75CE1A228"}
 */
function executeClientsideScript(script) {
	//FIXME: should be throttled if isRendered() == false, as otherwise the Window is unknown
	//Currently hardcoded 'null' as window
	var windowName = controller.getWindow() ? controller.getWindow().getName() : 'null'
	scopes.modUtils$webClient.executeClientsideScript(script, windowName)
}

/**
 * @param {String} url
 *
 * @properties={typeid:24,uuid:"145C8785-B43F-4856-8287-4A8759499113"}
 */
function addJavaScriptDependancy(url) {
	scopes.modUtils$webClient.addJavaScriptDependancy(url, forms[controller.getName()])
}

/**
 * @param {String} url
 *
 * @properties={typeid:24,uuid:"C499C04C-9B9D-4939-9251-B327863EE24B"}
 */
function addCSSDependancy(url) {
	scopes.modUtils$webClient.addCSSDependancy(url, forms[controller.getName()])
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"9F416DD0-C2DA-46A6-8F28-63A5CEC9960C"}
 */
function onShow(firstShow, event) {
	_super.onShow(firstShow,event);
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
 * @properties={typeid:24,uuid:"36A21979-0F3F-49A1-B074-6DF879F207D1"}
 */
function onHide(event) {
	//TODO: what to do with the return value of onHide of the super?
	_super.onHide(event)
	//As a form gets hidden in de WC, the markup is removed, so the reference to the map becomes invalid, so we also delete the keys from the object store.
	executeClientsideScript('$.each([\'' + Object.keys(scripts).join("\',\'") + '\'],function(key, value) {delete svyDataVis.objects[value]});')
	rendered = false
	return true
}