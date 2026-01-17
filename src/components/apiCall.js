import { createPhotos } from './mainPage.js';

export function makeApiCall(year, period) {
	const storedYear = localStorage.getItem('currentYear');
	const timeline = document.querySelector('#timeline');
	const preloader = document.querySelector('#preloader');
	const mainpage = document.querySelector('#mainPage');
	const newYearSelected = storedYear !== String(year);

	if (year === 'TODAY') {
		preloader.classList.remove('loading');
		preloader.classList.remove('downloading');
		timeline.classList.remove('downloading');
		return;
	}

	if (newYearSelected) {
		localStorage.setItem('currentYear', year); // SET NEW YEAR IN LOCAL STORAGE
		mainpage.querySelectorAll('.photo').forEach(photo => photo.remove()); // REFRESH PHOTOS
		const photoPane = mainpage.querySelector('.pane-photos');
		if (photoPane) {
			photoPane.innerHTML = createPhotos();
		}
	}

	// API CALL HERE //////////////////////////////
	let delay = 800;
	delay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;
	setTimeout(() => {
		preloader.classList.remove('loading', 'downloading');
		timeline.classList.remove('dialing', 'downloading');

		setTimeout(() => {
			mainpage.classList.add('show');
		}, 400);
	}, delay);
	// API CALL HERE //////////////////////////////
}
