/**
 * ==========================================================================
 * JEZ Ateliê & Gestão — Lógica do Painel Administrativo Mobile
 * Especialista: Cris (Sênior Back-Office & Merchant Experience Engineer)
 * Aprovado por: Alex (CTO)
 * Diretrizes: Rigorosamente ZERO EMOJIS, paleta oficial da JEZ, enquadramento 1:1
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Chaves de Armazenamento Local e Constantes de Segurança
  // --------------------------------------------------------------------------
  const STORAGE_ORDERS_KEY = 'jez_orders';
  const STORAGE_CUSTOM_PRODUCTS_KEY = 'jez_custom_products';
  const STORAGE_CATALOG_KEY = 'jez_catalog';
  const STORAGE_SESSION_KEY = 'jez_admin_session';
  const STORAGE_ATTEMPTS_KEY = 'jez_login_attempts';

  // Hash SHA-256 da chave de acesso mestre da Jéssica ('atelie2026')
  const HASH_MASTER_PASSWORD = '3ec583f48c630ea4e2c7ef915480e1e0fe6fa96225b9affcb5d4feefd0e42711';
  const SESSION_DURATION_MS = 4 * 60 * 60 * 1000; // 4 horas
  const MAX_FAILED_ATTEMPTS = 5;
  const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutos de bloqueio temporário por Morgan

  // Pedidos Iniciais de Demonstração
  const defaultSampleOrders = [
    {
      id: 'JEZ-8042',
      date: new Date(Date.now() - 3600000 * 2).toISOString(),
      customer: 'Mariana V. (Belo Horizonte - MG)',
      items: [{ name: 'Tote Bag Cherry com Laço', quantity: 1, price: 149.90 }],
      subtotal: 149.90,
      shipping: 18.50,
      total: 168.40,
      status: 'preparar-envio',
      trackingCode: ''
    },
    {
      id: 'JEZ-8038',
      date: new Date(Date.now() - 3600000 * 24).toISOString(),
      customer: 'Camilla F. (São Paulo - SP)',
      items: [{ name: 'Blusa Teia de Aranha Cropped', quantity: 1, price: 189.90 }],
      subtotal: 189.90,
      shipping: 22.90,
      total: 212.80,
      status: 'em-producao',
      leadTimeDays: 8,
      trackingCode: ''
    },
    {
      id: 'JEZ-8031',
      date: new Date(Date.now() - 3600000 * 48).toISOString(),
      customer: 'Letícia R. (Montes Claros - MG)',
      items: [{ name: 'Bolsa Punk Slouchy com Correntes', quantity: 1, price: 169.90 }],
      subtotal: 169.90,
      shipping: 12.00,
      total: 181.90,
      status: 'enviado',
      trackingCode: 'NL893412571BR'
    },
    {
      id: 'JEZ-8025',
      date: new Date(Date.now() - 3600000 * 72).toISOString(),
      customer: 'Beatriz M. (Rio de Janeiro - RJ)',
      items: [{ name: 'Shoulder Bag Coração Granny Square', quantity: 1, price: 139.90 }],
      subtotal: 139.90,
      shipping: 24.50,
      total: 164.40,
      status: 'aguardando-pagamento',
      trackingCode: ''
    },
    {
      id: 'JEZ-8012',
      date: new Date(Date.now() - 3600000 * 120).toISOString(),
      customer: 'Amanda S. (Curitiba - PR)',
      items: [
        { name: 'Top Amarração Frontal + Bandana', quantity: 1, price: 129.90 },
        { name: 'Chaveiro Amigurumi Baphomet Cute', quantity: 1, price: 42.00 }
      ],
      subtotal: 171.90,
      shipping: 26.00,
      total: 197.90,
      status: 'concluido',
      trackingCode: 'NL872149503BR'
    }
  ];

  // Catálogo Padrão Completo da Loja
  const defaultInitialCatalog = [
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

  // --------------------------------------------------------------------------
  // 2. Funções de Carregamento e Persistência
  // --------------------------------------------------------------------------
  const loadOrders = () => {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(defaultSampleOrders));
      return defaultSampleOrders;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return defaultSampleOrders;
    }
  };

  const saveOrders = (ordersList) => {
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(ordersList));
    updateDashboard();
    renderOrders();
  };

  const loadCatalog = () => {
    const raw = localStorage.getItem(STORAGE_CATALOG_KEY);
    if (!raw) {
      // Mescla catálogo inicial com eventuais itens customizados pré-existentes
      const customRaw = localStorage.getItem(STORAGE_CUSTOM_PRODUCTS_KEY);
      const customList = customRaw ? JSON.parse(customRaw) : [];
      const combined = [...defaultInitialCatalog];
      customList.forEach(c => {
        if (!combined.some(item => item.id === c.id)) {
          combined.push(c);
        }
      });
      localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(combined));
      return combined;
    }
    try {
      const parsed = JSON.parse(raw);
      let updated = false;
      const hydrated = parsed.map(p => {
        // Auto-cura do bug da bolsa cherry em peças padrão (JEZ-019)
        if (p.id !== 'tote-cherry' && p.image && (p.image === 'assets/products/tote_cherry.jpg' || p.image.endsWith('/tote_cherry.jpg'))) {
          const def = defaultInitialCatalog.find(d => d.id === p.id);
          if (def && def.image) {
            p.image = def.image;
            updated = true;
          }
        }
        if (p.id !== 'tote-cherry' && Array.isArray(p.images) && p.images.length > 0 && (p.images[0] === 'assets/products/tote_cherry.jpg' || p.images[0].endsWith('/tote_cherry.jpg'))) {
          const def = defaultInitialCatalog.find(d => d.id === p.id);
          if (def && def.image) {
            p.images[0] = def.image;
            updated = true;
          }
        }
        if (!p.images || p.images.length === 0) {
          const def = defaultInitialCatalog.find(d => d.id === p.id);
          if (def && def.images) {
            updated = true;
            return { ...p, images: def.images };
          }
        }
        return p;
      });
      if (updated) {
        localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(hydrated));
      }
      return hydrated;
    } catch {
      return defaultInitialCatalog;
    }
  };

  const saveCatalog = (catalogList) => {
    localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(catalogList));
    // Sincroniza também jez_custom_products para compatibilidade reversa
    const customOnly = catalogList.filter(p => p.id.startsWith('custom-'));
    localStorage.setItem(STORAGE_CUSTOM_PRODUCTS_KEY, JSON.stringify(customOnly));
    renderCatalog();
    updateDashboard();

    // Sincroniza catálogo em tempo real com o Cloud Firestore (Fase 2 - JEZ-021)
    if (window.jezFirebase && typeof window.jezFirebase.saveProduct === 'function') {
      catalogList.forEach(p => {
        window.jezFirebase.saveProduct(p).catch(err => {
          console.warn('[JËZ Cloud] Erro ao sincronizar peça:', p.id, err.message);
        });
      });
    }
  };

  let orders = loadOrders();
  let catalog = loadCatalog();
  let currentOrderFilter = 'all';
  let currentCatalogFilter = 'all';

  // --------------------------------------------------------------------------
  // 2.1 Utilitários de Segurança & Sanitização (Morgan - Cibersegurança)
  // --------------------------------------------------------------------------
  const escapeHtml = (unsafe) => {
    if (unsafe === null || unsafe === undefined) return '';
    return String(unsafe)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const sanitizeText = (str, maxLength = 500) => {
    if (!str || typeof str !== 'string') return '';
    return str.trim().slice(0, maxLength);
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

  const sanitizeTrackingCode = (code) => {
    if (!code || typeof code !== 'string') return '';
    return code.trim().toUpperCase().replace(/[^A-Z0-9\- ]/g, '').slice(0, 30);
  };

  // Formatador de Moeda
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val) || 0);
  };

  // Formatador de Data Amigável
  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  // Toast de feedback
  const showToast = (message) => {
    const toast = document.getElementById('admin-toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  // --------------------------------------------------------------------------
  // 3. Motor de Enquadramento 1:1 e Redimensionamento de Fotos
  // --------------------------------------------------------------------------
  const setupPhotoCropper = (elements) => {
    const { viewportEl, imgEl, zoomSlider, btnZoomIn, btnZoomOut, btnReset, zoomValEl } = elements;
    let zoom = 1;
    let offsetX = 0;
    let offsetY = 0;
    let isDragging = false;
    let startX = 0;
    let startY = 0;
    let baseWidth = 240;
    let baseHeight = 240;
    let naturalWidth = 1;
    let naturalHeight = 1;

    const updateTransform = () => {
      imgEl.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${zoom})`;
      if (zoomSlider) zoomSlider.value = zoom;
      if (zoomValEl) zoomValEl.textContent = `${Math.round(zoom * 100)}%`;
    };

    const constrainOffsets = () => {
      const vpW = viewportEl.clientWidth || 240;
      const vpH = viewportEl.clientHeight || 240;
      const renderedW = baseWidth * zoom;
      const renderedH = baseHeight * zoom;
      const maxOffsetX = Math.max(0, (renderedW - vpW) / 2);
      const maxOffsetY = Math.max(0, (renderedH - vpH) / 2);
      offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, offsetX));
      offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY));
    };

    const reset = () => {
      zoom = 1;
      offsetX = 0;
      offsetY = 0;
      const vpW = viewportEl.clientWidth || 240;
      const vpH = viewportEl.clientHeight || 240;
      if (naturalWidth && naturalHeight) {
        const scaleToCover = Math.max(vpW / naturalWidth, vpH / naturalHeight);
        baseWidth = naturalWidth * scaleToCover;
        baseHeight = naturalHeight * scaleToCover;
        imgEl.style.width = `${baseWidth}px`;
        imgEl.style.height = `${baseHeight}px`;
        imgEl.style.maxWidth = 'none';
        imgEl.style.maxHeight = 'none';
      }
      updateTransform();
    };

    const onPointerDown = (clientX, clientY) => {
      isDragging = true;
      startX = clientX - offsetX;
      startY = clientY - offsetY;
    };

    const onPointerMove = (clientX, clientY) => {
      if (!isDragging) return;
      offsetX = clientX - startX;
      offsetY = clientY - startY;
      constrainOffsets();
      updateTransform();
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    // Eventos de Mouse
    viewportEl.addEventListener('mousedown', (e) => {
      e.preventDefault();
      onPointerDown(e.clientX, e.clientY);
    });
    window.addEventListener('mousemove', (e) => {
      if (isDragging) onPointerMove(e.clientX, e.clientY);
    });
    window.addEventListener('mouseup', onPointerUp);

    // Eventos de Touch
    viewportEl.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
    window.addEventListener('touchend', onPointerUp);

    // Controles de Zoom
    if (zoomSlider) {
      zoomSlider.addEventListener('input', (e) => {
        zoom = parseFloat(e.target.value);
        constrainOffsets();
        updateTransform();
      });
    }

    if (btnZoomIn) {
      btnZoomIn.addEventListener('click', () => {
        zoom = Math.min(3, +(zoom + 0.15).toFixed(2));
        constrainOffsets();
        updateTransform();
      });
    }

    if (btnZoomOut) {
      btnZoomOut.addEventListener('click', () => {
        zoom = Math.max(1, +(zoom - 0.15).toFixed(2));
        constrainOffsets();
        updateTransform();
      });
    }

    if (btnReset) {
      btnReset.addEventListener('click', reset);
    }

    const loadImage = (src) => {
      return new Promise((resolve) => {
        const onImgDone = () => {
          naturalWidth = imgEl.naturalWidth || 400;
          naturalHeight = imgEl.naturalHeight || 400;
          reset();
          resolve();
        };

        imgEl.onload = onImgDone;
        imgEl.onerror = () => {
          reset();
          resolve();
        };

        if (imgEl.src === src && imgEl.complete && imgEl.naturalWidth > 0) {
          onImgDone();
        } else {
          imgEl.src = src;
        }
      });
    };

    const getCroppedDataUrl = (targetSize = 600) => {
      if (!naturalWidth || !naturalHeight || !imgEl.src) return imgEl.src;
      try {
        const canvas = document.createElement('canvas');
        canvas.width = targetSize;
        canvas.height = targetSize;
        const ctx = canvas.getContext('2d');
        if (!ctx) return imgEl.src;

        const vpW = viewportEl.clientWidth || 240;
        const vpH = viewportEl.clientHeight || 240;

        const currentScale = (baseWidth * zoom) / naturalWidth;
        const vpInImgX = (baseWidth * zoom - vpW) / 2 - offsetX;
        const vpInImgY = (baseHeight * zoom - vpH) / 2 - offsetY;

        const srcW = Math.min(naturalWidth, vpW / currentScale);
        const srcH = Math.min(naturalHeight, vpH / currentScale);
        const srcX = Math.max(0, Math.min(naturalWidth - srcW, vpInImgX / currentScale));
        const srcY = Math.max(0, Math.min(naturalHeight - srcH, vpInImgY / currentScale));

        ctx.fillStyle = '#23192d';
        ctx.fillRect(0, 0, targetSize, targetSize);
        ctx.drawImage(imgEl, srcX, srcY, srcW, srcH, 0, 0, targetSize, targetSize);
        return canvas.toDataURL('image/jpeg', 0.88);
      } catch {
        return imgEl.src;
      }
    };

    const getState = () => ({ zoom, offsetX, offsetY });
    const setState = (state) => {
      if (!state) return;
      if (typeof state.zoom === 'number') zoom = state.zoom;
      if (typeof state.offsetX === 'number') offsetX = state.offsetX;
      if (typeof state.offsetY === 'number') offsetY = state.offsetY;
      constrainOffsets();
      updateTransform();
    };

    return {
      loadImage,
      reset,
      getCroppedDataUrl,
      getState,
      setState,
      hasImage: () => Boolean(imgEl.src && imgEl.src.length > 0)
    };
  };

  // Inicializa o recortador do Formulário de Nova Peça
  const newPieceCropper = setupPhotoCropper({
    viewportEl: document.getElementById('crop-viewport'),
    imgEl: document.getElementById('crop-source-img'),
    zoomSlider: document.getElementById('crop-zoom-slider'),
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnReset: document.getElementById('btn-reset-crop'),
    zoomValEl: document.getElementById('zoom-val-display')
  });

  // Inicializa o recortador do Modal de Edição
  const editPieceCropper = setupPhotoCropper({
    viewportEl: document.getElementById('edit-crop-viewport'),
    imgEl: document.getElementById('edit-crop-source-img'),
    zoomSlider: document.getElementById('edit-crop-zoom-slider'),
    btnZoomIn: document.getElementById('btn-edit-zoom-in'),
    btnZoomOut: document.getElementById('btn-edit-zoom-out'),
    btnReset: document.getElementById('btn-edit-reset-crop'),
    zoomValEl: document.getElementById('edit-zoom-val-display')
  });

  /**
   * Comprime e redimensiona arquivos de imagem client-side via Canvas (JEZ-019)
   */
  const compressImageFile = (file, maxWidth = 800, quality = 0.78) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;
          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        };
        img.onerror = () => resolve(e.target.result);
        img.src = e.target.result;
      };
      reader.onerror = () => resolve('');
      reader.readAsDataURL(file);
    });
  };

  // --------------------------------------------------------------------------
  // 4. Navegação em Abas Mobile-First
  // --------------------------------------------------------------------------
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.admin-section');

  const switchTab = (tabId) => {
    tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabId));
    sections.forEach(s => s.classList.toggle('active', s.id === `section-${tabId}`));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tabId === 'dashboard') updateDashboard();
    if (tabId === 'orders') renderOrders();
    if (tabId === 'catalog') renderCatalog();
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      switchTab(tab.getAttribute('data-tab'));
    });
  });

  document.getElementById('btn-quick-new-piece').addEventListener('click', () => switchTab('new-product'));
  document.getElementById('btn-quick-view-orders').addEventListener('click', () => switchTab('orders'));
  document.getElementById('btn-see-all-orders').addEventListener('click', () => switchTab('orders'));
  document.getElementById('btn-refresh-data').addEventListener('click', () => {
    orders = loadOrders();
    catalog = loadCatalog();
    updateDashboard();
    renderOrders();
    renderCatalog();
    showToast('Dados do ateliê atualizados!');
  });

  // --------------------------------------------------------------------------
  // 5. Métricas Executivas do Dashboard (Visão Geral)
  // --------------------------------------------------------------------------
  const updateDashboard = () => {
    orders = loadOrders();
    catalog = loadCatalog();

    // Faturamento (pedidos que já foram pagos/produção/enviados/concluídos)
    const paidOrders = orders.filter(o => o.status !== 'aguardando-pagamento' && o.status !== 'cancelado');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    document.getElementById('kpi-sales-value').textContent = formatCurrency(totalRevenue);
    document.getElementById('kpi-sales-count').textContent = `${paidOrders.length} pedido(s) faturado(s)`;

    // Pedidos para postar (Pago / Preparar Envio)
    const toShip = orders.filter(o => o.status === 'preparar-envio');
    document.getElementById('kpi-shipping-value').textContent = toShip.length;
    document.getElementById('kpi-shipping-subtext').textContent = toShip.length === 1 ? '1 pedido para postar hoje' : `${toShip.length} pedidos para postar nos Correios`;

    // Encomendas em Produção
    const inProduction = orders.filter(o => o.status === 'em-producao');
    document.getElementById('kpi-production-value').textContent = inProduction.length;

    // Badge na aba Pedidos
    const pendingTotal = toShip.length + inProduction.length;
    const badge = document.getElementById('pending-orders-badge');
    if (pendingTotal > 0) {
      badge.textContent = pendingTotal;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }

    // Lista rápida de pedidos recentes no dashboard (últimos 3)
    const recentContainer = document.getElementById('dashboard-recent-orders');
    recentContainer.innerHTML = '';
    const latestThree = orders.slice(0, 3);

    if (latestThree.length === 0) {
      recentContainer.innerHTML = '<p style="font-size: 0.85rem; color: rgba(245, 236, 183, 0.7); text-align: center; padding: 12px;">Nenhum pedido registrado ainda.</p>';
      return;
    }

    latestThree.forEach(order => {
      const itemRow = document.createElement('div');
      itemRow.className = 'recent-order-item';
      itemRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(35, 25, 45, 0.6); border: 1px dashed rgba(254, 191, 151, 0.25); border-radius: 4px; font-size: 0.82rem;';
      
      const statusMeta = getStatusMeta(order.status);
      const safeId = escapeHtml(order.id);
      const safeCustomer = escapeHtml((order.customer || '').split(' ')[0]);
      const safeStatus = escapeHtml(order.status);

      itemRow.innerHTML = `
        <div>
          <strong style="color: var(--color-bg-light);">${safeId}</strong>
          <span style="color: rgba(245, 236, 183, 0.75); font-size: 0.74rem; margin-left: 6px;">${safeCustomer}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="status-tag status-${safeStatus}" style="font-size: 0.65rem; padding: 2px 6px;">${statusMeta.label}</span>
          <strong style="color: var(--color-accent);">${formatCurrency(order.total)}</strong>
        </div>
      `;
      recentContainer.appendChild(itemRow);
    });
  };

  // Metadados de Status dos Pedidos
  const getStatusMeta = (status) => {
    switch (status) {
      case 'aguardando-pagamento':
        return { label: 'Aguardando Pagamento', nextLabel: 'Confirmar Pix (Preparar Envio)', nextStatus: 'preparar-envio' };
      case 'em-producao':
        return { label: 'Em Produção', nextLabel: 'Peça Concluída (Preparar Envio)', nextStatus: 'preparar-envio' };
      case 'preparar-envio':
        return { label: 'Preparar Envio', nextLabel: 'Postar e Enviar', nextStatus: 'enviado' };
      case 'enviado':
        return { label: 'Enviado', nextLabel: 'Marcar como Entregue', nextStatus: 'concluido' };
      case 'concluido':
        return { label: 'Concluído', nextLabel: '', nextStatus: '' };
      default:
        return { label: status, nextLabel: '', nextStatus: '' };
    }
  };

  // --------------------------------------------------------------------------
  // 6. Gestão Visual de Pedidos (Com Contenção Mobile Flex-Wrap)
  // --------------------------------------------------------------------------
  const renderOrders = () => {
    orders = loadOrders();
    const container = document.getElementById('orders-list-container');
    container.innerHTML = '';

    // Atualiza contadores dos filtros
    const counts = {
      all: orders.length,
      'aguardando-pagamento': orders.filter(o => o.status === 'aguardando-pagamento').length,
      'em-producao': orders.filter(o => o.status === 'em-producao').length,
      'preparar-envio': orders.filter(o => o.status === 'preparar-envio').length,
      enviado: orders.filter(o => o.status === 'enviado').length,
      concluido: orders.filter(o => o.status === 'concluido').length
    };

    document.getElementById('count-all').textContent = counts.all;
    document.getElementById('count-yellow').textContent = counts['aguardando-pagamento'];
    document.getElementById('count-orange').textContent = counts['em-producao'];
    document.getElementById('count-blue').textContent = counts['preparar-envio'];
    document.getElementById('count-purple').textContent = counts.enviado;
    document.getElementById('count-green').textContent = counts.concluido;

    const filtered = currentOrderFilter === 'all' ? orders : orders.filter(o => o.status === currentOrderFilter);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: rgba(245, 236, 183, 0.75); background: var(--admin-card-bg); border-radius: var(--radius-sm); border: var(--admin-card-border);">
          <p style="font-size: 0.95rem; font-weight: 700;">Nenhum pedido encontrado nesta categoria.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(order => {
      const card = document.createElement('div');
      card.className = 'order-card';
      const statusMeta = getStatusMeta(order.status);

      const itemsHtml = order.items.map(i => `
        <div style="display: flex; justify-content: space-between;">
          <span>• ${escapeHtml(i.quantity)}x ${escapeHtml(i.name)}</span>
          <span style="font-weight: 700;">${formatCurrency((Number(i.price) || 0) * (Number(i.quantity) || 1))}</span>
        </div>
      `).join('');

      const safeOrderId = escapeHtml(order.id);
      const safeCustomer = escapeHtml(order.customer);
      const safeStatus = escapeHtml(order.status);
      const safeTracking = sanitizeTrackingCode(order.trackingCode);

      card.innerHTML = `
        <div class="order-card-header">
          <div>
            <span class="order-id-badge">${safeOrderId}</span>
            <div class="order-date">${formatDate(order.date)} • ${safeCustomer}</div>
          </div>
          <span class="status-tag status-${safeStatus}">
            ${statusMeta.label}
          </span>
        </div>

        <div class="order-items-summary">
          ${itemsHtml}
          ${order.address ? `
            <div style="color: rgba(245, 236, 183, 0.9); font-size: 0.74rem; border-top: 1px dashed rgba(254, 191, 151, 0.25); padding-top: 5px; margin-top: 4px; display: flex; flex-direction: column; gap: 2px;">
              <span style="font-weight: 700; color: var(--color-accent);">Endereço de Entrega:</span>
              <span style="line-height: 1.3;">${escapeHtml(order.address)}${order.cep ? ` — CEP ${escapeHtml(order.cep)}` : ''}</span>
            </div>
          ` : ''}
          ${order.shipping > 0 ? `
            <div style="display: flex; justify-content: space-between; color: rgba(245, 236, 183, 0.75); font-size: 0.74rem; border-top: 1px dashed rgba(254, 191, 151, 0.25); padding-top: 4px; margin-top: 2px;">
              <span>Frete Correios:</span>
              <span>${formatCurrency(order.shipping)}</span>
            </div>
          ` : ''}
          <div class="order-total-row">
            <span>Total:</span>
            <span class="order-total-highlight">${formatCurrency(order.total)}</span>
          </div>
        </div>

        <!-- Código de rastreamento com link dos Correios -->
        ${order.status === 'enviado' ? `
          <div style="background: rgba(124, 58, 237, 0.15); border-radius: 4px; padding: 8px 10px; border: 1px dashed #7c3aed;">
            <div class="tracking-info-live">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon></svg>
              <span>Código: <strong>${safeTracking || 'Pendente'}</strong></span>
              ${safeTracking ? `
                <a href="https://rastreamento.correios.com.br/app/index.php?codigo=${encodeURIComponent(safeTracking)}" target="_blank" rel="noopener" style="margin-left: auto;">Rastrear nos Correios ></a>
              ` : ''}
            </div>
          </div>
        ` : ''}

        <!-- Ações de Transição de Status em 2 toques -->
        <div class="order-status-actions">
          <div class="status-action-row">
            ${order.status === 'aguardando-pagamento' ? `
              <button class="btn-status-change" data-id="${order.id}" data-newstatus="preparar-envio" style="background: #2563eb; color: #fff; border-color: #2563eb;">
                Confirmar Pix (Preparar Envio)
              </button>
              <button class="btn-status-change" data-id="${order.id}" data-newstatus="em-producao" style="background: #ea580c; color: #fff; border-color: #ea580c;">
                Enviar para o Tear (Produção)
              </button>
            ` : ''}

            ${order.status === 'em-producao' ? `
              <button class="btn-status-change" data-id="${order.id}" data-newstatus="preparar-envio" style="background: #2563eb; color: #fff; border-color: #2563eb;">
                Peça Concluída (Preparar Envio)
              </button>
            ` : ''}

            ${order.status === 'preparar-envio' ? `
              <div style="width: 100%;">
                <label style="font-size: 0.74rem; font-weight: 700; color: var(--color-bg-light); margin-bottom: 4px; display: block;">
                  Código de Rastreio dos Correios:
                </label>
                <div class="tracking-input-box">
                  <input type="text" placeholder="Ex: QB123456789BR" class="tracking-input" id="tracking-input-${safeOrderId}" value="${escapeHtml(order.trackingCode || '')}">
                  <button type="button" class="btn-save-tracking" data-id="${safeOrderId}">Postar & Enviar</button>
                </div>
              </div>
            ` : ''}

            ${order.status === 'enviado' ? `
              <button type="button" class="btn-status-change" data-id="${safeOrderId}" data-newstatus="concluido" style="background: #16a34a; color: #fff; border-color: #16a34a;">
                Marcar como Entregue ao Cliente
              </button>
              <button type="button" class="btn-copy-msg" data-id="${safeOrderId}" data-tracking="${escapeHtml(order.trackingCode)}" style="background: rgba(254, 191, 151, 0.15); border: 1px dashed var(--color-accent); color: var(--color-bg-light); padding: 6px 10px; border-radius: 3px; font-size: 0.72rem; font-weight: 700; cursor: pointer;">
                Copiar Msg WhatsApp
              </button>
            ` : ''}

            ${order.status === 'concluido' ? `
              <span style="font-size: 0.75rem; color: #4ade80; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                Pedido concluído com sucesso e entregue ao cliente.
              </span>
            ` : ''}
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // Registra cliques de mudança de status
    container.querySelectorAll('.btn-status-change').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const orderId = e.currentTarget.getAttribute('data-id');
        const newStatus = e.currentTarget.getAttribute('data-newstatus');
        updateOrderStatus(orderId, newStatus);
      });
    });

    // Registra salvamento de código de rastreio
    container.querySelectorAll('.btn-save-tracking').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const orderId = e.currentTarget.getAttribute('data-id');
        const input = document.getElementById(`tracking-input-${orderId}`);
        const code = sanitizeTrackingCode(input ? input.value : '');
        updateOrderStatus(orderId, 'enviado', code);
      });
    });

    // Registra cópia de mensagem do WhatsApp
    container.querySelectorAll('.btn-copy-msg').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const code = sanitizeTrackingCode(e.currentTarget.getAttribute('data-tracking'));
        const safeEncoded = encodeURIComponent(code);
        const msg = `Olá! Sua encomenda da JËZ collection já foi postada nos Correios com muito carinho!\nCódigo de rastreamento: ${code || 'Enviado'}\nAcompanhe pelo link: https://rastreamento.correios.com.br/app/index.php?codigo=${safeEncoded}`;
        navigator.clipboard.writeText(msg).then(() => {
          showToast('Mensagem de rastreio copiada para o WhatsApp!');
        });
      });
    });
  };

  const updateOrderStatus = (orderId, newStatus, trackingCode = null) => {
    orders = orders.map(o => {
      if (o.id === orderId) {
        const updated = { ...o, status: newStatus };
        if (trackingCode !== null) updated.trackingCode = sanitizeTrackingCode(trackingCode);
        return updated;
      }
      return o;
    });
    saveOrders(orders);

    // Sincroniza status do pedido com Cloud Firestore (Fase 2 - JEZ-021)
    if (window.jezFirebase && typeof window.jezFirebase.updateOrderStatus === 'function') {
      window.jezFirebase.updateOrderStatus(orderId, newStatus, trackingCode).catch(err => {
        console.warn('[JËZ Cloud] Erro ao sincronizar status do pedido na nuvem:', err.message);
      });
    }

    showToast(`Status do pedido ${orderId} atualizado para ${getStatusMeta(newStatus).label}!`);
  };

  // Filtros de status de pedidos
  document.querySelectorAll('.order-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.order-filter-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentOrderFilter = e.currentTarget.getAttribute('data-status');
      renderOrders();
    });
  });

  // --------------------------------------------------------------------------
  // 7. Cadastro de Nova Peça com Reenquadramento e Zoom
  // --------------------------------------------------------------------------
  const photoInput = document.getElementById('product-photo-input');
  const uploadPrompt = document.getElementById('upload-prompt');
  const cropWorkspace = document.getElementById('crop-workspace');
  const btnChangeCropPhoto = document.getElementById('btn-change-crop-photo');

  // Gerenciamento de Fotos Extras no Cadastro (JEZ-019)
  let newPieceExtraPhotos = [];
  const btnAddNewExtraPhoto = document.getElementById('btn-add-new-extra-photo');
  const newExtraPhotosInput = document.getElementById('new-extra-photos-input');
  const newExtraPhotosGrid = document.getElementById('new-extra-photos-grid');

  const renderNewExtraPhotos = () => {
    if (!newExtraPhotosGrid) return;
    newExtraPhotosGrid.innerHTML = '';

    newPieceExtraPhotos.forEach((photoData, idx) => {
      const thumb = document.createElement('div');
      thumb.className = 'extra-photo-thumb';
      thumb.innerHTML = `
        <img src="${sanitizeImageUrl(photoData)}" alt="Foto extra ${idx + 1}">
        <button type="button" class="btn-remove-extra-photo" data-idx="${idx}" aria-label="Remover foto extra">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      `;
      newExtraPhotosGrid.appendChild(thumb);
    });

    if (btnAddNewExtraPhoto) {
      if (newPieceExtraPhotos.length >= 4) {
        btnAddNewExtraPhoto.style.opacity = '0.5';
        btnAddNewExtraPhoto.disabled = true;
      } else {
        btnAddNewExtraPhoto.style.opacity = '1';
        btnAddNewExtraPhoto.disabled = false;
      }
    }
  };

  if (btnAddNewExtraPhoto && newExtraPhotosInput) {
    btnAddNewExtraPhoto.addEventListener('click', () => {
      if (newPieceExtraPhotos.length >= 4) {
        showToast('Limite de 4 fotos extras atingido.');
        return;
      }
      newExtraPhotosInput.click();
    });

    newExtraPhotosInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;
      const availableSlots = 4 - newPieceExtraPhotos.length;
      const filesToProcess = files.slice(0, availableSlots);

      for (const file of filesToProcess) {
        const compressed = await compressImageFile(file);
        if (compressed) {
          newPieceExtraPhotos.push(compressed);
        }
      }
      newExtraPhotosInput.value = '';
      renderNewExtraPhotos();
      showToast(`${filesToProcess.length} foto(s) extra(s) adicionada(s)!`);
    });
  }

  if (newExtraPhotosGrid) {
    newExtraPhotosGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-remove-extra-photo');
      if (!btn) return;
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      if (!isNaN(idx)) {
        newPieceExtraPhotos.splice(idx, 1);
        renderNewExtraPhotos();
      }
    });
  }

  // Ao selecionar foto principal
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      uploadPrompt.style.display = 'none';
      cropWorkspace.style.display = 'flex';
      await newPieceCropper.loadImage(event.target.result);
      showToast('Foto carregada! Ajuste o enquadramento se desejar.');
    };
    reader.readAsDataURL(file);
  });

  btnChangeCropPhoto.addEventListener('click', () => {
    photoInput.click();
  });

  // Alternância Pronta Entrega vs Sob Encomenda
  const modalityOptions = document.querySelectorAll('.modality-option');
  const leadTimeField = document.getElementById('order-leadtime-field');

  modalityOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      modalityOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const radio = opt.querySelector('input[type="radio"]');
      radio.checked = true;

      if (radio.value === 'order') {
        leadTimeField.style.display = 'block';
      } else {
        leadTimeField.style.display = 'none';
      }
    });
  });

  // Submissão do Formulário de Nova Peça
  const formNewProduct = document.getElementById('form-new-product');
  formNewProduct.addEventListener('submit', (e) => {
    e.preventDefault();

    const rawName = document.getElementById('product-name-input').value;
    const name = sanitizeText(rawName, 120);
    const category = document.getElementById('product-category-input').value;
    const rawPrice = parseFloat(document.getElementById('product-price-input').value);
    const price = Math.max(0.01, isNaN(rawPrice) ? 1.0 : rawPrice);
    const modality = document.querySelector('input[name="product-modality"]:checked').value;
    const rawLeadTime = parseInt(document.getElementById('product-leadtime-input').value, 10);
    const leadTimeDays = modality === 'order' ? Math.max(1, Math.min(90, isNaN(rawLeadTime) ? 7 : rawLeadTime)) : 0;
    const dimensions = sanitizeText(document.getElementById('product-dimensions-input').value, 150) || 'Medidas artesanais sob encomenda';
    const materials = sanitizeText(document.getElementById('product-materials-input').value, 200) || 'Fio 100% algodão premium artesanal';
    const description = sanitizeText(document.getElementById('product-desc-input').value, 800) || 'Peça autoral tecida com amor e acabamento único pela Jéssica Regina.';

    // Foto recortada e enquadrada em 1:1
    let photoToUse = 'assets/products/tote_cherry.jpg';
    if (newPieceCropper.hasImage()) {
      photoToUse = newPieceCropper.getCroppedDataUrl(600);
    }

    const categoryLabels = {
      bolsas: 'Bolsas & Bags',
      vestuario: 'Vestuário Autoral',
      acessorios: 'Acessórios'
    };

    const extraImages = [...newPieceExtraPhotos];
    const allImages = [photoToUse, ...extraImages];

    const newPiece = {
      id: 'custom-' + Date.now(),
      name,
      category,
      categoryLabel: categoryLabels[category] || 'Peças Autorais',
      price,
      image: photoToUse,
      images: allImages,
      status: modality, // 'ready' ou 'order'
      isReady: modality === 'ready',
      stockQty: modality === 'ready' ? 1 : 0,
      leadTimeDays: leadTimeDays,
      dimensions,
      materials,
      description
    };

    catalog = loadCatalog();
    catalog.push(newPiece);
    saveCatalog(catalog);

    // Limpa formulário
    formNewProduct.reset();
    photoInput.value = '';
    newPieceExtraPhotos = [];
    renderNewExtraPhotos();
    cropWorkspace.style.display = 'none';
    uploadPrompt.style.display = 'flex';
    modalityOptions[0].click();

    showToast(`Peça "${name}" cadastrada com sucesso!`);
    
    // Transiciona para a aba do acervo
    setTimeout(() => {
      switchTab('catalog');
    }, 500);
  });

  // --------------------------------------------------------------------------
  // 8. Gestão do Acervo (Edição, Exclusão & Status "Suspensa")
  // --------------------------------------------------------------------------
  const renderCatalog = (query = '') => {
    catalog = loadCatalog();
    const grid = document.getElementById('admin-catalog-grid');
    grid.innerHTML = '';

    // Contadores por status
    const countAll = catalog.length;
    const countReady = catalog.filter(p => p.status === 'ready' || (p.status !== 'order' && p.status !== 'suspended' && p.isReady)).length;
    const countOrder = catalog.filter(p => p.status === 'order' || (p.status !== 'ready' && p.status !== 'suspended' && !p.isReady)).length;
    const countSuspended = catalog.filter(p => p.status === 'suspended').length;

    document.getElementById('cat-count-all').textContent = countAll;
    document.getElementById('cat-count-ready').textContent = countReady;
    document.getElementById('cat-count-order').textContent = countOrder;
    document.getElementById('cat-count-suspended').textContent = countSuspended;
    document.getElementById('total-pieces-count').textContent = `${countAll} peça(s) no total`;

    // Filtra por status e busca textual
    let filtered = catalog;
    if (currentCatalogFilter === 'ready') {
      filtered = filtered.filter(p => p.status === 'ready' || (p.status !== 'order' && p.status !== 'suspended' && p.isReady));
    } else if (currentCatalogFilter === 'order') {
      filtered = filtered.filter(p => p.status === 'order' || (p.status !== 'ready' && p.status !== 'suspended' && !p.isReady));
    } else if (currentCatalogFilter === 'suspended') {
      filtered = filtered.filter(p => p.status === 'suspended');
    }

    if (query) {
      filtered = filtered.filter(p => p.name.toLowerCase().includes(query.toLowerCase()));
    }

    if (filtered.length === 0) {
      grid.innerHTML = `
        <div style="grid-column: 1 / -1; text-align: center; padding: 40px 20px; color: rgba(245, 236, 183, 0.75); background: var(--admin-card-bg); border-radius: var(--radius-sm); border: var(--admin-card-border);">
          <p style="font-weight: 700;">Nenhuma peça encontrada neste filtro.</p>
        </div>
      `;
      return;
    }

    const currentFeaturedId = localStorage.getItem('jez_featured_product_id') || 'tote-cherry';

    filtered.forEach(piece => {
      const card = document.createElement('div');
      const isSuspended = piece.status === 'suspended';
      const isFeatured = piece.id === currentFeaturedId;
      card.className = `admin-product-card ${isSuspended ? 'card-suspended' : ''} ${isFeatured ? 'card-featured' : ''}`;

      let statusBadgeHtml = '';
      let toggleActionHtml = '';
      let featuredHtml = '';

      if (isFeatured) {
        featuredHtml = `<span class="badge-featured-piece" title="Peça em destaque na página inicial">Destaque na Vitrine</span>`;
      } else if (!isSuspended) {
        featuredHtml = `<button class="btn-action-featured" data-action="feature" data-id="${piece.id}" title="Destacar esta peça na vitrine da loja">Destacar na Vitrine</button>`;
      }

      if (isSuspended) {
        statusBadgeHtml = `<span class="btn-status-badge suspended" title="Oculta da loja online">Suspensa (Oculta)</span>`;
        toggleActionHtml = `<button class="btn-action-edit" data-action="reactivate" data-id="${piece.id}">Reativar na Loja</button>`;
      } else if (piece.status === 'order' || (!piece.isReady && piece.status !== 'ready')) {
        statusBadgeHtml = `<span class="btn-status-badge order" title="Produzida sob encomenda">Sob Encomenda</span>`;
        toggleActionHtml = `<button class="btn-action-edit" data-action="suspend" data-id="${piece.id}">Suspender</button>`;
      } else {
        statusBadgeHtml = `<span class="btn-status-badge ready" title="Pronta para postagem">Pronta Entrega</span>`;
        toggleActionHtml = `<button class="btn-action-edit" data-action="suspend" data-id="${piece.id}">Suspender</button>`;
      }

      const safeId = escapeHtml(piece.id);
      const safeName = escapeHtml(piece.name);
      const safeImage = sanitizeImageUrl(piece.image);
      const safeLeadTime = parseInt(piece.leadTimeDays, 10) || 7;

      card.innerHTML = `
        <img src="${safeImage}" alt="${safeName}" class="admin-product-thumb">
        <div class="admin-product-details">
          <div style="display: flex; align-items: center; justify-content: space-between; gap: 6px; flex-wrap: wrap;">
            <span class="admin-product-name" title="${safeName}">${safeName}</span>
            ${isFeatured ? featuredHtml : ''}
          </div>
          <div style="display: flex; align-items: center; gap: 8px;">
            <span class="admin-product-price">${formatCurrency(piece.price)}</span>
            ${piece.images && piece.images.length > 1 ? `
              <span class="badge-catalog-photos" title="${piece.images.length} fotos cadastradas">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect><circle cx="8.5" cy="8.5" r="1.5"></circle><polyline points="21 15 16 10 5 21"></polyline></svg>
                ${piece.images.length} fotos
              </span>
            ` : ''}
          </div>
          
          <div style="display: flex; align-items: center; gap: 6px; margin-top: 2px;">
            ${statusBadgeHtml}
            ${piece.status === 'order' && piece.leadTimeDays ? `
              <span style="font-size: 0.68rem; color: rgba(245, 236, 183, 0.7);">${safeLeadTime} dias úteis</span>
            ` : ''}
          </div>

          <div class="admin-product-actions">
            <button class="btn-action-edit" data-action="edit" data-id="${safeId}">Editar</button>
            ${!isFeatured && !isSuspended ? featuredHtml : ''}
            ${toggleActionHtml}
            <button class="btn-action-delete" data-action="delete" data-id="${safeId}">Excluir</button>
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    // Registra eventos das ações do card
    grid.querySelectorAll('button[data-action]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const action = e.currentTarget.getAttribute('data-action');
        const id = e.currentTarget.getAttribute('data-id');

        if (action === 'edit') {
          openEditModal(id);
        } else if (action === 'feature') {
          setFeaturedPiece(id);
        } else if (action === 'suspend') {
          setPieceStatus(id, 'suspended');
        } else if (action === 'reactivate') {
          setPieceStatus(id, 'ready');
        } else if (action === 'delete') {
          deletePiece(id);
        }
      });
    });
  };

  // Define a peça em destaque no topo da loja virtual
  const setFeaturedPiece = (id) => {
    const piece = catalog.find(p => p.id === id);
    if (!piece) return;
    localStorage.setItem('jez_featured_product_id', id);
    try {
      localStorage.setItem('jez_featured_product_cache', JSON.stringify({
        id: piece.id,
        name: piece.name,
        price: piece.price,
        formattedPrice: formatCurrency(piece.price),
        image: piece.image,
        webp: piece.image && piece.image.startsWith('assets/') ? piece.image.replace(/\.(jpg|jpeg|png)$/i, '.webp') : ''
      }));
    } catch(e) {}

    // Sincroniza destaque em nuvem (Fase 2 - JEZ-021)
    if (window.jezFirebase && typeof window.jezFirebase.setFeaturedProduct === 'function') {
      window.jezFirebase.setFeaturedProduct(id).catch(err => console.warn(err));
    }

    const searchInput = document.getElementById('catalog-search-input');
    renderCatalog(searchInput ? searchInput.value.trim() : '');
    showToast(`Peça "${piece.name}" agora é o destaque da vitrine!`);
  };

  // Alterna status rápido da peça
  const setPieceStatus = (id, newStatus) => {
    catalog = loadCatalog().map(p => {
      if (p.id === id) {
        return {
          ...p,
          status: newStatus,
          isReady: newStatus === 'ready'
        };
      }
      return p;
    });
    saveCatalog(catalog);
    const statusLabels = {
      ready: 'Pronta Entrega',
      order: 'Sob Encomenda',
      suspended: 'Suspensa (Oculta da loja)'
    };
    showToast(`Status alterado para ${statusLabels[newStatus] || newStatus}!`);
  };

  // Exclusão de Peça
  const deletePiece = (id) => {
    const piece = catalog.find(p => p.id === id);
    const name = piece ? piece.name : 'esta peça';
    if (!confirm(`Deseja realmente excluir "${name}" do acervo?\nEssa ação removerá a peça da vitrine.`)) return;

    catalog = loadCatalog().filter(p => p.id !== id);
    saveCatalog(catalog);

    if (localStorage.getItem('jez_featured_product_id') === id) {
      localStorage.setItem('jez_featured_product_id', 'tote-cherry');
    }

    showToast('Peça removida do acervo.');
  };

  // Filtros de status do acervo
  document.querySelectorAll('.catalog-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.catalog-filter-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentCatalogFilter = e.currentTarget.getAttribute('data-filter');
      renderCatalog(document.getElementById('catalog-search-input').value.trim());
    });
  });

  document.getElementById('catalog-search-input').addEventListener('input', (e) => {
    renderCatalog(e.target.value.trim());
  });

  // --------------------------------------------------------------------------
  // 9. Modal de Edição de Peça
  // --------------------------------------------------------------------------
  const modalEditBackdrop = document.getElementById('modal-edit-backdrop');
  const btnCloseEditModal = document.getElementById('btn-close-edit-modal');
  const btnCancelEdit = document.getElementById('btn-cancel-edit');
  const formEditProduct = document.getElementById('form-edit-product');
  const editPhotoInput = document.getElementById('edit-photo-input');
  const editLeadtimeWrap = document.getElementById('edit-leadtime-wrap');

  let currentEditingPiece = null;
  let editCarouselItems = [];
  let activeCarouselIdx = 0;
  let editPieceExtraPhotos = [];

  const loadActiveCarouselPhoto = async () => {
    if (!editCarouselItems || editCarouselItems.length === 0) return;
    const current = editCarouselItems[activeCarouselIdx];
    if (!current) return;

    const titleLabel = document.getElementById('edit-crop-title-label');
    if (titleLabel) {
      titleLabel.textContent = current.isCover
        ? 'Foto da Peça (Moldura 1:1) — Capa Principal'
        : `Foto ${activeCarouselIdx + 1} do Carrossel (Moldura 1:1)`;
    }

    await editPieceCropper.loadImage(current.url);
    if (current.isModified && current.zoom) {
      editPieceCropper.setState({
        zoom: current.zoom,
        offsetX: current.offsetX,
        offsetY: current.offsetY
      });
    }
  };

  const saveActivePhotoCropState = () => {
    if (!editCarouselItems || !editCarouselItems[activeCarouselIdx]) return;
    const current = editCarouselItems[activeCarouselIdx];
    const st = editPieceCropper.getState();
    const changed = st.zoom !== 1 || st.offsetX !== 0 || st.offsetY !== 0 || current.isModified;
    if (changed) {
      current.zoom = st.zoom;
      current.offsetX = st.offsetX;
      current.offsetY = st.offsetY;
      current.isModified = true;
      const cropped = editPieceCropper.getCroppedDataUrl(600);
      if (cropped) {
        current.url = cropped;
      }
    }
  };

  const selectCarouselPhoto = async (index) => {
    if (index === activeCarouselIdx || index < 0 || index >= editCarouselItems.length) return;
    saveActivePhotoCropState();
    activeCarouselIdx = index;
    renderEditCarousel();
    await loadActiveCarouselPhoto();
  };

  const renderEditCarousel = () => {
    if (!editExtraPhotosGrid) return;
    editExtraPhotosGrid.innerHTML = '';

    editCarouselItems.forEach((item, idx) => {
      const thumb = document.createElement('div');
      thumb.className = `extra-photo-thumb ${idx === activeCarouselIdx ? 'active-thumb' : ''} ${item.isCover ? 'is-cover' : ''}`;
      thumb.setAttribute('data-idx', String(idx));
      thumb.setAttribute('title', `Foto ${idx + 1} (${item.isCover ? 'Capa' : 'Carrossel'}) — Clique para enquadrar 1:1`);

      const safeUrl = sanitizeImageUrl(item.url);
      const badgeText = item.isCover ? 'Capa' : `${idx + 1}`;
      const removeBtn = !item.isCover ? `
        <button type="button" class="btn-remove-extra-photo" data-idx="${idx}" aria-label="Remover foto do carrossel" title="Remover foto">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
        </button>
      ` : '';

      thumb.innerHTML = `
        <img src="${safeUrl}" alt="Foto ${idx + 1}">
        <span class="carousel-thumb-badge">${badgeText}</span>
        ${removeBtn}
      `;

      thumb.addEventListener('click', (e) => {
        if (e.target.closest('.btn-remove-extra-photo')) return;
        selectCarouselPhoto(idx);
      });

      editExtraPhotosGrid.appendChild(thumb);
    });

    const counterEl = document.getElementById('edit-carousel-counter');
    if (counterEl) {
      counterEl.textContent = `${editCarouselItems.length}/5 fotos`;
    }

    if (btnAddEditExtraPhoto) {
      if (editCarouselItems.length >= 5) {
        btnAddEditExtraPhoto.style.opacity = '0.5';
        btnAddEditExtraPhoto.disabled = true;
      } else {
        btnAddEditExtraPhoto.style.opacity = '1';
        btnAddEditExtraPhoto.disabled = false;
      }
    }

    // Mantém editPieceExtraPhotos sincronizado para retrocompatibilidade
    editPieceExtraPhotos = editCarouselItems.slice(1).map(i => i.url);
  };

  const openEditModal = async (pieceId) => {
    catalog = loadCatalog();
    const piece = catalog.find(p => p.id === pieceId);
    if (!piece) return;

    currentEditingPiece = piece;

    document.getElementById('edit-piece-id').value = piece.id;
    document.getElementById('edit-product-name').value = piece.name || '';
    document.getElementById('edit-product-category').value = piece.category || 'bolsas';
    document.getElementById('edit-product-price').value = piece.price || 0;
    document.getElementById('edit-product-dimensions').value = piece.dimensions || '';
    document.getElementById('edit-product-materials').value = piece.materials || '';
    document.getElementById('edit-product-desc').value = piece.description || '';

    // Status: ready, order, suspended
    const status = piece.status || (piece.isReady ? 'ready' : 'order');
    const radio = document.querySelector(`input[name="edit-status"][value="${status}"]`);
    if (radio) radio.checked = true;

    document.querySelectorAll('.status-radio-option').forEach(opt => {
      const r = opt.querySelector('input[type="radio"]');
      opt.classList.toggle('active', r.value === status);
    });

    if (status === 'order') {
      editLeadtimeWrap.style.display = 'block';
      document.getElementById('edit-product-leadtime').value = piece.leadTimeDays || 7;
    } else {
      editLeadtimeWrap.style.display = 'none';
    }

    // Exibe modal primeiro para que dimensões do viewport sejam computadas corretamente
    modalEditBackdrop.style.display = 'flex';

    // Monta itens do carrossel: capa (0) + extras (1..4)
    const initialPhotos = (Array.isArray(piece.images) && piece.images.length > 0)
      ? [...piece.images]
      : [piece.image || 'assets/products/tote_cherry.jpg'];

    editCarouselItems = initialPhotos.map((url, idx) => ({
      url: sanitizeImageUrl(url),
      isCover: idx === 0,
      isModified: false,
      zoom: 1,
      offsetX: 0,
      offsetY: 0
    }));

    activeCarouselIdx = 0;
    renderEditCarousel();
    await loadActiveCarouselPhoto();
  };

  const closeEditModal = () => {
    modalEditBackdrop.style.display = 'none';
  };

  btnCloseEditModal.addEventListener('click', closeEditModal);
  btnCancelEdit.addEventListener('click', closeEditModal);
  modalEditBackdrop.addEventListener('click', (e) => {
    if (e.target === modalEditBackdrop) closeEditModal();
  });

  // Alterne status no modal
  document.querySelectorAll('.status-radio-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.status-radio-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const radio = opt.querySelector('input[type="radio"]');
      radio.checked = true;

      if (radio.value === 'order') {
        editLeadtimeWrap.style.display = 'block';
      } else {
        editLeadtimeWrap.style.display = 'none';
      }
    });
  });

  // Gerenciamento do Carrossel de Fotos na Edição (JEZ-019)
  const btnAddEditExtraPhoto = document.getElementById('btn-add-edit-extra-photo');
  const editExtraPhotosInput = document.getElementById('edit-extra-photos-input');
  const editExtraPhotosGrid = document.getElementById('edit-extra-photos-grid');

  if (btnAddEditExtraPhoto && editExtraPhotosInput) {
    btnAddEditExtraPhoto.addEventListener('click', () => {
      if (editCarouselItems.length >= 5) {
        showToast('Limite de 5 fotos no carrossel atingido.');
        return;
      }
      editExtraPhotosInput.click();
    });

    editExtraPhotosInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      saveActivePhotoCropState();

      const availableSlots = 5 - editCarouselItems.length;
      const filesToProcess = files.slice(0, availableSlots);

      let firstNewIdx = -1;
      for (const file of filesToProcess) {
        const compressed = await compressImageFile(file);
        if (compressed) {
          const newIdx = editCarouselItems.length;
          if (firstNewIdx === -1) firstNewIdx = newIdx;
          editCarouselItems.push({
            url: compressed,
            isCover: newIdx === 0,
            isModified: true,
            zoom: 1,
            offsetX: 0,
            offsetY: 0
          });
        }
      }

      editExtraPhotosInput.value = '';
      if (firstNewIdx !== -1) {
        activeCarouselIdx = firstNewIdx;
        renderEditCarousel();
        await loadActiveCarouselPhoto();
        showToast(`Foto adicionada ao carrossel! Ajuste o enquadramento 1:1 acima.`);
      }
    });
  }

  if (editExtraPhotosGrid) {
    editExtraPhotosGrid.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn-remove-extra-photo');
      if (!btn) return;
      e.stopPropagation();
      const idx = parseInt(btn.getAttribute('data-idx'), 10);
      if (!isNaN(idx) && idx > 0 && idx < editCarouselItems.length) {
        editCarouselItems.splice(idx, 1);
        if (activeCarouselIdx >= editCarouselItems.length) {
          activeCarouselIdx = editCarouselItems.length - 1;
        } else if (activeCarouselIdx === idx) {
          activeCarouselIdx = Math.max(0, idx - 1);
        }
        renderEditCarousel();
        loadActiveCarouselPhoto();
        showToast('Foto removida do carrossel.');
      }
    });
  }

  // Trocar foto selecionada na edição
  const btnEditChangePhoto = document.getElementById('btn-edit-change-photo');
  if (btnEditChangePhoto) {
    btnEditChangePhoto.addEventListener('click', () => {
      editPhotoInput.click();
    });
  }

  editPhotoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const dataUrl = event.target.result;
      if (editCarouselItems[activeCarouselIdx]) {
        editCarouselItems[activeCarouselIdx].url = dataUrl;
        editCarouselItems[activeCarouselIdx].isModified = true;
        editCarouselItems[activeCarouselIdx].zoom = 1;
        editCarouselItems[activeCarouselIdx].offsetX = 0;
        editCarouselItems[activeCarouselIdx].offsetY = 0;
      }
      await editPieceCropper.loadImage(dataUrl);
      renderEditCarousel();
      showToast(`Foto ${activeCarouselIdx + 1} alterada! Ajuste o zoom e enquadramento.`);
    };
    reader.readAsDataURL(file);
    editPhotoInput.value = '';
  });

  // Salvar alterações da edição
  formEditProduct.addEventListener('submit', (e) => {
    e.preventDefault();

    const id = document.getElementById('edit-piece-id').value;
    const rawName = document.getElementById('edit-product-name').value;
    const name = sanitizeText(rawName, 120);
    const category = document.getElementById('edit-product-category').value;
    const rawPrice = parseFloat(document.getElementById('edit-product-price').value);
    const price = Math.max(0.01, isNaN(rawPrice) ? 1.0 : rawPrice);
    const statusRadio = document.querySelector('input[name="edit-status"]:checked');
    const status = statusRadio ? statusRadio.value : 'ready';
    const rawLeadTime = parseInt(document.getElementById('edit-product-leadtime').value, 10);
    const leadTimeDays = status === 'order' ? Math.max(1, Math.min(90, isNaN(rawLeadTime) ? 7 : rawLeadTime)) : 0;
    const dimensions = sanitizeText(document.getElementById('edit-product-dimensions').value, 150);
    const materials = sanitizeText(document.getElementById('edit-product-materials').value, 200);
    const description = sanitizeText(document.getElementById('edit-product-desc').value, 800);

    // Salva o recorte da foto atualmente ativa no cropper
    saveActivePhotoCropState();

    const categoryLabels = {
      bolsas: 'Bolsas & Bags',
      vestuario: 'Vestuário Autoral',
      acessorios: 'Acessórios'
    };

    const finalImages = editCarouselItems.map(item => sanitizeImageUrl(item.url));
    const coverImage = finalImages[0] || (currentEditingPiece ? currentEditingPiece.image : 'assets/products/tote_cherry.jpg');
    const updatedImages = finalImages.length > 0 ? [...finalImages] : [coverImage];

    catalog = loadCatalog().map(p => {
      if (p.id === id) {
        return {
          ...p,
          name,
          category,
          categoryLabel: categoryLabels[category] || p.categoryLabel,
          price,
          status,
          isReady: status === 'ready',
          leadTimeDays,
          dimensions,
          materials,
          description,
          image: coverImage,
          images: updatedImages
        };
      }
      return p;
    });

    saveCatalog(catalog);
    closeEditModal();
    showToast(`Peça "${name}" atualizada com sucesso!`);
  });

  // --------------------------------------------------------------------------
  // 10. Autenticação Criptográfica, Sessão & Gatekeeper do Ateliê (Morgan - Cibersegurança)
  // --------------------------------------------------------------------------

  const adminLoginScreen = document.getElementById('admin-login-screen');
  const adminWorkspace = document.getElementById('admin-workspace');
  const btnAdminLogout = document.getElementById('btn-admin-logout');
  const formAdminLogin = document.getElementById('form-admin-login');
  const adminPasswordInput = document.getElementById('admin-password');
  const btnTogglePassword = document.getElementById('btn-toggle-password');
  const loginErrorBox = document.getElementById('login-error-box');
  const btnLoginSubmit = document.getElementById('btn-login-submit');

  let lockoutTimerInterval = null;

  /**
   * Calcula o hash SHA-256 de uma string utilizando a Web Crypto API nativa do navegador
   * @param {string} text
   * @returns {Promise<string>} hash hexadecimal de 64 caracteres
   */
  async function sha256Hex(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  }

  /**
   * Verifica se existe uma sessão administrativa válida e não expirada em sessionStorage
   * @returns {boolean}
   */
  function hasValidSession() {
    try {
      const raw = sessionStorage.getItem(STORAGE_SESSION_KEY);
      if (!raw) return false;
      const session = JSON.parse(raw);
      if (!session || !session.token || !session.expiresAt) return false;
      if (Date.now() > session.expiresAt) {
        sessionStorage.removeItem(STORAGE_SESSION_KEY);
        return false;
      }
      return true;
    } catch (e) {
      sessionStorage.removeItem(STORAGE_SESSION_KEY);
      return false;
    }
  }

  /**
   * Cria nova sessão com token criptográfico e validade de 4 horas
   */
  function createSession() {
    const randomBytes = new Uint8Array(16);
    crypto.getRandomValues(randomBytes);
    const tokenHex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
    const sessionData = {
      token: 'jez_' + tokenHex,
      createdAt: Date.now(),
      expiresAt: Date.now() + SESSION_DURATION_MS
    };
    sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
  }

  /**
   * Destrói a sessão atual em sessionStorage
   */
  function destroySession() {
    sessionStorage.removeItem(STORAGE_SESSION_KEY);
  }

  /**
   * Retorna o estado atual de tentativas e eventual bloqueio temporário
   * @returns {{ attempts: number, lockedUntil: number | null }}
   */
  function getLockoutState() {
    try {
      const raw = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
      if (!raw) return { attempts: 0, lockedUntil: null };
      const state = JSON.parse(raw);
      if (state.lockedUntil && Date.now() < state.lockedUntil) {
        return state;
      }
      if (state.lockedUntil && Date.now() >= state.lockedUntil) {
        localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
        return { attempts: 0, lockedUntil: null };
      }
      return state;
    } catch (e) {
      return { attempts: 0, lockedUntil: null };
    }
  }

  /**
   * Registra uma tentativa falha de autenticação contra força bruta
   * @returns {{ attempts: number, lockedUntil: number | null }}
   */
  function recordFailedAttempt() {
    const state = getLockoutState();
    const newAttempts = (state.attempts || 0) + 1;
    let lockedUntil = null;
    if (newAttempts >= MAX_FAILED_ATTEMPTS) {
      lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
    }
    localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify({
      attempts: newAttempts,
      lockedUntil
    }));
    return { attempts: newAttempts, lockedUntil };
  }

  /**
   * Redefine o histórico de tentativas após login bem-sucedido
   */
  function resetLoginAttempts() {
    localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
  }

  /**
   * Inicia ou atualiza a contagem regressiva de bloqueio temporário
   * @param {number} lockedUntil
   */
  function startLockoutCountdown(lockedUntil) {
    if (lockoutTimerInterval) {
      clearInterval(lockoutTimerInterval);
      lockoutTimerInterval = null;
    }

    function updateCountdown() {
      const remainingMs = lockedUntil - Date.now();
      if (remainingMs <= 0) {
        clearInterval(lockoutTimerInterval);
        lockoutTimerInterval = null;
        localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
        if (loginErrorBox) {
          loginErrorBox.style.display = 'none';
          loginErrorBox.textContent = '';
        }
        if (adminPasswordInput) adminPasswordInput.disabled = false;
        if (btnLoginSubmit) btnLoginSubmit.disabled = false;
        return;
      }

      const totalSeconds = Math.ceil(remainingMs / 1000);
      const minutes = Math.floor(totalSeconds / 60);
      const seconds = totalSeconds % 60;
      const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

      if (loginErrorBox) {
        loginErrorBox.style.display = 'block';
        loginErrorBox.textContent = `Acesso temporariamente bloqueado por excesso de tentativas. Tente novamente em ${formattedTime}.`;
      }
      if (adminPasswordInput) adminPasswordInput.disabled = true;
      if (btnLoginSubmit) btnLoginSubmit.disabled = true;
    }

    updateCountdown();
    lockoutTimerInterval = setInterval(updateCountdown, 1000);
  }

  /**
   * Exibe a tela de login e oculta os dados sensíveis do ateliê
   * @param {string | null} errorMessage
   */
  function showLoginScreen(errorMessage = null) {
    if (adminLoginScreen) adminLoginScreen.style.display = 'flex';
    if (adminWorkspace) adminWorkspace.style.display = 'none';
    if (btnAdminLogout) btnAdminLogout.style.display = 'none';

    const lockoutState = getLockoutState();
    if (lockoutState.lockedUntil && Date.now() < lockoutState.lockedUntil) {
      startLockoutCountdown(lockoutState.lockedUntil);
    } else {
      if (adminPasswordInput) {
        adminPasswordInput.disabled = false;
        adminPasswordInput.value = '';
        adminPasswordInput.focus();
      }
      if (btnLoginSubmit) btnLoginSubmit.disabled = false;

      if (errorMessage && loginErrorBox) {
        loginErrorBox.style.display = 'block';
        loginErrorBox.textContent = errorMessage;
      } else if (loginErrorBox) {
        loginErrorBox.style.display = 'none';
        loginErrorBox.textContent = '';
      }
    }
  }

  /**
   * Exibe a área de gestão do ateliê e inicializa pedidos e catálogo
   */
  function showWorkspace() {
    if (lockoutTimerInterval) {
      clearInterval(lockoutTimerInterval);
      lockoutTimerInterval = null;
    }

    if (adminLoginScreen) adminLoginScreen.style.display = 'none';
    if (adminWorkspace) adminWorkspace.style.display = 'block';
    if (btnAdminLogout) btnAdminLogout.style.display = 'inline-flex';

    updateDashboard();
    renderOrders();
    renderCatalog();

    // Sincronização em Nuvem (Firebase Cloud Firestore — JEZ-021)
    initCloudSync();
  }

  const initCloudSync = () => {
    const syncBadge = document.getElementById('cloud-sync-badge');
    const updateBadge = (online) => {
      if (!syncBadge) return;
      if (online) {
        syncBadge.className = 'cloud-sync-badge';
        const label = syncBadge.querySelector('.sync-label');
        if (label) label.textContent = 'Nuvem Conectada';
      } else {
        syncBadge.className = 'cloud-sync-badge offline';
        const label = syncBadge.querySelector('.sync-label');
        if (label) label.textContent = 'Modo Local';
      }
    };

    if (window.jezFirebase) {
      window.jezFirebase.onConnectionChange(updateBadge);

      // Ouve pedidos em tempo real da nuvem
      window.jezFirebase.onOrdersChange((cloudOrders) => {
        if (Array.isArray(cloudOrders) && cloudOrders.length > 0) {
          orders = cloudOrders;
          localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
          renderOrders();
          updateDashboard();
        }
      });

      // Ouve catálogo em tempo real da nuvem
      window.jezFirebase.onProductsChange((cloudCatalog) => {
        if (Array.isArray(cloudCatalog) && cloudCatalog.length > 0) {
          catalog = cloudCatalog;
          localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(catalog));
          const searchInput = document.getElementById('catalog-search-input');
          renderCatalog(searchInput ? searchInput.value.trim() : '');
          updateDashboard();
        }
      });

      // Semeia o acervo inicial no Firestore caso o banco esteja novo/vazio
      window.jezFirebase.seedInitialProductsIfEmpty(defaultInitialCatalog);
    } else {
      updateBadge(false);
    }
  };

  // Alternar visibilidade da senha (mostrar/ocultar)
  if (btnTogglePassword && adminPasswordInput) {
    btnTogglePassword.addEventListener('click', () => {
      const isPassword = adminPasswordInput.type === 'password';
      adminPasswordInput.type = isPassword ? 'text' : 'password';

      const eyeOpen = btnTogglePassword.querySelector('.eye-icon-open');
      const eyeClosed = btnTogglePassword.querySelector('.eye-icon-closed');
      if (eyeOpen && eyeClosed) {
        eyeOpen.style.display = isPassword ? 'none' : 'block';
        eyeClosed.style.display = isPassword ? 'block' : 'none';
      }
    });
  }

  // Processamento da autenticação ao submeter o formulário
  if (formAdminLogin) {
    formAdminLogin.addEventListener('submit', async (e) => {
      e.preventDefault();

      const lockout = getLockoutState();
      if (lockout.lockedUntil && Date.now() < lockout.lockedUntil) {
        startLockoutCountdown(lockout.lockedUntil);
        return;
      }

      const inputPassword = adminPasswordInput ? adminPasswordInput.value.trim() : '';
      if (!inputPassword) {
        if (loginErrorBox) {
          loginErrorBox.style.display = 'block';
          loginErrorBox.textContent = 'Por favor, informe a chave de acesso do ateliê.';
        }
        return;
      }

      // Cálculo de hash criptográfico
      const calculatedHash = await sha256Hex(inputPassword);

      if (calculatedHash === HASH_MASTER_PASSWORD) {
        resetLoginAttempts();
        createSession();
        showWorkspace();
        showToast('Acesso autorizado. Bem-vinda ao ateliê!');
      } else {
        const result = recordFailedAttempt();
        if (result.lockedUntil) {
          startLockoutCountdown(result.lockedUntil);
        } else {
          const attemptsLeft = MAX_FAILED_ATTEMPTS - result.attempts;
          const msg = `Chave de acesso incorreta. ${attemptsLeft} tentativa${attemptsLeft === 1 ? '' : 's'} restante${attemptsLeft === 1 ? '' : 's'} antes do bloqueio temporário.`;
          showLoginScreen(msg);
        }
      }
    });
  }

  // Encerrar sessão (Logout)
  if (btnAdminLogout) {
    btnAdminLogout.addEventListener('click', () => {
      destroySession();
      showLoginScreen();
      showToast('Sessão encerrada com sucesso.');
    });
  }

  // Verificação inicial do Gatekeeper ao carregar a página
  if (hasValidSession()) {
    showWorkspace();
  } else {
    showLoginScreen();
  }
});
