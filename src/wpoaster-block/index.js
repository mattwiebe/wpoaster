import { registerBlockType } from '@wordpress/blocks';
import { edit } from './edit';
const save = () => {
	return '<div class="wpoaster-block" />';
}

registerBlockType( 'mw/wpoaster', { edit, save } );