export function createNavBar() {



	return `
		<div class="navbar-content">
			<div class="link-wrapper first">
				<a href="#" id="exhibitLink" target="_blank" class="exhibit-link">Exhibit link <i>→</i></a>
			</div>
			<div class="link-wrapper middle">
				<a href="#" id="moreLink" class="more-link">
					<span id="exhibitLabel" class="exhibit-label">
						Time-traveling art gallery
					</span>
				</a>
			</div>
			<div class="link-wrapper last">
				<a href="#" id="closeLink" class="close-link"><i>×</i> Exit Fullscreen</a>
			</div>
		</div>
	`
}