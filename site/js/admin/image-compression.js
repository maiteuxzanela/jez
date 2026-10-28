/**
 * ==========================================================================
 * JEZ Collection — Módulo de Compressão de Imagens Client-Side (JEZ-030 / JEZ-041)
 * Arquitetura: Alex (CTO) | Performance: Noa
 * ==========================================================================
 */

/**
 * Renderiza uma imagem ja decodificada em Canvas e devolve o Data URL otimizado.
 * WebP Retina 800px / 0.82 como formato principal, com fallback defensivo para JPEG.
 * @param {HTMLImageElement} img
 * @param {number} targetMaxWidth
 * @param {number} targetMaxHeight
 * @param {number} targetQuality
 * @returns {string} Data URL da imagem comprimida (ou string vazia em falha)
 */
function encodeImageToDataUrl(img, targetMaxWidth, targetMaxHeight, targetQuality) {
  try {
    const canvas = document.createElement('canvas');
    let width = img.naturalWidth || img.width;
    let height = img.naturalHeight || img.height;
    if (width > targetMaxWidth || height > targetMaxHeight) {
      const ratio = Math.min(targetMaxWidth / width, targetMaxHeight / height);
      width = Math.round(width * ratio);
      height = Math.round(height * ratio);
    }
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    ctx.drawImage(img, 0, 0, width, height);

    let dataUrl = '';
    try {
      dataUrl = canvas.toDataURL('image/webp', targetQuality);
    } catch (err) {
      console.warn('[JEZ Atelie] WebP indisponivel, aplicando fallback JPEG:', err);
      dataUrl = '';
    }
    if (!dataUrl || dataUrl.startsWith('data:image/png')) {
      dataUrl = canvas.toDataURL('image/jpeg', targetQuality);
    }
    return dataUrl;
  } catch (canvasErr) {
    console.warn('[JËZ Ateliê] Erro no processamento de Canvas para imagem:', canvasErr);
    return '';
  }
}

/**
 * Comprime e redimensiona arquivos de imagem client-side via Canvas
 * Otimizado para 800px a 82% de qualidade WebP Retina, com fallback para JPEG
 * @param {File | Blob} file
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @param {number} quality
 * @returns {Promise<string>} Base64 Data URL da imagem comprimida
 */
export function compressImageFile(file, maxWidth = 800, maxHeight = 800, quality = 0.82) {
  return new Promise((resolve) => {
    if (!file) return resolve('');
    let targetMaxWidth = maxWidth;
    let targetMaxHeight = maxHeight;
    let targetQuality = quality;

    // Trata chamada com assinatura legada (file, maxWidth, quality)
    // onde o 3o argumento passado foi a qualidade (<= 1) e maxHeight nao foi especificado
    if ((arguments.length === 3 || quality === undefined) && typeof maxHeight === 'number' && maxHeight <= 1 && maxHeight > 0) {
      targetQuality = maxHeight;
      targetMaxHeight = maxWidth;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        resolve(encodeImageToDataUrl(img, targetMaxWidth, targetMaxHeight, targetQuality));
      };
      img.onerror = () => {
        console.warn('[JËZ Ateliê] Falha na decodificação da imagem para compressão.');
        resolve('');
      };
      img.src = e.target.result;
    };
    reader.onerror = () => resolve('');
    reader.readAsDataURL(file);
  });
}

/**
 * Comprime um Data URL Base64 legado (ex.: fotos antigas em JPEG) para WebP Retina.
 * Usado pela migracao em lote do acervo ja persistido no Atelie.
 * @param {string} dataUrl
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @param {number} quality
 * @returns {Promise<string>} Data URL WebP comprimido (ou vazio em falha)
 */
export function compressImageDataUrl(dataUrl, maxWidth = 800, maxHeight = 800, quality = 0.82) {
  return new Promise((resolve) => {
    if (!dataUrl || typeof dataUrl !== 'string' || !dataUrl.trim().toLowerCase().startsWith('data:image/')) {
      return resolve('');
    }
    const img = new Image();
    img.onload = () => {
      resolve(encodeImageToDataUrl(img, maxWidth, maxHeight, quality));
    };
    img.onerror = () => {
      console.warn('[JËZ Ateliê] Falha na decodificação da imagem Base64 para compressão.');
      resolve('');
    };
    img.src = dataUrl;
  });
}
