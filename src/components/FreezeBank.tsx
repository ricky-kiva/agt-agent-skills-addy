interface FreezeBankProps {
  freezes: number;
  freezeProgress: number;
}

export default function FreezeBank({
  freezes,
  freezeProgress,
}: FreezeBankProps) {
  const isFull = freezes >= 2;

  return (
    <section
      aria-label="Streak Freeze Bank"
      className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-sm flex items-center justify-between"
    >
      <div className="space-y-1">
        <h2 className="text-sm font-semibold text-slate-200">Freeze Bank</h2>
        <div className="text-xs text-slate-300 font-medium">
          {freezes} / 2 freezes available
        </div>
        <div className="text-xs text-amber-300 font-medium">
          {isFull ? 'Bank full' : `${freezeProgress}/3 days to next freeze`}
        </div>
      </div>

      <div
        className="flex space-x-2 text-2xl select-none"
        aria-label="Freeze slots"
        role="group"
      >
        <span
          role="img"
          aria-label={`Freeze slot 1: ${freezes >= 1 ? 'active' : 'empty'}`}
          className={`transition-all duration-200 ${
            freezes >= 1
              ? 'opacity-100 scale-105'
              : 'opacity-25 grayscale'
          }`}
        >
          🧊
        </span>
        <span
          role="img"
          aria-label={`Freeze slot 2: ${freezes >= 2 ? 'active' : 'empty'}`}
          className={`transition-all duration-200 ${
            freezes >= 2
              ? 'opacity-100 scale-105'
              : 'opacity-25 grayscale'
          }`}
        >
          🧊
        </span>
      </div>
    </section>
  );
}
