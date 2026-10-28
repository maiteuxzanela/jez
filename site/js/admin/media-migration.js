/**
 * ==========================================================================
 * JEZ Collection — Migracao em Lote do Acervo para WebP Retina (JEZ-042)
 * Merchant & Acervo: Cris | Arquitetura: Alex (CTO)
 * ==========================================================================
 *
 * Rotina idempotente que percorre o acervo ja persistido (localStorage e/ou
 * Firestore) e:
 *   1. converte fotos Base64 legadas (JPEG/PNG) para WebP Retina 800px / 0.82
 *      usando o compressor Canvas nativo (sem WASM e sem dependencias externas);
 *   2. remapeia ativos fotograficos de fabrica publicados em .webp para o
 *      catalogo padrao migrado.
 * Midias de video e uploads que ja estao em WebP nunca sao tocados.
 */

import { compressImageDataUrl } from './image-compression.js';
import { defaultInitialCatalog } from './catalog.js';

/**
 * Extrai todas as midias (imagem, galeria, poster) de um item de catalogo.
 * @param {object} piece
 * @returns {string[]}
 */
function collectPieceMediaUrls(piece) {
  if (!piece || typeof piece !== 'object') return [];
  const urls = [];
  const addMedia = (media) => {
    if (!media) return;
    if (typeof media === 'string') {
      urls.push(media);
      return;
    }
    if (typeof media === 'object') {
      if (typeof media.url === 'string') urls.push(media.url);
      if (typeof media.poster === 'string') urls.push(media.poster);
    }
  };
  addMedia(piece.image);
  if (typeof piece.poster === 'string') urls.push(piece.poster);
  if (Array.isArray(piece.images)) piece.images.forEach(addMedia);
  return urls;
}

/**
 * Mapa idempotente dos ativos fotograficos de fabrica publicados em WebP.
 * Derivado do catalogo padrao real: cada chave e o caminho legado .jpg e o
 * valor e o ativo .webp correspondente ja existente em assets/products/.
 * @param {Array} [catalogList]
 * @returns {Map<string, string>}
 */
export function buildFactoryWebpLegacyMap(catalogList = defaultInitialCatalog) {
  const map = new Map();
  if (!Array.isArray(catalogList)) return map;
  catalogList.forEach(piece => {
    collectPieceMediaUrls(piece).forEach(url => {
      if (typeof url !== 'string' || !/\.webp$/i.test(url)) return;
      map.set(url.replace(/\.webp$/i, '.jpg'), url);
    });
  });
  return map;
}

const FACTORY_WEBP_LEGACY_MAP = buildFactoryWebpLegacyMap(defaultInitialCatalog);

/**
 * Converte um caminho de ativo de fabrica legado (.jpg) no WebP publicado.
 * URLs de upload real (Base64, blob, http) jamais sao alteradas aqui.
 * @param {string} url
 * @returns {string}
 */
