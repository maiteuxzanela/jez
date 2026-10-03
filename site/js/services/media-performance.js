/**
 * ==========================================================================
 * JEZ Collection — Servico de Performance e Gestao de Midias (JEZ-032)
 * Especialista: Noa (Performance Web & SEO)
 * Supervisao: Alex (CTO)
 * ==========================================================================
 * Regras estritas de performance, prevencao de CLS e salvaguarda das
 * cotas gratuitas diarias do Firebase Storage (Plano Spark: 1 GB/dia).
 * Diretriz inegociavel: ZERO EMOJIS em todo o modulo.
 */

// Limite maximo absoluto de arquivo de video para preservacao de cotas (4 MB)
export const MAX_VIDEO_FILE_SIZE_BYTES = 4 * 1024 * 1024;

// Duracao recomendada maxima para loops curtos de croche (em segundos)
export const RECOMMENDED_MAX_DURATION_SECONDS = 15;

// Cota diaria maxima de download do plano Spark do Firebase Storage (em MB)
export const FIREBASE_STORAGE_DAILY_EGRESS_QUOTA_MB = 1024;

// Tipos MIME de video homologados para o acervo
export const SUPPORTED_VIDEO_MIME_TYPES = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/ogg',
  'video/x-m4v'
];

/**
 * Determina deterministicamente se uma URL ou objeto representa um video.
 * @param {string | object} media
 * @returns {boolean}
 */
export function isVideoUrl(media) {
  if (!media) return false;

  if (typeof media === 'object') {
    if (media.type === 'video' || media.isVideo === true) {
      return true;
    }
    if (typeof media.url === 'string') {
      return isVideoUrl(media.url);
    }
    return false;
  }

  if (typeof media !== 'string') return false;

  const clean = media.trim().toLowerCase();
  if (clean.startsWith('data:video/')) return true;
  if (clean.startsWith('blob:video') || clean.includes('mediatype=video')) return true;

  // Regex para extensoes de video compativeis com HTML5
  return /\.(mp4|webm|mov|ogg|m4v)(\?.*)?$/i.test(clean);
}

/**
 * Verifica se um conjunto de midias contem ao menos um video em loop.
 * @param {Array<string | object>} mediaList
 * @returns {boolean}
 */
export function hasVideoMedia(mediaList) {
  if (!Array.isArray(mediaList) || mediaList.length === 0) return false;
  return mediaList.some(item => isVideoUrl(item));
}

/**
 * Normaliza um item de midia (string legada ou objeto) para estrutura uniforme.
 * @param {string | object} item
 * @param {string} fallbackPoster
 * @returns {{ type: 'video' | 'image', url: string, poster: string, alt: string }}
 */
export function normalizeMediaItem(item, fallbackPoster = '') {
  const safeFallback = typeof fallbackPoster === 'string' ? fallbackPoster.trim() : '';

  if (!item) {
    return {
      type: 'image',
      url: '',
      poster: safeFallback,
      alt: ''
    };
  }

  if (typeof item === 'string') {
    const isVid = isVideoUrl(item);
    return {
      type: isVid ? 'video' : 'image',
      url: item.trim(),
      poster: isVid ? safeFallback : '',
      alt: ''
    };
  }

  if (typeof item === 'object') {
    const isVid = item.type === 'video' || item.isVideo === true || isVideoUrl(item.url);
    const poster = typeof item.poster === 'string' && item.poster.trim() ? item.poster.trim() : safeFallback;
    return {
      type: isVid ? 'video' : 'image',
      url: typeof item.url === 'string' ? item.url.trim() : '',
      poster: isVid ? poster : '',
      alt: typeof item.alt === 'string' ? item.alt.trim() : ''
    };
  }

  return {
    type: 'image',
    url: '',
    poster: safeFallback,
    alt: ''
  };
}

/**
 * Valida se um arquivo de video cumpre a cota de tamanho e formato antes do upload.
 * Impede exaustao da cota de 1 GB do Firebase Storage.
 * @param {File | Blob} file
 * @returns {{ valid: boolean, error: string | null, sizeMb: number }}
 */
