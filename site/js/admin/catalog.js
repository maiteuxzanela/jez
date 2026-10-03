/**
 * ==========================================================================
 * JEZ Collection — Módulo de Catálogo e Gestão de Peças do Ateliê (JEZ-030)
 * Arquitetura: Alex (CTO) | Merchant & Acervo: Cris
 * ==========================================================================
 */

export const STORAGE_CATALOG_KEY = 'jez_catalog';
export const STORAGE_CUSTOM_PRODUCTS_KEY = 'jez_custom_products';

// Catálogo Padrão Completo da Loja
export const defaultInitialCatalog = [
  {
    id: 'bolsa-punk',
    name: 'Bolsa Punk Slouchy com Correntes',
    category: 'bolsas',
    categoryLabel: 'Bolsas & Bags',
    price: 169.90,
    image: 'assets/products/bolsa_punk.jpg',
    images: ['assets/products/bolsa_punk.jpg', 'assets/products/bolsa_punk_detail.jpg'],
    status: 'order',
    isReady: false,
    leadTimeDays: 7,
    dimensions: '32cm (L) × 24cm (A) × 8cm (P)',
    materials: 'Fio de algodão preto e off-white com correntes de metal antioxidante',
    description: 'Bolsa autoral slouchy em crochê com pesponto contrastante e correntes metálicas removíveis. Visual grunge sofisticado.'
  },
  {
    id: 'tote-cherry',
    name: 'Tote Bag Cherry com Laço',
    category: 'bolsas',
    categoryLabel: 'Bolsas & Bags',
    price: 149.90,
    image: 'assets/products/tote_cherry.jpg',
    images: ['assets/products/tote_cherry.jpg', 'assets/products/tote_cherry_detail.jpg'],
    status: 'ready',
    isReady: true,
    stockQty: 3,
    leadTimeDays: 0,
    dimensions: '30cm (L) × 26cm (A) × 6cm (P)',
    materials: 'Fio 100% algodão premium cereja com bordado manual em relevo',
    description: 'Tote charmosa com aplicação de cerejas em relevo artesanal e laço delicado. Perfeita para carregar livros, planner e celular.'
  },
  {
    id: 'shoulder-coracao',
    name: 'Shoulder Bag Coração Granny Square',
    category: 'bolsas',
    categoryLabel: 'Bolsas & Bags',
    price: 139.90,
    image: 'assets/products/shoulder_coracao.jpg',
    status: 'ready',
    isReady: true,
    stockQty: 2,
    leadTimeDays: 0,
    dimensions: '20cm (L) × 18cm (A) × 5cm (P)',
    materials: 'Fios de algodão cru e terracota, alça de corrente metálica vintage',
    description: 'Mini bolsa tiracolo estruturada com motivo clássico de coração vazado e bordas onduladas delicadas.'
  },
  {
    id: 'bolsa-xadrez',
    name: 'Bolsa Xadrez Checkerboard',
    category: 'bolsas',
    categoryLabel: 'Bolsas & Bags',
    price: 159.90,
    image: 'assets/products/bolsa_xadrez.jpg',
    status: 'order',
    isReady: false,
    leadTimeDays: 5,
    dimensions: '28cm (L) × 22cm (A) × 7cm (P)',
    materials: 'Fio encorpado em padrão xadrez bicolor preto e creme',
    description: 'Padronagem quadriculada moderna com textura firme e alça reforçada tecida à mão.'
  },
  {
    id: 'blusa-teia',
    name: 'Blusa Teia de Aranha Cropped',
    category: 'vestuario',
    categoryLabel: 'Vestuário Autoral',
    price: 189.90,
    image: 'assets/products/blusa_teia.jpg',
    images: ['assets/products/blusa_teia.jpg', 'assets/products/blusa_teia_loop.mp4'],
    status: 'order',
    isReady: false,
    leadTimeDays: 8,
    dimensions: 'Tamanho único ajustável (Veste P ao G)',
    materials: 'Fio de viscose e algodão preto com toque acetinado',
    description: 'Peça icônica com trama aberta imitando teia de aranha. Manga longa sino e caimento fluido rebelde.'
  },
  {
    id: 'top-bandana',
    name: 'Top Amarração Frontal + Bandana',
    category: 'vestuario',
    categoryLabel: 'Vestuário Autoral',
    price: 129.90,
    image: 'assets/products/top_bandana.jpg',
    status: 'ready',
    isReady: true,
    stockQty: 2,
    leadTimeDays: 0,
    dimensions: 'Tamanho único regulável por cordões (Busto 38 a 44)',
    materials: 'Fio de algodão mercerizado coral e pêssego',
    description: 'Conjunto boho-chic composto por top triangular com amarração ajustável nas costas e bandana combinando.'
  },
  {
    id: 'cardiga-manteiga',
    name: 'Cardigã Cropped Shrug Manteiga',
    category: 'vestuario',
    categoryLabel: 'Vestuário Autoral',
    price: 179.90,
    image: 'assets/products/cardiga_manteiga.jpg',
    status: 'order',
    isReady: false,
    leadTimeDays: 10,
    dimensions: 'Modelagem ampla oversized (Comprimento 38cm, Mangas 58cm)',
    materials: 'Fio de lã mista ultra-macia amarelo manteiga',
    description: 'Bolero tipo shrug aconchegante com mangas bufantes e punhos canelados tecidos com pontos fofos.'
  },
  {
    id: 'chaveiro-baphomet',
    name: 'Chaveiro Amigurumi Baphomet Cute',
    category: 'acessorios',
    categoryLabel: 'Acessórios & Miudezas',
    price: 42.00,
    image: 'assets/products/chaveiro_baphomet.jpg',
    images: ['assets/products/chaveiro_baphomet.jpg', 'assets/products/chaveiro_baphomet_detail.jpg'],
    status: 'ready',
    isReady: true,
    stockQty: 4,
    leadTimeDays: 0,
    dimensions: '8cm de altura × 6cm de envergadura',
    materials: 'Fio de algodão preto e rosa, enchimento antialérgico, argola metálica',
    description: 'Amigurumi fofinho estilo goth-pastel com olhinhos brilhantes de segurança e detalhes bordados.'
  },
  {
    id: 'porta-airpods',
    name: 'Porta-AirPods / Fones em Crochê',
    category: 'acessorios',
    categoryLabel: 'Acessórios & Miudezas',
    price: 38.00,
    image: 'assets/products/porta_airpods.jpg',
    status: 'ready',
    isReady: true,
    stockQty: 5,
    leadTimeDays: 0,
    dimensions: '6.5cm (L) × 5.5cm (A) × 3cm (P)',
    materials: 'Fio de algodão azul e amarelo, botão vintage e mosquetão metálico',
    description: 'Case protetora fofa em crochê para fones de ouvido sem fio. Protege o estojo de arranhões e vem com gancho para pendurar na bolsa ou no cinto.'
  }
];

