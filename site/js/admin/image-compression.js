/**
 * ==========================================================================
 * JEZ Collection — Módulo de Compressão de Imagens Client-Side (JEZ-030)
 * Arquitetura: Alex (CTO) | Performance: Noa
 * ==========================================================================
 */

/**
 * Comprime e redimensiona arquivos de imagem client-side via Canvas
 * Otimizado para 540px a 68% de qualidade, reduzindo payload em ~75% sem perda visual
 * @param {File | Blob} file
 * @param {number} maxWidth
 * @param {number} quality
 * @returns {Promise<string>} Base64 Data URL da imagem comprimida
 */
export function compressImageFile(file, maxWidth = 540, quality = 0.68) {
  return new Promise((resolve) => {
    if (!file) return resolve('');
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          let width = img.naturalWidth || img.width;
          let height = img.naturalHeight || img.height;
          if (width > maxWidth || height > maxWidth) {
            if (width > height) {
              height = Math.round((height * maxWidth) / width);
              width = maxWidth;
            } else {
              width = Math.round((width * maxWidth) / height);
              height = maxWidth;
            }
          }
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (!ctx) return resolve('');
          ctx.drawImage(img, 0, 0, width, height);
          resolve(canvas.toDataURL('image/jpeg', quality));
        } catch (canvasErr) {
          console.warn('[JËZ Ateliê] Erro no processamento de Canvas para imagem:', canvasErr);
          resolve('');
        }
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
