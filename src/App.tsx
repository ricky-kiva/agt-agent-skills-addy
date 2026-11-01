import { useState } from 'react';
import StreakCounter from './components/StreakCounter';
import MarkDoneButton from './components/MarkDoneButton';
import FreezeBank from './components/FreezeBank';
import DeadlineSettings from './components/settings/DeadlineSettings';
import HabitTypeSelector from './components/HabitTypeSelector';
import { useHabitTracker } from './hooks/useHabitTracker';
import { getFeatureFlags, FeatureFlags } from './config/flags';
import {
  HabitType,
  HABIT_DEFINITIONS,
  DEFAULT_HABIT_TYPE,
} from './types/habit';
import { loadActiveHabitType, saveActiveHabitType } from './core/storage';

interface AppProps {
  readonly flags?: Partial<FeatureFlags>;
  readonly initialToday?: string;
}

export default function App({ flags: flagOverrides, initialToday }: AppProps = {}) {
  const flags = getFeatureFlags(flagOverrides);
  const [activeHabitType, setActiveHabitType] = useState<HabitType>(() => {
    if (flags.newHabitType) {
      return loadActiveHabitType();
    }
    return DEFAULT_HABIT_TYPE;
  });

  const handleSelectHabit = (type: HabitType) => {
    setActiveHabitType(type);
    saveActiveHabitType(type);
  };

  const activeDefinition =
    HABIT_DEFINITIONS[activeHabitType] ?? HABIT_DEFINITIONS.vocabulary;

  const { state, status, isCompletedToday, markDone, setDeadline } =
    useHabitTracker(initialToday, activeHabitType);

  return (
    <main
      id="main-content"
      className="max-w-md mx-auto p-6 space-y-6"
    >
      {flags.newHabitType && (
        <nav aria-label="Habit selection">
          <HabitTypeSelector
            activeHabitType={activeHabitType}
            onSelectHabitType={handleSelectHabit}
          />
        </nav>
      )}

      <header className="text-center space-y-1">
        <h1 className="text-2xl font-bold tracking-tight text-white">
          {activeDefinition.title}
        </h1>
        <p className="text-xs text-slate-400 uppercase tracking-widest font-medium">
          {activeDefinition.subtitle}
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