export const defaultCatalogOrder = [
  'bolsa-punk',
  'tote-cherry',
  'shoulder-coracao',
  'bolsa-xadrez',
  'blusa-teia',
  'top-bandana',
  'cardiga-manteiga',
  'chaveiro-baphomet',
  'porta-airpods'
];

/**
 * Ordena catálogo pela ordem curada da marca JËZ
 * @param {Array} list
 * @returns {Array}
 */
export function sortCatalogByCuratedOrder(list) {
  if (!Array.isArray(list)) return [];
  return [...list].sort((a, b) => {
    const idxA = defaultCatalogOrder.indexOf(a.id);
    const idxB = defaultCatalogOrder.indexOf(b.id);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });
}

/**
 * Detecta se uma mídia ou URL corresponde a um formato de vídeo
 * @param {string | object} media
 * @returns {boolean}
 */
export function isVideoMedia(media) {
  if (!media) return false;
  if (typeof media === 'object') {
    if (media.type === 'video' || media.isVideo === true) return true;
    if (typeof media.url === 'string') return isVideoMedia(media.url);
    return false;
  }
  if (typeof media !== 'string') return false;
  const clean = media.trim().toLowerCase();
  if (clean.startsWith('data:video/')) return true;
  if (clean.startsWith('blob:video') || clean.includes('mediatype=video')) return true;
  return /\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i.test(clean);
}

