interface TimerProps {
  remainingSec: number;
}

export default function Timer({ remainingSec }: TimerProps) {
  const m = Math.floor(remainingSec / 60).toString().padStart(2, '0');
  const s = (remainingSec % 60).toString().padStart(2, '0');
  const isWarning = remainingSec <= 300;

  return (
    <div className={`font-mono text-2xl font-bold tabular-nums ${isWarning ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
      {m}:{s}
    </div>
  );
}
