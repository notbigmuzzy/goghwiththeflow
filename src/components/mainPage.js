import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
gsap.registerPlugin(Draggable, InertiaPlugin);
let currentFullscreenPhoto = null;
let wheelHandler = null;
let draggableInstances = [];

export function initPhotoInteractions() {
	draggableInstances = Draggable.create('.photo', {
		type: 'x,y',
		bounds: '#mainPage',
		inertia: true,
		onClick: function () {
			const photo = this.target;
			const isFullscreen = photo.classList.contains('fullscreen');

			if (currentFullscreenPhoto && currentFullscreenPhoto !== photo) {
				currentFullscreenPhoto.classList.remove('fullscreen');
				gsap.to(currentFullscreenPhoto, {
					x: currentFullscreenPhoto._gsap.startX || 0,
					y: currentFullscreenPhoto._gsap.startY || 0,
					scale: 1,
					duration: 0.5,
					ease: 'power2.inOut'
				});
				removeZoomHandler();
				enableBounds(currentFullscreenPhoto);
				currentFullscreenPhoto = null;
			}

			if (isFullscreen) {
				photo.classList.remove('fullscreen');
				gsap.to(photo, {
					x: photo._gsap.startX || 0,
					y: photo._gsap.startY || 0,
					scale: 1,
					duration: 0.5,
					ease: 'power2.inOut'
				});
				removeZoomHandler();
				enableBounds(photo);
				currentFullscreenPhoto = null;
			} else {
				photo._gsap.startX = gsap.getProperty(photo, 'x');
				photo._gsap.startY = gsap.getProperty(photo, 'y');

				const rect = photo.getBoundingClientRect();
				const vw = window.innerWidth;
				const vh = window.innerHeight;

				const scaleX = vw / rect.width;
				const scaleY = vh / rect.height;
				const scale = Math.min(scaleX, scaleY) * 0.9; // 0.9 for some padding

				const currentX = gsap.getProperty(photo, 'x');
				const currentY = gsap.getProperty(photo, 'y');
				const centerX = (vw - rect.width) / 2 - rect.left + currentX;
				const centerY = (vh - rect.height) / 2 - rect.top + currentY;

				photo.classList.add('fullscreen');
				photo._gsap.initialFullscreenScale = scale;
				currentFullscreenPhoto = photo;
				disableBounds(photo);
				gsap.to(photo, {
					x: centerX,
					y: centerY,
					scale: scale,
					duration: 0.5,
					ease: 'power2.inOut'
				});
				addZoomHandler(photo);
			}
		}
	});
}

function addZoomHandler(photo) {
	removeZoomHandler();

	wheelHandler = (e) => {
		if (!photo.classList.contains('fullscreen')) return;

		e.preventDefault();

		const minScale = photo._gsap.initialFullscreenScale || 1;
		const maxScale = minScale * 3;
		const zoomSpeed = 0.001;

		const currentScale = gsap.getProperty(photo, 'scale');
		const delta = -e.deltaY * zoomSpeed;
		let newScale = currentScale + delta;

		newScale = Math.max(minScale, Math.min(maxScale, newScale));

		const rect = photo.getBoundingClientRect();
		const mouseX = e.clientX - rect.left;
		const mouseY = e.clientY - rect.top;

		const currentX = gsap.getProperty(photo, 'x');
		const currentY = gsap.getProperty(photo, 'y');

		const scaleRatio = newScale / currentScale;
		const offsetX = mouseX * (1 - scaleRatio);
		const offsetY = mouseY * (1 - scaleRatio);

		gsap.to(photo, {
			scale: newScale,
			x: currentX + offsetX,
			y: currentY + offsetY,
			duration: 0.2,
			ease: 'power2.out'
		});
	};

	photo.addEventListener('wheel', wheelHandler, { passive: false });
}

function removeZoomHandler() {
	if (wheelHandler && currentFullscreenPhoto) {
		currentFullscreenPhoto.removeEventListener('wheel', wheelHandler);
		wheelHandler = null;
	}
}

function getDraggableInstance(photo) {
	return draggableInstances.find(instance => instance.target === photo);
}

function disableBounds(photo) {
	const instance = getDraggableInstance(photo);
	if (instance) {
		instance.applyBounds({ minX: -Infinity, maxX: Infinity, minY: -Infinity, maxY: Infinity });
	}
}

function enableBounds(photo) {
	const instance = getDraggableInstance(photo);
	if (instance) {
		instance.applyBounds('#mainPage');
	}
}

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