export function remapFactoryAssetUrl(url) {
  if (typeof url !== 'string') return url;
  const trimmed = url.trim();
  if (!/^assets\/products\//i.test(trimmed)) return url;
  return FACTORY_WEBP_LEGACY_MAP.get(trimmed) || url;
}

/**
 * Detecta uma imagem Base64 legada que ainda nao esta em WebP.
 * @param {string | object} media
 * @returns {boolean}
 */
export function isLegacyJpegMedia(media) {
  const url = typeof media === 'string'
    ? media
    : (media && typeof media.url === 'string' ? media.url : '');
  if (!url) return false;
  const lower = url.trim().toLowerCase();
  if (!lower.startsWith('data:image/')) return false;
  return !lower.startsWith('data:image/webp');
}

/**
 * Otimiza uma unica entrada de midia (string ou objeto), aplicando:
 * 1. conversao Canvas 800px / 0.82 para Base64 legado que nao seja WebP;
 * 2. remapeamento de ativos de fabrica .jpg para o .webp publicado.
 * @param {string | object} media
 * @param {Function} convertDataUrl
 * @returns {Promise<{ media: string | object, converted: boolean, remapped: boolean, failed: boolean }>}
 */
async function optimizeMediaEntry(media, convertDataUrl) {
  if (typeof media === 'string') {
    if (isLegacyJpegMedia(media)) {
      const output = await convertDataUrl(media, 800, 800, 0.82);
      if (typeof output === 'string' && output.trim().toLowerCase().startsWith('data:image/webp')) {
        return { media: output, converted: true, remapped: false, failed: false };
      }
      return { media, converted: false, remapped: false, failed: true };
    }
    const remappedUrl = remapFactoryAssetUrl(media);
    return { media: remappedUrl, converted: false, remapped: remappedUrl !== media, failed: false };
  }

  if (media && typeof media === 'object') {
    const next = { ...media };
    let converted = false;
    let remapped = false;
    let failed = false;

    if (typeof next.url === 'string') {
      if (isLegacyJpegMedia(next.url)) {
        const output = await convertDataUrl(next.url, 800, 800, 0.82);
        if (typeof output === 'string' && output.trim().toLowerCase().startsWith('data:image/webp')) {
          next.url = output;
          converted = true;
        } else {
          failed = true;
        }
      } else {
        const remappedUrl = remapFactoryAssetUrl(next.url);
        if (remappedUrl !== next.url) {
          next.url = remappedUrl;
          remapped = true;
        }
      }
    }

    if (typeof next.poster === 'string') {
      const remappedPoster = remapFactoryAssetUrl(next.poster);
      if (remappedPoster !== next.poster) {
        next.poster = remappedPoster;
        remapped = true;
      }
    }

    return { media: converted || remapped ? next : media, converted, remapped, failed };
  }

  return { media, converted: false, remapped: false, failed: false };
}

/**
 * Migracao em lote e idempotente do acervo persistido para WebP Retina.
 * Nao toca em midias de video nem em uploads que ja sejam WebP.
 * @param {Array} catalogList
 * @param {object} [options]
 * @param {Function} [options.convertDataUrl] Compressor Canvas (default: compressImageDataUrl)
 * @param {Function} [options.onProgress]
 * @returns {Promise<{ catalog: Array, total: number, scanned: number, converted: number, remapped: number, failed: number, updated: boolean }>}
 */
export async function optimizeStoredProductsMedia(catalogList, options = {}) {
  const convertDataUrl = typeof options.convertDataUrl === 'function'
    ? options.convertDataUrl
    : compressImageDataUrl;
  const onProgress = typeof options.onProgress === 'function' ? options.onProgress : null;
  const source = Array.isArray(catalogList) ? catalogList : [];

  const nextCatalog = [];
  let converted = 0;
  let remapped = 0;
  let failed = 0;
  let scanned = 0;

  for (let index = 0; index < source.length; index++) {
    const piece = source[index];
    if (piece && typeof piece === 'object') {
      scanned++;
      const next = { ...piece };
      let changed = false;

      const cover = await optimizeMediaEntry(next.image, convertDataUrl);
      if (cover.converted) {
        next.image = cover.media;
        converted++;
        changed = true;
      } else if (cover.remapped) {
        next.image = cover.media;
        remapped++;
        changed = true;
      } else if (cover.failed) {
        failed++;
      }

      if (Array.isArray(next.images)) {
        const images = [];
        for (const entry of next.images) {
          const result = await optimizeMediaEntry(entry, convertDataUrl);
          images.push(result.media);
          if (result.converted) {
            converted++;
            changed = true;
          } else if (result.remapped) {
            remapped++;
            changed = true;
          } else if (result.failed) {
            failed++;
          }
        }
        next.images = images;
      }

      if (typeof next.poster === 'string') {
        const remappedPoster = remapFactoryAssetUrl(next.poster);
        if (remappedPoster !== next.poster) {
          next.poster = remappedPoster;
          remapped++;
          changed = true;
        }
      }

      nextCatalog.push(changed ? next : piece);
    } else {
      nextCatalog.push(piece);
    }

    if (onProgress) {
      onProgress({
        processed: index + 1,
        total: source.length,
        converted,
        remapped,
        failed
      });
    }
  }

  return {
    catalog: nextCatalog,
    total: source.length,
    scanned,
    converted,
    remapped,
    failed,
    updated: converted + remapped > 0
  };
}
