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
    this.init();
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
    const hasVideo = images.some(img => {
      const url = typeof img === 'string' ? img : (img && img.url ? img.url : '');
      return url.includes('blusa_teia_loop.mp4');
    });
    const hasPhotoFirst = images.length > 0 && (() => {
      const first = images[0];
      const url = typeof first === 'string' ? first : (first && first.url ? first.url : '');
      return url.includes('blusa_teia.jpg');
    })();
    const hasCorrectMainImage = typeof rawProduct.image === 'string' && rawProduct.image.includes('blusa_teia.jpg');

    if (!hasVideo || !hasPhotoFirst || !hasCorrectMainImage || images.length < 2) {
      const blusaDocRef = doc(this.db, 'products', 'blusa-teia');
      setDoc(blusaDocRef, {
        image: 'assets/products/blusa_teia.jpg',
        images: ['assets/products/blusa_teia.jpg', 'assets/products/blusa_teia_loop.mp4'],
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
    if (!this.db || !Array.isArray(defaultProducts) || defaultProducts.length === 0) return;
    try {
      const colRef = collection(this.db, 'products');
      const snap = await getDocs(colRef);
      if (snap.empty) {
        console.debug('[JËZ Cloud] Banco de dados vazio. Populando acervo inicial de peças da Jéssica...');
        const promises = defaultProducts.map(p => {
          const docRef = doc(this.db, 'products', p.id);
          return setDoc(docRef, { ...p, createdAt: serverTimestamp(), updatedAt: serverTimestamp() });
        });
        await Promise.all(promises);
        console.debug('[JËZ Cloud] Acervo inicial de 9 peças gravado no Firestore com sucesso!');
      }
    } catch (err) {
      console.warn('[JËZ Cloud] Não foi possível verificar/popular acervo inicial (regras pendentes):', err.message);
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

  // Finalização transacional com validação atômica de estoque contra concorrência (JEZ-028)
  async checkoutWithStockCheck(orderData, cartItems) {
    if (!this.db) {
      const safeId = await this.createOrder(orderData);
      return { success: true, orderId: safeId, deductedItems: [] };
    }

    return await runTransaction(this.db, async (transaction) => {
      const itemsToDeduct = [];

      for (const item of cartItems) {
        if (!item.id) continue;
        const prodRef = doc(this.db, 'products', item.id);
        const prodSnap = await transaction.get(prodRef);

        if (prodSnap.exists()) {
          const prodData = prodSnap.data();
          // Verifica se a peça tem controle de estoque (pronta entrega ou stockQty definido)
          if (prodData.isReady || prodData.stockQty !== undefined) {
            const currentStock = Number(prodData.stockQty !== undefined ? prodData.stockQty : 1);
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
        }
      }

      // Decrementa o estoque atômicamente com bloqueio de concorrência
      for (const update of itemsToDeduct) {
        transaction.update(update.ref, {
          stockQty: update.newStock,
          updatedAt: serverTimestamp()
        });
      }

      // Grava o pedido
      const safeId = orderData.id || ('JEZ-' + Math.floor(1000 + Math.random() * 9000));
      const orderRef = doc(this.db, 'orders', safeId);
      const payload = {
        ...orderData,
        id: safeId,
        date: orderData.date || new Date().toISOString(),
        serverCreatedAt: serverTimestamp()
      };
      transaction.set(orderRef, payload);

      return {
        success: true,
        orderId: safeId,
        deductedItems: itemsToDeduct.map(i => ({ id: i.id, newStock: i.newStock }))
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
