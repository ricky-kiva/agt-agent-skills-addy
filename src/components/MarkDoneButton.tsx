interface MarkDoneButtonProps {
  isCompletedToday: boolean;
  onMarkDone: () => void;
}

export default function MarkDoneButton({
  isCompletedToday,
  onMarkDone,
}: MarkDoneButtonProps) {
  return (
    <section aria-label="Habit Completion Action">
      <button
        type="button"
        disabled={isCompletedToday}
        aria-disabled={isCompletedToday}
        onClick={onMarkDone}
        className={`w-full py-3.5 px-4 rounded-xl font-semibold text-base transition-all duration-150 shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900 ${
          isCompletedToday
            ? 'bg-slate-700/80 text-slate-400 cursor-not-allowed border border-slate-600/80'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white focus-visible:ring-emerald-400 cursor-pointer active:scale-[0.98]'
        }`}
      >
        {isCompletedToday ? 'Completed Today ✓' : 'Mark Studied Today'}
      </button>
    </section>
  );
}
