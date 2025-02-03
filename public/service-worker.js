const CACHE_NAME = "offline-v1";
const OFFLINE_URL = "/offline";

self.addEventListener("install", (event) => {
    event.waitUntil(caches.open(CACHE_NAME).then((cache) => cache.addAll([OFFLINE_URL, "/static/js/main.chunk.js", "/static/css/main.chunk.css", "/index.html"])));
});

self.addEventListener("fetch", (event) => {
    event.respondWith(fetch(event.request).catch(() => caches.match(OFLINE_URL)));
});
