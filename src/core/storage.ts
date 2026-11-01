import { HabitTrackerState, DEFAULT_STATE } from '../types/habit';

export const STORAGE_KEY = 'korean_vocab_habit_tracker';

export function isValidHabitState(data: unknown): data is HabitTrackerState {
  if (typeof data !== 'object' || data === null) {
    return false;
  }

  const s = data as Record<string, unknown>;

  const isInteger = (val: unknown): val is number =>
    typeof val === 'number' && Number.isInteger(val);

  if (!isInteger(s.streak) || s.streak < 0) {
    return false;
  }

  if (!isInteger(s.freezes) || s.freezes < 0 || s.freezes > 2) {
    return false;
  }

  if (
    !isInteger(s.freezeProgress) ||
    s.freezeProgress < 0 ||
    s.freezeProgress > 2
  ) {
    return false;
  }

  if (
    !isInteger(s.deadlineDays) ||
    s.deadlineDays < 1 ||
    s.deadlineDays > 7
  ) {
    return false;
  }

  if (
    s.lastStudiedDate !== null &&
    (typeof s.lastStudiedDate !== 'string' ||
      !/^\d{4}-\d{2}-\d{2}$/.test(s.lastStudiedDate))
  ) {
    return false;
  }

  return true;
}

export function loadHabitState(): HabitTrackerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_STATE;
    }

    const parsed = JSON.parse(raw);
    if (isValidHabitState(parsed)) {
      return parsed;
    }

    console.warn('LocalStorage contained invalid habit state. Falling back to default.');
    return DEFAULT_STATE;
  } catch (error) {
    console.warn('Failed to parse habit state from localStorage:', error);
    return DEFAULT_STATE;
  }
}

export function saveHabitState(state: HabitTrackerState): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch (error) {
    console.error('Failed to save habit state to localStorage:', error);
  }
}
