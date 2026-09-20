/**
 * ==========================================================================
 * JEZ Collection — Componente Quick View & Galeria de Fotos
 * Especialistas: Lumi (UI/UX Boutique) & Ariel (Direção de Arte)
 * ==========================================================================
 */

import { sanitizeImageUrl } from './product-card.js';

export class QuickViewGallery {
  constructor(options = {}) {
    this.currentPhotos = [];
    this.currentIndex = 0;
    this.onPhotoChange = options.onPhotoChange || null;
  }

  setPhotos(photos = []) {
    this.currentPhotos = Array.isArray(photos) && photos.length > 0 ? photos : [];
    this.currentIndex = 0;
    return this.getCurrentPhoto();
  }

  getCurrentPhoto() {
    return this.currentPhotos[this.currentIndex] || '';
  }

  selectPhoto(index) {
    if (index >= 0 && index < this.currentPhotos.length) {
      this.currentIndex = index;
      if (typeof this.onPhotoChange === 'function') {
        this.onPhotoChange(this.currentIndex, this.currentPhotos[this.currentIndex]);
      }
      return this.currentPhotos[this.currentIndex];
    }
    return null;
  }

  next() {
    if (this.currentPhotos.length <= 1) return null;
    const nextIdx = (this.currentIndex + 1) % this.currentPhotos.length;
    return this.selectPhoto(nextIdx);
  }

  prev() {
    if (this.currentPhotos.length <= 1) return null;
    const prevIdx = (this.currentIndex - 1 + this.currentPhotos.length) % this.currentPhotos.length;
    return this.selectPhoto(prevIdx);
  }

  get total() {
    return this.currentPhotos.length;
  }

  get index() {
    return this.currentIndex;
  }
}
