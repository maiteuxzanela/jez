/**
 * ==========================================================================
 * JEZ Collection — Componente Quick View & Galeria Mista (JEZ-032)
 * Especialistas: Lumi (UI/UX Boutique) & Ariel (Direção de Arte)
 * Supervisão: Alex (CTO)
 * ==========================================================================
 * Suporte a galeria mista com fotos estáticas e vídeos curtos em loop (3-8s).
 * Cumpre rigorosamente a política de ZERO EMOJIS e ZERO PILLS.
 */

import { sanitizeImageUrl } from './product-card.js';
import {
  isVideoUrl,
  normalizeMediaItem,
  hasVideoMedia,
  cleanupVideoPlayback,
  shouldAutoplayMotion
} from '../services/media-performance.js';

export const ICON_VIDEO_LOOP = `<svg class="jez-craft-icon jez-icon-video-loop" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="2" y="4" width="20" height="16" rx="3" ry="3"></rect><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" fill-opacity="0.25"></polygon><line x1="6" y1="4" x2="6" y2="7"></line><line x1="6" y1="17" x2="6" y2="20"></line><line x1="18" y1="4" x2="18" y2="7"></line><line x1="18" y1="17" x2="18" y2="20"></line></svg>`;

export const ICON_PLAY_CRAFT = `<svg class="jez-craft-icon jez-icon-play-craft" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M6 4.5l14 7.5-14 7.5V4.5z" fill="currentColor" fill-opacity="0.3"></path></svg>`;

export const ICON_PAUSE_CRAFT = `<svg class="jez-craft-icon jez-icon-pause-craft" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><line x1="8" y1="5" x2="8" y2="19"></line><line x1="16" y1="5" x2="16" y2="19"></line></svg>`;

export class QuickViewGallery {
  constructor(options = {}) {
    this.options = options;
    this.currentPhotos = [];
    this.currentMedia = [];
    this.currentIndex = 0;
    this.fallbackPoster = options.fallbackPoster || '';
    this.onPhotoChange = options.onPhotoChange || null;
    this.onMediaChange = options.onMediaChange || null;
  }

  setPhotos(photos = [], fallbackPoster = '') {
    return this.setMedia(photos, fallbackPoster);
  }

  setMedia(mediaList = [], fallbackPoster = '') {
    const list = Array.isArray(mediaList) && mediaList.length > 0 ? mediaList : [];
    const poster = fallbackPoster || this.fallbackPoster;

    this.currentPhotos = list;
    this.currentMedia = list.map(item => normalizeMediaItem(item, poster));
    this.currentIndex = 0;

    return this.getCurrentMedia();
  }

  getCurrentMedia() {
    return this.currentMedia[this.currentIndex] || null;
  }

  getCurrentPhoto() {
    const item = this.getCurrentMedia();
    if (!item) return '';
    return item.url || '';
  }

  getCurrentType() {
    const item = this.getCurrentMedia();
    return item ? item.type : 'image';
  }

  isCurrentVideo() {
    return this.getCurrentType() === 'video';
  }

  hasVideo() {
    return hasVideoMedia(this.currentPhotos) || this.currentMedia.some(m => m.type === 'video');
  }

  selectPhoto(index) {
    return this.selectMedia(index);
  }

  selectMedia(index) {
    if (index >= 0 && index < this.currentMedia.length) {
      this.currentIndex = index;
      const mediaItem = this.currentMedia[this.currentIndex];
      const photoUrl = this.currentPhotos[this.currentIndex];

      if (typeof this.onMediaChange === 'function') {
        this.onMediaChange(this.currentIndex, mediaItem);
      }
      if (typeof this.onPhotoChange === 'function') {
        this.onPhotoChange(this.currentIndex, photoUrl);
      }
      return mediaItem;
    }
    return null;
  }

  next() {
    if (this.currentMedia.length <= 1) return null;
    const nextIdx = (this.currentIndex + 1) % this.currentMedia.length;
    return this.selectMedia(nextIdx);
  }

  prev() {
    if (this.currentMedia.length <= 1) return null;
    const prevIdx = (this.currentIndex - 1 + this.currentMedia.length) % this.currentMedia.length;
    return this.selectMedia(prevIdx);
  }

  get total() {
    return this.currentMedia.length;
  }

  get index() {
    return this.currentIndex;
  }
}
