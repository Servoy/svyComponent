if (!window.myScope) {
	var myScope = {
		monthFormatter: function(x) {
			var x = parseInt(x)
			var months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
			return months[ (x - 1) % 12];
		}
	}
}