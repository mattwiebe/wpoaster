import { BskyAgent } from '@atproto/api';
import { TextareaControl } from '@wordpress/components';

const getAgent = async () => {
	const agent = new BskyAgent({ service: 'https://bsky.social/' });
	await agent.login( window._poasterLogin );
	return agent;
}

async function main() {
	let agent;
	await getAgent().then( result => agent = result );

	agent.getTimeline({ limit: 10 }).then( result => console.log( 'getTimeline', result ) );
}

main();

console.log( TextareaControl );
