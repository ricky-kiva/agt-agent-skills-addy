export interface HabitTrackerState {
  streak: number; // Current streak count (>= 0)
  freezes: number; // Banked freezes: 0, 1, or 2
  freezeProgress: number; // Days toward next freeze: 0, 1, or 2 (at 3, +1 freeze)
  deadlineDays: number; // Allowed inactivity limit: 1 to 7 (default: 1)
  lastStudiedDate: string | null; // "YYYY-MM-DD" of last study session, or null
}

export const DEFAULT_STATE: HabitTrackerState = {
  streak: 0,
  freezes: 2,
  freezeProgress: 0,
  deadlineDays: 1,
  lastStudiedDate: null,
};
