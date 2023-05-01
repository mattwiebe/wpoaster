export function edit( { className } ) {
		return (
				<div className={ className }>
					This is a placeholder for the frontend WPoast function that allows you to post to Bluesky and WP from one simple Textbox. <br />
					You will need to add these constants to <code>wp-config.php</code>. If you don't know what that means, this plugin isn't for you yet.
					<pre>
						define( 'WPOASTER_LOGIN',    'yourhandle.bsky.social' );<br />
						define( 'WPOASTER_PASSWORD', 'Use an App Password!' );
					</pre>
				</div>
		);
}