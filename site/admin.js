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
  getStatusMeta
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
    try {
      localStorage.setItem('jez_featured_product_id', productId);
      if (typeof window !== 'undefined' && window.jezFirebase && typeof window.jezFirebase.setConfig === 'function') {
        window.jezFirebase.setConfig('featured', { productId }).catch(err => {
          console.warn('[JËZ Cloud] Erro ao sincronizar destaque:', err.message);
        });
      }
      showToast('Peça definida como destaque no Hero com sucesso!');
      renderCatalog();
    } catch (e) {
      console.warn('[JËZ Ateliê] Erro ao salvar peça em destaque:', e);
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

    const filtered = currentOrderFilter === 'all' ? orders : orders.filter(o => o.status === currentOrderFilter);

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
          `<button class="btn-order-action" data-id="${escapeHtml(order.id)}" data-newstatus="em-producao">Enviar para o Tear</button>`
          : `<button class="btn-order-action" data-id="${escapeHtml(order.id)}" data-newstatus="preparar-envio">Confirmar Pix</button>`;
      } else if (order.status === 'em-producao') {
        actionButtons = `<button class="btn-order-action" data-id="${escapeHtml(order.id)}" data-newstatus="preparar-envio">Peça Concluída</button>`;
      } else if (order.status === 'preparar-envio') {
        actionButtons = `<button class="btn-order-action btn-open-tracking" data-id="${escapeHtml(order.id)}">Postar e Enviar</button>`;
      } else if (order.status === 'enviado') {
        actionButtons = `<button class="btn-order-action" data-id="${escapeHtml(order.id)}" data-newstatus="concluido">Marcar Entregue</button>`;
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

    // Conecta botões de ação de status
    container.querySelectorAll('.btn-order-action:not(.btn-open-tracking)').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        const newStatus = e.target.getAttribute('data-newstatus');
        updateOrderStatus(id, newStatus);
      });
    });

    // Conecta botões de rastreamento
    container.querySelectorAll('.btn-open-tracking').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        openTrackingModal(id);
      });
    });
  };

  const updateOrderStatus = (orderId, newStatus, trackingCode = null) => {
    orders = loadOrders().map(o => {
      if (o.id === orderId) {
        const updated = { ...o, status: newStatus };
        if (trackingCode) updated.trackingCode = trackingCode;
        return updated;
      }
      return o;
    });

    saveOrders(orders, () => {
      updateDashboard();
      renderOrders();
      showToast(`Pedido ${orderId} atualizado para ${newStatus}!`);
    });

    // Sincroniza pedido em nuvem com o Cloud Firestore
    if (typeof window !== 'undefined' && window.jezFirebase && typeof window.jezFirebase.updateOrder === 'function') {
      const payload = { status: newStatus };
      if (trackingCode) payload.trackingCode = trackingCode;
      window.jezFirebase.updateOrder(orderId, payload).catch(err => {
        console.warn('[JËZ Cloud] Erro ao sincronizar status do pedido:', err.message);
      });
    }
  };

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
  // 8. Renderização do Catálogo no DOM
  // --------------------------------------------------------------------------
  const renderCatalog = () => {
    catalog = loadCatalog();
    const container = document.getElementById('catalog-list-container');
    if (!container) return;
    container.innerHTML = '';

    const featuredId = localStorage.getItem('jez_featured_product_id') || 'bolsa-punk';
    const countSuspended = catalog.filter(p => p.status === 'suspended').length;
    const countSuspendedEl = document.getElementById('cat-count-suspended');
    if (countSuspendedEl) countSuspendedEl.textContent = countSuspended;

    const filtered = currentCatalogFilter === 'all'
      ? catalog
      : (currentCatalogFilter === 'suspended'
          ? catalog.filter(p => p.status === 'suspended')
          : catalog.filter(p => p.category === currentCatalogFilter));

    filtered.forEach(piece => {
      const card = document.createElement('div');
      card.className = 'admin-piece-card';
      const isFeatured = piece.id === featuredId;
      const isCustom = piece.id.startsWith('custom-');
      const isSoldOut = piece.isReady && piece.stockQty === 0;
      const isSuspended = piece.status === 'suspended';

      const stockBadge = isSuspended
        ? `<span class="badge-status-suspended" style="font-size: 0.68rem; padding: 2px 6px; border-radius: 4px; background: rgba(107, 114, 128, 0.2); color: #9ca3af; border: 1px solid rgba(107, 114, 128, 0.4); font-weight: 600; margin-left: 6px;">Suspensa</span>`
        : (isSoldOut
          ? `<span class="badge-stock-soldout" style="font-size: 0.68rem; padding: 2px 6px; border-radius: 4px; background: rgba(239, 68, 68, 0.2); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.4); font-weight: 700; margin-left: 6px;">Esgotada (0 un.)</span>`
          : (piece.isReady
            ? `<span style="font-size: 0.68rem; padding: 2px 6px; border-radius: 4px; background: rgba(59, 130, 246, 0.2); color: #60a5fa; border: 1px solid rgba(59, 130, 246, 0.4); font-weight: 600; margin-left: 6px;">Pronta Entrega (${piece.stockQty || 1} un.)</span>`
            : `<span style="font-size: 0.68rem; padding: 2px 6px; border-radius: 4px; background: rgba(234, 88, 12, 0.2); color: #fb923c; border: 1px solid rgba(234, 88, 12, 0.4); font-weight: 600; margin-left: 6px;">Sob Encomenda</span>`));

      const featuredBtn = isFeatured
        ? `<span class="badge-featured" style="font-size: 0.7rem; padding: 3px 8px; border-radius: 4px; background: rgba(253, 10, 84, 0.25); color: var(--color-accent); border: 1px solid var(--color-accent); font-weight: 700;">Destaque Hero</span>`
        : `<button class="btn-set-featured" data-id="${escapeHtml(piece.id)}" style="font-size: 0.7rem; padding: 3px 8px; border-radius: 4px; background: transparent; color: rgba(245, 236, 183, 0.7); border: 1px solid rgba(254, 191, 151, 0.3); cursor: pointer;">Definir Destaque</button>`;

      card.innerHTML = `
        <div style="display: flex; gap: 12px; align-items: center;">
          <img src="${sanitizeImageUrl(piece.image)}" alt="${escapeHtml(piece.name)}" style="width: 56px; height: 56px; object-fit: cover; border-radius: 4px; border: 1px solid rgba(254, 191, 151, 0.2);" />
          <div style="flex: 1;">
            <div style="display: flex; align-items: center; flex-wrap: wrap;">
              <strong style="font-size: 0.9rem; color: var(--color-bg-light);">${escapeHtml(piece.name)}</strong>
              ${stockBadge}
            </div>
            <div style="font-size: 0.8rem; color: var(--color-accent); font-weight: 700; margin-top: 2px;">
              ${formatCurrency(piece.price)}
            </div>
          </div>
        </div>
        <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 10px; border-top: 1px dashed rgba(254, 191, 151, 0.2); padding-top: 8px;">
          <div>${featuredBtn}</div>
          <div style="display: flex; gap: 8px;">
            <button class="btn-edit-piece" data-id="${escapeHtml(piece.id)}" style="font-size: 0.75rem; padding: 4px 10px; border-radius: 4px; background: rgba(254, 191, 151, 0.15); color: var(--color-bg-light); border: 1px solid rgba(254, 191, 151, 0.3); cursor: pointer;">Editar</button>
            ${isCustom ? `<button class="btn-delete-piece" data-id="${escapeHtml(piece.id)}" style="font-size: 0.75rem; padding: 4px 10px; border-radius: 4px; background: rgba(239, 68, 68, 0.15); color: #f87171; border: 1px solid rgba(239, 68, 68, 0.3); cursor: pointer;">Excluir</button>` : ''}
          </div>
        </div>
      `;
      container.appendChild(card);
    });

    // Conecta botões de destaque
    container.querySelectorAll('.btn-set-featured').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        setFeaturedPiece(id);
      });
    });

    // Conecta botões de edição
    container.querySelectorAll('.btn-edit-piece').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        openEditPieceModal(id);
      });
    });

    // Conecta botões de exclusão
    container.querySelectorAll('.btn-delete-piece').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.target.getAttribute('data-id');
        deletePiece(id);
      });
    });
  };

  const deletePiece = (productId) => {
    if (!confirm('Deseja realmente remover esta peça do catálogo?')) return;
    catalog = loadCatalog().filter(p => p.id !== productId);
    saveCatalog(catalog, null, () => {
      renderCatalog();
      updateDashboard();
      showToast('Peça removida com sucesso.');
    });
    if (typeof window !== 'undefined' && window.jezFirebase && typeof window.jezFirebase.deleteProduct === 'function') {
      window.jezFirebase.deleteProduct(productId).catch(err => {
        console.warn('[JËZ Cloud] Erro ao deletar peça no Firestore:', err.message);
      });
    }
  };

  // --------------------------------------------------------------------------
  // 9. Cadastro de Nova Peça
  // --------------------------------------------------------------------------
  const newPieceForm = document.getElementById('form-add-piece');
  const newPiecePhotoInput = document.getElementById('new-photo-input');
  const newExtraPhotosInput = document.getElementById('new-extra-photos-input');
  const newExtraPhotosGrid = document.getElementById('new-extra-photos-grid');
  const btnSavePiece = document.getElementById('btn-save-piece');

  if (newPiecePhotoInput) {
    newPiecePhotoInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (evt) => {
          newPieceCropper.loadImage(evt.target.result);
          document.getElementById('crop-interface').style.display = 'block';
        };
        reader.readAsDataURL(file);
      }
    });
  }

  if (newExtraPhotosInput) {
    newExtraPhotosInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      for (const file of files) {
        if (newPieceExtraPhotos.length >= 4) break;
        const compressed = await compressImageFile(file, 540, 0.68);
        if (compressed) newPieceExtraPhotos.push(compressed);
      }
      renderNewExtraPhotos();
    });
  }

  const renderNewExtraPhotos = () => {
    if (!newExtraPhotosGrid) return;
    newExtraPhotosGrid.innerHTML = '';
    newPieceExtraPhotos.forEach((src, idx) => {
      const item = document.createElement('div');
      item.className = 'extra-photo-thumb';
      item.innerHTML = `
        <img src="${src}" alt="Foto extra ${idx + 1}" />
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

  if (newPieceForm) {
    newPieceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!newPieceCropper.hasImage()) {
        showToast('Por favor, selecione uma foto de capa para a peça.');
        return;
      }

      if (btnSavePiece) {
        btnSavePiece.disabled = true;
        btnSavePiece.textContent = 'Salvando e Publicando...';
      }

      try {
        const mainImage = newPieceCropper.getCroppedDataUrl(540);
        const allImages = [mainImage, ...newPieceExtraPhotos];
        const isReady = document.getElementById('product-ready-check').checked;
        const stockInput = document.getElementById('product-stock-input');
        const stockQty = isReady ? (parseInt(stockInput ? stockInput.value : '1', 10) || 0) : 0;

        const newPiece = {
          id: 'custom-' + Date.now(),
          name: sanitizeText(document.getElementById('product-name-input').value),
          category: document.getElementById('product-category-select').value,
          price: parseFloat(document.getElementById('product-price-input').value) || 0,
          image: mainImage,
          images: allImages,
          isReady,
          stockQty: stockQty,
          status: isReady ? 'ready' : 'order',
          leadTimeDays: isReady ? 0 : (parseInt(document.getElementById('product-leadtime-input').value, 10) || 7),
          dimensions: sanitizeText(document.getElementById('product-dimensions-input').value),
          materials: sanitizeText(document.getElementById('product-materials-input').value),
          description: sanitizeText(document.getElementById('product-description-input').value)
        };

        catalog = [newPiece, ...loadCatalog()];
        saveCatalog(catalog, newPiece.id, () => {
          newPieceForm.reset();
          newPieceExtraPhotos = [];
          renderNewExtraPhotos();
          document.getElementById('crop-interface').style.display = 'none';
          renderCatalog();
          updateDashboard();
          showToast('Peça cadastrada e publicada no catálogo!');
        });
      } finally {
        if (btnSavePiece) {
          btnSavePiece.disabled = false;
          btnSavePiece.textContent = 'Salvar e Publicar na Loja';
        }
      }
    });
  }

  // --------------------------------------------------------------------------
  // 10. Modal de Edição de Peça Existente
  // --------------------------------------------------------------------------
  const editModalBackdrop = document.getElementById('modal-edit-piece-backdrop');
  const editPieceForm = document.getElementById('form-edit-piece');
  const editExtraPhotosInput = document.getElementById('edit-extra-photos-input');
  const editExtraPhotosGrid = document.getElementById('edit-extra-photos-grid');
  const btnSaveEdit = document.getElementById('btn-save-edit');
  const btnCancelEdit = document.getElementById('btn-cancel-edit');
  let currentEditingPieceId = null;

  const openEditPieceModal = (productId) => {
    const piece = loadCatalog().find(p => p.id === productId);
    if (!piece) return;
    currentEditingPieceId = productId;

    document.getElementById('edit-product-id').value = piece.id;
    document.getElementById('edit-product-name').value = piece.name;
    document.getElementById('edit-product-price').value = piece.price;
    document.getElementById('edit-product-category').value = piece.category;
    document.getElementById('edit-product-ready').checked = Boolean(piece.isReady);
    const editStockInput = document.getElementById('edit-product-stock');
    if (editStockInput) editStockInput.value = piece.stockQty !== undefined ? piece.stockQty : 1;
    document.getElementById('edit-product-leadtime').value = piece.leadTimeDays || 0;
    document.getElementById('edit-product-dimensions').value = piece.dimensions || '';
    document.getElementById('edit-product-materials').value = piece.materials || '';
    document.getElementById('edit-product-description').value = piece.description || '';

    const currentStatus = piece.status || (piece.isReady ? 'ready' : 'order');
    const statusRadio = document.querySelector(`input[name="edit-status"][value="${currentStatus}"]`);
    if (statusRadio) statusRadio.checked = true;

    editPieceExtraPhotos = Array.isArray(piece.images) && piece.images.length > 1 ? piece.images.slice(1) : [];
    renderEditExtraPhotos();
    editPieceCropper.loadImage(piece.image);
    if (editModalBackdrop) editModalBackdrop.style.display = 'flex';
  };

  const closeEditPieceModal = () => {
    currentEditingPieceId = null;
    if (editModalBackdrop) editModalBackdrop.style.display = 'none';
  };

  if (btnCancelEdit) btnCancelEdit.addEventListener('click', closeEditPieceModal);

  if (editExtraPhotosInput) {
    editExtraPhotosInput.addEventListener('change', async (e) => {
      const files = Array.from(e.target.files || []);
      for (const file of files) {
        if (editPieceExtraPhotos.length >= 4) break;
        const compressed = await compressImageFile(file, 540, 0.68);
        if (compressed) editPieceExtraPhotos.push(compressed);
      }
      renderEditExtraPhotos();
    });
  }

  const renderEditExtraPhotos = () => {
    if (!editExtraPhotosGrid) return;
    editExtraPhotosGrid.innerHTML = '';
    editPieceExtraPhotos.forEach((src, idx) => {
      const item = document.createElement('div');
      item.className = 'extra-photo-thumb';
      item.innerHTML = `
        <img src="${src}" alt="Foto extra ${idx + 1}" />
        <button type="button" class="btn-remove-thumb" data-idx="${idx}">&times;</button>
      `;
      editExtraPhotosGrid.appendChild(item);
    });
    editExtraPhotosGrid.querySelectorAll('.btn-remove-thumb').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const idx = parseInt(e.target.getAttribute('data-idx'), 10);
        editPieceExtraPhotos.splice(idx, 1);
        renderEditExtraPhotos();
      });
    });
  };

  if (editPieceForm) {
    editPieceForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!currentEditingPieceId) return;

      if (btnSaveEdit) {
        btnSaveEdit.disabled = true;
        btnSaveEdit.textContent = 'Salvando Alterações...';
      }

      try {
        const id = currentEditingPieceId;
        const mainImage = editPieceCropper.getCroppedDataUrl(540);
        const updatedImages = [mainImage, ...editPieceExtraPhotos];
        const isReady = document.getElementById('edit-product-ready').checked;
        const editStockInput = document.getElementById('edit-product-stock');
        const stockQty = isReady ? (parseInt(editStockInput ? editStockInput.value : '1', 10) || 0) : 0;
        const selectedStatusRadio = document.querySelector('input[name="edit-status"]:checked');
        const pieceStatus = selectedStatusRadio ? selectedStatusRadio.value : (isReady ? 'ready' : 'order');

        catalog = loadCatalog().map(p => {
          if (p.id === id) {
            return {
              ...p,
              name: sanitizeText(document.getElementById('edit-product-name').value),
              category: document.getElementById('edit-product-category').value,
              price: parseFloat(document.getElementById('edit-product-price').value) || 0,
              image: mainImage,
              images: updatedImages,
              isReady,
              stockQty,
              status: pieceStatus,
              leadTimeDays: isReady ? 0 : (parseInt(document.getElementById('edit-product-leadtime').value, 10) || 7),
              dimensions: sanitizeText(document.getElementById('edit-product-dimensions').value),
              materials: sanitizeText(document.getElementById('edit-product-materials').value),
              description: sanitizeText(document.getElementById('edit-product-description').value)
            };
          }
          return p;
        });

        saveCatalog(catalog, id, () => {
          closeEditPieceModal();
          renderCatalog();
          updateDashboard();
          showToast('Alterações salvas com sucesso!');
        });
      } finally {
        if (btnSaveEdit) {
          btnSaveEdit.disabled = false;
          btnSaveEdit.textContent = 'Salvar Alterações';
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
    tabs.forEach(t => t.classList.toggle('active', t.getAttribute('data-tab') === tabId));
    sections.forEach(s => s.classList.toggle('active', s.id === `section-${tabId}`));
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (tabId === 'dashboard') updateDashboard();
    if (tabId === 'orders') renderOrders();
    if (tabId === 'catalog') renderCatalog();
  };
  tabs.forEach(tab => {
    tab.addEventListener('click', () => switchTab(tab.getAttribute('data-tab')));
  });

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
    const textEl = badge.querySelector('.sync-text');
    if (textEl) textEl.textContent = text;
  };

  if (typeof window !== 'undefined' && window.jezFirebase) {
    updateCloudSyncStatus('online', 'Nuvem Conectada');
    if (typeof window.jezFirebase.onProductsChange === 'function') {
      window.jezFirebase.onProductsChange(remoteProducts => {
        if (Array.isArray(remoteProducts) && remoteProducts.length > 0) {
          updateCloudSyncStatus('synced', 'Sincronizado');
        }
      });
    }
  } else {
    updateCloudSyncStatus('offline', 'Modo Local');
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
