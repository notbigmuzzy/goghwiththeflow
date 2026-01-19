import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
gsap.registerPlugin(Draggable, InertiaPlugin);
let currentFullscreenPhoto = null;
let wheelHandler = null;
let draggableInstances = [];

let currentWrapperDraggable = null;

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
				exitFullscreen();
			}

			photo._gsap.startX = gsap.getProperty(photo, 'x');
			photo._gsap.startY = gsap.getProperty(photo, 'y');

			const rect = photo.getBoundingClientRect();
			const vw = window.innerWidth;
			const vh = window.innerHeight;

			const scaleX = vw / rect.width;
			const scaleY = vh / rect.height;
			const scale = Math.min(scaleX, scaleY) * 0.9;

			const currentX = gsap.getProperty(photo, 'x');
			const currentY = gsap.getProperty(photo, 'y');
			const centerX = (vw * 0.25) - rect.left + currentX;
			const centerY = (vh - rect.height) / 2 - rect.top + currentY;

			// SWAP IMAGE TO HIGH-RES
			const wrapper = photo.querySelector('.img-wrapper');
			const img = wrapper ? wrapper.querySelector('img') : photo.querySelector('img');

			if (img) {
				const currentSrc = img.src;
				const highResSrc = currentSrc.replace('web-large', 'original');
				photo.classList.add('getting-high-res');

				const onLoad = () => {
					photo.classList.remove('getting-high-res');
					img.removeEventListener('load', onLoad);
					img.removeEventListener('error', onError);

					// ENTER FULLSCREEN AFTER IMAGE LOADS
					setTimeout(() => {
						photo.classList.add('fullscreen');
						document.querySelectorAll('.photo').forEach(p => {
							if (p !== photo) {
								p.classList.add('faded');
							}
						});
						const timeline = document.querySelector('#timeline');
						if (timeline) timeline.classList.add('hide');

						currentFullscreenPhoto = photo;

						// Disable drag on .photo container
						const photoDraggable = getDraggableInstance(photo);
						if (photoDraggable) photoDraggable.disable();

						const photoInfo = photo.querySelector('.photo-info');
						if (photoInfo) {
							// Calculate offset for info
							// Wrapper scales up from center. 
							// Info should be at right edge of scaled wrapper.
							const zoomedWidth = rect.width * scale;
							const offsetX = (rect.width + zoomedWidth) / 2 + 20;

							gsap.to(photoInfo, {
								x: offsetX,
								y: -(rect.height * 0.45),
								duration: 0.5,
								ease: 'power2.inOut'
							});
						}

						// Move Photo to center (without scaling container)
						gsap.to(photo, {
							x: centerX,
							y: centerY,
							scale: 1,
							duration: 0.5,
							ease: 'power2.inOut'
						});

						// Scale Wrapper
						if (wrapper) {
							gsap.to(wrapper, {
								scale: scale,
								x: 0,
								y: 0,
								duration: 0.5,
								ease: 'power2.inOut',
								onComplete: () => {
									// Enable drag on wrapper
									if (currentWrapperDraggable) currentWrapperDraggable.kill();
									currentWrapperDraggable = Draggable.create(wrapper, {
										type: 'x,y',
										inertia: true
									})[0];
								}
							});

							// Store initial scale for zoom limits
							wrapper._gsap = wrapper._gsap || {};
							wrapper._gsap.initialFullscreenScale = scale;
							addZoomHandler(wrapper);
						}
					}, 250);
				};

				const onError = () => {
					photo.classList.remove('getting-high-res');
					img.src = currentSrc; // Revert to low-res on error
					img.removeEventListener('load', onLoad);
					img.removeEventListener('error', onError);
				};

				img.addEventListener('load', onLoad);
				img.addEventListener('error', onError);
				img.src = highResSrc;
			}
		}
	});

	document.getElementById('mainPage').addEventListener('click', function (e) {
		if (currentFullscreenPhoto && !e.target.closest('.photo')) {
			exitFullscreen();
		}
	});
}

function exitFullscreen() {
	if (!currentFullscreenPhoto) return;

	const photo = currentFullscreenPhoto;
	photo.classList.remove('getting-high-res');

	// Kill wrapper drag
	if (currentWrapperDraggable) {
		currentWrapperDraggable.kill();
		currentWrapperDraggable = null;
	}

	const wrapper = photo.querySelector('.img-wrapper');
	const img = wrapper ? wrapper.querySelector('img') : photo.querySelector('img');

	if (img) {
		const currentSrc = img.src;
		img.src = currentSrc.replace('original', 'web-large');
	}

	setTimeout(() => {
		photo.classList.remove('fullscreen');

		// Animate photo-info back
		const photoInfo = photo.querySelector('.photo-info');
		if (photoInfo) {
			gsap.to(photoInfo, {
				x: 0,
				y: 0,
				duration: 0.5,
				ease: 'power2.inOut'
			});
		}

		// Reset Photo position
		gsap.to(photo, {
			x: photo._gsap.startX || 0,
			y: photo._gsap.startY || 0,
			scale: 1,
			duration: 0.5,
			ease: 'power2.inOut'
		});

		// Reset Wrapper
		if (wrapper) {
			gsap.to(wrapper, {
				scale: 1,
				x: 0,
				y: 0,
				duration: 0.5,
				ease: 'power2.inOut'
			});
		}

		removeZoomHandler();

		// Re-enable photo drag
		const photoDraggable = getDraggableInstance(photo);
		if (photoDraggable) {
			// Ensure bounds are reset to #mainPage if they were changed
			photoDraggable.enable();
			photoDraggable.applyBounds('#mainPage');
		}

		currentFullscreenPhoto = null;
		document.querySelectorAll('.photo.faded').forEach(p => p.classList.remove('faded'));
		const timeline = document.querySelector('#timeline');
		if (timeline) timeline.classList.remove('hide');
	}, 100);
}

