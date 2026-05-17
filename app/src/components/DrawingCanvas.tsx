import { useEffect } from 'react';
import { JAPANESE_COLORS } from '../services/styles';
import { useDrawing } from '../hooks/useDrawing';

interface Props {
  onImageReady: (base64: string) => void;
}

const BRUSH_SIZES = [4, 8, 16, 28];

export default function DrawingCanvas({ onImageReady }: Props) {
  const {
    canvasRef,
    tool,
    setTool,
    canUndo,
    canRedo,
    startDrawing,
    draw,
    stopDrawing,
    undo,
    redo,
    clear,
    getImageBase64,
  } = useDrawing();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resizeObserver = new ResizeObserver(() => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      if (canvas.width !== rect.width * dpr) {
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.scale(dpr, dpr);
          ctx.fillStyle = '#f5f0e8';
          ctx.fillRect(0, 0, rect.width, rect.height);
        }
      }
    });
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, [canvasRef]);

  const handleConvert = () => {
    const img = getImageBase64();
    if (img) onImageReady(img);
  };

  return (
    <div className="flex flex-col h-full bg-[#1a0a00]">
      {/* Top toolbar */}
      <div className="flex items-center justify-between px-4 pt-safe-top py-3 bg-[#1a0a00]">
        <div className="flex gap-2">
          <button
            onClick={undo}
            disabled={!canUndo}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 disabled:opacity-30 active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M9 14L4 9l5-5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M4 9h10.5a5.5 5.5 0 0 1 0 11H11" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={redo}
            disabled={!canRedo}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 disabled:opacity-30 active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M15 14l5-5-5-5" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M20 9H9.5a5.5 5.5 0 0 0 0 11H13" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={clear}
            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/10 active:scale-95"
          >
            <svg viewBox="0 0 24 24" className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 6h18M19 6l-1 14H6L5 6M9 6V4h6v2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>
        <button
          onClick={handleConvert}
          className="px-5 py-2 rounded-full bg-[#c0392b] text-white text-sm font-semibold active:scale-95 shadow-lg"
        >
          浮世絵に変換 →
        </button>
      </div>

      {/* Canvas */}
      <div className="flex-1 mx-4 my-2 rounded-2xl overflow-hidden shadow-2xl">
        <canvas
          ref={canvasRef}
          className="w-full h-full touch-none cursor-crosshair"
          style={{ imageRendering: 'pixelated' }}
          onPointerDown={startDrawing}
          onPointerMove={draw}
          onPointerUp={stopDrawing}
          onPointerLeave={stopDrawing}
          onPointerCancel={stopDrawing}
        />
      </div>

      {/* Bottom toolbar */}
      <div className="px-4 pb-safe-bottom py-3 bg-[#1a0a00] space-y-3">
        {/* Tool selector */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setTool(t => ({ ...t, type: 'pen' }))}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              tool.type === 'pen'
                ? 'bg-white text-[#1a0a00]'
                : 'bg-white/15 text-white'
            }`}
          >
            ✏️ ペン
          </button>
          <button
            onClick={() => setTool(t => ({ ...t, type: 'eraser' }))}
            className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${
              tool.type === 'eraser'
                ? 'bg-white text-[#1a0a00]'
                : 'bg-white/15 text-white'
            }`}
          >
            🧹 消しゴム
          </button>
        </div>

        {/* Brush size */}
        <div className="flex items-center gap-3">
          <span className="text-white/60 text-xs w-10">太さ</span>
          <div className="flex gap-2 flex-1">
            {BRUSH_SIZES.map(size => (
              <button
                key={size}
                onClick={() => setTool(t => ({ ...t, size }))}
                className={`flex-1 h-9 rounded-xl flex items-center justify-center transition-all ${
                  tool.size === size ? 'bg-white/30' : 'bg-white/10'
                }`}
              >
                <div
                  className="rounded-full bg-white"
                  style={{ width: size / 2 + 4, height: size / 2 + 4 }}
                />
              </button>
            ))}
          </div>
        </div>

        {/* Color palette */}
        <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
          {JAPANESE_COLORS.map(c => (
            <button
              key={c.hex}
              onClick={() => setTool(t => ({ ...t, color: c.hex, type: 'pen' }))}
              className="flex-shrink-0 transition-transform active:scale-90"
              title={c.name}
            >
              <div
                className={`w-8 h-8 rounded-full border-2 transition-all ${
                  tool.color === c.hex && tool.type === 'pen'
                    ? 'border-white scale-110 shadow-lg'
                    : 'border-white/30'
                }`}
                style={{ backgroundColor: c.hex }}
              />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
