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

			if (isFullscreen) {
				return;
			}

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
				document.querySelectorAll('.photo.faded').forEach(p => p.classList.remove('faded'));
			}

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


			// SWAP IMAGE TO HIGH-RES
			const img = photo.querySelector('img');
			if (img) {
				const currentSrc = img.src;
				img.src = currentSrc.replace('web-large', 'original');
			}

			// ENTER FULLSCREEN AFTER A SHORT DELAY FOR SMOOTHNESS
			setTimeout(() => {
				photo.classList.add('fullscreen');
				document.querySelectorAll('.photo').forEach(p => {
					if (p !== photo) {
						p.classList.add('faded');
					}
				});
				const timeline = document.querySelector('#timeline');
				timeline.classList.add('hide');
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
			}, 250);
		}
	});

	document.getElementById('mainPage').addEventListener('click', function (e) {
		if (currentFullscreenPhoto && !e.target.closest('.photo')) {
			exitFullscreen();
		}
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && currentFullscreenPhoto) {
			exitFullscreen();
		}
	});
}

function exitFullscreen() {
	if (!currentFullscreenPhoto) return;

	// SWAP IMAGE BACK TO LOW-RES
	const photo = currentFullscreenPhoto;
	const img = photo.querySelector('img');
	if (img) {
		const currentSrc = img.src;
		img.src = currentSrc.replace('original', 'web-large');
	}

	// EXIT FULLSCREEN AFTER A SHORT DELAY FOR SMOOTHNESS
	setTimeout(() => {
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
		document.querySelectorAll('.photo.faded').forEach(p => p.classList.remove('faded'));
		const timeline = document.querySelector('#timeline');
		timeline.classList.remove('hide');
	}, 100);
}

function addZoomHandler(photo) {
	removeZoomHandler();

	wheelHandler = (e) => {
		if (!photo.classList.contains('fullscreen')) return;

		e.preventDefault();

		const minScale = photo._gsap.initialFullscreenScale || 1;
		const maxScale = minScale * 8;
		const zoomSpeed = 0.010;

		const currentScale = gsap.getProperty(photo, 'scale');
		const delta = -e.deltaY * zoomSpeed;
		let newScale = currentScale + delta;

		newScale = Math.max(minScale, Math.min(maxScale, newScale));

		const mouseX = e.clientX;
		const mouseY = e.clientY;

		const currentX = gsap.getProperty(photo, 'x');
		const currentY = gsap.getProperty(photo, 'y');

		const rect = photo.getBoundingClientRect();

		const photoCenterX = rect.left + rect.width / 2;
		const photoCenterY = rect.top + rect.height / 2;

		const deltaX = mouseX - photoCenterX;
		const deltaY = mouseY - photoCenterY;

		const scaleChange = newScale / currentScale - 1;
		const offsetX = -deltaX * scaleChange;
		const offsetY = -deltaY * scaleChange;

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

export function createPhotos(artworks = []) {
	if (!artworks.length) return '';

	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;
	const numberOfPhotos = Math.min(Math.floor(Math.random() * 5) + 3, artworks.length);

	const aspectRatio = 240 / 320;
	const height = Math.floor(viewportHeight * 0.5);
	const width = Math.floor(height * aspectRatio);

	const dimensions = { width, height };

	let topPositions = [0.05, 0.1, 0.15, 0.2, 0.25, 0.3, 0.4, 0.44, 0.5];
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
	const shuffledArtworks = shuffle([...artworks]).slice(0, numberOfPhotos);

	let photos = '';
	for (let i = 0; i < numberOfPhotos; i++) {
		const top = Math.floor(viewportHeight * selectedTops[i]);
		const left = Math.floor(viewportWidth * selectedLefts[i]);
		const artwork = shuffledArtworks[i];

		photos += `<div class="photo photo-${i + 1}" data-id="${artwork.objectID}" style="position: absolute; top: ${top}px; left: ${left}px; width: ${dimensions.width}px; height: ${dimensions.height}px;"><img src="${artwork.primaryImage}" loading="lazy" style="width: 100%; height: 100%; object-fit: cover;" alt="${artwork.title} by ${artwork.artistDisplayName} (${artwork.objectDate})" /></div>`;
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