function addZoomHandler(target) {
	removeZoomHandler();

	// Attach wheel listener to the photo container or the target?
	// The target (wrapper) is scaled.
	// Let's attach to the target for direct interaction.

	wheelHandler = (e) => {
		// e.target might be img inside wrapper.
		// using 'target' closure variable which is the wrapper.

		e.preventDefault();
		e.stopPropagation();

		const minScale = target._gsap.initialFullscreenScale || 1;
		const maxScale = minScale * 8;
		const zoomSpeed = 0.010;

		const currentScale = gsap.getProperty(target, 'scale');
		const delta = -e.deltaY * zoomSpeed;
		let newScale = currentScale + delta;

		newScale = Math.max(minScale, Math.min(maxScale, newScale));

		const rect = target.getBoundingClientRect();

		// Mouse position relative to viewport
		const mouseX = e.clientX;
		const mouseY = e.clientY;

		const currentX = gsap.getProperty(target, 'x');
		const currentY = gsap.getProperty(target, 'y');

		// Calculate center of the transformed element
		const photoCenterX = rect.left + rect.width / 2;
		const photoCenterY = rect.top + rect.height / 2;

		const deltaX = mouseX - photoCenterX;
		const deltaY = mouseY - photoCenterY;

		const scaleChange = newScale / currentScale - 1;
		const offsetX = -deltaX * scaleChange;
		const offsetY = -deltaY * scaleChange;

		gsap.to(target, {
			scale: newScale,
			x: currentX + offsetX,
			y: currentY + offsetY,
			duration: 0.2,
			ease: 'power2.out'
		});
	};

	target.addEventListener('wheel', wheelHandler, { passive: false });
}

function removeZoomHandler() {
	if (wheelHandler && currentFullscreenPhoto) {
		const wrapper = currentFullscreenPhoto.querySelector('.img-wrapper');
		if (wrapper) {
			wrapper.removeEventListener('wheel', wheelHandler);
		}
		wheelHandler = null;
	}
}

function getDraggableInstance(photo) {
	return draggableInstances.find(instance => instance.target === photo);
}

export function createPhotos(artworks = []) {
	if (!artworks.length) return '';

	const viewportWidth = window.innerWidth;
	const viewportHeight = window.innerHeight;
	const numberOfPhotos = artworks.length;

	const aspectRatio = 240 / 320;
	const height = Math.floor(viewportHeight * 0.5);
	const width = Math.floor(height * aspectRatio);

	const dimensions = { width, height };
	const positions = [];

	const topRowCount = Math.min(3, numberOfPhotos);
	const topRowLefts = [0.2, 0.5, 0.8];
	for (let i = 0; i < topRowCount; i++) {
		positions.push({
			top: 0.15,
			left: topRowLefts[i]
		});
	}

	const bottomRowCount = numberOfPhotos - topRowCount;
	if (bottomRowCount > 0) {
		const bottomRowLefts = bottomRowCount === 1 ? [0.35] :
			bottomRowCount === 2 ? [0.35, 0.65] :
				[0.2, 0.5, 0.8];
		for (let i = 0; i < bottomRowCount; i++) {
			positions.push({
				top: 0.35,
				left: bottomRowLefts[i]
			});
		}
	}

	const shuffle = (array) => {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	};

	const shuffledArtworks = shuffle([...artworks]);

	let photos = '';
	for (let i = 0; i < numberOfPhotos; i++) {
		const top = Math.floor(viewportHeight * positions[i].top);
		const left = Math.floor(viewportWidth * positions[i].left) - Math.floor(width / 2);
		const artwork = shuffledArtworks[i];

		photos += `
			<div class="photo photo-${i + 1}" data-id="${artwork.objectID}" style="position: absolute; top: ${top}px; left: ${left}px; width: ${dimensions.width}px; height: ${dimensions.height}px;">
				<div class="img-wrapper" style="width: 100%; height: 100%;">
					<img src="${artwork.primaryImageSmall}" loading="lazy" style="width: 100%; height: 100%; object-fit: contain;" alt="${artwork.title} by ${artwork.artistDisplayName} (${artwork.objectDate})" />
				</div>
				<div class="photo-info">
					<div class="photo-artist">${artwork.artistDisplayName}</div>
					<div class="photo-title">${artwork.title}</div>
					<div class="additional-info">
						<hr>
						<div class="info-item">${artwork.department}</div>
						<div class="info-item">${artwork.artistDisplayBio}</div>
						<div class="info-item">${artwork.medium}</div>
						<div class="info-item">${artwork.dimensions}</div>
						<div class="info-item">${artwork.creditLine}</div>
					</div>
				</div>
			</div>
		`;
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
