import fs from 'fs';
import https from 'https';

const START_YEAR = 1921;
const END_YEAR = 1950;
const MAX_IDS = 100000;
const DELAY_MS = 1300; // ~46 calls per minute to stay under 50/min limit

function fetchJson(url) {
	return new Promise((resolve, reject) => {
		https.get(url, (res) => {
			let data = '';
			res.on('data', (chunk) => data += chunk);
			res.on('end', () => {
				try {
					resolve(JSON.parse(data));
				} catch (e) {
					reject(e);
				}
			});
		}).on('error', reject);
	});
}

function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}

async function scrapeYear(year) {
	console.log(`Scraping year ${year}...`);

	// Prepare output directory and file
	const outputDir = './scraped_ids';
	if (!fs.existsSync(outputDir)) {
		fs.mkdirSync(outputDir, { recursive: true });
	}
	const filename = `${outputDir}/${year}.csv`;

	// Clear file if it exists
	fs.writeFileSync(filename, '');

	// Get all IDs for the year
	const searchUrl = `https://collectionapi.metmuseum.org/public/collection/v1/search?hasImages=true&dateBegin=${year}&dateEnd=${year}&q=*`;
	const searchData = await fetchJson(searchUrl);

	if (!searchData.objectIDs || searchData.objectIDs.length === 0) {
		console.log(`No results found for ${year}`);
		return [];
	}

	console.log(`Found ${searchData.objectIDs.length} total IDs for ${year}`);

	// Shuffle and limit
	const shuffled = searchData.objectIDs.sort(() => 0.5 - Math.random());
	const idsToCheck = shuffled.slice(0, Math.min(searchData.objectIDs.length, MAX_IDS * 3));

	const validIds = [];
	let checked = 0;

	for (const id of idsToCheck) {
		if (validIds.length >= MAX_IDS) break;

		checked++;
		process.stdout.write(`\rChecking ${checked}/${idsToCheck.length}, found ${validIds.length} valid...`);

		try {
			const objectUrl = `https://collectionapi.metmuseum.org/public/collection/v1/objects/${id}`;
			const artwork = await fetchJson(objectUrl);

			// Check if has image
			if (artwork && artwork.primaryImage && artwork.primaryImage !== '') {
				// For years >= 1920, also check public domain
				const isValidForYear = year < 1920 || artwork.isPublicDomain === true;

				if (isValidForYear) {
					validIds.push(id);
					// Append to file immediately
					fs.appendFileSync(filename, id + '\n');
				}
			}

			await sleep(DELAY_MS);
		} catch (err) {
			// Rate limiting - wait longer
			await sleep(DELAY_MS * 5);
		}
	}

	console.log(`\nFound ${validIds.length} valid IDs after checking ${checked}`);
	console.log(`Saved to ${filename}`);
	return validIds;
}

async function main() {
	console.log(`\nScraping years ${START_YEAR} to ${END_YEAR}\n`);

	for (let year = START_YEAR; year <= END_YEAR; year++) {
		console.log(`\n=== Year ${year} (${year - START_YEAR + 1}/${END_YEAR - START_YEAR + 1}) ===`);
		await scrapeYear(year);

		// Small pause between years
		if (year < END_YEAR) {
			console.log(`Waiting before next year...`);
			await sleep(2000);
		}
	}

	console.log(`\n✓ Completed scraping all years from ${START_YEAR} to ${END_YEAR}`);
}

main().catch(console.error);
