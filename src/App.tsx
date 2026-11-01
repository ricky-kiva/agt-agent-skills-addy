
export default function App() {
  return (
    <main className="max-w-md mx-auto p-6 space-y-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">Korean Vocabulary</h1>
        <p className="text-sm text-slate-400 mt-1">Start your streak today!</p>
      </header>

      <section className="bg-slate-800 rounded-xl p-6 text-center border border-slate-700">
        <div className="text-6xl font-extrabold text-amber-400">0</div>
        <div className="text-sm text-slate-400 mt-1 uppercase tracking-wide">Day Streak</div>
      </section>

      <section className="bg-slate-800 rounded-xl p-4 border border-slate-700 flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-slate-200">Freeze Bank</div>
          <div className="text-xs text-slate-400">0 / 2 freezes available</div>
        </div>
        <div className="flex space-x-1 text-xl" aria-label="Freeze slots">
          <span className="opacity-40">🧊</span>
          <span className="opacity-40">🧊</span>
        </div>
      </section>

      <section>
        <button
          type="button"
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-lg shadow-md transition-colors"
        >
          Mark Studied Today
        </button>
      </section>
    </main>
  );
}
