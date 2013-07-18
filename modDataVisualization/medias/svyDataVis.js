//Polyfill for ES5 Date.prototype.toISOString/toJSON, needed to properly stringify dates when using JSON.stringify, see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Date/toISOString
if (!Date.prototype.toISOString) {

	(function() {

		function pad(number) {
			var r = String(number);
			if (r.length === 1) {
				r = '0' + r;
			}
			return r;
		}

		Date.prototype.toISOString = function() {
			return this.getUTCFullYear() + '-' + pad(this.getUTCMonth() + 1) + '-' + pad(this.getUTCDate()) + 'T' + pad(this.getUTCHours()) + ':' + pad(this.getUTCMinutes()) + ':' + pad(this.getUTCSeconds()) + '.' + String( (this.getUTCMilliseconds() / 1000).toFixed(3)).slice(2, 5) + 'Z';
		};

		if (!Date.prototype.toJSON) {
			Date.prototype.toJSON = Date.prototype.toISOString
		}
	}());
}

if (window.svyDataVis == undefined) {
	var svyDataVis = {
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
				var object = value.scope||window
				for (var i = 0; i < value.parts.length; i++) {
					object = object[value.parts[i] ]
				}
				if (object == null) {
					throw 'SvyDataVisReferenceException'
				}
				if (value.type == 'reference') {
					return object
				}
				
				switch (value.type) {
					case 'call':
						var scope = value.scope
						if (!scope) {
							scope = window
							for (var i = 0; i < value.parts.length-1; i++) {
								scope = scope[value.parts[i] ]
							}
						}
						try {
							return object.apply(scope, value.args)
						} catch (e) {
							if (window.console && console.trace) console.trace()
							if (e.stack) this.log(e.stack)
						}
					case 'constructor':
						return svyDataVis.dynConstructor.apply(this, [object].concat(value.args))()
					case 'reference':
						return object
//					case 'domReference':
//						return document.getElementbyId(args[0])
					default:
						return
				}
			}
			return value
		},
		JSON2Object: function (json) {
			var obj = null
			try {
				obj = JSON.parse(json, this.reviver)
			} catch(e) {
				this.log('Failed to convert JSON to Object: ' + json)
				if (e != 'SvyDataVisReferenceException') {
					throw e
				}
			}
			return obj
		},
		objects: {},
		debug: false,
		log: function(text) {
			if (this.debug && window.console && window.console.log) {
				console.log(text)
			}
		}
	}
}