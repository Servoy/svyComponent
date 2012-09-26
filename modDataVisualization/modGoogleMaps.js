/*
 * Google Maps APIv3.9 implementation: https://developers.google.com/maps/documentation/javascript/reference
 * 
 * TODO: Implement mechanism to sync scripting updates to browser
 * TODO: Implement API of Marker & Maps
 * TODO: Marker instance lookups
 * TODO: Event firing
 * TODO: implement InfoWindow
 * TODO: implement PolyLine
 * TODO: remove console.log statements, as not supported in every browser
 * TODO: add JSON polyfill for older browsers
 */

/**
 * Variable with self executing function as value to run some initialization code when the scope gets instantiated on solution start.
 * - Dynamically created an .js entry in the Media Lib and includes it in the Web CLient 
 * - Sets up several .toObjectPresentation prototypes on constructors, needed for serialization of objects to browser side
 * @private
 * @SuppressWarnings(unused)
 * @properties={typeid:35,uuid:"C88DB00A-27F8-4CAB-A8FB-C1D2D50FC5C4",variableType:-4}
 */
var init = function() {
	var code = <script type='text/javascript'>
	<![CDATA[
	   	var script = document.createElement("script");
	    script.type = "text/javascript";
	    script.src = 'http://maps.googleapis.com/maps/api/js?v=3.9&key=AIzaSyD6A559b-KBYGBBM6mmDPcYYNpAzv_Rv1Y&sensor=false&callback=svyDataVizGMapCallback';
//	    script.src = 'http://maps.googleapis.com/maps/api/js?key=' + apiKey + '&sensor=false&callback=svyDataVizGMapCallback';
	    document.head.appendChild(script);

		if (window.svyDataViz == undefined) var svyDataViz = {
			dynConstructor: function (Constructor) {
				//Helper function form dynamically calling a constructor function with arguments
				//http://stackoverflow.com/questions/3362471/how-can-i-call-a-javascript-constructor-using-call-or-apply
				var args = Array.prototype.slice.call(arguments, 1);
				return function() {

					var Temp = function() {}, // temporary constructor
						inst, ret; // other vars

					// Give the Temp constructor the Constructor's prototype
					Temp.prototype = Constructor.prototype;

					// Create a new instance
					inst = new Temp;

					// Call the original Constructor with the temp
					// instance as its context (i.e. its 'this' value)
					ret = Constructor.apply(inst, args);

					// If an object has been returned then return it otherwise
					// return the original instance.
					// (consistent with behaviour of the new operator)
					return Object(ret) === ret ? ret : inst;

				}
			},
			reviver: function (key, value) {
				//Helper function to deserialize JSON containing special objects that should map to clientside API
	    		if (value.hasOwnProperty('svySpecial') && value.svySpecial == true) {
	    			var object = value.scope||window
					for (var i = 0; i < value.parts.length; i++) {
						object = object[value.parts[i] ]
					}
					switch (value.type) {
						case 'call':
							return object.apply(value.scope ? window[value.scope] : null, value.args)
						case 'constructor':
							return svyDataViz.dynConstructor.apply(this, [object].concat(value.args))()
						case 'reference':
							return object
//							case 'domReference':
//								return document.getElementbyId(args[0])
						default:
							return
					}
	    		}
	    		return value
	    	}
		}
		svyDataViz.gmaps = {
			objects: {},
			todos: [],
			initialize: function() {
		    	if (window.google && google.maps) {
		    		for (var i = 0; i < this.todos.length; i++) {
		    			console.log(this.todos[i])
		    			var node = JSON.parse(this.todos[i], svyDataViz.reviver)

						if (node && node.type == "map") {
							console.log("MAP:");
							console.log(node);
							var map = new google.maps.Map(document.getElementById(node.id), node.options)
							map.set('svyId',node.id)
							this.objects[node.id] = map
							
							var events = [
								'idle',
//								'bounds_changed', 
//								'center_changed', 
								'click', 
								'dblclick', 
								'heading_changed', 
								'maptypeid_changed', 
								'projection_changed',
								'tilt_changed'
//								'zoom_changed',
							];
							
							for (var j = 0; j < events.length; j++) {
								var handler = function(id, eventType){
									return function(event) {
										svyDataViz.gmaps.callbackIntermediate("map", id, eventType, event)
									}
								}(node.id, events[j])
								google.maps.event.addListener(map, events[j], handler);
							}
							
						} else if (node && node.type == "marker"){
							var marker = new google.maps.Marker(node.options)
							marker.set('svyId',node.id)
							this.objects[node.id] = marker
							
							var events = ['click', 'dblclick', 'dragend', 'rightclick'];
							for (var j = 0; j < events.length; j++) {
								var handler = new Function ("svyDataViz.gmaps.callbackMarker.call(this, 'marker', '"+node.id+"', '"+events[j]+"', event)");
								google.maps.event.addListener(marker, events[j], handler);
							}
						} else if (node && node.type == "infoWindow"){
							console.log("InfoWindow");
							console.log(node);
							var infoWindow = new google.maps.infoWindow(node.options)
							infoWindow.set('svyId',node.id)
							this.objects[node.id] = infoWindow
							
//							var events = ['closeclick'];
//							for (var j = 0; j < events.length; j++) {
//								var handler = new Function ("svyDataViz.gmaps.callbackInfoWindow.call(this, 'infoWindow', '"+node.id+"', '"+events[j]+"', event)");
//								google.maps.event.addListener(infoWindow, events[j], handler);
//							}
						}
					}
					this.todos = []
		    	}
		    },
			callbackIntermediate: function(objectType, id, eventType, event){
				//Intermediate function to retrieve relevant data when events occur on a map and then send them to the server
				var data
				var map = svyDataViz.gmaps.objects[id]
				switch (eventType) {
//					case 'bounds_changed':
//						break;
//					case 'center_changed':
//						data = JSON.stringify({lat: map.getCenter().lat(), lng: map.getCenter().lng()})
//						break;
//					case 'click':
//						console.log('click');
//						break;
//					case 'position_changed':
//						console.log('click');
//						break;
//					case 'dblclick':
//						break;
//					case 'heading_changed':
//						data = map.getHeading() 
//						break;
//					case 'maptypeid_changed':
//						data = map.getMapTypeId()
//						break;
//					case 'projection_changed':
//						break;
//					case 'tilt_changed':
//						data = map.getTilt()
//						break;
//					case 'zoom_changed':
//						data = map.getZoom();
//						break;
					case 'idle':
						bounds = map.getBounds()
					
						data = JSON.stringify({
							bounds: {sw: {lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng()}, ne: {lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng()}},
							center: {lat: map.getCenter().lat(), lng: map.getCenter().lng()},
							heading: map.getHeading(),
							mapTypeId: map.getMapTypeId(),
							tilt: map.getTilt(),
							zoom: map.getZoom()
						})
						break;
					default:
						break;
				}
				this.mapsEventHandler('map', id, eventType,data)
			},
			callbackMarker: function(objectType, id, eventType, event){
				//Function to retrieve relevant data when events occur on a marker and then send them to the server
				var data
				var marker = svyDataViz.gmaps.objects[id]
				switch (eventType) {
//					case 'position_changed':
//						console.log('position_changed');
//						data = JSON.stringify({
//							position: {lat: marker.getPosition().lat(), lng: marker.getPosition().lng()},
//							mapid: marker.map.svyId
//						})						
//					case 'dblclick':
//						break;
//					case 'idle':
//						bounds = map.getBounds()
//					
//						data = JSON.stringify({
//							bounds: {sw: {lat: bounds.getSouthWest().lat(), lng: bounds.getSouthWest().lng()}, ne: {lat: bounds.getNorthEast().lat(), lng: bounds.getNorthEast().lng()}},
//							center: {lat: map.getCenter().lat(), lng: map.getCenter().lng()},
//							heading: map.getHeading(),
//							mapTypeId: map.getMapTypeId(),
//							tilt: map.getTilt(),
//							zoom: map.getZoom()
//						})
//						break;
					default:
						data = JSON.stringify({
							position: {lat: marker.getPosition().lat(), lng: marker.getPosition().lng()},
							mapid: marker.map.svyId
						})		
						break;
				}
				svyDataViz.gmaps.mapsEventHandler(objectType, id, eventType, data);
			}
		}
		
		function svyDataVizGMapCallback() {
			svyDataViz.gmaps.initialize()
		}
	]]>
	</script>
	
	
	//TODO: find a better way to do this: adding the UUID will prevent browsers caching the .js file
	var bytes = new Packages.java.lang.String(code).getBytes('UTF-8')
	var uuid = application.getUUID();
	solutionModel.newMedia('googleMapsHandler_'+uuid+'.js', bytes)
	plugins.WebClientUtils.addJsReference('media:///googleMapsHandler_'+uuid+'.js')
	//solutionModel.newMedia('googleMapsHandler.js', bytes)
	//plugins.WebClientUtils.addJsReference('media:///googleMapsHandler.js')

	var callback = plugins.WebClientUtils.generateCallbackScript(browserCallback,['objectType', 'id', 'eventType', 'data'], false);
	var script = 'svyDataViz.gmaps.mapsEventHandler = function(objectType, id, eventType, data){' + callback + '}';
	bytes = new Packages.java.lang.String(script).getBytes('UTF-8')
	uuid = application.getUUID();
	solutionModel.newMedia('googleMapsHandlerCallback_'+uuid+'.js', bytes)
	plugins.WebClientUtils.addJsReference('media:///googleMapsHandlerCallback_'+uuid+'.js')
	
	//Setup toObjectPresentation function through prototype on constructor functions that need to be serialized to client
	LatLng.prototype.toObjectPresentation = function() {
		return { svySpecial: true, type: 'constructor', parts: ['google', 'maps', 'LatLng'], args: [this.lat(), this.lng()] }
	}
	MapTypeId.prototype.toObjectPresentation = function() {
		return { svySpecial: true, type: 'reference', parts: ['google', 'maps', 'MapTypeId', this.type] }
	}
}()

