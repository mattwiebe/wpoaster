<?php

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
