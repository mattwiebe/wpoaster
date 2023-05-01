export function SetupText() {
	return (
		<div>
			<p>
				You need to add these constants to <code>wp-config.php</code>. If you don't know what that means, this plugin isn't for you, yet.
			</p>
			<pre>
				define( 'WPOASTER_LOGIN',    'yourhandle.bsky.social' );<br />
				define( 'WPOASTER_PASSWORD', 'Use an App Password!' );
			</pre>
		</div	>
	);
}