/**
 * Generic callbackHandler for events send from the browser to the server
 * @private 
 * @properties={typeid:24,uuid:"2B8B17B3-42F6-46AA-86B1-9A8D49ABA53E"}
 */
function browserCallback(objectType, id, eventType, data) {
	var options = allObjects[id][0];
	var o;
	switch (objectType) {
		case 'map':
			switch (eventType) {
//				case 'bounds_changed':
//					break;
//				case 'center_changed':
//					var o = JSON.parse(data)
//					options.center = new scopes.modGoogleMaps.LatLng(o.lat,o.lng)
//					break;
//				case 'click':
//					break; 
//				case 'dblclick':
//					break; 
//				case 'heading_changed':
//					options.heading = parseInt(data)
//					break;
//				case 'maptypeid_changed':
//					options.mapTypeId = data
//					break;
//				case 'projection_changed':
//					break;
//				case 'tilt_changed':
//					options.tilt = parseInt(data)
//					break;
//				case 'zoom_changed':
//					options.zoom = parseInt(data)
//					break;
				case 'idle':
					o = JSON.parse(data)
					var sw = new scopes.modGoogleMaps.LatLng(o.bounds.sw.lat, o.bounds.sw.lng)
					var ne = new scopes.modGoogleMaps.LatLng(o.bounds.ne.lat, o.bounds.ne.lng)
					options.bounds = new scopes.modGoogleMaps.LatLngBounds(sw,ne)
					options.center = new scopes.modGoogleMaps.LatLng(o.center.lat,o.center.lng)
					if (o.heading) options.heading = parseInt(o.heading)
					options.mapTypeId = o.mapTypeId
					options.tilt = o.tilt 
					options.zoom = o.zoom
					break;
				default:
					application.output('Unknown Map eventType: ' + eventType)
					return;
			}
			break;
		case 'marker':
			switch (eventType) {
				case 'dragend':
					o = JSON.parse(data);
					options.position = new scopes.modGoogleMaps.LatLng(o.position.lat, o.position.lng);
					break;
				case 'click':
					//TODO: show infoWindow?
			}
			
			break;
	
		default:
			application.output('Unknown GoogleMaps objectType: ' + objectType)
			break;
	}
	allObjects[id][1](); //run the updateState method
	
	//Fire event that the user potentially has attached
	scopes.svyEventManager.fireEvent(null, id, eventType, [objectType, id, eventType, data]);
}

