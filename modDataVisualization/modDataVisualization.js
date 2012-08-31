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
	
	return JSON.stringify(o, function(key, value) {
			if (specialTypes && specialTypes.some(function(element, index, array) {
					return value instanceof element
				})) {
					return value.toObjectPresentation();
				}
			return value
		})
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