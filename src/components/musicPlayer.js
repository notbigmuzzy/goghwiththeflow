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
	const eraName = getEra(targetYear);
	const eraId = eraName.toLowerCase().replace(/\s+/g, '-');

	if (eraId && eraId !== currentEra) {
		const player = document.getElementById('thePlayer');
		currentEra = eraId;

		if (eraId === 'landing-page') {
			player.pause();
			player.src = '';
		} else {
			const eraData = data[eraId];
			const randomIndex = Math.floor(Math.random() * eraData.length);
			const song = eraData[randomIndex].song;
			const wasPlayingOrInteract = !player.paused || !player.muted;

			player.src = song.url;
			player.load();

			if (wasPlayingOrInteract) {
				const playPromise = player.play();
				if (playPromise !== undefined) {
					playPromise.catch(e => {
						console.log('Auto-play after source change failed:', e);
					});
				}
			}

		}
	}
}
