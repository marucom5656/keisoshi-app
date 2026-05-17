import { UKIYOE_STYLES } from '../services/styles';
import type { UkiyoeStyle } from '../types';

interface Props {
  selected: UkiyoeStyle;
  onChange: (style: UkiyoeStyle) => void;
}

export default function StyleSelector({ selected, onChange }: Props) {
  return (
    <div className="grid grid-cols-2 gap-3 p-4">
      {UKIYOE_STYLES.map(style => (
        <button
          key={style.id}
          onClick={() => onChange(style.id)}
          className={`relative p-4 rounded-2xl text-left transition-all duration-200 ${
              selected === style.id ? 'shadow-lg scale-[1.02]' : 'hover:scale-[1.01]'
          }`}
          style={{
            backgroundColor: style.bgColor,
            outline: selected === style.id ? `3px solid ${style.color}` : '1px solid rgba(255,255,255,0.2)',
            outlineOffset: selected === style.id ? '2px' : '0',
          }}
        >
          <div className="flex items-start justify-between mb-2">
            <div>
              <span
                className="text-2xl font-bold"
                style={{ color: style.color, fontFamily: 'serif' }}
              >
                {style.nameJa}
              </span>
              <span className="ml-2 text-xs text-gray-500">{style.name}</span>
            </div>
            {selected === style.id && (
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ backgroundColor: style.color }}
              >
                <svg viewBox="0 0 12 12" className="w-3 h-3" fill="white">
                  <polyline points="1,6 4.5,9.5 11,2" strokeWidth="2" stroke="white" fill="none" />
                </svg>
              </div>
            )}
          </div>
          <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-line">
            {style.description}
          </p>
          <p className="text-xs mt-2 font-medium" style={{ color: style.color }}>
            {style.artist}
          </p>
        </button>
      ))}
    </div>
  );
}