/**
 * Cria ou normaliza um objeto de mídia de vídeo com poster associado (JEZ-038).
 * @param {string | object} url
 * @param {string} poster
 * @returns {{ url: string, poster: string, type: 'video', isVideo: true }}
 */
export function createVideoMediaItem(url, poster = '') {
  let finalUrl = '';
  let finalPoster = poster || '';
  if (typeof url === 'object' && url) {
    finalUrl = url.url || '';
    if (!finalPoster && url.poster) {
      finalPoster = url.poster;
    }
  } else if (typeof url === 'string') {
    finalUrl = url;
  }
  return {
    url: finalUrl,
    poster: finalPoster,
    type: 'video',
    isVideo: true
  };
}

/**
 * Extrai o primeiro frame de um vídeo usando um canvas off-screen proporcional (1:1),
 * gerando um dataURL de poster compatível com a moldura quadrada do Ateliê e o blur da vitrine.
 * @param {string} videoSrc - URL ou dataURL do vídeo
 * @param {number} targetSize - Dimensão quadrada do canvas (padrão: 540)
 * @returns {Promise<string>} dataURL JPEG do frame extraído (ou string vazia em caso de falha)
 */
export function extractVideoPoster(videoSrc, targetSize = 540) {
  return new Promise((resolve) => {
    if (!videoSrc || typeof videoSrc !== 'string') {
      resolve('');
      return;
    }

    if (typeof document === 'undefined' || typeof document.createElement !== 'function') {
      resolve('');
      return;
    }

    let finished = false;
    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.muted = true;
    video.playsInline = true;
    video.preload = 'auto';

    const cleanUp = () => {
      try {
        video.pause();
        video.removeAttribute('src');
        video.load();
      } catch {
        // Descarte silencioso do elemento de vídeo
      }
    };

    const done = (result = '') => {
      if (finished) return;
      finished = true;
      cleanUp();
      resolve(result);
    };

    const timeoutId = setTimeout(() => {
      done('');
    }, 4000);

    const capture = () => {
      try {
        const vw = video.videoWidth || targetSize;
        const vh = video.videoHeight || targetSize;
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          clearTimeout(timeoutId);
          done('');
          return;
        }

        // Recorte proporcional 1:1 estilo cover centralizado
        const side = Math.min(vw, vh);
        const sx = Math.max(0, (vw - side) / 2);
        const sy = Math.max(0, (vh - side) / 2);

        // Fundo aubergine da paleta da marca
        ctx.fillStyle = '#23192d';
        ctx.fillRect(0, 0, targetSize, targetSize);
        ctx.drawImage(video, sx, sy, side, side, 0, 0, targetSize, targetSize);

        const posterDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        clearTimeout(timeoutId);
        done(posterDataUrl);
      } catch {
        clearTimeout(timeoutId);
        done('');
      }
    };

    video.addEventListener('seeked', () => {
      capture();
    }, { once: true });

    video.addEventListener('loadeddata', () => {
      try {
        if (typeof video.currentTime === 'number' && video.duration && video.duration > 0.05) {
          video.currentTime = 0.05;
        } else {
          capture();
        }
      } catch {
        capture();
      }
    }, { once: true });

    video.addEventListener('error', () => {
      clearTimeout(timeoutId);
      done('');
    }, { once: true });

    try {
      video.src = videoSrc;
      video.load();
    } catch {
      clearTimeout(timeoutId);
      done('');
    }
  });
}

/**
 * Preserva mídias de fábrica de produtos conhecidos (como blusa-teia mantendo foto e vídeo)
 * e assegura que a primeira mídia (índice 0) seja SEMPRE a foto estática principal.
 * @param {object} product
 * @param {Array} defaultList
 * @returns {object}
 */
