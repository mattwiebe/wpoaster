<?php

function mw_theme_scripts() {
	// rough security: only when logged-in
	if ( ! is_user_logged_in() ) {
		return;
	}
	$index_asset = require( get_stylesheet_directory() . '/build/index.asset.php' );
	wp_enqueue_script( 'poaster', get_stylesheet_directory_uri() . '/build/index.js', $index_asset['dependencies'], $index_asset['version'], true );

}
#add_action( 'wp_enqueue_scripts', 'mw_theme_scripts' );

add_action( 'init', 'register_poaster_block' );
function register_poaster_block() {
	error_log( 'foo' );
	register_block_type_from_metadata( __DIR__ . '/build/poaster-block', [
		'render_callback' => 'render_poaster_block',
	] );
	//add wp_inline_script with login and password constants
	$login_vars = [];
	$login_vars['identifier'] = defined( 'POASTER_LOGIN' ) ? POASTER_LOGIN : '';
	$login_vars['password'] = defined( 'POASTER_PASSWORD' ) ? POASTER_PASSWORD : '';
	$script = sprintf( 'window._poasterLogin = %s;', json_encode( $login_vars ) );
	wp_add_inline_script( 'mw-poaster-view-script', $script, 'before' );
}
function render_poaster_block( $attrs, $content, $block ) {
	return '<div class="poaster-block">We are so back</div>';
}


add_filter( 'stylesheet_directory_uri', function( $stylesheet_dir_uri, $stylesheet, $theme_root_uri ) {
	l( 'stylesheet_directory_uri', $stylesheet_dir_uri, $stylesheet, $theme_root_uri );
	return $stylesheet_dir_uri;
}, 10, 3 );