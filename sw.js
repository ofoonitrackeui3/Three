const CACHE_NAME = 'afuni-merged-s2s3-v4';
const PRECACHE = ['./index.html','./manifest.webmanifest','./icon-192.png','./icon-512.png'];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE_NAME).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  const url = new URL(e.request.url);
  if (url.origin !== self.location.origin) return;
  if (e.request.mode === 'navigate') {
    e.respondWith(fetch(e.request).then(r => { if(r.ok){const c=r.clone();caches.open(CACHE_NAME).then(cache=>cache.put('./index.html',c));} return r; }).catch(() => caches.match('./index.html')));
    return;
  }
  e.respondWith(caches.match(e.request).then(c => c || fetch(e.request).then(r => { if(r.ok&&r.type==='basic'){const copy=r.clone();caches.open(CACHE_NAME).then(cache=>cache.put(e.request,copy));} return r; })));
});
