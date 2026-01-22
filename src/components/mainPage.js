import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { InertiaPlugin } from 'gsap/InertiaPlugin';
gsap.registerPlugin(Draggable, InertiaPlugin);
let currentFullscreenPhoto = null;
let wheelHandler = null;
let draggableInstances = [];

let currentWrapperDraggable = null;

export function initPhotoInteractions() {
	initDraggables();
	initEventListeners();
}

function initDraggables() {
	draggableInstances = Draggable.create('.photo', {
		type: 'x,y',
		bounds: '#mainPage',
		inertia: true,
		onDragStart: function (e) {
			// if (!this.target.classList.contains('fullscreen')) {
			// 	this.endDrag(e);
			// 	return;
			// }
			gsap.to(this.target, { rotation: 0, rotationX: 0, rotationY: 0, scale: 1, duration: 0.2 });
		},
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
			photo._gsap.originalWidth = parseFloat(getComputedStyle(photo).width);
			photo._gsap.originalHeight = parseFloat(getComputedStyle(photo).height);

			const rect = photo.getBoundingClientRect();
			const vw = window.innerWidth;
			const vh = window.innerHeight;

			const wrapper = photo.querySelector('.img-wrapper');
			const img = wrapper ? wrapper.querySelector('img') : photo.querySelector('img');

			gsap.to(photo, { rotationX: 0, rotationY: 0, scale: 1, duration: 0.3 });
			const currentX = gsap.getProperty(photo, 'x');
			const currentY = gsap.getProperty(photo, 'y');

			if (img) {
				const currentSrc = img.src;
				const highResSrc = currentSrc.replace('web-large', 'original');
				photo.classList.add('getting-high-res');

				const onLoad = () => {
					photo.classList.remove('getting-high-res');
					img.removeEventListener('load', onLoad);
					img.removeEventListener('error', onError);

					const scaleX = vw / rect.width;
					const scaleY = vh / rect.height;
					const scale = Math.min(scaleX, scaleY) * 0.9;

					const targetWidth = rect.width * scale;
					const targetHeight = rect.height * scale;

					const visualCenterX = (vw * 0.25) + (rect.width / 2);
					const targetX = visualCenterX - (targetWidth / 2) - rect.left + currentX;
					const targetY = (vh - targetHeight) / 2 - rect.top + currentY;

					setTimeout(() => {
						const navbar = document.querySelector('#navbar');
						photo.classList.add('fullscreen');
						navbar.classList.add('fullscreen');
						document.querySelectorAll('.photo').forEach(p => {
							if (p !== photo) {
								p.classList.add('faded');
							}
						});
						const timeline = document.querySelector('#timeline');
						if (timeline) timeline.classList.add('hide');

						const exhibitLink = document.querySelector('#exhibitLink');
						if (exhibitLink) {
							const objectURL = photo.dataset.objectUrl;
							if (objectURL) exhibitLink.href = objectURL;
						}

						currentFullscreenPhoto = photo;

						const photoDraggable = getDraggableInstance(photo);
						if (photoDraggable) photoDraggable.disable();


						const photoInfo = photo.querySelector('.photo-info');
						if (photoInfo) {
							const photoInfoHeight = photoInfo.offsetHeight;
							const centerY = (-targetHeight / 2) + (photoInfoHeight / 2);
							gsap.to(photoInfo, {
								x: targetWidth + 20,
								y: centerY,
								width: 300,
								duration: 0.5,
								scale: 1.1,
								ease: 'power2.inOut'
							});
						}

						gsap.killTweensOf(photo);
						photo.style.transition = 'none';

						const freshRect = photo.getBoundingClientRect();
						const freshCurrentX = gsap.getProperty(photo, 'x');
						const freshCurrentY = gsap.getProperty(photo, 'y');

						const startScale = freshRect.width / targetWidth;

						gsap.set(photo, { width: targetWidth, height: targetHeight });

						const centerX = freshRect.left + freshRect.width / 2;
						const centerY = freshRect.top + freshRect.height / 2;

						const staticLeft = freshRect.left - freshCurrentX;
						const staticTop = freshRect.top - freshCurrentY;

						const centerOfTargetIfStatic = {
							x: staticLeft + targetWidth / 2,
							y: staticTop + targetHeight / 2
						};

						const startX = centerX - centerOfTargetIfStatic.x;
						const startY = centerY - centerOfTargetIfStatic.y;

						photo._gsap.startX = startX;
						photo._gsap.startY = startY;
						photo._gsap.originalWidth = freshRect.width;
						photo._gsap.originalHeight = freshRect.height;
						photo._gsap.currentX = freshCurrentX;
						photo._gsap.currentY = freshCurrentY;

						gsap.fromTo(photo,
							{
								x: startX,
								y: startY,
								scale: startScale,
								rotationX: 0,
								rotationY: 0
							},
							{
								x: targetX,
								y: targetY,
								scale: 1,
								rotationX: 0,
								rotationY: 0,
								duration: 0.5,
								ease: 'power2.inOut',
								onComplete: () => {
									photo.style.transition = '';
								}
							}
						);

						if (wrapper) {
							gsap.to(wrapper, {
								scale: 1,
								x: 0,
								y: 0,
								duration: 0.5,
								ease: 'power2.inOut',
								onComplete: () => {
									if (currentWrapperDraggable) currentWrapperDraggable.kill();
									currentWrapperDraggable = Draggable.create(wrapper, {
										type: 'x,y',
										inertia: true,
										onDragStart: function () {
											this.target.classList.add('drag-in-progress');
										},
										onDragEnd: function () {
											if (!this.isThrowing) {
												this.target.classList.remove('drag-in-progress');
											}
										},
										onThrowComplete: function () {
											this.target.classList.remove('drag-in-progress');
										}
									})[0];
								}
							});
							wrapper._gsap = wrapper._gsap || {};
							wrapper._gsap.initialFullscreenScale = 1;
							addZoomHandler(wrapper);
						}
					}, 300);
				};

				const onError = () => {
					photo.classList.remove('getting-high-res');
					img.src = currentSrc;
					img.removeEventListener('load', onLoad);
					img.removeEventListener('error', onError);
				};

				img.addEventListener('load', onLoad);
				img.addEventListener('error', onError);
				img.src = highResSrc;
			}
		}
	});
}

