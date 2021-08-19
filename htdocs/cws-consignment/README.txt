=== Consignment Store For WooCommerce ===
Contributors: charcope
Donate link: https://charlenesweb.ca/donate/
Tags: consignment store, consignment for WooCommerce
Requires at least: 5.3
Requires PHP: 5.6.20
Tested up to: 5.8
Stable tag: 1.0.0
License: GPLv2
License URI: https://www.gnu.org/licenses/gpl-2.0.html

Easily allow sellers to submit items for your review to your consignment store. Once approved, items are added to your WooCommerce store.

== Description ==

CWS Consignment Store for WooCommerce lets the general public upload their items for consideration to your online and physical consignment store.
You will be notified that an item has been submitted. You can review the item and either approve or reject.
If you approve, the item will be added to WooCommerce and is immediately available in your store. You may change the "split" on the revenue from the item. The default is 50-50. 
If you reject, the seller will be notified by email.
You can also use the plugin to put your existing inventory online. Use the easy form, snap a few pictures, and it will automatically be added to your WooCommerce online store without going through the approval step. 

Uninstalling the plugin will remove all associated tables and data.

Pre-requisites:
WooCommerce

= Live Demo =
<a href="https://charlenesweb.ca/cws-demos/">**Seller's Form to Add Item and the Admin area**</a><br>

= Doc =
<a href="https://charlenesweb.ca/cws-documentation/">Documentation</a>

= Features =
* Image resized on user's device before upload
* Images deleted from Media Library if item is rejected
* Help seller set a price by displaying lowest, highest and average prices for items in your store, by category.
* Track payouts to the seller once an item sells.

== Installation ==

The easiest way to install CWS Consignment Store is via your WordPress Dashboard. Go to the "Plugins" screen, click "Add New", and search for "CWS Consignment" in the WordPress Plugin Directory. Then, click "Install Now" and wait a moment. Finally, click "Activate" and start using the plugin!

Manual installation works just as for other WordPress plugins:

1. [Download](https://downloads.wordpress.org/plugin/cws-consignment.latest-stable.zip) and extract the ZIP file.
1. Move the folder "cws-consignment" to the "wp-content/plugins/" directory of your WordPress installation, e.g. via FTP.
1. Activate the plugin "CWS Consignment Store" on the "Plugins" screen of your WordPress Dashboard.
1. Create a page for potential Sellers to submit their items and add the shortcode [additemform]
1. Review the submitted items in the WordPress admin area. 

== Frequently Asked Questions ==

= What size are the images uplon upload? =

Images are resized to a maximum of 544px height or width. 

= How do I add a SKU to the item? =

If you are logged in to your site, go to the page where you have included the [additemform] shortcode and you will see SKU as the first input field. 

= Do SKU's have to be unique? =

SKU's do need to be unique. Since this is for a consignment shop it is assumed each item is unique and requires its own sku. 

= I get a 403 when I try to select an image on the Add Item form. =

I have seen this on Microsoft Edge when there is a security plugin such as WordFence activated. You need to allow basedir to be posted. In WordFence, go to All Options and scroll down to Allolisted URLs. Add a new URL that is the page where your form is (/addanitem/ for example). Select Param Type POST Body, and enter basedir in the Param Name. Click ADD. Add another rule now for the ajax file by entering URL /wp-content/plugins/cws-consignment/public/class-cws-consignment-public.php. And again select Param Type POST Body, and enter basedir in the Param Name. Click ADD. And Save Changes.


== Screenshots ==

1. Add Item Form
2. Review Submitted Items
3. Master Inventory
4. Manage Payouts
5. Settings
6. Reports
7. Documentation

== Changelog ==

= 1.0 =
* First release

== Upgrade Notice ==

= 1.0 =
Initial release