/**
 * Array holding all Types that should be handled specially in the serializer
 * @private 
 * @type {Array}
 * @properties={typeid:35,uuid:"F61367F4-BDE9-42B1-994E-22EA719A34D9",variableType:-4}
 */
var specialTypes = [LatLng, MapTypeId, Marker, Map]

/**
 * Map holding references to the inner setup of all Objects (Maps, Markers, ...) and their storeState method.
 * Used by the googleMapCallback function to persists browserside updates to the map, without causing another render cycle towards the browser
 * @private
 * @type {Object<Array>}
 * @properties={typeid:35,uuid:"1E3B2526-74A5-4BF3-80F7-E3D540136405",variableType:-4}
 */
var allObjects = {}

/**
 * Implements https://developers.google.com/maps/documentation/javascript/reference#LatLng
 * @constructor
 * @param {Number} lat
 * @param {Number} lng
 *
 * @properties={typeid:24,uuid:"E92C5DA2-94C4-4A0C-8F62-FD28DC3424D5"}
 */
function LatLng(lat, lng) {
	/**
	 * @param {LatLng} other
	 * @return {Boolean}
	 */
	this.equals = function (other){
		//TODO: implement
	}
	/**
	 * @return {Number}
	 */
	this.lat = function(){ return lat}
	/**
	 * @return {Number}
	 */
	this.lng = function(){ return lng}
	/**
	 * @return {String}
	 */
	this.toString = function (){
		//TODO: implement
	}
	/**
	 * @return {String}
	 */
	this.toUrlValue = function (){
		//TODO: implement
	}
}

/**
 * Implements https://developers.google.com/maps/documentation/javascript/reference#LatLngBounds
 * @constructor 
 * @param {LatLng} sw
 * @param {LatLng} ne
 *
 * @properties={typeid:24,uuid:"D48855F6-0418-4E46-A5E4-1A716C3D17B3"}
 */
