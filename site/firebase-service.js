// ==========================================================================
// Serviço de Sincronização em Nuvem (Firebase Cloud Firestore) — JËZ Collection
// Arquitetura: Alex (CTO) | Cibersegurança & LGPD: Morgan | Frontend: Lumi & Cris
// ==========================================================================

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-app.js';
import {
  getFirestore,
  collection,
  doc,
  getDocs,
  getDoc,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  runTransaction
} from 'https://www.gstatic.com/firebasejs/10.13.2/firebase-firestore.js';

import { firebaseConfig } from './firebase-config.js';
import { defaultProducts, preserveFactoryMedia } from './js/services/products.js';

class JezFirebaseService {
  constructor() {
    this.app = null;
    this.db = null;
    this.isInitialized = false;
    this.isOnline = false;
    this.connectionListeners = [];
    // Publicacao sincrona do singleton ANTES de qualquer notificacao:
    // 'jez-cloud-status' e disparado dentro de init(), entao window.jezFirebase
    // precisa estar acessivel para que bindSync() nunca receba undefined.
    if (typeof window !== 'undefined') {
      window.jezFirebase = this;
    }
    this.readyPromise = this.init();
    if (typeof window !== 'undefined') {
      window.jezFirebaseReady = this.readyPromise;
    }
  }

  init() {
    try {
      this.app = initializeApp(firebaseConfig);
      this.db = getFirestore(this.app);
      this.isInitialized = true;
      this.isOnline = true;
      console.debug('[JËZ Cloud] Firebase Firestore inicializado com sucesso (Projeto: jez-collection)');
      this.notifyConnectionListeners(true);
    } catch (err) {
      console.warn('[JËZ Cloud] Falha ao inicializar Firebase (operando em modo offline/fallback local):', err);
      this.isInitialized = false;
      this.isOnline = false;
      this.notifyConnectionListeners(false);
    }
    return Promise.resolve(this.isInitialized);
  }

  onConnectionChange(callback) {
    if (typeof callback === 'function') {
      this.connectionListeners.push(callback);
      callback(this.isOnline);
    }
  }

  notifyConnectionListeners(status) {
    this.isOnline = status;
    this.connectionListeners.forEach(cb => {
      try { cb(status); } catch (e) { console.error(e); }
    });
    window.dispatchEvent(new CustomEvent('jez-cloud-status', { detail: { online: status } }));
  }

  // --------------------------------------------------------------------------
  // 1. Gestão de Peças do Acervo (Produtos)
  // --------------------------------------------------------------------------
  patchProductMediaIfNeeded(rawProduct) {
    if (!this.db || !rawProduct || rawProduct.id !== 'blusa-teia') return;
    const images = Array.isArray(rawProduct.images) ? rawProduct.images : [];
    // Blindagem: se a peca ja possui foto real enviada pela artesa (Data URL Base64),
    // o patch de fabrica NUNCA reescreve o documento no Firestore.
    const hasRealUpload = (typeof rawProduct.image === 'string' && rawProduct.image.trim().toLowerCase().startsWith('data:image/')) ||
      images.some(img => {
        const url = typeof img === 'string' ? img : (img && img.url ? img.url : '');
        return typeof url === 'string' && url.trim().toLowerCase().startsWith('data:image/');
      });
    if (hasRealUpload) return;
    const isFactoryPhoto = (value) => typeof value === 'string' && /blusa_teia\.(?:jpe?g|png|webp)(?:\?.*)?$/i.test(value.trim());
    const hasVideo = images.some(img => {
      const url = typeof img === 'string' ? img : (img && img.url ? img.url : '');
      return url.includes('blusa_teia_loop.mp4');
    });
    const hasPhotoFirst = images.length > 0 && (() => {
      const first = images[0];
      const url = typeof first === 'string' ? first : (first && first.url ? first.url : '');
      return isFactoryPhoto(url);
    })();
    const hasCorrectMainImage = isFactoryPhoto(rawProduct.image);

    if (!hasVideo || !hasPhotoFirst || !hasCorrectMainImage || images.length < 2) {
      const blusaDocRef = doc(this.db, 'products', 'blusa-teia');
      setDoc(blusaDocRef, {
        image: 'assets/products/blusa_teia.webp',
        images: ['assets/products/blusa_teia.webp', 'assets/products/blusa_teia_loop.mp4'],
        updatedAt: serverTimestamp()
      }, { merge: true }).then(() => {
        console.debug('[JËZ Cloud] Patch suave de mídia da blusa-teia aplicado com sucesso no Firestore');
      }).catch(err => {
        console.debug('[JËZ Cloud] Patch suave de mídia da blusa-teia ignorado:', err.message);
      });
    }
  }

