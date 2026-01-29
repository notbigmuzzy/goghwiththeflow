export function createDialer() {

	const years = [];
	const excludedYears = [
		1441, 1442, 1443, 1444, 1445, 1446, 1447, 1448, 1449,
		1451, 1452, 1453, 1454, 1455, 1456, 1457, 1458, 1459,
		1461, 1462, 1463, 1464, 1465, 1466, 1467, 1468, 1469,
		1471, 1474, 1920, 1923, 1924, 1925, 1927, 1928, 1929,
		1931, 1932, 1933, 1934, 1935, 1937
	];

	for (let year = 1440; year <= 1940; year++) {
		if (!excludedYears.includes(year)) {
			years.push({ value: year, type: 'year' });
		}
	}

	return `
		<div class="preload-instructions">
			<div class="instructions">
				<p class="instruct"><i class="arrow-down"></i>Drag me to flow trough the years</p>
			</div>
			<div class="century-links left">
				<span data-century="1601" class="century-link">XVII <i>century</i></span>
				<span data-century="1501" class="century-link">XVI <i>century</i></span>
				<span data-century="1440" class="century-link">XV <i>century</i></span>
			</div>
			<div class="century-links right">
				<span data-century="1701" class="century-link">XVIII <i>century</i></span>
				<span data-century="1801" class="century-link">XIX <i>century</i></span>
				<span data-century="1901" class="century-link">XX <i>century</i></span>
			</div>
		</div>
		<div class="dialer-wrapper">
			<ul class="dialer">
				${years.map(item => `
					<li data-year="${item.value}" data-period="${item.type}">
						<span>${item.value}</span>
					</li>
				`).join('\n\t\t\t')}
				<li class="Today" data-year="Today" data-period="Today">
					<span>Today</span>
				</li>
			</ul>
		</div>
	`;
}
