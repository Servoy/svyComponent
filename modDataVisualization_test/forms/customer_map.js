/**
 * @type {scopes.modDataVis$googleMaps.Map}
 * 
 * @properties={typeid:35,uuid:"FEF481B6-B73B-4F5D-AB49-4012E579683D",variableType:-4}
 */
var map;

/**
 * @type {Object<scopes.modDataVis$googleMaps.Marker>}
 *
 * @properties={typeid:35,uuid:"C06F4E47-69B7-44A3-A7BC-D874082461BC",variableType:-4}
 */
var markers = {};

/**
 * Callback method when form is (re)loaded.
 *
 * @param {JSEvent} event the event that triggered the action
 *
 * @properties={typeid:24,uuid:"8C439A09-CA42-4147-9907-BD45FCF6790D"}
 */
function onLoad(event) {
	//Instantiate GoogleMaps
	map = new scopes.modDataVis$googleMaps.Map(elements.map, {
		zoom: 8,
		center: new scopes.modDataVis$googleMaps.LatLng(52.2,5.2),
		mapTypeId: scopes.modDataVis$googleMaps.MapTypeIds.HYBRID
	})
}

/**
 * @properties={typeid:24,uuid:"8AEEAAAE-5FE4-468E-9855-696DBAC0BD7D"}
 */
function fitBounds() {
	var bounds 
	for each (var mkr in markers) {
		if (bounds) {
			bounds.extend(mkr.getPosition())
		} else {
			bounds = new scopes.modDataVis$googleMaps.LatLngBounds(mkr.getPosition(), mkr.getPosition())
		}
	}
	map.fitBounds(bounds)
}

/**
 * @param {JSRecord<db:/example_data/customers>} customerRec
 * @param {{lat: Number, lng: Number}} pos
 * 
 * @properties={typeid:24,uuid:"F921C715-15AB-4926-B435-2C4533E29DEC"}
 */
function addMarker(customerRec, pos) {
	var marker = new scopes.modDataVis$googleMaps.Marker({
		position: new scopes.modDataVis$googleMaps.LatLng(pos.lat, pos.lng),
		draggable: false,
		title: customerRec.companyname
	});
	marker.setMap(forms.customer_map.map);
	markers[customerRec.customerid] = marker;
	
	//Add infowindow on the click event
	marker.addClickListener(addInfoWindow)
}

/**
 * @param customerRec
 *
 * @properties={typeid:24,uuid:"AF709C15-2501-42C1-8C4A-DBC1EE57D9F8"}
 */
function removeMarker(customerRec) {
	markers[customerRec.customerid].setMap(null)
	delete markers[customerRec.customerid];
}

/**
 * @param {scopes.modDataVis$googleMaps.Event} event
 *
 * @properties={typeid:24,uuid:"EEF54B74-6DA2-4FE6-9244-1B2DC321388B"}
 */
function addInfoWindow(event) {
	//Get customer_id
	var customer_id;
	for  (var i in markers) {
		if (markers[i] == event.getSource()) {
			customer_id = i;
			break;
		}
	}
	
	//Get customer record
	/** @type {JSFoundSet<db:/example_data/customers>} */
	var customerFS = databaseManager.getFoundSet("db:/example_data/customers")
	customerFS.addFoundSetFilterParam("customerid", "=", customer_id);
	customerFS.loadAllRecords();
	var customerRec = customerFS.getRecord(1);
	
	
	//Adding infoWindow
	var infoWindow = new scopes.modDataVis$googleMaps.InfoWindow({
		content: scopes.modUtils$webClient.XHTML2Text(<div>
			<b>{customerRec.companyname}</b><br/>(<a href="http://www.servoy.com" target="new">more information</a>)<br/>
			<p>
			{customerRec.address}<br/>
			{customerRec.postalcode} {customerRec.city}<br/>
			{customerRec.country.toUpperCase()}<br/>
			Voice: {customerRec.phone}<br/>
			Fax: {customerRec.fax}<br/>
			<br/>
			<span style="display: block;width: 100%; height: 1px; border: 0px solid lightgray; border-bottom-width: 1px"/>
			<a href="javascript:void()">20 likes</a>
			</p>
		</div>)
	});
	
	/** @type {scopes.modDataVis$googleMaps.Marker} */
	var marker = event.getSource()
	infoWindow.open(map, marker);
}
