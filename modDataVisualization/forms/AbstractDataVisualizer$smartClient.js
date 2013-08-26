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

/**
 * @private 
 *
 * @properties={typeid:35,uuid:"8BBE8A91-EBDE-4759-B3CF-C73506E288AA",variableType:-4}
 */
var log = (function() {
		var logger = scopes.modUtils$log.getLogger('com.servoy.bap.components.abstractcomponent.smartclient')

		logger.setLevel(scopes.modUtils$log.Level.DEBUG)
		return logger
	}())

/**
 * @type {scopes.modJFXWebView.WebViewPanel}
 *
 * @properties={typeid:35,uuid:"26A94FFF-640C-4233-A71E-BE0F77CB1038",variableType:-4}
 */
var webPane

/**
 * @private
 * @type {Object<String>}
 * @properties={typeid:35,uuid:"11DBD598-42FD-45FF-9DFB-3F865D0E1B46",variableType:-4}
 */
var scripts = {};

/**
 * @private 
 * @properties={typeid:35,uuid:"BC7BCCBE-90C4-4E50-9B4B-E31BD20F7761",variableType:-4}
 */
var jsDependancies = []

/**
 * @private
 * @properties={typeid:35,uuid:"0E84F397-C9C5-43B7-A806-C881A3A662F6",variableType:-4}
 */
var cssDependancies = []

/**
 * @param {{id: String}} object
 * @param {String} [incrementalUpdateCode]
 * @param {Boolean} [isSubType] To indicate a subType is being persisted. If the main DataVisualization is already rendered and a new subType is added, setting this flag to true will push the new type straight to the browser. Default: false
 *
 * @properties={typeid:24,uuid:"D09C4575-7065-42AB-A541-3EB6996EEDAD"}
 */
function persistObject(object, incrementalUpdateCode, isSubType) {
	var script = 'svyDataVis.' + getDataVisualizationId() + '[\'' + object.id + '\']=\'' +  serializeObject(object) + '\''
	
	//If rendered and a new subType is added, send to browser straight away
	if (isRendered() && !scripts[object.id]) {
		executeClientsideScript(script)
		executeClientsideScript('svyDataVis.' + getDataVisualizationId() + '.initialize(\'' + object.id +'\');')
	}
	
	if (isRendered() && incrementalUpdateCode) {
		executeClientsideScript(incrementalUpdateCode)
	}
	
	scripts[object.id] = script
}

/**
 * @param {String} id
 *
 * @properties={typeid:24,uuid:"2F249CA7-EB01-4D6A-BD46-F344AD6C9355"}
 */
function desistObject(id) {
	delete allObjectCallbackHandlers[id]
	delete scripts[id]
}

/**
 * Map holding references to the callbackEvent handlers of the main DataVisualization and all it's subtypes.<br>
 * Used by the browserCallback function to lookup the correct object to delegate the callback to,<br>
 * in order to persists browserside updates to the map, without causing another render cycle towards the browser
 * @type {Object<Function>}
 * @properties={typeid:35,uuid:"9C9A9E56-F423-4962-92CD-747C49D1DCB4",variableType:-4}
 */
var allObjectCallbackHandlers = {};

/**
 * Abstract identifier, should be overridden on DataVisualizer instances and return the id under which all browser interaction takes place
 * @abstract
 * @protected 
 * TODO: write UnitTest to check for this implementation
 * @properties={typeid:24,uuid:"AD9F8AAA-90A2-4664-BD91-ED05E2C61A69"}
 */
function getDataVisualizationId(){}

/**
 * Flag to be used by implementations to check whether or not to execute the incremental update code
 * @private 
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"01E1055B-98D8-412C-8EA4-724D8E5E0942",variableType:-4}
 */
var rendered = false;

/**
 * To check whether or not to execute the incremental update code
 * @return {Boolean}
 *
 * @properties={typeid:24,uuid:"75F7689E-6BD5-4DF0-9DD9-529E88BFBA9D"}
 */
function isRendered() {
	return rendered
}

/**
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected 
 *
 * @properties={typeid:24,uuid:"8E192053-D35E-4C47-8BA9-8E40AB3DC843"}
 */
function onLoad(event) {
	_super.onLoad(event);
	webPane = new scopes.modJFXWebView.WebViewPanel(elements.container)
}

/**
 * @param {String} script
 * @properties={typeid:24,uuid:"EF53426A-F9D1-492C-A756-1FC78D93859A"}
 */
function executeClientsideScript(script) {
	//FIXME: this should probably be throttled if isRendered() == false. See InfoWindow.open() method for usecase
	webPane.executeScriptLater(script)
}

/**
 * @param {String} url
 *
 * @properties={typeid:24,uuid:"D2DE4AA4-8D02-4AEC-84B5-FB2A21B2233C"}
 */
function addJavaScriptDependancy(url) {
	if (jsDependancies.indexOf(url) === -1) {
		jsDependancies.push(url)
	}
	if (isRendered()) {
		webPane.executeScriptLater('$("head").append(\'<script type="text/javascript" src="' + url + '"></script>\')')
	}
}

/**
*
* @param {String} url
*
* @properties={typeid:24,uuid:"E64002BA-62B3-4817-8E94-EDE26269E3D7"}
*/
function addCSSDependancy(url) {
	if (cssDependancies.indexOf(url) === -1) {
		cssDependancies.push(url)
	}
	if (isRendered()) {
		webPane.executeScriptLater('$("head").append(\'<link type="text/css" rel="stylesheet" href="' + url + '">\')')
	}
}

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"5BE78E3B-02F8-4100-A42A-BA0F185FB672"}
 */
function onShow(firstShow, event) {
	log.trace('runtimesize in onShow: x=' + elements.container.getWidth() + ', y=' + elements.container.getHeight())

	if (firstShow) {
		var dom = '<html>\
			<head>'
		for (var i = 0; i < jsDependancies.length; i++) {
			dom += '<script type="text/javascript" src="' + jsDependancies[i] + '"></script>\n';
		}
		for (i = 0; i < cssDependancies.length; i++) {
			dom += '<link type="text/css" rel="stylesheet" href="' + cssDependancies[i] + '"></link>\n';
		}
		
		for (var script in scripts) {
			dom += '<script type="text/javascript">' + scripts[script] + '</script>\n';
		}
		dom += '</head>\
			<body style="display: block; width: 100%; height: 100%; box-sizing: border-box; padding: 0px; margin: 0px; overflow: hidden" '
		dom += 'onload="svyDataVis.' + getDataVisualizationId() + '.initialize(\'' + Object.keys(scripts).join("','") +'\');">'
			
		dom += '<div id="' + getId() + '" style="width: 100%; height: 100%; overflow: hidden">&nbsp;</div>'
		dom += '</body>\
		</html>'
			
		webPane.loadContent(dom)
		rendered = true
	}
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
 * @properties={typeid:24,uuid:"987A4294-F39C-4A3E-A8C0-660F0BFD88F4"}
 */
function onHide(event) {
	_super.onHide(event)
	rendered = false
	return true
}
