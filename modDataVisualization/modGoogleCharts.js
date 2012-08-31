/**
 * Implementation of https://google-developers.appspot.com/chart/interactive/docs/gallery/geochart
 *
 * @param {RuntimeTabPanel} container the panel to which the visualization gets added
 * @param {JSFoundSet|JSDataSet|JSRecord|Array<Array>|Object} data
 * @param {Object} options
 *
 * @properties={typeid:24,uuid:"27F07D57-CD5E-4EE7-82F8-25658A3AAD75"}
 */
function GeoChart(container, data, options) {

	var script = <script type='text/javascript'>
		<![CDATA[
	    function bootStrapGoogleLoader() {
	    	if (typeof google == 'undefined') {
	    		console.log('load....')
			    var script = document.createElement("script");
			    script.type = "text/javascript";
			    script.src = 'http://www.google.com/jsapi?callback=initAPI';
				document.head.appendChild(script);
	    	} else {
	    		console.log('else....')
	    		initAPI(true)
	    	}
	    }

	    function initAPI(state) {
	    	console.log('loading...' + state)
	    	google.load('visualization', '1', {'packages': ['geochart'], "callback" : drawRegionsMap});
	    }

	    function drawRegionsMap() {
	    	var data = google.visualization.arrayToDataTable([
	    		['Country', 'Popularity'],
	    		['Germany', 200],
	    		['United States', 300],
	    		['Brazil', 400],
	    		['Canada', 500],
	    		['France', 600],
	    		['RU', 700]
	    	]);

	        var options = {};

	        var chart = new google.visualization.GeoChart(document.getElementById('chart_div'));
	        chart.draw(data, options);
	    };
	    ]]>
	</script>
	
	var viz = scopes.modDataVisualization.createVisualizationContainer(container, forms.GoogleGeoChart)
	viz.addScript(script)
	viz.render()
	return viz
}
