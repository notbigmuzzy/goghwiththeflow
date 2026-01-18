import { createPhotos, initPhotoInteractions } from './mainPage.js';

export async function makeApiCall(year, period) {
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
		const artworks = await fetchArtworks();
		localStorage.setItem('currentYear', year); // SET NEW YEAR IN LOCAL STORAGE
		mainpage.querySelectorAll('.photo').forEach(photo => photo.remove()); // REFRESH PHOTOS
		const photoPane = mainpage.querySelector('.pane-photos');
		if (photoPane) {
			photoPane.innerHTML = createPhotos(artworks);
			initPhotoInteractions();
		}
	}

	{ // SHOW MAIN PAGE AFTER LOADING
		preloader.classList.remove('loading', 'downloading');
		timeline.classList.remove('dialing', 'downloading');
		setTimeout(() => {
			mainpage.classList.add('show');
		}, 400);
	}
}

export async function fetchArtworks() {
	try {
		const response = await fetch('/src/api/mock_photo.json');
		if (!response.ok) throw new Error('Failed to fetch artworks');
		const data = await response.json();
		return data;
	} catch (error) {
		console.error('Error fetching artworks:', error);
		return [];
	}
}