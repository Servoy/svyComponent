/**
 * @type {scopes.modDataVis$googleMaps.Map}
 *
 * @properties={typeid:35,uuid:"DE7AD9F8-8D88-4865-8D5C-69D954170248",variableType:-4}
 */
var map

/**
 * @type {scopes.modDataVis$googleMaps.Marker}
 *
 * @properties={typeid:35,uuid:"63B3F6F5-36DE-43D1-B90E-413741C390EB",variableType:-4}
 */
var marker

/**
 * @type {scopes.modDataVis$googleMaps.InfoWindow}
 *
 * @properties={typeid:35,uuid:"A0AABFE8-3230-42A9-9F0A-15727FD363B8",variableType:-4}
 */
var infoWindow

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"3335EEB4-3E10-48DB-9A30-A14788C4477F"}
 */
function onLoad(event) {
	var gmaps = scopes.modDataVis$googleMaps
	map = new gmaps.Map(elements.tabless, {
		zoom: 2,
		center: new gmaps.LatLng(30, 20),
		mapTypeId: gmaps.MapTypeIds.HYBRID
	})
	
	infoWindow = new scopes.modDataVis$googleMaps.InfoWindow({
		content: 'Hello Paul, you did it..',
		position: map.getCenter()
	})
	infoWindow.open(map)
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"CA26368E-81BF-49E6-AFC4-7A86C5A03E07"}
 */
function addMarker(event) {
	if (!marker) {
		marker = new scopes.modDataVis$googleMaps.Marker({
			position: new scopes.modDataVis$googleMaps.LatLng(30, 20),
			map: map
		})
	} else {
		marker.setMap(map)
	}
}

/**
 * @param event
 *
 * @properties={typeid:24,uuid:"8594E527-21D6-4779-B3C9-DA24BC9F7813"}
 */
function addMarker2(event) {
	var marker2 = new scopes.modDataVis$googleMaps.Marker({
			position: new scopes.modDataVis$googleMaps.LatLng(10, 40)
		})
	marker2.setMap(map)
}


/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"550590C6-3EBE-4C92-AB2A-12225622FF50"}
 */
function setTitle(event) {
	marker.setTitle('Hello')
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D2946AA7-000D-4C6C-81CA-B61CAB8610CC"}
 */
function removeMarker(event) {
	marker.setMap(null)
}

/**
 * Perform the element default action.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @private
 *
 * @properties={typeid:24,uuid:"D0B308CD-C73D-45F1-8869-423CA560CF57"}
 */
function showInfoWindow(event) {
	infoWindow.open(map, marker)
}
