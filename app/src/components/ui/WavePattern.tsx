export default function WavePattern({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 400 80"
      className={className}
      preserveAspectRatio="xMidYMid slice"
      aria-hidden="true"
    >
      <defs>
        <style>{`
          .wave-path { fill: none; stroke-width: 2; }
        `}</style>
      </defs>
      {[0, 1, 2, 3].map(i => (
        <path
          key={i}
          className="wave-path"
          stroke={`rgba(255,255,255,${0.08 + i * 0.06})`}
          d={`M${-40 + i * 10},${20 + i * 12}
             C${20 + i * 5},${5 + i * 8} ${60 + i * 5},${35 + i * 8} ${100 + i * 5},${20 + i * 12}
             S${180 + i * 5},${5 + i * 8} ${220 + i * 5},${20 + i * 12}
             S${300 + i * 5},${5 + i * 8} ${340 + i * 5},${20 + i * 12}
             S${420 + i * 5},${5 + i * 8} ${460 + i * 5},${20 + i * 12}`}
        />
      ))}
      <circle cx="360" cy="15" r="8" fill="rgba(255,200,50,0.15)" />
      <circle cx="50" cy="60" r="5" fill="rgba(255,200,50,0.1)" />
    </svg>
  );
}
