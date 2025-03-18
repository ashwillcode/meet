const CACHE_NAME = 'meet-app-v1';
const DYNAMIC_CACHE_NAME = 'meet-app-dynamic-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/apple-touch-icon.png',
  '/pwa-192x192.png',
  '/pwa-512x512.png',
  '/masked-icon.svg'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME && name !== DYNAMIC_CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
});

// Helper function to determine if a request is for the API
const isApiRequest = (request) => {
  return request.url.includes('/api/') || request.url.endsWith('getEvents');
};

// Helper function to determine if a request is for static assets
const isStaticAsset = (request) => {
  const url = new URL(request.url);
  return STATIC_ASSETS.includes(url.pathname);
};

// Fetch event handler with different strategies for different types of requests
self.addEventListener('fetch', (event) => {
  const request = event.request;

  // API requests: Stale-while-revalidate strategy
  if (isApiRequest(request)) {
    event.respondWith(
      caches.open(DYNAMIC_CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request)
            .then((networkResponse) => {
              if (networkResponse.ok) {
                cache.put(request, networkResponse.clone());
              }
              return networkResponse;
            })
            .catch(() => {
              console.log('Failed to fetch API request, returning cached response');
              return null;
            });

          // Return cached response immediately if available, otherwise wait for network
          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // Static assets: Cache-first strategy
  if (isStaticAsset(request)) {
    event.respondWith(
      caches.match(request)
        .then((cachedResponse) => {
          return cachedResponse || fetch(request)
            .then((networkResponse) => {
              const responseToCache = networkResponse.clone();
              caches.open(CACHE_NAME).then((cache) => {
                cache.put(request, responseToCache);
              });
              return networkResponse;
            });
        })
    );
    return;
  }

  // All other requests: Network-first strategy with cache fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response.ok) {
          const responseToCache = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) {
            return cachedResponse;
          }
          
          if (request.mode === 'navigate') {
            return caches.match('/');
          }
          
          return new Response('You are offline', {
            status: 503,
            headers: { 'Content-Type': 'text/plain' },
          });
        });
      })
  );
}); 