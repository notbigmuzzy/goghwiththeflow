export function createDialer() {
	const years = [];
	for (let year = 0; year <= 2000; year += 10) {
		years.push(year);
	}

	return `
		<div class="cover">
			<div class='cover-left'></div>
			<div class='cover-selection'></div>
			<div class='cover-right'></div>
		</div>
		<ul class="dialer">
			${years.map(year => `<li data-year="${year}"><i>${year}</i><span>${year}</span></li>`).join('\n\t\t\t')}
			<li class="today"><i>TODAY</i><span>TODAY</span></li>
		</ul>
	`;
}
