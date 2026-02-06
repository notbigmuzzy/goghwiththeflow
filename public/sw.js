const CACHE_NAME = 'goghwiththeflow-v1';
const urlsToCache = [
	'./',
	'./index.html',
	'./icon.png'
];
self.addEventListener('install', (event) => {
	event.waitUntil(
		caches.open(CACHE_NAME)
			.then((cache) => {
				console.log('Opened cache');
				return cache.addAll(urlsToCache);
			})
	);
	self.skipWaiting();
});
self.addEventListener('fetch', (event) => {
	event.respondWith(
		caches.match(event.request)
			.then((response) => {
				if (response) {
					return response;
				}

				return fetch(event.request).then((response) => {
					if (!response || response.status !== 200 || response.type !== 'basic') {
						return response;
					}

					const responseToCache = response.clone();

					if (event.request.url.includes('.json') ||
						event.request.url.includes('.jpg') ||
						event.request.url.includes('.png') ||
						event.request.url.includes('.webp')) {
						caches.open(CACHE_NAME)
							.then((cache) => {
								cache.put(event.request, responseToCache);
							});
					}

					return response;
				});
			})
	);
});
self.addEventListener('activate', (event) => {
	const cacheWhitelist = [CACHE_NAME];
	event.waitUntil(
		caches.keys().then((cacheNames) => {
			return Promise.all(
				cacheNames.map((cacheName) => {
					if (cacheWhitelist.indexOf(cacheName) === -1) {
						return caches.delete(cacheName);
					}
				})
			);
		})
	);
	self.clients.claim();
});
