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
  const { orders = [], catalog = [], formatCurrency, getStatusMeta, escapeHtml } = params;
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
      itemRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 10px 12px; background: rgba(35, 25, 45, 0.6); border: 1px dashed rgba(254, 191, 151, 0.25); border-radius: 4px; font-size: 0.82rem;';

      const statusMeta = typeof getStatusMeta === 'function' ? getStatusMeta(order.status, order, catalog) : { label: order.status };
      const safeId = typeof escapeHtml === 'function' ? escapeHtml(order.id) : order.id;
      const safeCustomer = typeof escapeHtml === 'function' ? escapeHtml((order.customer || '').split(' ')[0]) : (order.customer || '').split(' ')[0];
      const safeStatus = typeof escapeHtml === 'function' ? escapeHtml(order.status) : order.status;
      const formattedTotal = typeof formatCurrency === 'function' ? formatCurrency(order.total) : order.total;

      itemRow.innerHTML = `
        <div>
          <strong style="color: var(--color-bg-light);">${safeId}</strong>
          <span style="color: rgba(245, 236, 183, 0.75); font-size: 0.74rem; margin-left: 6px;">${safeCustomer}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="status-tag status-${safeStatus}" style="font-size: 0.65rem; padding: 2px 6px;">${statusMeta.label}</span>
          <strong style="color: var(--color-accent);">${formattedTotal}</strong>
        </div>
      `;
      recentContainerEl.appendChild(itemRow);
    });
  }
}
