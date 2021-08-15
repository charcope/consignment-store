<?php

/**
 * The plugin bootstrap file
 *
 * This file is read by WordPress to generate the plugin information in the plugin
 * admin area. This file also includes all of the dependencies used by the plugin,
 * registers the activation and deactivation functions, and defines a function
 * that starts the plugin.
 *
 * @link              https://charlenesweb.ca
 * @since             1.0.0
 * @package           CWS_Consignment
 *
 * @wordpress-plugin
 * Plugin Name:       Consignment Store for WooCommerce
 * Plugin URI:        https://charlenesweb.ca/
 * Description:       Consignment Store for WooCommerce
 * Version:           1.0.0
 * Author:            Charlene's Web Services
 * Author URI:        https://charlenesweb.ca/plugins
 * License:           GPL-2.0+
 * License URI:       http://www.gnu.org/licenses/gpl-2.0.txt
 * Text Domain:       cws-consignment
 * Domain Path:       /languages
 */

// If this file is called directly, abort.
if ( ! defined( 'WPINC' ) ) {
	die;
}

/**
 * Currently plugin version.
 * Start at version 1.0.0 and use SemVer - https://semver.org
 * Rename this for your plugin and update it as you release new versions.
 */
define( 'CWS_CONSIGNMENT_VERSION', '1.0.0' );
define('CWSCS_SRC_DIR', dirname(__FILE__) );
/**
 * The code that runs during plugin activation.
 * This action is documented in includes/class-cws-consignment-activator.php
 */
function activate_cws_consignment() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-cws-consignment-activator.php';
	cws_consignment_Activator::activate();
}

/**
 * The code that runs during plugin deactivation.
 * This action is documented in includes/class-cws-consignment-deactivator.php
 */
function deactivate_cws_consignment() {
	require_once plugin_dir_path( __FILE__ ) . 'includes/class-cws-consignment-deactivator.php';
	cws_consignment_Deactivator::deactivate();
}
register_activation_hook( __FILE__, 'activate_cws_consignment' );
register_deactivation_hook( __FILE__, 'deactivate_cws_consignment' );

/**
 * The core plugin class that is used to define internationalization,
 * admin-specific hooks, and public-facing site hooks.
 */
require plugin_dir_path( __FILE__ ) . 'includes/class-cws-consignment.php';

/**
 * Begins execution of the plugin.
 *
 * Since everything within the plugin is registered via hooks,
 * then kicking off the plugin from this point in the file does
 * not affect the page life cycle.
 *
 * @since    1.0.0
 */
function run_cws_consignment() {
	$plugin = new CWS_Consignment();
	$plugin->run();
}
run_cws_consignment();

////////////////////////////////////////////////////////////////////////////////////
// ADMINISTRATOR CLASSES
////////////////////////////////////////////////////////////////////////////////////

