import gsap from 'gsap';

export function initDialerScroll() {
	const dialer = document.querySelector('.dialer');
	if (!dialer) return;

	let isDragging = false;
	let startX = 0;
	let scrollLeft = 0;
	let velocity = 0;
	let lastX = 0;
	let lastTime = Date.now();
	let animationFrame = null;
	let snapTimeout = null;

	const findCenterItem = () => {
		const items = dialer.querySelectorAll('li');
		const dialerCenter = dialer.offsetLeft + dialer.offsetWidth / 2;

		let closestItem = null;
		let closestDistance = Infinity;

		items.forEach(item => {
			const itemCenter = item.offsetLeft - dialer.scrollLeft + item.offsetWidth / 2;
			const distance = Math.abs(dialerCenter - itemCenter);

			if (distance < closestDistance) {
				closestDistance = distance;
				closestItem = item;
			}
		});

		return closestItem;
	};

	const setActiveItem = (item) => {
		dialer.querySelectorAll('li').forEach(li => li.classList.remove('active'));
		item.classList.add('active');
	};

	const snapToCenter = () => {
		const centerItem = findCenterItem();
		if (!centerItem) return;

		const dialerCenter = dialer.offsetWidth / 2;
		const itemCenter = centerItem.offsetLeft + centerItem.offsetWidth / 2;
		const targetScroll = itemCenter - dialerCenter;

		gsap.to(dialer, {
			scrollLeft: targetScroll,
			duration: 0.5,
			ease: 'power2.out',
			onComplete: () => {
				setActiveItem(centerItem);
			}
		});
	};

	const scheduleSnap = () => {
		if (snapTimeout) {
			clearTimeout(snapTimeout);
		}
		snapTimeout = setTimeout(() => {
			snapToCenter();
		}, 50);
	};

	const handleMouseDown = (e) => {
		isDragging = true;
		startX = e.pageX - dialer.offsetLeft;
		scrollLeft = dialer.scrollLeft;
		lastX = e.pageX;
		lastTime = Date.now();
		velocity = 0;
		dialer.querySelectorAll('li').forEach(li => li.classList.remove('active'));

		if (animationFrame) {
			cancelAnimationFrame(animationFrame);
		}
		if (snapTimeout) {
			clearTimeout(snapTimeout);
		}
	};

	const handleMouseMove = (e) => {
		if (!isDragging) return;
		e.preventDefault();
		dialer.querySelectorAll('li').forEach(li => li.classList.remove('active'));

		const x = e.pageX - dialer.offsetLeft;
		const walk = (x - startX) * 2;

		const currentTime = Date.now();
		const timeDelta = currentTime - lastTime;
		if (timeDelta > 0) {
			velocity = (e.pageX - lastX) / timeDelta;
		}

		lastX = e.pageX;
		lastTime = currentTime;

		dialer.scrollLeft = scrollLeft - walk;
	};

	const handleMouseUp = () => {
		if (!isDragging) return;
		isDragging = false;

		const applyMomentum = () => {
			if (Math.abs(velocity) > 0.05) {
				dialer.scrollLeft -= velocity * 20;
				velocity *= 0.95;
				animationFrame = requestAnimationFrame(applyMomentum);
			} else {
				snapToCenter();
			}
		};

		if (Math.abs(velocity) > 0.25) {
			applyMomentum();
		} else {
			snapToCenter();
		}
	};

	const handleMouseLeave = () => {
		if (isDragging) {
			handleMouseUp();
		}
	};

	const handleScroll = () => {
		if (!isDragging && Math.abs(velocity) < 0.01) {
			scheduleSnap();
		}
	};

	dialer.style.userSelect = 'none';

	dialer.addEventListener('mousedown', handleMouseDown);
	dialer.addEventListener('mousemove', handleMouseMove);
	dialer.addEventListener('mouseup', handleMouseUp);
	dialer.addEventListener('mouseleave', handleMouseLeave);
	dialer.addEventListener('scroll', handleScroll);
	dialer.addEventListener('dragstart', (e) => e.preventDefault());

	const lastItem = dialer.querySelector('li:last-child');
	if (lastItem) {
		const dialerCenter = dialer.offsetWidth / 2;
		const itemCenter = lastItem.offsetLeft + lastItem.offsetWidth / 2;
		const targetScroll = itemCenter - dialerCenter;

		dialer.scrollLeft = targetScroll;
		setActiveItem(lastItem);
	}
}
