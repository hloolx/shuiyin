const CACHE_NAME = 'shuiyin-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/favicon.ico',
  '/images/logo108.png',
  '/images/logo192.png',
  '/images/logo512.png',
];

// 安装：缓存静态资源
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// 激活：清理旧缓存
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// 拦截请求
self.addEventListener('fetch', (event) => {
  // 只缓存 GET 请求
  if (event.request.method !== 'GET') {
    return;
  }

  // 跳过非 same-origin 请求
  if (!event.request.url.startsWith(self.location.origin)) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // 缓存命中，返回缓存
      if (response) {
        return response;
      }

      // 否则发起网络请求
      return fetch(event.request)
        .then((networkResponse) => {
          // 只缓存成功的响应
          if (!networkResponse || networkResponse.status !== 200) {
            return networkResponse;
          }

          // 克隆响应（响应流只能读取一次）
          const responseToCache = networkResponse.clone();

          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseToCache);
          });

          return networkResponse;
        })
        .catch(() => {
          // 网络失败，尝试返回离线页面
          if (event.request.mode === 'navigate') {
            return caches.match('/index.html');
          }
          return null;
        });
    })
  );
});
