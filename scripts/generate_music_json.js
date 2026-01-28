import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const MUSIC_DIR = path.resolve(__dirname, '../public/music');
const OUTPUT_FILE = path.resolve(__dirname, '../public/api/music.json');

function main() {
	console.log(`Scanning music directory: ${MUSIC_DIR}`);

	if (!fs.existsSync(MUSIC_DIR)) {
		console.error(`Directory not found: ${MUSIC_DIR}`);
		process.exit(1);
	}

	const structure = {};

	try {
		const eras = fs.readdirSync(MUSIC_DIR).filter(file => {
			return fs.statSync(path.join(MUSIC_DIR, file)).isDirectory();
		});

		for (const era of eras) {
			const eraPath = path.join(MUSIC_DIR, era);
			const files = fs.readdirSync(eraPath).filter(f => {
				return !f.startsWith('.') && fs.statSync(path.join(eraPath, f)).isFile();
			});

			const songs = files.map(filename => {
				return {
					song: {
						name: filename.replace('.mp3', ''),
						url: `music/${era}/${filename}`
					}
				};
			});

			if (songs.length > 0) {
				structure[era] = songs;
			}
		}

		// Create the output directory if it doesn't exist (though ../public/api should exist)
		const outputDir = path.dirname(OUTPUT_FILE);
		if (!fs.existsSync(outputDir)) {
			fs.mkdirSync(outputDir, { recursive: true });
		}

		fs.writeFileSync(OUTPUT_FILE, JSON.stringify(structure, null, 2));
		console.log(`Successfully generated music JSON at: ${OUTPUT_FILE}`);

	} catch (err) {
		console.error('Error generating music JSON:', err);
		process.exit(1);
	}
}

main();
