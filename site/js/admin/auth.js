/**
 * ==========================================================================
 * JEZ Collection — Módulo de Autenticação e Segurança do Ateliê (JEZ-030)
 * Arquitetura: Alex (CTO) | Cibersegurança & LGPD: Morgan
 * ==========================================================================
 */

export const STORAGE_SESSION_KEY = 'jez_admin_session';
export const STORAGE_ATTEMPTS_KEY = 'jez_login_attempts';

// Hash SHA-256 da chave de acesso mestre da Jéssica ('atelie2026')
export const HASH_MASTER_PASSWORD = '3ec583f48c630ea4e2c7ef915480e1e0fe6fa96225b9affcb5d4feefd0e42711';
export const SESSION_DURATION_MS = 4 * 60 * 60 * 1000; // 4 horas
export const MAX_FAILED_ATTEMPTS = 5;
export const LOCKOUT_DURATION_MS = 5 * 60 * 1000; // 5 minutos de bloqueio temporário por Morgan

/**
 * Calcula o hash SHA-256 de uma string utilizando a Web Crypto API nativa do navegador
 * @param {string} text
 * @returns {Promise<string>} hash hexadecimal de 64 caracteres
 */
export async function sha256Hex(text) {
  const encoder = new TextEncoder();
  const data = encoder.encode(text);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

/**
 * Verifica se existe uma sessão administrativa válida e não expirada em sessionStorage
 * @returns {boolean}
 */
export function hasValidSession() {
  try {
    const raw = sessionStorage.getItem(STORAGE_SESSION_KEY);
    if (!raw) return false;
    const session = JSON.parse(raw);
    if (!session || !session.token || !session.expiresAt) return false;
    if (Date.now() > session.expiresAt) {
      sessionStorage.removeItem(STORAGE_SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    sessionStorage.removeItem(STORAGE_SESSION_KEY);
    return false;
  }
}

/**
 * Cria nova sessão com token criptográfico e validade de 4 horas
 * @returns {object} Dados da sessão criada
 */
export function createSession() {
  const randomBytes = new Uint8Array(16);
  crypto.getRandomValues(randomBytes);
  const tokenHex = Array.from(randomBytes).map(b => b.toString(16).padStart(2, '0')).join('');
  const sessionData = {
    token: 'jez_' + tokenHex,
    createdAt: Date.now(),
    expiresAt: Date.now() + SESSION_DURATION_MS
  };
  sessionStorage.setItem(STORAGE_SESSION_KEY, JSON.stringify(sessionData));
  return sessionData;
}

/**
 * Destrói a sessão atual em sessionStorage
 */
export function destroySession() {
  sessionStorage.removeItem(STORAGE_SESSION_KEY);
}

/**
 * Retorna o estado atual de tentativas e eventual bloqueio temporário
 * @returns {{ attempts: number, lockedUntil: number | null }}
 */
export function getLockoutState() {
  try {
    const raw = localStorage.getItem(STORAGE_ATTEMPTS_KEY);
    if (!raw) return { attempts: 0, lockedUntil: null };
    const state = JSON.parse(raw);
    if (state.lockedUntil && Date.now() < state.lockedUntil) {
      return state;
    }
    if (state.lockedUntil && Date.now() >= state.lockedUntil) {
      localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
      return { attempts: 0, lockedUntil: null };
    }
    return state;
  } catch {
    return { attempts: 0, lockedUntil: null };
  }
}

/**
 * Registra uma tentativa falha de autenticação contra força bruta
 * @returns {{ attempts: number, lockedUntil: number | null }}
 */
export function recordFailedAttempt() {
  const state = getLockoutState();
  const newAttempts = (state.attempts || 0) + 1;
  let lockedUntil = null;
  if (newAttempts >= MAX_FAILED_ATTEMPTS) {
    lockedUntil = Date.now() + LOCKOUT_DURATION_MS;
  }
  localStorage.setItem(STORAGE_ATTEMPTS_KEY, JSON.stringify({
    attempts: newAttempts,
    lockedUntil
  }));
  return { attempts: newAttempts, lockedUntil };
}

/**
 * Redefine o histórico de tentativas após login bem-sucedido
 */
export function resetLoginAttempts() {
  localStorage.removeItem(STORAGE_ATTEMPTS_KEY);
}
