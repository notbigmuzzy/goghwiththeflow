import { createPhotos, initPhotoInteractions } from './mainPage.js';

export async function makeApiCall(year) {
	const storedYear = localStorage.getItem('currentYear');
	const timeline = document.querySelector('#timeline');
	const preloader = document.querySelector('#preloader');
	const mainpage = document.querySelector('#mainPage');
	const newYearSelected = storedYear !== String(year);

	if (year === 'TODAY') {
		preloader.classList.remove('loading');
		preloader.classList.remove('downloading');
		timeline.classList.remove('downloading');
		mainpage.querySelectorAll('.photo').forEach(photo => photo.remove());
		return;
	}

	if (newYearSelected) {
		const artworks = await fetchArtworks(year);
		localStorage.setItem('currentYear', year);
		mainpage.querySelectorAll('.photo').forEach(photo => photo.remove());
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

export async function fetchArtworks(year) {
	try {
		const response = await fetch(`/src/api/ids/${year}.json`);
		const validIds = await response.json();

		if (!validIds || validIds.length === 0) {
			console.log('No valid IDs found for year:', year);
			return [];
		}

		const targetCount = Math.floor(Math.random() * 3) + 3; // 3-5 artworks
		const shuffled = validIds.sort(() => 0.5 - Math.random());
		const selectedIds = shuffled.slice(0, targetCount);

		const artworks = [];
		for (const id of selectedIds) {
			const objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
			try {
				const response = await fetch(objectUrl);
				const artwork = await response.json();

				if (artwork && artwork.primaryImage) {
					artworks.push(artwork);
				}
			} catch (err) {
				console.error(`Failed to fetch object ${id}:`, err);
			}
		}

		return artworks;
	} catch (error) {
		console.error('Error fetching artworks:', error);
		return [];
	}
}