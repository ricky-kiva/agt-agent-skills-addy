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
    <section className="bg-slate-800 rounded-xl p-4 border border-slate-700 shadow-sm flex items-center justify-between">
      <div className="space-y-1">
        <div className="text-sm font-semibold text-slate-200">Freeze Bank</div>
        <div className="text-xs text-slate-400">
          {freezes} / 2 freezes available
        </div>
        <div className="text-xs text-amber-300 font-medium">
          {isFull
            ? 'Bank full'
            : `${freezeProgress}/3 days to next freeze`}
        </div>
      </div>

      <div
        className="flex space-x-2 text-2xl"
        aria-label="Freeze slots"
      >
        <span
          className={`transition-opacity duration-200 ${
            freezes >= 1 ? 'opacity-100 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'opacity-25 grayscale'
          }`}
        >
          🧊
        </span>
        <span
          className={`transition-opacity duration-200 ${
            freezes >= 2 ? 'opacity-100 drop-shadow-[0_0_8px_rgba(56,189,248,0.5)]' : 'opacity-25 grayscale'
          }`}
        >
          🧊
        </span>
      </div>
    </section>
  );
}
