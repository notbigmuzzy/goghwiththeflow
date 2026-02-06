import gsap from 'gsap';
import { makeApiCall } from './apiCall.js';

export function initKeyboard() {
	const dialer = document.querySelector('.dialer');
	const timeline = document.querySelector('#timeline');

	if (!dialer) return;

	const scrollToYear = (yearItem) => {
		const dialerCenter = dialer.offsetWidth / 2;
		const itemCenter = yearItem.offsetLeft + yearItem.offsetWidth / 2;
		const targetScroll = itemCenter - dialerCenter;
		const year = yearItem.dataset.year;

		dialer.querySelectorAll('li').forEach(li => li.classList.remove('active'));
		yearItem.classList.add('active');


		timeline.classList.add('dialing');
		if (window.changePeriods) {
			window.changePeriods(year);
		}

		const url = new URL(window.location);
		url.searchParams.set('year', year);
		window.history.replaceState({}, '', url);

		gsap.to(dialer, {
			scrollLeft: targetScroll,
			duration: 0.5,
			ease: 'power2.out',
			onComplete: () => {
				makeApiCall(year, 'dialer');
			}
		});
	};

	const getCurrentYearItem = () => {
		return dialer.querySelector('li.active') || dialer.querySelector('li[data-year]');
	};

	const getRandomYearItem = () => {
		const yearItems = Array.from(dialer.querySelectorAll('li[data-year]'));
		const randomIndex = Math.floor(Math.random() * yearItems.length);
		return yearItems[randomIndex];
	};

	const handleKeyboard = (e) => {
		if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;

		const currentYear = getCurrentYearItem();
		if (!currentYear) return;

		switch (e.key) {
			case ' ':
				e.preventDefault();
				const randomYear = getRandomYearItem();
				scrollToYear(randomYear);
				break;

			case 'ArrowLeft':
				e.preventDefault();
				const previousYear = currentYear.previousElementSibling;
				if (previousYear && previousYear.dataset.year) {
					scrollToYear(previousYear);
				}
				break;

			case 'ArrowRight':
				e.preventDefault();
				const nextYear = currentYear.nextElementSibling;
				if (nextYear && nextYear.dataset.year) {
					scrollToYear(nextYear);
				}
				break;

			case 'ArrowUp':
			case 'ArrowDown':
				e.preventDefault();
				if (window.findCenterItem) {
					const centerItem = window.findCenterItem();
					if (centerItem && centerItem.dataset.year) {
						makeApiCall(centerItem.dataset.year, 'more');
					}
				}
				break;
		}
	};

	document.addEventListener('keydown', handleKeyboard);
}
