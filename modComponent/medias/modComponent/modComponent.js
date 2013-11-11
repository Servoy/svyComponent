if (window.svyComp == undefined) {
	var svyComp = {}
}
/**
 * Helper function for dynamically calling a constructor function with arguments
 * 
 * @see http://stackoverflow.com/questions/3362471/how-can-i-call-a-javascript-constructor-using-call-or-apply
 * 
 * @param {Function} Constructor
 * @return {Object}
 */
svyComp.dynConstructor = function(Constructor) {
	var args = Array.prototype.slice.call(arguments, 1);
	return function() {
		var Temp = function() {} // temporary constructor
		var inst 
		var ret

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

/**
 * Helper function to deserialize JSON containing ISO date strings and special objects that should map to clientside API
 * @param {String} key
 * @param {Object} value
 * @return {Object}
 */
svyComp.reviver = function(key, value) {
	if (value === null) {
		return value
	}
	if (typeof value === 'string') {
		var val = unescape(value)
		var a = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*)?)Z$/.exec(val);
		if (a) {
			return new Date(Date.UTC(+a[1], +a[2] - 1, +a[3], +a[4], +a[5], +a[6]));
		}
		return val;
	}
	if (value.hasOwnProperty('svySpecial') && value.svySpecial == true) {
		var object = value.scope || window
		for (var i = 0; i < value.parts.length; i++) {
			object = object[value.parts[i]]
			if (object == null) {
				svyComp.error('Can\'t resolve "' + value.parts.join('.') + '"')
				throw 'SvyComponentReferenceException'
			}
		}

		switch (value.type) {
			case 'call':
				var scope = value.scope
				if (!scope) {
					scope = window
					for (var i = 0; i < value.parts.length - 1; i++) {
						scope = scope[value.parts[i]]
					}
				}
				try {
					return object.apply(scope, value.args)
				} catch (e) {
					if (window.console && console.trace) console.trace()
					if (e.stack) this.log(e.stack)
				}
			case 'constructor':
				return svyComp.dynConstructor.apply(this, [object].concat(value.args))()
			case 'reference':
				return object
				//					case 'domReference':
				//						return document.getElementbyId(args[0])
			default:
				return
		}
	}
	return value
}

/**
 * Converts JSON string with special objects and ISO date strings to a JavaScript Object
 * @param {String} json
 * @return {Object}
 */
svyComp.JSON2Object = function(json) {
	var obj = null
	try {
		obj = JSON.parse(json, this.reviver)
	} catch (e) {
		this.error('Failed to convert JSON to Object: ' + json)
		if (e != 'SvyComponentReferenceException') {
			throw e
		}
	}
	return obj
}

/**
 * hashmap holding all objects based on their ID (UUID)
 */
svyComp.objects = {}

/**
 * Flag to toggle debugging on/off
 */
svyComp.debug = true

/**
 * Wrapper around window.console to prevent fails on IE<9 and to take into account the svyComp.debug flag
 * @param {Object} text
 */
svyComp.log = function(text) {
	if (this.debug && window.console && window.console.log) {
		console.log(text)
	}
}
svyComp.error = function(text) {
	if (window.console && window.console.error) {
		console.error(text)
	}
}