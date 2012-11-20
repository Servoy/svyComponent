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
			if (value.hasOwnProperty('svySpecial') && value.svySpecial == true) {
				var object = value.scope||window
				for (var i = 0; i < value.parts.length; i++) {
					object = object[value.parts[i] ]
				}
				switch (value.type) {
					case 'call':
						return object.apply(value.scope ? window[value.scope] : null, value.args)
					case 'constructor':
						return svyDataVis.dynConstructor.apply(this, [object].concat(value.args))()
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
}