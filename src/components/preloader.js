export function createPreloader() {
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;

	const createPanels = (size) => {
		let dimensions, positions;

		switch (size) {
			case 'closer':
				dimensions = { width: 160, height: 280 };
				positions = [
					{ top: 20, left: viewportWidth * 0.8 },
					{ top: viewportHeight * 0.5, left: 80 },
					{ top: viewportHeight * 0.6, left: viewportWidth * 0.7 }
				];
				break;
			case 'middle':
				dimensions = { width: 100, height: 180 };
				positions = [
					{ top: viewportHeight * 0.15, left: viewportWidth * 0.15 },
					{ top: viewportHeight * 0.7, left: viewportWidth * 0.3 },
					{ top: viewportHeight * 0.5, left: viewportWidth * 0.9 }
				];
				break;
			case 'further':
				dimensions = { width: 60, height: 120 };
				positions = [
					{ top: viewportHeight * 0.05, left: viewportWidth * 0.3 },
					{ top: viewportHeight * 0.7, left: viewportWidth * 0.5 },
					{ top: viewportHeight * 0.1, left: viewportWidth * 0.6 }
				];
				break;
		}

		let panels = '';
		for (let i = 0; i < 3; i++) {
			const pos = positions[i];
			panels += `<div class="panel panel-${size}-${i + 1}" style="position: absolute; top: ${pos.top}px; left: ${pos.left}px; width: ${dimensions.width}px; height: ${dimensions.height}px;"></div>`;
		}
		return panels;
	};

	return `
		<div id="preloader">
			<div class="pane pane-further">
				${createPanels('further')}
			</div>
			<div class="pane pane-middle">
				${createPanels('middle')}
			</div>
			<div class="pane pane-closer">
				${createPanels('closer')}
			</div>
		</div>
	`;
}