/**
 * ==========================================================================
 * JEZ Collection — Módulo de Dashboard Analítico do Ateliê (JEZ-030)
 * Arquitetura: Alex (CTO) | Merchant & Métricas: Cris
 * ==========================================================================
 */

/**
 * Calcula métricas analíticas e operacionais do Ateliê
 * @param {Array} orders
 * @param {Array} catalog
 * @returns {object}
 */
export function calculateDashboardMetrics(orders = [], catalog = []) {
  const paidOrders = orders.filter(o => o.status !== 'aguardando-pagamento' && o.status !== 'cancelado');
  const totalRevenue = paidOrders.reduce((sum, o) => sum + (Number(o.total) || 0), 0);
  const toShip = orders.filter(o => o.status === 'preparar-envio');
  const inProduction = orders.filter(o => o.status === 'em-producao');
  const pendingTotal = toShip.length + inProduction.length;

  return {
    totalRevenue,
    paidOrdersCount: paidOrders.length,
    toShipCount: toShip.length,
    inProductionCount: inProduction.length,
    pendingTotal,
    recentOrders: orders.slice(0, 3)
  };
}

/**
 * Atualiza os elementos visuais do dashboard no DOM
 * @param {object} elements
 * @param {object} params
 */
export function renderDashboard(elements, params) {
  const { orders = [], catalog = [], formatCurrency, getStatusMeta, escapeHtml, onNavigateOrder } = params;
  const metrics = calculateDashboardMetrics(orders, catalog);

  const {
    salesValueEl,
    salesCountEl,
    shippingValueEl,
    shippingSubtextEl,
    productionValueEl,
    pendingBadgeEl,
    recentContainerEl
  } = elements;

  if (salesValueEl && typeof formatCurrency === 'function') {
    salesValueEl.textContent = formatCurrency(metrics.totalRevenue);
  }
  if (salesCountEl) {
    salesCountEl.textContent = `${metrics.paidOrdersCount} pedido(s) faturado(s)`;
  }
  if (shippingValueEl) {
    shippingValueEl.textContent = metrics.toShipCount;
  }
  if (shippingSubtextEl) {
    shippingSubtextEl.textContent = metrics.toShipCount === 1 ? '1 pedido para postar hoje' : `${metrics.toShipCount} pedidos para postar nos Correios`;
  }
  if (productionValueEl) {
    productionValueEl.textContent = metrics.inProductionCount;
  }

  if (pendingBadgeEl) {
    if (metrics.pendingTotal > 0) {
      pendingBadgeEl.textContent = metrics.pendingTotal;
      pendingBadgeEl.style.display = 'flex';
    } else {
      pendingBadgeEl.style.display = 'none';
    }
  }

  if (recentContainerEl) {
    recentContainerEl.innerHTML = '';
    if (metrics.recentOrders.length === 0) {
      recentContainerEl.innerHTML = '<p style="font-size: 0.85rem; color: rgba(245, 236, 183, 0.7); text-align: center; padding: 12px;">Nenhum pedido registrado ainda.</p>';
      return;
    }

    metrics.recentOrders.forEach(order => {
      const itemRow = document.createElement('div');
      itemRow.className = 'recent-order-item';
      itemRow.setAttribute('role', 'button');
      itemRow.setAttribute('tabindex', '0');
      itemRow.setAttribute('data-order-id', order.id);

      const statusMeta = typeof getStatusMeta === 'function' ? getStatusMeta(order.status, order, catalog) : { label: order.status };
      const safeId = typeof escapeHtml === 'function' ? escapeHtml(order.id) : order.id;
      const safeCustomer = typeof escapeHtml === 'function' ? escapeHtml((order.customer || '').split(' ')[0]) : (order.customer || '').split(' ')[0];
      const safeStatus = typeof escapeHtml === 'function' ? escapeHtml(order.status) : order.status;
      const formattedTotal = typeof formatCurrency === 'function' ? formatCurrency(order.total) : order.total;

      const customerLabel = safeCustomer ? ` de ${safeCustomer}` : '';
      itemRow.setAttribute('aria-label', `Ver detalhes do pedido ${safeId}${customerLabel}`);

      itemRow.innerHTML = `
        <div class="recent-order-main">
          <span class="recent-order-id">${safeId}</span>
          <span class="recent-order-customer">${safeCustomer}</span>
        </div>
        <div class="recent-order-meta">
          <span class="status-tag status-${safeStatus}">${statusMeta.label}</span>
          <strong class="recent-order-total">${formattedTotal}</strong>
          <svg class="recent-order-chevron" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="9 18 15 12 9 6"></polyline>
          </svg>
        </div>
      `;

      const triggerNavigation = () => {
        if (typeof onNavigateOrder === 'function') {
          onNavigateOrder(order.id);
        }
      };

      itemRow.addEventListener('click', triggerNavigation);
      itemRow.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          triggerNavigation();
        }
      });

      recentContainerEl.appendChild(itemRow);
    });
  }
}
