import type { Screen } from '../types';
import DrawingCanvas from '../components/DrawingCanvas';

interface Props {
  onNavigate: (screen: Screen, data?: unknown) => void;
}

export default function DrawingScreen({ onNavigate }: Props) {
  const handleImageReady = (base64: string) => {
    onNavigate('convert', { image: base64, source: 'draw' });
  };

  return (
    <div className="flex flex-col h-full">
      {/* Back button */}
      <div className="absolute top-safe-top left-4 z-20 mt-3">
        <button
          onClick={() => onNavigate('home')}
          className="w-9 h-9 rounded-full flex items-center justify-center bg-black/40 backdrop-blur-sm text-white active:scale-95"
        >
          <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </div>
      <DrawingCanvas onImageReady={handleImageReady} />
    </div>
  );
}
