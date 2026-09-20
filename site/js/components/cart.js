/**
 * ==========================================================================
 * JEZ Collection — Componente e Gerenciador de Sacola (Cart)
 * Especialistas: Sam (E-Commerce) & Lumi (UI/UX)
 * Supervisão: Alex (CTO)
 * ==========================================================================
 */

import { sanitizeCustomerInput } from '../services/orders.js';

export const STORAGE_CART_KEY = 'jez_cart';

export function loadLocalCart() {
  try {
    const raw = localStorage.getItem(STORAGE_CART_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.warn('[JËZ Cart] Falha ao ler carrinho do localStorage:', err);
    return [];
  }
}

export function saveLocalCart(cartItems) {
  try {
    localStorage.setItem(STORAGE_CART_KEY, JSON.stringify(cartItems || []));
  } catch (err) {
    console.warn('[JËZ Cart] Falha ao salvar carrinho no localStorage:', err);
  }
}

export function calculateCartTotals(cart = [], shippingCost = 0) {
  const totalItems = cart.reduce((sum, item) => sum + (Number(item.quantity) || 0), 0);
  const subtotal = cart.reduce((sum, item) => sum + ((Number(item.price) || 0) * (Number(item.quantity) || 0)), 0);
  const total = subtotal + (Number(shippingCost) || 0);
  return { totalItems, subtotal, total };
}

export function checkStockAvailability(product, additionalQty = 1, currentQtyInCart = 0) {
  if (!product) return { canAdd: false, message: 'Peça não encontrada.' };

  const isSoldOut = Boolean(product.isReady) && Number(product.stockQty !== undefined ? product.stockQty : 1) <= 0;
  if (isSoldOut) {
    return {
      canAdd: false,
      message: `A peça "${product.name}" está esgotada no momento.`
    };
  }

  const availableStock = (product.stockQty !== undefined && product.stockQty !== null)
    ? Number(product.stockQty)
    : (product.isReady ? 1 : 999);

  if (product.isReady && (currentQtyInCart + additionalQty > availableStock)) {
    return {
      canAdd: false,
      availableStock,
      message: `Limite de estoque: apenas ${availableStock} unidade(s) disponível(is) para pronta entrega.`
    };
  }

  return { canAdd: true, availableStock };
}

export function calculateShippingQuote(rawCep) {
  const clean = (rawCep || '').replace(/\D/g, '');
  if (clean.length !== 8) return null;

  const prefix = parseInt(clean.substring(0, 2), 10);
  let pacCost = 24.90;
  let pacDays = 5;
  let sedexCost = 42.90;
  let sedexDays = 2;

  // Minas Gerais (CEPs 30 a 39)
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

  return {
    pac: { cost: pacCost, days: pacDays },
    sedex: { cost: sedexCost, days: sedexDays }
  };
}

export function validateCheckoutFields({
  rawName = '',
  rawContact = '',
  rawStreet = '',
  rawNumber = '',
  rawCity = '',
  rawCep = '',
  hasShipping = false,
  cartLength = 0
}) {
  if (cartLength === 0) {
    return { valid: false, message: 'Adicione itens à sacola para iniciar.' };
  }

  const cleanCep = (rawCep || '').replace(/\D/g, '');
  if (cleanCep.length !== 8 || !hasShipping) {
    return { valid: false, message: 'Informe o CEP e calcule o frete para prosseguir.' };
  }

  const safeName = sanitizeCustomerInput(rawName, 80);
  const nameWords = safeName.split(/\s+/).filter(w => w.length >= 2);
  if (nameWords.length < 2) {
    return { valid: false, message: 'Informe seu Nome e Sobrenome para identificação.' };
  }

  const safeContact = sanitizeCustomerInput(rawContact, 80);
  const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(safeContact);
  const digitsOnly = safeContact.replace(/\D/g, '');
  const isPhone = digitsOnly.length >= 10;
  if (!isEmail && !isPhone) {
    return { valid: false, message: 'Informe um WhatsApp com DDD válido ou e-mail de contato.' };
  }

  const safeStreet = sanitizeCustomerInput(rawStreet, 120);
  if (safeStreet.length < 3) {
    return { valid: false, message: 'Informe a rua / logradouro de entrega.' };
  }

  const safeNumber = sanitizeCustomerInput(rawNumber, 40);
  if (safeNumber.length < 1) {
    return { valid: false, message: 'Informe o número da residência (ou S/N).' };
  }

  const safeCity = sanitizeCustomerInput(rawCity, 60);
  if (safeCity.length < 3) {
    return { valid: false, message: 'Informe a cidade e UF para entrega.' };
  }

  return {
    valid: true,
    safeName,
    safeContact,
    safeStreet,
    safeNumber,
    safeCity,
    message: 'Tudo preenchido! Pronto para finalizar no WhatsApp.'
  };
}
