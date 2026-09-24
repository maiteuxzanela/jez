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
    return sortCatalogByCuratedOrder(parsed);
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
  const sorted = sortCatalogByCuratedOrder(catalogList);
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
