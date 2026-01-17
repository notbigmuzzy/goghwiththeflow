export function createPhotos() {
	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;
	const numberOfPhotos = Math.floor(Math.random() * 5) + 4;
	const dimensions = { width: 200, height: 300 };

	let topPositions = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.55, 0.6, 0.65];
	let leftPositions = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.35, 0.55, 0.6, 0.65, 0.7, 0.75, 0.8];

	if (numberOfPhotos > topPositions.length) topPositions = [...topPositions, ...topPositions];
	if (numberOfPhotos > leftPositions.length) leftPositions = [...leftPositions, ...leftPositions];

	const shuffle = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	};

	const selectedTops = shuffle(topPositions).slice(0, numberOfPhotos);
	const selectedLefts = shuffle(leftPositions).slice(0, numberOfPhotos);

	let photos = '';
	for (let i = 0; i < numberOfPhotos; i++) {
		const top = Math.floor(viewportHeight * selectedTops[i]);
		const left = Math.floor(viewportWidth * selectedLefts[i]);

		photos += `<div class="photo photo-${i + 1}" style="position: absolute; top: ${top}px; left: ${left}px; width: ${dimensions.width}px; height: ${dimensions.height}px;"></div>`;
	}
	return photos;
}

export function createMainPage() {
	return `
		<div id="mainPage">
			<div class="pane pane-photos"></div>
		</div>
	`;
}