/**
 * Callback method for when solution is opened.
 *
 * @properties={typeid:24,uuid:"79B5DC9E-3287-4850-8C63-320BFB83C92F"}
 */
function onSolutionOpen() {
	application.putClientProperty(APP_UI_PROPERTY.TABLEVIEW_WC_DEFAULT_SCROLLABLE, true);
}

/**
 * @properties={typeid:24,uuid:"336166B1-D914-4701-B245-69C25DC2781B"}
 */
function testAbstractMethodImpl4AbstractDataVisualization() {
	//All instances of AbstractDataVisualization should implement getComponentId(), but not getId()
	var instances = scopes.modUtils$UI.getJSFormInstances(solutionModel.getForm('AbstractComponent'))
	
	instances.forEach(function(element, index, array){
		/** @type {JSForm} */
		var jsForm = element
		var methods = jsForm.getMethods(false)
		var hasGetDataVisualizationId = false
		var hasGetId = false
		methods.every(function(el, i, ar) {
			/** @type {JSMethod} */
			var method = el
			switch (method.getName()) {
				case 'getComponentId':
					hasGetDataVisualizationId = true
					break;
				case 'getId':
					hasGetId = true
					break;
				default:
					break;
			}
		})
		jsunit.assertTrue('AbstractDataVisualization instances MUST override .getComponentId()', hasGetDataVisualizationId)
		jsunit.assertFalse('AbstractDataVisualization instances must NOT override .getId()', hasGetId)
	})
}
