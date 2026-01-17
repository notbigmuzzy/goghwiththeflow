export function createDialer() {

	const years = [];

	// Centuries from 0 to 1400
	const centuries = [0, 200, 300, 600, 700, 800, 900, 1000, 1100, 1200, 1300];
	centuries.forEach(year => years.push({ value: year, type: 'century' }));

	// Decades from 1400 to 1799
	for (let year = 1400; year <= 1799; year += 10) {
		years.push({ value: year, type: 'decade' });
	}

	// Years from 1800 to 2025
	for (let year = 1800; year <= 2025; year++) {
		years.push({ value: year, type: 'year' });
	}

	return `
		<div class="cover">
			<div class='cover-left'></div>
			<div class='cover-selection'></div>
			<div class='cover-right'></div>
		</div>
		<ul class="dialer">
			${years.map(item => `<li data-year="${item.value}" data-period="${item.type}"><i>${item.value}</i><span>${item.value}</span></li>`).join('\n\t\t\t')}
			<li class="today" data-year="TODAY" data-period="today"><i>TODAY</i><span>TODAY</span></li>
		</ul>
	`;
}
