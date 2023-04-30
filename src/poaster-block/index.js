import { registerBlockType } from '@wordpress/blocks';
import metadata from './block.json';
import { edit } from './edit';

const save = ( { attributes } ) => {
	return '<div class="poaster-block">From JS Save!</div>';
}

registerBlockType( metadata, { edit, save } );