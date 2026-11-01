interface StreakCounterProps {
  streak: number;
}

export default function StreakCounter({ streak }: StreakCounterProps) {
  return (
    <section className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700 shadow-sm">
      <div className="flex items-center justify-center space-x-2">
        <span
          role="img"
          aria-label="Streak status"
          className="text-4xl"
        >
          {streak > 0 ? '🔥' : '✨'}
        </span>
        <span className="text-6xl font-extrabold text-amber-400 tracking-tight">
          {streak}
        </span>
      </div>
      <div className="text-sm font-medium text-slate-400 mt-2 uppercase tracking-wide">
        {streak === 0 ? 'Start your streak today!' : 'Day Streak'}
      </div>
    </section>
  );
}
