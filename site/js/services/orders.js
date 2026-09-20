/**
 * ==========================================================================
 * JEZ Collection — Serviço de Gestão de Pedidos e Despacho
 * Especialistas: Sam (E-Commerce) & Cris (Merchant)
 * Supervisão: Alex (CTO)
 * ==========================================================================
 */

export const JESSICA_WHATSAPP = '553892322411';

export function sanitizeCustomerInput(val, maxLen = 100) {
  if (typeof val !== 'string') return '';
  return val
    .replace(/[<>'"&]/g, '')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, maxLen);
}

export function validateCustomerContact(contact) {
  const clean = sanitizeCustomerInput(contact, 80);
  if (!clean) return { valid: false, safeContact: '', type: 'invalid' };
  
  const digitsOnly = clean.replace(/\D/g, '');
  if (digitsOnly.length >= 10 && digitsOnly.length <= 13) {
    return { valid: true, safeContact: clean, type: 'whatsapp' };
  }
  
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(clean)) {
    return { valid: true, safeContact: clean, type: 'email' };
  }
  
  return { valid: false, safeContact: clean, type: 'invalid' };
}

export async function fetchAddressByCep(cleanCep) {
  if (!cleanCep || cleanCep.length !== 8) return null;
  
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
        return {
          street: data.bairro ? `${data.logradouro} - ${data.bairro}` : (data.logradouro || ''),
          city: data.uf ? `${data.localidade} / ${data.uf}` : (data.localidade || ''),
          raw: data
        };
      }
    }
  } catch (err) {
    // Timeout ou erro de rede tratado silenciosamente
  }

  // Fallback para Montes Claros (Origem da artesã: CEPs 39400 a 39409)
  const prefix = parseInt(cleanCep.substring(0, 5), 10);
  if (prefix >= 39400 && prefix <= 39409) {
    return {
      street: '',
      city: 'Montes Claros / MG',
      isOriginFallback: true
    };
  }

  return null;
}

export function formatWhatsAppOrderMessage({
  safeCustomerName = 'Cliente',
  cart = [],
  shippingCost = 0,
  total = 0,
  safeContact = '',
  fullAddress = '',
  formattedCep = '',
  formatCurrency = (v) => `R$ ${Number(v).toFixed(2).replace('.', ',')}`
}) {
  const itemsText = cart.map(i => `• ${i.quantity}x ${i.name} (${formatCurrency(i.price * i.quantity)})`).join('\n');
  let message = `Olá Jéssica! Me chamo ${safeCustomerName} e gostaria de finalizar meu pedido na JËZ Collection:\n\n${itemsText}\n\n`;
  if (shippingCost > 0) {
    message += `Frete estimado: ${formatCurrency(shippingCost)}\n`;
  }
  message += `*Total: ${formatCurrency(total)}*\n\n`;
  if (safeContact) {
    message += `Contato: ${safeContact}\n`;
  }
  message += `Endereço de envio: ${fullAddress} — CEP ${formattedCep}\n\n`;
  message += `Como posso efetuar o pagamento via Pix?`;
  return message;
}
