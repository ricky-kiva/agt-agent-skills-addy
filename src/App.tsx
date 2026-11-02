import StreakCounter from './components/StreakCounter';
import MarkDoneButton from './components/MarkDoneButton';
import FreezeBank from './components/FreezeBank';
import DeadlineSettings from './components/settings/DeadlineSettings';
import { useHabitTracker } from './hooks/useHabitTracker';
import { Badge } from '@/components/ui/badge';

export default function App() {
  const { state, status, isCompletedToday, markDone, setDeadline } =
    useHabitTracker();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col justify-between py-6 sm:py-10">
      <main
        id="main-content"
        className="w-full max-w-md mx-auto px-4 sm:px-6 space-y-5"
      >
        <header className="text-center space-y-1.5 pt-2">
          <div className="flex justify-center">
            <Badge
              variant="outline"
              className="text-[10px] uppercase font-mono tracking-widest border-slate-700/60 text-slate-400 bg-slate-900/40"
            >
              한국어 • VOCABULARY
            </Badge>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
            Korean Vocabulary
          </h1>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
            Daily Vocabulary Habit Tracker
          </p>
        </header>

        <StreakCounter streak={state.streak} />

        <FreezeBank
          freezes={state.freezes}
          freezeProgress={state.freezeProgress}
        />

        <MarkDoneButton
          isCompletedToday={isCompletedToday}
          onMarkDone={markDone}
        />

        <DeadlineSettings
          deadlineDays={state.deadlineDays}
          status={status}
          onDeadlineChange={setDeadline}
        />
      </main>

      <footer className="w-full max-w-md mx-auto px-4 text-center pt-6 pb-2">
        <p className="text-xs text-slate-500">
          Data stored locally on this device in your browser.
        </p>
      </footer>
    </div>
  );
}
