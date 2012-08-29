//Stuff to get things working in the Web Client
/**
 * @type {XML}
 * @properties={typeid:35,uuid:"F56F777E-C324-416A-85AD-025422225AC0",variableType:-4}
 */
var dom = <html>
	<head>
	</head>
	<body onload={'initialize(\'' + getId() + '\')'}>
		<div id={getId()} style="width: 100%; height: 100%"><![CDATA[&nbsp;]]></div>
		<input type="button" id="eventHandleButton" onclick="javascript:forms.GoogleMap.handleEvent()" style="visibility:hidden; top:0px; left:0px; position:absolute;"/>
	</body>
</html>

/**
 * @param {Object} arg
 *
 * @properties={typeid:24,uuid:"3BE42838-383D-4DA0-9D15-5CB624D7238F"}
 */
function handleEvent(arg) {
	
	plugins.WebClientUtils.executeClientSideJS("", getValues, ['calledId', 'calledObjectType', 'calledEvent'])
	
}

/**
 * @param {Object} id
 * @param {Object} objectType
 * @param {Object} event
 *
 * @properties={typeid:24,uuid:"060E1A54-5522-4136-B658-1DC32E15D903"}
 */
function getValues(id, objectType, event) {
	application.output("id: " + id + ", objectType: " + objectType + ", event: " + event);
}

/**
 * @properties={typeid:24,uuid:"F7F24BAF-2341-465E-ADB2-B01987037637"}
 */
function getId() {
	return controller.getName()
}

/**
 * @properties={typeid:24,uuid:"01375B7F-1EA4-4E8B-8A40-61A69E5AC222"}
 */
function toObjectPresentation() {
	return {
		svySpecial: true, 
		type: 'reference', 
		parts: ['maps', 'gmaps', getId()]
	}
}

/**
 * @properties={typeid:35,uuid:"450779CA-8630-432D-839C-DF3C5FA16DFE",variableType:-4}
 */
var scripts = <scripts/>

/**
 * @param {Object} script
 *
 * @properties={typeid:24,uuid:"A5210EE9-6A79-492E-9AD6-33CBE5368FB7"}
 */
function addScript(script) {
	scripts.appendChild(script)
}

/**
 * @properties={typeid:24,uuid:"1857E26E-8D58-4910-B86B-D4EFE64DB774"}
 */
function render() {
	var copy = dom.copy()
	copy.head.setChildren(scripts.children())
	
	var mrkrs = ''
	for each(var marker in markers) {
		marker.id = application.getUUID();
		mrkrs += 'maps.todos.push(\'' + scopes.modGoogleMaps.serializeObject(marker) + '\');'
	}
	if (mrkrs.length > 0) {
		copy.head.appendChild(<script>{mrkrs}</script>)
	}
	html = scopes.modDataVisualization.stripCDataTags(copy)
}

//Convenient Marker store 
/**
 * @type {Array<scopes.modGoogleMaps.Marker>}
 *
 * @properties={typeid:35,uuid:"92CAF31E-F19E-4483-A98E-0948BDC7C620",variableType:-4}
 */
var markers = {}


/*
 * Google Maps API
 * @see https://developers.google.com/maps/documentation/javascript/reference#Map
 * @version v3
 */
/**
 * @param {LatLngBounds} bounds
 *
 * @properties={typeid:24,uuid:"45901165-FCBA-458E-90C0-F9A3E4AFF4E1"}
 */
function fitBounds(bounds) {}

/**
 * @return {LatLngBounds}
 * @properties={typeid:24,uuid:"6020FA38-16FE-4144-9992-AE16E593CF3A"}
 */
function getBounds() {}

/**
 * @return {LatLng}
 * @properties={typeid:24,uuid:"5CC85CB1-3AE1-4EA7-B84F-564AE70A1226"}
 */
function getCenter() {}

/**
 * @return {RuntimeTabPanel}
 * @properties={typeid:24,uuid:"C8240F04-F215-4C99-9F85-3ECEE65A9120"}
 */
function getDiv() {}

/**
 * @return {Number}
 * @properties={typeid:24,uuid:"61B0C9B7-E618-4713-A905-C6436B584839"}
 */
function getHeading() {}

/**
 * @return {String}
 * @properties={typeid:24,uuid:"0040F70C-7F2B-464C-B234-A197CF316A4F"}
 */
