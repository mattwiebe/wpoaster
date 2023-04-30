<?php

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
	return '<div class="wpoaster-block">We are so back</div>';
}
