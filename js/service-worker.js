// js/service-worker.js

const CACHE_NAME = 'ops-solutions-cache-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/css/global.css',
  '/css/small-screens.css',
  '/js/main.js',
  '/assets/images/hero-image.jpg',
  '/assets/favicon.ico',
  '/manifest.json'
  // Add other important assets here, especially those needed for offline fallback
];

// Install event: Open cache and add core assets
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching core assets');
        return cache.addAll(urlsToCache);
      })
      .then(() => {
        console.log('Service Worker: Installation complete');
        return self.skipWaiting(); // Force activation of new service worker
      })
      .catch(error => {
        console.error('Service Worker: Installation failed:', error);
      })
  );
});

// Activate event: Clean up old caches
self.addEventListener('activate', event => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    }).then(() => {
      console.log('Service Worker: Activation complete, now controlling client.');
      return self.clients.claim(); // Take control of uncontrolled clients
    })
  );
});

// Fetch event: Serve cached content when offline, or fetch from network
self.addEventListener('fetch', event => {
  console.log('Service Worker: Fetching', event.request.url);
  // For navigation requests, try network first, then cache, then offline page
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .catch(() => {
          return caches.match(event.request)
            .then(response => {
              return response || caches.match('/index.html'); // Fallback to home or an offline page
            });
        })
    );
    return;
  }

  // For other requests (CSS, JS, images), use cache-first strategy
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        // Not in cache - fetch from network, cache it, then return
        return fetch(event.request).then(
          networkResponse => {
            // Check if we received a valid response
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type !== 'basic') {
              return networkResponse;
            }

            // IMPORTANT: Clone the response. A response is a stream
            // and because we want the browser to consume the response
            // as well as the cache consuming the response, we need
            // to clone it so we have two streams.
            const responseToCache = networkResponse.clone();

            caches.open(CACHE_NAME)
              .then(cache => {
                cache.put(event.request, responseToCache);
              });

            return networkResponse;
          }
        ).catch(error => {
          console.error('Service Worker: Fetch failed for non-navigation request:', error);
          // Optionally, provide a fallback for images or other assets here
        });
      })
  );
});

// Message event (optional): Listen for messages from clients
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
