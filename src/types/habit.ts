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
