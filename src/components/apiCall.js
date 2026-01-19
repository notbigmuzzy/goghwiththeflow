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
		const artworks = await fetchArtworks(year);
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

export async function fetchArtworks(year) {
	const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&dateBegin=${year}&dateEnd=${year}&q=*`;

	try {
		const paintingsResponse = await fetch(searchUrl);
		const paintingsData = await paintingsResponse.json();

		if (!paintingsData.objectIDs || paintingsData.objectIDs.length === 0) {
			console.log('No artworks found for year:', year);
			return [];
		}

		const shuffledIDs = paintingsData.objectIDs.sort(() => 0.5 - Math.random());
		const targetCount = Math.floor(Math.random() * 3) + 3; // 3-5 artworks
		const artworks = [];
		let attempts = 0;

		for (const id of shuffledIDs) {
			if (artworks.length >= targetCount || attempts >= 10) break;
			attempts++;

			const objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
			try {
				const response = await fetch(objectUrl);
				const artwork = await response.json();

				if (artwork && artwork.primaryImage && artwork.primaryImage !== '') {
					artworks.push(artwork);
				}
			} catch (err) {
				console.error(`Failed to fetch object ${id}:`, err);
			}
		}

		console.log(`Final artworks: ${artworks.length} found after ${attempts} attempts`);
		return artworks;
	} catch (error) {
		console.error('Error fetching artworks:', error);
		return [];
	}
}