function getMapTypeId() {}

/**
 * @return {Projection}
 * @properties={typeid:24,uuid:"25A2E8F1-4F06-4E25-96AB-64E13B9A8D2B"}
 */
function getProjection() {}

/**
 * @return {StreetViewPanorama}
 * @properties={typeid:24,uuid:"8A0699B5-9892-4648-AAA9-917486D4C0B1"}
 */
function getStreetView() {}

/**
 * @return {Number}
 * @properties={typeid:24,uuid:"D6CD6804-A5BF-4114-B48B-FF8937D23F66"}
 */
function getTilt() {}

/**
 * @return {Number}
 * @properties={typeid:24,uuid:"B332C4F1-2826-4EA7-B2E6-D44F6C4D1AA8"}
 */
function getZoom() {}

/**
 * @param {Number} x
 * @param {Number} y
 *
 * @properties={typeid:24,uuid:"8CFE51D0-6E43-4003-8632-444424A2C491"}
 */
function panBy(x, y) {}

/**
 * @param {LatLng} latLng
 *
 * @properties={typeid:24,uuid:"B7AB950B-D46D-40F6-8C60-DEE033CD2FB1"}
 */
function panTo(latLng) {}

/**
 * @param {LatLngBounds} latLngBounds
 *
 * @properties={typeid:24,uuid:"8017C067-EAE8-45F4-80D3-7EE0D043C76E"}
 */
function panToBounds(latLngBounds) {}

/**
 * @param {LatLng} latLng
 *
 * @properties={typeid:24,uuid:"B35129D7-43DC-41F4-AC6D-9BD6C724F723"}
 */
function setCenter(latLng) {}

/**
 * @param {Number} heading
 *
 * @properties={typeid:24,uuid:"D79DB6EF-F59E-4EF6-9413-304436499544"}
 */
function setHeading(heading) {}

/**
 * @param {String} mapTypeId
 *
 * @properties={typeid:24,uuid:"422BB830-942F-43FE-8536-8B5947063602"}
 */
function setMapTypeId(mapTypeId) {}

/**
 * @param {MapOptions} options
 *
 * @properties={typeid:24,uuid:"FB5DAD09-E2D0-40DE-940D-9C2B231FEB5F"}
 */
function setOptions(options) {}

/**
 * @param {StreetViewPanorama} panorama
 *
 * @properties={typeid:24,uuid:"02B2F115-1015-41E9-B5B6-B38FF626A720"}
 */
function setStreetView(panorama) {}

/**
 *  @param {Number} tilt
 *
 * @properties={typeid:24,uuid:"DDF19635-AB1B-491F-BE19-A7FF424661E7"}
 */
function setTilt(tilt) {}

/**
 * @param {Number} zoom
 *
 * @properties={typeid:24,uuid:"18932509-F32B-4ADA-981E-11DE7AA5220B"}
 */
function setZoom(zoom) {}

/**
 * @properties={typeid:35,uuid:"7AD26AFE-F7E9-43F7-8421-620A82ABB5E8",variableType:-4}
 */
var EVENT_TYPES = {
	BOUNDS_CHANGED: 'bounds_changed',
	CENTER_CHANGED: 'center_changed',
	CLICK: 'click',
	DBLCLICK: 'dblclick',
	//DRAG: 'drag',
	//DRAGEND: 'dragend',
	//DRAGSTART: 'dragstart',
	HEADING_CHANGED: 'heading_changed',
	//IDLE: 'idle',
	MAPTYPEID_CHANGED: 'maptypeid_changed',
	//MOUSEMOVE: 'mousemove',
	//MOUSEOUT: 'mouseout',
	//MOUSEOVER: 'mouseover',
	PROJECTION_CHANGED: 'projection_changed',
	//RESIZE: 'resize',
	//RIGHTCLICK: 'rightclick',
	//TILESLOADED: 'tilesloaded',
	TILT_CHANGED: 'tilt_changed',
	ZOOM_CHANGED: 'zoom_changed',
}

/**
 * // TODO generated, please specify type and doc for the params
 * @param {Object} eventHandler
 * @param {Object} eventType
 *
 * @properties={typeid:24,uuid:"F29A6319-139F-4A1A-9557-BB5874E93BD9"}
 */
function addEventListener(eventHandler, eventType) {
	
}