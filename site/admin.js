/**
 * ==========================================================================
 * JEZ Ateliê & Gestão — Orquestrador Modular do Painel Administrativo (JEZ-030)
 * Arquitetura: Alex (CTO) | Frontend & UX: Lumi | Merchant: Cris
 * Diretrizes: Rigorosamente ZERO EMOJIS, paleta oficial da JEZ, arquitetura modular ES6
 * ==========================================================================
 */

import {
  sha256Hex,
  hasValidSession,
  createSession,
  destroySession,
  getLockoutState,
  recordFailedAttempt,
  resetLoginAttempts,
  HASH_MASTER_PASSWORD,
  SESSION_DURATION_MS,
  MAX_FAILED_ATTEMPTS,
  LOCKOUT_DURATION_MS,
  STORAGE_SESSION_KEY,
  STORAGE_ATTEMPTS_KEY
} from './js/admin/auth.js';

// Contratos de seguranca e autenticacao (JEZ-016 / JEZ-030):
// - Web Crypto API nativa: crypto.subtle.digest com sha256Hex
// - Hash da chave mestre: HASH_MASTER_PASSWORD = '3ec583f48c630ea4e2c7ef915480e1e0fe6fa96225b9affcb5d4feefd0e42711'
// - Rate limiting forca bruta: MAX_FAILED_ATTEMPTS = 5
// - Bloqueio temporario: LOCKOUT_DURATION_MS = 5 * 60 * 1000
// - Duracao da sessao: SESSION_DURATION_MS = 4 * 60 * 60 * 1000
// - Armazenamento de sessao: sessionStorage.getItem(STORAGE_SESSION_KEY)


import { setupPhotoCropper } from './js/admin/cropper.js';
import { compressImageFile } from './js/admin/image-compression.js';
import {
  defaultInitialCatalog,
  defaultCatalogOrder,
  sortCatalogByCuratedOrder,
  loadCatalog,
  handleStorageQuotaExceeded,
  saveCatalog,
  STORAGE_CATALOG_KEY,
  STORAGE_CUSTOM_PRODUCTS_KEY
} from './js/admin/catalog.js';

// Contratos de delegacao modular homologados (JEZ-029 / JEZ-030):
// - catalog.js: try { localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(catalog)); } catch (err) { handleStorageQuotaExceeded(...) }
// - image-compression.js: compressImageFile(file, maxWidth = 540, quality = 0.68)
// - cropper.js: getCroppedDataUrl(targetSize = 540) -> canvas.toDataURL('image/jpeg', 0.72)


import {
  STORAGE_ORDERS_KEY,
  loadOrders,
  saveOrders,
  isItemCustomProduction,
  isOrderCustomProduction,
  getStatusMeta,
  filterOrdersList,
  validateOrderStatusTransition,
  updateOrderInList
} from './js/admin/orders.js';

import {
  calculateDashboardMetrics,
  renderDashboard
} from './js/admin/dashboard.js';

// Re-exportações para interoperabilidade e contratos de teste
export {
  sha256Hex,
  hasValidSession,
  createSession,
  destroySession,
  setupPhotoCropper,
  compressImageFile,
  loadCatalog,
  saveCatalog,
  handleStorageQuotaExceeded,
  loadOrders,
  saveOrders,
  isItemCustomProduction,
  isOrderCustomProduction,
  getStatusMeta,
  filterOrdersList,
  validateOrderStatusTransition,
  updateOrderInList,
  calculateDashboardMetrics,
  renderDashboard
};