function LatLngBounds(sw, ne){
	this.toObjectPresentation = function(){
		return {
			svySpecial: true,
			type: 'constructor',
			parts: ['google','maps','LatLngBounds'],
			args: [this.getNorthEast(), this.getSouthWest()]
		}
	}
	
	/**
	 * @param {LatLng} latLng
	 * @return {Boolean}
	 */
	this.contains = function(latLng){
		//TODO: implement
	}
	/**
	 * @param {LatLngBounds} other
	 * @return {Boolean}
	 */
	this.equals = function(other){
		//TODO: implement
	}
	/**
	 * @param {LatLng} point
	 * @return {LatLngBounds}
	 */
	this.extend = function(point){
		//TODO: implement
	}
	/**
	 * @return {LatLng}
	 */
	this.getCenter = function(){
		//TODO: implement
	}
	/**
	 * @return {LatLng}
	 */
	this.getNorthEast = function(){
		return ne
	}
	/**
	 * @return {LatLng}
	 */
	this.getSouthWest = function(){
		return sw
	}
	/**
	 * @param {LatLngBounds} other
	 * @return {Boolean}
	 */
	this.intersects = function(other){
		//TODO: implement
	}
	/**
	 * @return {Boolean}
	 */
	this.isEmpty = function(){
		//TODO: implement
	}
	/**
	 * @return {LatLng}
	 */
	this.toSpan = function(){
		//TODO: implement
	}
	/**
	 * @return {String}
	 */
	this.toString = function(){
		//TODO: implement
	}
	/**
	 * @param {Number} precision
	 * @return {String}
	 */
	this.toUrlValue = function(precision){
		//TODO: implement
	}
	/**
	 * @param {LatLngBounds} other
	 * @return {LatLngBounds}
	 */
	this.union = function(other){
		//TODO: implement
	}
}

/**
 * @private
 * @constructor
 * @param {Object} type
 *
 * @properties={typeid:24,uuid:"CC65FD0C-26F6-4932-A711-9BF5FDD62B2D"}
 */
function MapTypeId(type) {
	this.type = type
}

/**
 * @type {Object<MapTypeId>}
 * @properties={typeid:35,uuid:"4508E924-9D97-41EB-9404-728C9ADF5AB6",variableType:-4}
 */
var MapTypeIds = {
	HYBRID: new MapTypeId('HYBRID'),
	ROADMAP: new MapTypeId('ROADMAP'),
	SATELLITE: new MapTypeId('SATELLITE'),
	TERRAIN: new MapTypeId('TERRAIN')
}

/**
 * @constructor
 *
 * @properties={typeid:24,uuid:"9EF66E47-FA7E-4D26-9DCA-5A3DCA610C21"}
 */
function Animation() {
	//TODO: implement
}

/**
 * @constructor
 * @param {{animation: Animation=,
 * 			clickable: Boolean=,
 * 			cursor: String=,
 * 			draggable: Boolean=,
 * 			flat: Boolean=,
 * 			icon: String|MarkerImage|Symbol=,
 * 			map: RuntimeForm<GoogleMap>|StreetViewPanorama,
 * 			optimized: Boolean=,
 * 			position: LatLng,
 * 			raiseOnDrag: Boolean=,
 * 			shadow: String|MarkerImage|Symbol=,
 * 			shape: MarkerShape=,
 * 			title: String=,
 * 			visible: Boolean=,
 * 			zIndex: Number=
 * }} options
 * 
 * TODO: As Marker props can be updated in the client (position change through drag for example), the fired event in the browser needs to be send to the server and there update the correct marker
 * AFAICS markers can only be updated when on a map and we should already know the map the marker is on, so the lookup could go through the markers array on the map
 * @properties={typeid:24,uuid:"15AF5C80-3814-47FF-B34B-7D9D40E82FBF"}
 */
