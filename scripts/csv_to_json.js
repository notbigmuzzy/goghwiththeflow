import fs from 'fs';
import path from 'path';

const INPUT_DIR = './scraped_ids';
const OUTPUT_DIR = './valid_ids_json';

function csvToJson(csvFilePath) {
	const csvContent = fs.readFileSync(csvFilePath, 'utf-8');
	const ids = csvContent
		.split('\n')
		.map(line => line.trim())
		.filter(line => line !== '')
		.map(id => parseInt(id, 10));

	return ids;
}

function main() {
	// Create output directory if it doesn't exist
	if (!fs.existsSync(OUTPUT_DIR)) {
		fs.mkdirSync(OUTPUT_DIR, { recursive: true });
	}

	// Read all CSV files from input directory
	const files = fs.readdirSync(INPUT_DIR).filter(file => file.endsWith('.csv'));

	console.log(`Found ${files.length} CSV files to convert`);

	for (const file of files) {
		const csvPath = path.join(INPUT_DIR, file);
		const year = path.basename(file, '.csv');
		const ids = csvToJson(csvPath);

		const jsonPath = path.join(OUTPUT_DIR, `${year}.json`);
		fs.writeFileSync(jsonPath, JSON.stringify(ids, null, 2));

		console.log(`Converted ${file} -> ${year}.json (${ids.length} IDs)`);
	}

	console.log(`\nAll files converted to ${OUTPUT_DIR}/`);
}

main();
