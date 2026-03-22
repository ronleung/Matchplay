// Match Play Service Worker — push notifications & offline support
const CACHE_NAME = 'matchplay-v1';

// Install — cache core assets
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache =>
      cache.addAll([
        '/index.html',
        '/icons/icon.svg',
        '/manifest.json'
      ]).catch(() => {})
    )
  );
  self.skipWaiting();
});

// Activate — clean old caches
self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch — network first, cache fallback
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(
    fetch(e.request)
      .then(res => {
        const clone = res.clone();
        caches.open(CACHE_NAME).then(cache => cache.put(e.request, clone)).catch(() => {});
        return res;
      })
      .catch(() => caches.match(e.request))
  );
});

// Push notification received (from server push)
self.addEventListener('push', e => {
  let data = { title: 'Match Play', body: 'You have a new notification!' };
  if (e.data) {
    try { data = e.data.json(); } catch (_) { data.body = e.data.text(); }
  }
  e.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: '/icons/icon.svg',
      badge: '/icons/icon.svg',
      tag: data.tag || 'matchplay',
      vibrate: [200, 100, 200],
      data: data
    })
  );
});

// Notification click — open or focus the app
self.addEventListener('notificationclick', e => {
  e.notification.close();
  const tag = e.notification.tag || '';

  e.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then(clients => {
      // If app is already open, focus it and send the tag
      for (const client of clients) {
        if (client.visibilityState === 'visible' || client.url.includes('index.html')) {
          client.postMessage({ type: 'notification-click', tag });
          return client.focus();
        }
      }
      // Otherwise open the app
      return self.clients.openWindow('/index.html');
    })
  );
});
