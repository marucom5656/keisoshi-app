import type { Screen } from '../types';
import WavePattern from '../components/ui/WavePattern';

interface Props {
  onNavigate: (screen: Screen) => void;
}

export default function HomeScreen({ onNavigate }: Props) {
  return (
    <div className="flex flex-col h-full bg-[#1a0a00] text-white overflow-hidden">
      {/* Header */}
      <div className="relative pt-safe-top pb-8 px-6 overflow-hidden">
        <WavePattern className="absolute inset-0 w-full h-full opacity-60" />
        <div className="relative z-10 pt-8">
          <div className="flex items-baseline gap-3 mb-1">
            <h1 className="text-4xl font-bold tracking-tight" style={{ fontFamily: 'serif' }}>
              浮世絵アート
            </h1>
          </div>
          <p className="text-white/60 text-sm">絵や写真を名作浮世絵スタイルに変換</p>
          <div className="flex gap-2 mt-3">
            {['北斎', '広重', '歌麿', '写楽'].map(name => (
              <span
                key={name}
                className="text-xs px-2 py-1 rounded-full border border-white/20 text-white/50"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Main actions */}
      <div className="flex-1 px-4 py-2 space-y-4 overflow-y-auto">
        {/* Draw */}
        <button
          onClick={() => onNavigate('draw')}
          className="w-full relative overflow-hidden rounded-3xl p-6 text-left transition-transform active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #1e3a5f 0%, #0f2040 100%)' }}
        >
          <div className="absolute right-4 top-4 text-6xl opacity-20">🌊</div>
          <div className="relative z-10">
            <div className="text-3xl mb-3">✏️</div>
            <h2 className="text-xl font-bold mb-1">絵を描く</h2>
            <p className="text-white/60 text-sm">キャンバスに自由に描いて\n浮世絵に変換</p>
          </div>
        </button>

        {/* Photo */}
        <button
          onClick={() => onNavigate('photo')}
          className="w-full relative overflow-hidden rounded-3xl p-6 text-left transition-transform active:scale-[0.98]"
          style={{ background: 'linear-gradient(135deg, #3d1a00 0%, #5c2a00 100%)' }}
        >
          <div className="absolute right-4 top-4 text-6xl opacity-20">🗻</div>
          <div className="relative z-10">
            <div className="text-3xl mb-3">📷</div>
            <h2 className="text-xl font-bold mb-1">写真を選ぶ</h2>
            <p className="text-white/60 text-sm">撮影またはカメラロールから\nお気に入りの写真を変換</p>
          </div>
        </button>

        {/* Style cards preview */}
        <div className="rounded-2xl overflow-hidden bg-white/5 p-4">
          <h3 className="text-sm font-semibold text-white/60 mb-3">変換スタイル</h3>
          <div className="grid grid-cols-4 gap-2">
            {[
              { ja: '北斎', en: '波', color: '#1e3a5f', bg: '#dbeafe' },
              { ja: '広重', en: '山', color: '#1a3d2b', bg: '#dcfce7' },
              { ja: '歌麿', en: '美', color: '#7c1d3f', bg: '#fce7f3' },
              { ja: '写楽', en: '役', color: '#7c1d0a', bg: '#fee2e2' },
            ].map(s => (
              <div
                key={s.ja}
                className="rounded-xl p-3 text-center"
                style={{ backgroundColor: s.bg }}
              >
                <div className="text-xl" style={{ color: s.color, fontFamily: 'serif' }}>
                  {s.ja}
                </div>
                <div className="text-xs mt-1" style={{ color: s.color }}>
                  {s.en}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom navigation */}
      <div className="pb-safe-bottom px-4 py-3 flex gap-3 border-t border-white/10">
        <button
          onClick={() => onNavigate('gallery')}
          className="flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl bg-white/5 active:bg-white/10"
        >
          <span className="text-lg">🖼</span>
          <span className="text-xs text-white/60">ギャラリー</span>
        </button>
        <button
          onClick={() => onNavigate('settings')}
          className="flex-1 flex flex-col items-center gap-1 py-2 rounded-2xl bg-white/5 active:bg-white/10"
        >
          <span className="text-lg">⚙️</span>
          <span className="text-xs text-white/60">設定</span>
        </button>
      </div>
    </div>
  );
}
