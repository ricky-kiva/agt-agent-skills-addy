import { HabitTrackerState, DEFAULT_STATE } from '../types/habit';
import { isValidDateString } from '../utils/date';

export const STORAGE_KEY = 'korean_vocab_habit_tracker';
export const MAX_RAW_STORAGE_LENGTH = 1024;

const ALLOWED_KEYS: Record<string, true> = {
  streak: true,
  freezes: true,
  freezeProgress: true,
  deadlineDays: true,
  lastStudiedDate: true,
};
const ALLOWED_KEY_COUNT = 5;

export function sanitizeHabitState(data: unknown): HabitTrackerState | null {
  if (typeof data !== 'object' || data === null || Array.isArray(data)) {
    return null;
  }

  // Strictly reject extra, prototype-polluting, or unexpected properties
  const keys = Object.keys(data);
  if (keys.length !== ALLOWED_KEY_COUNT) {
    return null;
  }
  for (const key of keys) {
    if (!ALLOWED_KEYS[key]) {
      return null;
    }
  }

  const s = data as Record<string, unknown>;

  const isInteger = (val: unknown): val is number =>
    typeof val === 'number' && Number.isInteger(val);

  // Boundary checks on numeric fields
  if (!isInteger(s.streak) || s.streak < 0 || s.streak > 100_000) {
    return null;
  }

  if (!isInteger(s.freezes) || s.freezes < 0 || s.freezes > 2) {
    return null;
  }

  if (
    !isInteger(s.freezeProgress) ||
    s.freezeProgress < 0 ||
    s.freezeProgress > 2
  ) {
    return null;
  }

  if (
    !isInteger(s.deadlineDays) ||
    s.deadlineDays < 1 ||
    s.deadlineDays > 7
  ) {
    return null;
  }

  // State invariant: bank capacity caps progress at 0
  if (s.freezes === 2 && s.freezeProgress !== 0) {
    return null;
  }

  // State invariant: active streak requires non-null study date
  if (s.streak > 0 && s.lastStudiedDate === null) {
    return null;
  }

  if (s.lastStudiedDate !== null && !isValidDateString(s.lastStudiedDate)) {
    return null;
  }

  // Return freshly constructed, clean, sealed object with only known properties
  return {
    streak: s.streak,
    freezes: s.freezes as HabitTrackerState['freezes'],
    freezeProgress: s.freezeProgress as HabitTrackerState['freezeProgress'],
    deadlineDays: s.deadlineDays,
    lastStudiedDate: s.lastStudiedDate,
  };
}

export function isValidHabitState(data: unknown): data is HabitTrackerState {
  return sanitizeHabitState(data) !== null;
}
export function loadHabitState(): HabitTrackerState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return DEFAULT_STATE;
    }

    // Guard against oversized payload (DoS)
    if (raw.length > MAX_RAW_STORAGE_LENGTH) {
      console.warn('LocalStorage habit state payload exceeds size limit. Falling back to default.');
      return DEFAULT_STATE;
    }

    const parsed = JSON.parse(raw);
    const sanitized = sanitizeHabitState(parsed);
    if (sanitized !== null) {
      return sanitized;
    }

    console.warn('LocalStorage contained invalid habit state. Falling back to default.');
    return DEFAULT_STATE;
  } catch (error) {
    console.warn('Failed to parse habit state from localStorage:', error);
    return DEFAULT_STATE;
  }
}

export function saveHabitState(state: HabitTrackerState): boolean {
  try {
    const sanitized = sanitizeHabitState(state);
    if (sanitized === null) {
      console.error('Refusing to persist invalid habit state to localStorage:', state);
      return false;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(sanitized));
    return true;
  } catch (error) {
    console.error('Failed to save habit state to localStorage:', error);
    return false;
  }
}