function Marker(options) {
	var id = application.getUUID().toString()
//	var _animation
//	var _clickable
//	var _cursor
//	var _draggable
//	var _flat
//	var _icon
//	/**@type {scopes.modGoogleMaps.GoogleMap}*/
//	var _map
//	var _optimized
//	var _position
//	var _raiseOnDrag
//	var _shadow
//	var _shape
//	var _title
//	var _visible
//	var _zIndex

	var markerSetup = {
		id: id,
		type: "marker",
		options: options
	}
	
	var listeners = {};
	
	/**
	 * @param {String} [incrementalUpdateCode]
	 */
	function updateState(incrementalUpdateCode) {
		var _mapFormName = markerSetup.options.map.toObjectPresentation().parts[markerSetup.options.map.toObjectPresentation().parts.length-1];
		if (_mapFormName in forms) {
			forms[_mapFormName].storeState(scopes.modDataVisualization.serializeObject(markerSetup, specialTypes))
			
			if (forms[_mapFormName].rendered) {
				plugins.WebClientUtils.executeClientSideJS(incrementalUpdateCode)
			}
		} else {
			application.output('Invalid DataVisualizer reference') //TODO: better error messages
		}
	}
	
	updateState()
	
	/**
	 * Internal API: DO NOT CALL
	 * @return {Object}
	 */
	this.toObjectPresentation = function() {
		
		return {
			svySpecial: true, 
			type: 'reference', 
			parts: ['svyDataViz','gmaps', 'objects', id],
			marker: true
			}
		
//		return {svySpecial: true, 
//				type: 'constructor', 
//				parts: ['google', 'maps', 'Marker'], 
//				id: id,
//				args: [{animation: _animation,
//					clickable: _clickable,
//					cursor: _cursor,
//					draggable: _draggable,
//					flat: _flat,
//					icon: _icon,
//					map: _map,
//					optimized: _optimized,
//					position: _position,
//					raiseOnDrag: _raiseOnDrag,
//					shadow: _shadow,
//					shape: _shape,
//					title: _title,
//					visible: _visible,
//					zIndex: _zIndex
//				}] 
//			}
	}

	//Constants
	this.MAX_ZINDEX

	//Getters
	this.getAnimation = function() {
		return _animation
	}
	this.getClickable = function() {
		return _clickable
	}
	this.getCursor = function() {
		return _cursor
	}
	this.getDraggable = function() {
		return options.draggable;
	}
	this.getFlat = function() {
		return _flat
	}
	this.getIcon = function() {
		return _icon
	}
	this.getMap = function() {
		return _map
	}
	this.getPosition = function() {
		return options.position
	}
	this.getShadow = function() {
		return _shadow
	}
	this.getShape = function() {
		return _shape
	}
	this.getTitle = function() {
		return options.title;
	}
	this.getVisible = function() {
		return _visible
	}
	this.getZIndex = function() {
		return _zIndex
	}

	//Setters
	this.setAnimation = function(animation) {
		_animation = animation
	}
	this.setClickable = function(flag) {
		_clickable = flag
	}
	this.setCursor = function(cursor) {
		_cursor = cursor
	}
	this.setDraggable = function(flag) {
		options.draggable = flag
	}
	this.setFlat = function(flag) {
		_flat = flag
	}
	this.setIcon = function(icon) {
		_icon = icon
	}
	/**
	 * @param {scopes.modGoogleMaps.Map} map
	 */
	this.setMap = function(map) {
		if (options.map == map) {
			return
		}
		if (options.map == null) { 
			options.map = map
		} else if (options.map != map) {
			//TODO: This should also trigger sync to browser to remove the marker from the map
			delete options.map.removeMarker[id]
			options.map = map
		}
		options.map.addMarker(id, this)
		options.map.markers[id] = this
	}

	//	this.setOptions = function(options) {
//		for each (var prop in options) {
//			switch (prop) {
//				case 'animation':
//					this.setAnimation(options[prop])
//					break;
//				case 'clickable':
//					this.setClickable(options[prop])
//					break;
//				case 'cursor':
//					this.setCursor(options[prop])
//					break;
//				case 'draggable':
//					this.setDraggable(options[prop])
//					break;
//				case 'flat':
//					this.setFlat(options[prop])
//					break;
//				case 'icon':
//					this.setIcon(options[prop])
//					break;
//				case 'map':
//					this.setMap(options[prop])
//					break;
//				case 'optimized':
//					_optimized = options[prop]
//					break;
//				case 'position':
//					this.setPosition(options[prop])
//					break;
//				case 'raiseOnDrag':
//					_raiseOnDrag = options[prop]
//					break;
//				case 'shadow':
//					this.setShadow(options[prop])
//					break;
//				case 'shape':
//					this.setShape(options[prop])
//					break;
//				case 'title':
//					this.setTitle(options[prop])
//					break;
//				case 'visible':
//					this.setvisible(options[prop])
//					break;
//				case 'zIndex':
//					this.setZIndex(options[prop])
//					break;
//				default:
//					application.output('Unsupported property "' + prop + '" supplied to Marker.setOptions')	
//					break;
//				}
//		}
//	}
	this.setPosition = function(latLng) {
		options.position = latLng;
		updateState('var latLng = JSON.parse(\'' + scopes.modDataVisualization.serializeObject(latLng.toObjectPresentation(), specialTypes) + '\', svyDataViz.reviver);svyDataViz.gmaps.objects[\'' + markerSetup.id + '\'].setPosition(latLng);')		
	}
	
	this.setShadow = function(shadow) {
		_shadow = shadow
	}
	this.setShape = function(shape) {
		_shape = shape
	}
	this.setTitle = function(title) {
		markerSetup.options.title = title;
		updateState('svyDataViz.gmaps.objects[\'' + markerSetup.id + '\'].setTitle(latLng);')		
	}
	this.setVisible = function(visible) {
		_visible = visible
	}
	this.setZIndex = function(zIndex) {
		_zIndex = zIndex
	}

	this.EVENT_TYPES = { 
		CLICK            : 'click',
		DBLCLICK         : 'dblclick',
	//	DRAG             : 'drag',
		DRAGEND          : 'dragend',
	//	DRAGSTART        : 'dragstart',
	//	MOUSEDOWN        : 'mousedown',
	//	MOUSEOUT         : 'mouseout',
	//	MOUSEOVER        : 'mouseover',
	//	MOUSEUP          : 'mouseup',
		POSITION_CHANGED : 'position_changed',
		RIGHTCLICK       : 'rightclick'
	}
	this.addEventListener = function(eventHandler, eventType) {
		scopes.svyEventManager.addListener(markerSetup.id, eventType, eventHandler);
	}
	
//	function addEventListener(eventHandler, eventType) {
//		scopes.svyEventManager.addListener(this, eventType, eventHandler)
//	}
//	
	this.getEventHandler = function(eventType) {
		return listeners[eventType];
	}
	
	allObjects[markerSetup.id] = [options, updateState]
}