  onProductsChange(callback) {
    if (!this.db) return () => {};
    try {
      const colRef = collection(this.db, 'products');
      const defaultOrder = [
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
      return onSnapshot(colRef, (snapshot) => {
        const products = [];
        snapshot.forEach(docSnap => {
          const raw = { id: docSnap.id, ...docSnap.data() };
          this.patchProductMediaIfNeeded(raw);
          const cured = typeof preserveFactoryMedia === 'function'
            ? preserveFactoryMedia(raw, defaultProducts)
            : raw;
          products.push(cured);
        });
        products.sort((a, b) => {
          const idxA = defaultOrder.indexOf(a.id);
          const idxB = defaultOrder.indexOf(b.id);
          if (idxA !== -1 && idxB !== -1) return idxA - idxB;
          if (idxA !== -1) return -1;
          if (idxB !== -1) return 1;
          return 0;
        });
        this.notifyConnectionListeners(true);
        callback(products);
      }, (err) => {
        console.warn('[JËZ Cloud] Erro no listener de produtos (verifique as regras do Firestore):', err.message);
        this.notifyConnectionListeners(false);
      });
    } catch (err) {
      console.warn('[JËZ Cloud] Exceção ao assinar produtos:', err);
      return () => {};
    }
  }

  waitForInitialProducts(timeoutMs = 1500) {
    return new Promise((resolve) => {
      if (!this.db) {
        resolve(null);
        return;
      }
      let settled = false;
      let unsubscribe = () => {};
      const timer = setTimeout(() => {
        if (!settled) {
          settled = true;
          try {
            unsubscribe();
          } catch (err) {
            console.debug('[JËZ Cloud] Erro ao desinscrever listener:', err);
          }
          resolve(null);
        }
      }, timeoutMs);

      unsubscribe = this.onProductsChange((products) => {
        if (!settled && Array.isArray(products) && products.length > 0) {
          settled = true;
          clearTimeout(timer);
          resolve(products);
        }
      });
    });
  }

  async saveProduct(product) {
    if (!this.db) throw new Error('Firestore não inicializado');
    const safeId = product.id || ('prod_' + Date.now());
    const docRef = doc(this.db, 'products', safeId);
    const dataToSave = {
      ...product,
      id: safeId,
      updatedAt: serverTimestamp()
    };
    await setDoc(docRef, dataToSave, { merge: true });
    return safeId;
  }

  async deleteProduct(productId) {
    if (!this.db) throw new Error('Firestore não inicializado');
    const docRef = doc(this.db, 'products', productId);
    await deleteDoc(docRef);
  }

  async seedInitialProductsIfEmpty(defaultProducts) {
    return this.seedMissingProducts(defaultProducts);
  }

  // Semeia apenas as pecas editoriais ausentes, sem sobrescrever nenhum documento
  // existente no Firestore (fotos reais e pecas 'custom-*' ficam intocadas).
  async seedMissingProducts(defaultProducts) {
    if (!this.db || !Array.isArray(defaultProducts) || defaultProducts.length === 0) return [];
    try {
      const colRef = collection(this.db, 'products');
      const snap = await getDocs(colRef);
      const existingIds = new Set(snap.docs.map(docSnap => docSnap.id));
      const missing = defaultProducts.filter(p => p && p.id && !existingIds.has(p.id));
      if (missing.length === 0) return [];
      console.debug('[JËZ Cloud] Semeando pecas editoriais ausentes no Firestore:', missing.map(p => p.id).join(', '));
      const promises = missing.map(p => {
        const docRef = doc(this.db, 'products', p.id);
        return setDoc(docRef, { ...p, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
      });
      await Promise.all(promises);
      console.debug('[JËZ Cloud] Pecas editoriais ausentes gravadas com sucesso:', missing.length);
      return missing.map(p => p.id);
    } catch (err) {
      console.warn('[JËZ Cloud] Nao foi possivel semear pecas editoriais ausentes (regras pendentes):', err.message);
      return [];
    }
  }

  // --------------------------------------------------------------------------
  // 2. Gestão de Pedidos (Orders)
  // --------------------------------------------------------------------------
  onOrdersChange(callback) {
    if (!this.db) return () => {};
    try {
      const colRef = collection(this.db, 'orders');
      return onSnapshot(colRef, (snapshot) => {
        const orders = [];
        snapshot.forEach(docSnap => {
          orders.push({ id: docSnap.id, ...docSnap.data() });
        });
        // Ordena do mais recente para o mais antigo
        orders.sort((a, b) => new Date(b.date || 0) - new Date(a.date || 0));
        this.notifyConnectionListeners(true);
        callback(orders);
      }, (err) => {
        console.warn('[JËZ Cloud] Erro ao carregar pedidos em tempo real (verifique as regras do Firestore):', err.message);
        this.notifyConnectionListeners(false);
      });
    } catch (err) {
      console.warn('[JËZ Cloud] Exceção ao assinar pedidos:', err);
      return () => {};
    }
  }

  async createOrder(orderData) {
    if (!this.db) throw new Error('Firestore não inicializado');
    const safeId = orderData.id || ('JEZ-' + Math.floor(1000 + Math.random() * 9000));
    const docRef = doc(this.db, 'orders', safeId);
    const payload = {
      ...orderData,
      id: safeId,
      date: orderData.date || new Date().toISOString(),
      serverCreatedAt: serverTimestamp()
    };
    await setDoc(docRef, payload);
    return safeId;
  }

  // Classificacao de modalidade de um item da sacola (JEZ-043 / RN-JEZ-001).
  // Pecas sob encomenda nunca disputam estoque fisico de prateleira.
  isReadyStockItem(item) {
    if (!item) return false;
    if (item.status === 'order') return false;
    if (item.hasCustomProduction === true) return false;
    if (item.isReady === false) return false;
    if (item.isReady === true) return true;
    if (item.status === 'ready') return true;
    return true;
  }

  // Classificacao canonica a partir do documento de produto no Firestore.
  isReadyStockPiece(piece) {
    if (!piece) return false;
    if (piece.status === 'order') return false;
    if (piece.hasCustomProduction === true) return false;
    if (piece.status) return piece.status === 'ready';
    if (piece.isReady !== undefined) return piece.isReady === true;
    return true;
  }

  // --------------------------------------------------------------------------
  // Fila de Producao do Atelie (JEZ-044) - singleton meta/production_queue
  // totalBacklogDays: dias uteis enfileirados | activeOrdersCount: pedidos sob
  // encomenda em producao. O checkout incrementa na mesma transacao atomica.
  // --------------------------------------------------------------------------
  normalizeQueueDays(value) {
    const numeric = Number(value);
    if (!Number.isFinite(numeric) || numeric < 0) return 0;
    return Math.floor(numeric);
  }

  // Dias de confeccao de uma sacola: (leadTimeDays || 7) * quantity, apenas
  // para pecas sob encomenda. Pronta entrega nunca consome a fila do atelie.
  computeOrderProductionDays(items) {
    const list = Array.isArray(items) ? items : [];
    return list.reduce((total, item) => {
      if (!item || this.isReadyStockItem(item)) return total;
      const perPiece = Number(item.leadTimeDays) > 0 ? Math.floor(Number(item.leadTimeDays)) : 7;
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      return total + (perPiece * quantity);
    }, 0);
  }

  async getProductionQueue() {
    const fallback = { totalBacklogDays: 0, activeOrdersCount: 0 };
    if (!this.db) return fallback;
    try {
      const snap = await getDoc(doc(this.db, 'meta', 'production_queue'));
      if (!snap.exists()) return fallback;
      const data = snap.data() || {};
      return {
        totalBacklogDays: this.normalizeQueueDays(data.totalBacklogDays),
        activeOrdersCount: this.normalizeQueueDays(data.activeOrdersCount)
      };
    } catch (err) {
      console.warn('[JËZ Cloud] Falha ao ler a fila de producao:', err && err.message);
      return fallback;
    }
  }

  onProductionQueueChange(callback) {
    if (!this.db || typeof callback !== 'function') return () => {};
    try {
      const docRef = doc(this.db, 'meta', 'production_queue');
      return onSnapshot(docRef, (snap) => {
        const data = snap.exists() ? (snap.data() || {}) : {};
        callback({
          totalBacklogDays: this.normalizeQueueDays(data.totalBacklogDays),
          activeOrdersCount: this.normalizeQueueDays(data.activeOrdersCount)
        });
      }, (err) => {
        console.warn('[JËZ Cloud] Erro no listener da fila de producao:', err && err.message);
      });
    } catch (err) {
      console.warn('[JËZ Cloud] Excecao ao assinar a fila de producao:', err);
      return () => {};
    }
  }

  async setProductionQueue(queue) {
    const payload = queue || {};
    const totalBacklogDays = this.normalizeQueueDays(payload.totalBacklogDays);
    const activeOrdersCount = this.normalizeQueueDays(payload.activeOrdersCount);
    if (!this.db) {
      return { success: false, totalBacklogDays, activeOrdersCount };
    }
    await setDoc(doc(this.db, 'meta', 'production_queue'), {
      totalBacklogDays,
      activeOrdersCount,
      updatedAt: serverTimestamp()
    }, { merge: true });
    return { success: true, totalBacklogDays, activeOrdersCount };
  }

  // Baixa idempotente da fila quando um pedido sob encomenda e despachado.
  async releaseProductionBacklog(release) {
    const data = release || {};
    const toDays = (value) => {
      const numeric = Number(value);
      if (!Number.isFinite(numeric) || numeric < 0) return 0;
      return Math.floor(numeric);
    };
    const productionDays = toDays(data.productionDays);
    const orderId = String(data.orderId || '');
    if (!this.db) {
      return { success: false, alreadyReleased: false, totalBacklogDays: 0, activeOrdersCount: 0 };
    }
    const docRef = doc(this.db, 'meta', 'production_queue');
    return await runTransaction(this.db, async (transaction) => {
      const snap = await transaction.get(docRef);
      const queueData = snap.exists() ? (snap.data() || {}) : {};
      const currentBacklog = toDays(queueData.totalBacklogDays);
      const currentActive = toDays(queueData.activeOrdersCount);
      const releasedIds = Array.isArray(queueData.releasedOrderIds) ? queueData.releasedOrderIds.slice() : [];
      if (orderId && releasedIds.indexOf(orderId) !== -1) {
        return { success: true, alreadyReleased: true, totalBacklogDays: currentBacklog, activeOrdersCount: currentActive };
      }
      const nextBacklog = Math.max(0, currentBacklog - productionDays);
      const nextActive = Math.max(0, currentActive - 1);
      if (orderId) releasedIds.push(orderId);
      transaction.set(docRef, {
        totalBacklogDays: nextBacklog,
        activeOrdersCount: nextActive,
        releasedOrderIds: releasedIds.slice(-100),
        lastReleasedOrderId: orderId,
        lastReleaseReason: String(data.reason || ''),
        updatedAt: serverTimestamp()
      }, { merge: true });
      return { success: true, alreadyReleased: false, totalBacklogDays: nextBacklog, activeOrdersCount: nextActive };
    });
  }

  // Finalizacao transacional com validacao atomica de estoque contra concorrencia (JEZ-028 & JEZ-043)
  async checkoutWithStockCheck(orderData, cartItems) {
    const toQueueDays = (value) => {
      const numeric = Number(value);
      if (!Number.isFinite(numeric) || numeric < 0) return 0;
      return Math.floor(numeric);
    };
    const daysForItems = (list) => (Array.isArray(list) ? list : []).reduce((total, item) => {
      if (!item) return total;
      const perPiece = Number(item.leadTimeDays) > 0 ? Math.floor(Number(item.leadTimeDays)) : 7;
      const quantity = Math.max(1, Math.floor(Number(item.quantity) || 1));
      return total + (perPiece * quantity);
    }, 0);

    const items = Array.isArray(cartItems) ? cartItems : [];
    // Bifurcacao de fluxo: pronta entrega disputa estoque; encomenda segue direto.
    const readyItems = items.filter(item => this.isReadyStockItem(item));
    const orderItems = items.filter(item => !this.isReadyStockItem(item));

    if (!this.db) {
      const offlineProductionDays = daysForItems(orderItems);
      const safeId = await this.createOrder({
        ...orderData,
        hasCustomProduction: Boolean(orderData.hasCustomProduction) || orderItems.length > 0,
        orderProductionDays: offlineProductionDays,
        queueDaysAtOrder: 0,
        totalEstimatedLeadTimeDays: offlineProductionDays
      });
      return {
        success: true,
        orderId: safeId,
        deductedItems: [],
        readyItems: readyItems.map(item => item.id),
        orderItems: orderItems.map(item => item.id),
        orderProductionDays: offlineProductionDays,
        queueDaysAtOrder: 0,
        totalEstimatedLeadTimeDays: offlineProductionDays
      };
    }

    return await runTransaction(this.db, async (transaction) => {
      const itemsToDeduct = [];

      // Grupo 1 - pronta entrega: trava atomica, validacao de saldo e deducao fisica.
      for (const item of readyItems) {
        if (!item.id) continue;
        const prodRef = doc(this.db, 'products', item.id);
        const prodSnap = await transaction.get(prodRef);
        if (!prodSnap.exists()) continue;

        const prodData = prodSnap.data();
        // Reclassificacao defensiva: o documento da nuvem e a fonte da verdade.
        if (!this.isReadyStockPiece(prodData)) continue;

        const currentStock = Number(prodData.stockQty !== undefined && prodData.stockQty !== null ? prodData.stockQty : 1);
        const requestedQty = Number(item.quantity) || 1;

        if (currentStock < requestedQty) {
          const err = new Error(`ESTOQUE_ESGOTADO:${prodData.name || item.name}:${currentStock}`);
          err.code = 'ESTOQUE_ESGOTADO';
          err.productName = prodData.name || item.name;
          err.availableStock = currentStock;
          throw err;
        }

        itemsToDeduct.push({
          ref: prodRef,
          newStock: Math.max(0, currentStock - requestedQty),
          id: item.id
        });
      }

      // Fila do atelie (JEZ-044): leitura do singleton meta/production_queue
      // ANTES de qualquer escrita para preservar a atomicidade do runTransaction.
      const hasCustomProduction = Boolean(orderData.hasCustomProduction) || orderItems.length > 0;
      const productionItemList = orderItems.length > 0
        ? orderItems
        : (hasCustomProduction && Array.isArray(orderData.items) ? orderData.items : []);
      const orderProductionDays = hasCustomProduction ? daysForItems(productionItemList) : 0;
      const queueRef = doc(this.db, 'meta', 'production_queue');
      let queueDaysAtOrder = 0;
      let queueActiveOrders = 0;
      if (orderProductionDays > 0) {
        const queueSnap = await transaction.get(queueRef);
        const queueData = queueSnap.exists() ? (queueSnap.data() || {}) : {};
        queueDaysAtOrder = toQueueDays(queueData.totalBacklogDays);
        queueActiveOrders = toQueueDays(queueData.activeOrdersCount);
      }

      // Grupo 2 - sob encomenda: nenhuma trava de estoque, nenhuma validacao de
      // saldo zero e nenhuma deducao fisica no Firestore (RN-JEZ-001).
      for (const update of itemsToDeduct) {
        transaction.update(update.ref, {
          stockQty: update.newStock,
          updatedAt: serverTimestamp()
        });
      }

      const computedLeadTimeDays = [...orderItems, ...(Array.isArray(orderData.items) ? orderData.items : [])]
        .reduce((maxDays, item) => Math.max(maxDays, Number(item.leadTimeDays) || 0), 0);
      const leadTimeDays = hasCustomProduction
        ? (Number(orderData.leadTimeDays !== undefined && orderData.leadTimeDays !== null ? orderData.leadTimeDays : computedLeadTimeDays) || 0)
        : 0;
      // Prazo total = fila acumulada no momento da compra + confeccao desta sacola.
      const totalEstimatedLeadTimeDays = queueDaysAtOrder + orderProductionDays;

      // Gravacao unificada do pedido com sinalizacao de producao sob demanda.
      const safeId = orderData.id || ('JEZ-' + Math.floor(1000 + Math.random() * 9000));
      const orderRef = doc(this.db, 'orders', safeId);
      const payload = {
        ...orderData,
        id: safeId,
        date: orderData.date || new Date().toISOString(),
        hasCustomProduction,
        leadTimeDays,
        orderProductionDays,
        queueDaysAtOrder,
        totalEstimatedLeadTimeDays,
        serverCreatedAt: serverTimestamp()
      };
      transaction.set(orderRef, payload);

      // Incremento atomico da fila do atelie, somente quando ha confeccao real.
      if (orderProductionDays > 0) {
        transaction.set(queueRef, {
          totalBacklogDays: queueDaysAtOrder + orderProductionDays,
          activeOrdersCount: queueActiveOrders + 1,
          updatedAt: serverTimestamp()
        }, { merge: true });
      }

      return {
        success: true,
        orderId: safeId,
        deductedItems: itemsToDeduct.map(i => ({ id: i.id, newStock: i.newStock })),
        readyItems: readyItems.map(i => i.id),
        orderItems: orderItems.map(i => i.id),
        orderProductionDays,
        queueDaysAtOrder,
        totalEstimatedLeadTimeDays
      };
    });
  }

  async updateOrderStatus(orderId, newStatus, trackingCode = '') {
    if (!this.db) throw new Error('Firestore não inicializado');
    const docRef = doc(this.db, 'orders', orderId);
    await updateDoc(docRef, {
      status: newStatus,
      trackingCode: trackingCode || '',
      updatedAt: serverTimestamp()
    });
  }

  async clearOrders() {
    if (!this.db) throw new Error('Firestore não inicializado');
    const colRef = collection(this.db, 'orders');
    const snap = await getDocs(colRef);
    const deletePromises = snap.docs.map(docSnap => deleteDoc(docSnap.ref));
    await Promise.all(deletePromises);
  }

  // --------------------------------------------------------------------------
  // 3. Peça em Destaque da Vitrine (Hero Polaroid)
  // --------------------------------------------------------------------------
  onFeaturedChange(callback) {
    if (!this.db) return () => {};
    try {
      const docRef = doc(this.db, 'config', 'featured');
      return onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data && data.productId) callback(data.productId);
        }
      }, (err) => {
        console.warn('[JËZ Cloud] Erro no listener de destaque:', err.message);
      });
    } catch (err) {
      console.warn('[JËZ Cloud] Exceção ao assinar destaque:', err);
      return () => {};
    }
  }

  async setFeaturedProduct(productId) {
    if (!this.db) throw new Error('Firestore não inicializado');
    const docRef = doc(this.db, 'config', 'featured');
    await setDoc(docRef, { productId, updatedAt: serverTimestamp() });
  }
}

// Instância única exposta globalmente para integração com app.js e admin.js
const jezFirebase = new JezFirebaseService();
window.jezFirebase = jezFirebase;

export default jezFirebase;