function initEventListeners() {
	document.getElementById('mainPage').addEventListener('click', function (e) {
		if (currentFullscreenPhoto) {
			const clickedContent = e.target.closest('.img-wrapper') || e.target.closest('.photo-info');
			if (!clickedContent) {
				exitFullscreen();
			}
		}
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && currentFullscreenPhoto) {
			exitFullscreen();
		}
	});

	document.getElementById('closeLink').addEventListener('click', function (e) {
		e.preventDefault();
		exitFullscreen();
	});
}

function exitFullscreen() {
	if (!currentFullscreenPhoto) return;

	const photo = currentFullscreenPhoto;
	photo.classList.remove('getting-high-res');
	photo.style.transition = 'none';

	if (currentWrapperDraggable) {
		currentWrapperDraggable.kill();
		currentWrapperDraggable = null;
	}

	const wrapper = photo.querySelector('.img-wrapper');
	const img = wrapper ? wrapper.querySelector('img') : photo.querySelector('img');
	if (wrapper) wrapper.classList.remove('zoomed');
	const navbar = document.querySelector('#navbar');
	photo.classList.remove('fullscreen');
	navbar.classList.remove('fullscreen');

	const photoInfo = photo.querySelector('.photo-info');
	if (photoInfo) {
		gsap.to(photoInfo, {
			x: 0,
			y: 0,
			scale: 1,
			duration: 0.5,
			ease: 'power2.inOut'
		});
	}
	const animProps = {
		x: photo._gsap.startX || 0,
		y: photo._gsap.startY || 0,
		scale: photo._gsap.originalWidth / parseFloat(photo.style.width),
		duration: 0.5,
		ease: 'power2.inOut',
		onComplete: () => {
			if (photo._gsap.originalWidth) photo.style.width = photo._gsap.originalWidth + 'px';
			if (photo._gsap.originalHeight) photo.style.height = photo._gsap.originalHeight + 'px';
			gsap.set(photo, {
				scale: 1,
				x: photo._gsap.currentX || 0,
				y: photo._gsap.currentY || 0
			});
			setTimeout(() => {
				photo.style.transition = '';
			}, 20);
		}
	};

	gsap.to(photo, animProps);
	if (wrapper) {
		gsap.to(wrapper, {
			scale: 1,
			x: 0,
			y: 0,
			duration: 0.5,
			ease: 'power2.inOut'
		});
	}

	if (img) {
		gsap.to(img, {
			scale: 1,
			duration: 0.5,
			ease: 'power2.inOut'
		});
	}

	removeZoomHandler();

	const photoDraggable = getDraggableInstance(photo);
	if (photoDraggable) {
		photoDraggable.enable();
		photoDraggable.applyBounds('#mainPage');
	}

	currentFullscreenPhoto = null;
	document.querySelectorAll('.photo.faded').forEach(p => p.classList.remove('faded'));
	const timeline = document.querySelector('#timeline');
	if (timeline) timeline.classList.remove('hide');

	setTimeout(() => {
		if (img) {
			const currentSrc = img.src;
			img.src = currentSrc.replace('original', 'web-large');
		}
	}, 300);
}

