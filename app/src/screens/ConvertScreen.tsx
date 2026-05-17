import { useState, useEffect } from 'react';
import type { Screen, UkiyoeStyle, ConversionResult } from '../types';
import StyleSelector from '../components/StyleSelector';
import { convertToUkiyoe } from '../services/ukiyoeService';
import { loadSettings, saveToGallery } from '../services/storageService';
import { UKIYOE_STYLES } from '../services/styles';

interface Props {
  image: string;
  onNavigate: (screen: Screen, data?: unknown) => void;
}

type Phase = 'select' | 'converting' | 'result' | 'error';

export default function ConvertScreen({ image, onNavigate }: Props) {
  const [style, setStyle] = useState<UkiyoeStyle>('hokusai');
  const [phase, setPhase] = useState<Phase>('select');
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState('');
  const [saved, setSaved] = useState(false);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timer: ReturnType<typeof setInterval>;
    if (phase === 'converting') {
      setProgress(0);
      timer = setInterval(() => {
        setProgress(p => Math.min(p + Math.random() * 4, 92));
      }, 800);
    }
    return () => clearInterval(timer);
  }, [phase]);

  const handleConvert = async () => {
    setPhase('converting');
    setError('');
    try {
      const settings = loadSettings();
      const converted = await convertToUkiyoe(image, style, settings);
      setResult(converted);
      setProgress(100);
      setPhase('result');
    } catch (err) {
      setError(err instanceof Error ? err.message : '変換に失敗しました');
      setPhase('error');
    }
  };

  const handleSave = () => {
    if (!result) return;
    const convResult: ConversionResult = {
      id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
      originalImage: image,
      convertedImage: result,
      style,
      createdAt: Date.now(),
    };
    saveToGallery(convResult);
    setSaved(true);

    // Download
    const link = document.createElement('a');
    link.href = result;
    link.download = `ukiyoe-${style}-${Date.now()}.jpg`;
    link.click();
  };

  const styleConfig = UKIYOE_STYLES.find(s => s.id === style)!;

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
        <h1 className="text-lg font-semibold">
          {phase === 'select' && 'スタイルを選ぶ'}
          {phase === 'converting' && '変換中...'}
          {phase === 'result' && '変換完了'}
          {phase === 'error' && 'エラー'}
        </h1>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        {(phase === 'select' || phase === 'error') && (
          <>
            {/* Original image thumbnail */}
            <div className="mx-4 mb-4 rounded-2xl overflow-hidden h-48 bg-black">
              <img src={image} alt="元の画像" className="w-full h-full object-contain" />
            </div>

            {phase === 'error' && (
              <div className="mx-4 mb-4 p-4 rounded-2xl bg-red-900/40 border border-red-500/30">
                <p className="text-red-300 text-sm">{error}</p>
                {error.includes('APIキー') && (
                  <button
                    onClick={() => onNavigate('settings')}
                    className="mt-2 text-red-400 underline text-sm"
                  >
                    設定画面でAPIキーを入力 →
                  </button>
                )}
              </div>
            )}

            <h2 className="px-4 text-sm text-white/50 mb-2 font-medium">変換スタイル</h2>
            <StyleSelector selected={style} onChange={setStyle} />
          </>
        )}

        {phase === 'converting' && (
          <div className="flex flex-col items-center justify-center h-64 px-8">
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center mb-6 animate-pulse"
              style={{ backgroundColor: styleConfig.bgColor }}
            >
              <span className="text-3xl" style={{ color: styleConfig.color, fontFamily: 'serif' }}>
                {styleConfig.nameJa}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-2 mb-3">
              <div
                className="h-2 rounded-full transition-all duration-700"
                style={{ width: `${progress}%`, backgroundColor: styleConfig.color }}
              />
            </div>
            <p className="text-white/60 text-sm text-center">
              {styleConfig.artist}スタイルで変換しています...
            </p>
            <p className="text-white/30 text-xs mt-2">
              ※ 通常30〜60秒かかります
            </p>
          </div>
        )}

        {phase === 'result' && result && (
          <div className="px-4 space-y-4">
            {/* Result image */}
            <div className="rounded-3xl overflow-hidden shadow-2xl">
              <img src={result} alt="浮世絵変換結果" className="w-full" />
            </div>

            {/* Style badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
              style={{ backgroundColor: styleConfig.bgColor }}
            >
              <span className="font-bold" style={{ color: styleConfig.color, fontFamily: 'serif' }}>
                {styleConfig.nameJa}
              </span>
              <span className="text-sm" style={{ color: styleConfig.color }}>
                {styleConfig.artist} スタイル
              </span>
            </div>

            {/* Compare */}
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl overflow-hidden">
                <img src={image} alt="変換前" className="w-full h-24 object-cover" />
                <div className="text-center text-xs text-white/50 mt-1">変換前</div>
              </div>
              <div className="rounded-2xl overflow-hidden">
                <img src={result} alt="変換後" className="w-full h-24 object-cover" />
                <div className="text-center text-xs text-white/50 mt-1">変換後</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Bottom actions */}
      <div className="px-4 pb-safe-bottom py-4 space-y-3">
        {phase === 'select' && (
          <button
            onClick={handleConvert}
            className="w-full py-4 rounded-2xl font-semibold text-base active:scale-[0.98] shadow-lg transition-colors"
            style={{ backgroundColor: styleConfig.color }}
          >
            {styleConfig.nameJa}スタイルで変換する
          </button>
        )}

        {phase === 'error' && (
          <button
            onClick={() => setPhase('select')}
            className="w-full py-4 rounded-2xl bg-white/10 font-semibold text-base active:scale-[0.98]"
          >
            もう一度試す
          </button>
        )}

        {phase === 'result' && (
          <>
            <button
              onClick={handleSave}
              disabled={saved}
              className="w-full py-4 rounded-2xl font-semibold text-base active:scale-[0.98] shadow-lg disabled:opacity-60"
              style={{ backgroundColor: saved ? '#374151' : '#c0392b' }}
            >
              {saved ? '✓ 保存しました' : '💾 保存・ダウンロード'}
            </button>
            <div className="flex gap-3">
              <button
                onClick={() => { setPhase('select'); setResult(null); setSaved(false); }}
                className="flex-1 py-3 rounded-2xl bg-white/10 text-sm font-medium active:bg-white/20"
              >
                別スタイルで変換
              </button>
              <button
                onClick={() => onNavigate('gallery')}
                className="flex-1 py-3 rounded-2xl bg-white/10 text-sm font-medium active:bg-white/20"
              >
                ギャラリーへ →
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
