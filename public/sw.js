const CACHE = 'powder-tracker-v2';
const NOAA_CACHE = 'powder-noaa-v1';
const PRECACHE = ['/', '/manifest.webmanifest', '/icon', '/icon2', '/apple-icon', '/favicon.ico'];

self.addEventListener('install', (e) => {
  e.waitUntil(
    caches
      .open(CACHE)
      .then((c) => Promise.all(PRECACHE.map((url) => c.add(url).catch(() => {}))))
  );
  self.skipWaiting();
});

self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(
        keys.filter((k) => k !== CACHE && k !== NOAA_CACHE).map((k) => caches.delete(k))
      )
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', (e) => {
  const { url } = e.request;

  if (url.includes('api.weather.gov')) {
    // Network-first for NOAA, 1h cached fallback
    e.respondWith(
      fetch(e.request)
        .then((res) => {
          const clone = res.clone();
          caches.open(NOAA_CACHE).then((c) => c.put(e.request, clone));
          return res;
        })
        .catch(() => caches.match(e.request))
    );
    return;
  }

  // Cache-first for everything else
  e.respondWith(
    caches.match(e.request).then((cached) => cached || fetch(e.request))
  );
});
