import gsap from 'gsap';
import { getEra } from './getEra.js';

let currentEra = null;
let musicData = null;
let fetchPromise = null;

let activePlayerId = 1;
let isGlobalMuted = true;
let userHasMuted = false;
const maxVolume = 0.8;
const fadeDuration = 1;

const getPlayer1 = () => document.getElementById('player1');
const getPlayer2 = () => document.getElementById('player2');
const getActivePlayer = () => activePlayerId === 1 ? getPlayer1() : getPlayer2();
const getInactivePlayer = () => activePlayerId === 1 ? getPlayer2() : getPlayer1();

export function canPlayAudio() {
	return !isGlobalMuted;
}

export function setGlobalUnmute() {
	if (!userHasMuted) {
		isGlobalMuted = false;
		const active = getActivePlayer();
		const label = document.querySelector('.player-label');
		label.classList.add('playing');

		if (active && active.src && active.src !== window.location.href) {
			active.muted = false;
			if (active.paused) {
				active.play().catch(e => console.log('Play failed', e));
			}

			gsap.to(active, { volume: maxVolume, duration: 0.5 });
		}
	}
}

export function toggleGlobalMute() {
	const active = getActivePlayer();
	const label = document.querySelector('.player-label');

	isGlobalMuted = !isGlobalMuted;
	userHasMuted = isGlobalMuted;

	if (isGlobalMuted) {
		if (getPlayer1()) getPlayer1().muted = true;
		if (getPlayer2()) getPlayer2().muted = true;
		if (label) label.classList.remove('playing');
	} else {
		label.classList.add('playing');
		active.muted = false;
		if (active.src && active.src !== window.location.href && active.paused) {
			active.play().catch(e => console.log('Play failed', e));
		}
		gsap.to(active, { volume: maxVolume, duration: 0.5 });
	}
	return !isGlobalMuted;
}

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
				fetchPromise = null;
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
		currentEra = eraId;

		const activePlayer = getActivePlayer();
		const inactivePlayer = getInactivePlayer();

		if (eraId === 'landing-page') {
			if (activePlayer) {
				gsap.to(activePlayer, {
					volume: 0,
					duration: fadeDuration,
					onComplete: () => {
						activePlayer.pause();
						activePlayer.src = '';
					}
				});
			}
			return;
		}

		const eraData = data[eraId];
		if (eraData && eraData.length > 0) {
			const randomIndex = Math.floor(Math.random() * eraData.length);
			const song = eraData[randomIndex].song;


			if (inactivePlayer) {
				inactivePlayer.src = song.url;
				inactivePlayer.volume = 0;
				inactivePlayer.muted = isGlobalMuted;
				inactivePlayer.load();

				const playPromise = inactivePlayer.play();
				if (playPromise !== undefined) {
					playPromise.catch(e => {
						console.log('Autoplay blocked (expected if unmuted interaction missing)', e);
					});
				}



				if (activePlayer) {
					gsap.to(activePlayer, { volume: 0, duration: fadeDuration });
				}


				gsap.to(inactivePlayer, {
					volume: maxVolume,
					duration: fadeDuration,
					onComplete: () => {

						if (activePlayer) {
							activePlayer.pause();
							activePlayer.src = '';
						}
					}
				});


				activePlayerId = activePlayerId === 1 ? 2 : 1;
			}
		}
	}
}