function addZoomHandler(target) {
	removeZoomHandler();

	let zoomTimeout;
	let initialPinchDistance = null;
	let initialScale = 1;
	let pinchCenter = { x: 0, y: 0 };
	let lastTapTime = 0;
	const doubleTapDelay = 300;

	// Double tap zoom handler
	const doubleTapHandler = (e) => {
		const currentTime = new Date().getTime();
		const tapInterval = currentTime - lastTapTime;

		if (tapInterval < doubleTapDelay && tapInterval > 0) {
			e.preventDefault();

			const img = target.querySelector('img');
			const currentScale = img ? (gsap.getProperty(img, 'scale') || 1) : 1;
			const minScale = target._gsap.initialFullscreenScale || 1;
			const targetScale = currentScale > minScale * 1.1 ? minScale : minScale * 2.5;

			const rect = target.getBoundingClientRect();
			const touch = e.changedTouches[0];
			const tapX = touch.clientX;
			const tapY = touch.clientY;

			const currentX = gsap.getProperty(target, 'x');
			const currentY = gsap.getProperty(target, 'y');

			const photoCenterX = rect.left + rect.width / 2;
			const photoCenterY = rect.top + rect.height / 2;

			const deltaX = tapX - photoCenterX;
			const deltaY = tapY - photoCenterY;

			const scaleChange = targetScale / currentScale - 1;
			const offsetX = -deltaX * scaleChange;
			const offsetY = -deltaY * scaleChange;

			if (img) {
				const wrapper = target.classList.contains('img-wrapper') ? target : target.querySelector('.img-wrapper');
				if (wrapper) {
					if (targetScale > minScale * 1.01) wrapper.classList.add('zoomed');
					else wrapper.classList.remove('zoomed');
				}
				gsap.to(img, {
					scale: targetScale,
					duration: 0.3,
					ease: 'power2.out'
				});
			}

			gsap.to(target, {
				x: currentX + offsetX,
				y: currentY + offsetY,
				duration: 0.3,
				ease: 'power2.out'
			});

			lastTapTime = 0;
		} else {
			lastTapTime = currentTime;
		}
	};

	// Wheel zoom handler
	wheelHandler = (e) => {
		if (target.classList.contains('drag-in-progress')) return;

		e.preventDefault();
		e.stopPropagation();

		if (!target.classList.contains('zoom-in-progress')) {
			target.classList.add('zoom-in-progress');
			if (currentWrapperDraggable) currentWrapperDraggable.disable();
		}

		clearTimeout(zoomTimeout);
		zoomTimeout = setTimeout(() => {
			target.classList.remove('zoom-in-progress');
			if (currentWrapperDraggable) currentWrapperDraggable.enable();
		}, 200);

		const minScale = target._gsap.initialFullscreenScale || 1;
		const maxScale = minScale * 8;
		const zoomSpeed = 0.008;

		const img = target.querySelector('img');
		const currentScale = img ? (gsap.getProperty(img, 'scale') || 1) : 1;
		const delta = -e.deltaY * zoomSpeed;
		let newScale = currentScale + delta;

		newScale = Math.max(minScale, Math.min(maxScale, newScale));

		const rect = target.getBoundingClientRect();

		const mouseX = e.clientX;
		const mouseY = e.clientY;

		const currentX = gsap.getProperty(target, 'x');
		const currentY = gsap.getProperty(target, 'y');

		const photoCenterX = rect.left + rect.width / 2;
		const photoCenterY = rect.top + rect.height / 2;

		const deltaX = mouseX - photoCenterX;
		const deltaY = mouseY - photoCenterY;

		const scaleChange = newScale / currentScale - 1;
		const offsetX = -deltaX * scaleChange;
		const offsetY = -deltaY * scaleChange;

		if (img) {
			const wrapper = target.classList.contains('img-wrapper') ? target : target.querySelector('.img-wrapper');
			if (wrapper) {
				if (newScale > minScale * 1.01) wrapper.classList.add('zoomed');
				else wrapper.classList.remove('zoomed');
			}
			gsap.to(img, {
				scale: newScale,
				duration: 0.2,
				ease: 'power2.out'
			});
		}

		gsap.to(target, {
			x: currentX + offsetX,
			y: currentY + offsetY,
			duration: 0.2,
			ease: 'power2.out'
		});
	};

	{ // Touch zoom handler
		const getTouchDistance = (touch1, touch2) => {
			const dx = touch1.clientX - touch2.clientX;
			const dy = touch1.clientY - touch2.clientY;
			return Math.sqrt(dx * dx + dy * dy);
		};

		const getTouchCenter = (touch1, touch2) => {
			return {
				x: (touch1.clientX + touch2.clientX) / 2,
				y: (touch1.clientY + touch2.clientY) / 2
			};
		};

		const touchStartHandler = (e) => {
			if (e.touches.length === 2) {
				e.preventDefault();
				target.classList.add('zoom-in-progress');
				if (currentWrapperDraggable) currentWrapperDraggable.disable();

				const img = target.querySelector('img');
				initialScale = img ? (gsap.getProperty(img, 'scale') || 1) : 1;
				initialPinchDistance = getTouchDistance(e.touches[0], e.touches[1]);
				pinchCenter = getTouchCenter(e.touches[0], e.touches[1]);
			}
		};

		const touchMoveHandler = (e) => {
			if (e.touches.length === 2 && initialPinchDistance) {
				e.preventDefault();

				const currentDistance = getTouchDistance(e.touches[0], e.touches[1]);
				const currentCenter = getTouchCenter(e.touches[0], e.touches[1]);

				const minScale = target._gsap.initialFullscreenScale || 1;
				const maxScale = minScale * 8;

				const scaleMultiplier = currentDistance / initialPinchDistance;
				let newScale = initialScale * scaleMultiplier;
				newScale = Math.max(minScale, Math.min(maxScale, newScale));

				const img = target.querySelector('img');
				const currentScale = img ? (gsap.getProperty(img, 'scale') || 1) : 1;

				const rect = target.getBoundingClientRect();
				const currentX = gsap.getProperty(target, 'x');
				const currentY = gsap.getProperty(target, 'y');

				const photoCenterX = rect.left + rect.width / 2;
				const photoCenterY = rect.top + rect.height / 2;

				const deltaX = currentCenter.x - photoCenterX;
				const deltaY = currentCenter.y - photoCenterY;

				const scaleChange = newScale / currentScale - 1;
				const offsetX = -deltaX * scaleChange;
				const offsetY = -deltaY * scaleChange;

				if (img) {
					const wrapper = target.classList.contains('img-wrapper') ? target : target.querySelector('.img-wrapper');
					if (wrapper) {
						if (newScale > minScale * 1.01) wrapper.classList.add('zoomed');
						else wrapper.classList.remove('zoomed');
					}
					gsap.set(img, { scale: newScale });
				}

				gsap.set(target, {
					x: currentX + offsetX,
					y: currentY + offsetY
				});
			}
		};

		const touchEndHandler = (e) => {
			if (e.touches.length < 2) {
				initialPinchDistance = null;
				target.classList.remove('zoom-in-progress');
				if (currentWrapperDraggable) currentWrapperDraggable.enable();
			}
		};
	}

	target.addEventListener('wheel', wheelHandler, { passive: false });
	target.addEventListener('touchstart', touchStartHandler, { passive: false });
	target.addEventListener('touchmove', touchMoveHandler, { passive: false });
	target.addEventListener('touchend', doubleTapHandler);
	target.addEventListener('touchend', touchEndHandler);
	target.addEventListener('touchcancel', touchEndHandler);

	// Store handlers for cleanup
	target._zoomHandlers = {
		wheel: wheelHandler,
		touchstart: touchStartHandler,
		touchmove: touchMoveHandler,
		touchend: touchEndHandler,
		doubleTap: doubleTapHandler
	};
}

