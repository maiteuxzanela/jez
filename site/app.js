/**
 * ==========================================================================
 * JEZ Collection — Script Principal (Lógica de Vitrine, Carrinho & Frete)
 * Especialistas: Sam (E-Commerce) & Lumi (UI/UX)
 * Supervisionado por: Alex (CTO)
 * ==========================================================================
 */
const initApp = () => {
  // --------------------------------------------------------------------------
  // 1. Catálogo Real de Peças Artesanais (Acervo Instagram @_jezcollection)
  // --------------------------------------------------------------------------
  const defaultProducts = [
    {
      id: 'bolsa-punk',
      name: 'Bolsa Punk Slouchy com Correntes',
      category: 'bolsas',
      categoryLabel: 'Bolsas & Bags',
      price: 169.90,
      image: 'assets/products/bolsa_punk.webp',
      images: ['assets/products/bolsa_punk.webp', 'assets/products/bolsa_punk_detail.webp'],
      isReady: false,
      leadTimeDays: 7,
      dimensions: '28cm (L) × 22cm (A) × 8cm (P)',
      materials: 'Fio de malha premium preto fosco e correntes duplas prateadas em aço',
      description: 'Bolsa autoral com modelagem triangular slouchy e estética rocker/alt. Fechamento seguro com botão de pressão e alça de corrente metálica encorpada.'
    },
    {
      id: 'tote-cherry',
      name: 'Tote Bag Cherry com Laço',
      category: 'bolsas',
      categoryLabel: 'Bolsas & Bags',
      price: 149.90,
      image: 'assets/products/tote_cherry.webp',
      images: ['assets/products/tote_cherry.webp', 'assets/products/tote_cherry_detail.webp'],
      isReady: true,
      stockQty: 2,
      dimensions: '34cm (L) × 30cm (A) × 10cm (P)',
      materials: 'Fio 100% algodão cru, cerejas em relevo de crochê e fita de cetim rubi',
      description: 'A clássica e queridinha Tote Bag de cerejas com laço delicado. Amplo espaço interno para o dia a dia, acabamento estruturado e toque macio.'
    },
    {
      id: 'shoulder-coracao',
      name: 'Shoulder Bag Coração Granny Square',
      category: 'bolsas',
      categoryLabel: 'Bolsas & Bags',
      price: 139.90,
      image: 'assets/products/shoulder_coracao.webp',
      isReady: true,
      stockQty: 1,
      dimensions: '24cm (L) × 20cm (A) × 6cm (P)',
      materials: 'Fio de algodão creme e vermelho carmim, alça entrelaçada com elos dourados',
      description: 'Composta por granny squares autorais com corações centrais e pingentes pendurados na alça. Perfeita para passeios e ocasiões especiais.'
    },
    {
      id: 'bolsa-xadrez',
      name: 'Bolsa Xadrez Checkerboard',
      category: 'bolsas',
      categoryLabel: 'Bolsas & Bags',
      price: 159.90,
      image: 'assets/products/bolsa_xadrez.webp',
      isReady: false,
      leadTimeDays: 5,
      dimensions: '36cm (L) × 32cm (A) × 8cm (P)',
      materials: 'Fio de algodão premium estruturado em padrão xadrez quadriculado P&B',
      description: 'A estética streetwear contemporânea encontra a arte do crochê. Alças reforçadas e padrão quadriculado perfeito feito à mão ponto a ponto.'
    },
    {
      id: 'blusa-teia',
      name: 'Blusa Teia de Aranha Cropped',
      category: 'vestuario',
      categoryLabel: 'Vestuário Autoral',
      price: 189.90,
      image: 'assets/products/blusa_teia.webp',
      images: ['assets/products/blusa_teia.webp', { url: 'assets/products/blusa_teia_loop.mp4', poster: 'assets/products/blusa_teia_loop_poster.webp', type: 'video', isVideo: true }],
      isReady: false,
      leadTimeDays: 8,
      dimensions: 'Modelagem cropped com manga longa ampla (veste do 36 ao 42)',
      materials: 'Fio de algodão leve off-white em ponto teia aberto com acabamento rendado',
      description: 'Peça icônica do ateliê! Trama vazada em padrão de teia de aranha que cria um visual gótico e alternativo marcante. Ideal para sobreposições estilosas.'
    },
    {
      id: 'top-bandana',
      name: 'Top Amarração Frontal + Bandana',
      category: 'vestuario',
      categoryLabel: 'Vestuário Autoral',
      price: 145.00,
      image: 'assets/products/top_bandana.webp',
      isReady: true,
      stockQty: 2,
      dimensions: 'Top regulável por cordão frontal + Bandana triangular de cabelo',
      materials: 'Fio de algodão mercerizado macio em tom rosa pastel com ponteiras de franja',
      description: 'Conjunto completo composto por top cropped de amarração frontal e bandana combinando. Visual artesanal fresco e romântico para dias de sol e festivais.'
    },
    {
      id: 'cardiga-manteiga',
      name: 'Cardigã Cropped Manteiga (Shrug)',
      category: 'vestuario',
      categoryLabel: 'Vestuário Autoral',
      price: 179.90,
      image: 'assets/products/cardiga_manteiga.webp',
      isReady: false,
      leadTimeDays: 10,
      dimensions: 'Modelagem cropped soltinha com manga 3/4 (tamanho único M)',
      materials: 'Fio macio no tom manteiga suave (#F5ECB7) com pontos rendados florais',
      description: 'Bolero delicado em tom suave e aconchegante. A terceira peça perfeita para valorizar qualquer look casual com a textura nobre do crochê.'
    },
    {
      id: 'chaveiro-baphomet',
      name: 'Chaveiro Amigurumi Baphomet Cute',
      category: 'acessorios',
      categoryLabel: 'Acessórios & Miudezas',
      price: 49.90,
      image: 'assets/products/chaveiro_baphomet.webp',
      images: ['assets/products/chaveiro_baphomet.webp', 'assets/products/chaveiro_baphomet_detail.webp'],
      isReady: true,
      stockQty: 4,
      dimensions: '10cm de altura (sem contar a argola)',
      materials: 'Fio 100% algodão preto, enchimento siliconado antialérgico e chifres bordados',
      description: 'O contraste perfeito entre o místico e o adorável! Amigurumi com detalhes minuciosos em vermelho e pentagrama na testa. Argola de chaveiro inclusa.'
    },
    {
      id: 'porta-airpods',
      name: 'Porta-AirPods / Fones em Crochê',
      category: 'acessorios',
      categoryLabel: 'Acessórios & Miudezas',
      price: 39.90,
      image: 'assets/products/porta_airpods.webp',
      isReady: true,
      stockQty: 5,
      dimensions: '6.5cm (L) × 5.5cm (A) × 3cm (P)',
      materials: 'Fio de algodão azul e amarelo, botão vintage e mosquetão metálico',
      description: 'Case protetora fofa em crochê para fones de ouvido sem fio. Protege o estojo de arranhões e vem com gancho para pendurar na bolsa ou no cinto.'
    }
  ];

  const defaultCatalogOrder = [
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

  const sortProductsByCuratedOrder = (list) => {
    if (!Array.isArray(list)) return [];
    return [...list].sort((a, b) => {
      const idxA = defaultCatalogOrder.indexOf(a.id);
      const idxB = defaultCatalogOrder.indexOf(b.id);
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return 0;
    });
  };

  // --------------------------------------------------------------------------
  // 1.1 Gestão e Cura de Mídias de Fábrica (Lumi & Sam - JEZ-037)
  // --------------------------------------------------------------------------
  const isVideoUrl = (media) => {
    if (window.jezMediaPerformance && typeof window.jezMediaPerformance.isVideoUrl === 'function') {
      return window.jezMediaPerformance.isVideoUrl(media);
    }
    if (!media) return false;
    if (typeof media === 'object') {
      if (media.type === 'video' || media.isVideo === true) return true;
      if (typeof media.url === 'string') return isVideoUrl(media.url);
      return false;
    }
    if (typeof media !== 'string') return false;
    const clean = media.trim().toLowerCase();
    if (clean.startsWith('data:video/')) return true;
    if (clean.startsWith('blob:video') || clean.includes('mediatype=video')) return true;
    return /\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i.test(clean);
  };

  const withFactoryVideoPoster = (media, poster = 'assets/products/blusa_teia_loop_poster.webp') => {
    if (!media || typeof media !== 'object') return media;
    if (typeof media.url !== 'string' || !media.url.includes('blusa_teia_loop.mp4')) return media;
    if (typeof media.poster === 'string' && media.poster.trim()) return media;
    return { ...media, poster, type: media.type || 'video', isVideo: media.isVideo !== false };
  };

  // Detecta midia enviada de verdade pela artesa (Data URL Base64 / blob de upload).
  // Fotos reais NUNCA podem ser substituidas por ativos de fabrica do catalogo editorial.
  const isRealUploadMedia = (media) => {
    if (!media) return false;
    if (typeof media === 'string') {
      const clean = media.trim().toLowerCase();
      return clean.startsWith('data:image/') || clean.startsWith('blob:');
    }
    if (typeof media === 'object' && typeof media.url === 'string') {
      return isRealUploadMedia(media.url);
    }
    return false;
  };

  // --------------------------------------------------------------------------
  // 1.2 Regras Canonicas de Modalidade e Esgotamento (Sam - JEZ-043 / RN-JEZ-001)
  // --------------------------------------------------------------------------
  // Pecas sob encomenda (status 'order' ou isReady false) NUNCA sao esgotadas,
  // mesmo com stockQty zerado, pois nao possuem estoque fisico de prateleira.
  // Espelha isProductSoldOut de js/services/products.js para o bundle classico.
  const isProductSoldOut = (product) => {
    if (!product) return false;
    const isOrder = product.status === 'order' || (product.isReady === false && product.status !== 'ready');
    if (isOrder) return false;

    const isReady = product.status ? product.status === 'ready' : (product.isReady !== undefined ? product.isReady : true);
    if (!isReady) return false;

    const stock = Number(product.stockQty !== undefined && product.stockQty !== null ? product.stockQty : 1);
    return stock <= 0;
  };

  // Decremento local de estoque apenas para pronta entrega (isReady === true).
  const isLocalStockTrackedPiece = (piece) => {
    if (!piece) return false;
    if (piece.status === 'order') return false;
    const isReady = piece.status ? piece.status === 'ready' : piece.isReady === true;
    return isReady === true;
  };

  // --------------------------------------------------------------------------
  // 1.3 Fila Dinamica de Producao do Atelie (Sam - JEZ-044)
  // totalBacklogDays vem do singleton meta/production_queue com fallback 0 dias.
  // Prazo de peca sob encomenda = confeccao da peca + fila acumulada do atelie.
  // --------------------------------------------------------------------------
  const DEFAULT_LEAD_TIME_DAYS = 7;
  const productionQueue = { totalBacklogDays: 0, activeOrdersCount: 0 };

  const isCustomOrderPiece = (piece) => {
    if (!piece) return false;
    if (piece.status === 'order') return true;
    if (piece.status === 'ready' || piece.isReady === true) return false;
    if (piece.isReady === false) return true;
    // Legado sem sinalizacao explicita: prazo de confeccao positivo denuncia encomenda.
    return (parseInt(piece.leadTimeDays, 10) || 0) > 0;
  };

  const perPieceLeadTimeDays = (piece) => {
    const parsed = parseInt(piece && piece.leadTimeDays, 10);
    return parsed > 0 ? parsed : DEFAULT_LEAD_TIME_DAYS;
  };

  const getQueueBacklogDays = () => Math.max(0, parseInt(productionQueue.totalBacklogDays, 10) || 0);

  const formatBusinessDays = (days) => {
    const safeDays = Math.max(0, parseInt(days, 10) || 0);
    return `${safeDays} ${safeDays === 1 ? 'dia útil' : 'dias úteis'}`;
  };

  // Penalidade de fila aplicada na vitrine e no quick view.
  const pieceEstimatedLeadTimeDays = (piece) => perPieceLeadTimeDays(piece) + getQueueBacklogDays();

  // Tempo de confeccao da sacola: SUM(leadTimeDays * quantity) dos itens sob encomenda.
  const getCartProductionDays = (cartItems) => (Array.isArray(cartItems) ? cartItems : []).reduce((total, item) => {
    if (!isCustomOrderPiece(item)) return total;
    const quantity = Math.max(1, parseInt(item.quantity, 10) || 1);
    return total + (perPieceLeadTimeDays(item) * quantity);
  }, 0);

  const getCartLeadTimeSummary = (cartItems) => {
    const list = Array.isArray(cartItems) ? cartItems : [];
    const queueDays = getQueueBacklogDays();
    const productionDays = getCartProductionDays(list);
    const hasCustom = list.some(item => isCustomOrderPiece(item));
    return {
      hasCustom,
      queueDays,
      productionDays,
      totalDays: hasCustom ? queueDays + productionDays : 0
    };
  };

  const applyProductionQueue = (queue) => {
    const backlog = Math.max(0, parseInt(queue && queue.totalBacklogDays, 10) || 0);
    const active = Math.max(0, parseInt(queue && queue.activeOrdersCount, 10) || 0);
    const changed = backlog !== productionQueue.totalBacklogDays || active !== productionQueue.activeOrdersCount;
    productionQueue.totalBacklogDays = backlog;
    productionQueue.activeOrdersCount = active;
    if (!changed) return;
    if (isCatalogLoaded) renderCatalog();
    updateCartUI();
  };

  // Snapshot em tempo real da fila; qualquer falha degrada para 0 dias.
  const bindProductionQueue = () => {
    if (!window.jezFirebase || typeof window.jezFirebase.onProductionQueueChange !== 'function') return;
    try {
      if (typeof window.jezFirebase.getProductionQueue === 'function') {
        window.jezFirebase.getProductionQueue().then(applyProductionQueue).catch(() => {});
      }
      window.jezFirebase.onProductionQueueChange(applyProductionQueue);
    } catch (err) {
      console.warn('[JËZ Fila] Falha ao assinar a fila de producao:', err);
    }
  };

  // Publicacao opcional para modulos externos e harness de teste lerem a fila.
  if (typeof window !== 'undefined') {
    window.jezProductionQueue = productionQueue;
    window.jezProductionLeadTime = {
      piece: pieceEstimatedLeadTimeDays,
      cart: getCartLeadTimeSummary,
      formatDays: formatBusinessDays
    };
  }

  // Etiqueta textile costurada (woven label) usada como poster têxtil quando um
  // video nao possui banner do primeiro frame derivavel. Formato 1:1 (42x42),
  // paleta oficial (aubergine + pesponto pêssego), ZERO emojis e ZERO pills.
  const VIDEO_THUMB_POSTER_PLACEHOLDER = "data:image/svg+xml,%3Csvg%20xmlns='http://www.w3.org/2000/svg'%20viewBox='0%200%2042%2042'%3E%3Crect%20width='42'%20height='42'%20fill='%2323192d'/%3E%3Crect%20x='4'%20y='4'%20width='34'%20height='34'%20fill='none'%20stroke='%23FEBF97'%20stroke-width='1'%20stroke-dasharray='3%202.5'/%3E%3Cpolygon%20points='17,15%2028,21%2017,27'%20fill='%23FEBF97'/%3E%3C/svg%3E";

  // Resolve o banner/poster do primeiro frame de um video (JEZ-038).
  // Fonte unica: js/services/media-performance.js. Nunca devolve a foto
  // estatica anterior da peca; quando indeterminavel devolve string vazia.
  const resolveVideoPoster = (media) => {
    if (window.jezMediaPerformance && typeof window.jezMediaPerformance.resolveVideoPoster === 'function') {
      return window.jezMediaPerformance.resolveVideoPoster(media);
    }
    return '';
  };

  const hasVideoMedia = (mediaList) => {
    if (window.jezMediaPerformance && typeof window.jezMediaPerformance.hasVideoMedia === 'function') {
      return window.jezMediaPerformance.hasVideoMedia(mediaList);
    }
    if (!Array.isArray(mediaList) || mediaList.length === 0) return false;
    return mediaList.some(item => isVideoUrl(item));
  };

  const cureProductMedia = (product, defaultList = defaultProducts) => {
    if (!product || typeof product !== 'object') return product;
    const cured = { ...product };
    const factoryItem = Array.isArray(defaultList) ? defaultList.find(d => d.id === cured.id) : null;

    if (cured.id === 'blusa-teia') {
      const factoryPhoto = (factoryItem && factoryItem.image) ? factoryItem.image : 'assets/products/blusa_teia.webp';
      const factoryVideo = 'assets/products/blusa_teia_loop.mp4';
      let images = Array.isArray(cured.images) ? [...cured.images] : [];
      // Fotos reais enviadas pela artesa tem prioridade absoluta sobre os ativos de fabrica
      const hasRealPhoto = images.some(img => isRealUploadMedia(img)) || isRealUploadMedia(cured.image);
      if (images.length === 0 && hasRealPhoto) {
        images = [cured.image];
      } else if (images.length === 0) {
        images = [factoryPhoto, factoryVideo];
      } else if (!hasRealPhoto) {
        if (!images.some(img => (typeof img === 'string' && img.includes('blusa_teia_loop.mp4')) || (typeof img === 'object' && img && img.url && img.url.includes('blusa_teia_loop.mp4')))) {
          images.push(factoryVideo);
        }
        if (!images.some(img => {
          const url = typeof img === 'string' ? img : (img && typeof img.url === 'string' ? img.url : '');
          return /blusa_teia\.(?:jpe?g|webp)$/i.test(url.trim());
        })) {
          images.unshift(factoryPhoto);
        }
      }
      // Regra Inviolavel (JEZ-037): O video NUNCA deve ser a primeira midia (indice 0)
      if (isVideoUrl(images[0])) {
        const nonVideoIdx = images.findIndex(img => !isVideoUrl(img));
        if (nonVideoIdx > 0) {
          const [photo] = images.splice(nonVideoIdx, 1);
          images.unshift(photo);
        } else if (!hasRealPhoto) {
          images.unshift(factoryPhoto);
        }
      }
      // Objetos de video de fabrica preservam o poster estruturado (JEZ-038)
      images = images.map(media => withFactoryVideoPoster(media));
      cured.images = images;
      if (!hasRealPhoto) {
        cured.image = factoryPhoto;
      } else if (!isRealUploadMedia(cured.image)) {
        const firstStatic = images.find(img => !isVideoUrl(img));
        cured.image = firstStatic
          ? (typeof firstStatic === 'object' ? (firstStatic.url || firstStatic.poster || factoryPhoto) : firstStatic)
          : factoryPhoto;
      }
      return cured;
    }

    if (factoryItem) {
      if (!cured.image || isVideoUrl(cured.image)) {
        // Foto real presente na galeria promove-se a capa; ativo de fabrica so como ultimo recurso
        const realGalleryMedia = Array.isArray(cured.images) ? cured.images.find(media => isRealUploadMedia(media)) : null;
        cured.image = realGalleryMedia
          ? (typeof realGalleryMedia === 'object' ? (realGalleryMedia.url || realGalleryMedia.poster || factoryItem.image) : realGalleryMedia)
          : factoryItem.image;
      }
      if (!Array.isArray(cured.images) || cured.images.length === 0) {
        // Foto real enviada pela artesa alimenta a galeria sem ser trocada por ativo de fabrica
        cured.images = isRealUploadMedia(cured.image)
          ? [cured.image]
          : (Array.isArray(factoryItem.images) ? [...factoryItem.images] : [factoryItem.image]);
      }
    }

    if (Array.isArray(cured.images) && cured.images.length > 0) {
      if (isVideoUrl(cured.images[0])) {
        const nonVideoIdx = cured.images.findIndex(img => !isVideoUrl(img));
        if (nonVideoIdx > 0) {
          const [photo] = cured.images.splice(nonVideoIdx, 1);
          cured.images.unshift(photo);
        } else if (factoryItem && factoryItem.image) {
          cured.images.unshift(factoryItem.image);
        } else {
          cured.images.unshift('assets/products/tote_cherry.webp');
        }
      }
      if (!cured.image || isVideoUrl(cured.image)) {
        const firstPhoto = cured.images.find(img => !isVideoUrl(img));
        cured.image = firstPhoto ? (typeof firstPhoto === 'object' ? (firstPhoto.url || firstPhoto.poster) : firstPhoto) : (factoryItem ? factoryItem.image : cured.images[0]);
      }
    }

    return cured;
  };

  const cureProductListMedia = (list, defaultList = defaultProducts) => {
    if (!Array.isArray(list)) return [];
    return list.map(p => cureProductMedia(p, defaultList));
  };

  // Unificacao segura do catalogo da nuvem com o catalogo editorial de fabrica.
  // Regras inviolaveis:
  // 1. Documentos da nuvem (com fotos reais Base64 e pecas 'custom-*') sao a fonte da verdade.
  // 2. Pecas editoriais ausentes no Firestore sao preservadas (o seed cobre o banco em paralelo).
  // 3. Nenhuma midia de peca vinda da nuvem e substituida por ativo de fabrica.
  const mergeCloudCatalogWithFactory = (cloudList, factoryList = defaultProducts) => {
    const cloud = Array.isArray(cloudList) ? cloudList.filter(p => p && p.id) : [];
    const factory = Array.isArray(factoryList) ? factoryList : [];
    const cloudIds = new Set(cloud.map(p => p.id));
    const preservedFactory = factory
      .filter(p => p && p.id && !cloudIds.has(p.id))
      .map(p => ({
        ...p,
        images: Array.isArray(p.images)
          ? p.images.map(media => (media && typeof media === 'object' ? { ...media } : media))
          : p.images
      }));
    return [...cloud, ...preservedFactory];
  };

  // Persistencia defensiva do cache local: fotos reais em Data URL Base64 estouram a
  // cota de 5MB do localStorage. Estrategia em cascata:
  // 1. catalogo integral; 2. catalogo enxuto (capa real preservada, galeria Base64 removida);
  // 3. somente pecas sem Base64. A nuvem repoe as midias completas no snapshot seguinte.
  const isHeavyMedia = (media) => {
    if (isRealUploadMedia(media)) return true;
    return typeof media === 'string' && media.trim().toLowerCase().startsWith('data:');
  };

  const isCacheableCatalogPiece = (piece) => {
    if (!piece) return false;
    if (isHeavyMedia(piece.image)) return false;
    if (Array.isArray(piece.images) && piece.images.some(media => isHeavyMedia(media))) return false;
    return true;
  };

  const buildSlimCatalogCache = (list) => list.map(piece => {
    if (!piece) return piece;
    const slim = { ...piece };
    if (Array.isArray(piece.images)) {
      const lightImages = piece.images.filter(media => !isHeavyMedia(media));
      if (isHeavyMedia(piece.image)) {
        // Preserva a capa real (primeiro paint) e descarta apenas a galeria pesada
        slim.images = [piece.image, ...lightImages.filter(media => media !== piece.image)];
      } else if (lightImages.length > 0) {
        slim.images = lightImages;
      } else {
        delete slim.images;
      }
    }
    return slim;
  });

  const persistCatalogCache = (list) => {
    if (!Array.isArray(list) || list.length === 0) return false;
    const attempts = [
      { label: 'integral', data: list },
      { label: 'enxuto', data: buildSlimCatalogCache(list) },
      { label: 'leve', data: list.filter(isCacheableCatalogPiece) }
    ];
    for (const attempt of attempts) {
      if (!Array.isArray(attempt.data) || attempt.data.length === 0) continue;
      try {
        localStorage.setItem('jez_catalog', JSON.stringify(attempt.data));
        if (attempt.label !== 'integral') {
          console.debug('[JËZ Cache] Catalogo persistido no modo ' + attempt.label + ' (' + attempt.data.length + ' pecas) para respeitar a cota do localStorage');
        }
        return true;
      } catch (err) {
        // Tenta o proximo nivel de compactacao
      }
    }
    console.warn('[JËZ Cache] Nao foi possivel persistir o catalogo local: cota do localStorage excedida');
    return false;
  };

  // Carrega peças padrão + peças cadastradas e geridas pela Jéssica no painel
  const getProducts = () => {
    try {
      const catalogRaw = localStorage.getItem('jez_catalog');
      let pieces = [];
      if (catalogRaw) {
        let updated = false;
        pieces = JSON.parse(catalogRaw).map(p => {
          // Auto-cura do bug da bolsa cherry em peças padrão (JEZ-019)
          if (p.id !== 'tote-cherry' && p.image && (p.image === 'assets/products/tote_cherry.jpg' || p.image.endsWith('/tote_cherry.jpg'))) {
            const def = defaultProducts.find(d => d.id === p.id);
            if (def && def.image) {
              p.image = def.image;
              updated = true;
            }
          }
          if (p.id !== 'tote-cherry' && Array.isArray(p.images) && p.images.length > 0) {
            const firstMedia = p.images[0];
            const firstMediaUrl = typeof firstMedia === 'string' ? firstMedia : (firstMedia && firstMedia.url) || '';
            if (firstMediaUrl === 'assets/products/tote_cherry.jpg' || firstMediaUrl.endsWith('/tote_cherry.jpg')) {
              const def = defaultProducts.find(d => d.id === p.id);
              if (def && def.image) {
                p.images[0] = def.image;
                updated = true;
              }
            }
          }
          // Garante vídeo mockado para blusa-teia (JEZ-032 & JEZ-037)
          if (p.id === 'blusa-teia') {
            const hasFactoryVideo = Array.isArray(p.images) && p.images.some(img => (typeof img === 'string' && img.includes('blusa_teia_loop.mp4')) || (typeof img === 'object' && img && typeof img.url === 'string' && img.url.includes('blusa_teia_loop.mp4')));
            const videoFirst = Array.isArray(p.images) && isVideoUrl(p.images[0]);
            if (!hasFactoryVideo || videoFirst) {
              p = cureProductMedia(p, defaultProducts);
              updated = true;
            }
          }
          p = cureProductMedia(p, defaultProducts);
          if (!p.images || p.images.length === 0) {
            const def = defaultProducts.find(d => d.id === p.id);
            if (def && def.images) {
              updated = true;
              p.images = [...def.images];
            }
          }
          if (p.stockQty === undefined || p.stockQty === null) {
            const def = defaultProducts.find(d => d.id === p.id);
            if (def && def.stockQty !== undefined) {
              p.stockQty = def.stockQty;
              updated = true;
            } else if (p.isReady || p.status === 'ready') {
              p.stockQty = 1;
              updated = true;
            } else {
              p.stockQty = 0;
              updated = true;
            }
          }
          return p;
        });
        if (updated) {
          persistCatalogCache(pieces);
        }
      } else {
        const custom = JSON.parse(localStorage.getItem('jez_custom_products') || '[]');
        pieces = [...defaultProducts, ...custom];
      }
      const sorted = sortProductsByCuratedOrder(pieces);
      // Filtra estritamente peças que NÃO estejam suspensas nem excluídas
      return sorted
        .filter(p => p.status !== 'suspended' && !p.isSuspended && !p.isDeleted)
        .map(p => {
          const cured = cureProductMedia(p, defaultProducts);
          const isReady = cured.status ? cured.status === 'ready' : (cured.isReady !== undefined ? cured.isReady : true);
          const stockQty = cured.stockQty !== undefined && cured.stockQty !== null ? Number(cured.stockQty) : (isReady ? 1 : 0);
          return {
            ...cured,
            isReady,
            stockQty
          };
        });
    } catch {
      return defaultProducts;
    }
  };
  const hasLocalCatalog = Boolean(localStorage.getItem('jez_catalog'));
  let isCatalogLoaded = hasLocalCatalog;
  let fallbackCatalogTimeout = null;
  let cloudStatus = null;
  let products = hasLocalCatalog ? getProducts() : [];

  // --------------------------------------------------------------------------
  // 2. Estado Global da Loja
  // --------------------------------------------------------------------------
  let cart = JSON.parse(localStorage.getItem('jez_cart')) || [];
  let currentFilter = 'todas';
  let shippingCost = 0;
  let shippingMethod = '';

  // --------------------------------------------------------------------------
  // 3. Seletores DOM
  // --------------------------------------------------------------------------
  const productsGrid = document.getElementById('products-grid');
  const filterPills = document.querySelectorAll('.filter-pill');
  const cartButton = document.getElementById('cart-button');
  const cartBadge = document.getElementById('cart-badge');
  const cartDrawerBackdrop = document.getElementById('cart-drawer-backdrop');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartEmptyState = document.getElementById('cart-empty-state');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartShippingEl = document.getElementById('cart-shipping');
  const cartTotalEl = document.getElementById('cart-total');
  const btnCalcShipping = document.getElementById('btn-calc-shipping');
  const cepInput = document.getElementById('cep-input');
  const shippingResult = document.getElementById('shipping-result');
  const btnCheckout = document.getElementById('btn-checkout');
  const toastContainer = document.getElementById('toast-container');
  const productModalBackdrop = document.getElementById('product-modal-backdrop');
  const btnCloseModal = document.getElementById('btn-close-modal');

  // Elementos de Dados do Cliente no Carrinho (Sam & Morgan)
  const customerInfoBox = document.getElementById('customer-info-box');
  const customerNameInput = document.getElementById('customer-name');
  const customerContactInput = document.getElementById('customer-contact');
  const customerStreetInput = document.getElementById('customer-street');
  const customerNumberInput = document.getElementById('customer-number');
  const customerCityInput = document.getElementById('customer-city');
  const customerDataHint = document.getElementById('customer-data-hint');

  // Elementos do Modal Rápido
  const modalImg = document.getElementById('modal-img');
  const modalImgBlur = document.getElementById('modal-img-blur');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalPrice = document.getElementById('modal-price');
  const modalBadge = document.getElementById('modal-badge');
  const modalDesc = document.getElementById('modal-desc');
  const modalDimensions = document.getElementById('modal-dimensions');
  const modalMaterials = document.getElementById('modal-materials');
  const modalBtnAddCart = document.getElementById('modal-btn-add-cart');
  const modalBtnWhatsapp = document.getElementById('modal-btn-whatsapp');
  const modalBtnPrev = document.getElementById('modal-btn-prev');
  const modalBtnNext = document.getElementById('modal-btn-next');
  const modalPhotoCounter = document.getElementById('modal-photo-counter');
  const modalGalleryThumbs = document.getElementById('modal-gallery-thumbs');
  const modalVideo = document.getElementById('modal-video');
  const modalVideoToggleBtn = document.getElementById('modal-video-toggle-btn');

  let currentModalPhotos = [];
  let currentModalPhotoIndex = 0;

  // --------------------------------------------------------------------------
  // 4. Funções de Formatação, Sanitização & Segurança (Morgan - Cibersegurança)
  // --------------------------------------------------------------------------
  const escapeHtml = (str) => {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const sanitizeCustomerInput = (str, maxLen = 100) => {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/[<>'"`;]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, maxLen);
  };

  const sanitizeImageUrl = (url) => {
    if (!url || typeof url !== 'string') return 'assets/products/tote_cherry.jpg';
    const trimmed = url.trim();

    // Normaliza caminhos de assets locais caso venham com URL absoluta do navegador
    const assetIdx = trimmed.indexOf('assets/products/');
    if (assetIdx !== -1) {
      return trimmed.slice(assetIdx);
    }

    if (
      trimmed.startsWith('assets/') ||
      trimmed.startsWith('./assets/') ||
      trimmed.startsWith('/assets/') ||
      trimmed.startsWith('data:image/') ||
      trimmed.startsWith('https://') ||
      trimmed.startsWith('http://') ||
      trimmed.startsWith('blob:')
    ) {
      return trimmed;
    }
    return 'assets/products/tote_cherry.jpg';
  };

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = '<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> ';
    const textSpan = document.createElement('span');
    textSpan.textContent = message;
    toast.appendChild(textSpan);
    toastContainer.appendChild(toast);
    
    // Animação de entrada
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  };

  // --------------------------------------------------------------------------
  // 4.1 Gestão de Mídias Mistas & Loop de Vídeo (Noa & Lumi - JEZ-032)
  // --------------------------------------------------------------------------
  const cleanupVideoPlayback = (videoEl) => {
    if (window.jezMediaPerformance && typeof window.jezMediaPerformance.cleanupVideoPlayback === 'function') {
      window.jezMediaPerformance.cleanupVideoPlayback(videoEl);
      return;
    }
    if (!videoEl || typeof videoEl.pause !== 'function') return;
    try {
      videoEl.pause();
      videoEl.currentTime = 0;
    } catch (err) {
      if (typeof console !== 'undefined' && typeof console.debug === 'function') {
        console.debug('[JËZ Media] Erro defensivo ao pausar vídeo:', err);
      }
    }
  };

  const shouldAutoplayMotion = () => {
    if (window.jezMediaPerformance && typeof window.jezMediaPerformance.shouldAutoplayMotion === 'function') {
      return window.jezMediaPerformance.shouldAutoplayMotion();
    }
    try {
      if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return false;
      if (navigator && navigator.connection && navigator.connection.saveData === true) return false;
    } catch (err) {
      if (typeof console !== 'undefined' && typeof console.debug === 'function') {
        console.debug('[JËZ Media] Erro ao consultar preferência de movimento:', err);
      }
      return true;
    }
    return true;
  };

  // --------------------------------------------------------------------------
  // 4.5. Renderização de Skeletons Shimmer de Atelie (JEZ-036)
  // --------------------------------------------------------------------------
  const renderSkeletons = (count = 6) => {
    if (!productsGrid) return;
    productsGrid.innerHTML = '';
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const card = document.createElement('article');
      card.className = 'product-card-skeleton';
      card.setAttribute('aria-hidden', 'true');
      card.innerHTML = `
        <div class="skeleton-image-wrap skeleton-shimmer"></div>
        <div class="skeleton-info">
          <div class="skeleton-line category skeleton-shimmer"></div>
          <div class="skeleton-line title skeleton-shimmer"></div>
          <div class="skeleton-line meta skeleton-shimmer"></div>
          <div class="skeleton-footer">
            <div class="skeleton-line price skeleton-shimmer"></div>
            <div class="skeleton-line button skeleton-shimmer"></div>
          </div>
        </div>
      `;
      fragment.appendChild(card);
    }
    const srStatus = document.createElement('div');
    srStatus.className = 'sr-only';
    srStatus.setAttribute('role', 'status');
    srStatus.setAttribute('aria-live', 'polite');
    srStatus.textContent = 'Carregando acervo artesanal da Jéssica...';
    fragment.appendChild(srStatus);
    productsGrid.appendChild(fragment);
  };

  // --------------------------------------------------------------------------
  // 5. Renderização do Catálogo de Produtos (Blindado contra XSS)
  // --------------------------------------------------------------------------
  const renderCatalog = (catalogToUse = null) => {
    if (catalogToUse && Array.isArray(catalogToUse)) {
      products = cureProductListMedia(catalogToUse, defaultProducts);
    } else {
      products = getProducts();
    }
    productsGrid.innerHTML = '';

    const filtered = products.filter(p => {
      if (currentFilter === 'todas') return true;
      if (currentFilter === 'pronta-entrega') return p.isReady;
      return p.category === currentFilter;
    });

    if (filtered.length === 0) {
      productsGrid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--color-muted-text); padding: 40px 0;">Nenhuma peça encontrada nesta categoria no momento.</p>';
      return;
    }

    filtered.forEach(p => {
      const isSoldOut = isProductSoldOut(p);
      const card = document.createElement('article');
      card.className = `product-card ${isSoldOut ? 'is-sold-out' : ''}`;
      card.id = `card-${escapeHtml(p.id)}`;

      const safeId = escapeHtml(p.id);
      const safeName = escapeHtml(p.name);
      const safeCategory = escapeHtml(p.categoryLabel || 'Peça Autoral');
      const safeMaterials = escapeHtml(p.materials || '');
      let primaryCandidate = p.image;
      if (isVideoUrl(primaryCandidate)) {
        if (p.poster) {
          primaryCandidate = p.poster;
        } else if (Array.isArray(p.images)) {
          const firstStatic = p.images.find(img => !isVideoUrl(img));
          if (firstStatic) {
            primaryCandidate = typeof firstStatic === 'object' ? (firstStatic.poster || firstStatic.url) : firstStatic;
          } else {
            primaryCandidate = 'assets/products/tote_cherry.webp';
          }
        } else {
          primaryCandidate = 'assets/products/tote_cherry.webp';
        }
      }
      const safeImage = sanitizeImageUrl(primaryCandidate);
      const safeLeadTime = (typeof pieceEstimatedLeadTimeDays === 'function')
        ? pieceEstimatedLeadTimeDays(p)
        : (parseInt(p.leadTimeDays, 10) || 7);

      const productImages = (Array.isArray(p.images) && p.images.length > 0) ? p.images : [p.image];
      const hasVideo = hasVideoMedia(productImages) || isVideoUrl(p.image) || Boolean(p.hasVideo) || Boolean(p.videoUrl);

      let secondaryUrl = '';
      if (productImages.length > 1) {
        const secondaryCandidate = productImages[1];
        if (typeof secondaryCandidate === 'object' && secondaryCandidate.poster) {
          secondaryUrl = sanitizeImageUrl(secondaryCandidate.poster);
        } else if (typeof secondaryCandidate === 'string' && !isVideoUrl(secondaryCandidate)) {
          secondaryUrl = sanitizeImageUrl(secondaryCandidate);
        }
      }
      const hasSecondary = Boolean(secondaryUrl);
      const secondaryImage = secondaryUrl;

      let badgeHtml = '';
      if (isSoldOut) {
        badgeHtml = `<span class="product-badge badge-sold-out">Esgotada</span>`;
      } else if (p.isReady) {
        badgeHtml = `<span class="product-badge badge-ready">Pronta Entrega</span>`;
      } else {
        badgeHtml = `<span class="product-badge badge-order">Sob Encomenda (${safeLeadTime} dias úteis)</span>`;
      }

      const videoBadgeHtml = hasVideo
        ? `<span class="product-badge-video" aria-label="Contém vídeo em loop dos detalhes">
            <svg class="jez-craft-icon jez-icon-video-loop" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3" ry="3"></rect><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" fill-opacity="0.25"></polygon><line x1="6" y1="4" x2="6" y2="7"></line><line x1="6" y1="17" x2="6" y2="20"></line><line x1="18" y1="4" x2="18" y2="7"></line><line x1="18" y1="17" x2="18" y2="20"></line></svg>
            Vídeo
          </span>`
        : '';

      const isLocalAsset = safeImage.startsWith('assets/');
      const webpCandidate = isLocalAsset ? safeImage.replace(/\.(jpg|jpeg|png)$/i, '.webp') : '';
      const imageMarkup = isLocalAsset
        ? `<picture>
            <source srcset="${escapeHtml(webpCandidate)}" type="image/webp">
            <img src="${escapeHtml(safeImage)}" class="product-img-primary" alt="${safeName}" loading="lazy" decoding="async" width="400" height="400">
          </picture>`
        : `<img src="${escapeHtml(safeImage)}" class="product-img-primary" alt="${safeName}" loading="lazy" decoding="async" width="400" height="400">`;

      const secondaryMarkup = hasSecondary
        ? `<img src="${escapeHtml(secondaryImage)}" class="product-img-secondary" alt="${safeName} - Detalhe" loading="lazy" decoding="async" width="400" height="400">`
        : '';

      const btnBuyHtml = isSoldOut
        ? `<button type="button" class="btn-add-cart is-disabled" id="btn-add-${safeId}" disabled aria-disabled="true" data-id="${safeId}">
            Esgotada
          </button>`
        : `<button type="button" class="btn-add-cart" id="btn-add-${safeId}" data-action="add-cart" data-id="${safeId}">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
            Comprar
          </button>`;

      const cardContent = `
        <div class="product-image-wrap ${hasSecondary ? 'has-secondary-image' : ''}" data-action="quickview" data-id="${safeId}">
          ${imageMarkup}
          ${secondaryMarkup}
          ${badgeHtml}
          ${videoBadgeHtml}
          <button type="button" class="quick-view-overlay-btn" title="Visualizar detalhes" aria-label="Visualizar ${safeName}" data-action="quickview" data-id="${safeId}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
        </div>
        <div class="product-info">
          <span class="product-category">${safeCategory}</span>
          <h3 class="product-name" data-action="quickview" data-id="${safeId}">${safeName}</h3>
          <p class="product-meta">${safeMaterials}</p>
          <div class="product-footer">
            <div class="product-price">${formatCurrency(p.price)}</div>
            ${btnBuyHtml}
          </div>
        </div>
      `;
      card.innerHTML = cardContent; // needle-ignore: XSS_INNER_HTML (conteudo sanitizado via escapeHtml)
      productsGrid.appendChild(card);
    });
  };

  // --------------------------------------------------------------------------
  // 6. Gerenciamento do Carrinho (Cart Drawer) & Checkout Seguro
  // --------------------------------------------------------------------------
  let lastLookupCep = '';
  const lookupAddressByCep = async (cleanCep) => {
    if (!cleanCep || cleanCep.length !== 8 || cleanCep === lastLookupCep) return;
    lastLookupCep = cleanCep;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (!data.erro) {
          if (data.logradouro && customerStreetInput) {
            const streetVal = data.bairro ? `${data.logradouro} - ${data.bairro}` : data.logradouro;
            if (!customerStreetInput.value.trim() || customerStreetInput.dataset.autofilled === 'true') {
              customerStreetInput.value = streetVal;
              customerStreetInput.dataset.autofilled = 'true';
            }
          }
          if (data.localidade && customerCityInput) {
            const cityVal = data.uf ? `${data.localidade} / ${data.uf}` : data.localidade;
            if (!customerCityInput.value.trim() || customerCityInput.dataset.autofilled === 'true') {
              customerCityInput.value = cityVal;
              customerCityInput.dataset.autofilled = 'true';
            }
          }
          updateCheckoutReadiness();
          if (customerNameInput && !customerNameInput.value.trim()) {
            customerNameInput.focus();
          } else if (customerNumberInput && !customerNumberInput.value.trim()) {
            customerNumberInput.focus();
          }
          return;
        }
      }
    } catch (err) {
      console.warn('[JËZ Checkout] Falha ao consultar CEP via rede, utilizando fallback gracioso:', err);
    }

    // Fallback gracioso local para Montes Claros (Origem da artesã: CEPs 39400 a 39409)
    const prefix = parseInt(cleanCep.substring(0, 5), 10);
    if (prefix >= 39400 && prefix <= 39409) {
      if (customerCityInput && (!customerCityInput.value.trim() || customerCityInput.dataset.autofilled === 'true')) {
        customerCityInput.value = 'Montes Claros / MG';
        customerCityInput.dataset.autofilled = 'true';
        updateCheckoutReadiness();
      }
    }
  };

  const updateCheckoutReadiness = () => {
    if (!btnCheckout) return false;

    if (cart.length === 0) {
      btnCheckout.disabled = true;
      if (customerDataHint) {
        customerDataHint.className = 'customer-data-hint';
        customerDataHint.textContent = 'Adicione itens à sacola para iniciar.';
      }
      return false;
    }

    const rawCep = cepInput ? cepInput.value.replace(/\D/g, '') : '';
    const hasShipping = Boolean(shippingCost > 0 || shippingMethod);
    if (rawCep.length !== 8 || !hasShipping) {
      btnCheckout.disabled = true;
      if (customerDataHint) {
        customerDataHint.className = 'customer-data-hint';
        customerDataHint.textContent = 'Informe o CEP e calcule o frete para prosseguir.';
      }
      return false;
    }

    const rawName = customerNameInput ? customerNameInput.value.trim() : '';
    const safeName = sanitizeCustomerInput(rawName, 80);
    const nameWords = safeName.split(/\s+/).filter(w => w.length >= 2);
    if (nameWords.length < 2) {
      btnCheckout.disabled = true;
      if (customerDataHint) {
        customerDataHint.className = 'customer-data-hint';
        customerDataHint.textContent = 'Informe seu Nome e Sobrenome para identificação.';
      }
      return false;
    }

    const rawContact = customerContactInput ? customerContactInput.value.trim() : '';
    const safeContact = sanitizeCustomerInput(rawContact, 80);
    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeContact);
    const digitsOnly = safeContact.replace(/\D/g, '');
    const isPhone = digitsOnly.length >= 10;
    if (!isEmail && !isPhone) {
      btnCheckout.disabled = true;
      if (customerDataHint) {
        customerDataHint.className = 'customer-data-hint';
        customerDataHint.textContent = 'Informe um WhatsApp com DDD válido ou e-mail de contato.';
      }
      return false;
    }

    const safeStreet = sanitizeCustomerInput(customerStreetInput ? customerStreetInput.value : '', 120);
    if (safeStreet.length < 3) {
      btnCheckout.disabled = true;
      if (customerDataHint) {
        customerDataHint.className = 'customer-data-hint';
        customerDataHint.textContent = 'Informe a rua / logradouro de entrega.';
      }
      return false;
    }

    const safeNumber = sanitizeCustomerInput(customerNumberInput ? customerNumberInput.value : '', 40);
    if (safeNumber.length < 1) {
      btnCheckout.disabled = true;
      if (customerDataHint) {
        customerDataHint.className = 'customer-data-hint';
        customerDataHint.textContent = 'Informe o número da residência (ou S/N).';
      }
      return false;
    }

    const safeCity = sanitizeCustomerInput(customerCityInput ? customerCityInput.value : '', 60);
    if (safeCity.length < 3) {
      btnCheckout.disabled = true;
      if (customerDataHint) {
        customerDataHint.className = 'customer-data-hint';
        customerDataHint.textContent = 'Informe a cidade e UF para entrega.';
      }
      return false;
    }

    // Todos os dados válidos
    btnCheckout.disabled = false;
    if (customerDataHint) {
      customerDataHint.className = 'customer-data-hint valid';
      customerDataHint.textContent = 'Tudo preenchido! Pronto para finalizar no WhatsApp.';
    }
    return true;
  };

  const saveCart = () => {
    localStorage.setItem('jez_cart', JSON.stringify(cart));
  };

  // Resumo transparente de prazo na gaveta da sacola (JEZ-044).
  // Fila do atelie + confeccao da sacola = prazo total estimado de producao.
  const renderCartLeadTimeSummary = () => {
    const summaryEl = document.getElementById('cart-leadtime-summary');
    if (!summaryEl) return;
    const leadSummary = getCartLeadTimeSummary(cart);
    if (!leadSummary.hasCustom || leadSummary.totalDays <= 0) {
      summaryEl.hidden = true;
      return;
    }
    summaryEl.hidden = false;
    const queueEl = document.getElementById('cart-leadtime-queue');
    const productionEl = document.getElementById('cart-leadtime-production');
    const totalEl = document.getElementById('cart-leadtime-total');
    if (queueEl) queueEl.textContent = formatBusinessDays(leadSummary.queueDays);
    if (productionEl) productionEl.textContent = formatBusinessDays(leadSummary.productionDays);
    if (totalEl) totalEl.textContent = formatBusinessDays(leadSummary.totalDays);
  };

  const updateCartUI = () => {
    // Fila do atelie e prazo total (independe de a sacola estar vazia)
    renderCartLeadTimeSummary();

    // Total de itens
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';

    // Subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotalEl.textContent = formatCurrency(subtotal);

    // Frete e Total
    const total = subtotal + shippingCost;
    cartShippingEl.textContent = shippingCost > 0 ? formatCurrency(shippingCost) : (shippingMethod ? 'Grátis' : 'Calcule o frete');
    cartTotalEl.textContent = formatCurrency(total);

    // Renderização dos Itens
    if (cart.length === 0) {
      cartItemsContainer.style.display = 'none';
      cartEmptyState.style.display = 'block';
      if (customerInfoBox) customerInfoBox.style.display = 'none';
      btnCheckout.disabled = true;
      if (customerDataHint) {
        customerDataHint.className = 'customer-data-hint';
        customerDataHint.textContent = 'Adicione itens à sacola para iniciar.';
      }
      return;
    }

    cartItemsContainer.style.display = 'flex';
    cartEmptyState.style.display = 'none';
    if (customerInfoBox) customerInfoBox.style.display = 'flex';
    updateCheckoutReadiness();

    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      const safeId = escapeHtml(item.id);
      const safeName = escapeHtml(item.name);
      const safeImage = sanitizeImageUrl(item.image);
      const safeLeadTime = perPieceLeadTimeDays(item);
      const safeQty = Math.max(1, parseInt(item.quantity, 10) || 1);
      const safeBadge = isCustomOrderPiece(item)
        ? `Confecção: ${formatBusinessDays(safeLeadTime * safeQty)}`
        : 'Pronta Entrega';

      const itemContent = `
        <img src="${escapeHtml(safeImage)}" alt="${safeName}" class="cart-item-img">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${safeName}</h4>
          <span class="cart-item-badge">${escapeHtml(safeBadge)}</span>
          <span class="cart-item-price">${formatCurrency(item.price)}</span>
        </div>
        <div class="cart-item-controls">
          <button type="button" class="btn-remove-item" data-action="remove-cart" data-id="${safeId}" title="Remover item" aria-label="Remover ${safeName}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
          <div class="qty-stepper">
            <button type="button" class="qty-btn" data-action="change-qty" data-id="${safeId}" data-delta="-1" aria-label="Diminuir quantidade">−</button>
            <span class="qty-display">${safeQty}</span>
            <button type="button" class="qty-btn" data-action="change-qty" data-id="${safeId}" data-delta="1" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>
      `;
      el.innerHTML = itemContent; // needle-ignore: XSS_INNER_HTML (conteudo sanitizado via escapeHtml)
      cartItemsContainer.appendChild(el);
    });
  };

  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const isSoldOut = isProductSoldOut(product);
    if (isSoldOut) {
      showToast(`A peça "${product.name}" está esgotada no momento.`);
      return;
    }

    const availableStock = (product.stockQty !== undefined && product.stockQty !== null) ? Number(product.stockQty) : (product.isReady ? 1 : 999);
    const existingIndex = cart.findIndex(item => item.id === productId);
    const currentQtyInCart = existingIndex > -1 ? cart[existingIndex].quantity : 0;

    if (product.isReady && currentQtyInCart + 1 > availableStock) {
      showToast(`Limite de estoque: apenas ${availableStock} unidade(s) disponível(is) para pronta entrega.`);
      return;
    }

    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        isReady: product.isReady,
        stockQty: product.stockQty,
        leadTimeDays: product.leadTimeDays || 0,
        quantity: 1
      });
    }

    saveCart();
    updateCartUI();
    showToast(`"${product.name}" adicionado à sacola!`);
    openDrawer();
  };

  const changeQuantity = (productId, delta) => {
    const index = cart.findIndex(item => item.id === productId);
    if (index === -1) return;

    if (delta > 0) {
      const product = products.find(p => p.id === productId);
      if (product && product.isReady) {
        const availableStock = (product.stockQty !== undefined && product.stockQty !== null) ? Number(product.stockQty) : 1;
        if (cart[index].quantity + delta > availableStock) {
          showToast(`Limite de estoque: apenas ${availableStock} unidade(s) disponível(is).`);
          return;
        }
      }
    }

    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    saveCart();
    updateCartUI();
  };

  const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showToast('Peça removida da sacola.');
  };

  const openDrawer = () => {
    cartDrawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    cartDrawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  // --------------------------------------------------------------------------
  // 7. Cálculo de Frete Dinâmico (Origem Montes Claros - MG)
  // --------------------------------------------------------------------------
  const handleCalculateShipping = () => {
    const rawCep = cepInput.value.replace(/\D/g, '');
    if (rawCep.length !== 8) {
      shippingResult.style.display = 'block';
      shippingResult.style.color = 'var(--color-primary)';
      shippingResult.innerHTML = '<span class="shipping-alert-msg"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg> Informe um CEP válido com 8 dígitos.</span>';
      return;
    }

    btnCalcShipping.textContent = 'Calculando...';
    btnCalcShipping.disabled = true;
    lookupAddressByCep(rawCep);

    setTimeout(() => {
      // Simulação realista considerando origem em Montes Claros - MG (39400-000)
      const prefix = parseInt(rawCep.substring(0, 2), 10);
      let pacCost = 24.90;
      let pacDays = 5;
      let sedexCost = 42.90;
      let sedexDays = 2;

      // Se for de Minas Gerais (CEPs 30 a 39)
      if (prefix >= 30 && prefix <= 39) {
        pacCost = 16.50;
        pacDays = 3;
        sedexCost = 27.90;
        sedexDays = 1;
      } else if (prefix >= 1 && prefix <= 29) {
        // Região Sudeste (SP, RJ, ES)
        pacCost = 22.00;
        pacDays = 4;
        sedexCost = 36.50;
        sedexDays = 2;
      } else {
        // Demais regiões do Brasil
        pacCost = 32.00;
        pacDays = 7;
        sedexCost = 54.00;
        sedexDays = 3;
      }

      shippingCost = pacCost;
      shippingMethod = 'PAC';

      shippingResult.style.display = 'block';
      shippingResult.style.color = 'var(--color-badge-ready)';
      const shippingContent = `
        <div class="shipping-option">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
          <strong>PAC:</strong> ${formatCurrency(pacCost)} (${pacDays} a ${pacDays + 2} dias úteis)
        </div>
        <div class="shipping-option">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
          <strong>SEDEX:</strong> ${formatCurrency(sedexCost)} (${sedexDays} a ${sedexDays + 1} dias úteis)
        </div>
      `;
      shippingResult.innerHTML = shippingContent; // needle-ignore: XSS_INNER_HTML (conteudo sanitizado via formatCurrency)

      btnCalcShipping.textContent = 'Calcular';
      btnCalcShipping.disabled = false;
      updateCartUI();
      updateCheckoutReadiness();
    }, 500);
  };

  // Máscara de CEP automática e busca de endereço
  cepInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    const cleanCep = value;
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    e.target.value = value;
    if (cleanCep.length === 8) {
      lookupAddressByCep(cleanCep);
    }
    updateCheckoutReadiness();
  });

  // --------------------------------------------------------------------------
  // 8. Modal de Detalhes Rápido (Quick View) & Galeria Multi-Fotos (JEZ-019)
  // --------------------------------------------------------------------------
  let currentModalProductId = null;

  const updateVideoToggleButtonState = (isPlaying) => {
    if (!modalVideoToggleBtn) return;
    if (isPlaying) {
      modalVideoToggleBtn.innerHTML = '<svg class="jez-craft-icon jez-icon-pause-craft" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="5" x2="8" y2="19"></line><line x1="16" y1="5" x2="16" y2="19"></line></svg>';
      modalVideoToggleBtn.setAttribute('aria-label', 'Pausar vídeo em loop');
      modalVideoToggleBtn.title = 'Pausar vídeo em loop';
    } else {
      modalVideoToggleBtn.innerHTML = '<svg class="jez-craft-icon jez-icon-play-craft" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4.5l14 7.5-14 7.5V4.5z" fill="currentColor" fill-opacity="0.3"></path></svg>';
      modalVideoToggleBtn.setAttribute('aria-label', 'Reproduzir vídeo em loop');
      modalVideoToggleBtn.title = 'Reproduzir vídeo em loop';
    }
  };

  const selectModalPhoto = (index) => {
    if (!currentModalPhotos || currentModalPhotos.length === 0) return;
    if (index < 0) index = currentModalPhotos.length - 1;
    if (index >= currentModalPhotos.length) index = 0;
    currentModalPhotoIndex = index;

    const rawMedia = currentModalPhotos[index];
    const isVideo = isVideoUrl(rawMedia);
    const product = currentModalProductId ? products.find(p => p.id === currentModalProductId) : null;
    const fallbackPoster = product ? (product.image || '') : '';

    if (isVideo) {
      const videoUrl = typeof rawMedia === 'string' ? rawMedia : (rawMedia.url || '');
      // Poster do primeiro frame do video; a foto da peca so entra como ultimo
      // recurso do blur/capa (a miniatura nunca herda a foto estatica).
      const posterCandidate = resolveVideoPoster(rawMedia) || fallbackPoster;
      const safePoster = sanitizeImageUrl(posterCandidate) || (product && product.image ? sanitizeImageUrl(product.image) : '');

      if (modalImg) {
        modalImg.style.display = 'none';
      }
      if (modalImgBlur) {
        modalImgBlur.src = safePoster;
        modalImgBlur.style.display = safePoster ? 'block' : 'none';
      }

      if (modalVideo) {
        modalVideo.style.display = 'block';
        modalVideo.style.background = 'transparent';
        modalVideo.style.backgroundColor = 'transparent';
        if (safePoster) modalVideo.poster = safePoster;
        if (modalVideo.src !== videoUrl) {
          modalVideo.src = videoUrl;
        }

        if (shouldAutoplayMotion()) {
          const playPromise = modalVideo.play();
          if (playPromise && typeof playPromise.catch === 'function') {
            playPromise
              .then(() => updateVideoToggleButtonState(true))
              .catch((err) => {
                if (typeof console !== 'undefined' && typeof console.debug === 'function') {
                  console.debug('[JËZ Video] Autoplay suprimido pela política do navegador:', err);
                }
                updateVideoToggleButtonState(false);
              });
          } else {
            updateVideoToggleButtonState(true);
          }
        } else {
          modalVideo.pause();
          updateVideoToggleButtonState(false);
        }
      }

      if (modalVideoToggleBtn) {
        modalVideoToggleBtn.style.display = 'inline-flex';
      }
    } else {
      if (modalVideo) {
        cleanupVideoPlayback(modalVideo);
        modalVideo.style.display = 'none';
      }
      if (modalVideoToggleBtn) {
        modalVideoToggleBtn.style.display = 'none';
      }

      const photoUrl = sanitizeImageUrl(typeof rawMedia === 'string' ? rawMedia : (rawMedia.url || ''));
      if (modalImg) {
        modalImg.src = photoUrl;
        modalImg.style.display = 'block';
      }
      if (modalImgBlur) {
        modalImgBlur.src = photoUrl;
        modalImgBlur.style.display = 'block';
      }
    }

    if (modalPhotoCounter) {
      modalPhotoCounter.textContent = `${index + 1} / ${currentModalPhotos.length}`;
    }

    if (modalGalleryThumbs) {
      const thumbs = modalGalleryThumbs.querySelectorAll('.modal-thumb');
      thumbs.forEach((t, i) => {
        t.classList.toggle('active', i === index);
      });
    }
  };

  const openQuickView = (productId) => {
    const rawProduct = products.find(p => p.id === productId);
    if (!rawProduct) return;
    const product = cureProductMedia(rawProduct, defaultProducts);

    currentModalProductId = productId;

    // Configura galeria de fotos e mídias (JEZ-019, JEZ-032 & JEZ-037)
    let galleryPhotos = (Array.isArray(product.images) && product.images.length > 0)
      ? [...product.images]
      : [product.image];

    // Regra Inviolável (JEZ-037): O vídeo NUNCA deve ser a primeira mídia (índice 0)
    if (isVideoUrl(galleryPhotos[0])) {
      const nonVideoIdx = galleryPhotos.findIndex(img => !isVideoUrl(img));
      if (nonVideoIdx > 0) {
        const [photo] = galleryPhotos.splice(nonVideoIdx, 1);
        galleryPhotos.unshift(photo);
      } else {
        const fallbackCover = (product.image && !isVideoUrl(product.image))
          ? product.image
          : (product.id === 'blusa-teia' ? 'assets/products/blusa_teia.webp' : 'assets/products/tote_cherry.webp');
        galleryPhotos.unshift(fallbackCover);
      }
    }

    currentModalPhotos = galleryPhotos;
    currentModalPhotoIndex = 0;

    if (modalGalleryThumbs) {
      modalGalleryThumbs.innerHTML = '';
      if (currentModalPhotos.length > 1) {
        currentModalPhotos.forEach((rawMedia, idx) => {
          const isVid = isVideoUrl(rawMedia);
          const mediaUrl = (rawMedia && typeof rawMedia === 'object' && typeof rawMedia.url === 'string')
            ? rawMedia.url
            : rawMedia;
          let photoUrl = mediaUrl;
          if (isVid) {
            // JEZ-038: a miniatura de video exibe o banner/poster do primeiro
            // frame e NUNCA herda a foto estatica anterior da peca.
            photoUrl = resolveVideoPoster(rawMedia) || VIDEO_THUMB_POSTER_PLACEHOLDER;
          }
          const thumbBtn = document.createElement('button');
          thumbBtn.type = 'button';
          thumbBtn.className = `modal-thumb ${idx === 0 ? 'active' : ''} ${isVid ? 'is-video' : ''}`;
          thumbBtn.setAttribute('aria-label', `${isVid ? 'Ver vídeo' : 'Ver foto'} ${idx + 1} de ${product.name}`);
          const thumbImg = document.createElement('img');
          thumbImg.src = sanitizeImageUrl(photoUrl);
          thumbImg.alt = '';
          thumbImg.loading = 'lazy';
          thumbImg.addEventListener('error', () => {
            // Poster derivado inexistente (404): cai para a etiqueta têxtil
            // em vez de exibir imagem quebrada ou a foto da peca.
            if (thumbImg.dataset.posterFallback === '1') return;
            thumbImg.dataset.posterFallback = '1';
            thumbImg.src = sanitizeImageUrl(VIDEO_THUMB_POSTER_PLACEHOLDER);
          });
          thumbBtn.appendChild(thumbImg);
          thumbBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            selectModalPhoto(idx);
          });
          modalGalleryThumbs.appendChild(thumbBtn);
        });
        modalGalleryThumbs.style.display = 'flex';
        if (modalBtnPrev) modalBtnPrev.style.display = 'flex';
        if (modalBtnNext) modalBtnNext.style.display = 'flex';
        if (modalPhotoCounter) modalPhotoCounter.style.display = 'block';
      } else {
        modalGalleryThumbs.style.display = 'none';
        if (modalBtnPrev) modalBtnPrev.style.display = 'none';
        if (modalBtnNext) modalBtnNext.style.display = 'none';
        if (modalPhotoCounter) modalPhotoCounter.style.display = 'none';
      }
    }

    const isSoldOut = isProductSoldOut(product);

    const modalImgWrap = document.getElementById('modal-img-wrap');
    if (modalImgWrap) {
      modalImgWrap.classList.toggle('has-gallery', currentModalPhotos.length > 1);
      modalImgWrap.classList.toggle('is-sold-out', isSoldOut);
    }

    selectModalPhoto(0);

    modalImg.alt = product.name;
    modalCategory.textContent = product.categoryLabel;
    modalTitle.textContent = product.name;
    modalPrice.textContent = formatCurrency(product.price);
    modalDesc.textContent = product.description;
    modalDimensions.textContent = product.dimensions;
    modalMaterials.textContent = product.materials;

    if (isSoldOut) {
      modalBadge.className = 'product-badge badge-sold-out';
      modalBadge.textContent = 'Esgotada';
      if (modalBtnAddCart) {
        modalBtnAddCart.disabled = true;
        modalBtnAddCart.classList.add('is-disabled');
        modalBtnAddCart.setAttribute('aria-disabled', 'true');
        modalBtnAddCart.innerHTML = 'Peça Esgotada';
      }
    } else if (product.isReady) {
      modalBadge.className = 'product-badge badge-ready';
      modalBadge.textContent = 'Pronta Entrega';
      if (modalBtnAddCart) {
        modalBtnAddCart.disabled = false;
        modalBtnAddCart.classList.remove('is-disabled');
        modalBtnAddCart.removeAttribute('aria-disabled');
        modalBtnAddCart.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> Comprar Peça';
      }
    } else {
      modalBadge.className = 'product-badge badge-order';
      modalBadge.textContent = `Feito sob Encomenda (${pieceEstimatedLeadTimeDays(product)} dias úteis)`;
      if (modalBtnAddCart) {
        modalBtnAddCart.disabled = false;
        modalBtnAddCart.classList.remove('is-disabled');
        modalBtnAddCart.removeAttribute('aria-disabled');
        modalBtnAddCart.innerHTML = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg> Comprar Peça';
      }
    }

    // Botão de WhatsApp direcionado para a peça
    const phone = '553892322411'; // WhatsApp da Jéssica (+55 38 9232-2411)
    let modalMessage = `Olá Jéssica! Tenho uma dúvida sobre a peça "${product.name}" que vi no site da JËZ collection.`;
    if (isCustomOrderPiece(product)) {
      modalMessage += ` Prazo estimado desta peça: fila do ateliê ${formatBusinessDays(getQueueBacklogDays())} + confecção ${formatBusinessDays(perPieceLeadTimeDays(product))} = ${formatBusinessDays(pieceEstimatedLeadTimeDays(product))} (1 unidade), sem contar o prazo de transporte.`;
    }
    const msg = encodeURIComponent(modalMessage);
    modalBtnWhatsapp.href = `https://wa.me/${phone}?text=${msg}`;

    productModalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    cleanupVideoPlayback(modalVideo);
    if (modalVideo) {
      modalVideo.style.display = 'none';
    }
    if (modalVideoToggleBtn) {
      modalVideoToggleBtn.style.display = 'none';
    }
    productModalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    currentModalProductId = null;
  };

  // --------------------------------------------------------------------------
  // 9. Checkout & Finalização
  // --------------------------------------------------------------------------
  btnCheckout.addEventListener('click', async () => {
    if (!updateCheckoutReadiness()) {
      showToast('Por favor, preencha seu nome e endereço completo para finalizar.');
      return;
    }

    if (!cart || cart.length === 0) {
      showToast('Sua sacola está vazia.');
      return;
    }

    // Pre-verificacao local de estoque antes de chamar a nuvem.
    // RN-JEZ-001: pecas sob encomenda nunca sao bloqueadas por ausencia de estoque.
    for (const item of cart) {
      const prod = products.find(p => p.id === item.id);
      if (!prod) continue;
      if (isProductSoldOut(prod)) {
        showToast(`A peça "${prod.name}" esgotou no momento. Remova-a da sacola para prosseguir.`);
        return;
      }
      if (prod.isReady === true) {
        const stock = (prod.stockQty !== undefined && prod.stockQty !== null) ? Number(prod.stockQty) : 1;
        if (item.quantity > stock) {
          showToast(`Quantidade solicitada de "${prod.name}" (${item.quantity}) excede o estoque disponível (${stock}).`);
          return;
        }
      }
    }

    const rawCep = cepInput.value.replace(/\D/g, '');
    const formattedCep = cepInput.value.trim() || (rawCep.length === 8 ? `${rawCep.slice(0, 5)}-${rawCep.slice(5)}` : '');
    const safeCustomerName = sanitizeCustomerInput(customerNameInput ? customerNameInput.value : '', 80) || 'Cliente';
    const safeContact = sanitizeCustomerInput(customerContactInput ? customerContactInput.value : '', 80);
    const safeStreet = sanitizeCustomerInput(customerStreetInput ? customerStreetInput.value : '', 120);
    const safeNumber = sanitizeCustomerInput(customerNumberInput ? customerNumberInput.value : '', 40);
    const safeCity = sanitizeCustomerInput(customerCityInput ? customerCityInput.value : '', 60);

    const fullAddress = `${safeStreet}, nº ${safeNumber} - ${safeCity}`;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + shippingCost;
    
    // Resumo dos itens e mensagem personalizada
    const itemsText = cart.map(i => `• ${i.quantity}x ${i.name} (${formatCurrency(i.price * i.quantity)})`).join('\n');
    const pinIcon = String.fromCodePoint(0x1F4CD);
    // Prazo dinamico da fila do atelie (JEZ-044): fila + confeccao da sacola.
    const cartLeadTime = getCartLeadTimeSummary(cart);
    const buildOrderMessage = (leadInfo) => {
      let text = `Olá Jéssica! Me chamo ${safeCustomerName} e gostaria de finalizar meu pedido na JËZ Collection:\n\n${itemsText}\n\n`;
      if (leadInfo && leadInfo.hasCustom) {
        text += `Prazo estimado de produção: fila do ateliê ${formatBusinessDays(leadInfo.queueDays)} + confecção ${formatBusinessDays(leadInfo.productionDays)} = ${formatBusinessDays(leadInfo.totalDays)} (sem contar o prazo de transporte)\n`;
      }
      if (shippingCost > 0) {
        text += `Frete estimado: ${formatCurrency(shippingCost)}\n`;
      }
      text += `*Total: ${formatCurrency(total)}*\n\n`;
      if (safeContact) {
        text += `Contato: ${safeContact}\n`;
      }
      text += `${pinIcon} Endereço de envio: ${fullAddress} — CEP ${formattedCep}\n\n`;
      text += `Como posso efetuar o pagamento via Pix?`;
      return text;
    };
    let message = buildOrderMessage(cartLeadTime);

    // Registra pedido
    const newOrderId = 'JEZ-' + Math.floor(1000 + Math.random() * 9000);
    const hasCustomItems = cartLeadTime.hasCustom;
    const customLeadTimeDays = cart.reduce((maxDays, i) => {
      const isCustom = i.isReady === false || (i.leadTimeDays && Number(i.leadTimeDays) > 0);
      return isCustom ? Math.max(maxDays, Number(i.leadTimeDays) || 0) : maxDays;
    }, 0);
    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString(),
      customer: safeCustomerName,
      contact: safeContact,
      address: fullAddress,
      cep: formattedCep,
      items: cart.map(i => ({
        id: i.id || '',
        name: i.name,
        quantity: i.quantity,
        price: i.price,
        isReady: i.isReady !== undefined ? Boolean(i.isReady) : true,
        leadTimeDays: i.leadTimeDays ? Number(i.leadTimeDays) : 0
      })),
      hasCustomProduction: hasCustomItems,
      leadTimeDays: customLeadTimeDays,
      orderProductionDays: cartLeadTime.productionDays,
      queueDaysAtOrder: cartLeadTime.queueDays,
      totalEstimatedLeadTimeDays: cartLeadTime.totalDays,
      subtotal: subtotal,
      shipping: shippingCost,
      total: total,
      status: 'aguardando-pagamento',
      trackingCode: ''
    };

    // Bloqueia botão durante verificação de concorrência
    btnCheckout.disabled = true;
    const originalBtnText = btnCheckout.innerHTML;
    btnCheckout.textContent = 'Verificando estoque...';

    try {
      // 1. Verificação de concorrência atômica no Cloud Firestore (runTransaction)
      let checkoutResult = null;
      if (window.jezFirebase && typeof window.jezFirebase.checkoutWithStockCheck === 'function') {
        checkoutResult = await window.jezFirebase.checkoutWithStockCheck(newOrder, cart);
      } else if (window.jezFirebase && typeof window.jezFirebase.createOrder === 'function') {
        await window.jezFirebase.createOrder(newOrder);
      }

      // 1.1 Fila autoritativa do atelie no instante do pedido (queueDaysAtOrder).
      if (checkoutResult && cartLeadTime.hasCustom && checkoutResult.totalEstimatedLeadTimeDays !== undefined) {
        message = buildOrderMessage({
          hasCustom: true,
          queueDays: parseInt(checkoutResult.queueDaysAtOrder, 10) || 0,
          productionDays: parseInt(checkoutResult.orderProductionDays, 10) || 0,
          totalDays: parseInt(checkoutResult.totalEstimatedLeadTimeDays, 10) || 0
        });
      }

      // 2. Subtrai estoque no armazenamento local (localStorage).
      // Apenas pronta entrega sofre deducao fisica; encomendas permanecem intactas.
      try {
        const catalogRaw = localStorage.getItem('jez_catalog');
        if (catalogRaw) {
          const catList = JSON.parse(catalogRaw);
          cart.forEach(cartItem => {
            const prod = catList.find(p => p.id === cartItem.id);
            if (prod && isLocalStockTrackedPiece(prod)) {
              const current = (prod.stockQty !== undefined && prod.stockQty !== null) ? Number(prod.stockQty) : 1;
              const deducted = Number(cartItem.quantity) || 1;
              prod.stockQty = Math.max(0, current - deducted);
            }
          });
          localStorage.setItem('jez_catalog', JSON.stringify(catList));
        }
      } catch (stockErr) {
        console.warn('Erro ao atualizar estoque local:', stockErr);
      }

      // 3. Salva pedido localmente no histórico
      try {
        const currentOrders = JSON.parse(localStorage.getItem('jez_orders') || '[]');
        currentOrders.unshift(newOrder);
        localStorage.setItem('jez_orders', JSON.stringify(currentOrders));
      } catch (e) {
        console.error(e);
      }

      // 3.1 Fila do atelie: incremento otimista local (o snapshot confirma depois).
      if (cartLeadTime.productionDays > 0) {
        productionQueue.totalBacklogDays = getQueueBacklogDays() + cartLeadTime.productionDays;
        productionQueue.activeOrdersCount = (parseInt(productionQueue.activeOrdersCount, 10) || 0) + 1;
      }

      // 4. Limpa sacola e atualiza vitrine
      cart = [];
      saveCart();
      updateCartUI();
      closeDrawer();
      products = getProducts();
      renderCatalog();

      const phone = '553892322411'; // WhatsApp da Jéssica (+55 38 9232-2411)
      const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
      
      showToast('Pedido confirmado! Redirecionando para o WhatsApp da Jéssica...');
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 700);

    } catch (err) {
      console.error('[JËZ Checkout]', err);
      if (err.message && err.message.startsWith('ESTOQUE_ESGOTADO:')) {
        const parts = err.message.split(':');
        const soldPieceName = parts[1] || 'Uma das peças';
        const remainingStock = parseInt(parts[2] || '0', 10);
        if (remainingStock <= 0) {
          showToast(`A peça "${soldPieceName}" acabou de ser comprada por outro cliente e está esgotada no momento.`);
        } else {
          showToast(`Apenas ${remainingStock} unidade(s) de "${soldPieceName}" restante(s) em estoque.`);
        }
        // Atualiza vitrine imediatamente com os dados frescos
        if (window.jezFirebase && typeof window.jezFirebase.fetchProducts === 'function') {
          window.jezFirebase.fetchProducts().then(prods => {
            if (prods && prods.length) {
              localStorage.setItem('jez_catalog', JSON.stringify(prods));
              products = getProducts();
              renderCatalog();
            }
          }).catch(() => {});
        } else {
          products = getProducts();
          renderCatalog();
        }
      } else {
        showToast('Ocorreu um erro ao validar o pedido. Tente novamente em instantes.');
      }
    } finally {
      btnCheckout.disabled = false;
      btnCheckout.innerHTML = originalBtnText; // needle-ignore: XSS_INNER_HTML (restaura texto estatico)
      updateCheckoutReadiness();
    }
  });

  // --------------------------------------------------------------------------
  // 10. Event Listeners Globais
  // --------------------------------------------------------------------------
  // Filtros de Categoria
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      if (isCatalogLoaded) {
        renderCatalog();
      }
    });
  });

  // Cart Drawer
  cartButton.addEventListener('click', openDrawer);
  btnCloseDrawer.addEventListener('click', closeDrawer);
  cartDrawerBackdrop.addEventListener('click', (e) => {
    if (e.target === cartDrawerBackdrop) closeDrawer();
  });

  // Monitoramento das Entradas de Dados do Cliente
  if (customerNameInput) {
    customerNameInput.addEventListener('input', updateCheckoutReadiness);
  }
  if (customerContactInput) {
    customerContactInput.addEventListener('input', updateCheckoutReadiness);
  }
  if (customerStreetInput) {
    customerStreetInput.addEventListener('input', () => {
      delete customerStreetInput.dataset.autofilled;
      updateCheckoutReadiness();
    });
  }
  if (customerNumberInput) {
    customerNumberInput.addEventListener('input', updateCheckoutReadiness);
  }
  if (customerCityInput) {
    customerCityInput.addEventListener('input', () => {
      delete customerCityInput.dataset.autofilled;
      updateCheckoutReadiness();
    });
  }

  // Modal Rápido
  btnCloseModal.addEventListener('click', closeModal);
  productModalBackdrop.addEventListener('click', (e) => {
    if (e.target === productModalBackdrop) closeModal();
  });

  modalBtnAddCart.addEventListener('click', () => {
    if (currentModalProductId) {
      const prod = products.find(p => p.id === currentModalProductId);
      const isSoldOut = isProductSoldOut(prod);
      if (isSoldOut) {
        showToast('Esta peça está esgotada no momento.');
        return;
      }
      addToCart(currentModalProductId);
      closeModal();
    }
  });

  // Delegação Segura de Eventos do Catálogo (Anti-Injeção Inline)
  productsGrid.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-action]');
    if (!trigger) return;
    const action = trigger.getAttribute('data-action');
    const productId = trigger.getAttribute('data-id');
    if (action === 'quickview' && productId) {
      openQuickView(productId);
    } else if (action === 'add-cart' && productId) {
      addToCart(productId);
    }
  });

  // Delegação Segura de Eventos do Carrinho
  cartItemsContainer.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-action]');
    if (!trigger) return;
    const action = trigger.getAttribute('data-action');
    const id = trigger.getAttribute('data-id');
    if (action === 'remove-cart' && id) {
      removeFromCart(id);
    } else if (action === 'change-qty' && id) {
      const delta = parseInt(trigger.getAttribute('data-delta'), 10) || 0;
      changeQuantity(id, delta);
    }
  });

  // Modal de Privacidade & LGPD (Morgan - Cibersegurança)
  const btnOpenPrivacy = document.getElementById('btn-open-privacy');
  const privacyModalBackdrop = document.getElementById('privacy-modal-backdrop');
  const btnClosePrivacy = document.getElementById('btn-close-privacy');
  const btnPrivacyConfirm = document.getElementById('btn-privacy-confirm');

  const openPrivacyModal = () => {
    if (privacyModalBackdrop) {
      privacyModalBackdrop.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  };

  const closePrivacyModal = () => {
    if (privacyModalBackdrop) {
      privacyModalBackdrop.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  if (btnOpenPrivacy) btnOpenPrivacy.addEventListener('click', openPrivacyModal);
  if (btnClosePrivacy) btnClosePrivacy.addEventListener('click', closePrivacyModal);
  if (btnPrivacyConfirm) btnPrivacyConfirm.addEventListener('click', closePrivacyModal);
  if (privacyModalBackdrop) {
    privacyModalBackdrop.addEventListener('click', (e) => {
      if (e.target === privacyModalBackdrop) closePrivacyModal();
    });
  }

  // Tecla ESC para fechar modais e setas para navegar fotos
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
      closePrivacyModal();
    } else if (productModalBackdrop && productModalBackdrop.classList.contains('active')) {
      if (e.key === 'ArrowLeft') {
        selectModalPhoto(currentModalPhotoIndex - 1);
      } else if (e.key === 'ArrowRight') {
        selectModalPhoto(currentModalPhotoIndex + 1);
      }
    }
  });

  // Navegação pelos botões do Quick View (JEZ-019)
  if (modalBtnPrev) {
    modalBtnPrev.addEventListener('click', (e) => {
      e.stopPropagation();
      selectModalPhoto(currentModalPhotoIndex - 1);
    });
  }

  if (modalBtnNext) {
    modalBtnNext.addEventListener('click', (e) => {
      e.stopPropagation();
      selectModalPhoto(currentModalPhotoIndex + 1);
    });
  }

  // Controle de Play/Pause suave do Vídeo em Loop (JEZ-032)
  if (modalVideoToggleBtn) {
    modalVideoToggleBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (!modalVideo) return;
      if (modalVideo.paused) {
        const playPromise = modalVideo.play();
        if (playPromise && typeof playPromise.catch === 'function') {
          playPromise
            .then(() => updateVideoToggleButtonState(true))
            .catch((err) => {
              if (typeof console !== 'undefined' && typeof console.debug === 'function') {
                console.debug('[JËZ Video] Falha ao reproduzir vídeo:', err);
              }
            });
        } else {
          updateVideoToggleButtonState(true);
        }
      } else {
        modalVideo.pause();
        updateVideoToggleButtonState(false);
      }
    });
  }

  if (modalVideo) {
    modalVideo.addEventListener('play', () => updateVideoToggleButtonState(true));
    modalVideo.addEventListener('pause', () => updateVideoToggleButtonState(false));
  }

  // Frete
  btnCalcShipping.addEventListener('click', handleCalculateShipping);
  cepInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleCalculateShipping();
  });

  // Header com efeito de rolagem
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --------------------------------------------------------------------------
  // 12. Renderização e Interatividade do Card Polaroid Hero (JEZ-015 - Lumi & Ariel)
  // --------------------------------------------------------------------------
  const heroFeaturedCard = document.getElementById('hero-featured-card');

  const renderHeroSkeleton = () => {
    if (!heroFeaturedCard) return;
    heroFeaturedCard.classList.add('is-skeleton');
    heroFeaturedCard.setAttribute('aria-busy', 'true');
    heroFeaturedCard.setAttribute('aria-label', 'Carregando peca em destaque do atelie...');
  };

  const renderHeroFeaturedCard = (currentProductsList = null) => {
    if (!heroFeaturedCard) return;

    heroFeaturedCard.classList.remove('is-skeleton');
    heroFeaturedCard.removeAttribute('aria-busy');

    const allProducts = (Array.isArray(currentProductsList) && currentProductsList.length > 0)
      ? currentProductsList
      : ((products && products.length > 0) ? products : getProducts());

    // 1. Verifica se alguma peça possui flag explícita de destaque vinda do banco (isFeatured / featured)
    const featuredByFlag = allProducts.find(p => p.isFeatured === true || p.featured === true);

    // 2. ID salvo em localStorage ou sincronizado do Firebase config/featured
    const savedFeaturedId = localStorage.getItem('jez_featured_product_id');

    // 3. Resolução da peça em destaque: flag explícita > id configurado > tote-cherry > primeira peça do catálogo
    let featuredProduct = null;
    if (featuredByFlag) {
      featuredProduct = featuredByFlag;
    } else if (savedFeaturedId) {
      featuredProduct = allProducts.find(p => p.id === savedFeaturedId);
    }
    if (!featuredProduct) {
      featuredProduct = allProducts.find(p => p.id === 'tote-cherry') || allProducts[0];
    }

    if (!featuredProduct) return;

    heroFeaturedCard.setAttribute('data-product-id', featuredProduct.id);
    heroFeaturedCard.setAttribute('aria-label', `Ver detalhes da peça em destaque: ${featuredProduct.name}`);

    const nameEl = document.getElementById('hero-featured-name') || heroFeaturedCard.querySelector('.hero-card-name');
    const priceEl = document.getElementById('hero-featured-price') || heroFeaturedCard.querySelector('.hero-card-price');
    const imgEl = document.getElementById('hero-featured-img') || heroFeaturedCard.querySelector('img');
    const webpEl = document.getElementById('hero-featured-webp') || heroFeaturedCard.querySelector('source[type="image/webp"]');

    if (nameEl) nameEl.textContent = featuredProduct.name;
    if (priceEl) priceEl.textContent = formatCurrency(featuredProduct.price);
    if (imgEl) {
      imgEl.src = sanitizeImageUrl(featuredProduct.image);
      imgEl.alt = `Destaque: ${featuredProduct.name}`;
      // JEZ-040: o destaque do Hero e o candidato a LCP, mantem prioridade maxima
      // e decodificacao sincrona mesmo quando o src e trocado em runtime.
      imgEl.setAttribute('fetchpriority', 'high');
      imgEl.setAttribute('decoding', 'sync');
    }
    if (webpEl) {
      if (featuredProduct.image && typeof featuredProduct.image === 'string' && featuredProduct.image.startsWith('assets/')) {
        webpEl.srcset = featuredProduct.image.replace(/\.(jpg|jpeg|png)$/i, '.webp');
      } else {
        webpEl.removeAttribute('srcset');
      }
    }

    try {
      localStorage.setItem('jez_featured_product_cache', JSON.stringify({
        id: featuredProduct.id,
        name: featuredProduct.name,
        price: featuredProduct.price,
        formattedPrice: formatCurrency(featuredProduct.price),
        image: sanitizeImageUrl(featuredProduct.image),
        webp: (featuredProduct.image && typeof featuredProduct.image === 'string' && featuredProduct.image.startsWith('assets/')) ? featuredProduct.image.replace(/\.(jpg|jpeg|png)$/i, '.webp') : ''
      }));
    } catch (e) {
      console.warn('[JËZ Cache] Falha ao persistir produto em destaque no localStorage:', e);
    }
  };

  // --------------------------------------------------------------------------
  // 11. Exposição Pública para Event Handlers em HTML Inline
  // --------------------------------------------------------------------------
  window.jezApp = {
    addToCart,
    changeQuantity,
    removeFromCart,
    openQuickView,
    openDrawer,
    closeDrawer,
    cureProductMedia,
    cureProductListMedia,
    mergeCloudCatalogWithFactory,
    isVideoUrl,
    renderHeroSkeleton,
    renderHeroFeaturedCard
  };

  if (heroFeaturedCard) {
    heroFeaturedCard.addEventListener('click', () => {
      const prodId = heroFeaturedCard.getAttribute('data-product-id') || 'tote-cherry';
      openQuickView(prodId);
    });

    heroFeaturedCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const prodId = heroFeaturedCard.getAttribute('data-product-id') || 'tote-cherry';
        openQuickView(prodId);
      }
    });
  }

  // Sincronização em tempo real caso a artesã edite peças ou altere o destaque em outra aba
  window.addEventListener('storage', (e) => {
    if (e.key === 'jez_catalog' || e.key === 'jez_custom_products' || e.key === 'jez_featured_product_id') {
      isCatalogLoaded = true;
      renderCatalog();
      renderHeroFeaturedCard();
    }
  });

  window.addEventListener('focus', () => {
    if (isCatalogLoaded) {
      renderCatalog();
      renderHeroFeaturedCard();
    }
  });

  // Inicializacao (JEZ-036, JEZ-038 & JEZ-040: Stale-While-Revalidate com Shimmer de Atelie)
  const FALLBACK_CATALOG_TIMEOUT_MS = 4000;
  const FALLBACK_CATALOG_LAST_RESORT_MS = 12000;
  let fallbackLastResortTimeout = null;

  const clearCatalogFallbacks = () => {
    if (fallbackCatalogTimeout) {
      clearTimeout(fallbackCatalogTimeout);
      fallbackCatalogTimeout = null;
    }
    if (fallbackLastResortTimeout) {
      clearTimeout(fallbackLastResortTimeout);
      fallbackLastResortTimeout = null;
    }
  };

  const cloudIsExplicitlyOffline = () => cloudStatus === false ||
    (typeof navigator !== 'undefined' && navigator.onLine === false);

  const activateFactoryFallback = (reason) => {
    if (isCatalogLoaded) return;
    clearCatalogFallbacks();
    isCatalogLoaded = true;
    products = getProducts();
    renderCatalog();
    renderHeroFeaturedCard(products);
    console.warn('[JËZ Catalogo] Contingencia de fabrica acionada:', reason);
  };

  if (hasLocalCatalog) {
    renderCatalog();
    renderHeroFeaturedCard();
  } else {
    renderSkeletons(6);
    renderHeroSkeleton();
    // Enquanto a nuvem estiver ativa ou em handshake, os skeletons shimmer permanecem
    // visiveis e o catalogo salta direto para as pecas reais do snapshot.
    // O catalogo mockado de fabrica NAO aparece no meio da carga fria.
    fallbackCatalogTimeout = setTimeout(() => {
      if (isCatalogLoaded) return;
      if (cloudIsExplicitlyOffline()) {
        activateFactoryFallback('nuvem indisponivel no boot');
        return;
      }
      // Handshake ainda em curso: preserva os skeletons e arma um unico ultimo recurso
      // para o usuario nunca ficar preso em shimmer caso o snapshot nunca chegue.
      fallbackCatalogTimeout = null;
      if (!fallbackLastResortTimeout) {
        fallbackLastResortTimeout = setTimeout(() => {
          fallbackLastResortTimeout = null;
          if (!isCatalogLoaded) {
            activateFactoryFallback('snapshot da nuvem nao chegou no prazo limite');
          }
        }, FALLBACK_CATALOG_LAST_RESORT_MS - FALLBACK_CATALOG_TIMEOUT_MS);
      }
    }, FALLBACK_CATALOG_TIMEOUT_MS);
  }
  updateCartUI();

  // Status explicito da nuvem: true mantem skeleton; false aciona contingencia imediata.
  window.addEventListener('jez-cloud-status', (e) => {
    const online = e.detail && typeof e.detail.online === 'boolean' ? e.detail.online : null;
    if (online !== null) cloudStatus = online;
    if (online === false && !isCatalogLoaded) {
      activateFactoryFallback('evento jez-cloud-status offline');
    }
  });

  // Perda de conectividade detectada pelo proprio navegador
  window.addEventListener('offline', () => {
    cloudStatus = false;
    if (!isCatalogLoaded) {
      activateFactoryFallback('navigator offline');
    }
  });

  // Sincronização em Nuvem (Firebase Cloud Firestore — JEZ-021)
  const initCloudSync = () => {
    let bound = false;
    const bindSync = () => {
      if (typeof window === 'undefined' || !window.jezFirebase || bound) return false;
      bound = true;

      window.jezFirebase.onProductsChange((cloudProducts) => {
        if (Array.isArray(cloudProducts) && cloudProducts.length > 0) {
          isCatalogLoaded = true;
          cloudStatus = true;
          clearCatalogFallbacks();
          const curedList = cureProductListMedia(cloudProducts, defaultProducts);
          // Merge defensivo: nuvem manda, pecas editoriais ausentes sao preservadas
          const sorted = sortProductsByCuratedOrder(mergeCloudCatalogWithFactory(curedList, defaultProducts));
          const mapped = sorted
            .filter(p => p.status !== 'suspended' && !p.isSuspended && !p.isDeleted)
            .map(p => {
              const cured = cureProductMedia(p, defaultProducts);
              return {
                ...cured,
                isReady: cured.status ? cured.status === 'ready' : (cured.isReady !== undefined ? cured.isReady : true),
                stockQty: cured.stockQty !== undefined && cured.stockQty !== null ? Number(cured.stockQty) : (cured.status === 'ready' || (cured.status !== 'order' && cured.isReady) ? 1 : 0)
              };
            });
          persistCatalogCache(mapped);
          products = mapped;
          renderCatalog(products);
          renderHeroFeaturedCard(products);
        }
      });

      window.jezFirebase.seedInitialProductsIfEmpty(defaultProducts);

      window.jezFirebase.onFeaturedChange((featuredId) => {
        if (featuredId) {
          localStorage.setItem('jez_featured_product_id', featuredId);
          renderHeroFeaturedCard(products);
        }
      });

      // Fila dinamica de producao (JEZ-044): snapshot reativo + hidratacao inicial.
      bindProductionQueue();
      return true;
    };

    // Escuta o status ANTES de tentar o bind para nunca perder o primeiro evento
    window.addEventListener('jez-cloud-status', () => {
      bindSync();
    });

    if (bindSync()) return;

    // Defensivo: aguarda a prontidao do servico (window.jezFirebaseReady) e re-tenta o bind
    const readyPromise = window.jezFirebaseReady;
    if (readyPromise && typeof readyPromise.then === 'function') {
      readyPromise.then(() => {
        bindSync();
      }).catch(() => {
        bindSync();
      });
      return;
    }

    // Ultimo recurso: uma unica re-tentativa apos o ciclo de carregamento dos modulos
    setTimeout(() => {
      bindSync();
    }, 300);
  };
  initCloudSync();

  // --------------------------------------------------------------------------
  // 13. PWA (Progressive Web App) & Service Worker (Alex & Noa)
  // --------------------------------------------------------------------------
  let deferredInstallPrompt = null;
  const pwaInstallBtn = document.getElementById('btn-pwa-install');
  const isIosDevice = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandaloneMode = window.navigator.standalone === true || window.matchMedia('(display-mode: standalone)').matches;

  // No iOS Safari, o beforeinstallprompt nao existe; exibimos o botao se nao estiver instalado em standalone
  if (isIosDevice && !isStandaloneMode && pwaInstallBtn) {
    pwaInstallBtn.style.display = 'inline-flex';
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    if (pwaInstallBtn) {
      pwaInstallBtn.style.display = 'inline-flex';
    }
  });

  if (pwaInstallBtn) {
    pwaInstallBtn.addEventListener('click', async () => {
      if (isIosDevice && !isStandaloneMode) {
        alert('Para instalar o aplicativo no iPhone ou iPad (Safari):\n1. Toque no botao de Compartilhar (icone com um quadrado e seta para cima na barra inferior do Safari).\n2. Role a lista e toque em "Adicionar a Tela de Inicio".\n3. Toque em "Adicionar" no canto superior direito.');
        return;
      }

      if (!deferredInstallPrompt) {
        alert('Para instalar o aplicativo:\n- No Safari: Toque no botao de Compartilhar e selecione "Adicionar a Tela de Inicio".\n- No Samsung Internet: Toque no menu (tres linhas) e selecione "Adicionar pagina a" -> "Tela de inicio".\n- No Chrome: Toque no menu (tres pontos) e selecione "Instalar aplicativo".');
        return;
      }
      try {
        await deferredInstallPrompt.prompt();
        const choiceResult = await deferredInstallPrompt.userChoice;
        if (choiceResult && choiceResult.outcome === 'accepted') {
          pwaInstallBtn.style.display = 'none';
        }
      } catch (err) {
        console.warn('[PWA] Erro no prompt de instalacao:', err);
      } finally {
        deferredInstallPrompt = null;
      }
    });
  }

  window.addEventListener('appinstalled', () => {
    if (pwaInstallBtn) {
      pwaInstallBtn.style.display = 'none';
    }
    deferredInstallPrompt = null;
  });

  // Registro seguro do Service Worker para navegação offline e cache veloz
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((registration) => {
          console.debug('[PWA] Service Worker registrado com sucesso:', registration.scope);
        })
        .catch((error) => {
          console.warn('[PWA] Falha ao registrar Service Worker:', error);
        });
    });
  }
};

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initApp);
} else {
  initApp();
}
