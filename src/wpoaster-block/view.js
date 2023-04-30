import domReady from '@wordpress/dom-ready';
import { WPoaster } from './wpoast-component';
import { render } from '@wordpress/element';

domReady( () => {
	document.querySelectorAll( '.wpoaster-block' ).forEach( el => {
		render( <WPoaster />, el );
	} );
} );