// show the items purchased and picked up. Manage the payments to sellers.  - [showmasterinventory]
class showPayouts {
  	static function showpayouts_func ($atts, $content = null) {
		$atts = shortcode_atts(array(
			'show' => 'unpaid'
		), $atts);
		$ct = "";
		$current_url  = set_url_scheme( 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_URL'] );
		$subscriber = false; $editor = false; $loggedin = false; $admin = false; $author = false;
		$msg = "";
		$email = "";
		$name = "";
		if ( is_user_logged_in() ) {
			// get roles
			$loggedin = true;
			global $current_user;
			wp_get_current_user();
			$roles = $current_user->roles;
			$current_url  = set_url_scheme( 'https://' . $_SERVER['HTTP_HOST'] . $_SERVER['SCRIPT_URL'] );
			if (in_array("administrator", $roles) || in_array("editor", $roles)) {
				if (isset($_POST['search_store_tag']))
					$search_store_tag = sanitize_text_field($_POST['search_store_tag']);
				else
					$search_store_tag = "";
				if (isset($_POST['search_kw']))
					$search_kw = sanitize_text_field($_POST['search_kw']);
				else
					$search_kw = "";
				if (isset($_POST['payment_type'])) {
					$show = sanitize_text_field($_POST['payment_type']);
				} elseif (isset($atts['show']))
					$show = $atts['show'];
				$ct .= '<div class="adultlogindiv"><p style="text-align:left"><a href="/'.SYSTEM.'consignment/">Go back to Consignment Page</a> | <a href="/wp-login.php?action=logout">Logout</a></p>';
				// search on filters
				$types = array("unpaid", "paid", "all");
				$ct .= '
				<form action="'.$current_url.'" method="post" class="radio_group">
					<label><strong>Show:</strong> </label>';
					foreach ($types as $i => $t) {
						$ct .= '
						<label for="'.$t.'">
							<input type="radio" name="payment_type" id="'.$t.'" value="'.$t.'"';
						if (isset($show) && $show == $t) {
							$ct .= ' checked="checked" ';
						}
						$ct .= '/> '.ucfirst($t).'</label>&nbsp;&nbsp;';
					} // END loop on types
					$ct .= '<br />
					<label for="sku"><strong>Search on SKU:</strong> </label>
					<input type="text" name="search_store_tag" id="search_store_tag" style="width:150px" value="'.$search_store_tag.'" \>&nbsp;&nbsp;	OR
					<label for="search_kw"><strong>Search on keyword(s):</strong> </label>
					<input type="text" name="search_kw" id="search_kw" style="width:300px" value="'.$search_kw.'" \>&nbsp;&nbsp;
					<input type="submit" name="view_lessons" value="Go >" class="et_pb_button view_lessons" />
				</form>';
				$ctr = 0;
				$results = getInventorySold($show, $search_store_tag, $search_kw);
				// loop through results and see if sold
				
					
				if (is_array($results) || is_object($results)) {
					$ct .= '<hr /><p>This table shows the '.count($results).' Sold Items in inventory. </p><table><thead><tr><th>Date Added</th><th>Seller</th><th>Item</th><th>Tag #</th><th>Price</th><th>Status</th><th align="center">View</th></tr></thead><tbody>';
					foreach ($results as $i => $row) {
						// see if in store
						if ($row->sku > 0 && $row->approved == 1){
							$woo = getWooBySku($row->sku);
							if (isset($woo['status']) && $woo['status'] == 0) {
								$msg .= $woo['msg'];
								$instore = false;
							} elseif (isset($woo['data'])) {
								$instore = true;
								foreach ($woo['data'] as $j => $pm) { // postmeta
									if ($pm->meta_key == "_price")
										$woo_price = $pm->meta_value;
									elseif ($pm->meta_key == "_stock_status")
										$woo_stock = $pm->meta_value;
									elseif ($pm->meta_key == "total_sales")
										$woo_sales = $pm->meta_value;	
								}
							}
						} else
							$woo = false;	
						$ctr++;
						$ct .= '<tr><td>'.$row->date_added.'</td><td>'.$row->seller_name.'</td><td>'.$row->item_title.'</td> <td>';
						if ($row->sku > 0)
							$ct .= $row->sku;
						else
							$ct .= '&nbsp;';
						$ct .= '</td><td>';	
						if (isset($woo_price) && $woo_price > 0)
							$ct .= '$'.number_format($woo_price,2);
						elseif ($row->item_sale > 0)
							$ct .= '$'.number_format($row->item_sale,2);
						else
							$ct .= '&nbsp;';	
						$ct .= '</td> <td>';
						// status
						if (isset($woo_sales) && $woo_sales > 0) {
							$ct .= 'Sold for $'.number_format($woo_price,2);
						} elseif ($row->approved > 0) {
							$ct .= 'Approved for store';
						} else {
							$ct .= 'Submitted, not approved';
						}
						$ct .= '</td> <td align="center">';
						if (!$instore)
							$ct .= '<a href="/'.SYSTEM.'consignment/review-item?id='.$row->ID.'"><i class="fa fa-search"></i></a>';
						else
							$ct .= '<a href="/'.SYSTEM.'consignment/edit-store-item?post_id='.$woo['post_id'].'"><i class="fa fa-search"></i></a>';
						$ct .= '</td></tr>';
					}
					$ct .= '</tbody><tfoot><th colspan=7>Total Items: '.$ctr.'</th></tr></tfoot></table>';
				}
			} else {
				$ct = '<p class="failmsg">You are not authorized to be here. </p>';
			}
		} // END is logged in
		return $ct;
	}
}
add_shortcode( 'showpayouts', array('showPayouts', 'showpayouts_func') );
