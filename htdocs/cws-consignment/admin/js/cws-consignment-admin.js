(function( $ ) {
	'use strict';
	$( window ).load(function() { 
		// Check item approved status and show appropriate email 	
		$('.cwscheckapproved').click(function () {
			var i = $(this).val();
			if (typeof i == "undefined") {
				return;
			}
			if (i == 1) { // approved
				$ ('#approved-email').removeClass("cwshidden");
				$ ('#rejected-email').addClass("cwshidden");
				$ ('.hideifrejected').removeClass("cwshidden");
			} else if (i == 2) { // rejected
				$ ('#approved-email').addClass("cwshidden");
				$ ('#rejected-email').removeClass("cwshidden");
				$ ('.hideifrejected').addClass("cwshidden");
			} else if (i == 0) { // new
				$ ('#approved-email').addClass("cwshidden");
				$ ('#rejected-email').addClass("cwshidden");
				$ ('.hideifrejected').addClass("cwshidden");
			} 
		});
		$('.cwscs_tablinks').on("click", function () {
			startAdminSpinner("Please wait...")
			// hide all
			$('.cwscs_tabcontent').addClass("cwshidden");
			var thisid = $(this).attr("id");
			var contentid = thisid.replace("btntab_", "contenttab_");
			$('#' + contentid).removeClass("cwshidden");
			// handle left side tab buttons
			$('.cwscs_tablinks').removeClass("active");
			$('#' + thisid).addClass("active");
			// handle save button
			var btnid = thisid.replace("btntab_", "btnsave_");
			var tabnum = thisid.replace("btntab_", "") * 1;
			$('.btn-save-settings').attr("id", btnid);
			switch (tabnum) {
				case 0:
					var btn_text = "Save General";
					break;
				case 1:
					var btn_text = "Save Categories";
					break;
				case 2:
					var btn_text = "Save Store Policy";
					break;
				case 3:
					var btn_text = "Save Store Splits";
					break;
				case 4:
					var btn_text = "Save Emails";
					break;
				default:
					var btn_text = "Save";
					break;
			}
			$('#' + btnid).html(btn_text);
			stopAdminSpinner()
		});
		// SETTINGS PAGE
		$('.btn-save-settings').on("click", function() {
			startAdminSpinner("Please wait...")
			var thisid = $(this).attr("id");
			var cwscs_key = "";
			var cwscs_value = "";
			var cwscs_method = "";

			switch (thisid) {
				// first get data 
				case "btnsave_1":
					var conn = ""
					$('#contenttab_1 input:checkbox:checked').each(function () {
						if ($(this).val()) {
							cwscs_value += conn + $(this).val(); // the value is the cat id
							conn = "::";
						}
					});
					var cwscs_key = "categories";
					var contentid = "contenttab_1";
					var cwscs_method = "savecategories";
					break;
				case "btnsave_2":
					// is the checkbox set?
					if($('#contenttab_2 #storepolicyshow').is(":checked")){
						cwscs_value = 1; // 1 means show
					} else {
						cwscs_value = 0;
					}
					cwscs_value += '::' + $('#storepolicytext').val();
					var cwscs_key = "store-policy";
					var contentid = "contenttab_2";
					var cwscs_method = "savepolicy";
					break;
				case "btnsave_3":
					var conn = ""
					$('#contenttab_3 input:checkbox:checked').each(function () {
						if ($(this).val()) {
							cwscs_value += conn + $(this).val(); // the value is the split id
							conn = "::";
						}
					});
					var cwscs_key = "store-splits";
					var contentid = "contenttab_3";
					var cwscs_method = "savesplits";
					break;
				case "btnsave_4":
					var contentid = "contenttab_4";
					var cwscs_method = "saveemails";
					var cwscs_key = "emails";
					if ($('#cwscs_from_email').val() && $('#cwscs_to_email').val()) {
						var cwscs_value = $('#cwscs_from_email').val() + '::' + $('#cwscs_to_email').val();
					} else {
						var cwscs_value = "";
					}
					break;	
				default:
					var cwscs_method = "";
					break;
			}
			if (cwscs_key == "") {
				$('#cwscs_msg').html('<p class="failmsg">Could not update. Please refresh and try again.</p>');
				return;
			}
			$('#cwscs_key').val(cwscs_key);
			$('#cwscs_value').val(cwscs_value);
			$('#cwscs_method').val(cwscs_method);

			// Submit the form
			$('#cwscs_settings_form').submit();
		}); // END btn-save-settings
	});
})( jQuery );
// General stuff