/**
 * @constructor
 *
 * @properties={typeid:24,uuid:"4A0B07DF-42B0-4C50-A1E8-CCD43AF62A9E"}
 */
function MarkerImage() {
	//TODO: implement
}

/**
 * @constructor
 *
 * @properties={typeid:24,uuid:"16134509-41A8-45D9-8D63-BE232A780502"}
 */
function MarkerShape() {
	//TODO: implement
}

/**
 * @constructor
 * 
 * @properties={typeid:24,uuid:"1E81E90E-BBDA-4D0C-8AB9-467196F292BC"}
 */
function InfoWindow(options) {
	var id = application.getUUID().toString()
	
	var infoWindowSetup = {
		id: id,
		type: "infoWindow",
		options: options
	}
	
	var EVENT_TYPES = {
		CLOSECLICK: 'closeclick',
		CONTENT_CHANGED: 'content_changed',
		DOMREADY: 'domready',
		POSITION_CHANGED: 'position_changed',
		ZINDEX_CHANGED: 'zindex_changed'
	}
	
	/**
	 * @param {String} [incrementalUpdateCode]
	 */
	function updateState(incrementalUpdateCode) {
		if (infoWindowSetup.options.map) {
			var _mapFormName = infoWindowSetup.options.map.toObjectPresentation().parts[infoWindowSetup.options.map.toObjectPresentation().parts.length-1];
			if (_mapFormName in forms) {
				forms[_mapFormName].storeState(scopes.modDataVisualization.serializeObject(infoWindowSetup, specialTypes))
				
				if (forms[_mapFormName].rendered) {
					plugins.WebClientUtils.executeClientSideJS(incrementalUpdateCode)
				}
			} else {
				application.output('Invalid DataVisualizer reference') //TODO: better error messages
			}
		}
	}
	updateState()
	
	/**
	 * Internal API: DO NOT CALL
	 * @return {Object}
	 */
	this.toObjectPresentation = function() {
		
		return {
			svySpecial: true, 
			type: 'reference', 
			parts: ['svyDataViz','gmaps', 'objects', id],
			infoWindow: true
		}
	}
	
	this.close = function() {
		//TODO: implement
	}
	
	/**
	 * @return {String}
	 */
	this.getContent = function() {
		return options.content;
	}
	
	/**
	 * @return {LatLng}
	 */
	this.getPosition = function() {
		return options.position;
	}
	
	/**
	 * @return {Number}
	 */
	this.getZIndex = function() {
		return options.zIndex;
	}
	
	/**
	 * @param {Map} map
	 * @param {Marker} [anchor]
	 */
	this.open = function(map, anchor) {
		//TODO: implement
		if (options.map == map) {
			return
		}
		if (options.map == null) { 
			options.map = map
		} else if (options.map != map) {
			//TODO: This should also trigger sync to browser to remove the marker from the map
			delete options.map.removeMarker[id]
			options.map = map
		}
		options.map.addInfoWindow(id, this)
//		options.map.infoWindows[id] = this
	
	}
	
	/**
	 * @param {String} string
	 */
	this.setContent = function(string) {
		options.content = string;
	}

	/**
	 * @param {Object} opts
	 */
	this.setOptions = function(opts) {
		options = opts;
	}
	
	/**
	 * @param {LatLng} position
	 */
	this.setPosition = function(position) {
		options.position = position;
		updateState('var latLng = JSON.parse(\'' + scopes.modDataVisualization.serializeObject(position.toObjectPresentation(), specialTypes) + '\', svyDataViz.reviver);svyDataViz.gmaps.objects[\'' + infoWindowSetup.id + '\'].setPosition(latLng);')		
	}
	
	/**
	 * @param {Number} number
	 */
	this.setZIndex = function(number) {
		options.zIndex = number;
	}
	
	allObjects[infoWindowSetup.id] = [options, updateState]
}