export function validateVideoUploadQuota(file) {
  if (!file) {
    return {
      valid: false,
      error: 'Nenhum arquivo de video foi fornecido para validacao.',
      sizeMb: 0
    };
  }

  const size = Number(file.size) || 0;
  const sizeMb = Number((size / (1024 * 1024)).toFixed(2));

  // Valida tamanho maximo de 4 MB
  if (size > MAX_VIDEO_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `O video possui ${sizeMb} MB e ultrapassa o limite maximo de 4 MB para preservacao da cota gratuita do Firebase.`,
      sizeMb
    };
  }

  // Valida tipo MIME se fornecido
  if (file.type && !SUPPORTED_VIDEO_MIME_TYPES.includes(file.type.toLowerCase())) {
    return {
      valid: false,
      error: 'Formato de video nao suportado. Utilize arquivos MP4 (H.264) ou WebM.',
      sizeMb
    };
  }

  return {
    valid: true,
    error: null,
    sizeMb
  };
}

/**
 * Verifica se a reproducao automatica de video e recomendada no ambiente do cliente.
 * Respeita acessibilidade (prefers-reduced-motion) e economia de franquia de dados móveis.
 * @returns {boolean}
 */
export function shouldAutoplayMotion() {
  if (typeof window === 'undefined') return false;

  try {
    // Respeita a diretriz de acessibilidade do usuario para reducao de movimento
    if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      return false;
    }

    // Respeita modo de economia de dados do navegador (Save-Data)
    if (navigator && navigator.connection && navigator.connection.saveData === true) {
      return false;
    }
  } catch (err) {
    // Em caso de excecao defensiva, retorna true por padrao
    return true;
  }

  return true;
}

/**
 * Gera o markup HTML5 para o elemento de video otimizado para o Quick View.
 * Contem todos os atributos mandatorios de performance, acessibilidade e prevencao de CLS.
 * @param {object} options
 * @returns {string}
 */
export function createOptimizedVideoMarkup(options = {}) {
  const {
    url = '',
    poster = '',
    alt = 'Video em loop dos detalhes artesanais da peca',
    className = 'modal-video-element',
    preload = 'metadata',
    loop = true,
    muted = true,
    playsinline = true,
    autoplay = true,
    width = 400,
    height = 400
  } = options;

  const safeUrl = String(url || '').replace(/"/g, '&quot;');
  const safePoster = String(poster || '').replace(/"/g, '&quot;');
  const safeAlt = String(alt || '').replace(/"/g, '&quot;');
  const safeClass = String(className || '').replace(/"/g, '&quot;');
  const safePreload = ['metadata', 'none', 'auto'].includes(preload) ? preload : 'metadata';

  const autoplayAttr = autoplay ? 'autoplay' : '';
  const loopAttr = loop ? 'loop' : '';
  const mutedAttr = muted ? 'muted' : '';
  const playsinlineAttr = playsinline ? 'playsinline' : '';
  const posterAttr = safePoster ? `poster="${safePoster}"` : '';

  return `<video class="${safeClass}" ${autoplayAttr} ${loopAttr} ${mutedAttr} ${playsinlineAttr} preload="${safePreload}" ${posterAttr} aria-label="${safeAlt}" width="${width}" height="${height}">
  <source src="${safeUrl}" type="video/mp4">
  Seu navegador nao suporta reproducao de video HTML5.
</video>`.replace(/\s+/g, ' ').trim();
}

/**
 * Pausa a reproducao e interrompe o consumo de buffer do elemento de video.
 * Evita vazamento de banda e consumo residual da cota do Firebase Storage.
 * @param {HTMLVideoElement | HTMLElement | null} videoEl
 */
export function cleanupVideoPlayback(videoEl) {
  if (!videoEl || typeof videoEl.pause !== 'function') return;

  try {
    videoEl.pause();
    // Reseta tempo de reproducao para inicio do loop
    videoEl.currentTime = 0;
  } catch (err) {
    // Falha silenciosa defensiva tratada
    if (typeof console !== 'undefined' && typeof console.debug === 'function') {
      console.debug('[JËZ Media] Erro ao interromper buffer de video:', err);
    }
  }
}

if (typeof window !== 'undefined') {
  window.jezMediaPerformance = {
    MAX_VIDEO_FILE_SIZE_BYTES,
    RECOMMENDED_MAX_DURATION_SECONDS,
    FIREBASE_STORAGE_DAILY_EGRESS_QUOTA_MB,
    SUPPORTED_VIDEO_MIME_TYPES,
    isVideoUrl,
    hasVideoMedia,
    normalizeMediaItem,
    validateVideoUploadQuota,
    shouldAutoplayMotion,
    createOptimizedVideoMarkup,
    cleanupVideoPlayback
  };
}
