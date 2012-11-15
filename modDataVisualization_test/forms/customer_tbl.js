/**
 * Handle changed data.
 *
 * @param {Number} oldValue old value
 * @param {Number} newValue new value
 * @param {JSEvent} event the event that triggered the action
 *
 * @returns {Boolean}
 *
 * @properties={typeid:24,uuid:"ED2247A3-2AD7-4AD4-9EF9-E7F943368E83"}
 */
function toggleMarker(oldValue, newValue, event) {
	if (newValue == 1) {
		//Create marker
		var pos = forms.test.getLatLng(address + " " + postalcode + " " + city);
		if (pos) {
			forms.customer_map.addMarker(foundset.getSelectedRecord(), pos);
			forms.customer_map.fitBounds();
		} else {
			globals.DIALOGS.showWarningDialog("Warning", "Location not found", "OK");
			select = oldValue;
		}
	} else {
		//Remove marker
		forms.customer_map.removeMarker(foundset.getSelectedRecord());
//		forms.customer_map.fitBounds();
	}

	return true;
}