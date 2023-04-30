<?php

function mw_theme_scripts() {
	// rough security: only when logged-in
	if ( ! is_user_logged_in() ) {
		return;
	}
	$index_asset = require( get_stylesheet_directory() . '/build/index.asset.php' );
	wp_enqueue_script( 'poaster', get_stylesheet_directory_uri() . '/build/index.js', $index_asset['dependencies'], $index_asset['version'], true );
	//add wp_inline_script with login and password constants
	$login_vars = [];
	$login_vars['identifier'] = defined( 'POASTER_LOGIN' ) ? POASTER_LOGIN : '';
	$login_vars['password'] = defined( 'POASTER_PASSWORD' ) ? POASTER_PASSWORD : '';
	$script = sprintf( 'window._poasterLogin = %s;', json_encode( $login_vars ) );
	wp_add_inline_script( 'poaster', $script, 'before' );
}
add_action( 'wp_enqueue_scripts', 'mw_theme_scripts' );
