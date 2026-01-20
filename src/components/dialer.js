export function createDialer() {

	const years = [];
	const excludedYears = [
		// 1482, 1483, 1486, 1487, 1488, 1489, 1492, 1495, 1496, 1497, 1499,
		// 1501, 1503, 1504, 1505, 1507, 1509, 1514, 1522, 1523, 1529, 1530, 1534, 1538, 1541,
		// 1544, 1546, 1550, 1552, 1553, 1555, 1567, 1573, 1575, 1576, 1579, 1580, 1581, 1583,
		// 1584, 1590, 1600, 1601, 1606, 1609, 1612, 1614, 1617, 1618, 1706, 1715, 1718, 1719,
		// 1720, 1722, 1723, 1728, 1731, 1734, 1831, 1905, 1906, 1917
	];

	// 1477-1918
	for (let year = 1600; year <= 1919; year++) {
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
			<li class="today" data-year="TODAY" data-period="today"><i>TODAY</i><span>TODAY</span></li>
		</ul>
	`;
}
