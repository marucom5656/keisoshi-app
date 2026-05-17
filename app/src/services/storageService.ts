import type { ConversionResult, ApiSettings } from '../types';

const GALLERY_KEY = 'ukiyoe_gallery';
const SETTINGS_KEY = 'ukiyoe_settings';

export function loadGallery(): ConversionResult[] {
  try {
    const data = localStorage.getItem(GALLERY_KEY);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

export function saveToGallery(result: ConversionResult): void {
  const gallery = loadGallery();
  gallery.unshift(result);
  // Keep only last 50 items
  const trimmed = gallery.slice(0, 50);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(trimmed));
}

export function deleteFromGallery(id: string): void {
  const gallery = loadGallery().filter(r => r.id !== id);
  localStorage.setItem(GALLERY_KEY, JSON.stringify(gallery));
}

export function loadSettings(): ApiSettings {
  try {
    const data = localStorage.getItem(SETTINGS_KEY);
    if (data) return JSON.parse(data);
  } catch {
    // ignore
  }
  return { provider: 'stability', apiKey: '', strength: 0.85 };
}

export function saveSettings(settings: ApiSettings): void {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
}
