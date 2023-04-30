import domReady from '@wordpress/dom-ready';
import { Poaster } from './poast-component';
import { render } from '@wordpress/element';

domReady( () => {
	document.querySelectorAll( '.poaster-block' ).forEach( el => {
		render( <Poaster />, el );
	} );
} );