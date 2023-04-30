import { TextareaControl, Button } from '@wordpress/components';
import { useState } from '@wordpress/element';
import { BskyAgent } from '@atproto/api';
import { dispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';

const logIn = async () => {
	const agent = new BskyAgent({ service: 'https://bsky.social/' });
	await agent.login( window._poasterLogin );
	return agent;
}

async function getAgent() {
	let agent;
	await logIn().then( result => agent = result );
	return agent;
}

async function doPost( content ) {
	const { saveEntityRecord } = dispatch( coreStore );
	const title = content.length >= 140 ? content.substring( 0, 140 ) + '...' : content;
	return saveEntityRecord( 'postType', 'post', { title, content, status: 'publish' } ).then( result => {
		return doSkeet( content );
	} );
}

async function doSkeet( content ) {
	return getAgent().then( agent => {
		agent.post( {
			text: content,
			createdAt: new Date().toISOString(),
		} ).then( result => {
			debugger;
			console.log( 'result', result );
			return result;
		} );
	} );
}



export const WPoaster = () => {
	const [ text, setText ] = useState( '' );

	const sendPost = ( text ) => {
		doPost( text );
		setText( '' );
	}
	return (
		<div className="poaster-block">
			<TextareaControl
				label="Poast"
				value={ text }
				onChange={ ( value ) => setText( value ) }
			/>
			<Button isPrimary onClick={ () => sendPost( text ) }>Poast!</Button>
		</div>
	);
}