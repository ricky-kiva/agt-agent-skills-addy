export type FreezeCount = 0 | 1 | 2;
export type FreezeProgress = 0 | 1 | 2;
export type DeadlineDays = 1 | 2 | 3 | 4 | 5 | 6 | 7;

export interface HabitTrackerState {
  readonly streak: number; // Current streak count (>= 0)
  readonly freezes: FreezeCount; // Banked freezes: 0, 1, or 2
  readonly freezeProgress: FreezeProgress; // Days toward next freeze: 0, 1, or 2
  readonly deadlineDays: number; // Allowed inactivity limit: 1 to 7 (default: 1)
  readonly lastStudiedDate: string | null; // "YYYY-MM-DD" of last study session, or null
}

export const DEFAULT_STATE: Readonly<HabitTrackerState> = {
  streak: 0,
  freezes: 2,
  freezeProgress: 0,
  deadlineDays: 1,
  lastStudiedDate: null,
};

export type HabitType = 'vocabulary' | 'grammar';

export interface HabitDefinition {
  readonly id: HabitType;
  readonly label: string;
  readonly title: string;
  readonly subtitle: string;
  readonly storageKey: string;
}

export const HABIT_DEFINITIONS: Record<HabitType, HabitDefinition> = {
  vocabulary: {
    id: 'vocabulary',
    label: 'Vocabulary',
    title: 'Korean Vocabulary',
    subtitle: 'Daily Vocabulary Habit Tracker',
    storageKey: 'korean_vocab_habit_tracker',
  },
  grammar: {
    id: 'grammar',
    label: 'Grammar',
    title: 'Korean Grammar',
    subtitle: 'Daily Grammar Habit Tracker',
    storageKey: 'korean_grammar_habit_tracker',
  },
};

export const DEFAULT_HABIT_TYPE: HabitType = 'vocabulary';
