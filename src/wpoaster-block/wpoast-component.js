import { TextareaControl, Button } from '@wordpress/components';
import { useState, useEffect } from '@wordpress/element';
import { BskyAgent } from '@atproto/api';
import { dispatch } from '@wordpress/data';
import { store as coreStore } from '@wordpress/core-data';
import { SetupText } from './setup-text';
let agent;

const getLogin = () => {
	return window._wpoasterLogin || {};
}

async function getAgent() {
	if ( agent ) {
		return agent;
	}
	const newAgent = new BskyAgent( { service: 'https://bsky.social/' } );
	await newAgent.login( getLogin() );
	agent = newAgent;
	return agent;
}

function getSkeetLink( service, profile, $id ) {
	return `${ service.origin }/profile/${ profile.handle }/post/${ $id }`;
}

function maybeRewriteSkeetLink( link ) {
	const { doStagingRewrite } = getLogin();
	if ( ! doStagingRewrite ) {
		return link;
	}
	return link.replace( 'bsky.social', 'staging.bsky.app' );
}

async function doPost( content, service, profile ) {
	const { saveEntityRecord } = dispatch( coreStore );
	const title = content.length >= 140 ? content.substring( 0, 137 ) + '...' : content;
	const post = await saveEntityRecord( 'postType', 'post', { title, content, status: 'publish' } );
	const { link } = post;
	const skeetContent = `${ content }\n\nWPoasted from ${ link }`;
	const skeet = await doSkeet( skeetContent );
	const skeetId = skeet.uri.split('/').pop();
	const skeetLink = getSkeetLink( service, profile, skeetId );
	const contentWithSkeetLink = `${ content }\n\n<a href="${ skeetLink }">Link to Skeet</a>`;
	const updatedPost = await saveEntityRecord( 'postType', 'post', { id: post.id, content: contentWithSkeetLink } );
	const ret = {
		post: updatedPost,
		skeet: { link: skeetLink, ...skeet }
	};
	debugger;
	return ret;
}

async function doSkeet( content ) {
	const agent = await getAgent();
	return agent.post( {
		text: content,
		createdAt: new Date().toISOString(),
	} );
}

const BskyProfile = ( { service, profile } ) => {
	if ( ! profile ) {
		return <div>Loading Profile...</div>;
	}

	const { avatar, handle } = profile;
	return (
		<div className="bsky-profile" style={ { margin: '1em 0' } }>
			<img src={ avatar } alt={ handle } title={ name } width={ 16 } height={ 16 } />
			Poasting as @{ handle } to { service.host }
		</div>
	);
}

const PoastList = ( { links } ) => {
	if ( ! links.length ) {
		return <div>No new Posts</div>;
	}
	return (
		<div>
			<h4>Links Poasted:</h4>
			<ul>
				{ links.map( ( { url, text }, index ) => (
					<li key={ index }>
						<a href={ url }>{ text }</a>
					</li>
				) ) }
			</ul>
		</div>
	);
}

export const WPoaster = () => {
	const login = getLogin();
	const hasLogin = !! ( login.password && login.password.length && login.identifier && login.identifier.length );
	const limit = 300;
	const [ text, setText ] = useState( '' );
	const [ links, setLinks ] = useState( [] );
	const [ service, setService ] = useState();
	const [ profile, setProfile ] = useState();
	useEffect( () => {
		getAgent().then( agent => {
			setService( agent.service );
			agent.getProfile( { actor: agent.session.did } ).then( result => setProfile( result.data ) );
		}	);
	}, [] );
	const disabled = text.length > limit;

	const sendPost = async ( text ) => {
		const { post, skeet } = await doPost( text, service, profile );
		const newLinks = [
			{ url: post.link, text: 'Local Post' },
			{ url: maybeRewriteSkeetLink( skeet.link ), text: 'Skeet' },
		];

		setLinks( newLinks.concat( links ) );
		setText( '' );
	}

	if ( ! hasLogin ) {
		return (
			<div className="wpoaster-block wpoaster-help">
				<SetupText />
			</div>
		);
	}

	return (
		<div className="wpoaster-block">
			<TextareaControl
				label="WPoast"
				value={ text }
				onChange={ ( value ) => setText( value ) }
			/>
			<BskyProfile service={ service } profile={ profile } />
			<Button isPrimary disabled={ disabled } onClick={ () => sendPost( text ) }>WPoast It!</Button>
			{ ' ' + text.length } / { limit } chars
			<PoastList links={ links } />
		</div>
	);
}