export function preserveFactoryMedia(product, defaultList = defaultInitialCatalog) {
  if (!product || typeof product !== 'object') return product;
  const cured = { ...product };
  const factoryItem = Array.isArray(defaultList) ? defaultList.find(d => d && d.id === cured.id) : null;

  if (cured.id === 'blusa-teia') {
    const factoryPhoto = (factoryItem && factoryItem.image) ? factoryItem.image : 'assets/products/blusa_teia.jpg';
    const factoryVideo = 'assets/products/blusa_teia_loop.mp4';
    let images = Array.isArray(cured.images) ? [...cured.images] : [];
    if (images.length === 0) {
      images = [factoryPhoto, factoryVideo];
    } else {
      const hasLoop = images.some(img => (typeof img === 'string' && img.includes('blusa_teia_loop.mp4')) || (typeof img === 'object' && img && img.url && img.url.includes('blusa_teia_loop.mp4')));
      if (!hasLoop) {
        images.push(factoryVideo);
      }
      const hasPhoto = images.some(img => (typeof img === 'string' && img.includes('blusa_teia.jpg')) || (typeof img === 'object' && img && img.url && img.url.includes('blusa_teia.jpg')));
      if (!hasPhoto) {
        images.unshift(factoryPhoto);
      }
    }
    // Regra inviolável: o vídeo NUNCA deve ser a primeira mídia (índice 0)
    if (isVideoMedia(images[0])) {
      const nonVideoIdx = images.findIndex(img => !isVideoMedia(img));
      if (nonVideoIdx > 0) {
        const [photo] = images.splice(nonVideoIdx, 1);
        images.unshift(photo);
      } else {
        images.unshift(factoryPhoto);
      }
    }
    cured.images = images;
    cured.image = factoryPhoto;
    return cured;
  }

  if (factoryItem) {
    if (!cured.image || isVideoMedia(cured.image)) {
      cured.image = factoryItem.image;
    }
    if (!Array.isArray(cured.images) || cured.images.length === 0) {
      cured.images = Array.isArray(factoryItem.images) ? [...factoryItem.images] : [factoryItem.image];
    }
  }

  if (Array.isArray(cured.images) && cured.images.length > 0) {
    if (isVideoMedia(cured.images[0])) {
      const nonVideoIdx = cured.images.findIndex(img => !isVideoMedia(img));
      if (nonVideoIdx > 0) {
        const [photo] = cured.images.splice(nonVideoIdx, 1);
        cured.images.unshift(photo);
      } else if (factoryItem && factoryItem.image) {
        cured.images.unshift(factoryItem.image);
      } else {
        cured.images.unshift('assets/products/tote_cherry.jpg');
      }
    }
    if (!cured.image || isVideoMedia(cured.image)) {
      const firstMedia = cured.images[0];
      cured.image = typeof firstMedia === 'object' && firstMedia ? (firstMedia.url || firstMedia.poster || '') : firstMedia;
    }
  }
  return cured;
}

/**
 * Processa uma lista de peças do catálogo garantindo a preservação e cura de mídias de fábrica.
 * @param {Array} products
 * @param {Array} defaultList
 * @returns {Array}
 */
export function cureProductListMedia(products, defaultList = defaultInitialCatalog) {
  if (!Array.isArray(products)) return [];
  return products.map(p => preserveFactoryMedia(p, defaultList));
}

/**
 * Carrega catálogo persistido do localStorage com fallback para defaultInitialCatalog
 * @returns {Array}
 */
export function loadCatalog() {
  const raw = localStorage.getItem(STORAGE_CATALOG_KEY);
  if (!raw) {
    localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(defaultInitialCatalog));
    return defaultInitialCatalog;
  }
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed) || parsed.length === 0) {
      localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(defaultInitialCatalog));
      return defaultInitialCatalog;
    }
    // Auto-cura do catálogo padrão no Ateliê: sincroniza mídias atualizadas (ex: vídeo da blusa-teia)
    const cured = cureProductListMedia(parsed, defaultInitialCatalog);
    const updated = JSON.stringify(cured) !== JSON.stringify(parsed);
    if (updated) {
      try {
        localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(cured));
      } catch (e) {
        console.debug('[JËZ Ateliê] QuotaExceeded ao salvar auto-cura de catálogo:', e);
      }
    }
    return sortCatalogByCuratedOrder(cured);
  } catch {
    return defaultInitialCatalog;
  }
}

/**
 * Rotina de recuperação para estouro de cota do localStorage (JEZ-029)
 * Libera espaço da chave duplicada e compacta fotos secundárias de peças antigas
 * mantendo as 5 fotos da peça recém-adicionada/editada (targetProductId)
 * @param {Array} catalogList
 * @param {string | null} targetProductId
 * @returns {boolean}
 */
