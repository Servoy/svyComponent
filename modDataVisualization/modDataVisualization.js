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
 * @properties={typeid:24,uuid:"23E83A2C-6B8E-4CF9-A031-A29F02B3DF3E"}
 * @param {RuntimeTabPanel} panel the panel to which the visualization gets added
 * @param {RuntimeForm<AbstractDataVisualizer>} form
 */
function createVisualizationContainer(panel, form) {
	var formName = application.getUUID().toString()
	application.createNewFormInstance(form.controller.getName(), formName)
	
	panel.removeAllTabs()
	panel.addTab(forms[formName])

	return forms[formName]
}