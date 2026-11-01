interface MarkDoneButtonProps {
  isCompletedToday: boolean;
  onMarkDone: () => void;
}

export default function MarkDoneButton({
  isCompletedToday,
  onMarkDone,
}: MarkDoneButtonProps) {
  return (
    <section>
      <button
        type="button"
        disabled={isCompletedToday}
        onClick={onMarkDone}
        className={`w-full py-3.5 px-4 rounded-xl font-semibold text-base transition-all shadow-md focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-slate-900 ${
          isCompletedToday
            ? 'bg-slate-700 text-slate-400 cursor-not-allowed border border-slate-600'
            : 'bg-emerald-600 hover:bg-emerald-500 text-white focus:ring-emerald-500 cursor-pointer active:scale-[0.99]'
        }`}
      >
        {isCompletedToday ? 'Completed Today ✓' : 'Mark Studied Today'}
      </button>
    </section>
  );
}
