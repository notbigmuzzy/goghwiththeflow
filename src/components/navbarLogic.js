import { toggleGlobalMute, setGlobalUnmute, initMusicListeners } from './musicPlayer.js';

export function initNavBar() {
	initMusicListeners();
	const playerLabel = document.querySelector('.player-label');

	if (playerLabel) {
		playerLabel.addEventListener('click', () => {
			toggleGlobalMute();
		});
	}
}

export function unmuteAndPlay() {
	setGlobalUnmute();
}
