import gsap from 'gsap';
import { makeApiCall } from './apiCall.js';

export function initDialerScroll() {
	const dialer = document.querySelector('.dialer');
	const timeline = document.querySelector('#timeline');
	const preloader = document.querySelector('#preloader');
	const panels = document.querySelectorAll('.panel');
	const mainpage = document.querySelector('#mainPage');

	let isDragging = false;
	let startX = 0;
	let scrollLeft = 0;
	let velocity = 0;
	let lastX = 0;
	let lastTime = Date.now();
	let animationFrame = null;
	let snapTimeout = null;
	let isInitializing = true;
	let lastScrollPos = 0;

	const updatePanels = () => {
		const scrollPos = dialer.scrollLeft;
		const delta = scrollPos - lastScrollPos;
		const viewportWidth = window.innerWidth;
		lastScrollPos = scrollPos;

		panels.forEach(panel => {
			let speedMultiplier;
			const paneType = panel.className.includes('panel-further') ? 'further'
				: panel.className.includes('panel-middle') ? 'middle'
					: panel.className.includes('panel-window') ? 'window'
						: 'closer';

			switch (paneType) {
				case 'further':
					speedMultiplier = 0.25;
					break;
				case 'middle':
					speedMultiplier = 0.5;
					break;
				case 'window':
					speedMultiplier = -1.5;
					break;
				case 'closer':
					speedMultiplier = 1;
					break;
			}

			let currentX = gsap.getProperty(panel, 'x') || 0;

			currentX += delta * speedMultiplier;

			const baseLeft = panel.offsetLeft;
			const screenPos = baseLeft + currentX;

			if (screenPos > viewportWidth + 200) {
				currentX -= viewportWidth + 400;
			} else if (screenPos < -200) {
				currentX += viewportWidth + 400;
			}

			gsap.set(panel, { x: currentX });
		});
	};

	const findCenterItem = () => {
		const items = dialer.querySelectorAll('li');
		const dialerCenter = dialer.offsetLeft + dialer.offsetWidth / 2;

		let closestItem = null;
		let closestDistance = Infinity;

		items.forEach(item => {
			const itemCenter = item.offsetLeft - dialer.scrollLeft + item.offsetWidth / 2;
			const distance = Math.abs(dialerCenter - itemCenter);

			if (distance < closestDistance) {
				closestDistance = distance;
				closestItem = item;
			}
		});

		return closestItem;
	};

	const setActiveItem = (item) => {
		dialer.querySelectorAll('li').forEach(li => li.classList.remove('active'));
		item.classList.add('active');
	};

	const snapToCenter = () => {
		const centerItem = findCenterItem();
		if (!centerItem) return;

		const dialerCenter = dialer.offsetWidth / 2;
		const itemCenter = centerItem.offsetLeft + centerItem.offsetWidth / 2;
		const targetScroll = itemCenter - dialerCenter;
		const year = centerItem.dataset.year;

		timeline.classList.add('dialing');
		changePeriods(year);

		const url = new URL(window.location);
		url.searchParams.set('year', year);
		window.history.replaceState({}, '', url);

		gsap.delayedCall(0, () => {
			setActiveItem(centerItem);
			makeApiCall(year, 'dialer');
		});

		gsap.to(dialer, {
			scrollLeft: targetScroll,
			duration: 0.5,
			ease: 'power2.out'
		});
	};

	const scheduleSnap = () => {
		if (snapTimeout) {
			clearTimeout(snapTimeout);
		}
		snapTimeout = setTimeout(() => {
			snapToCenter();
		}, 0);
	};

	const handleMouseDown = (e) => {
		const pageX = e.pageX || (e.touches && e.touches[0].pageX);

		isDragging = true;
		startX = pageX - dialer.offsetLeft;
		scrollLeft = dialer.scrollLeft;
		lastX = pageX;
		lastTime = Date.now();
		velocity = 0;
		dialer.querySelectorAll('li').forEach(li => li.classList.remove('active'));
		timeline.classList.add('dialing');
		preloader.classList.add('loading');
		mainpage.classList.remove('show-exhibit');

		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
		if (snapTimeout) {
			clearTimeout(snapTimeout);
		}
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;
		e.preventDefault();
		dialer.querySelectorAll('li').forEach(li => li.classList.remove('active'));

		const pageX = e.pageX || (e.touches && e.touches[0].pageX);
		const x = pageX - dialer.offsetLeft;
		const walk = (x - startX) * 2;

		const currentTime = Date.now();
		const timeDelta = currentTime - lastTime;
		if (timeDelta > 0) {
			velocity = (pageX - lastX) / timeDelta;
		}

		lastX = pageX;
		lastTime = currentTime;

		dialer.scrollLeft = scrollLeft - walk;
	};

	const handleMouseUp = () => {
		if (!isDragging) return;
		isDragging = false;

		const applyMomentum = () => {
			if (Math.abs(velocity) > 0.05) {
				dialer.scrollLeft -= velocity * 20;
				velocity *= 0.95;
				animationFrame = requestAnimationFrame(applyMomentum);
			} else {
				snapToCenter();
			}
		};

		if (Math.abs(velocity) > 0.25) {
			applyMomentum();
		} else {
			snapToCenter();
		}
	};

	const handleMouseLeave = () => {
		if (isDragging) {
			handleMouseUp();
		}
	};

	const handleScroll = () => {
		updatePanels();
		if (!isDragging && Math.abs(velocity) < 0.01 && !isInitializing && !timeline.classList.contains('dialing')) {
			scheduleSnap();
		}
	};

	{ // Initialize event listeners
		dialer.style.userSelect = 'none';
		dialer.addEventListener('mousedown', handleMouseDown);
		dialer.addEventListener('mousemove', handleMouseMove);
		dialer.addEventListener('mouseup', handleMouseUp);
		dialer.addEventListener('mouseleave', handleMouseLeave);
		dialer.addEventListener('touchstart', handleMouseDown, { passive: false });
		dialer.addEventListener('touchmove', handleMouseMove, { passive: false });
		dialer.addEventListener('touchend', handleMouseUp);
		dialer.addEventListener('scroll', handleScroll);
		dialer.addEventListener('dragstart', (e) => e.preventDefault());
	}

	{ // Initial centering
		const urlParams = new URLSearchParams(window.location.search);
		const urlYear = urlParams.get('year');
		const storedYear = localStorage.getItem('currentYear');
		const initialYear = urlYear || storedYear || 'Today';

		let itemToCenter;
		if (initialYear === 'Today') {
			itemToCenter = dialer.querySelector('li:last-child');
		} else {
			itemToCenter = dialer.querySelector(`li[data-year="${initialYear}"]`) || dialer.querySelector('li:last-child');
		}

		const dialerCenter = dialer.offsetWidth / 2;
		const itemCenter = itemToCenter.offsetLeft + itemToCenter.offsetWidth / 2;
		const targetScroll = itemCenter - dialerCenter;

		dialer.scrollLeft = targetScroll;
		lastScrollPos = targetScroll;
		setActiveItem(itemToCenter);

		if (initialYear !== 'Today') {
			timeline.classList.add('dialing');
			preloader.classList.add('loading');
			mainpage.classList.remove('show-exhibit');
			changePeriods(initialYear);
			setTimeout(() => {
				makeApiCall(initialYear, 'dialer');
			}, 100);
		}

		setTimeout(() => {
			isInitializing = false;
		}, 100);
	}

	document.querySelector('#moreLink').addEventListener('click', (e) => {
		e.preventDefault();

		const centerItem = findCenterItem();
		makeApiCall(centerItem.dataset.year, 'more');
	});

	document.querySelectorAll('.century-link').forEach(link => {
		link.addEventListener('click', (e) => {
			e.preventDefault();
			const target = e.target.closest('a');
			if (!target) return;
			const year = target.dataset.century;

			const itemToCenter = dialer.querySelector(`li[data-year="${year}"]`);
			if (!itemToCenter) return;

			const dialerCenter = dialer.offsetWidth / 2;
			const itemCenter = itemToCenter.offsetLeft + itemToCenter.offsetWidth / 2;
			const targetScroll = itemCenter - dialerCenter;

			// Stop any existing momentum
			isDragging = false;
			velocity = 0;
			if (animationFrame) cancelAnimationFrame(animationFrame);
			if (snapTimeout) clearTimeout(snapTimeout);

			timeline.classList.add('dialing');
			preloader.classList.add('loading');
			mainpage.classList.remove('show-exhibit');

			changePeriods(year);

			gsap.to(dialer, {
				scrollLeft: targetScroll,
				duration: 2,
				ease: 'power2.inOut',
				onComplete: () => {
					snapToCenter();
				}
			});
		});
	});

	function changePeriods(year) {
		const gallery = document.querySelector('#gallery');
		const exhibitLabel = document.querySelector('#exhibitLabel');
		const era = getEra(year);
		const eraWrapperClass = era.toLowerCase().replace(/\s+/g, '-');

		// UI update for era change
		gallery.classList.remove(...gallery.classList);
		gallery.classList.add(eraWrapperClass);

		if (year === 'Today') {
			exhibitLabel.innerHTML = `Time-traveling art gallery`;
		} else {
			exhibitLabel.innerHTML = `<i>→</i> Click me to see More from "${era}"`;
		}
	}

	function getEra(year) {
		switch (true) {
			case (parseInt(year, 10) < 1480):
				return "Pre-Renaissance";
			case (parseInt(year, 10) <= 1520):
				return "High Renaissance";
			case (parseInt(year, 10) <= 1600):
				return "Mannerism";
			case (parseInt(year, 10) <= 1730):
				return "Baroque";
			case (parseInt(year, 10) <= 1770):
				return "Rococo";
			case (parseInt(year, 10) <= 1830):
				return "Romanticism";
			case (parseInt(year, 10) <= 1870):
				return "Realism";
			case (parseInt(year, 10) <= 1890):
				return "Impressionism";
			case (parseInt(year, 10) <= 1915):
				return "Post-Impressionism";
			case (parseInt(year, 10) <= 1940):
				return "Early Modernism";
			default:
				return "landing-page";
		}
	}
}
