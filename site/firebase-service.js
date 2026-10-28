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

  // Finalizacao transacional com validacao atomica de estoque contra concorrencia (JEZ-028 & JEZ-043)
  async checkoutWithStockCheck(orderData, cartItems) {
    if (!this.db) {
      const safeId = await this.createOrder(orderData);
      return { success: true, orderId: safeId, deductedItems: [], readyItems: [], orderItems: [] };
    }

    const items = Array.isArray(cartItems) ? cartItems : [];
    // Bifurcacao de fluxo: pronta entrega disputa estoque; encomenda segue direto.
    const readyItems = items.filter(item => this.isReadyStockItem(item));
    const orderItems = items.filter(item => !this.isReadyStockItem(item));

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

      // Grupo 2 - sob encomenda: nenhuma trava de estoque, nenhuma validacao de
      // saldo zero e nenhuma deducao fisica no Firestore (RN-JEZ-001).
      for (const update of itemsToDeduct) {
        transaction.update(update.ref, {
          stockQty: update.newStock,
          updatedAt: serverTimestamp()
        });
      }

      const hasCustomProduction = Boolean(orderData.hasCustomProduction) || orderItems.length > 0;
      const computedLeadTimeDays = [...orderItems, ...(Array.isArray(orderData.items) ? orderData.items : [])]
        .reduce((maxDays, item) => Math.max(maxDays, Number(item.leadTimeDays) || 0), 0);
      const leadTimeDays = hasCustomProduction
        ? (Number(orderData.leadTimeDays !== undefined && orderData.leadTimeDays !== null ? orderData.leadTimeDays : computedLeadTimeDays) || 0)
        : 0;

      // Gravacao unificada do pedido com sinalizacao de producao sob demanda.
      const safeId = orderData.id || ('JEZ-' + Math.floor(1000 + Math.random() * 9000));
      const orderRef = doc(this.db, 'orders', safeId);
      const payload = {
        ...orderData,
        id: safeId,
        date: orderData.date || new Date().toISOString(),
        hasCustomProduction,
        leadTimeDays,
        serverCreatedAt: serverTimestamp()
      };
      transaction.set(orderRef, payload);

      return {
        success: true,
        orderId: safeId,
        deductedItems: itemsToDeduct.map(i => ({ id: i.id, newStock: i.newStock })),
        readyItems: readyItems.map(i => i.id),
        orderItems: orderItems.map(i => i.id)
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
