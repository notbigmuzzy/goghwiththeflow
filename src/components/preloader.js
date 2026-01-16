export function createPreloader() {
	const createPanels = () => {
		let panels = '';
		for (let i = 0; i < 3; i++) {
			panels += `<div class="panel panel-${i + 1}"></div>`;
		}
		return panels;
	};

	return `
		<div class="preloader">

			<div class="pane pane-closer">
				${createPanels()}
			</div>
		</div>
	`;
}