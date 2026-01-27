export function getEra(year) {
	switch (true) {
		case (parseInt(year, 10) < 1480):
			return "Pre-Renaissance";
		case (parseInt(year, 10) <= 1520):
			return "High-Renaissance";
		case (parseInt(year, 10) <= 1600):
			return "Mannerism";
		case (parseInt(year, 10) <= 1730):
			return "Baroque";
		case (parseInt(year, 10) <= 1770):
			return "Rococo";
		case (parseInt(year, 10) <= 1830):
			return "Romanticism";
		case (parseInt(year, 10) <= 1870):
			return "Realism";
		case (parseInt(year, 10) <= 1890):
			return "Impressionism";
		case (parseInt(year, 10) <= 1915):
			return "Post-Impressionism";
		case (parseInt(year, 10) <= 1940):
			return "Early Modernism";
		default:
			return "landing-page";
	}
}
