function showOrderForm() {
	if (jQuery('#btn-create_order').html() == "CANCEL ORDER") {
		// hide the form
		jQuery('#div-create_order').html("");
		jQuery('#btn-create_order').html("CREATE AN ORDER");
	} else {
		// show the form
		var ct = returnOrderFormFields ();
		jQuery('#div-create_order').html(ct);
		jQuery('#btn-create_order').html("CANCEL ORDER");
	}	
}
function returnOrderFormFields () {
	var today = new Date();
	var mm = today.getMonth()+1;
	if (mm < 10)
		mm = '0' + mm;
	var date = today.getFullYear()+'-'+ mm +'-'+today.getDate();
	if (typeof jQuery('#item_sale').val() != "undefined") {
		var price = jQuery('#item_sale').val();
	} else {
		var price = "";
	}
	var ct = '<p id="p-fname"> <label for "fname">First Name</label> <input type="text" id="fname" name="fname" maxlength=50 value="" required /> </p> <p id="p-lname"> <label for "lname">Last Name</label> <input type="text" id="lname" name="lname" maxlength=50 value="" required /> </p> <p id="p-buyer_email"> <label for "buyer_email">Email</label> <input type="email" id="buyer_email" name="buyer_email" maxlength=150 value="" required /> </p> <p id="p-buyer_phone"> <label for "buyer_phone" placeholder="555-555-1234" required>Phone</label> <input type="tel" id="buyer_phone" name="buyer_phone" maxlength=12 value="" required/> </p> <p id="p-address_1"> <label for "address_1" placeholder="">Address</label> <input type="text" id="address_1" name="address_1" maxlength=255 value="" required /> </p> <p id="p-city"> <label for "city">City</label> <input type="text" id="city" name="city" maxlength=255 placeholder="" value="" required /> </p> <p id="p-sold_price"> <label for "sold_price">Sold Price</label> <input type="text" id="sold_price" name="sold_price" maxlength=10 placeholder="$" value="' + price + '" required /> </p> <p id="p-date_sold"> <label for "date_sold">Date Sold</label> <input type="date" id="date_sold" name="date_sold" maxlength=10 placeholder="YYYY-mm-dd" value="' + date + '" required /> </p>';
	return ct;
}

