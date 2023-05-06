<?php
/**
 * Plugin Name: WPoaster
 * Plugin URI: https://github.com/mattwiebe/wpoaster
 * Description: A block to post to WordPress and Bluesky
 * Author: Matt Wiebe
 * Author URI: https://mattwie.be
 * Version: 0.1.0
 * License: GPL2+
 * License URI: https://www.gnu.org/licenses/gpl-2.0.txt
 */

add_action( 'init', 'register_wpoaster_block' );
function register_wpoaster_block() {
	register_block_type_from_metadata( __DIR__ . '/build/wpoaster-block', [
		'render_callback' => 'render_wpoaster_block',
	] );
	//add wp_inline_script with login and password constants
	$login_vars = [];
	$login_vars['identifier'] = defined( 'WPOASTER_LOGIN' ) ? WPOASTER_LOGIN : '';
	$login_vars['password'] = defined( 'WPOASTER_PASSWORD' ) ? WPOASTER_PASSWORD : '';
	$script = sprintf( 'window._wpoasterLogin = %s;', json_encode( $login_vars ) );
	wp_add_inline_script( 'mw-wpoaster-view-script', $script, 'before' );
}
function render_wpoaster_block( $attrs, $content, $block ) {
	if ( ! is_user_logged_in() ) {
		return '<div class="wpoaster-block-inactive">You must be logged in to poast.</div>';
	}
	return '<div class="wpoaster-block">WPOAST</div>';
}
