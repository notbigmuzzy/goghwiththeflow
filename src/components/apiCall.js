import { createPhotos, initPhotoInteractions } from './mainPage.js';

export async function makeApiCall(year, source) {
	const storedYear = localStorage.getItem('currentYear');
	const timeline = document.querySelector('#timeline');
	const preloader = document.querySelector('#preloader');
	const mainpage = document.querySelector('#mainPage');
	const navbar = document.querySelector('#navbar');
	const exhibitMoreBtn = document.querySelector('#moreLink');
	const newYearSelected = storedYear !== String(year);

	if (year === 'Today') {
		localStorage.setItem('currentYear', 'Today');
		preloader.classList.remove('loading');
		preloader.classList.remove('downloading');
		exhibitMoreBtn.classList.remove('loading');
		timeline.classList.remove('dialing');
		timeline.classList.remove('downloading'); mainpage.classList.remove('show-exhibit');
		navbar.classList.remove('show-exhibit');
		mainpage.classList.add('show-intro');
		mainpage.querySelectorAll('.photo').forEach(photo => photo.remove());

		return;
	}

	timeline.classList.add('downloading');
	preloader.classList.add('downloading');

	if (source === 'dialer') {
		if (newYearSelected) {
			// PREP FOR NEW DATA
			localStorage.setItem('currentYear', year);
			mainpage.querySelectorAll('.photo').forEach(photo => photo.remove());
			// FETCH AND DISPLAY NEW DATA
			const artworks = await fetchArtworks(year);
			const photoPane = mainpage.querySelector('.pane-photos');
			photoPane.innerHTML = createPhotos(artworks);
			// FINALIZE UI UPDATES
			initPhotoInteractions();
			// CLEAN UP LOADING STATES
			cleanUpLoadingStates()
		} else {
			cleanUpLoadingStates()
		}
	} else if (source === 'more') {
		// PREP FOR NEW DATA
		preloader.classList.add('loading');
		exhibitMoreBtn.classList.add('loading');
		mainpage.classList.remove('show-exhibit');
		mainpage.querySelectorAll('.photo').forEach(photo => photo.remove());
		timeline.classList.remove('hide');

		setTimeout(async () => {
			// FETCH AND DISPLAY NEW DATA
			const artworks = await fetchArtworks(year);
			const photoPane = mainpage.querySelector('.pane-photos');
			photoPane.innerHTML = createPhotos(artworks);
			// FINALIZE UI UPDATES
			initPhotoInteractions();
			// CLEAN UP LOADING STATES
			cleanUpLoadingStates()
		}, 500);
	}

	function cleanUpLoadingStates() {
		preloader.classList.remove('loading');
		preloader.classList.remove('downloading');
		exhibitMoreBtn.classList.remove('loading');
		timeline.classList.remove('dialing');
		timeline.classList.remove('downloading');
		setTimeout(() => {
			[mainpage, navbar].forEach(el => el.classList.add('show-exhibit'));
		}, 300);
	}
}

export async function fetchArtworks(year) {
	try {
		const response = await fetch(`/goghwiththeflow/api/ids/${year}.json`);
		const validIds = await response.json();

		if (!validIds || validIds.length === 0) {
			return [];
		}

		const targetCount = Math.floor(Math.random() * 3) + 3;
		const shuffled = validIds.sort(() => 0.5 - Math.random());
		const selectedIds = shuffled.slice(0, targetCount);

		const artworks = [];
		let failureCount = 0;

		for (const id of selectedIds) {
			const objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
			try {
				const response = await fetch(objectUrl);

				if (response.status === 403) {
					showRateLimitPopup();
					return artworks;
				}

				if (!response.ok) {
					continue;
				}

				const artwork = await response.json();

				if (artwork && artwork.primaryImage) {
					artworks.push(artwork);
				}
			} catch (err) {
				failureCount++;

				if (err.message && err.message.includes('Failed to fetch') && failureCount >= 2) {
					showRateLimitPopup();
					return artworks;
				}
			}
		}

		return artworks;
	} catch (error) {
		return [];
	}
}

function showRateLimitPopup() {
	if (document.querySelector('.rate-limit-popup')) {
		return;
	}

	const popup = document.createElement('div');
	popup.className = 'rate-limit-popup';
	popup.innerHTML = `
		<div class="rate-limit-content">
			<p>Due to Met Museum API restrictions, please wait a moment before making another request.</p>
			<div class="rate-limit-timer">
				<div class="rate-limit-bar"></div>
			</div>
		</div>
	`;

	document.body.appendChild(popup);

	setTimeout(() => {
		popup.classList.add('show');
		const bar = popup.querySelector('.rate-limit-bar');
		bar.style.animation = 'shrinkBar 60s linear forwards';
	}, 10);

	setTimeout(() => {
		popup.classList.remove('show');
		setTimeout(() => popup.remove(), 300);
	}, 60000);
}

// window.testRateLimitPopup = showRateLimitPopup;
