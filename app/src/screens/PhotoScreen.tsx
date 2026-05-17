import { useRef, useState } from 'react';
import type { Screen } from '../types';

interface Props {
  onNavigate: (screen: Screen, data?: unknown) => void;
}

export default function PhotoScreen({ onNavigate }: Props) {
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  const handleFile = (file: File) => {
    const reader = new FileReader();
    reader.onload = e => setPreview(e.target?.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const handleConvert = () => {
    if (preview) {
      onNavigate('convert', { image: preview, source: 'photo' });
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#1a0a00] text-white">
      {/* Header */}
      <div className="flex items-center gap-3 px-4 pt-safe-top pb-4 mt-3">
        <button
          onClick={() => onNavigate('home')}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
        <h1 className="text-lg font-semibold">写真を選ぶ</h1>
      </div>

      {/* Preview area */}
      <div className="flex-1 mx-4 mb-4 rounded-3xl overflow-hidden relative">
        {preview ? (
          <>
            <img
              src={preview}
              alt="選択した写真"
              className="w-full h-full object-contain bg-black"
            />
            <button
              onClick={() => setPreview(null)}
              className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/60 flex items-center justify-center text-white active:scale-95"
            >
              ✕
            </button>
          </>
        ) : (
          <div className="w-full h-full bg-white/5 flex flex-col items-center justify-center gap-6">
            <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center text-5xl">
              🖼️
            </div>
            <p className="text-white/50 text-sm">写真を選択してください</p>

            {/* Upload buttons */}
            <div className="flex gap-4">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-white/10 active:bg-white/20"
              >
                <span className="text-3xl">📷</span>
                <span className="text-sm text-white/80">カメラ</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center gap-2 px-6 py-4 rounded-2xl bg-white/10 active:bg-white/20"
              >
                <span className="text-3xl">🗂️</span>
                <span className="text-sm text-white/80">ライブラリ</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="px-4 pb-safe-bottom py-4 space-y-3">
        {preview && (
          <>
            <div className="flex gap-3">
              <button
                onClick={() => cameraInputRef.current?.click()}
                className="flex-1 py-3 rounded-2xl bg-white/10 text-sm font-medium active:bg-white/20"
              >
                📷 カメラ
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 py-3 rounded-2xl bg-white/10 text-sm font-medium active:bg-white/20"
              >
                🗂️ ライブラリ
              </button>
            </div>
            <button
              onClick={handleConvert}
              className="w-full py-4 rounded-2xl bg-[#c0392b] text-white font-semibold text-base active:scale-[0.98] shadow-lg"
            >
              浮世絵に変換 →
            </button>
          </>
        )}
      </div>

      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileInput}
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="hidden"
        onChange={handleFileInput}
      />
    </div>
  );
}