function removeZoomHandler() {
	if (currentFullscreenPhoto) {
		const wrapper = currentFullscreenPhoto.querySelector('.img-wrapper');
		if (wrapper && wrapper._zoomHandlers) {
			wrapper.removeEventListener('wheel', wrapper._zoomHandlers.wheel);
			wrapper.removeEventListener('touchstart', wrapper._zoomHandlers.touchstart);
			wrapper.removeEventListener('touchmove', wrapper._zoomHandlers.touchmove);
			wrapper.removeEventListener('touchend', wrapper._zoomHandlers.touchend);
			wrapper.removeEventListener('touchend', wrapper._zoomHandlers.doubleTap);
			wrapper.removeEventListener('touchcancel', wrapper._zoomHandlers.touchend);
			delete wrapper._zoomHandlers;
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
	const height = Math.floor(viewportHeight * 0.475);
	const width = Math.floor(height * aspectRatio);

	const dimensions = { width, height };
	const positions = [];

	const topRowCount = Math.min(3, numberOfPhotos);
	const topRowLefts = [0.175, 0.5, 0.825];

	for (let i = 0; i < topRowCount; i++) {
		positions.push({
			top: 0.1,
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
				top: 0.4,
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
			<div class="photo photo-${i + 1}" data-id="${artwork.objectID}" data-object-url="${artwork.objectURL}" style="position: absolute; top: ${top}px; left: ${left}px; width: ${dimensions.width}px; height: ${dimensions.height}px;">
				<div class="img-wrapper">
					<img src="${artwork.primaryImageSmall}" loading="lazy" alt="${artwork.title} by ${artwork.artistDisplayName} (${artwork.objectDate})" />
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
