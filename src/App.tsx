import StreakCounter from './components/StreakCounter';
import MarkDoneButton from './components/MarkDoneButton';
import FreezeBank from './components/FreezeBank';
import DeadlineSettings from './components/settings/DeadlineSettings';
import { useHabitTracker } from './hooks/useHabitTracker';

export default function App() {
  const { state, status, isCompletedToday, markDone, setDeadline } =
    useHabitTracker();

  return (
    <main
      id="main-content"
      className="max-w-md mx-auto p-6 space-y-6"
    >
      <header className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">
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

      <footer className="text-center pt-2">
        <p className="text-xs text-slate-500">
          Data stored locally on this device in your browser.
        </p>
      </footer>
    </main>
  );
}
