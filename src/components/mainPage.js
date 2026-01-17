export function createMainPage() {
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;

	const createPhotos = () => {
		const dimensions = { width: 160, height: 280 };
		const positions = [
			{ top: Math.floor(viewportHeight * 0.2), left: Math.floor(viewportWidth * 0.8) },
			{ top: Math.floor(viewportHeight * 0.6), left: Math.floor(viewportWidth * 0.3) },
			{ top: Math.floor(viewportHeight * 0.1), left: Math.floor(viewportWidth * 0.2) },
			{ top: Math.floor(viewportHeight * 0.4), left: Math.floor(viewportWidth * 0.1) },
			{ top: Math.floor(viewportHeight * 0.5), left: Math.floor(viewportWidth * 0.7) },
		];

		let photos = '';
		for (let i = 0; i < 5; i++) {
			const pos = positions[i];
			photos += `<div class="photo photo-${i + 1}" style="position: absolute; top: ${pos.top}px; left: ${pos.left}px; width: ${dimensions.width}px; height: ${dimensions.height}px;"></div>`;
		}
		return photos;
	};

	return `
		<div id="mainPage">
		
			<div class="pane pane-photos">
				${createPhotos()}
			</div>
		
		</div>
	`;
}