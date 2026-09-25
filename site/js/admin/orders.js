/**
 * ==========================================================================
 * JEZ Collection — Módulo de Pedidos e Expedição do Ateliê (JEZ-030)
 * Arquitetura: Alex (CTO) | E-commerce & Checkout: Sam
 * ==========================================================================
 */

export const STORAGE_ORDERS_KEY = 'jez_orders';

/**
 * Carrega lista de pedidos do localStorage com higienização automática de dados de teste
 * @returns {Array}
 */
export function loadOrders() {
  const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    // Higienização automática: expurga dados fictícios legados do cache do navegador
    if (parsed.some(o => o.id && o.id.startsWith('JEZ-80'))) {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify([]));
      return [];
    }
    return parsed;
  } catch {
    return [];
  }
}

/**
 * Persiste a lista de pedidos no armazenamento local
 * @param {Array} ordersList
 * @param {Function | null} onUpdated
 */
export function saveOrders(ordersList, onUpdated = null) {
  localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(ordersList));
  if (typeof onUpdated === 'function') {
    onUpdated(ordersList);
  }
}

/**
 * Identifica se um item do pedido é de produção artesanal sob encomenda
 * @param {object} item
 * @param {Array} catalog
 * @returns {boolean}
 */
export function isItemCustomProduction(item, catalog = []) {
  if (!item) return false;

  // 1. Verificação explícita no item
  if (item.isReady === false || item.status === 'order' || (item.leadTimeDays && Number(item.leadTimeDays) > 0)) {
    return true;
  }
  if (item.isReady === true || item.status === 'ready') {
    return false;
  }

  // 2. Consulta de referência cruzada no catálogo do ateliê
  if (catalog && Array.isArray(catalog)) {
    const match = catalog.find(p => {
      if (item.id && p.id === item.id) return true;
      if (p.name && item.name) {
        const normP = p.name.trim().toLowerCase();
        const normI = item.name.trim().toLowerCase();
        return normP === normI || normP.includes(normI) || normI.includes(normP);
      }
      return false;
    });

    if (match) {
      if (match.status === 'order' || (!match.isReady && match.status !== 'ready') || (match.leadTimeDays && Number(match.leadTimeDays) > 0)) {
        return true;
      }
      if (match.status === 'ready' || (match.isReady && match.status !== 'order')) {
        return false;
      }
    }
  }

  // 3. Fallback textual pelo nome
  if (item.name && typeof item.name === 'string') {
    const lower = item.name.toLowerCase();
    if (lower.includes('encomenda') || lower.includes('tear') || lower.includes('produção') || lower.includes('producao')) {
      return true;
    }
  }

  return false;
}

/**
 * Identifica se o pedido possui ao menos um item sob encomenda
 * @param {object} order
 * @param {Array} catalog
 * @returns {boolean}
 */
export function isOrderCustomProduction(order, catalog = []) {
  if (!order) return false;
  if (order.hasCustomProduction !== undefined) {
    return Boolean(order.hasCustomProduction);
  }
  if (order.modality === 'order') return true;
  if (order.modality === 'ready') return false;

  if (!order.items || !Array.isArray(order.items) || order.items.length === 0) {
    return false;
  }

  return order.items.some(item => isItemCustomProduction(item, catalog));
}

/**
 * Retorna os metadados de status e botões de ação do pedido
 * @param {string} status
 * @param {object | null} order
 * @param {Array} catalog
 * @returns {{ label: string, nextLabel: string, nextStatus: string }}
 */
export function getStatusMeta(status, order = null, catalog = []) {
  switch (status) {
    case 'aguardando-pagamento': {
      const isCustom = order ? isOrderCustomProduction(order, catalog) : false;
      return {
        label: 'Aguardando Pagamento',
        nextLabel: isCustom ? 'Enviar para o Tear (Produção)' : 'Confirmar Pix (Preparar Envio)',
        nextStatus: isCustom ? 'em-producao' : 'preparar-envio'
      };
    }
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
}

/**
 * Filtra a lista de pedidos com base no status selecionado
 * @param {Array} ordersList
 * @param {string} filterStatus
 * @returns {Array}
 */
export function filterOrdersList(ordersList, filterStatus = 'all') {
  if (!Array.isArray(ordersList)) return [];
  if (!filterStatus || typeof filterStatus !== 'string' || filterStatus === 'all') {
    return ordersList;
  }
  return ordersList.filter(o => o && o.status === filterStatus);
}

/**
 * Valida se uma transição de status de pedido é coerente e permitida
 * @param {string} currentStatus
 * @param {string} targetStatus
 * @returns {{ allowed: boolean, reason?: string }}
 */
export function validateOrderStatusTransition(currentStatus, targetStatus) {
  if (!currentStatus || typeof currentStatus !== 'string') {
    return { allowed: false, reason: 'invalid_current_status' };
  }
  if (!targetStatus || typeof targetStatus !== 'string') {
    return { allowed: false, reason: 'invalid_target_status' };
  }

  const allowedTransitions = {
    'aguardando-pagamento': ['em-producao', 'preparar-envio'],
    'em-producao': ['preparar-envio'],
    'preparar-envio': ['enviado'],
    'enviado': ['concluido'],
    'concluido': []
  };

  const allowed = allowedTransitions[currentStatus] || [];
  if (!allowed.includes(targetStatus)) {
    return { allowed: false, reason: 'transition_not_allowed' };
  }
  return { allowed: true };
}

/**
 * Atualiza o status e/ou código de rastreamento de um pedido em uma lista de forma imutável
 * @param {Array} ordersList
 * @param {string} orderId
 * @param {string} newStatus
 * @param {string | null} trackingCode
 * @returns {{ success: boolean, orders: Array, updatedOrder?: object, reason?: string }}
 */
export function updateOrderInList(ordersList, orderId, newStatus, trackingCode = null) {
  if (!Array.isArray(ordersList)) {
    return { success: false, orders: [], reason: 'invalid_orders_list' };
  }
  if (!orderId || typeof orderId !== 'string') {
    return { success: false, orders: ordersList, reason: 'invalid_id' };
  }
  if (!newStatus || typeof newStatus !== 'string') {
    return { success: false, orders: ordersList, reason: 'invalid_status' };
  }

  const target = ordersList.find(o => o && o.id === orderId);
  if (!target) {
    return { success: false, orders: ordersList, reason: 'order_not_found' };
  }

  const check = validateOrderStatusTransition(target.status, newStatus);
  if (!check.allowed) {
    return { success: false, orders: ordersList, reason: check.reason };
  }

  let updatedTarget = null;
  const nextOrders = ordersList.map(o => {
    if (o && o.id === orderId) {
      updatedTarget = { ...o, status: newStatus };
      if (trackingCode !== null && trackingCode !== undefined) {
        updatedTarget.trackingCode = trackingCode;
      }
      return updatedTarget;
    }
    return o;
  });

  return { success: true, orders: nextOrders, updatedOrder: updatedTarget };
}
