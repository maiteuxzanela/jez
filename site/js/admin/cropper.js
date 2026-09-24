/**
 * ==========================================================================
 * JEZ Collection — Módulo de Enquadramento 1:1 e Recorte de Fotos (JEZ-030)
 * Arquitetura: Alex (CTO) | Frontend & Canvas: Lumi
 * ==========================================================================
 */

/**
 * Inicializa a instância interativa do recortador de fotos 1:1
 * @param {object} elements
 * @returns {object} Controlador com métodos loadImage, reset, getCroppedDataUrl, getState, setState, hasImage
 */
export function setupPhotoCropper(elements) {
  const { viewportEl, imgEl, zoomSlider, btnZoomIn, btnZoomOut, btnReset, zoomValEl } = elements;
  let zoom = 1;
  let offsetX = 0;
  let offsetY = 0;
  let isDragging = false;
  let startX = 0;
  let startY = 0;
  let baseWidth = 240;
  let baseHeight = 240;
  let naturalWidth = 1;
  let naturalHeight = 1;

  const updateTransform = () => {
    if (!imgEl) return;
    imgEl.style.transform = `translate(calc(-50% + ${offsetX}px), calc(-50% + ${offsetY}px)) scale(${zoom})`;
    if (zoomSlider) zoomSlider.value = zoom;
    if (zoomValEl) zoomValEl.textContent = `${Math.round(zoom * 100)}%`;
  };

  const constrainOffsets = () => {
    if (!viewportEl) return;
    const vpW = viewportEl.clientWidth || 240;
    const vpH = viewportEl.clientHeight || 240;
    const renderedW = baseWidth * zoom;
    const renderedH = baseHeight * zoom;
    const maxOffsetX = Math.max(0, (renderedW - vpW) / 2);
    const maxOffsetY = Math.max(0, (renderedH - vpH) / 2);
    offsetX = Math.max(-maxOffsetX, Math.min(maxOffsetX, offsetX));
    offsetY = Math.max(-maxOffsetY, Math.min(maxOffsetY, offsetY));
  };

  const reset = () => {
    zoom = 1;
    offsetX = 0;
    offsetY = 0;
    if (!viewportEl || !imgEl) return;
    const vpW = viewportEl.clientWidth || 240;
    const vpH = viewportEl.clientHeight || 240;
    if (naturalWidth && naturalHeight) {
      const scaleToCover = Math.max(vpW / naturalWidth, vpH / naturalHeight);
      baseWidth = naturalWidth * scaleToCover;
      baseHeight = naturalHeight * scaleToCover;
      imgEl.style.width = `${baseWidth}px`;
      imgEl.style.height = `${baseHeight}px`;
      imgEl.style.maxWidth = 'none';
      imgEl.style.maxHeight = 'none';
    }
    updateTransform();
  };

  const onPointerDown = (clientX, clientY) => {
    isDragging = true;
    startX = clientX - offsetX;
    startY = clientY - offsetY;
  };

  const onPointerMove = (clientX, clientY) => {
    if (!isDragging) return;
    offsetX = clientX - startX;
    offsetY = clientY - startY;
    constrainOffsets();
    updateTransform();
  };

  const onPointerUp = () => {
    isDragging = false;
  };

  if (viewportEl) {
    // Eventos de Mouse
    viewportEl.addEventListener('mousedown', (e) => {
      e.preventDefault();
      onPointerDown(e.clientX, e.clientY);
    });

    // Eventos de Touch
    viewportEl.addEventListener('touchstart', (e) => {
      if (e.touches.length === 1) {
        onPointerDown(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
  }

  if (typeof window !== 'undefined') {
    window.addEventListener('mousemove', (e) => {
      if (isDragging) onPointerMove(e.clientX, e.clientY);
    });
    window.addEventListener('mouseup', onPointerUp);

    window.addEventListener('touchmove', (e) => {
      if (isDragging && e.touches.length === 1) {
        onPointerMove(e.touches[0].clientX, e.touches[0].clientY);
      }
    }, { passive: true });
    window.addEventListener('touchend', onPointerUp);
  }

  // Controles de Zoom
  if (zoomSlider) {
    zoomSlider.addEventListener('input', (e) => {
      zoom = parseFloat(e.target.value);
      constrainOffsets();
      updateTransform();
    });
  }

  if (btnZoomIn) {
    btnZoomIn.addEventListener('click', () => {
      zoom = Math.min(3, +(zoom + 0.15).toFixed(2));
      constrainOffsets();
      updateTransform();
    });
  }

  if (btnZoomOut) {
    btnZoomOut.addEventListener('click', () => {
      zoom = Math.max(1, +(zoom - 0.15).toFixed(2));
      constrainOffsets();
      updateTransform();
    });
  }

  if (btnReset) {
    btnReset.addEventListener('click', reset);
  }

  const loadImage = (src) => {
    return new Promise((resolve) => {
      if (!imgEl) return resolve();
      const onImgDone = () => {
        naturalWidth = imgEl.naturalWidth || 400;
        naturalHeight = imgEl.naturalHeight || 400;
        reset();
        resolve();
      };

      imgEl.onload = onImgDone;
      imgEl.onerror = () => {
        reset();
        resolve();
      };

      if (imgEl.src === src && imgEl.complete && imgEl.naturalWidth > 0) {
        onImgDone();
      } else {
        imgEl.src = src;
      }
    });
  };

  const getCroppedDataUrl = (targetSize = 540) => {
    if (!naturalWidth || !naturalHeight || !imgEl || !imgEl.src) return imgEl ? imgEl.src : '';
    try {
      const canvas = document.createElement('canvas');
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');
      if (!ctx) return imgEl.src;

      const vpW = viewportEl.clientWidth || 240;
      const vpH = viewportEl.clientHeight || 240;

      const currentScale = (baseWidth * zoom) / naturalWidth;
      const vpInImgX = (baseWidth * zoom - vpW) / 2 - offsetX;
      const vpInImgY = (baseHeight * zoom - vpH) / 2 - offsetY;

      const srcW = Math.min(naturalWidth, vpW / currentScale);
      const srcH = Math.min(naturalHeight, vpH / currentScale);
      const srcX = Math.max(0, Math.min(naturalWidth - srcW, vpInImgX / currentScale));
      const srcY = Math.max(0, Math.min(naturalHeight - srcH, vpInImgY / currentScale));

      ctx.fillStyle = '#23192d';
      ctx.fillRect(0, 0, targetSize, targetSize);
      ctx.drawImage(imgEl, srcX, srcY, srcW, srcH, 0, 0, targetSize, targetSize);
      return canvas.toDataURL('image/jpeg', 0.72);
    } catch {
      return imgEl.src;
    }
  };

  const getState = () => ({ zoom, offsetX, offsetY });
  const setState = (state) => {
    if (!state) return;
    if (typeof state.zoom === 'number') zoom = state.zoom;
    if (typeof state.offsetX === 'number') offsetX = state.offsetX;
    if (typeof state.offsetY === 'number') offsetY = state.offsetY;
    constrainOffsets();
    updateTransform();
  };

  return {
    loadImage,
    reset,
    getCroppedDataUrl,
    getState,
    setState,
    hasImage: () => Boolean(imgEl && imgEl.src && imgEl.src.length > 0)
  };
}
