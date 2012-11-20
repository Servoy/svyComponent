/*
 * This scope should handle the parts of data visualization that are generic:
 *
 * - the creation of a container object for the DataVisualization.
 *   In Web Client create an HTML Area, in SC create a BrowserBean instance (phase 2)
 *   The container object should not be the form directly, but an object with convenient methods to get done what needs to be done
 *
 * - Conversion of Servoy's dataTypes (JSFoundSet/JSDataSet,JSrecord to proper formats)
 */

/**
 * Converts an XML object to a String and removes CData tags ( &lt;![CDATA[ .... ]]> ).
 * @param {XML} html
 *
 * @returns {String}
 *
 * @properties={typeid:24,uuid:"5A050F6A-79CF-4C5B-8EEA-24F0E646FA85"}
 */
function stripCDataTags(html) {
	return html.toXMLString().replace(/]]>/g, '').replace(/\<\!\[CDATA\[/g, '');
}

/**
 * Wraps arbitrary content in CDATA tags
 * @param {String} content
 * 
 * @return {XML}
 * 
 * @properties={typeid:24,uuid:"D30E6A46-C3C7-4760-95F0-2ECD43F06127"}
 */
function CDataWrapper(content) {
	return new XML('<![CDATA[' + content + ']]>')
}

/**
 * Internal API: DO NOT CALL
 * @param {Object} o
 * @param {Array} [specialTypes]
 * @return {String}
 * @properties={typeid:24,uuid:"0D72ACC8-71D9-46BB-983E-A14AB191F73B"}
 */
function serializeObject(o, specialTypes) {
	if (o['toObjectPresentation'] instanceof Function) {
		var oo = o['toObjectPresentation']()
		return serializeObject(oo, specialTypes);
	}
	var str = JSON.stringify(o, function(key, value) {
			if (specialTypes && specialTypes.some(function(element, index, array) {
					return value instanceof element
				})) {
					return value.toObjectPresentation();
				}
			return value
		})
		
	return str;
}

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