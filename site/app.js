/**
 * ==========================================================================
 * JEZ Collection — Script Principal (Lógica de Vitrine, Carrinho & Frete)
 * Especialistas: Sam (E-Commerce) & Lumi (UI/UX)
 * Supervisionado por: Alex (CTO)
 * ==========================================================================
 */

document.addEventListener('DOMContentLoaded', () => {
  // --------------------------------------------------------------------------
  // 1. Catálogo Real de Peças Artesanais (Acervo Instagram @_jezcollection)
  // --------------------------------------------------------------------------
  const defaultProducts = [
    {
      id: 'bolsa-punk',
      name: 'Bolsa Punk Slouchy com Correntes',
      category: 'bolsas',
      categoryLabel: 'Bolsas & Bags',
      price: 169.90,
      image: 'assets/products/bolsa_punk.jpg',
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
      leadTimeDays: 10,
      dimensions: 'Modelagem cropped soltinha com manga 3/4 (tamanho único M)',
      materials: 'Fio macio no tom manteiga suave (#F5ECB7) com pontos rendados florais',
      description: 'Bolero delicado em tom suave e aconchegante. A terceira peça perfeita para valorizar qualquer look casual com a textura nobre do crochê.'
    },
    {
      id: 'chaveiro-baphomet',
      name: 'Chaveiro Amigurumi Baphomet Cute',
      category: 'acessorios',
      categoryLabel: 'Acessórios & Miudezas',
      price: 49.90,
      image: 'assets/products/chaveiro_baphomet.jpg',
      isReady: true,
      stockQty: 4,
      dimensions: '10cm de altura (sem contar a argola)',
      materials: 'Fio 100% algodão preto, enchimento siliconado antialérgico e chifres bordados',
      description: 'O contraste perfeito entre o místico e o adorável! Amigurumi com detalhes minuciosos em vermelho e pentagrama na testa. Argola de chaveiro inclusa.'
    },
    {
      id: 'porta-airpods',
      name: 'Porta-AirPods / Fones em Crochê',
      category: 'acessorios',
      categoryLabel: 'Acessórios & Miudezas',
      price: 39.90,
      image: 'assets/products/porta_airpods.jpg',
      isReady: true,
      stockQty: 5,
      dimensions: '6.5cm (L) × 5.5cm (A) × 3cm (P)',
      materials: 'Fio de algodão azul e amarelo, botão vintage e mosquetão metálico',
      description: 'Case protetora fofa em crochê para fones de ouvido sem fio. Protege o estojo de arranhões e vem com gancho para pendurar na bolsa ou no cinto.'
    }
  ];

  // Carrega peças padrão + peças cadastradas e geridas pela Jéssica no painel
  const getProducts = () => {
    try {
      const catalogRaw = localStorage.getItem('jez_catalog');
      let pieces = [];
      if (catalogRaw) {
        pieces = JSON.parse(catalogRaw);
      } else {
        const custom = JSON.parse(localStorage.getItem('jez_custom_products') || '[]');
        pieces = [...defaultProducts, ...custom];
      }
      // Filtra estritamente peças que NÃO estejam suspensas nem excluídas
      return pieces
        .filter(p => p.status !== 'suspended' && !p.isSuspended && !p.isDeleted)
        .map(p => ({
          ...p,
          isReady: p.status ? p.status === 'ready' : (p.isReady !== undefined ? p.isReady : true)
        }));
    } catch {
      return defaultProducts;
    }
  };
  let products = getProducts();

  // --------------------------------------------------------------------------
  // 2. Estado Global da Loja
  // --------------------------------------------------------------------------
  let cart = JSON.parse(localStorage.getItem('jez_cart')) || [];
  let currentFilter = 'todas';
  let shippingCost = 0;
  let shippingMethod = '';

  // --------------------------------------------------------------------------
  // 3. Seletores DOM
  // --------------------------------------------------------------------------
  const productsGrid = document.getElementById('products-grid');
  const filterPills = document.querySelectorAll('.filter-pill');
  const cartButton = document.getElementById('cart-button');
  const cartBadge = document.getElementById('cart-badge');
  const cartDrawerBackdrop = document.getElementById('cart-drawer-backdrop');
  const btnCloseDrawer = document.getElementById('btn-close-drawer');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartEmptyState = document.getElementById('cart-empty-state');
  const cartSubtotalEl = document.getElementById('cart-subtotal');
  const cartShippingEl = document.getElementById('cart-shipping');
  const cartTotalEl = document.getElementById('cart-total');
  const btnCalcShipping = document.getElementById('btn-calc-shipping');
  const cepInput = document.getElementById('cep-input');
  const shippingResult = document.getElementById('shipping-result');
  const btnCheckout = document.getElementById('btn-checkout');
  const toastContainer = document.getElementById('toast-container');
  const productModalBackdrop = document.getElementById('product-modal-backdrop');
  const btnCloseModal = document.getElementById('btn-close-modal');

  // Elementos de Dados do Cliente no Carrinho (Sam & Morgan)
  const customerInfoBox = document.getElementById('customer-info-box');
  const customerNameInput = document.getElementById('customer-name');
  const customerStreetInput = document.getElementById('customer-street');
  const customerNumberInput = document.getElementById('customer-number');
  const customerCityInput = document.getElementById('customer-city');
  const customerDataHint = document.getElementById('customer-data-hint');

  // Elementos do Modal Rápido
  const modalImg = document.getElementById('modal-img');
  const modalImgBlur = document.getElementById('modal-img-blur');
  const modalCategory = document.getElementById('modal-category');
  const modalTitle = document.getElementById('modal-title');
  const modalPrice = document.getElementById('modal-price');
  const modalBadge = document.getElementById('modal-badge');
  const modalDesc = document.getElementById('modal-desc');
  const modalDimensions = document.getElementById('modal-dimensions');
  const modalMaterials = document.getElementById('modal-materials');
  const modalBtnAddCart = document.getElementById('modal-btn-add-cart');
  const modalBtnWhatsapp = document.getElementById('modal-btn-whatsapp');

  // --------------------------------------------------------------------------
  // 4. Funções de Formatação, Sanitização & Segurança (Morgan - Cibersegurança)
  // --------------------------------------------------------------------------
  const escapeHtml = (str) => {
    if (str === null || str === undefined) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  };

  const sanitizeCustomerInput = (str, maxLen = 100) => {
    if (!str || typeof str !== 'string') return '';
    return str
      .replace(/[<>'"`;]/g, '')
      .replace(/\s+/g, ' ')
      .trim()
      .slice(0, maxLen);
  };

  const sanitizeImageUrl = (url) => {
    if (!url || typeof url !== 'string') return 'assets/products/tote_cherry.jpg';
    const trimmed = url.trim();
    if (trimmed.startsWith('assets/') || trimmed.startsWith('data:image/') || trimmed.startsWith('https://') || trimmed.startsWith('./assets/')) {
      return trimmed;
    }
    return 'assets/products/tote_cherry.jpg';
  };

  const formatCurrency = (val) => {
    const num = Number(val) || 0;
    return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const showToast = (message) => {
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.innerHTML = `<svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg> <span>${escapeHtml(message)}</span>`;
    toastContainer.appendChild(toast);
    
    // Animação de entrada
    requestAnimationFrame(() => toast.classList.add('show'));

    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => toast.remove(), 350);
    }, 2800);
  };

  // --------------------------------------------------------------------------
  // 5. Renderização do Catálogo de Produtos (Blindado contra XSS)
  // --------------------------------------------------------------------------
  const renderCatalog = () => {
    products = getProducts();
    productsGrid.innerHTML = '';

    const filtered = products.filter(p => {
      if (currentFilter === 'todas') return true;
      if (currentFilter === 'pronta-entrega') return p.isReady;
      return p.category === currentFilter;
    });

    if (filtered.length === 0) {
      productsGrid.innerHTML = `<p style="grid-column: 1/-1; text-align: center; color: var(--color-muted-text); padding: 40px 0;">Nenhuma peça encontrada nesta categoria no momento.</p>`;
      return;
    }

    filtered.forEach(p => {
      const card = document.createElement('article');
      card.className = 'product-card';
      card.id = `card-${escapeHtml(p.id)}`;

      const safeId = escapeHtml(p.id);
      const safeName = escapeHtml(p.name);
      const safeCategory = escapeHtml(p.categoryLabel || 'Peça Autoral');
      const safeMaterials = escapeHtml(p.materials || '');
      const safeImage = sanitizeImageUrl(p.image);
      const safeLeadTime = parseInt(p.leadTimeDays, 10) || 7;

      const badgeHtml = p.isReady
        ? `<span class="product-badge badge-ready">Pronta Entrega</span>`
        : `<span class="product-badge badge-order">Sob Encomenda (${safeLeadTime}d)</span>`;

      const isLocalAsset = safeImage.startsWith('assets/');
      const webpCandidate = isLocalAsset ? safeImage.replace(/\.(jpg|jpeg|png)$/i, '.webp') : '';
      const imageMarkup = isLocalAsset
        ? `<picture>
            <source srcset="${webpCandidate}" type="image/webp">
            <img src="${safeImage}" alt="${safeName}" loading="lazy" width="400" height="400">
          </picture>`
        : `<img src="${safeImage}" alt="${safeName}" loading="lazy" width="400" height="400">`;

      card.innerHTML = `
        <div class="product-image-wrap" data-action="quickview" data-id="${safeId}">
          ${imageMarkup}
          ${badgeHtml}
          <button type="button" class="quick-view-overlay-btn" title="Visualizar detalhes" aria-label="Visualizar ${safeName}" data-action="quickview" data-id="${safeId}">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
          </button>
        </div>
        <div class="product-info">
          <span class="product-category">${safeCategory}</span>
          <h3 class="product-name" data-action="quickview" data-id="${safeId}">${safeName}</h3>
          <p class="product-meta">${safeMaterials}</p>
          <div class="product-footer">
            <div class="product-price">${formatCurrency(p.price)}</div>
            <button type="button" class="btn-add-cart" id="btn-add-${safeId}" data-action="add-cart" data-id="${safeId}">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
              Comprar
            </button>
          </div>
        </div>
      `;
      productsGrid.appendChild(card);
    });
  };

  // --------------------------------------------------------------------------
  // 6. Gerenciamento do Carrinho (Cart Drawer) & Checkout Seguro
  // --------------------------------------------------------------------------
  let lastLookupCep = '';
  const lookupAddressByCep = async (cleanCep) => {
    if (!cleanCep || cleanCep.length !== 8 || cleanCep === lastLookupCep) return;
    lastLookupCep = cleanCep;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2500);
      const res = await fetch(`https://viacep.com.br/ws/${cleanCep}/json/`, {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (!data.erro) {
          if (data.logradouro && customerStreetInput) {
            const streetVal = data.bairro ? `${data.logradouro} - ${data.bairro}` : data.logradouro;
            if (!customerStreetInput.value.trim() || customerStreetInput.dataset.autofilled === 'true') {
              customerStreetInput.value = streetVal;
              customerStreetInput.dataset.autofilled = 'true';
            }
          }
          if (data.localidade && customerCityInput) {
            const cityVal = data.uf ? `${data.localidade} / ${data.uf}` : data.localidade;
            if (!customerCityInput.value.trim() || customerCityInput.dataset.autofilled === 'true') {
              customerCityInput.value = cityVal;
              customerCityInput.dataset.autofilled = 'true';
            }
          }
          updateCheckoutReadiness();
          if (customerNameInput && !customerNameInput.value.trim()) {
            customerNameInput.focus();
          } else if (customerNumberInput && !customerNumberInput.value.trim()) {
            customerNumberInput.focus();
          }
          return;
        }
      }
    } catch (err) {
      // Falha de rede ou timeout: fallback gracioso sem quebrar fluxo
    }

    // Fallback gracioso local para Montes Claros (Origem da artesã: CEPs 39400 a 39409)
    const prefix = parseInt(cleanCep.substring(0, 5), 10);
    if (prefix >= 39400 && prefix <= 39409) {
      if (customerCityInput && (!customerCityInput.value.trim() || customerCityInput.dataset.autofilled === 'true')) {
        customerCityInput.value = 'Montes Claros / MG';
        customerCityInput.dataset.autofilled = 'true';
        updateCheckoutReadiness();
      }
    }
  };

  const updateCheckoutReadiness = () => {
    if (!btnCheckout) return false;

    if (cart.length === 0) {
      btnCheckout.disabled = true;
      if (customerDataHint) {
        customerDataHint.className = 'customer-data-hint';
        customerDataHint.textContent = 'Adicione itens à sacola para iniciar.';
      }
      return false;
    }

    const rawCep = cepInput ? cepInput.value.replace(/\D/g, '') : '';
    const hasShipping = Boolean(shippingCost > 0 || shippingMethod);
    if (rawCep.length !== 8 || !hasShipping) {
      btnCheckout.disabled = true;
      if (customerDataHint) {
        customerDataHint.className = 'customer-data-hint';
        customerDataHint.textContent = 'Informe o CEP e calcule o frete para prosseguir.';
      }
      return false;
    }

    const rawName = customerNameInput ? customerNameInput.value.trim() : '';
    const safeName = sanitizeCustomerInput(rawName, 80);
    const nameWords = safeName.split(/\s+/).filter(w => w.length >= 2);
    if (nameWords.length < 2) {
      btnCheckout.disabled = true;
      if (customerDataHint) {
        customerDataHint.className = 'customer-data-hint';
        customerDataHint.textContent = 'Informe seu Nome e Sobrenome para identificação.';
      }
      return false;
    }

    const safeStreet = sanitizeCustomerInput(customerStreetInput ? customerStreetInput.value : '', 120);
    if (safeStreet.length < 3) {
      btnCheckout.disabled = true;
      if (customerDataHint) {
        customerDataHint.className = 'customer-data-hint';
        customerDataHint.textContent = 'Informe a rua / logradouro de entrega.';
      }
      return false;
    }

    const safeNumber = sanitizeCustomerInput(customerNumberInput ? customerNumberInput.value : '', 40);
    if (safeNumber.length < 1) {
      btnCheckout.disabled = true;
      if (customerDataHint) {
        customerDataHint.className = 'customer-data-hint';
        customerDataHint.textContent = 'Informe o número da residência (ou S/N).';
      }
      return false;
    }

    const safeCity = sanitizeCustomerInput(customerCityInput ? customerCityInput.value : '', 60);
    if (safeCity.length < 3) {
      btnCheckout.disabled = true;
      if (customerDataHint) {
        customerDataHint.className = 'customer-data-hint';
        customerDataHint.textContent = 'Informe a cidade e UF para entrega.';
      }
      return false;
    }

    // Todos os dados válidos
    btnCheckout.disabled = false;
    if (customerDataHint) {
      customerDataHint.className = 'customer-data-hint valid';
      customerDataHint.textContent = 'Tudo preenchido! Pronto para finalizar no WhatsApp.';
    }
    return true;
  };

  const saveCart = () => {
    localStorage.setItem('jez_cart', JSON.stringify(cart));
  };

  const updateCartUI = () => {
    // Total de itens
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartBadge.textContent = totalItems;
    cartBadge.style.display = totalItems > 0 ? 'flex' : 'none';

    // Subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartSubtotalEl.textContent = formatCurrency(subtotal);

    // Frete e Total
    const total = subtotal + shippingCost;
    cartShippingEl.textContent = shippingCost > 0 ? formatCurrency(shippingCost) : (shippingMethod ? 'Grátis' : 'Calcule o frete');
    cartTotalEl.textContent = formatCurrency(total);

    // Renderização dos Itens
    if (cart.length === 0) {
      cartItemsContainer.style.display = 'none';
      cartEmptyState.style.display = 'block';
      if (customerInfoBox) customerInfoBox.style.display = 'none';
      btnCheckout.disabled = true;
      if (customerDataHint) {
        customerDataHint.className = 'customer-data-hint';
        customerDataHint.textContent = 'Adicione itens à sacola para iniciar.';
      }
      return;
    }

    cartItemsContainer.style.display = 'flex';
    cartEmptyState.style.display = 'none';
    if (customerInfoBox) customerInfoBox.style.display = 'flex';
    updateCheckoutReadiness();

    cartItemsContainer.innerHTML = '';
    cart.forEach(item => {
      const el = document.createElement('div');
      el.className = 'cart-item';
      const safeId = escapeHtml(item.id);
      const safeName = escapeHtml(item.name);
      const safeImage = sanitizeImageUrl(item.image);
      const safeLeadTime = parseInt(item.leadTimeDays, 10) || 7;
      const safeBadge = item.isReady ? 'Pronta Entrega' : `Produção: ${safeLeadTime}d úteis`;
      const safeQty = Math.max(1, parseInt(item.quantity, 10) || 1);

      el.innerHTML = `
        <img src="${safeImage}" alt="${safeName}" class="cart-item-img">
        <div class="cart-item-details">
          <h4 class="cart-item-title">${safeName}</h4>
          <span class="cart-item-badge">${escapeHtml(safeBadge)}</span>
          <span class="cart-item-price">${formatCurrency(item.price)}</span>
        </div>
        <div class="cart-item-controls">
          <button type="button" class="btn-remove-item" data-action="remove-cart" data-id="${safeId}" title="Remover item" aria-label="Remover ${safeName}">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
          </button>
          <div class="qty-stepper">
            <button type="button" class="qty-btn" data-action="change-qty" data-id="${safeId}" data-delta="-1" aria-label="Diminuir quantidade">−</button>
            <span class="qty-display">${safeQty}</span>
            <button type="button" class="qty-btn" data-action="change-qty" data-id="${safeId}" data-delta="1" aria-label="Aumentar quantidade">+</button>
          </div>
        </div>
      `;
      cartItemsContainer.appendChild(el);
    });
  };

  const addToCart = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingIndex = cart.findIndex(item => item.id === productId);
    if (existingIndex > -1) {
      cart[existingIndex].quantity += 1;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        isReady: product.isReady,
        leadTimeDays: product.leadTimeDays || 0,
        quantity: 1
      });
    }

    saveCart();
    updateCartUI();
    showToast(`"${product.name}" adicionado à sacola!`);
    openDrawer();
  };

  const changeQuantity = (productId, delta) => {
    const index = cart.findIndex(item => item.id === productId);
    if (index === -1) return;

    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
      cart.splice(index, 1);
    }

    saveCart();
    updateCartUI();
  };

  const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartUI();
    showToast('Peça removida da sacola.');
  };

  const openDrawer = () => {
    cartDrawerBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeDrawer = () => {
    cartDrawerBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  };

  // --------------------------------------------------------------------------
  // 7. Cálculo de Frete Dinâmico (Origem Montes Claros - MG)
  // --------------------------------------------------------------------------
  const handleCalculateShipping = () => {
    const rawCep = cepInput.value.replace(/\D/g, '');
    if (rawCep.length !== 8) {
      shippingResult.style.display = 'block';
      shippingResult.style.color = 'var(--color-primary)';
      shippingResult.innerHTML = `
        <span class="shipping-alert-msg">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
          Informe um CEP válido com 8 dígitos.
        </span>
      `;
      return;
    }

    btnCalcShipping.textContent = 'Calculando...';
    btnCalcShipping.disabled = true;
    lookupAddressByCep(rawCep);

    setTimeout(() => {
      // Simulação realista considerando origem em Montes Claros - MG (39400-000)
      const prefix = parseInt(rawCep.substring(0, 2), 10);
      let pacCost = 24.90;
      let pacDays = 5;
      let sedexCost = 42.90;
      let sedexDays = 2;

      // Se for de Minas Gerais (CEPs 30 a 39)
      if (prefix >= 30 && prefix <= 39) {
        pacCost = 16.50;
        pacDays = 3;
        sedexCost = 27.90;
        sedexDays = 1;
      } else if (prefix >= 1 && prefix <= 29) {
        // Região Sudeste (SP, RJ, ES)
        pacCost = 22.00;
        pacDays = 4;
        sedexCost = 36.50;
        sedexDays = 2;
      } else {
        // Demais regiões do Brasil
        pacCost = 32.00;
        pacDays = 7;
        sedexCost = 54.00;
        sedexDays = 3;
      }

      shippingCost = pacCost;
      shippingMethod = 'PAC';

      shippingResult.style.display = 'block';
      shippingResult.style.color = 'var(--color-badge-ready)';
      shippingResult.innerHTML = `
        <div class="shipping-option">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
          <strong>PAC:</strong> ${formatCurrency(pacCost)} (${pacDays} a ${pacDays + 2} dias úteis)
        </div>
        <div class="shipping-option">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z"></path></svg>
          <strong>SEDEX:</strong> ${formatCurrency(sedexCost)} (${sedexDays} a ${sedexDays + 1} dias úteis)
        </div>
      `;

      btnCalcShipping.textContent = 'Calcular';
      btnCalcShipping.disabled = false;
      updateCartUI();
      updateCheckoutReadiness();
    }, 500);
  };

  // Máscara de CEP automática e busca de endereço
  cepInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 8) value = value.slice(0, 8);
    const cleanCep = value;
    if (value.length > 5) {
      value = value.replace(/^(\d{5})(\d)/, '$1-$2');
    }
    e.target.value = value;
    if (cleanCep.length === 8) {
      lookupAddressByCep(cleanCep);
    }
    updateCheckoutReadiness();
  });

  // --------------------------------------------------------------------------
  // 8. Modal de Detalhes Rápido (Quick View)
  // --------------------------------------------------------------------------
  let currentModalProductId = null;

  const openQuickView = (productId) => {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    currentModalProductId = productId;
    modalImg.src = product.image;
    modalImg.alt = product.name;
    if (modalImgBlur) {
      modalImgBlur.src = product.image;
    }
    modalCategory.textContent = product.categoryLabel;
    modalTitle.textContent = product.name;
    modalPrice.textContent = formatCurrency(product.price);
    modalDesc.textContent = product.description;
    modalDimensions.textContent = product.dimensions;
    modalMaterials.textContent = product.materials;

    if (product.isReady) {
      modalBadge.className = 'product-badge badge-ready';
      modalBadge.textContent = 'Pronta Entrega';
    } else {
      modalBadge.className = 'product-badge badge-order';
      modalBadge.textContent = `Feito sob Encomenda (${product.leadTimeDays} dias úteis)`;
    }

    // Botão de WhatsApp direcionado para a peça
    const phone = '553892322411'; // WhatsApp da Jéssica (+55 38 9232-2411)
    const msg = encodeURIComponent(`Olá Jéssica! Tenho uma dúvida sobre a peça "${product.name}" que vi no site da JËZ collection.`);
    modalBtnWhatsapp.href = `https://wa.me/${phone}?text=${msg}`;

    productModalBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    productModalBackdrop.classList.remove('active');
    document.body.style.overflow = '';
    currentModalProductId = null;
  };

  // --------------------------------------------------------------------------
  // 9. Checkout & Finalização
  // --------------------------------------------------------------------------
  btnCheckout.addEventListener('click', () => {
    if (!updateCheckoutReadiness()) {
      showToast('Por favor, preencha seu nome e endereço completo para finalizar.');
      return;
    }

    const rawCep = cepInput.value.replace(/\D/g, '');
    const formattedCep = cepInput.value.trim() || (rawCep.length === 8 ? `${rawCep.slice(0, 5)}-${rawCep.slice(5)}` : '');
    const safeCustomerName = sanitizeCustomerInput(customerNameInput ? customerNameInput.value : '', 80) || 'Cliente';
    const safeStreet = sanitizeCustomerInput(customerStreetInput ? customerStreetInput.value : '', 120);
    const safeNumber = sanitizeCustomerInput(customerNumberInput ? customerNumberInput.value : '', 40);
    const safeCity = sanitizeCustomerInput(customerCityInput ? customerCityInput.value : '', 60);

    const fullAddress = `${safeStreet}, nº ${safeNumber} - ${safeCity}`;
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const total = subtotal + shippingCost;
    
    // Resumo dos itens e mensagem personalizada
    const itemsText = cart.map(i => `• ${i.quantity}x ${i.name} (${formatCurrency(i.price * i.quantity)})`).join('\n');
    let message = `Olá Jéssica! Me chamo ${safeCustomerName} e gostaria de finalizar meu pedido na JËZ Collection:\n\n${itemsText}\n\n`;
    if (shippingCost > 0) {
      message += `Frete estimado: ${formatCurrency(shippingCost)}\n`;
    }
    message += `*Total: ${formatCurrency(total)}*\n\n`;
    const pinIcon = String.fromCodePoint(0x1F4CD);
    message += `${pinIcon} Endereço de envio: ${fullAddress} — CEP ${formattedCep}\n\n`;
    message += `Como posso efetuar o pagamento via Pix?`;

    // Registra pedido em tempo real no localStorage para o Painel da Jéssica
    const newOrderId = 'JEZ-' + Math.floor(1000 + Math.random() * 9000);
    const newOrder = {
      id: newOrderId,
      date: new Date().toISOString(),
      customer: safeCustomerName,
      address: fullAddress,
      cep: formattedCep,
      items: cart.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      subtotal: subtotal,
      shipping: shippingCost,
      total: total,
      status: 'aguardando-pagamento',
      trackingCode: ''
    };
    try {
      const currentOrders = JSON.parse(localStorage.getItem('jez_orders') || '[]');
      currentOrders.unshift(newOrder);
      localStorage.setItem('jez_orders', JSON.stringify(currentOrders));
    } catch (e) {
      console.error(e);
    }

    // Sincroniza pedido em tempo real com o Cloud Firestore (Fase 2 - JEZ-021)
    if (window.jezFirebase && typeof window.jezFirebase.createOrder === 'function') {
      window.jezFirebase.createOrder(newOrder).catch(err => {
        console.warn('[JËZ Cloud] Pedido salvo localmente, pendente de sync em nuvem:', err.message);
      });
    }

    const phone = '553892322411'; // WhatsApp da Jéssica (+55 38 9232-2411)
    const whatsappUrl = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
    
    // Abre a confirmação e direcionamento
    showToast('Redirecionando para o fechamento do pedido via WhatsApp / Pix...');
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
    }, 700);
  });

  // --------------------------------------------------------------------------
  // 10. Event Listeners Globais
  // --------------------------------------------------------------------------
  // Filtros de Categoria
  filterPills.forEach(pill => {
    pill.addEventListener('click', () => {
      filterPills.forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      currentFilter = pill.dataset.filter;
      renderCatalog();
    });
  });

  // Cart Drawer
  cartButton.addEventListener('click', openDrawer);
  btnCloseDrawer.addEventListener('click', closeDrawer);
  cartDrawerBackdrop.addEventListener('click', (e) => {
    if (e.target === cartDrawerBackdrop) closeDrawer();
  });

  // Monitoramento das Entradas de Dados do Cliente
  if (customerNameInput) {
    customerNameInput.addEventListener('input', updateCheckoutReadiness);
  }
  if (customerStreetInput) {
    customerStreetInput.addEventListener('input', () => {
      delete customerStreetInput.dataset.autofilled;
      updateCheckoutReadiness();
    });
  }
  if (customerNumberInput) {
    customerNumberInput.addEventListener('input', updateCheckoutReadiness);
  }
  if (customerCityInput) {
    customerCityInput.addEventListener('input', () => {
      delete customerCityInput.dataset.autofilled;
      updateCheckoutReadiness();
    });
  }

  // Modal Rápido
  btnCloseModal.addEventListener('click', closeModal);
  productModalBackdrop.addEventListener('click', (e) => {
    if (e.target === productModalBackdrop) closeModal();
  });

  modalBtnAddCart.addEventListener('click', () => {
    if (currentModalProductId) {
      addToCart(currentModalProductId);
      closeModal();
    }
  });

  // Delegação Segura de Eventos do Catálogo (Anti-Injeção Inline)
  productsGrid.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-action]');
    if (!trigger) return;
    const action = trigger.getAttribute('data-action');
    const productId = trigger.getAttribute('data-id');
    if (action === 'quickview' && productId) {
      openQuickView(productId);
    } else if (action === 'add-cart' && productId) {
      addToCart(productId);
    }
  });

  // Delegação Segura de Eventos do Carrinho
  cartItemsContainer.addEventListener('click', (e) => {
    const trigger = e.target.closest('[data-action]');
    if (!trigger) return;
    const action = trigger.getAttribute('data-action');
    const id = trigger.getAttribute('data-id');
    if (action === 'remove-cart' && id) {
      removeFromCart(id);
    } else if (action === 'change-qty' && id) {
      const delta = parseInt(trigger.getAttribute('data-delta'), 10) || 0;
      changeQuantity(id, delta);
    }
  });

  // Modal de Privacidade & LGPD (Morgan - Cibersegurança)
  const btnOpenPrivacy = document.getElementById('btn-open-privacy');
  const privacyModalBackdrop = document.getElementById('privacy-modal-backdrop');
  const btnClosePrivacy = document.getElementById('btn-close-privacy');
  const btnPrivacyConfirm = document.getElementById('btn-privacy-confirm');

  const openPrivacyModal = () => {
    if (privacyModalBackdrop) {
      privacyModalBackdrop.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  };

  const closePrivacyModal = () => {
    if (privacyModalBackdrop) {
      privacyModalBackdrop.style.display = 'none';
      document.body.style.overflow = '';
    }
  };

  if (btnOpenPrivacy) btnOpenPrivacy.addEventListener('click', openPrivacyModal);
  if (btnClosePrivacy) btnClosePrivacy.addEventListener('click', closePrivacyModal);
  if (btnPrivacyConfirm) btnPrivacyConfirm.addEventListener('click', closePrivacyModal);
  if (privacyModalBackdrop) {
    privacyModalBackdrop.addEventListener('click', (e) => {
      if (e.target === privacyModalBackdrop) closePrivacyModal();
    });
  }

  // Tecla ESC para fechar modais
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeModal();
      closePrivacyModal();
    }
  });

  // Frete
  btnCalcShipping.addEventListener('click', handleCalculateShipping);
  cepInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleCalculateShipping();
  });

  // Header com efeito de rolagem
  window.addEventListener('scroll', () => {
    const header = document.querySelector('.site-header');
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  });

  // --------------------------------------------------------------------------
  // 11. Exposição Pública para Event Handlers em HTML Inline
  // --------------------------------------------------------------------------
  window.jezApp = {
    addToCart,
    changeQuantity,
    removeFromCart,
    openQuickView,
    openDrawer,
    closeDrawer
  };

  // --------------------------------------------------------------------------
  // 12. Renderização e Interatividade do Card Polaroid Hero (JEZ-015 - Lumi & Ariel)
  // --------------------------------------------------------------------------
  const heroFeaturedCard = document.getElementById('hero-featured-card');

  const renderHeroFeaturedCard = () => {
    if (!heroFeaturedCard) return;

    const allProducts = getProducts();
    const featuredId = localStorage.getItem('jez_featured_product_id') || 'tote-cherry';
    const featuredProduct = allProducts.find(p => p.id === featuredId) || allProducts[0];

    if (!featuredProduct) return;

    heroFeaturedCard.setAttribute('data-product-id', featuredProduct.id);
    heroFeaturedCard.setAttribute('aria-label', `Ver detalhes da peça em destaque: ${featuredProduct.name}`);

    const nameEl = document.getElementById('hero-featured-name') || heroFeaturedCard.querySelector('.hero-card-name');
    const priceEl = document.getElementById('hero-featured-price') || heroFeaturedCard.querySelector('.hero-card-price');
    const imgEl = document.getElementById('hero-featured-img') || heroFeaturedCard.querySelector('img');
    const webpEl = document.getElementById('hero-featured-webp') || heroFeaturedCard.querySelector('source[type="image/webp"]');

    if (nameEl) nameEl.textContent = featuredProduct.name;
    if (priceEl) priceEl.textContent = formatCurrency(featuredProduct.price);
    if (imgEl) {
      imgEl.src = sanitizeImageUrl(featuredProduct.image);
      imgEl.alt = `Destaque: ${featuredProduct.name}`;
    }
    if (webpEl && featuredProduct.image.startsWith('assets/')) {
      webpEl.srcset = featuredProduct.image.replace(/\.(jpg|jpeg|png)$/i, '.webp');
    }
  };

  if (heroFeaturedCard) {
    heroFeaturedCard.addEventListener('click', () => {
      const prodId = heroFeaturedCard.getAttribute('data-product-id') || 'tote-cherry';
      openQuickView(prodId);
    });

    heroFeaturedCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const prodId = heroFeaturedCard.getAttribute('data-product-id') || 'tote-cherry';
        openQuickView(prodId);
      }
    });
  }

  // Sincronização em tempo real caso a artesã edite peças ou altere o destaque em outra aba
  window.addEventListener('storage', (e) => {
    if (e.key === 'jez_catalog' || e.key === 'jez_custom_products' || e.key === 'jez_featured_product_id') {
      renderCatalog();
      renderHeroFeaturedCard();
    }
  });

  window.addEventListener('focus', () => {
    renderCatalog();
    renderHeroFeaturedCard();
  });

  // Inicialização
  renderCatalog();
  renderHeroFeaturedCard();
  updateCartUI();

  // Sincronização em Nuvem (Firebase Cloud Firestore — JEZ-021)
  const initCloudSync = () => {
    if (window.jezFirebase) {
      window.jezFirebase.onProductsChange((cloudProducts) => {
        if (Array.isArray(cloudProducts) && cloudProducts.length > 0) {
          products = cloudProducts
            .filter(p => p.status !== 'suspended' && !p.isSuspended && !p.isDeleted)
            .map(p => ({
              ...p,
              isReady: p.status ? p.status === 'ready' : (p.isReady !== undefined ? p.isReady : true)
            }));
          renderCatalog();
          renderHeroFeaturedCard();
        }
      });

      window.jezFirebase.seedInitialProductsIfEmpty(defaultProducts);

      window.jezFirebase.onFeaturedChange((featuredId) => {
        if (featuredId) {
          localStorage.setItem('jez_featured_product_id', featuredId);
          renderHeroFeaturedCard();
        }
      });
    }
  };
  initCloudSync();
});
