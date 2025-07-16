import { NextResponse } from "next/server";

export async function GET() {
  const serviceWorkerCode = `
// JSON Formatter Service Worker
const CACHE_NAME = 'json-formatter-v2';
const STATIC_CACHE_URLS = [
  '/',
  '/en',
  '/es',
  '/favicon.ico',
  '/manifest.json',
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  console.log('Service Worker installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Caching static assets');
        return cache.addAll(STATIC_CACHE_URLS);
      })
      .then(() => {
        console.log('Static assets cached successfully');
        return self.skipWaiting();
      })
      .catch((error) => {
        console.error('Failed to cache static assets:', error);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  console.log('Service Worker activating...');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              console.log('Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        console.log('Service Worker activated');
        return self.clients.claim();
      })
  );
});

// Fetch event - serve from cache when offline
self.addEventListener('fetch', (event) => {
  // Only handle GET requests
  if (event.request.method !== 'GET') {
    return;
  }

  // Skip non-HTTP requests
  if (!event.request.url.startsWith('http')) {
    return;
  }

  // Skip Chrome extension requests
  if (event.request.url.startsWith('chrome-extension://')) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        // If we have a cached response, return it
        if (cachedResponse) {
          console.log('Serving from cache:', event.request.url);
          return cachedResponse;
        }

        // Otherwise, try to fetch from network
        return fetch(event.request)
          .then((response) => {
            // If it's a successful response, cache it
            if (response.status === 200) {
              const responseToCache = response.clone();
              
              // Cache different types of resources
              if (event.request.url.includes('/_next/') || 
                  event.request.url.includes('.css') ||
                  event.request.url.includes('.js') ||
                  event.request.url.includes('.json') ||
                  event.request.destination === 'document') {
                
                caches.open(CACHE_NAME)
                  .then((cache) => {
                    console.log('Caching resource:', event.request.url);
                    cache.put(event.request, responseToCache);
                  });
              }
            }
            return response;
          })
          .catch(() => {
            // If network fails, try to serve a fallback
            if (event.request.destination === 'document') {
              return caches.match('/en') || caches.match('/');
            }
            
            // For CSS and JS files, try to find them in cache
            if (event.request.url.includes('.css') || event.request.url.includes('.js')) {
              return caches.match(event.request);
            }
            
            throw new Error('Network unavailable and no cache available');
          });
      })
  );
});

// Message event - handle messages from the main thread
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
`;

  return new NextResponse(serviceWorkerCode, {
    status: 200,
    headers: {
      "Content-Type": "application/javascript",
      "Cache-Control": "no-cache, no-store, must-revalidate",
      "Service-Worker-Allowed": "/",
    },
  });
}
