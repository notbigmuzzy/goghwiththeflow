export function createPreloader() {
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;

	const createWindParticles = () => {
		let particles = '';
		const particleCount = 30;

		for (let i = 0; i < particleCount; i++) {
			const top = Math.floor(Math.random() * viewportHeight);
			const left = Math.floor(Math.random() * viewportWidth);
			const size = Math.floor(Math.random() * 3) + 1;
			const delay = Math.random() * 5;
			const duration = Math.random() * 3 + 2;

			particles += `<div class="wind-particle" style="position: absolute; top: ${top}px; left: ${left}px; width: ${size}px; height: ${size}px; animation-delay: ${delay}s; animation-duration: ${duration}s;"></div>`;
		}

		return particles;
	};

	const createPanels = (size) => {
		let dimensions, positions;

		switch (size) {
			case 'closer':
				dimensions = { width: 160, height: 280 };
				positions = [
					{ top: Math.floor(viewportHeight * 0.2), left: Math.floor(viewportWidth * 0.8) },
					{ top: Math.floor(viewportHeight * 0.5), left: Math.floor(viewportWidth * 0.3) },
					{ top: Math.floor(viewportHeight * -0.05), left: Math.floor(viewportWidth * 0.275) },
					{ top: Math.floor(viewportHeight * 0.2), left: Math.floor(viewportWidth * -0.2) },
					{ top: Math.floor(viewportHeight * 0.6), left: Math.floor(viewportWidth * 0.4) },
					{ top: Math.floor(viewportHeight * 0.3), left: Math.floor(viewportWidth * 0.0) }
				];
				break;
			case 'middle':
				dimensions = { width: 100, height: 180 };
				positions = [
					{ top: Math.floor(viewportHeight * 0.15), left: Math.floor(viewportWidth * 0.15) },
					{ top: Math.floor(viewportHeight * 0.7), left: Math.floor(viewportWidth * -0.3) },
					{ top: Math.floor(viewportHeight * 0.5), left: Math.floor(viewportWidth * 0.9) },
					{ top: Math.floor(viewportHeight * 0.25), left: Math.floor(viewportWidth * 0.5) },
					{ top: Math.floor(viewportHeight * 0.7), left: Math.floor(viewportWidth * 0.75) },
					{ top: Math.floor(viewportHeight * 0.4), left: Math.floor(viewportWidth * 0.45) }
				];
				break;
			case 'further':
				dimensions = { width: 60, height: 100 };
				positions = [
					{ top: Math.floor(viewportHeight * -0.05), left: Math.floor(viewportWidth * -0.3) },
					{ top: Math.floor(viewportHeight * 0.7), left: Math.floor(viewportWidth * 0.4) },
					{ top: Math.floor(viewportHeight * 0.1), left: Math.floor(viewportWidth * 0.65) },
					{ top: Math.floor(viewportHeight * 0.35), left: Math.floor(viewportWidth * -0.1) },
					{ top: Math.floor(viewportHeight * 0.45), left: Math.floor(viewportWidth * 0.85) },
					{ top: Math.floor(viewportHeight * 0.5), left: Math.floor(viewportWidth * 0.65) }
				];
				break;
		}

		let panels = '';
		for (let i = 0; i < 6; i++) {
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
			<div class="pane pane-window">
				${createWindParticles()}
			</div>
		</div>
	`;
}