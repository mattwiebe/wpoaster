<?php

function my_theme_scripts() {
	$index_asset = require( get_stylesheet_directory() . '/build/index.asset.php' );
	wp_enqueue_script( 'poaster', get_stylesheet_directory_uri() . '/build/index.js', $index_asset['dependencies'], $index_asset['version'], true );
}
add_action( 'wp_enqueue_scripts', 'my_theme_scripts' );
