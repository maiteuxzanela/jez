/**
 * ==========================================================================
 * JEZ Collection — Componente de Card de Produto da Vitrine (JEZ-032)
 * Especialistas: Lumi (UI/UX Boutique) & Sam (E-Commerce)
 * Supervisão: Alex (CTO) & Ariel (Direção de Arte)
 * ==========================================================================
 */

import { isProductSoldOut } from '../services/products.js';
import { isVideoUrl, hasVideoMedia } from '../services/media-performance.js';

export function escapeHtml(unsafe) {
  if (unsafe === null || unsafe === undefined) return '';
  return String(unsafe)
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
  let primaryCandidate = p.image;
  if (isVideoUrl(primaryCandidate)) {
    if (p.poster) {
      primaryCandidate = p.poster;
    } else if (Array.isArray(p.images)) {
      const firstStatic = p.images.find(img => !isVideoUrl(img));
      if (firstStatic) {
        primaryCandidate = typeof firstStatic === 'object' ? (firstStatic.poster || firstStatic.url) : firstStatic;
      } else {
        primaryCandidate = 'assets/products/tote_cherry.jpg';
      }
    } else {
      primaryCandidate = 'assets/products/tote_cherry.jpg';
    }
  }
  const safeImage = sanitizeImageUrl(primaryCandidate);
  const safeLeadTime = parseInt(p.leadTimeDays, 10) || 7;

  const productImages = (Array.isArray(p.images) && p.images.length > 0) ? p.images : [p.image];
  const hasVideo = hasVideoMedia(productImages) || isVideoUrl(p.image) || Boolean(p.hasVideo) || Boolean(p.videoUrl);

  let secondaryUrl = '';
  if (productImages.length > 1) {
    const secondaryCandidate = productImages[1];
    if (typeof secondaryCandidate === 'object' && secondaryCandidate.poster) {
      secondaryUrl = sanitizeImageUrl(secondaryCandidate.poster);
    } else if (typeof secondaryCandidate === 'string' && !isVideoUrl(secondaryCandidate)) {
      secondaryUrl = sanitizeImageUrl(secondaryCandidate);
    }
  }
  const hasSecondary = Boolean(secondaryUrl);
  const secondaryImage = secondaryUrl;

  let badgeHtml = '';
  if (isSoldOut) {
    badgeHtml = `<span class="product-badge badge-sold-out">Esgotada</span>`;
  } else if (p.isReady) {
    badgeHtml = `<span class="product-badge badge-ready">Pronta Entrega</span>`;
  } else {
    badgeHtml = `<span class="product-badge badge-order">Sob Encomenda (${safeLeadTime}d)</span>`;
  }

  const videoBadgeHtml = hasVideo
    ? `<span class="product-badge-video" aria-label="Contém vídeo em loop dos detalhes">
        <svg class="jez-craft-icon jez-icon-video-loop" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3" ry="3"></rect><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" fill-opacity="0.25"></polygon><line x1="6" y1="4" x2="6" y2="7"></line><line x1="6" y1="17" x2="6" y2="20"></line><line x1="18" y1="4" x2="18" y2="7"></line><line x1="18" y1="17" x2="18" y2="20"></line></svg>
        Vídeo
      </span>`
    : '';

  const isLocalAsset = safeImage.startsWith('assets/');
  const webpCandidate = isLocalAsset ? safeImage.replace(/\.(jpg|jpeg|png)$/i, '.webp') : '';
  const imageMarkup = isLocalAsset
    ? `<picture>
        <source srcset="${escapeHtml(webpCandidate)}" type="image/webp">
        <img src="${escapeHtml(safeImage)}" class="product-img-primary" alt="${safeName}" loading="lazy" width="400" height="400">
      </picture>`
    : `<img src="${escapeHtml(safeImage)}" class="product-img-primary" alt="${safeName}" loading="lazy" width="400" height="400">`;

  const secondaryMarkup = hasSecondary
    ? `<img src="${escapeHtml(secondaryImage)}" class="product-img-secondary" alt="${safeName} - Detalhe" loading="lazy" width="400" height="400">`
    : '';

  const btnBuyHtml = isSoldOut
    ? `<button type="button" class="btn-add-cart is-disabled" id="btn-add-${safeId}" disabled aria-disabled="true" data-id="${safeId}">
        Esgotada
      </button>`
    : `<button type="button" class="btn-add-cart" id="btn-add-${safeId}" data-action="add-cart" data-id="${safeId}">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" aria-hidden="true"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
        Comprar
      </button>`;

  const cardContent = `
    <div class="product-image-wrap ${hasSecondary ? 'has-secondary-image' : ''}" data-action="quickview" data-id="${safeId}">
      ${imageMarkup}
      ${secondaryMarkup}
      ${badgeHtml}
      ${videoBadgeHtml}
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
  card.innerHTML = cardContent; // needle-ignore: XSS_INNER_HTML (conteudo sanitizado via escapeHtml)

  return card;
}

export function createProductSkeletonElement(customDoc = null) {
  const doc = customDoc || (typeof document !== 'undefined' ? document : null);
  if (!doc) {
    return {
      className: 'product-card-skeleton',
      getAttribute: (attr) => (attr === 'aria-hidden' ? 'true' : null),
      innerHTML: ''
    };
  }
  const card = doc.createElement('article');
  card.className = 'product-card-skeleton';
  card.setAttribute('aria-hidden', 'true');
  card.innerHTML = `
    <div class="skeleton-image-wrap skeleton-shimmer"></div>
    <div class="skeleton-info">
      <div class="skeleton-line category skeleton-shimmer"></div>
      <div class="skeleton-line title skeleton-shimmer"></div>
      <div class="skeleton-line meta skeleton-shimmer"></div>
      <div class="skeleton-footer">
        <div class="skeleton-line price skeleton-shimmer"></div>
        <div class="skeleton-line button skeleton-shimmer"></div>
      </div>
    </div>
  `;
  return card;
}
