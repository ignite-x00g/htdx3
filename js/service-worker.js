// js/service-worker.js

const CACHE_NAME = 'ops-solutions-cache-v2'; // Incremented cache version
const urlsToCache = [
  // Core index.html and its immediate assets
  '/',
  '/index.html',
  '/css/global.css',
  '/css/small-screens.css',
  '/js/main.js',
  '/assets/images/hero-image.jpg',
  '/assets/images/logo.png', // Added logo
  '/assets/favicon.ico',
  '/manifest.json',

  // Contact Us modal assets
  '/contactus/script.js',
  // '/contactus/style.css', // This file is empty and planned for deletion

  // Chatbot assets
  '/js/chatbot.js',
  '/chatbot/chatbot.js',
  '/chatbot/chatbot.css',
  '/chatbot/chatbot.html',

  // Join Us page (separate) assets
  '/joinus/', // Or '/joinus/index.html'
  '/joinus/index.html',
  '/joinus/script.js',
  '/joinus/style.css',

  // Font Awesome (consider caching if network is unreliable, but it's a CDN link)
  // 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.2/css/all.min.css',
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
