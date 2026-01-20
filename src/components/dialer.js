export function createDialer() {

	const years = [];
	const excludedYears = [
		1474
	];

	for (let year = 1472; year <= 1919; year++) {
		if (!excludedYears.includes(year)) {
			years.push({ value: year, type: 'year' });
		}
	}

	return `
		<div class="cover">
			<div class='cover-left'></div>
			<div class='cover-selection'></div>
			<div class='cover-right'></div>
		</div>
		<ul class="dialer">
			${years.map(item => `<li data-year="${item.value}" data-period="${item.type}"><i>${item.value}</i><span>${item.value}</span></li>`).join('\n\t\t\t')}
			<li class="Today" data-year="Today" data-period="Today"><i>Today</i><span>Today</span></li>
		</ul>
	`;
}