export function handleStorageQuotaExceeded(catalogList, targetProductId = null) {
  try {
    // 1. Libera espaço da chave redundante jez_custom_products e tenta persistir o catálogo integral
    localStorage.removeItem(STORAGE_CUSTOM_PRODUCTS_KEY);
    localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(catalogList));
    return true;
  } catch {
    // 2. Se a cota ainda for excedida, compacta apenas fotos secundárias de peças antigas preservando a atual
    try {
      const slimCatalog = catalogList.map(p => {
        if (p.id !== targetProductId && p.id.startsWith('custom-') && Array.isArray(p.images) && p.images.length > 1) {
          return { ...p, images: [p.images[0]] };
        }
        return p;
      });
      localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(slimCatalog));
      return true;
    } catch (e2) {
      console.warn('[JËZ Ateliê] Falha crítica de cota no localStorage:', e2);
      return false;
    }
  }
}

/**
 * Salva catálogo com tratamento de cota e sincronização com Cloud Firestore
 * @param {Array} catalogList
 * @param {string | null} targetProductId
 * @param {Function | null} onUpdated
 * @returns {boolean}
 */
export function saveCatalog(catalogList, targetProductId = null, onUpdated = null) {
  const cured = cureProductListMedia(catalogList, defaultInitialCatalog);
  const sorted = sortCatalogByCuratedOrder(cured);
  let savedSuccessfully = false;
  try {
    localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(sorted));
    savedSuccessfully = true;
  } catch (err) {
    console.warn('[JËZ Ateliê] Cota atingida ao salvar jez_catalog:', err);
    savedSuccessfully = handleStorageQuotaExceeded(sorted, targetProductId);
  }

  // Apenas mantém chave legada se houver espaço livre sem comprometer o catálogo principal
  if (savedSuccessfully) {
    try {
      const customOnly = sorted.filter(p => p.id && p.id.startsWith('custom-'));
      localStorage.setItem(STORAGE_CUSTOM_PRODUCTS_KEY, JSON.stringify(customOnly));
    } catch {
      localStorage.removeItem(STORAGE_CUSTOM_PRODUCTS_KEY);
    }
  }

  if (typeof onUpdated === 'function') {
    onUpdated(sorted);
  }

  // Sincroniza catálogo em tempo real com o Cloud Firestore (Fase 2 - JEZ-021)
  if (typeof window !== 'undefined' && window.jezFirebase && typeof window.jezFirebase.saveProduct === 'function') {
    if (targetProductId) {
      const target = sorted.find(p => p.id === targetProductId);
      if (target) {
        window.jezFirebase.saveProduct(target).catch(err => {
          console.warn('[JËZ Cloud] Erro ao sincronizar peça:', target.id, err.message);
        });
      }
    } else {
      sorted.forEach(p => {
        window.jezFirebase.saveProduct(p).catch(err => {
          console.warn('[JËZ Cloud] Erro ao sincronizar peça:', p.id, err.message);
        });
      });
    }
  }

  return savedSuccessfully;
}

/**
 * Determina o status correto para o qual uma peça suspensa deve ser reativada,
 * preservando a modalidade de confecção original (Sob Encomenda vs Pronta Entrega).
 * (JEZ-033: Resolução de Sobrescrita Indevida na Reativação)
 * @param {object} piece
 * @returns {'ready' | 'order'}
 */
