import { useState } from 'react';
import type { Screen, ApiSettings } from '../types';
import { loadSettings, saveSettings } from '../services/storageService';

interface Props {
  onNavigate: (screen: Screen) => void;
}

export default function SettingsScreen({ onNavigate }: Props) {
  const [settings, setSettings] = useState<ApiSettings>(loadSettings);
  const [showKey, setShowKey] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    saveSettings(settings);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

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
        <h1 className="text-lg font-semibold">設定</h1>
      </div>

      <div className="flex-1 overflow-y-auto px-4 space-y-6 pb-safe-bottom">
        {/* Provider */}
        <section>
          <h2 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wider">
            AI プロバイダー
          </h2>
          <div className="space-y-2">
            {[
              {
                id: 'stability' as const,
                name: 'Stability AI',
                desc: 'Stable Diffusion 3 (推奨)',
                url: 'https://platform.stability.ai',
              },
              {
                id: 'replicate' as const,
                name: 'Replicate',
                desc: 'SDXL 画像変換',
                url: 'https://replicate.com',
              },
            ].map(p => (
              <button
                key={p.id}
                onClick={() => setSettings(s => ({ ...s, provider: p.id }))}
                className={`w-full p-4 rounded-2xl text-left transition-all ${
                  settings.provider === p.id
                    ? 'bg-white/15 ring-1 ring-white/30'
                    : 'bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium">{p.name}</div>
                    <div className="text-sm text-white/50">{p.desc}</div>
                  </div>
                  {settings.provider === p.id && (
                    <div className="w-5 h-5 rounded-full bg-[#c0392b] flex items-center justify-center">
                      <svg viewBox="0 0 12 12" className="w-3 h-3" fill="white">
                        <polyline points="1,6 4.5,9.5 11,2" strokeWidth="2" stroke="white" fill="none" />
                      </svg>
                    </div>
                  )}
                </div>
              </button>
            ))}
          </div>
        </section>

        {/* API Key */}
        <section>
          <h2 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wider">
            API キー
          </h2>
          <div className="relative">
            <input
              type={showKey ? 'text' : 'password'}
              value={settings.apiKey}
              onChange={e => setSettings(s => ({ ...s, apiKey: e.target.value }))}
              placeholder="sk-..."
              className="w-full bg-white/10 rounded-2xl px-4 py-4 pr-12 text-white placeholder-white/30 focus:outline-none focus:ring-1 focus:ring-white/30 font-mono text-sm"
            />
            <button
              onClick={() => setShowKey(v => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 p-1"
            >
              {showKey ? '🙈' : '👁️'}
            </button>
          </div>
          <p className="mt-2 text-xs text-white/30">
            {settings.provider === 'stability'
              ? 'Stability AI Platform でAPIキーを取得してください'
              : 'Replicate.com でAPIキーを取得してください'}
          </p>
        </section>

        {/* Strength */}
        <section>
          <h2 className="text-sm font-semibold text-white/50 mb-3 uppercase tracking-wider">
            変換強度
          </h2>
          <div className="bg-white/5 rounded-2xl p-4">
            <div className="flex justify-between text-sm mb-3">
              <span className="text-white/60">元画像を保持</span>
              <span className="font-mono text-white">{Math.round(settings.strength * 100)}%</span>
              <span className="text-white/60">浮世絵スタイル</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="0.99"
              step="0.01"
              value={settings.strength}
              onChange={e => setSettings(s => ({ ...s, strength: parseFloat(e.target.value) }))}
              className="w-full accent-[#c0392b]"
            />
          </div>
        </section>

        {/* Info */}
        <section className="bg-white/5 rounded-2xl p-4 space-y-2">
          <h2 className="text-sm font-semibold text-white/70">使い方</h2>
          <ol className="text-xs text-white/40 space-y-1 list-decimal list-inside">
            <li>AIプロバイダーを選択 (Stability AI 推奨)</li>
            <li>該当サービスでアカウントを作成してAPIキーを取得</li>
            <li>APIキーを入力して保存</li>
            <li>絵を描くか写真を選んで浮世絵に変換</li>
          </ol>
        </section>

        <div className="text-center text-xs text-white/20 pb-4">
          浮世絵アート v1.0.0
        </div>
      </div>

      {/* Save button */}
      <div className="px-4 pb-safe-bottom py-4">
        <button
          onClick={handleSave}
          className="w-full py-4 rounded-2xl font-semibold text-base active:scale-[0.98] shadow-lg transition-colors"
          style={{ backgroundColor: saved ? '#374151' : '#c0392b' }}
        >
          {saved ? '✓ 保存しました' : '設定を保存'}
        </button>
      </div>
    </div>
  );
}
