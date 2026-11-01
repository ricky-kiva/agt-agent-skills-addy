interface StreakCounterProps {
  streak: number;
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  const isZero = streak === 0;

  return (
    <section
      aria-label="Streak Counter"
      className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700 shadow-sm"
    >
      <div
        className="flex items-center justify-center space-x-3"
      >
        <span
          role="img"
          aria-label="Streak status"
          className="text-4xl select-none"
        >
          {isZero ? '✨' : '🔥'}
        </span>
        <span className="text-6xl font-black text-amber-400 tracking-tight font-mono">
          {streak}
        </span>
      </div>
      <div className="text-sm font-semibold text-slate-300 mt-2 uppercase tracking-wider">
        {isZero ? 'Start your streak today!' : 'Day Streak'}
      </div>
    </section>
  );
}
