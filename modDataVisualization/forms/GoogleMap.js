//Stuff to get things working in the Web Client
/**
 * @param {XML} DOM
 * @properties={typeid:24,uuid:"1857E26E-8D58-4910-B86B-D4EFE64DB774"}
 */
function render(DOM) {
	return; //It currently works without the stuff below...
//	var mrkrs = ''
//	for each(var marker in markers) {
//		marker.id = application.getUUID();
//		mrkrs += 'svyDataViz.' + getBrowserId() + '[\'' + marker.id + '\']=\'' + scopes.modDataVisualization.serializeObject(marker, scopes.modDataVisualization$GoogleMaps.specialTypes) + '\';'
//	}
//	if (mrkrs.length > 0) {
//		DOM.head.appendChild(<script>{mrkrs}</script>)
//	}
//	
//	var infWnds = ''
//	for each(var infoWindow in infoWindows) {
//		infoWindow.id = application.getUUID();
//		infWnds += 'svyDataViz.' + getBrowserId() + '[\'' + infoWindow.id + '\']=\'' + scopes.modDataVisualization.serializeObject(infoWindow, scopes.modDataVisualization$GoogleMaps.specialTypes) + '\';'
//	}
//	if (infWnds.length > 0) {
//		DOM.head.appendChild(<script>{infWnds}</script>)
//	}
//	application.output('-------------\n' + DOM.toXMLString() + '\n\n')
}

/**
 * Convenient Marker Store of all Markers on the map
 * When calling .setMap() on a marker, the Marker will be added to this Marker store on the relevant GoogleMap instance
 * 
 * @type {Array<scopes.modDataVisualization$GoogleMaps.Marker>}
 *
 * @properties={typeid:35,uuid:"92CAF31E-F19E-4483-A98E-0948BDC7C620",variableType:-4}
 */
var markers = {}

/**
 * Convenient InfoWindow Store of all InfoWindows on the map
 * When calling .setMap() on a InfoWindow, the InfoWindow will be added to this InfoWindow store on the relevant GoogleMap instance
 * 
 * @type {Array<scopes.modDataVisualization$GoogleMaps.InfoWindow>}
 * 
 * @properties={typeid:35,uuid:"C4680005-2127-4662-876D-95CABB2DCFE8",variableType:-4}
 */
var infoWindows = {}

/**
 * @private
 * @properties={typeid:24,uuid:"9EB750CE-8684-4DC8-949A-CE3CCD40AD01"}
 */
function getBrowserId() {
	return 'gmaps'
}

