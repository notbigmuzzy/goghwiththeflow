import { getEra } from './getEra.js';

let currentEra = null;
let musicData = null;
let fetchPromise = null;

function getMusicData() {

	if (musicData) return Promise.resolve(musicData);
	if (!fetchPromise) {
		fetchPromise = fetch('/goghwiththeflow/api/music.json')
			.then(res => {
				if (!res.ok) throw new Error('Failed to fetch music configuration');
				return res.json();
			})
			.then(data => {
				musicData = data;
				return data;
			})
			.catch(err => {
				console.error("Error loading music data:", err);
				fetchPromise = null; // allow retry
				return null;
			});
	}
	return fetchPromise;
}

export async function updateMusic(year) {

	const targetYear = year === 'Today' ? new Date().getFullYear() : parseInt(year, 10);

	const data = await getMusicData();
	if (!data) return;

	const eraName = getEra(targetYear);
	const eraId = eraName.toLowerCase().replace(/\s+/g, '-');

	if (eraId && eraId !== currentEra) {
		currentEra = eraId;

		if (eraId === 'landing-page') {
			const player = document.getElementById('thePlayer');
			if (player) {
				player.pause();
				player.src = '';
			}
			return;
		}

		const eraData = data[eraId];

		if (eraData && eraData.length > 0) {
			const randomIndex = Math.floor(Math.random() * eraData.length);
			const song = eraData[randomIndex].song;
			const player = document.getElementById('thePlayer');

			if (player) {
				player.src = song.url;
				player.load();
			}
		}
	}
}
