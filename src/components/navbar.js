export function createNavBar() {

	return `
		<div class="navbar-content">
			<div class="link-wrapper first">
				<a href="#" id="exhibitLink" target="_blank" class="exhibit-link">Exhibit link <i>→</i></a>
			</div>
			<div class="link-wrapper middle">
				<a href="#" id="moreLink" class="more-link">
					<span id="exhibitLabel" class="exhibit-label">
						Welcome to time-traveling<br>art gallery
					</span>
				</a>
				<span class="attribution">
					<span>Made with 🎨 by <a href="https://notbigmuzzy.github.io/" target="_blank">notbigmuzzy</a></span>
					<span style="padding:0 5px;"> | </span>
					<span>Powered by <a href="https://metmuseum.github.io/" target="_blank">MetMuseum API</a></span>
				</span>
			</div>
			<div class="link-wrapper last">
				<a href="#" id="closeLink" class="close-link"><i>×</i> Exit Fullscreen</a>
			</div>
		</div>
	`
}