/**
 * Google Map impl.
 * 
 * TODO: persist switching to streetview: http://stackoverflow.com/questions/7251738/detecting-google-maps-streetview-mode
 * TODO: Impl. missing Types used in options
 * @constructor 
 * 
 * @param {RuntimeTabPanel} container the panel in which the visualization is displayed. Note: all existing tabs in the panel will be removed
 * @param {String} [options.backgroundColor]
 * @param {LatLng} options.center
 * @param {Boolean} [options.disableDefaultUI]
 * @param {Boolean} [options.disableDoubleClickZoom]
 * @param {Boolean} [options.draggable]
 * @param {String} [options.draggableCursor]
 * @param {String} [options.draggingCursor]
 * @param {Number} [options.heading]
 * @param {Boolean} [options.keyboardShortcuts]
 * @param {Boolean} [options.mapMaker]
 * @param {Boolean} [options.mapTypeControl]
 * @param {MapTypeControlOptions} [options.mapTypeControlOptions]
 * @param {MapTypeId} options.mapTypeId
 * @param {Number} [options.maxZoom]
 * @param {Number} [options.minZoom]
 * @param {Boolean} [options.noClear]
 * @param {Boolean} [options.overviewMapControl]
 * @param {OverviewMapControlOptions} [options.overviewMapControlOptions]
 * @param {Boolean} [options.panControl]
 * @param {PanControlOptions} [options.panControlOptions]
 * @param {Boolean} [options.rotateControl]
 * @param {RotateControlOptions} [options.rotateControlOptions]
 * @param {Boolean} [options.scaleControl]
 * @param {ScaleControlOptions} [options.scaleControlOptions]
 * @param {Boolean} [options.scrollwheel]
 * @param {StreetViewPanorama} [options.streetView]
 * @param {Boolean} [options.streetViewControl]
 * @param {StreetViewControlOptions} [options.streetViewControlOptions]
 * @param {Array<MapTypeStyle>} [options.styles]
 * @param {Number} [options.tilt]
 * @param {Number} options.zoom
 * @param {Boolean} [options.zoomControl]
 * @param {ZoomControlOptions} [options.zoomControlOptions] 
 * @properties={typeid:24,uuid:"1E5BE0D4-5E7A-489D-AACA-7BECA54B2CD1"}
 */
