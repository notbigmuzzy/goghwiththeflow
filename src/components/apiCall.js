export function makeApiCall(year, period) {
	const storedYear = localStorage.getItem('currentYear');
	const timeline = document.querySelector('#timeline');
	const preloader = document.querySelector('#preloader');
	const mainpage = document.querySelector('#mainPage');

	if (year === 'TODAY') {
		preloader.classList.remove('loading');
		preloader.classList.remove('downloading');
		timeline.classList.remove('downloading');

		return;
	}


	// DEBUG //////////////////////////////
	let delay = 800;
	if (storedYear !== String(year)) {
		localStorage.setItem('currentYear', year);
		console.log(`API call made for year: ${year} and period: ${period}`);
		delay = Math.floor(Math.random() * (5000 - 2000 + 1)) + 2000;

	}
	setTimeout(() => {
		preloader.classList.remove('loading');
		preloader.classList.remove('downloading');
		timeline.classList.remove('dialing');
		timeline.classList.remove('downloading');

		setTimeout(() => {
			mainpage.classList.add('show');
		}, 400);

	}, delay);
	// DEBUG //////////////////////////////
}
