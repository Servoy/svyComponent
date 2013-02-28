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
			if (typeof value === 'string') {
				return unescape(value)
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
							console.trace()
							console.log(e.stack)
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
		debug: false,
		log: function(text) {
			if (this.debug && window.console && window.console.log) {
				console.log(text)
			}
		}
	}
}