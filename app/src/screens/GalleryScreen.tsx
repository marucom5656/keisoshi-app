import { useState } from 'react';
import type { Screen, ConversionResult } from '../types';
import { loadGallery, deleteFromGallery } from '../services/storageService';
import { UKIYOE_STYLES } from '../services/styles';

interface Props {
  onNavigate: (screen: Screen, data?: unknown) => void;
}

export default function GalleryScreen({ onNavigate }: Props) {
  const [gallery, setGallery] = useState<ConversionResult[]>(loadGallery);
  const [selected, setSelected] = useState<ConversionResult | null>(null);

  const handleDelete = (id: string) => {
    deleteFromGallery(id);
    setGallery(loadGallery());
    setSelected(null);
  };

  const handleDownload = (item: ConversionResult) => {
    const link = document.createElement('a');
    link.href = item.convertedImage;
    link.download = `ukiyoe-${item.style}-${item.id}.jpg`;
    link.click();
  };

  const getStyleConfig = (style: string) =>
    UKIYOE_STYLES.find(s => s.id === style) ?? UKIYOE_STYLES[0];

  if (selected) {
    const sc = getStyleConfig(selected.style);
    return (
      <div className="flex flex-col h-full bg-[#1a0a00] text-white">
        <div className="flex items-center gap-3 px-4 pt-safe-top pb-4 mt-3">
          <button
            onClick={() => setSelected(null)}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
              <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
          <h1 className="text-lg font-semibold">作品詳細</h1>
        </div>

        <div className="flex-1 overflow-y-auto px-4 space-y-4">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img src={selected.convertedImage} alt="浮世絵" className="w-full" />
          </div>
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
            style={{ backgroundColor: sc.bgColor }}
          >
            <span className="font-bold text-lg" style={{ color: sc.color, fontFamily: 'serif' }}>
              {sc.nameJa}
            </span>
            <span className="text-sm" style={{ color: sc.color }}>{sc.artist} スタイル</span>
          </div>
          <p className="text-white/40 text-xs">
            {new Date(selected.createdAt).toLocaleDateString('ja-JP', {
              year: 'numeric', month: 'long', day: 'numeric',
              hour: '2-digit', minute: '2-digit',
            })}
          </p>
        </div>

        <div className="px-4 pb-safe-bottom py-4 flex gap-3">
          <button
            onClick={() => handleDownload(selected)}
            className="flex-1 py-3 rounded-2xl bg-[#c0392b] font-semibold active:scale-[0.98]"
          >
            💾 ダウンロード
          </button>
          <button
            onClick={() => handleDelete(selected.id)}
            className="px-4 py-3 rounded-2xl bg-white/10 font-semibold active:scale-[0.98] text-red-400"
          >
            🗑️
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-[#1a0a00] text-white">
      <div className="flex items-center gap-3 px-4 pt-safe-top pb-4 mt-3">
        <button
          onClick={() => onNavigate('home')}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">ギャラリー</h1>
        <span className="ml-auto text-white/40 text-sm">{gallery.length}点</span>
      </div>

      {gallery.length === 0 ? (
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-white/40">
          <div className="text-6xl">🖼️</div>
          <p className="text-center text-sm">まだ作品がありません<br />浮世絵に変換して保存しましょう</p>
          <button
            onClick={() => onNavigate('home')}
            className="mt-2 px-6 py-3 rounded-2xl bg-white/10 text-white/70 text-sm active:bg-white/20"
          >
            作成する →
          </button>
        </div>
      ) : (
        <div className="flex-1 overflow-y-auto px-4 pb-safe-bottom">
          <div className="grid grid-cols-2 gap-3 pb-4">
            {gallery.map(item => {
              const sc = getStyleConfig(item.style);
              return (
                <button
                  key={item.id}
                  onClick={() => setSelected(item)}
                  className="relative rounded-2xl overflow-hidden aspect-square active:scale-[0.97] transition-transform"
                >
                  <img
                    src={item.convertedImage}
                    alt="浮世絵"
                    className="w-full h-full object-cover"
                  />
                  <div
                    className="absolute bottom-0 inset-x-0 px-2 py-1 text-xs font-bold"
                    style={{ backgroundColor: sc.color + 'cc', color: 'white' }}
                  >
                    {sc.nameJa}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
