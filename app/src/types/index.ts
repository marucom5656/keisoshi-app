export type Screen = 'home' | 'draw' | 'photo' | 'convert' | 'gallery' | 'settings';

export type UkiyoeStyle = 'hokusai' | 'hiroshige' | 'utamaro' | 'sharaku';

export interface StyleConfig {
  id: UkiyoeStyle;
  name: string;
  nameJa: string;
  artist: string;
  description: string;
  prompt: string;
  color: string;
  bgColor: string;
}

export interface DrawingTool {
  type: 'pen' | 'eraser';
  size: number;
  color: string;
  opacity: number;
}

export interface ConversionResult {
  id: string;
  originalImage: string;
  convertedImage: string;
  style: UkiyoeStyle;
  createdAt: number;
}

export interface ApiSettings {
  provider: 'stability' | 'replicate';
  apiKey: string;
  strength: number;
}
