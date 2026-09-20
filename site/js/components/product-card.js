/**
 * ==========================================================================
 * JEZ Collection — Componente de Card de Produto da Vitrine
 * Especialistas: Lumi (UI/UX Boutique) & Sam (E-Commerce)
 * ==========================================================================
 */

import { isProductSoldOut } from '../services/products.js';

export function escapeHtml(unsafe) {
  if (typeof unsafe !== 'string') return '';
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

export function sanitizeImageUrl(url) {
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
}

export function formatCurrency(val) {
  const num = Number(val) || 0;
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

export function createProductCardElement(p) {
  const isSoldOut = isProductSoldOut(p);
  const card = document.createElement('article');
  card.className = `product-card ${isSoldOut ? 'is-sold-out' : ''}`;
  card.id = `card-${escapeHtml(p.id)}`;

  const safeId = escapeHtml(p.id);
  const safeName = escapeHtml(p.name);
  const safeCategory = escapeHtml(p.categoryLabel || 'Peça Autoral');
  const safeMaterials = escapeHtml(p.materials || '');
  const safeImage = sanitizeImageUrl(p.image);
  const safeLeadTime = parseInt(p.leadTimeDays, 10) || 7;

  const productImages = (Array.isArray(p.images) && p.images.length > 0) ? p.images : [p.image];
  const hasSecondary = productImages.length > 1;
  const secondaryImage = hasSecondary ? sanitizeImageUrl(productImages[1]) : '';

  let badgeHtml = '';
  if (isSoldOut) {
    badgeHtml = `<span class="product-badge badge-sold-out">Esgotada</span>`;
  } else if (p.isReady) {
    badgeHtml = `<span class="product-badge badge-ready">Pronta Entrega</span>`;
  } else {
    badgeHtml = `<span class="product-badge badge-order">Sob Encomenda (${safeLeadTime}d)</span>`;
  }

  const isLocalAsset = safeImage.startsWith('assets/');
  const webpCandidate = isLocalAsset ? safeImage.replace(/\.(jpg|jpeg|png)$/i, '.webp') : '';
  const imageMarkup = isLocalAsset
    ? `<picture>
        <source srcset="${webpCandidate}" type="image/webp">
        <img src="${safeImage}" class="product-img-primary" alt="${safeName}" loading="lazy" width="400" height="400">
      </picture>`
    : `<img src="${safeImage}" class="product-img-primary" alt="${safeName}" loading="lazy" width="400" height="400">`;

  const secondaryMarkup = hasSecondary
    ? `<img src="${secondaryImage}" class="product-img-secondary" alt="${safeName} - Detalhe" loading="lazy" width="400" height="400">`
    : '';

  const btnBuyHtml = isSoldOut
    ? `<button type="button" class="btn-add-cart is-disabled" id="btn-add-${safeId}" disabled aria-disabled="true" data-id="${safeId}">
        Esgotada
      </button>`
    : `<button type="button" class="btn-add-cart" id="btn-add-${safeId}" data-action="add-cart" data-id="${safeId}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        Comprar
      </button>`;

  card.innerHTML = `
    <div class="product-image-wrap ${hasSecondary ? 'has-secondary-image' : ''}" data-action="quickview" data-id="${safeId}">
      ${imageMarkup}
      ${secondaryMarkup}
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
        ${btnBuyHtml}
      </div>
    </div>
  `;

  return card;
}
