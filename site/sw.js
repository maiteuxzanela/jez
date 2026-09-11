// ==========================================================================
// Service Worker — JËZ Collection PWA
// Arquitetura: Alex (CTO) | Performance: Noa | Cibersegurança: Morgan
// ==========================================================================

const CACHE_NAME = 'jez-boutique-cache-v2.0.0';

// Recursos essenciais para funcionamento offline e carregamento instantâneo
const STATIC_ASSETS = [
  './',
  './index.html',
  './atelie.html',
  './styles.css',
  './admin.css',
  './app.js',
  './admin.js',
  './firebase-config.js',
  './firebase-service.js',
  './manifest.json',
  './manifest-atelie.json',
  './favicon.svg',
  './favicon.png',
  './assets/logo-official.png',
  './assets/logo-share.png',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/icon-maskable.png',
  './assets/products/bolsa_punk.webp',
  './assets/products/bolsa_punk_detail.webp',
  './assets/products/tote_cherry.webp',
  './assets/products/tote_cherry_detail.webp',
  './assets/products/shoulder_coracao.webp',
  './assets/products/bolsa_xadrez.webp',
  './assets/products/blusa_teia.webp',
  './assets/products/top_bandana.webp',
  './assets/products/cardiga_manteiga.webp',
  './assets/products/chaveiro_baphomet.webp',
  './assets/products/chaveiro_baphomet_detail.webp',
  './assets/products/porta_airpods.webp'
];

// Instalação do Service Worker: pré-carrega os recursos da boutique no cache
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

// Ativação do Service Worker: limpa versões antigas do cache e assume controle
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Interceptação de requisições
self.addEventListener('fetch', (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // Não intercepta requisições não-GET
  if (req.method !== 'GET') return;

  // Deixa o SDK nativo do Firebase gerenciar requisições do Firestore e Auth
  if (
    url.hostname.includes('firebaseio.com') ||
    url.hostname.includes('googleapis.com') ||
    url.hostname.includes('firebasestorage.app')
  ) {
    return;
  }

  // 1. Navegação de páginas HTML: Network-First com Fallback gracioso para Cache
  if (req.mode === 'navigate' || req.headers.get('accept')?.includes('text/html')) {
    event.respondWith(
      fetch(req)
        .then((networkRes) => {
          if (networkRes && networkRes.status === 200) {
            const resClone = networkRes.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, resClone));
          }
          return networkRes;
        })
        .catch(async () => {
          const cached = await caches.match(req);
          if (cached) return cached;
          // Fallback para a página inicial se for navegação
          return caches.match('./index.html');
        })
    );
    return;
  }

  // 2. Recursos estáticos locais (CSS, JS, Imagens, Fontes): Cache-First com atualização em background (Stale-While-Revalidate)
  event.respondWith(
    caches.match(req, { ignoreSearch: true }).then((cachedResponse) => {
      const fetchPromise = fetch(req)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(req, responseClone));
          }
          return networkResponse;
        })
        .catch(() => {
          // Falha de rede em segundo plano: silenciosa se já houver cache
        });

      // Retorna imediatamente o cache se disponível, senão aguarda a rede
      return cachedResponse || fetchPromise;
    })
  );
});