// show / hide email form 
function showHideApproved(i) {
	if (typeof i == "undefined") {
		return;
	}
	if (i == 1) { // send email upon approval
		jQuery ('#approved-email-content').removeClass("cwshidden");
	} else if (i == 2) { // do not send email upon approval
		jQuery ('#approved-email-content').addClass("cwshidden");
	}
}
// show / hide email content
function showHideRejected(i) {
	if (typeof i == "undefined") {
		return;
	}
	if (i == 1) { // send email upon rejection
		jQuery ('#rejected-email-content').removeClass("cwshidden");
	} else if (i == 2) { // do not send email upon rejection
		jQuery ('#rejected-email-content').addClass("cwshidden");
	}
}
function showCatSettings(data) {
	var ct = '<h3>Categories</h3>';
	if (data) {
		ct += '<p>Click which categories to include in the Add Item form for the Consignment Store.</p>';
		for (var catid in data) {
			if (typeof data[catid].name != "undefined") {
				var name = data[catid].name;
			} else {
				var name = "Unknown";
			}
			if (typeof data[catid].checked != "undefined" && data[catid].checked) {
				var checked = ' checked="checked" ';
			} else {
				var checked = "Unknown";
			}
			ct += '<label class="radio" for="' + catid +'"> <input type="checkbox" name="' + catid +'" id="' + catid +'" value="' + catid +'" ' + checked + '/> ' + name + '</label><br />';
		} // END loop on data
	} 
	return ct;
}
// Display Policy content on settings
function showPolicySettings(data) {
	var ct = '<h3>Store Policy</h3>';
	if (data) {
		ct ="<p>You may choose to show your store policy on the Add Item to Consignment Store Form on your website. If you do, the seller will have to accept the store policy. </p>";
		// get values
		if (typeof data[0] != "undefined") { //yes show
			var show = data[0];
		} else
			var show = "";
		if (typeof data[1] != "undefined" && data[1] != "") { //yes show
			var text = data[1];
		} else { // default text
			var text = "Use this form to submit your items to the consignment store. If they are in good shape, clean and generally ready to sell then we will approve the item for the store, and split the proceeds of any sale 50/50.\r\n\r\nIf we do accept your item for the store, we will email you to let you know, and to determine a time for you to drop your item off.\r\n\r\nIf after 6 months in the store, the item has not sold, we may donate the item or let you know to come pick it up.";
		}
		// show checkbox
		ct += '<p><label class="radio" for="storepolicyshow"><input type="checkbox" name="storepolicyshow" id="storepolicyshow" value="1" ';
		if (show == "1") {
			ct += 'checked="checked" ';
		}
		ct += '/> Show Store Policy on Add Item Form</label></p>';
		// show store policy text
		ct += '<p> <label for="storepolicytext">Store Policy<br /> <textarea name="storepolicytext" id="storepolicytext">' + text + '</textarea> </label> </p>';
	} 
	return ct;
}
// Show the store splits
function showSplitSettings(data) {
	var ct = '<h3>Store Splits</h3>';
	if (data) {
		ct += '<p>Click which splits to include in the Add Item to Consignment Store Form on the website. </p>';
		for (var splitid in data) {
			if (typeof data[splitid].name != "undefined") {
				var name = data[splitid].name;
			} else {
				var name = "Unknown";
			}
			if (typeof data[splitid].checked != "undefined" && data[splitid].checked) {
				var checked = ' checked="checked" ';
			} else {
				var checked = "Unknown";
			}
			ct += '<label class="radio" for="' + splitid +'"> <input type="checkbox" name="' + splitid +'" id="' + splitid +'" value="' + splitid +'" ' + checked + '/> ' + name + '</label><br />';
		} // END loop on data
	} 
	return ct;
}

// Email settings
function showEmailSettings(data) {
	var ct = '<h3>Emails</h3>';
	if (data && data[0]) {
		var from = data[0];
	} else {
		var from = "";
	}
	if (data && data[1]) {
		var to = data[1];
	} else {
		var to = "";
	}
	ct += '<p> <label for="cwscs_from_email">Send from</label> <br /> <input type="email" name="cwscs_from_email" id="cwscs_from_email" value="' + from + '" style="width:350px" aria-describedby="descriptionFromEmail"/><br /> <span id="descriptionFromEmail" class="small">Send from email adress (Example: Name &lt;name@domain.com&gt;). Leave blank to use default address.</span> </p>';
	// TO
	ct += '<p> <label for="cwscs_to_email">Send to</label><br /> <input type="email" name="cwscs_to_email" id="cwscs_to_email" value="' + to + '" style="width:350px" aria-describedby="descriptionToEmail" /><br /> <span id="descriptionToEmail" class="small">Send to email adress (Example: Name &lt;name@domain.com&gt;). To notify of an item submitted to the consignment store. If blank, a notification email will not be sent.</span> </p>';
	return ct;
}

////////////////////////////////  ADMIN SPINNER  FUNCTIONS  /////////////////////////////////
function startAdminSpinner(title) {
	if (!title || title == "") {
		title = "Processing...";
	}
	jQuery('body').append('<div class="overlay_spinner" id="myoverlay"><div><h3 id="overlaymsg">' + title + '</h3><i class="fa fa-spinner fa-spin" id="myspinner"></i></div></div>');
	return true;
}
function stopAdminSpinner() {
	jQuery('#myoverlay').remove();
}