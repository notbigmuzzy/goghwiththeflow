export function createDialer() {

	const years = [];
	const excludedYears = [
		1474, 1920, 1923, 1924, 1925, 1927, 1928, 1929, 1931, 1932, 1933, 1934, 1935, 1937
	];

	for (let year = 1472; year <= 1940; year++) {
		if (!excludedYears.includes(year)) {
			years.push({ value: year, type: 'year' });
		}
	}

	return `
		<ul class="dialer">
			${years.map(
		item => `
					<li data-year="${item.value}" data-period="${item.type}">
						<span>${item.value}</span>
					</li>
				`).join('\n\t\t\t')
		}
			<li class="Today" data-year="Today" data-period="Today">
				<span>Today</span>
			</li>
		</ul>
	`;
}
