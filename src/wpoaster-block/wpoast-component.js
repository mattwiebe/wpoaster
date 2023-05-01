import { TextareaControl, Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { BskyAgent } from '@atproto/api';
import { dispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
let agent;

const logIn = async () => {
	const agent = new BskyAgent({ service: 'https://bsky.social/' });
	await agent.login( window._wpoasterLogin );
	return agent;
}

async function getAgent() {
	if ( agent ) {
		return agent;
	}
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
		} ).then( result => result );
	} );
}

const BskyProfile = () => {
	const [ service, setService ] = useState();
	const [ profile, setProfile ] = useState();
	useEffect( () => {
		getAgent().then( agent => {
			setService( agent.service );
			agent.getProfile( { actor: agent.session.did } ).then( result => setProfile( result.data ) );
		}	);
	}, [] );

	if ( ! profile ) {
		return <div>Loading Profile...</div>;
	}

	const { avatar, displayName, handle } = profile;
	const name = `@${ handle }`;
	return (
		<div className="bsky-profile" style={ { margin: '1em 0' } }>
			<img src={ avatar } alt={ handle } title={ name } width={ 16 } height={ 16 } />
			Poasting as { name } to { service.host }
		</div>
	);
}

export const WPoaster = () => {
	const limit = 300;
	const [ text, setText ] = useState( '' );
	const disabled = text.length > limit;
	const sendPost = ( text ) => {
		doPost( text );
		setText( '' );
	}

	return (
		<div className="wpoaster-block">
			<TextareaControl
				label="WPoast"
				value={ text }
				onChange={ ( value ) => setText( value ) }
			/>
			<BskyProfile />
			<Button isPrimary disabled={ disabled } onClick={ () => sendPost( text ) }>WPoast It!</Button>
			{ ' ' + text.length } / { limit } chars
		</div>
	);
}