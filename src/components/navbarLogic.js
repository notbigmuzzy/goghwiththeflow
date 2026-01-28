import { toggleGlobalMute, setGlobalUnmute } from './musicPlayer.js';

export function initNavBar() {
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
