/**
 * @properties={typeid:24,uuid:"336166B1-D914-4701-B245-69C25DC2781B"}
 */
function testAbstractMethodImpl4AbstractDataVisualization() {
	//All instances of AbstractDataVisualization should implement getBrowserId(), but not getId()
	var instances = scopes.modUtils$UI.getJSFormInstances(solutionModel.getForm('AbstractDataVisualizer'))
	
	instances.forEach(function(element, index, array){
		/** @type {JSForm} */
		var jsForm = element
		var methods = jsForm.getMethods(false)
		var hasGetBrowserId = false
		var hasGetId = false
		methods.every(function(el, i, ar) {
			/** @type {JSMethod} */
			var method = el
			switch (method.getName()) {
				case 'getBrowserId':
					hasGetBrowserId = true
					break;
				case 'getId':
					hasGetId = true
					break;
				default:
					break;
			}
		})
		jsunit.assertTrue('AbstractDataVisualization instances MUST override .getBrowserId()', hasGetBrowserId)
		jsunit.assertFalse('AbstractDataVisualization instances must NOT override .getId()', hasGetId)
	})
}