function Map(container, options) {
	/**@type {RuntimeForm<GoogleMap>}*/
	var dv = scopes.modDataVisualization.createVisualizationContainer(container, forms.GoogleMap)

	var mapSetup = {
		id: dv.getId(),
		type: "map",
		options: options
//		markers: dv.markers
	}
	
	/**
	 * @param {String} [incrementalUpdateCode]
	 */
	function updateState(incrementalUpdateCode) {
		if (mapSetup.id in forms) {
			forms[mapSetup.id].storeState(scopes.modDataVisualization.serializeObject(mapSetup, specialTypes))
			
			if (forms[mapSetup.id].rendered) {
				plugins.WebClientUtils.executeClientSideJS(incrementalUpdateCode)
			}
		} else {
			application.output('Invalid DataVisualizer reference') //TODO: better error messages
		}
	}
	updateState()
	
	/**
	 * Internal API, DO NOT CALL
	 * @param {String} id
	 * @param {Marker} marker
	 */
	this.addMarker = function(id, marker) {
		dv.markers[id] = marker	
		updateState()//TODO: incremental code
	}
	
	/**
	 * Internal API, DO NOT CALL
	 * @param {String} id
	 * @param {Marker} marker
	 */
	this.addInfoWindow = function(id, infoWindow) {
		dv.infoWindows[id] = infoWindow	
		updateState()//TODO: incremental code
	}
	
	/**
	 * Internal API, DO NOT CALL
	 * @param {String} id
	 */
	this.removeMarker = function (id) {
		delete dv.markers[id]
		updateState() //TODO: incremental code
	}
	
	/**
	 * Internal API, DO NOT CALL
	 * @return {Object}
	 */
	this.toObjectPresentation = function() {
		return {
			svySpecial: true, 
			type: 'reference', 
			parts: ['svyDataViz','gmaps', 'objects', mapSetup.id]
		}
	}

	/* Scripting API
	 */
	/**
	 * @param {LatLngBounds} bounds
	 */
	this.fitBounds = function(bounds) {
		updateState('var bounds = JSON.parse(\'' + scopes.modDataVisualization.serializeObject(bounds.toObjectPresentation(), specialTypes) + '\', svyDataViz.reviver);svyDataViz.gmaps.objects[\'' + mapSetup.id + '\'].fitBounds(bounds);')
	}

	/**
	 * @return {LatLngBounds}
	 */
	this.getBounds = function() {}

	/**
	 * @return {LatLng}
	 */
	this.getCenter = function() {
		return options.center
	}

//  This bit of APi makes no sense in Servoy
//	/**
//	 * @return {RuntimeTabPanel}
//	 */
//	this.getDiv = function() {}

	/**
	 * @return {Number}
	 */
	this.getHeading = function() {
		return options.heading
	}

	/**
	 * @return {MapTypeId|String}
	 */
	this.getMapTypeId = function() {
		return options.mapTypeId
	}

	/**
	 * @return {Projection}
	 */
	this.getProjection = function() {
		return options.projection
	}

	/**
	 * @return {StreetViewPanorama}
	 */
	this.getStreetView = function() {
	}

	/**
	 * @return {Number}
	 */
	this.getTilt = function() {
		return options.tilt
	}

	/**
	 * @return {Number}
	 */
	this.getZoom = function() {
		return options.zoom
	}

	/**
	 * @param {Number} x
	 * @param {Number} y
	 */
	this.panBy = function(x, y) {
		//No state update, because no way to determine the new center. State will be updated async
		plugins.WebClientUtils.executeClientSideJS('svyDataViz.gmaps.objects[\'' + mapSetup.id + '\'].panBy(' + x + ','+ y + ');')		
	}

	/**
	 * @param {LatLng} latLng
	 */
	this.panTo = function(latLng) {
		options.center = latLng
		updateState('var latLng = JSON.parse(\'' + scopes.modDataVisualization.serializeObject(latLng.toObjectPresentation(), specialTypes) + '\', svyDataViz.reviver);svyDataViz.gmaps.objects[\'' + mapSetup.id + '\'].panTo(latLng);')		
	}

	/**
	 * @param {scopes.modGoogleMaps.LatLngBounds} bounds
	 */
	this.panToBounds = function(bounds){
		plugins.WebClientUtils.executeClientSideJS('var bounds = JSON.parse(\'' + scopes.modDataVisualization.serializeObject(bounds.toObjectPresentation(), specialTypes) + '\', svyDataViz.reviver);svyDataViz.gmaps.objects[\'' + mapSetup.id + '\'].panToBounds(bounds);')
	}

	/**
	 * @param {LatLng} latLng
	 */
	this.setCenter = function(latLng) {
		options.center = latLng
		updateState('var latLng = JSON.parse(\'' + scopes.modDataVisualization.serializeObject(latLng.toObjectPresentation(), specialTypes) + '\', svyDataViz.reviver);svyDataViz.gmaps.objects[\'' + mapSetup.id + '\'].setCenter(latLng);')
	}

	/**
	 * @param {Number} heading
	 */
	this.setHeading = function(heading) {
		options.heading = heading
		updateState('svyDataViz.gmaps.objects[\'' + mapSetup.id + '\'].setHeading(' + heading + ');')
	}

	/**
	 * @param {String} mapTypeId
	 */
	this.setMapTypeId = function(mapTypeId) {
		options.mapTypeId = mapTypeId
		updateState('svyDataViz.gmaps.objects[\'' + mapSetup.id + '\'].setMapTypId(' + mapTypeId + ');')
	}

	/**
	 * @param {MapOptions} options
	 */
	this.setOptions = function(options) {}

	/**
	 * @param {StreetViewPanorama} panorama
	 */
	this.setStreetView = function(panorama) {}
	
	/**
	 * @param {Number} tilt
	 */
	this.setTilt = function(tilt) {
		options.tilt = tilt
		updateState('svyDataViz.gmaps.objects[\'' + mapSetup.id + '\'].setTilt(' + tilt + ');')
	}
	
	/**
	 * @param {Number} zoom
	 */
	this.setZoom = function(zoom) {
		options.zoom = zoom
		updateState('svyDataViz.gmaps.objects[\'' + mapSetup.id + '\'].setZoom(' + zoom + ');')
	}
	
	this.controls = [] //TODO: implement what needs implementing for this property
	this.mapTypes = null //TODO: implement what needs implementing for this property
	this.overlayMapTypes = [] //TODO: implement what needs implementing for this property
	
	/**
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
	 * @param {Function} eventHandler
	 * @param {String} eventType
	 */
	function addEventListener(eventHandler, eventType) {
		scopes.svyEventManager.addListener(this, eventType, eventHandler)
	}
	
	allObjects[mapSetup.id] = [options, updateState]
}

/**
 * @constructor
 *
 * @properties={typeid:24,uuid:"30E3B07A-0A00-47D1-B65D-79F4581BD859"}
 */
function Symbol() {
	//TODO: implement
}

/**
 * @constructor
 * 
 * @properties={typeid:24,uuid:"00998305-37A3-4165-8018-C86CF72476D3"}
 */
function StreetViewPanorama() {
	//TODO: implement
}