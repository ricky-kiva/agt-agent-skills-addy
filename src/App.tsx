import { useState, useEffect } from 'react';
import StreakCounter from './components/StreakCounter';
import MarkDoneButton from './components/MarkDoneButton';
import FreezeBank from './components/FreezeBank';
import DeadlineSettings from './components/settings/DeadlineSettings';
import { loadHabitState, saveHabitState } from './core/storage';
import {
  recordStudySession,
  evaluateInactivity,
  getHabitStatus,
  HabitStatus,
} from './core/streak-engine';
import { formatLocalDate } from './utils/date';
import { HabitTrackerState } from './types/habit';

export default function App() {
  const [today] = useState(() => formatLocalDate(new Date()));

  const [freezeUsed, setFreezeUsed] = useState<boolean>(() => {
    const loaded = loadHabitState();
    const evaluated = evaluateInactivity(loaded, formatLocalDate(new Date()));
    return evaluated.freezes < loaded.freezes;
  });

  const [state, setState] = useState<HabitTrackerState>(() => {
    const loaded = loadHabitState();
    const evaluated = evaluateInactivity(loaded, formatLocalDate(new Date()));
    if (
      evaluated.streak !== loaded.streak ||
      evaluated.freezes !== loaded.freezes ||
      evaluated.lastStudiedDate !== loaded.lastStudiedDate
    ) {
      saveHabitState(evaluated);
    }
    return evaluated;
  });

  // Re-evaluate on window focus to catch day transitions if left open overnight
  useEffect(() => {
    const checkInactivity = () => {
      const currentToday = formatLocalDate(new Date());
      setState((prev) => {
        const evaluated = evaluateInactivity(prev, currentToday);
        if (evaluated.freezes < prev.freezes) {
          setFreezeUsed(true);
        }
        if (
          evaluated.streak !== prev.streak ||
          evaluated.freezes !== prev.freezes ||
          evaluated.lastStudiedDate !== prev.lastStudiedDate
        ) {
          saveHabitState(evaluated);
          return evaluated;
        }
        return prev;
      });
    };

    window.addEventListener('focus', checkInactivity);
    return () => window.removeEventListener('focus', checkInactivity);
  }, []);

  const handleMarkDone = () => {
    const nextState = recordStudySession(state, today);
    setState(nextState);
    setFreezeUsed(false);
    saveHabitState(nextState);
  };

  const handleDeadlineChange = (deadlineDays: number) => {
    const nextState: HabitTrackerState = {
      ...state,
      deadlineDays,
    };
    setState(nextState);
    saveHabitState(nextState);
  };

  const baseStatus = getHabitStatus(state, today);
  const status: HabitStatus =
    freezeUsed && baseStatus === 'due' ? 'frozen' : baseStatus;
  const isCompletedToday = state.lastStudiedDate === today;

  return (
    <main className="max-w-md mx-auto p-6 space-y-6">
      <header className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          Korean Vocabulary
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-wider">
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
        onMarkDone={handleMarkDone}
      />

      <DeadlineSettings
        deadlineDays={state.deadlineDays}
        status={status}
        onDeadlineChange={handleDeadlineChange}
      />
    </main>
  );
}