export function determineReactivatedStatus(piece) {
  if (!piece || typeof piece !== 'object') {
    return 'ready';
  }

  // 1. Prioridade para modalidade original explicitamente registrada
  if (piece.originalStatus === 'order' || piece.modality === 'order') {
    return 'order';
  }
  if (piece.originalStatus === 'ready' || piece.modality === 'ready') {
    return 'ready';
  }

  // 2. Verificação de peça padrão que é originalmente sob encomenda (RN-JEZ-001)
  if (piece.id && Array.isArray(defaultInitialCatalog)) {
    const defaultItem = defaultInitialCatalog.find(d => d && d.id === piece.id);
    if (defaultItem) {
      if (defaultItem.status === 'order' || defaultItem.isReady === false) {
        return 'order';
      }
      if (defaultItem.status === 'ready' || defaultItem.isReady === true) {
        return 'ready';
      }
    }
  }

  // 3. Análise da regra de confecção e prazo em dias úteis (Sob Encomenda)
  const leadTime = Number(piece.leadTimeDays);
  if ((leadTime > 0 && piece.isReady === false) || piece.status === 'order') {
    return 'order';
  }

  // 4. Peças com prazo de dias positivo mesmo sem flag explícita
  if (leadTime > 0 && (piece.stockQty === undefined || piece.stockQty === null || Number(piece.stockQty) === 0)) {
    return 'order';
  }

  // 5. Peças com isReady explicitamente false
  if (piece.isReady === false && (piece.stockQty === undefined || piece.stockQty === null || Number(piece.stockQty) <= 0)) {
    return 'order';
  }

  // 6. Peças com estoque numérico explícito positivo ou isReady
  if (piece.isReady === true || (piece.stockQty !== undefined && piece.stockQty !== null && Number(piece.stockQty) > 0)) {
    return 'ready';
  }

  // 7. Fallback por prazo de confecção residual
  if (leadTime > 0) {
    return 'order';
  }

  return 'ready';
}

/**
 * Atualiza o status de uma peça no catálogo de forma pura e defensiva,
 * preservando a modalidade original em caso de suspensão e restaurando-a na reativação.
 * @param {Array} catalogList
 * @param {string} id
 * @param {string} newStatus ('ready' | 'order' | 'suspended' | 'reactivate')
 * @returns {{ success: boolean, catalog: Array, updatedPiece?: object, reason?: string }}
 */
export function mutatePieceStatus(catalogList, id, newStatus) {
  if (!Array.isArray(catalogList)) {
    return { success: false, reason: 'invalid_catalog_list', catalog: [] };
  }
  if (!id || typeof id !== 'string') {
    return { success: false, reason: 'invalid_id', catalog: catalogList };
  }
  const validStatuses = ['ready', 'order', 'suspended', 'reactivate'];
  if (!validStatuses.includes(newStatus)) {
    return { success: false, reason: 'invalid_status', catalog: catalogList };
  }

  const existing = catalogList.find(p => p && p.id === id);
  if (!existing) {
    return { success: false, reason: 'not_found', catalog: catalogList };
  }

  let finalStatus = newStatus;
  let originalStatus = existing.originalStatus;

  if (newStatus === 'reactivate') {
    finalStatus = determineReactivatedStatus(existing);
  } else if (newStatus === 'suspended') {
    // Ao suspender, armazena a modalidade atual antes da suspensão
    if (existing.status !== 'suspended') {
      originalStatus = existing.status || (existing.isReady ? 'ready' : (Number(existing.leadTimeDays) > 0 ? 'order' : 'ready'));
    }
  } else {
    // Ao mudar ativamente para ready ou order, atualiza a modalidade de origem
    originalStatus = newStatus;
  }

  let updatedPiece = null;
  const nextCatalog = catalogList.map(p => {
    if (p && p.id === id) {
      const isReadyValue = finalStatus === 'ready';
      updatedPiece = {
        ...p,
        status: finalStatus,
        isReady: isReadyValue,
        originalStatus: originalStatus || (isReadyValue ? 'ready' : 'order')
      };

      // Garante coerência dos campos segundo a modalidade final
      if (finalStatus === 'order') {
        updatedPiece.isReady = false;
        if (!p.leadTimeDays || Number(p.leadTimeDays) <= 0) {
          updatedPiece.leadTimeDays = 7;
        }
      } else if (finalStatus === 'ready') {
        updatedPiece.isReady = true;
        // Ao reativar pronta entrega que estava zerada, restaura ao menos 1 unidade disponível
        if (newStatus === 'reactivate' && (p.stockQty === undefined || p.stockQty === null || Number(p.stockQty) <= 0)) {
          updatedPiece.stockQty = 1;
        }
      }

      return updatedPiece;
    }
    return p;
  });

  return {
    success: true,
    catalog: nextCatalog,
    updatedPiece
  };
}
