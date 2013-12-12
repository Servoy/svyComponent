
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"82108840-FE29-4C04-BB46-AF549D3FE6B5"}
 */
function onAction(event) {
	var script = scopes.svyWebClientUtils.getCallbackScript(callbackMethod, ['"hello"'] , null, true)
	application.output('From JS Callback: ' + script)
	
	scopes.svyWebClientUtils.executeClientsideScript(script)
	
	script = plugins.WebClientUtils.generateCallbackScript(callbackMethod, ['hello'])
	application.output('WCUtils Callback: ' + script)
	
	script = plugins.WebClientUtils.getJSONCallbackURL(callbackMethod, {name: 'hello'})
	application.output('JSON Callback: ' + script)
	
//	if (function() {
//		return true;
//	}.bind(this)()) {
//		Wicket.showIncrementally('indicator');
//	}
	
//	var wcall = wicketAjaxPost(
//		'?x=Al2J108MXjZum-tiOAFaAg', //url
//		'm=1095101125' + '&p=' + encodeURIComponent(hello), //body
//		function() {
//			;
//			Wicket.hideIncrementally('indicator');
//		}.bind(this), //successhandler
//		function() {
//			;
//			Wicket.hideIncrementally('indicator');
//		}.bind(this),  //failureHandler
//		function() {
//			if (!function() {
//				return true;
//			}.bind(this)()) {
//				Wicket.hideIncrementally('indicator');
//			}
//			return true;
//		}.bind(this) //precondition
//	);
//
//	
//	
//	function wicketAjaxPost(url, body, successHandler, failureHandler, precondition, channel) {
//		var call = new Wicket.Ajax.Call(url, successHandler, failureHandler, channel);
//		
//		if (typeof(precondition) != "undefined" && precondition != null) {		
//			call.request.precondition = precondition;
//		}
//		
//		return call.post(body);
//	}
}


/**
 * TODO generated, please specify type and doc for the params
 * @param args
 *
 * @properties={typeid:24,uuid:"879AABB5-2432-4BEC-9137-084A74DA9E7C"}
 */
function callbackMethod(args) {
	application.output(arguments)
	application.sleep(15000)
	application.output('returning')
	
	return 'from form :' + controller.getName()
}
/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"0DECD6C8-F987-4E9C-B826-53AAA574D757"}
 */
function onAction1(event) {
	var win = application.createWindow('test',JSWindow.DIALOG)
	win.show(forms.testCallbacks2)
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"24F47D6F-2C17-4ED1-918D-0D45FFB0068F"}
 */
function onAction2(event) {
	scopes.svyWebClientUtils.getWebClientPluginAccess().addCSSResource("media:///test.css")
}
