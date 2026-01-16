export function createPreloader() {
	const createPanels = () => {
		const viewportWidth = window.innerWidth;
		const viewportHeight = window.innerHeight;

		const positions = [
			{ top: 20, left: viewportWidth * 0.8, width: 120, height: 200 },
			{ top: viewportHeight * 0.5, left: 80, width: 120, height: 200 },
			{ top: viewportHeight * 0.6, left: viewportWidth * 0.7, width: 120, height: 200 }
		];

		let panels = '';
		for (let i = 0; i < 3; i++) {
			const pos = positions[i];
			panels += `<div class="panel panel-${i + 1}" style="position: absolute; top: ${pos.top}px; left: ${pos.left}px; width: ${pos.width}px; height: ${pos.height}px;"></div>`;
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