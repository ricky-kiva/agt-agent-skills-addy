import { HabitType, HABIT_DEFINITIONS } from '../types/habit';

interface HabitTypeSelectorProps {
  readonly activeHabitType: HabitType;
  readonly onSelectHabitType: (type: HabitType) => void;
}

export default function HabitTypeSelector({
  activeHabitType,
  onSelectHabitType,
}: HabitTypeSelectorProps) {
  const habits = Object.values(HABIT_DEFINITIONS);

  return (
    <div
      role="tablist"
      aria-label="Habit type selector"
      className="flex p-1 bg-slate-900/90 border border-slate-800 rounded-xl max-w-xs mx-auto shadow-sm"
    >
      {habits.map((habit) => {
        const isSelected = habit.id === activeHabitType;
        return (
          <button
            key={habit.id}
            type="button"
            role="tab"
            id={`tab-${habit.id}`}
            aria-selected={isSelected}
            aria-controls={`panel-${habit.id}`}
            tabIndex={isSelected ? 0 : -1}
            onClick={() => onSelectHabitType(habit.id)}
            className={`flex-1 py-1.5 px-3 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 ${
              isSelected
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60'
            }`}
          >
            {habit.label}
          </button>
        );
      })}
    </div>
  );
}
