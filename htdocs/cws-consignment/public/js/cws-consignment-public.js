(function( $ ) {
	'use strict';
	
	$( window ).load(function() {
		$('.toggledivbyid').on("click", function() {
			// first get data 
			var divid = $(this).data("divid");
			if ($('#' + divid).hasClass("hidden")) {
				$('#' + divid).removeClass("hidden");
				if (divid == "catprices") { // call ajax function to show avg prices in the store
					$('#catprices').html('<p class="warnmsg">Fetching prices... please wait</p>');
					var this2 = this;                      //use in callback
					$.post(my_ajax_obj.ajax_url, {         //POST request
						action: "cwscs_get_cat_prices",
						thiscat: $('#item_cat').val(), 		// data
						thistask: "getcatprices"
					}, function(results) {                    //callback
						if (!results) {
							$('#catprices').html("Could not fetch at this time.");
						} else if (results.status) {
							if (results.status == -1) { // no results
								$('#catprices').html('<p class="failmsg">Sorry! There are no prices available to show at this time.</p>');
							} else if (results.status == 0) { // error
								$('#catprices').html('<p class="failmsg">Sorry! There are no prices available to show at this time.</p>');
							} else {
								console.log('TEST: good results');
								var ct = showCatPrices(results.data);
								$('#catprices').html(ct);
							}
						}
						console.log(JSON.stringify(results));
						/*
						this2.nextSibling.remove();        //remove current title
						$(this2).after(data);              //insert server response
						*/
					});
					
				}
			} else {
				$('#' + divid).addClass("hidden");
			}
		}); // END toggledivbyid
		
		// Handle additem form submit - if recaptcha v3 then have to intercept
		$('#cwscs_formadditem').submit(function() {
			startSpinner("Please wait...") ;
		}); // END additem submit
	}); // END load
	////////////////////////////////  SPINNER  FUNCTIONS  /////////////////////////////////
	function startSpinner(title) {
		console.log("Start spinner");
		jQuery('body').append('<div class="overlay_spinner" id="myoverlay"><div><h3 id="overlaymsg">' + title + '</h3><i class="fa fa-spinner fa-spin" id="myspinner"></i></div></div>');
		console.log ('added overlay')
		return true;
	}
	function stopSpinner() {
		jQuery('#myoverlay').remove();
	}
	
	
	$('#cws_showcatprices').change(function() {
		console.log('showcatprices clicked');
	});
})( jQuery );

function showCatPrices(data) {
	var ct = '<div class="div_showcatprices"><p>' + data.length + ' results.</p>';
	if (data) {
		ct += '<table class="table borders" width="100%"> <tbody> <tr><th>Category</th><th># Items in Store</th><th>Lowest Price</th><th>Highest Price</th> <th>Average</th></tr>';
		// loop through
		for (var i=0; i<data.length; i++) {
			if (data[i]['total_items'] > 0) {
				ct += '<tr><td>' + data[i]['name'] + '</td><td>' + data[i]['total_items'] + '</td> <td>$' + data[i]['lowest'] + '</td> <td>$' + data[i]['highest'] + '</td> <td>$' + data[i]['average'] + '</td> </tr>';
			}
		}
		ct += '</tbody></table>';
	} 
	ct += '</div>';
	return ct;
}

// NEW Handle images
window.uploadPhotos = function(){
    // Read in file
    var file = event.target.files[0];
	var thisid = event.target.id;
	jQuery('#tmpfilename').val(file.name);
    var mime = file.type; // store mime for later
    // Ensure it's an image
    if(file.type.match(/image.*/)) {
        // Load the image
        var reader = new FileReader();
        reader.onload = function (readerEvent) {
            var image = new Image();
            image.onload = function (imageEvent) {

                // Resize the image
                var canvas = document.createElement('canvas'),
                    max_size = 544,
                    width = image.width,
                    height = image.height;
                if (width > height) {
                    if (width > max_size) {
                        height *= max_size / width;
                        width = max_size;
                    }
                } else {
                    if (height > max_size) {
                        width *= max_size / height;
                        height = max_size;
                    }
                }
                canvas.width = width;
                canvas.height = height;
                canvas.getContext('2d').drawImage(image, 0, 0, width, height);
                var dataUrl = canvas.toDataURL('image/jpeg'); // convert the canvas to dataurl
				var resizedImage = dataURLToBlob(dataUrl);
                jQuery.event.trigger({
                    type: "imageResized",
                    blob: resizedImage,
                    url: dataUrl,
					thisid: thisid
                });
            }
            image.src = readerEvent.target.result;
        }
        reader.readAsDataURL(file);
    }
};
/* Utility function to convert a canvas to a BLOB */
var dataURLToBlob = function(dataURL) {
    var BASE64_MARKER = ';base64,';
    if (dataURL.indexOf(BASE64_MARKER) == -1) {
        var parts = dataURL.split(',');
        var contentType = parts[0].split(':')[1];
        var raw = parts[1];

        return new Blob([raw], {type: contentType});
    }

    var parts = dataURL.split(BASE64_MARKER);
    var contentType = parts[0].split(':')[1];
    var raw = window.atob(parts[1]);
    var rawLength = raw.length;

    var uInt8Array = new Uint8Array(rawLength);

    for (var i = 0; i < rawLength; ++i) {
        uInt8Array[i] = raw.charCodeAt(i);
    }

    return new Blob([uInt8Array], {type: contentType});
}
/* End Utility function to convert a canvas to a BLOB      */
/* Handle image resized events */
jQuery(document).on("imageResized", function (event) {
	var data = new FormData(jQuery("form[id*='uploadImageForm']")[0]);
	console.log('here and id ' + event.thisid); 
    if (event.blob && event.url && event.thisid) {
		console.log('TEST: in here');
        data.append('image_data', event.blob);
		data.append('tmpfilename', jQuery('#tmpfilename').val());
		data.append('baseurl', jQuery('#baseurl').val());
		data.append('basedir', jQuery('#basedir').val());
		console.log ("all done and resized at " + event.blob.size + ', type is ' + event.blob.type);
		var objectURL = (URL || webkitURL).createObjectURL(event.blob);	
        jQuery.ajax({
            url: "/ajax/upload.php",
            data: data,
            cache: false,
            contentType: false,
            processData: false,
			dataType: 'json',
            type: 'POST',
			error: function(data){
               console.log("error: ", data);
			   // maybe populate a form field with the file name?
            },
			fail: function(data){
               console.log("fail: ", data);
			   // maybe populate a form field with the file name?
            },
			success: function(results){
				console.log("Success: ", results);
				if (results && results.status) {
					console.log('TEST: have results and ' + typeof results)
					jQuery('#msg').html(results.status);
					if (results.partimgurl) {
						console.log('populating filename');
						var thisid = event.thisid;
						var el = thisid.replace("image", "filename");
						jQuery('#' + el).val(results.partimgurl);
						console.log('# + ' + el + ' set to ' + results.partimgurl);
						// show on form
						var el = thisid.replace("image", "tmp-img");
						jQuery('#' + el).attr("src", results.partimgurl);
						console.log('# + ' + el + ' set to ' + results.partimgurl);
						jQuery('#' + el).removeClass("hidden");
					}
				}
            }
        });
    }
});
