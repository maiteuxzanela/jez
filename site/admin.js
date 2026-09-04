/**
 * ==========================================================================
 * JEZ Ateliê & Gestão — Lógica do Painel Administrativo Mobile
 * Especialista: Cris (Sênior Back-Office & Merchant Experience Engineer)
 * Aprovado por: Alex (CTO)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Estado Inicial & Pedidos de Demonstração
  // --------------------------------------------------------------------------
  const STORAGE_ORDERS_KEY = 'jez_orders';
  const STORAGE_CUSTOM_PRODUCTS_KEY = 'jez_custom_products';

  const defaultSampleOrders = [
    {
      id: 'JEZ-8042',
      date: new Date(Date.now() - 3600000 * 2).toISOString(),
      customer: 'Mariana V. (Belo Horizonte - MG)',
      items: [{ name: 'Tote Bag Cherry com Laço', quantity: 1, price: 149.90 }],
      subtotal: 149.90,
      shipping: 18.50,
      total: 168.40,
      status: 'preparar-envio',
      trackingCode: ''
    },
    {
      id: 'JEZ-8038',
      date: new Date(Date.now() - 3600000 * 24).toISOString(),
      customer: 'Camilla F. (São Paulo - SP)',
      items: [{ name: 'Blusa Teia de Aranha Cropped', quantity: 1, price: 189.90 }],
      subtotal: 189.90,
      shipping: 22.90,
      total: 212.80,
      status: 'em-producao',
      leadTimeDays: 8,
      trackingCode: ''
    },
    {
      id: 'JEZ-8031',
      date: new Date(Date.now() - 3600000 * 48).toISOString(),
      customer: 'Letícia R. (Montes Claros - MG)',
      items: [{ name: 'Bolsa Punk Slouchy com Correntes', quantity: 1, price: 169.90 }],
      subtotal: 169.90,
      shipping: 12.00,
      total: 181.90,
      status: 'enviado',
      trackingCode: 'NL893412571BR'
    },
    {
      id: 'JEZ-8025',
      date: new Date(Date.now() - 3600000 * 72).toISOString(),
      customer: 'Beatriz M. (Rio de Janeiro - RJ)',
      items: [{ name: 'Shoulder Bag Coração Granny Square', quantity: 1, price: 139.90 }],
      subtotal: 139.90,
      shipping: 24.50,
      total: 164.40,
      status: 'aguardando-pagamento',
      trackingCode: ''
    },
    {
      id: 'JEZ-8012',
      date: new Date(Date.now() - 3600000 * 120).toISOString(),
      customer: 'Amanda S. (Curitiba - PR)',
      items: [
        { name: 'Top Amarração Frontal + Bandana', quantity: 1, price: 129.90 },
        { name: 'Chaveiro Amigurumi Baphomet Cute', quantity: 1, price: 42.00 }
      ],
      subtotal: 171.90,
      shipping: 26.00,
      total: 197.90,
      status: 'concluido',
      trackingCode: 'NL872149503BR'
    }
  ];

  // Carrega ou inicializa os pedidos
  const loadOrders = () => {
    const raw = localStorage.getItem(STORAGE_ORDERS_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(defaultSampleOrders));
      return defaultSampleOrders;
    }
    try {
      return JSON.parse(raw);
    } catch {
      return defaultSampleOrders;
    }
  };

  const saveOrders = (ordersList) => {
    localStorage.setItem(STORAGE_ORDERS_KEY, JSON.stringify(ordersList));
    updateDashboard();
    renderOrders();
  };

  const loadCustomProducts = () => {
    const raw = localStorage.getItem(STORAGE_CUSTOM_PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : [];
  };

  const saveCustomProducts = (productsList) => {
    localStorage.setItem(STORAGE_CUSTOM_PRODUCTS_KEY, JSON.stringify(productsList));
    renderCatalog();
  };

  let orders = loadOrders();
  let currentFilter = 'all';

  // Formatador de Moeda
  const formatCurrency = (val) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(val);
  };

  // Formatador de Data Amigável
  const formatDate = (isoString) => {
    const d = new Date(isoString);
    return d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  };

  // Toast amigável da Jéssica
  const showToast = (message) => {
    const toast = document.getElementById('admin-toast');
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 2800);
  };

  // --------------------------------------------------------------------------
  // 2. Navegação em Abas Mobile-First
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
    tab.addEventListener('click', () => {
      switchTab(tab.getAttribute('data-tab'));
    });
  });

  document.getElementById('btn-quick-new-piece').addEventListener('click', () => switchTab('new-product'));
  document.getElementById('btn-quick-view-orders').addEventListener('click', () => switchTab('orders'));
  document.getElementById('btn-see-all-orders').addEventListener('click', () => switchTab('orders'));
  document.getElementById('btn-refresh-data').addEventListener('click', () => {
    orders = loadOrders();
    updateDashboard();
    renderOrders();
    showToast('Dados do ateliê atualizados!');
  });

  // --------------------------------------------------------------------------
  // 3. Métricas Executivas do Dashboard (Visão Geral)
  // --------------------------------------------------------------------------
  const updateDashboard = () => {
    orders = loadOrders();

    // Faturamento (pedidos que já foram pagos/produção/enviados/concluídos)
    const paidOrders = orders.filter(o => o.status !== 'aguardando-pagamento' && o.status !== 'cancelado');
    const totalRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    document.getElementById('kpi-sales-value').textContent = formatCurrency(totalRevenue);
    document.getElementById('kpi-sales-count').textContent = `${paidOrders.length} pedido(s) faturado(s)`;

    // Pedidos para postar (Pago / Preparar Envio)
    const toShip = orders.filter(o => o.status === 'preparar-envio');
    document.getElementById('kpi-shipping-value').textContent = toShip.length;
    document.getElementById('kpi-shipping-subtext').textContent = toShip.length === 1 ? '1 pedido para postar hoje' : `${toShip.length} pedidos para postar nos Correios`;

    // Encomendas em Produção
    const inProduction = orders.filter(o => o.status === 'em-producao');
    document.getElementById('kpi-production-value').textContent = inProduction.length;

    // Badge na aba Pedidos
    const pendingTotal = toShip.length + inProduction.length;
    const badge = document.getElementById('pending-orders-badge');
    if (pendingTotal > 0) {
      badge.textContent = pendingTotal;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }

    // Lista rápida de pedidos recentes no dashboard (últimos 3)
    const recentContainer = document.getElementById('dashboard-recent-orders');
    recentContainer.innerHTML = '';
    const latestThree = orders.slice(0, 3);

    if (latestThree.length === 0) {
      recentContainer.innerHTML = '<p style="font-size: 0.85rem; color: #888; text-align: center; padding: 12px;">Nenhum pedido registrado ainda.</p>';
      return;
    }

    latestThree.forEach(order => {
      const itemRow = document.createElement('div');
      itemRow.className = 'recent-order-item';
      itemRow.style.cssText = 'display: flex; justify-content: space-between; align-items: center; padding: 8px 10px; background: rgba(245, 236, 183, 0.3); border-radius: 4px; font-size: 0.82rem;';
      
      const statusMeta = getStatusMeta(order.status);
      itemRow.innerHTML = `
        <div>
          <strong style="color: var(--color-dark);">${order.id}</strong>
          <span style="color: #666; font-size: 0.74rem; margin-left: 6px;">${order.customer.split(' ')[0]}</span>
        </div>
        <div style="display: flex; align-items: center; gap: 8px;">
          <span class="status-tag status-${order.status}" style="font-size: 0.65rem; padding: 2px 6px;">${statusMeta.label}</span>
          <strong style="color: var(--color-primary);">${formatCurrency(order.total)}</strong>
        </div>
      `;
      recentContainer.appendChild(itemRow);
    });
  };

  // Metadados de Status das Peças & Pedidos
  const getStatusMeta = (status) => {
    switch (status) {
      case 'aguardando-pagamento':
        return { label: 'Aguardando Pagamento', nextLabel: 'Confirmar Pagamento', nextStatus: 'preparar-envio' };
      case 'em-producao':
        return { label: 'Em Produção', nextLabel: 'Concluir Confecção', nextStatus: 'preparar-envio' };
      case 'preparar-envio':
        return { label: 'Preparar Envio', nextLabel: 'Marcar como Enviado', nextStatus: 'enviado' };
      case 'enviado':
        return { label: 'Enviado', nextLabel: 'Marcar como Entregue', nextStatus: 'concluido' };
      case 'concluido':
        return { label: 'Concluído', nextLabel: '', nextStatus: '' };
      default:
        return { label: status, nextLabel: '', nextStatus: '' };
    }
  };

  // --------------------------------------------------------------------------
  // 4. Gestão Visual de Pedidos (Kanban / Lista de Status)
  // --------------------------------------------------------------------------
  const renderOrders = () => {
    orders = loadOrders();
    const container = document.getElementById('orders-list-container');
    container.innerHTML = '';

    // Atualiza contadores dos filtros
    const counts = {
      all: orders.length,
      'aguardando-pagamento': orders.filter(o => o.status === 'aguardando-pagamento').length,
      'em-producao': orders.filter(o => o.status === 'em-producao').length,
      'preparar-envio': orders.filter(o => o.status === 'preparar-envio').length,
      enviado: orders.filter(o => o.status === 'enviado').length,
      concluido: orders.filter(o => o.status === 'concluido').length
    };

    document.getElementById('count-all').textContent = counts.all;
    document.getElementById('count-yellow').textContent = counts['aguardando-pagamento'];
    document.getElementById('count-orange').textContent = counts['em-producao'];
    document.getElementById('count-blue').textContent = counts['preparar-envio'];
    document.getElementById('count-purple').textContent = counts.enviado;
    document.getElementById('count-green').textContent = counts.concluido;

    const filtered = currentFilter === 'all' ? orders : orders.filter(o => o.status === currentFilter);

    if (filtered.length === 0) {
      container.innerHTML = `
        <div style="text-align: center; padding: 40px 20px; color: var(--color-muted-text); background: var(--color-white); border-radius: var(--radius-sm); border: 1.5px dashed rgba(35, 25, 45, 0.2);">
          <p style="font-size: 0.95rem; font-weight: 700;">Nenhum pedido encontrado nesta categoria.</p>
        </div>
      `;
      return;
    }

    filtered.forEach(order => {
      const card = document.createElement('div');
      card.className = 'order-card';
      const statusMeta = getStatusMeta(order.status);

      const itemsHtml = order.items.map(i => `
        <div style="display: flex; justify-content: space-between;">
          <span>• ${i.quantity}x ${i.name}</span>
          <span style="font-weight: 700;">${formatCurrency(i.price * i.quantity)}</span>
        </div>
      `).join('');

      card.innerHTML = `
        <div class="order-card-header">
          <div>
            <span class="order-id-badge">${order.id}</span>
            <div class="order-date">${formatDate(order.date)} • ${order.customer}</div>
          </div>
          <span class="status-tag status-${order.status}">
            ${statusMeta.label}
          </span>
        </div>

        <div class="order-items-summary">
          ${itemsHtml}
          ${order.shipping > 0 ? `
            <div style="display: flex; justify-content: space-between; color: #666; font-size: 0.74rem; border-top: 1px dashed rgba(35,25,45,0.15); padding-top: 4px; margin-top: 2px;">
              <span>Frete Correios:</span>
              <span>${formatCurrency(order.shipping)}</span>
            </div>
          ` : ''}
          <div class="order-total-row">
            <span>Total:</span>
            <span class="order-total-highlight">${formatCurrency(order.total)}</span>
          </div>
        </div>

        <!-- Se estiver enviado, exibe o código de rastreamento com link dos Correios -->
        ${order.status === 'enviado' ? `
          <div style="background: rgba(124, 58, 237, 0.08); border-radius: 4px; padding: 8px 10px; border: 1px dashed #7c3aed;">
            <div class="tracking-info-live">
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon></svg>
              <span>Código: <strong>${order.trackingCode || 'Pendente'}</strong></span>
              ${order.trackingCode ? `
                <a href="https://rastreamento.correios.com.br/app/index.php?codigo=${order.trackingCode}" target="_blank" rel="noopener" style="margin-left: auto;">Rastrear nos Correios ↗</a>
              ` : ''}
            </div>
          </div>
        ` : ''}

        <!-- Ações de Transição de Status em 2 toques -->
        <div class="order-status-actions">
          <div class="status-action-row">
            ${order.status === 'aguardando-pagamento' ? `
              <button class="btn-status-change" data-id="${order.id}" data-newstatus="preparar-envio" style="background: #2563eb; color: #fff; border-color: #2563eb;">
                Confirmar Pix (Preparar Envio)
              </button>
              <button class="btn-status-change" data-id="${order.id}" data-newstatus="em-producao" style="background: #ea580c; color: #fff; border-color: #ea580c;">
                Enviar para o Tear (Produção)
              </button>
            ` : ''}

            ${order.status === 'em-producao' ? `
              <button class="btn-status-change" data-id="${order.id}" data-newstatus="preparar-envio" style="background: #2563eb; color: #fff; border-color: #2563eb;">
                Peça Concluída (Preparar Envio)
              </button>
            ` : ''}

            ${order.status === 'preparar-envio' ? `
              <div style="width: 100%;">
                <label style="font-size: 0.74rem; font-weight: 700; color: var(--color-dark); margin-bottom: 4px; display: block;">
                  Código de Rastreio dos Correios:
                </label>
                <div class="tracking-input-box">
                  <input type="text" placeholder="Ex: QB123456789BR" class="tracking-input" id="tracking-input-${order.id}" value="${order.trackingCode || ''}">
                  <button class="btn-save-tracking" data-id="${order.id}">Postar & Enviar</button>
                </div>
              </div>
            ` : ''}

            ${order.status === 'enviado' ? `
              <button class="btn-status-change" data-id="${order.id}" data-newstatus="concluido" style="background: #16a34a; color: #fff; border-color: #16a34a;">
                Marcar como Entregue ao Cliente
              </button>
              <button class="btn-copy-msg" data-id="${order.id}" data-tracking="${order.trackingCode}" style="background: #f3e8ff; border: 1px solid #7c3aed; color: #6b21a8; padding: 6px 10px; border-radius: 3px; font-size: 0.72rem; font-weight: 700;">
                Copiar Msg WhatsApp
              </button>
            ` : ''}

            ${order.status === 'concluido' ? `
              <span style="font-size: 0.75rem; color: #166534; font-weight: 700; display: flex; align-items: center; gap: 4px;">
                Pedido concluído com sucesso e entregue ao cliente.
              </span>
            ` : ''}
          </div>
        </div>
      `;

      container.appendChild(card);
    });

    // Registra cliques de mudança de status
    container.querySelectorAll('.btn-status-change').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const orderId = e.currentTarget.getAttribute('data-id');
        const newStatus = e.currentTarget.getAttribute('data-newstatus');
        updateOrderStatus(orderId, newStatus);
      });
    });

    // Registra salvamento de código de rastreio
    container.querySelectorAll('.btn-save-tracking').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const orderId = e.currentTarget.getAttribute('data-id');
        const input = document.getElementById(`tracking-input-${orderId}`);
        const code = (input ? input.value.trim().toUpperCase() : '');
        updateOrderStatus(orderId, 'enviado', code);
      });
    });

    // Registra cópia de mensagem do WhatsApp
    container.querySelectorAll('.btn-copy-msg').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const code = e.currentTarget.getAttribute('data-tracking');
        const msg = `Olá! Sua encomenda da JËZ collection já foi postada nos Correios com muito carinho!\nCódigo de rastreamento: ${code || 'Enviado'}\nAcompanhe pelo link: https://rastreamento.correios.com.br/app/index.php?codigo=${code}`;
        navigator.clipboard.writeText(msg).then(() => {
          showToast('Mensagem de rastreio copiada para o WhatsApp!');
        });
      });
    });
  };

  const updateOrderStatus = (orderId, newStatus, trackingCode = null) => {
    orders = orders.map(o => {
      if (o.id === orderId) {
        const updated = { ...o, status: newStatus };
        if (trackingCode !== null) updated.trackingCode = trackingCode;
        return updated;
      }
      return o;
    });
    saveOrders(orders);
    showToast(`Status do pedido ${orderId} atualizado para ${getStatusMeta(newStatus).label}!`);
  };

  // Filtros de status de pedidos
  document.querySelectorAll('.order-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.order-filter-btn').forEach(b => b.classList.remove('active'));
      e.currentTarget.classList.add('active');
      currentFilter = e.currentTarget.getAttribute('data-status');
      renderOrders();
    });
  });

  // --------------------------------------------------------------------------
  // 5. Cadastro Ágil de Nova Peça
  // --------------------------------------------------------------------------
  const photoInput = document.getElementById('product-photo-input');
  const uploadPrompt = document.getElementById('upload-prompt');
  const previewContainer = document.getElementById('upload-preview-container');
  const previewImg = document.getElementById('photo-preview-img');
  const btnRemovePhoto = document.getElementById('btn-remove-photo');
  let currentPhotoBase64 = '';

  // Processamento do upload da foto com compressão simples
  photoInput.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      currentPhotoBase64 = event.target.result;
      previewImg.src = currentPhotoBase64;
      uploadPrompt.style.display = 'none';
      previewContainer.style.display = 'flex';
    };
    reader.readAsDataURL(file);
  });

  btnRemovePhoto.addEventListener('click', (e) => {
    e.stopPropagation();
    photoInput.value = '';
    currentPhotoBase64 = '';
    previewImg.src = '';
    previewContainer.style.display = 'none';
    uploadPrompt.style.display = 'flex';
  });

  // Alternância Pronta Entrega vs Sob Encomenda
  const modalityOptions = document.querySelectorAll('.modality-option');
  const leadTimeField = document.getElementById('order-leadtime-field');

  modalityOptions.forEach(opt => {
    opt.addEventListener('click', () => {
      modalityOptions.forEach(o => o.classList.remove('active'));
      opt.classList.add('active');
      const radio = opt.querySelector('input[type="radio"]');
      radio.checked = true;

      if (radio.value === 'order') {
        leadTimeField.style.display = 'block';
      } else {
        leadTimeField.style.display = 'none';
      }
    });
  });

  // Submissão do Formulário de Nova Peça
  const formNewProduct = document.getElementById('form-new-product');
  formNewProduct.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('product-name-input').value.trim();
    const category = document.getElementById('product-category-input').value;
    const price = parseFloat(document.getElementById('product-price-input').value);
    const modality = document.querySelector('input[name="product-modality"]:checked').value;
    const leadTimeDays = modality === 'order' ? parseInt(document.getElementById('product-leadtime-input').value) || 7 : 0;
    const dimensions = document.getElementById('product-dimensions-input').value.trim() || 'Medidas artesanais sob encomenda';
    const materials = document.getElementById('product-materials-input').value.trim() || 'Fio 100% algodão premium artesanal';
    const description = document.getElementById('product-desc-input').value.trim() || 'Peça autoral tecida com amor e acabamento único pela Jéssica Regina.';

    // Se não subiu foto, usa uma imagem padrão estética da marca
    const photoToUse = currentPhotoBase64 || 'assets/products/tote_cherry.jpg';

    const categoryLabels = {
      bolsas: 'Bolsas & Bags',
      vestuario: 'Vestuário Autoral',
      acessorios: 'Acessórios'
    };

    const newPiece = {
      id: 'custom-' + Date.now(),
      name,
      category,
      categoryLabel: categoryLabels[category] || 'Peças Autorais',
      price,
      image: photoToUse,
      isReady: modality === 'ready',
      stockQty: modality === 'ready' ? 1 : 0,
      leadTimeDays: leadTimeDays,
      dimensions,
      materials,
      description
    };

    const customProducts = loadCustomProducts();
    customProducts.push(newPiece);
    saveCustomProducts(customProducts);

    // Limpa formulário
    formNewProduct.reset();
    btnRemovePhoto.click();
    modalityOptions[0].click();

    showToast(`Peça "${name}" publicada com sucesso na vitrine da loja!`);
    
    // Transiciona para a aba do acervo
    setTimeout(() => {
      switchTab('catalog');
    }, 600);
  });

  // --------------------------------------------------------------------------
  // 6. Acervo & Catálogo de Peças da Jéssica
  // --------------------------------------------------------------------------
  const defaultCatalog = [
    { id: 'bolsa-punk', name: 'Bolsa Punk Slouchy com Correntes', price: 169.90, image: 'assets/products/bolsa_punk.jpg', isReady: false },
    { id: 'tote-cherry', name: 'Tote Bag Cherry com Laço', price: 149.90, image: 'assets/products/tote_cherry.jpg', isReady: true },
    { id: 'shoulder-coracao', name: 'Shoulder Bag Coração Granny Square', price: 139.90, image: 'assets/products/shoulder_coracao.jpg', isReady: true },
    { id: 'bolsa-xadrez', name: 'Bolsa Xadrez Checkerboard', price: 159.90, image: 'assets/products/bolsa_xadrez.jpg', isReady: false },
    { id: 'blusa-teia', name: 'Blusa Teia de Aranha Cropped', price: 189.90, image: 'assets/products/blusa_teia.jpg', isReady: false },
    { id: 'top-bandana', name: 'Top Amarração Frontal + Bandana', price: 129.90, image: 'assets/products/top_bandana.jpg', isReady: true },
    { id: 'cardiga-manteiga', name: 'Cardigã Cropped Shrug Manteiga', price: 179.90, image: 'assets/products/cardiga_manteiga.jpg', isReady: false },
    { id: 'chaveiro-baphomet', name: 'Chaveiro Amigurumi Baphomet Cute', price: 42.00, image: 'assets/products/chaveiro_baphomet.jpg', isReady: true },
    { id: 'porta-airpods', name: 'Porta-AirPods em Crochê', price: 38.00, image: 'assets/products/porta_airpods.jpg', isReady: true }
  ];

  const renderCatalog = (query = '') => {
    const custom = loadCustomProducts();
    const allPieces = [...defaultCatalog, ...custom];
    const grid = document.getElementById('admin-catalog-grid');
    grid.innerHTML = '';

    const filtered = query
      ? allPieces.filter(p => p.name.toLowerCase().includes(query.toLowerCase()))
      : allPieces;

    document.getElementById('total-pieces-count').textContent = `${allPieces.length} peça(s) no total`;

    filtered.forEach(piece => {
      const card = document.createElement('div');
      card.className = 'admin-product-card';
      const isCustom = piece.id.startsWith('custom-');

      card.innerHTML = `
        <img src="${piece.image}" alt="${piece.name}" class="admin-product-thumb">
        <div class="admin-product-details">
          <span class="admin-product-name" title="${piece.name}">${piece.name}</span>
          <span class="admin-product-price">${formatCurrency(piece.price)}</span>
          <div style="display: flex; gap: 6px; align-items: center; margin-top: 4px;">
            <button class="btn-toggle-availability ${piece.isReady ? 'ready' : 'order'}" data-id="${piece.id}">
              ${piece.isReady ? 'Pronta Entrega' : 'Sob Encomenda'}
            </button>
            ${isCustom ? `
              <button class="btn-delete-piece" data-id="${piece.id}" style="font-size: 0.68rem; color: #dc2626; background: none; border: none; cursor: pointer; text-decoration: underline; margin-left: auto;">
                Excluir
              </button>
            ` : ''}
          </div>
        </div>
      `;

      grid.appendChild(card);
    });

    // Alterna disponibilidade
    grid.querySelectorAll('.btn-toggle-availability').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        togglePieceAvailability(id);
      });
    });

    // Exclusão de peças customizadas
    grid.querySelectorAll('.btn-delete-piece').forEach(btn => {
      btn.addEventListener('click', (e) => {
        const id = e.currentTarget.getAttribute('data-id');
        deleteCustomPiece(id);
      });
    });
  };

  const togglePieceAvailability = (id) => {
    let custom = loadCustomProducts();
    let updated = false;

    // Se for custom
    custom = custom.map(p => {
      if (p.id === id) {
        updated = true;
        return { ...p, isReady: !p.isReady };
      }
      return p;
    });

    if (updated) {
      saveCustomProducts(custom);
    } else {
      // Se for item padrão, podemos salvar como override
      const defaultItem = defaultCatalog.find(p => p.id === id);
      if (defaultItem) {
        defaultItem.isReady = !defaultItem.isReady;
        renderCatalog();
      }
    }

    showToast('Disponibilidade da peça atualizada!');
  };

  const deleteCustomPiece = (id) => {
    if (!confirm('Deseja realmente remover esta peça artesanal do acervo?')) return;
    let custom = loadCustomProducts().filter(p => p.id !== id);
    saveCustomProducts(custom);
    showToast('Peça removida do acervo.');
  };

  document.getElementById('catalog-search-input').addEventListener('input', (e) => {
    renderCatalog(e.target.value.trim());
  });

  // Inicialização Inicial
  updateDashboard();
  renderOrders();
  renderCatalog();
});
