/**
 * @protected
 * @type {Array<byte>}
 *
 * @properties={typeid:35,uuid:"97DEF22B-2844-41D3-9EF4-CADA14063C14",variableType:-4}
 */
var html;

/**
 * @type {String}
 *
 * @properties={typeid:35,uuid:"9CE6ECC4-F086-4134-8FB0-91FB590EFCB6"}
 */
var browserId

/**
 * TODO: hardcoded reference to gmap initializer, which is wrong
 * @type {XML}
 * @properties={typeid:35,uuid:"E2EA30EC-9DF9-4FE4-A5B7-E102DB54CC0E",variableType:-4}
 */
var dom = <html>
	<head>
	</head>
	<body>
		<div id={getId()} style="width: 100%; height: 100%; overflow: hidden"><![CDATA[&nbsp;]]></div>
	</body>
</html>

/**
 * @type {Array}
 *
 * @properties={typeid:35,uuid:"0261CBF8-0C13-4FA1-88C0-31E2AADE7DAA",variableType:-4}
 */
var scripts = <scripts/>;

/**
 * @properties={typeid:35,uuid:"EB18FD74-CBBD-4CF9-BAC3-6ACE7C79DBA9",variableType:-4}
 */
var scriptObj = {};

/**
 * @param {Object} script
 * @param {Object} id
 *
 * @properties={typeid:24,uuid:"798D1B39-79DD-4C06-AF7E-53C747107059"}
 */
function addScript(id, script) {
	scriptObj[id] = script;
}

///**
// * @param {String} code
// *
// * @properties={typeid:24,uuid:"87C182AD-B370-4FF3-BE54-EC60F9562971"}
// */
//function addCode(code) {
//	if (rendered) {
//		plugins.WebClientUtils.executeClientSideJS(code.charAt(-1) == ';' ? code : code + ';')
//	}
//	else {
//		addScript(<script>{code}</script>)
//	}
//}

/**
 * @param {String} jsonString
 *
 * @properties={typeid:24,uuid:"0FB00B1F-C956-484C-9C50-595675A57E54"}
 */
function storeState(jsonString) {
	/** @type {{id: UUID}} */
	var obj = JSON.parse(jsonString);
	
	addScript(obj.id, <script>{'svyDataViz.' + getBrowserId() + '.todos.push(\'' + jsonString + '\')'}</script>);

	scripts = <scripts/>;
	for (var s in scriptObj) {
		scripts.appendChild(scriptObj[s]);
	}
	render();
	plugins.WebClientUtils.setRendered(elements.visualizationContainer);
}

/**
 * @properties={typeid:24,uuid:"8E72F496-5DAE-4A2E-A763-F5EA640012A5"}
 */
function render() {
	var copy = dom.copy()
	copy.body.@onLoad = 'svyDataViz.' + getBrowserId() + '.initialize()'
	copy.head.setChildren(scripts.children())
	html = scopes.modDataVisualization.stripCDataTags(copy)
}

/**
 * @properties={typeid:24,uuid:"83DBC63F-DADD-4AE0-AE17-0B6F933F79B7"}
 */
function getId() {
	return controller.getName()
}

/**
 * TODO: write UnitTest to check for this implementation
 * Abstract identifier, should be overridden on Datavizualiser instances and return the id under which all browser interaction takes place
 * @properties={typeid:24,uuid:"67A9483F-B661-47CC-8E7A-5FB737C94A4A"}
 */
function getBrowserId(){}

/**
 * Callback method when form is destroyed.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"0A8FE3BA-A64C-4298-AA00-AA0731573ABB"}
 */
function onUnload(event) {
	//TODO Implement whatever is needed to perform cleanup of references
}

/**
 * @type {Boolean}
 *
 * @properties={typeid:35,uuid:"132449CC-9E6E-4AC2-8AEE-DD4163C6034C",variableType:-4}
 */
var rendered = false

/**
 * Callback method for when form is shown.
 *
 * @param {Boolean} firstShow form is shown first time after load
 * @param {JSEvent} event the event that triggered the action
 *
 * @protected
 *
 * @properties={typeid:24,uuid:"4C7A2CF9-E700-412C-BB7E-91E0A1002385"}
 */
function onShow(firstShow, event) {
	if (firstShow) {
		rendered = true
	}
}

/**
 * Handle hide window.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @private
 *
 * @properties={typeid:24,uuid:"22CD8598-93D9-4261-952C-5129AE22778F"}
 */
function onHide(event) {
	//TODO: browserSide cleanup?
	rendered = false
	return true
}
