const CACHE_NAME = 'ultimate-timer-v1';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './data.js',
  './manifest.json',
  './sounds/ding.ogg',
  './sounds/ring.ogg',
  './fonts/Inter-Regular.ttf',
  './fonts/Inter-Medium.ttf',
  './fonts/Inter-SemiBold.ttf',
  './fonts/Inter-ExtraBold.ttf',
  './icons/icon_192.png',
  './icons/icon_512.png'
];

// Встановлення Service Worker та кешування файлів
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('Кешування файлів...');
      return cache.addAll(ASSETS_TO_CACHE);
    })
  );
});

// Активація та видалення старого кешу (якщо версія зміниться)
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Видалення старого кешу:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
});

// Перехоплення мережевих запитів
// Якщо файл є в кеші — віддаємо з кешу (це дозволяє працювати без інтернету!)
// Якщо немає — завантажуємо з інтернету
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