const initAdmin = () => {
  let orders = loadOrders();
  let catalog = loadCatalog();
  let currentOrderFilter = 'all';
  let currentCatalogFilter = 'all';
  let newPieceExtraPhotos = [];
  let editPieceExtraPhotos = [];
  let lockoutTimerInterval = null;

  // --------------------------------------------------------------------------
  // 1. Utilitários de Segurança e Sanitização (Morgan)
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
    const assetIdx = trimmed.indexOf('assets/products/');
    if (assetIdx !== -1) return trimmed.slice(assetIdx);
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

  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(val) || 0);
  };

  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  const showToast = (message) => {
    const toast = document.getElementById('admin-toast');
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  // --------------------------------------------------------------------------
  // 2. Configuração de Recortadores de Foto (Lumi)
  // --------------------------------------------------------------------------
  const newPieceCropper = setupPhotoCropper({
    viewportEl: document.getElementById('crop-viewport'),
    imgEl: document.getElementById('crop-source-img'),
    zoomSlider: document.getElementById('crop-zoom-slider'),
    btnZoomIn: document.getElementById('btn-zoom-in'),
    btnZoomOut: document.getElementById('btn-zoom-out'),
    btnReset: document.getElementById('btn-reset-crop'),
    zoomValEl: document.getElementById('zoom-val-display')
  });

  const editPieceCropper = setupPhotoCropper({
    viewportEl: document.getElementById('edit-crop-viewport'),
    imgEl: document.getElementById('edit-crop-source-img'),
    zoomSlider: document.getElementById('edit-crop-zoom-slider'),
    btnZoomIn: document.getElementById('btn-edit-zoom-in'),
    btnZoomOut: document.getElementById('btn-edit-zoom-out'),
    btnReset: document.getElementById('btn-edit-reset-crop'),
    zoomValEl: document.getElementById('edit-zoom-val-display')
  });

  // --------------------------------------------------------------------------
  // 3. Atualização do Dashboard (Cris)
  // --------------------------------------------------------------------------
  const updateDashboard = () => {
    orders = loadOrders();
    catalog = loadCatalog();
    renderDashboard(
      {
        salesValueEl: document.getElementById('kpi-sales-value'),
        salesCountEl: document.getElementById('kpi-sales-count'),
        shippingValueEl: document.getElementById('kpi-shipping-value'),
        shippingSubtextEl: document.getElementById('kpi-shipping-subtext'),
        productionValueEl: document.getElementById('kpi-production-value'),
        pendingBadgeEl: document.getElementById('pending-orders-badge'),
        recentContainerEl: document.getElementById('dashboard-recent-orders')
      },
      {
        orders,
        catalog,
        formatCurrency,
        getStatusMeta,
        escapeHtml
      }
    );
  };

  // --------------------------------------------------------------------------
  // 4. Gestão de Peça em Destaque no Hero (JEZ-015)
  // --------------------------------------------------------------------------
  const setFeaturedPiece = (productId) => {
    if (!productId || typeof productId !== 'string') return;
    try {
      catalog = loadCatalog();
      const piece = catalog.find(p => p.id === productId);
      localStorage.setItem('jez_featured_product_id', productId);

      if (piece) {
        try {
          localStorage.setItem('jez_featured_product_cache', JSON.stringify({
            id: piece.id,
            name: piece.name,
            price: piece.price,
            formattedPrice: formatCurrency(piece.price),
            image: piece.image,
            webp: piece.image && piece.image.startsWith('assets/') ? piece.image.replace(/\.(jpg|jpeg|png)$/i, '.webp') : ''
          }));
        } catch (e) {
          console.warn('[JËZ Ateliê] Falha ao atualizar cache de destaque:', e);
        }
      }

      if (typeof window !== 'undefined' && window.jezFirebase) {
        if (typeof window.jezFirebase.setFeaturedProduct === 'function') {
          window.jezFirebase.setFeaturedProduct(productId).catch(err => {
            console.warn('[JËZ Cloud] Erro ao sincronizar destaque:', err.message);
          });
        } else if (typeof window.jezFirebase.setConfig === 'function') {
          window.jezFirebase.setConfig('featured', { productId }).catch(err => {
            console.warn('[JËZ Cloud] Erro ao sincronizar destaque:', err.message);
          });
        }
      }

      const searchInput = document.getElementById('catalog-search-input');
      renderCatalog(searchInput ? searchInput.value.trim() : '');
      const pieceName = piece ? piece.name : 'Peça';
      showToast(`Peça "${pieceName}" agora é o destaque da vitrine!`);
    } catch (e) {
      console.warn('[JËZ Ateliê] Erro ao salvar peça em destaque:', e);
      showToast('Ocorreu um erro ao definir o destaque.');
    }
  };

  // --------------------------------------------------------------------------
  // 5. Renderização dos Pedidos no DOM
  // --------------------------------------------------------------------------
  const renderOrders = () => {
    orders = loadOrders();
    catalog = loadCatalog();
    const container = document.getElementById('orders-list-container');
    if (!container) return;
    container.innerHTML = '';

    const counts = {
      all: orders.length,
      'aguardando-pagamento': orders.filter(o => o.status === 'aguardando-pagamento').length,
      'em-producao': orders.filter(o => o.status === 'em-producao').length,
      'preparar-envio': orders.filter(o => o.status === 'preparar-envio').length,
      enviado: orders.filter(o => o.status === 'enviado').length,
      concluido: orders.filter(o => o.status === 'concluido').length
    };

    if (document.getElementById('count-all')) document.getElementById('count-all').textContent = counts.all;
    if (document.getElementById('count-yellow')) document.getElementById('count-yellow').textContent = counts['aguardando-pagamento'];
    if (document.getElementById('count-orange')) document.getElementById('count-orange').textContent = counts['em-producao'];
    if (document.getElementById('count-blue')) document.getElementById('count-blue').textContent = counts['preparar-envio'];
    if (document.getElementById('count-purple')) document.getElementById('count-purple').textContent = counts.enviado;
    if (document.getElementById('count-green')) document.getElementById('count-green').textContent = counts.concluido;

    const filtered = filterOrdersList(orders, currentOrderFilter);

    if (filtered.length === 0) {
      const emptyHtml = currentOrderFilter === 'all'
        ? `<p style="font-size: 0.95rem; font-weight: 700; color: var(--color-bg-light);">Nenhum pedido registrado ainda.</p>
           <p style="font-size: 0.82rem; margin-top: 6px; color: rgba(245, 236, 183, 0.65);">Assim que um cliente concluir o pedido na vitrine, ele aparecerá aqui em tempo real.</p>`
        : `<p style="font-size: 0.95rem; font-weight: 700; color: var(--color-bg-light);">Nenhum pedido encontrado nesta categoria.</p>`;
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: rgba(245, 236, 183, 0.75); background: var(--admin-card-bg); border-radius: var(--radius-sm); border: var(--admin-card-border);">
          ${emptyHtml}
        </div>
      `;
      return;
    }

    filtered.forEach(order => {
      const card = document.createElement('div');
      card.className = 'order-card';
      const isCustomOrder = isOrderCustomProduction(order, catalog);
      const statusMeta = getStatusMeta(order.status, order, catalog);

      const itemsHtml = (order.items || []).map(i => {
        const itemIsCustom = isItemCustomProduction(i, catalog);
        const modalityBadge = itemIsCustom
          ? `<span style="font-size: 0.65rem; padding: 1px 6px; border-radius: 3px; background: rgba(234, 88, 12, 0.2); color: #fb923c; border: 1px solid rgba(234, 88, 12, 0.35); font-weight: 600; margin-left: 6px;">Sob Encomenda</span>`
          : `<span style="font-size: 0.65rem; padding: 1px 6px; border-radius: 3px; background: rgba(37, 99, 235, 0.2); color: #60a5fa; border: 1px solid rgba(37, 99, 235, 0.35); font-weight: 600; margin-left: 6px;">Pronta Entrega</span>`;
        return `
          <div style="display: flex; justify-content: space-between; align-items: center; gap: 8px; margin-bottom: 2px;">
            <span style="display: flex; align-items: center; flex-wrap: wrap;">• ${escapeHtml(i.quantity)}x ${escapeHtml(i.name)} ${modalityBadge}</span>
            <span style="font-weight: 700;">${formatCurrency((Number(i.price) || 0) * (Number(i.quantity) || 1))}</span>
          </div>
        `;
      }).join('');

      const trackingHtml = order.trackingCode
        ? `<div style="font-size: 0.8rem; margin-top: 6px; color: var(--color-bg-light); background: rgba(254, 191, 151, 0.15); padding: 4px 8px; border-radius: 4px; display: inline-block;">
             Rastreio: <a href="https://rastreamento.correios.com.br/app/index.php?codigo=${encodeURIComponent(order.trackingCode)}" target="_blank" rel="noopener noreferrer" style="color: var(--color-accent); font-weight: 700; text-decoration: underline;">${escapeHtml(order.trackingCode)}</a>
           </div>`
        : '';

      const deliveryAddress = order.address ? `<div style="font-size: 0.78rem; margin-top: 4px; color: rgba(245, 236, 183, 0.8);">Endereço de Entrega: ${escapeHtml(order.address)}</div>` : '';
      const customerContact = order.contact ? `<div style="font-size: 0.78rem; margin-top: 2px; color: rgba(245, 236, 183, 0.8);">Contato: ${escapeHtml(order.contact)}</div>` : '';

      let actionButtons = '';
      if (order.status === 'aguardando-pagamento') {
        actionButtons = isCustomOrder ?
          `<button class="btn-status-change btn-order-action status-action-orange" data-id="${escapeHtml(order.id)}" data-newstatus="em-producao">Enviar para o Tear</button>`
          : `<button class="btn-status-change btn-order-action status-action-blue" data-id="${escapeHtml(order.id)}" data-newstatus="preparar-envio">Confirmar Pix</button>`;
      } else if (order.status === 'em-producao') {
        actionButtons = `<button class="btn-status-change btn-order-action status-action-blue" data-id="${escapeHtml(order.id)}" data-newstatus="preparar-envio">Peça Concluída</button>`;
      } else if (order.status === 'preparar-envio') {
        actionButtons = `
          <div class="tracking-input-box" style="align-items: center;">
            <input type="text" class="tracking-input" placeholder="Rastreio (opcional)" id="track-input-${escapeHtml(order.id)}" style="max-width: 170px;" />
            <button class="btn-status-change btn-order-action status-action-purple btn-confirm-postar" data-id="${escapeHtml(order.id)}">Postar e Enviar</button>
          </div>
        `;
      } else if (order.status === 'enviado') {
        actionButtons = `<button class="btn-status-change btn-order-action status-action-green" data-id="${escapeHtml(order.id)}" data-newstatus="concluido">Marcar Entregue</button>`;
      }

      card.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 8px;">
          <div>
            <strong style="font-size: 0.95rem; color: var(--color-bg-light);">${escapeHtml(order.id)}</strong>
            <span style="font-size: 0.76rem; color: rgba(245, 236, 183, 0.65); margin-left: 8px;">${formatDate(order.date)}</span>
            <div style="font-size: 0.84rem; font-weight: 600; margin-top: 4px;">Cliente: ${escapeHtml(order.customer)}</div>
            ${customerContact}
            ${deliveryAddress}
          </div>
          <span class="status-tag status-${escapeHtml(order.status)}">${statusMeta.label}</span>
        </div>
        <div style="font-size: 0.82rem; margin: 8px 0; border-top: 1px dashed rgba(254, 191, 151, 0.2); border-bottom: 1px dashed rgba(254, 191, 151, 0.2); padding: 8px 0;">
          ${itemsHtml}
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px;">
          <div>
            <span style="font-size: 0.78rem; color: rgba(245, 236, 183, 0.75);">Total:</span>
            <strong style="font-size: 1rem; color: var(--color-accent); margin-left: 4px;">${formatCurrency(order.total)}</strong>
            ${trackingHtml}
          </div>
          <div>${actionButtons}</div>
        </div>
      `;
      container.appendChild(card);
    });

    // Conecta botões de ação de status direto
    container.querySelectorAll('.btn-order-action:not(.btn-confirm-postar)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const newStatus = e.currentTarget.getAttribute('data-newstatus');
        if (id && newStatus) {
          updateOrderStatus(id, newStatus);
        }
      });
    });

    // Conecta botões de postagem com código de rastreamento
    container.querySelectorAll('.btn-confirm-postar').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        const input = document.getElementById(`track-input-${id}`);
        const rawCode = input ? input.value : '';
        const trackingCode = sanitizeTrackingCode(rawCode);
        updateOrderStatus(id, 'enviado', trackingCode || null);
      });
    });

    // Suporte a submissão via Enter no input de rastreamento
    container.querySelectorAll('.tracking-input').forEach(input => {
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
          const id = e.currentTarget.id.replace('track-input-', '');
          const trackingCode = sanitizeTrackingCode(e.currentTarget.value);
          updateOrderStatus(id, 'enviado', trackingCode || null);
        }
      });
    });
  };

  const updateOrderStatus = (orderId, newStatus, trackingCode = null) => {
    const sanitizedCode = trackingCode ? sanitizeTrackingCode(trackingCode) : null;
    const currentOrders = loadOrders();
    const result = updateOrderInList(currentOrders, orderId, newStatus, sanitizedCode);

    if (!result.success) {
      console.warn(`[JËZ Ateliê] Falha ao atualizar pedido ${orderId}: ${result.reason}`);
      return result;
    }

    orders = result.orders;
    saveOrders(orders, () => {
      updateDashboard();
      renderOrders();
      showToast(`Pedido ${orderId} atualizado para ${newStatus}!`);
    });

    // Sincroniza pedido em nuvem com o Cloud Firestore
    if (typeof window !== 'undefined' && window.jezFirebase && typeof window.jezFirebase.updateOrder === 'function') {
      const payload = { status: newStatus };
      if (sanitizedCode) payload.trackingCode = sanitizedCode;
      window.jezFirebase.updateOrder(orderId, payload).catch(err => {
        console.warn('[JËZ Cloud] Erro ao sincronizar status do pedido:', err.message);
      });
    }

    return { success: true, orderId, newStatus, trackingCode: sanitizedCode };
  };

  // Conecta botões de filtro de status de pedidos
  document.querySelectorAll('.order-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      try {
        document.querySelectorAll('.order-filter-btn').forEach(b => b.classList.remove('active'));
        const target = e.currentTarget;
        target.classList.add('active');
        currentOrderFilter = target.getAttribute('data-status') || 'all';
        renderOrders();
      } catch (err) {
        console.error('[JËZ Ateliê] Erro ao filtrar pedidos:', err);
      }
    });
  });

  // --------------------------------------------------------------------------
  // 6. Modal de Rastreamento dos Correios
  // --------------------------------------------------------------------------
  const trackingModalBackdrop = document.getElementById('modal-tracking-backdrop');
  const trackingOrderIdDisplay = document.getElementById('tracking-order-id-display');
  const trackingCodeInput = document.getElementById('tracking-code-input');
  const btnConfirmTracking = document.getElementById('btn-confirm-tracking');
  const btnCancelTracking = document.getElementById('btn-cancel-tracking');
  let pendingTrackingOrderId = null;

  const openTrackingModal = (orderId) => {
    pendingTrackingOrderId = orderId;
    if (trackingOrderIdDisplay) trackingOrderIdDisplay.textContent = orderId;
    if (trackingCodeInput) {
      trackingCodeInput.value = '';
      trackingCodeInput.focus();
    }
    if (trackingModalBackdrop) trackingModalBackdrop.style.display = 'flex';
  };

  const closeTrackingModal = () => {
    pendingTrackingOrderId = null;
    if (trackingModalBackdrop) trackingModalBackdrop.style.display = 'none';
  };

  if (btnCancelTracking) btnCancelTracking.addEventListener('click', closeTrackingModal);
  if (btnConfirmTracking) {
    btnConfirmTracking.addEventListener('click', () => {
      if (!pendingTrackingOrderId) return;
      const code = sanitizeTrackingCode(trackingCodeInput.value);
      updateOrderStatus(pendingTrackingOrderId, 'enviado', code);
      closeTrackingModal();
    });
  }

  // --------------------------------------------------------------------------
  // 7. Modal de Reset Seguro de Pedidos (JEZ-023)
  // --------------------------------------------------------------------------
  const btnResetOrders = document.getElementById('btn-reset-orders');
  const resetOrdersModal = document.getElementById('modal-reset-orders-backdrop');
  const btnCancelReset = document.getElementById('btn-cancel-reset-orders');
  const btnConfirmReset = document.getElementById('btn-confirm-reset-orders');

  if (btnResetOrders) {
    btnResetOrders.addEventListener('click', () => {
      if (resetOrdersModal) resetOrdersModal.style.display = 'flex';
    });
  }

  if (btnCancelReset) {
    btnCancelReset.addEventListener('click', () => {
      if (resetOrdersModal) resetOrdersModal.style.display = 'none';
    });
  }

  if (btnConfirmReset) {
    btnConfirmReset.addEventListener('click', async () => {
      saveOrders([], () => {
        updateDashboard();
        renderOrders();
        showToast('Histórico de pedidos resetado com sucesso.');
      });
      if (typeof window !== 'undefined' && window.jezFirebase && typeof window.jezFirebase.clearOrders === 'function') {
        try {
          await window.jezFirebase.clearOrders();
        } catch (e) {
          console.warn('[JËZ Cloud] Erro ao limpar pedidos no Firestore:', e.message);
        }
      }
      if (resetOrdersModal) resetOrdersModal.style.display = 'none';
    });
  }

  // --------------------------------------------------------------------------
  // 8. Gestão e Renderização do Acervo no DOM
  // --------------------------------------------------------------------------
  const renderCatalog = (query = '') => {
    catalog = loadCatalog();
    const grid = document.getElementById('admin-catalog-grid');
    if (!grid) return;
    grid.innerHTML = '';

    // Contadores por status
    const countAll = catalog.length;
    const countReady = catalog.filter(p => p.status === 'ready' || (p.status !== 'order' && p.status !== 'suspended' && p.isReady)).length;
    const countOrder = catalog.filter(p => p.status === 'order' || (p.status !== 'ready' && p.status !== 'suspended' && !p.isReady)).length;
    const countSuspended = catalog.filter(p => p.status === 'suspended').length;

    const countAllEl = document.getElementById('cat-count-all');
    if (countAllEl) countAllEl.textContent = countAll;
    const countReadyEl = document.getElementById('cat-count-ready');
    if (countReadyEl) countReadyEl.textContent = countReady;
    const countOrderEl = document.getElementById('cat-count-order');
    if (countOrderEl) countOrderEl.textContent = countOrder;
    const countSuspendedEl = document.getElementById('cat-count-suspended');
    if (countSuspendedEl) countSuspendedEl.textContent = countSuspended;
    const totalCountEl = document.getElementById('total-pieces-count');
    if (totalCountEl) totalCountEl.textContent = `${countAll} peça(s) no total`;

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
      filtered = filtered.filter(p => (p.name || '').toLowerCase().includes(query.toLowerCase()));
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
        featuredHtml = `<button class="btn-action-featured" data-action="feature" data-id="${escapeHtml(piece.id)}" title="Destacar esta peça na vitrine da loja">Destacar na Vitrine</button>`;
      }

      if (isSuspended) {
        statusBadgeHtml = `<span class="btn-status-badge suspended" title="Oculta da loja online">Suspensa (Oculta)</span>`;
        toggleActionHtml = `<button class="btn-action-edit" data-action="reactivate" data-id="${escapeHtml(piece.id)}">Reativar na Loja</button>`;
      } else if (piece.status === 'order' || (!piece.isReady && piece.status !== 'ready')) {
        statusBadgeHtml = `<span class="btn-status-badge order" title="Produzida sob encomenda">Sob Encomenda</span>`;
        toggleActionHtml = `<button class="btn-action-edit" data-action="suspend" data-id="${escapeHtml(piece.id)}">Suspender</button>`;
      } else {
        const currentStock = (piece.stockQty !== undefined && piece.stockQty !== null) ? Number(piece.stockQty) : 1;
        if (currentStock <= 0) {
          statusBadgeHtml = `<span class="btn-status-badge soldout" title="Estoque esgotado na loja">Esgotada (0 un.)</span>`;
        } else {
          statusBadgeHtml = `<span class="btn-status-badge ready" title="Pronta para postagem">Pronta Entrega (${currentStock} un.)</span>`;
        }
        toggleActionHtml = `<button class="btn-action-edit" data-action="suspend" data-id="${escapeHtml(piece.id)}">Suspender</button>`;
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

  // Alterna status rápido da peça
  const setPieceStatus = (id, newStatus) => {
    if (!id || typeof id !== 'string') {
      console.warn('[JËZ Ateliê] ID inválido fornecido para setPieceStatus.');
      return;
    }
    const validStatuses = ['ready', 'order', 'suspended'];
    if (!validStatuses.includes(newStatus)) {
      console.warn('[JËZ Ateliê] Status desconhecido fornecido para setPieceStatus:', newStatus);
      return;
    }

    try {
      const currentList = loadCatalog();
      const existing = currentList.find(p => p.id === id);
      if (!existing) {
        showToast('Peça não encontrada no catálogo local.');
        return;
      }

      catalog = currentList.map(p => {
        if (p.id === id) {
          return {
            ...p,
            status: newStatus,
            isReady: newStatus === 'ready'
          };
        }
        return p;
      });

      saveCatalog(catalog, id, () => {
        const searchInput = document.getElementById('catalog-search-input');
        renderCatalog(searchInput ? searchInput.value.trim() : '');
        updateDashboard();
      });

      const statusLabels = {
        ready: 'Pronta Entrega',
        order: 'Sob Encomenda',
        suspended: 'Suspensa (Oculta da loja)'
      };
      showToast(`Status alterado para ${statusLabels[newStatus] || newStatus}!`);
    } catch (err) {
      console.error('[JËZ Ateliê] Erro ao alternar status da peça:', err);
      showToast('Ocorreu um erro ao atualizar o status.');
    }
  };

  // Exclusão de Peça
  const deletePiece = (id) => {
    if (!id || typeof id !== 'string') {
      console.warn('[JËZ Ateliê] ID inválido fornecido para deletePiece.');
      return;
    }

    try {
      const currentList = loadCatalog();
      const piece = currentList.find(p => p.id === id);
      if (!piece) {
        showToast('Peça não encontrada para exclusão.');
        return;
      }

      const name = piece.name || 'esta peça';
      if (!confirm(`Deseja realmente excluir "${name}" do acervo?\nEssa ação removerá a peça da vitrine.`)) return;

      catalog = currentList.filter(p => p.id !== id);
      saveCatalog(catalog, null, () => {
        const searchInput = document.getElementById('catalog-search-input');
        renderCatalog(searchInput ? searchInput.value.trim() : '');
        updateDashboard();
        showToast('Peça removida do acervo.');
      });

      if (window.jezFirebase && typeof window.jezFirebase.deleteProduct === 'function') {
        window.jezFirebase.deleteProduct(id).catch(err => console.warn('[JËZ Cloud] Erro na exclusão em nuvem:', err));
      }

      if (localStorage.getItem('jez_featured_product_id') === id) {
        localStorage.setItem('jez_featured_product_id', 'tote-cherry');
      }
    } catch (err) {
      console.error('[JËZ Ateliê] Erro ao excluir peça:', err);
      showToast('Ocorreu um erro ao excluir a peça.');
    }
  };

  // Filtros de status do acervo
  document.querySelectorAll('.catalog-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.catalog-filter-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentCatalogFilter = e.currentTarget.getAttribute('data-filter') || 'all';
      const searchInput = document.getElementById('catalog-search-input');
      renderCatalog(searchInput ? searchInput.value.trim() : '');
    });
  });

  const catalogSearchInput = document.getElementById('catalog-search-input');
  if (catalogSearchInput) {
    catalogSearchInput.addEventListener('input', (e) => {
      renderCatalog(e.target.value.trim());
    });
  }

  // --------------------------------------------------------------------------
  // 9. Cadastro de Nova Peça
  // --------------------------------------------------------------------------
  const photoInput = document.getElementById('product-photo-input');
  const uploadPrompt = document.getElementById('upload-prompt');
  const cropWorkspace = document.getElementById('crop-workspace');
  const btnChangeCropPhoto = document.getElementById('btn-change-crop-photo');
  const btnAddNewExtraPhoto = document.getElementById('btn-add-new-extra-photo');
  const newExtraPhotosInput = document.getElementById('new-extra-photos-input');
  const newExtraPhotosGrid = document.getElementById('new-extra-photos-grid');

  if (photoInput) {
    photoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        if (uploadPrompt) uploadPrompt.style.display = 'none';
        if (cropWorkspace) cropWorkspace.style.display = 'flex';
        await newPieceCropper.loadImage(event.target.result);
        showToast('Foto carregada! Ajuste o enquadramento se desejar.');
      };
      reader.readAsDataURL(file);
    });
  }

  if (btnChangeCropPhoto && photoInput) {
    btnChangeCropPhoto.addEventListener('click', () => {
      photoInput.click();
    });
  }

  if (btnAddNewExtraPhoto && newExtraPhotosInput) {
    btnAddNewExtraPhoto.addEventListener('click', () => {
      if (newPieceExtraPhotos.length >= 4) {
        showToast('Limite de 4 fotos extras atingido.');
        return;
      }
      newExtraPhotosInput.click();
    });
  }

  if (newExtraPhotosInput) {
    newExtraPhotosInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      if (files.length === 0) return;

      const availableSlots = 4 - newPieceExtraPhotos.length;
      const filesToProcess = files.slice(0, availableSlots);

      for (const file of filesToProcess) {
        const compressed = await compressImageFile(file, 540, 0.68);
        if (compressed) newPieceExtraPhotos.push(compressed);
      }
      renderNewExtraPhotos();
      newExtraPhotosInput.value = '';
    });
  }

  const renderNewExtraPhotos = () => {
    if (!newExtraPhotosGrid) return;
    newExtraPhotosGrid.innerHTML = '';
    newPieceExtraPhotos.forEach((src, idx) => {
      const item = document.createElement('div');
      item.className = 'extra-photo-thumb';
      item.innerHTML = `
        <img src="${sanitizeImageUrl(src)}" alt="Foto extra ${idx + 1}" />
        <button type="button" class="btn-remove-thumb" data-idx="${idx}">&times;</button>
      `;
      newExtraPhotosGrid.appendChild(item);
    });
    newExtraPhotosGrid.querySelectorAll('.btn-remove-thumb').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        newPieceExtraPhotos.splice(idx, 1);
        renderNewExtraPhotos();
      });
    });
  };

  // Alternância Pronta Entrega vs Sob Encomenda
  const modalityOptions = document.querySelectorAll('.modality-option');
  const leadTimeField = document.getElementById('order-leadtime-field');
  const readyStockField = document.getElementById('ready-stock-field');

  modalityOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      modalityOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) radio.checked = true;

      if (radio && radio.value === 'order') {
        if (leadTimeField) leadTimeField.style.display = 'block';
        if (readyStockField) readyStockField.style.display = 'none';
      } else {
        if (leadTimeField) leadTimeField.style.display = 'none';
        if (readyStockField) readyStockField.style.display = 'block';
      }
    });
  });

  // Submissão do Formulário de Nova Peça
  const formNewProduct = document.getElementById('form-new-product');
  if (formNewProduct) {
    formNewProduct.addEventListener('submit', (e) => {
      e.preventDefault();

      if (!newPieceCropper.hasImage()) {
        showToast('Por favor, selecione uma foto de capa para a peça.');
        return;
      }

      const btnSavePiece = document.getElementById('btn-save-piece');
      const btnSpan = btnSavePiece ? btnSavePiece.querySelector('span') : null;
      const originalText = btnSpan ? btnSpan.textContent : 'Salvar e Publicar na Loja';

      if (btnSavePiece) {
        btnSavePiece.disabled = true;
        if (btnSpan) btnSpan.textContent = 'Salvando e Publicando...';
      }

      try {
        const rawName = document.getElementById('product-name-input').value;
        const name = sanitizeText(rawName, 120);
        const category = document.getElementById('product-category-input').value;
        const rawPrice = parseFloat(document.getElementById('product-price-input').value);
        const price = Math.max(0.01, isNaN(rawPrice) ? 1.0 : rawPrice);
        const modalityRadio = document.querySelector('input[name="product-modality"]:checked');
        const modality = modalityRadio ? modalityRadio.value : 'ready';
        const rawStock = parseInt(document.getElementById('product-stock-input')?.value, 10);
        const stockQty = modality === 'ready' ? Math.max(0, isNaN(rawStock) ? 1 : rawStock) : 0;
        const rawLeadTime = parseInt(document.getElementById('product-leadtime-input')?.value, 10);
        const leadTimeDays = modality === 'order' ? Math.max(1, Math.min(90, isNaN(rawLeadTime) ? 7 : rawLeadTime)) : 0;
        const dimensions = sanitizeText(document.getElementById('product-dimensions-input').value, 150) || 'Medidas artesanais sob encomenda';
        const materials = sanitizeText(document.getElementById('product-materials-input').value, 200) || 'Fio 100% algodão premium artesanal';
        const description = sanitizeText(document.getElementById('product-desc-input').value, 800) || 'Peça autoral tecida com amor e acabamento único pela Jéssica Regina.';

        const photoToUse = newPieceCropper.getCroppedDataUrl(540);
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
          status: modality,
          isReady: modality === 'ready',
          stockQty: stockQty,
          leadTimeDays: leadTimeDays,
          dimensions,
          materials,
          description
        };

        catalog = [newPiece, ...loadCatalog()];
        saveCatalog(catalog, newPiece.id, () => {
          formNewProduct.reset();
          if (photoInput) photoInput.value = '';
          newPieceExtraPhotos = [];
          renderNewExtraPhotos();
          if (cropWorkspace) cropWorkspace.style.display = 'none';
          if (uploadPrompt) uploadPrompt.style.display = 'flex';
          if (modalityOptions[0]) modalityOptions[0].click();

          renderCatalog();
          updateDashboard();
          showToast(`Peça "${name}" cadastrada com sucesso!`);

          setTimeout(() => {
            switchTab('catalog');
          }, 500);
        });
      } catch (err) {
        console.error('[JËZ Ateliê] Erro ao cadastrar nova peça:', err);
        showToast('Ocorreu um erro ao salvar a peça. Tente novamente.');
      } finally {
        if (btnSavePiece) {
          btnSavePiece.disabled = false;
          if (btnSpan) btnSpan.textContent = originalText;
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. Modal de Edição de Peça Existente (Galeria Multi-Fotos - JEZ-019)
  // --------------------------------------------------------------------------
  const modalEditBackdrop = document.getElementById('modal-edit-backdrop');
  const btnCloseEditModal = document.getElementById('btn-close-edit-modal');
  const btnCancelEdit = document.getElementById('btn-cancel-edit');
  const formEditProduct = document.getElementById('form-edit-product');
  const editPhotoInput = document.getElementById('edit-photo-input');
  const editLeadtimeWrap = document.getElementById('edit-leadtime-wrap');
  const btnAddEditExtraPhoto = document.getElementById('btn-add-edit-extra-photo');
  const editExtraPhotosInput = document.getElementById('edit-extra-photos-input');
  const editExtraPhotosGrid = document.getElementById('edit-extra-photos-grid');

  let currentEditingPiece = null;
  let editCarouselItems = [];
  let activeCarouselIdx = 0;

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
      const cropped = editPieceCropper.getCroppedDataUrl(540);
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
          <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
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

    // Mantém editPieceExtraPhotos sincronizado
    editPieceExtraPhotos = editCarouselItems.slice(1).map(i => i.url);
  };

  const openEditModal = async (pieceId) => {
    catalog = loadCatalog();
    const piece = catalog.find(p => p.id === pieceId);
    if (!piece) return;

    currentEditingPiece = piece;

    const idInput = document.getElementById('edit-piece-id');
    if (idInput) idInput.value = piece.id;
    const nameInput = document.getElementById('edit-product-name');
    if (nameInput) nameInput.value = piece.name || '';
    const catInput = document.getElementById('edit-product-category');
    if (catInput) catInput.value = piece.category || 'bolsas';
    const priceInput = document.getElementById('edit-product-price');
    if (priceInput) priceInput.value = piece.price || 0;
    const dimInput = document.getElementById('edit-product-dimensions');
    if (dimInput) dimInput.value = piece.dimensions || '';
    const matInput = document.getElementById('edit-product-materials');
    if (matInput) matInput.value = piece.materials || '';
    const descInput = document.getElementById('edit-product-desc');
    if (descInput) descInput.value = piece.description || '';

    // Status: ready, order, suspended
    const status = piece.status || (piece.isReady ? 'ready' : 'order');
    const radio = document.querySelector(`input[name="edit-status"][value="${status}"]`);
    if (radio) radio.checked = true;

    document.querySelectorAll('.status-radio-option').forEach(opt => {
      const r = opt.querySelector('input[type="radio"]');
      opt.classList.toggle('active', r && r.value === status);
    });

    const editStockWrap = document.getElementById('edit-stock-wrap');
    const editStockInput = document.getElementById('edit-product-stock');
    if (editStockInput) {
      editStockInput.value = (piece.stockQty !== undefined && piece.stockQty !== null) ? piece.stockQty : (piece.isReady ? 1 : 0);
    }

    if (status === 'order') {
      if (editLeadtimeWrap) editLeadtimeWrap.style.display = 'block';
      if (editStockWrap) editStockWrap.style.display = 'none';
      const leadtimeInput = document.getElementById('edit-product-leadtime');
      if (leadtimeInput) leadtimeInput.value = piece.leadTimeDays || 7;
    } else if (status === 'ready') {
      if (editLeadtimeWrap) editLeadtimeWrap.style.display = 'none';
      if (editStockWrap) editStockWrap.style.display = 'block';
    } else {
      if (editLeadtimeWrap) editLeadtimeWrap.style.display = 'none';
      if (editStockWrap) editStockWrap.style.display = 'none';
    }

    if (modalEditBackdrop) modalEditBackdrop.style.display = 'flex';

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

  const openEditPieceModal = openEditModal;

  const closeEditModal = () => {
    if (modalEditBackdrop) modalEditBackdrop.style.display = 'none';
    currentEditingPiece = null;
    editCarouselItems = [];
    activeCarouselIdx = 0;
    if (formEditProduct) {
      try {
        formEditProduct.reset();
      } catch (e) {
        // Ignora caso elementos já estejam desconectados
      }
    }
  };

  const closeEditPieceModal = closeEditModal;

  if (btnCloseEditModal) btnCloseEditModal.addEventListener('click', closeEditModal);
  if (btnCancelEdit) btnCancelEdit.addEventListener('click', closeEditModal);
  if (modalEditBackdrop) {
    modalEditBackdrop.addEventListener('click', (e) => {
      if (e.target === modalEditBackdrop) closeEditModal();
    });
  }

  // Alternar status no modal
  document.querySelectorAll('.status-radio-option').forEach(opt => {
    opt.addEventListener('click', () => {
      document.querySelectorAll('.status-radio-option').forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const radio = opt.querySelector('input[type="radio"]');
      if (radio) {
        radio.checked = true;
        const editStockWrap = document.getElementById('edit-stock-wrap');
        if (radio.value === 'order') {
          if (editLeadtimeWrap) editLeadtimeWrap.style.display = 'block';
          if (editStockWrap) editStockWrap.style.display = 'none';
        } else if (radio.value === 'ready') {
          if (editLeadtimeWrap) editLeadtimeWrap.style.display = 'none';
          if (editStockWrap) editStockWrap.style.display = 'block';
        } else {
          if (editLeadtimeWrap) editLeadtimeWrap.style.display = 'none';
          if (editStockWrap) editStockWrap.style.display = 'none';
        }
      }
    });
  });

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

      if (btnAddEditExtraPhoto) {
        btnAddEditExtraPhoto.disabled = true;
        btnAddEditExtraPhoto.style.opacity = '0.6';
      }

      try {
        let firstNewIdx = -1;
        for (const file of filesToProcess) {
          const compressed = await compressImageFile(file, 540, 0.68);
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
          showToast('Foto adicionada ao carrossel! Ajuste o enquadramento 1:1 acima.');
        }
      } catch (err) {
        console.error('[JËZ Ateliê] Falha ao processar fotos extras:', err);
        showToast('Não foi possível processar algumas imagens selecionadas.');
      } finally {
        if (btnAddEditExtraPhoto && editCarouselItems.length < 5) {
          btnAddEditExtraPhoto.disabled = false;
          btnAddEditExtraPhoto.style.opacity = '1';
        }
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

  const btnEditChangePhoto = document.getElementById('btn-edit-change-photo');
  if (btnEditChangePhoto && editPhotoInput) {
    btnEditChangePhoto.addEventListener('click', () => {
      editPhotoInput.click();
    });
  }

  if (editPhotoInput) {
    editPhotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = async (event) => {
        try {
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
        } catch (err) {
          console.error('[JËZ Ateliê] Erro ao carregar foto no cropper:', err);
          showToast('Erro ao atualizar foto selecionada.');
        }
      };
      reader.onerror = () => {
        console.error('[JËZ Ateliê] Falha na leitura do arquivo de imagem');
        showToast('Erro ao ler o arquivo de imagem.');
      };
      reader.readAsDataURL(file);
      editPhotoInput.value = '';
    });
  }

  if (formEditProduct) {
    formEditProduct.addEventListener('submit', (e) => {
      e.preventDefault();

      const btnSaveEdit = document.getElementById('btn-save-edit');
      const originalText = btnSaveEdit ? btnSaveEdit.textContent : 'Salvar Alterações';
      if (btnSaveEdit) {
        btnSaveEdit.disabled = true;
        btnSaveEdit.textContent = 'Salvando Alterações...';
      }

      try {
        const id = document.getElementById('edit-piece-id')?.value?.trim();
        if (!id) {
          showToast('Identificador de peça inválido.');
          return;
        }

        const rawName = document.getElementById('edit-product-name')?.value || '';
        const name = sanitizeText(rawName, 120);
        if (!name) {
          showToast('Informe o nome da peça antes de salvar.');
          return;
        }

        const currentCatalog = loadCatalog();
        const existingPiece = currentCatalog.find(p => p.id === id);
        if (!existingPiece) {
          showToast('Peça não encontrada para edição.');
          return;
        }

        const category = document.getElementById('edit-product-category')?.value || 'bolsas';
        const rawPrice = parseFloat(document.getElementById('edit-product-price')?.value);
        const price = Math.max(0.01, isNaN(rawPrice) ? 1.0 : rawPrice);
        const statusRadio = document.querySelector('input[name="edit-status"]:checked');
        const status = statusRadio ? statusRadio.value : 'ready';
        const rawLeadTime = parseInt(document.getElementById('edit-product-leadtime')?.value, 10);
        const leadTimeDays = status === 'order' ? Math.max(1, Math.min(90, isNaN(rawLeadTime) ? 7 : rawLeadTime)) : 0;
        const rawStock = parseInt(document.getElementById('edit-product-stock')?.value, 10);
        const stockQty = status === 'ready' ? Math.max(0, isNaN(rawStock) ? 1 : rawStock) : 0;
        const dimensions = sanitizeText(document.getElementById('edit-product-dimensions')?.value || '', 150);
        const materials = sanitizeText(document.getElementById('edit-product-materials')?.value || '', 200);
        const description = sanitizeText(document.getElementById('edit-product-desc')?.value || '', 800);

        saveActivePhotoCropState();

        const categoryLabels = {
          bolsas: 'Bolsas & Bags',
          vestuario: 'Vestuário Autoral',
          acessorios: 'Acessórios'
        };

        const finalImages = editCarouselItems.map(item => sanitizeImageUrl(item.url));
        const coverImage = finalImages[0] || (currentEditingPiece ? currentEditingPiece.image : existingPiece.image || 'assets/products/tote_cherry.jpg');
        const updatedImages = finalImages.length > 0 ? [...finalImages] : [coverImage];

        catalog = currentCatalog.map(p => {
          if (p.id === id) {
            return {
              ...p,
              name,
              category,
              categoryLabel: categoryLabels[category] || p.categoryLabel,
              price,
              status,
              isReady: status === 'ready',
              stockQty,
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

        saveCatalog(catalog, id, () => {
          closeEditModal();
          const searchInput = document.getElementById('catalog-search-input');
          renderCatalog(searchInput ? searchInput.value.trim() : '');
          updateDashboard();
          showToast(`Peça "${name}" atualizada com sucesso!`);
        });
      } catch (err) {
        console.error('[JËZ Ateliê] Erro ao salvar edição da peça:', err);
        showToast('Ocorreu um erro ao atualizar a peça. Tente novamente.');
      } finally {
        if (btnSaveEdit) {
          btnSaveEdit.disabled = false;
          btnSaveEdit.textContent = originalText;
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 11. Autenticação & Telas de Acesso (Morgan)
  // --------------------------------------------------------------------------
  const adminLoginScreen = document.getElementById('admin-login-screen');
  const adminWorkspace = document.getElementById('admin-workspace');
  const btnAdminLogout = document.getElementById('btn-admin-logout');
  const formAdminLogin = document.getElementById('form-admin-login');
  const adminPasswordInput = document.getElementById('admin-password');
  const btnLoginSubmit = document.getElementById('btn-login-submit');
  const loginErrorBox = document.getElementById('login-error-box');
  const btnTogglePassword = document.getElementById('btn-toggle-password');

  if (btnTogglePassword && adminPasswordInput) {
    btnTogglePassword.addEventListener('click', () => {
      const isPassword = adminPasswordInput.type === 'password';
      adminPasswordInput.type = isPassword ? 'text' : 'password';
      btnTogglePassword.setAttribute('aria-label', isPassword ? 'Ocultar chave de acesso' : 'Exibir chave de acesso');
    });
  }

  const startCountdown = (lockedUntil) => {
    if (lockoutTimerInterval) clearInterval(lockoutTimerInterval);
    const updateCountdown = () => {
      const remainingMs = lockedUntil - Date.now();
      if (remainingMs <= 0) {
        clearInterval(lockoutTimerInterval);
        lockoutTimerInterval = null;
        resetLoginAttempts();
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
    };
    updateCountdown();
    lockoutTimerInterval = setInterval(updateCountdown, 1000);
  };

  const showLoginScreen = (errorMessage = null) => {
    if (adminLoginScreen) adminLoginScreen.style.display = 'flex';
    if (adminWorkspace) adminWorkspace.style.display = 'none';
    if (btnAdminLogout) btnAdminLogout.style.display = 'none';

    const lockoutState = getLockoutState();
    if (lockoutState.lockedUntil && Date.now() < lockoutState.lockedUntil) {
      startCountdown(lockoutState.lockedUntil);
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
  };

  const showWorkspace = () => {
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
  };

  if (formAdminLogin) {
    formAdminLogin.addEventListener('submit', async (e) => {
      e.preventDefault();
      const lockoutState = getLockoutState();
      if (lockoutState.lockedUntil && Date.now() < lockoutState.lockedUntil) {
        startCountdown(lockoutState.lockedUntil);
        return;
      }

      const inputVal = (adminPasswordInput.value || '').trim();
      const hashed = await sha256Hex(inputVal);

      if (hashed === HASH_MASTER_PASSWORD) {
        resetLoginAttempts();
        createSession();
        showWorkspace();
        showToast('Bem-vinda de volta ao Ateliê, Jéssica!');
      } else {
        const result = recordFailedAttempt();
        if (result.lockedUntil) {
          startCountdown(result.lockedUntil);
        } else {
          const remaining = MAX_FAILED_ATTEMPTS - result.attempts;
          showLoginScreen(`Chave de acesso incorreta. ${remaining} tentativa(s) restante(s) antes do bloqueio temporário.`);
        }
      }
    });
  }

  if (btnAdminLogout) {
    btnAdminLogout.addEventListener('click', () => {
      destroySession();
      showLoginScreen('Sessão encerrada com segurança.');
    });
  }

  // --------------------------------------------------------------------------
  // 12. Navegação em Abas Mobile-First
  // --------------------------------------------------------------------------
  const tabs = document.querySelectorAll('.nav-tab');
  const sections = document.querySelectorAll('.admin-section');
  const switchTab = (tabId) => {
    if (!tabId || typeof tabId !== 'string') return;
    tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabId));
    sections.forEach(s => s.classList.toggle('active', s.id === `section-${tabId}`));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    try {
      if (tabId === 'dashboard') updateDashboard();
      if (tabId === 'orders') renderOrders();
      if (tabId === 'catalog') renderCatalog();
    } catch (e) {
      console.warn('[JËZ Ateliê] Erro ao alternar para aba:', tabId, e);
    }
  };
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.getAttribute('data-tab');
      if (targetTab) switchTab(targetTab);
    });
  });

  // Botões de Ação Rápida do Dashboard e Atualização
  const btnQuickNewPiece = document.getElementById('btn-quick-new-piece');
  if (btnQuickNewPiece) {
    btnQuickNewPiece.addEventListener('click', () => switchTab('new-product'));
  }

  const btnQuickViewOrders = document.getElementById('btn-quick-view-orders');
  if (btnQuickViewOrders) {
    btnQuickViewOrders.addEventListener('click', () => switchTab('orders'));
  }

  const btnSeeAllOrders = document.getElementById('btn-see-all-orders');
  if (btnSeeAllOrders) {
    btnSeeAllOrders.addEventListener('click', () => switchTab('orders'));
  }

  const btnRefreshData = document.getElementById('btn-refresh-data');
  if (btnRefreshData) {
    btnRefreshData.addEventListener('click', () => {
      try {
        orders = loadOrders();
        catalog = loadCatalog();
        updateDashboard();
        renderOrders();
        renderCatalog();
        showToast('Dados do ateliê atualizados!');
      } catch (err) {
        console.error('[JËZ Ateliê] Erro ao sincronizar dados locais:', err);
        showToast('Erro ao atualizar os dados.');
      }
    });
  }

  // --------------------------------------------------------------------------
  // 13. Registro do PWA e Notificações (Noa & Alex)
  // --------------------------------------------------------------------------
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(err => {
        console.warn('[JËZ PWA] Falha no registro do Service Worker:', err);
      });
    });
  }

  let deferredInstallPrompt = null;
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    const btnInstall = document.getElementById('btn-pwa-install-admin') || document.getElementById('btn-install-atelie-pwa');
    if (btnInstall) {
      btnInstall.style.display = 'inline-flex';
      btnInstall.addEventListener('click', () => {
        if (deferredInstallPrompt) {
          deferredInstallPrompt.prompt();
          deferredInstallPrompt = null;
          btnInstall.style.display = 'none';
        }
      });
    }
  });

  // Sincronizacao de status na nuvem (Firestore)
  const updateCloudSyncStatus = (status, text) => {
    const badge = document.getElementById('cloud-sync-badge');
    if (!badge) return;
    badge.className = `cloud-sync-badge status-${status}`;
    const textEl = badge.querySelector('.sync-label') || badge.querySelector('.sync-text');
    if (textEl) textEl.textContent = text;
  };

  const initCloudSync = () => {
    const updateBadge = (online) => {
      if (online) {
        updateCloudSyncStatus('online', 'Nuvem Conectada');
      } else {
        updateCloudSyncStatus('offline', 'Modo Local');
      }
    };

    let bound = false;
    const bindSync = () => {
      if (typeof window === 'undefined' || !window.jezFirebase || bound) return false;
      bound = true;

      updateBadge(true);

      if (typeof window.jezFirebase.onConnectionChange === 'function') {
        window.jezFirebase.onConnectionChange(updateBadge);
      }

      // Ouve pedidos em tempo real da nuvem
      if (typeof window.jezFirebase.onOrdersChange === 'function') {
        window.jezFirebase.onOrdersChange((cloudOrders) => {
          if (Array.isArray(cloudOrders)) {
            orders = cloudOrders;
            localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(orders));
            renderOrders();
            updateDashboard();
          }
        });
      }

      // Ouve catálogo em tempo real da nuvem
      if (typeof window.jezFirebase.onProductsChange === 'function') {
        window.jezFirebase.onProductsChange((cloudCatalog) => {
          if (Array.isArray(cloudCatalog) && cloudCatalog.length > 0) {
            catalog = sortCatalogByCuratedOrder(cloudCatalog);
            localStorage.setItem(STORAGE_CATALOG_KEY, JSON.stringify(catalog));
            const searchInput = document.getElementById('catalog-search-input');
            renderCatalog(searchInput ? searchInput.value.trim() : '');
            updateDashboard();
            updateCloudSyncStatus('synced', 'Sincronizado');
          }
        });
      }

      // Ouve destaque da vitrine em tempo real da nuvem
      if (typeof window.jezFirebase.onFeaturedChange === 'function') {
        window.jezFirebase.onFeaturedChange((cloudFeaturedId) => {
          if (cloudFeaturedId) {
            localStorage.setItem('jez_featured_product_id', cloudFeaturedId);
            const searchInput = document.getElementById('catalog-search-input');
            renderCatalog(searchInput ? searchInput.value.trim() : '');
            updateDashboard();
          }
        });
      }

      // Semeia o acervo inicial no Firestore caso o banco esteja novo/vazio
      if (typeof window.jezFirebase.seedInitialProductsIfEmpty === 'function') {
        window.jezFirebase.seedInitialProductsIfEmpty(defaultInitialCatalog);
      }
      return true;
    };

    if (!bindSync()) {
      updateBadge(false);
      window.addEventListener('jez-cloud-status', () => {
        bindSync();
      });
    }
  };

  if (typeof window !== 'undefined') {
    initCloudSync();
  }

  // --------------------------------------------------------------------------
  // 14. Inicialização do Ateliê
  // --------------------------------------------------------------------------
  if (hasValidSession()) {
    showWorkspace();
  } else {
    showLoginScreen();
  }
};

// Inicialização automática após carregamento do DOM
if (typeof document !== 'undefined') {
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAdmin);
  } else {
    initAdmin();
  }
}
