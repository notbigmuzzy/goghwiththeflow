export function createNavBar() {

	return `
		<div class="navbar-content">
			<div class="link-wrapper first">
				<a href="#" id="exhibitLink" target="_blank" class="exhibit-link">Exhibit link <i>→</i></a>
			</div>
			<div class="link-wrapper middle">
				<span id="moreLink" class="more-link">
					<span id="exhibitLabel" class="exhibit-label">
						Welcome to time-traveling<br>art gallery
					</span>
				</span>
				<span id="playerWrapper" class="player-wrapper">
					<span class="player-label">
						<span class="hide-on-mobiles">Ambiance</span>
						<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
					</span>
					<div id="audioPlayers" style="display:none;">
						<video id="player1" muted></video>
						<video id="player2" muted></video>
					</div>
				</span>
				<span class="headphones">
					<svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="white"><path d="M12 3a9 9 0 0 0-9 9v7c0 1.1.9 2 2 2h4v-8H5v-1c0-3.87 3.13-7 7-7s7 3.13 7 7v1h-4v8h4c1.1 0 2-.9 2-2v-7a9 9 0 0 0-9-9z"/></svg>
					<span>Best experienced with headphones</span>
				</span>
				<span class="attribution">
					<span>Made with 🎨 by <a href="https://notbigmuzzy.github.io/" target="_blank">notbigmuzzy</a></span>
					<span style="padding:0 5px;"> | </span>
					<span>Powered by <a href="https://metmuseum.github.io/" target="_blank">Metropolitan Museum API</a></span>
				</span>
			</div>
			<div class="link-wrapper last">
				<span id="closeLink" class="close-link"><i>×</i> Exit Fullscreen</span>
			</div>
		</div>
	`
}