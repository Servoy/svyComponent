/*
 * Google Maps APIv3 implementation
 * 
 * TODO: Implement mechanism to sync scripting updates to browser
 * TODO: Implement API of Marker & Maps
 * TODO: Marker instance lookups
 * TODO: Event firing
 * TODO: implement InfoWindow
 * TODO: implement PolyLine
 */


/**
 * Variable with self executing function as value to run some initialization code when the scope gets instantiated on solution start.
 * - Dynamically created an .js entry in the Media Lib and includes it in the Web CLient 
 * - Sets up several .toObjectPresentation prototypes on constructors, needed for serialization of objects to browser side
 * 
 * @private
 * @SuppressWarnings(unused)
 * @properties={typeid:35,uuid:"C88DB00A-27F8-4CAB-A8FB-C1D2D50FC5C4",variableType:-4}
 */
var init = function() {
	var code = <script type='text/javascript'>
	<![CDATA[
	   	var script = document.createElement("script");
	    script.type = "text/javascript";
	    script.src = 'http://maps.googleapis.com/maps/api/js?v=3.9&key=AIzaSyD6A559b-KBYGBBM6mmDPcYYNpAzv_Rv1Y&sensor=false&callback=initialize';
//	    script.src = 'http://maps.googleapis.com/maps/api/js?key=' + apiKey + '&sensor=false&callback=initialize';
	    document.head.appendChild(script);

		var maps = {
			gmaps: {},
			todos: []
		}

	    function initialize() {
	    	//Helper function form dynamically calling a constructor function with arguments 
	    	//http://stackoverflow.com/questions/3362471/how-can-i-call-a-javascript-constructor-using-call-or-apply
	    	function conthunktor(Constructor) {
	    	    var args = Array.prototype.slice.call(arguments, 1);
	    	    return function() {

	    	         var Temp = function(){}, // temporary constructor
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
	    	}

	    	//Helper function to deserialize JSON containing special objects that should map to clientside API
	    	function reviver(key, value) {
	    		if (value.hasOwnProperty('svySpecial') && value.svySpecial == true) {
	    			var object = value.scope||window
					for (var i = 0; i < value.parts.length; i++) {
						object = object[value.parts[i] ]
					}
					switch (value.type) {
//						case 'call':
//							return object.apply(value.scope ? window[value.scope] : null, value.args)
						case 'constructor':
							return conthunktor.apply(this, [object].concat(value.args))()
						case 'reference':
							return object
						default:
							return
					}
	    		}
	    		return value
	    	}

	    	if (window.google && google.maps) {
	    		for (var i = 0; i < maps.todos.length; i++) {
	    			console.log(maps.todos[i])
	    			var node = JSON.parse(maps.todos[i],reviver)
					if (node.id) {
						var map = new google.maps.Map(document.getElementById(node.id), node.options)
						maps.gmaps[node.id] = map
						
						var events = [
										"bounds_changed", 
										"center_changed", 
										"click", 
										"dblclick", 
										"heading_changed", 
										"maptypeid_changed", 
										"projection_changed",
										"tilt_changed",
										"zoom_changed",
									];
						var handler;
						for (var j = 0; j < events.length; j++) {
							handler = new Function ("mapsEventHandler.call(this, 'map', '"+node.id+"', event, '"+events[j]+"')");
							google.maps.event.addListener(map, events[j], handler);
						}

					} else {

					}
				}
				maps.todos = []
	    	}
	    }
	    
	    function mapsEventHandler(objectType, id, event) {
	    	console.log(arguments);
	    	var eventHandleButton = document.getElementById('eventHandleButton');
	    	addArgument(eventHandleButton, "onclick", id);
	    	eventHandleButton.click();
	    }
	    
		function addArgument(element, eventName, arg) {
			//Not implemented yet -> should include the argument in the event call
			
//			var _tmp = element[eventName].toString();
////			console.log("tmp: " + _tmp);
//			var _body = _tmp.substring(_tmp.indexOf('{\n')+2,_tmp.lastIndexOf('(')+1);
////			console.log("body: " + _body);
//			element[eventName] = new Function("javascript:forms.GoogleMap.handleEvent('"+arg+"')");
		}
	]]>
	</script>
	var bytes = new Packages.java.lang.String(code).getBytes('UTF-8')
	var uuid = application.getUUID();
	solutionModel.newMedia('googleMapsHandler_'+uuid+'.js', bytes)
	plugins.WebClientUtils.addJsReference('media:///googleMapsHandler_'+uuid+'.js')

	//Setup toObjectPresentation function through prototype on constructor functions that need to be serialized to client
	LatLng.prototype.toObjectPresentation = function() {
		return { svySpecial: true, type: 'constructor', parts: ['google', 'maps', 'LatLng'], args: [this.lat, this.lng] }
	}
	MapType.prototype.toObjectPresentation = function() {
		return { svySpecial: true, type: 'reference', parts: ['google', 'maps', 'MapTypeId', this.type] }
	}
}()


/**
 * Internal API: DO NOT CALL
 * @param {Object} o
 * @return {String}
 * @properties={typeid:24,uuid:"0D72ACC8-71D9-46BB-983E-A14AB191F73B"}
 */
function serializeObject(o) {
	var functions = [LatLng, MapType, Marker, RuntimeForm]

	if (o['toObjectPresentation'] instanceof Function) {
		var oo = o['toObjectPresentation']()
		return serializeObject(oo);
	}
	
	return JSON.stringify(o, function(key, value) {
			if (functions.some(function(element, index, array) {
				return value instanceof element
			})) {
				return value.toObjectPresentation();
			}
			return value
		})
}

/**
 * @constructor
 * @param {Number} lat
 * @param {Number} lng
 *
 * @properties={typeid:24,uuid:"E92C5DA2-94C4-4A0C-8F62-FD28DC3424D5"}
 */
function LatLng(lat, lng) {
	this.lat = lat
	this.lng = lng
}

/**
 * @private
 * @constructor
 * @param {Object} type
 *
 * @properties={typeid:24,uuid:"CC65FD0C-26F6-4932-A711-9BF5FDD62B2D"}
 */
function MapType(type) {
	this.type = type
}

/**
 * @properties={typeid:35,uuid:"4508E924-9D97-41EB-9404-728C9ADF5AB6",variableType:-4}
 */
var MapTypes = {
	HYBRID: new MapType('HYBRID'),
	ROADMAP: new MapType('ROADMAP'),
	SATELLITE: new MapType('SATELLITE'),
	TERRAIN: new MapType('TERRAIN')
}

/**
 * @constructor
 * @param {{animation: Animation=,
 * 			clickable: Boolean=,
 * 			cursor: String=,
 * 			draggable: Boolean=,
 * 			flat: Boolean=,
 * 			icon: String|MarkerImage|Symbol=,
 * 			map: RuntimeForm<GoogleMap>|StreetViewPanorama=,
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
	/**
	 * Internal API: DO NOT CALL
	 * @return {Object}
	 */
	this.toObjectPresentation = function() {
		return {svySpecial: true, 
				type: 'constructor', 
				parts: ['google', 'maps', 'Marker'], 
				id: id,
				args: [{animation: _animation,
					clickable: _clickable,
					cursor: _cursor,
					draggable: _draggable,
					flat: _flat,
					icon: _icon,
					map: _map,
					optimized: _optimized,
					position: _position,
					raiseOnDrag: _raiseOnDrag,
					shadow: _shadow,
					shape: _shape,
					title: _title,
					visible: _visible,
					zIndex: _zIndex
				}] 
			}
	}
	var id = application.getUUID().toString()
	var _animation
	var _clickable
	var _cursor
	var _draggable
	var _flat
	var _icon
	/**@type {RuntimeForm<GoogleMap>}*/
	var _map
	var _optimized
	var _position
	var _raiseOnDrag
	var _shadow
	var _shape
	var _title
	var _visible
	var _zIndex

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
		return _draggable
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
		return _position
	}
	this.getShadow = function() {
		return _shadow
	}
	this.getShape = function() {
		return _shape
	}
	this.getTitle = function() {
		return _title
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
		_draggable = flag
	}
	this.setFlat = function(flag) {
		_flat = flag
	}
	this.setIcon = function(icon) {
		_icon = icon
	}
	/**
	 * @param {RuntimeForm<GoogleMap>} map
	 */
	this.setMap = function(map) {
		if (_map == map) {
			return
		}
		if (_map == null) { 
			_map = map
		} else if (_map != map) {
			//TODO: This should also trigger sync to browser to remove the marker from the map
			delete _map.markers[id]
			_map = map
		}
		_map.markers[id] = this
	}
	this.setOptions = function(options) {
		for each (var prop in options) {
			switch (prop) {
				case 'animation':
					this.setAnimation(options[prop])
					break;
				case 'clickable':
					this.setClickable(options[prop])
					break;
				case 'cursor':
					this.setCursor(options[prop])
					break;
				case 'draggable':
					this.setDraggable(options[prop])
					break;
				case 'flat':
					this.setFlat(options[prop])
					break;
				case 'icon':
					this.setIcon(options[prop])
					break;
				case 'map':
					this.setMap(options[prop])
					break;
				case 'optimized':
					_optimized = options[prop]
					break;
				case 'position':
					this.setPosition(options[prop])
					break;
				case 'raiseOnDrag':
					_raiseOnDrag = options[prop]
					break;
				case 'shadow':
					this.setShadow(options[prop])
					break;
				case 'shape':
					this.setShape(options[prop])
					break;
				case 'title':
					this.setTitle(options[prop])
					break;
				case 'visible':
					this.setvisible(options[prop])
					break;
				case 'zIndex':
					this.setZIndex(options[prop])
					break;
				default:
					application.output('Unsupported property "' + prop + '" supplied to Marker.setOptions')	
					break;
				}
		}
	}
	this.setPosition = function(latLng) {
		_position = latLng
	}
	this.setShadow = function(shadow) {
		_shadow = shadow
	}
	this.setShape = function(shape) {
		_shape = shape
	}
	this.setTitle = function(title) {
		_title = title
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
	//	DRAGEND          : 'dragend',
	//	DRAGSTART        : 'dragstart',
	//	MOUSEDOWN        : 'mousedown',
	//	MOUSEOUT         : 'mouseout',
	//	MOUSEOVER        : 'mouseover',
	//	MOUSEUP          : 'mouseup',
		POSITION_CHANGED : 'position_changed',
		RIGHTCLICK       : 'rightclick'
	}
	this.addEventListener = function(eventHandler, eventType) {
		//TODO: implement
	}
}

/**
 * @constructor
 * 
 * @properties={typeid:24,uuid:"1E81E90E-BBDA-4D0C-8AB9-467196F292BC"}
 */
function InfoWindow() {

}

/**
 * @constructor 
 * @param {RuntimeTabPanel} container the panel in which the visualization is displayed. Note: all existing tabs in the panel will be removed
 * @param {JSFoundSet|JSDataSet|JSRecord|Array<Array>|Object} data
 * @param {{backgroundColor:String=, center:LatLng=, disableDefaultUI: Boolean=, disableDoubleClickZoome: Boolean=}} [options]
 * @param {String} apiKey
 *
 * @return {RuntimeForm<GoogleMap>}
 * @properties={typeid:24,uuid:"1E5BE0D4-5E7A-489D-AACA-7BECA54B2CD1"}
 */
function GoogleMap(container, data, options, apiKey) {

	var viz = scopes.modDataVisualization.createVisualizationContainer(container, forms.GoogleMap)
	
	var mapSetup = {
		id: viz.getId(),
		options: options
	}
	viz.addScript(<script>{'maps.todos.push(\'' + serializeObject(mapSetup) + '\')'}</script>)
	viz.render()
	return viz
}
