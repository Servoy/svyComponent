//Stuff to get things working in the Web Client
/**
 * @properties={typeid:24,uuid:"1857E26E-8D58-4910-B86B-D4EFE64DB774"}
 */
function render() {
	var copy = dom.copy()
	copy.head.setChildren(scripts.children())
	copy.body.@onLoad = 'svyDataViz.' + getBrowserId() + '.initialize()'
	var mrkrs = ''
	for each(var marker in markers) {
		marker.id = application.getUUID();
		mrkrs += 'svyDataViz.gmaps.todos.push(\'' + scopes.modDataVisualization.serializeObject(marker, scopes.modGoogleMaps.specialTypes) + '\');'
	}
	if (mrkrs.length > 0) {
		copy.head.appendChild(<script>{mrkrs}</script>)
	}
	html = scopes.modDataVisualization.stripCDataTags(copy)
}

/**
 * Convenient Marker Store of all Markers on the map
 * When calling .setMap() on a marker, the Marker will be added to this Marker store on the relevant GoogleMap instance
 * 
 * @type {Array<scopes.modGoogleMaps.Marker>}
 *
 * @properties={typeid:35,uuid:"92CAF31E-F19E-4483-A98E-0948BDC7C620",variableType:-4}
 */
var markers = {}



/**
 * @properties={typeid:24,uuid:"9EB750CE-8684-4DC8-949A-CE3CCD40AD01"}
 */
function getBrowserId() {
	return 'gmaps'
}
