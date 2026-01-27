export function initNavBar() {
	const playerLabel = document.querySelector('.player-label');
	const video = document.getElementById('thePlayer');

	if (playerLabel && video) {
		playerLabel.addEventListener('click', () => {
			if (video.muted) {
				unmuteAndPlay(video, playerLabel);
			} else {
				video.muted = true;
				playerLabel.classList.remove('playing');
			}
		});
	}
}

export function unmuteAndPlay(video, playerLabel) {
	if (!video || !playerLabel) {
		video = document.getElementById('thePlayer');
		playerLabel = document.querySelector('.player-label');
	}

	if (video) {
		video.muted = false;
		video.play().catch(e => console.log('Playback error:', e));
		if (playerLabel) playerLabel.classList.add('playing');
	}
}
