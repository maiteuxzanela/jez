/**
 * ==========================================================================
 * JEZ Collection — Serviço de Gestão de Produtos e Acervo
 * Especialistas: Sam (E-Commerce) & Cris (Merchant & Ateliê)
 * Supervisão: Alex (CTO)
 * ==========================================================================
 */

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

export const defaultProducts = [
  {
    id: 'bolsa-punk',
    name: 'Bolsa Punk Slouchy com Correntes',
    category: 'bolsas',
    categoryLabel: 'Bolsas & Bags',
    price: 169.90,
    image: 'assets/products/bolsa_punk.jpg',
    images: ['assets/products/bolsa_punk.jpg', 'assets/products/bolsa_punk_detail.jpg'],
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
    image: 'assets/products/tote_cherry.jpg',
    images: ['assets/products/tote_cherry.jpg', 'assets/products/tote_cherry_detail.jpg'],
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
    image: 'assets/products/shoulder_coracao.jpg',
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
    image: 'assets/products/bolsa_xadrez.jpg',
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
    image: 'assets/products/blusa_teia.jpg',
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
    image: 'assets/products/top_bandana.jpg',
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
    image: 'assets/products/cardiga_manteiga.jpg',
    isReady: false,
    leadTimeDays: 7,
    dimensions: 'Comprimento 38cm, mangas 58cm (veste do 36 ao 40)',
    materials: 'Fio especial macio em tom amarelo manteiga suave com trama canelada',
    description: 'Shrug delicado de meia-estação com mangas longas e caimento leve. O tom manteiga ilumina composições e traz aconchego artesanal.'
  },
  {
    id: 'chaveiro-baphomet',
    name: 'Chaveiro Baphomet Amigurumi',
    category: 'acessorios',
    categoryLabel: 'Acessórios & Arte',
    price: 49.90,
    image: 'assets/products/chaveiro_baphomet.jpg',
    images: ['assets/products/chaveiro_baphomet.jpg', 'assets/products/chaveiro_baphomet_detail.jpg'],
    isReady: true,
    stockQty: 3,
    dimensions: '12cm (A) × 8cm (L)',
    materials: 'Fio 100% algodão preto, enchimento antialérgico, argola e mosquetão em metal',
    description: 'Mini amigurumi do Baphomet com chifres detalhados e acabamento gótico primoroso. Item colecionável autoral com gancho para bolsas e chaves.'
  },
  {
    id: 'porta-airpods',
    name: 'Porta AirPods / Moedas Quadriculado',
    category: 'acessorios',
    categoryLabel: 'Acessórios & Arte',
    price: 39.90,
    image: 'assets/products/porta_airpods.jpg',
    isReady: true,
    stockQty: 1,
    dimensions: '7cm × 7cm (compatível com estojos AirPods 1, 2, 3 e Pro)',
    materials: 'Fio de algodão estruturado xadrez P&B, fecho com botão magnético e argola',
    description: 'Case artesanal protetora para fones sem fio ou moedas. Estampa checkerboard geométrica com forro reforçado e argola para pendurar.'
  }
];

export const defaultInitialCatalog = defaultProducts;

export function sortProductsByCuratedOrder(list) {
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

export function isProductSoldOut(product) {
  if (!product) return false;
  const isReady = product.status ? product.status === 'ready' : (product.isReady !== undefined ? product.isReady : true);
  if (isReady || product.stockQty !== undefined) {
    const stock = Number(product.stockQty !== undefined && product.stockQty !== null ? product.stockQty : (isReady ? 1 : 0));
    return stock <= 0;
  }
  return false;
}

export function isItemCustomProduction(item) {
  if (!item) return false;
  if (item.hasCustomProduction !== undefined) return Boolean(item.hasCustomProduction);
  if (item.isReady !== undefined) return !item.isReady;
  if (item.status) return item.status === 'order';
  if (item.leadTimeDays && Number(item.leadTimeDays) > 0) return true;
  return false;
}

export function isOrderCustomProduction(order) {
  if (!order) return false;
  if (order.hasCustomProduction !== undefined) return Boolean(order.hasCustomProduction);
  if (Array.isArray(order.items) && order.items.length > 0) {
    return order.items.some(item => isItemCustomProduction(item));
  }
  return false;
}

export function filterActiveProducts(list) {
  if (!Array.isArray(list)) return [];
  return list.filter(p => p && p.status !== 'suspended');
}
