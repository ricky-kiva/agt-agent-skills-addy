import { describe, it, expect, beforeEach } from 'vitest';
import { loadHabitState, saveHabitState, STORAGE_KEY } from '../src/core/storage';
import { DEFAULT_STATE, HabitTrackerState } from '../src/types/habit';

describe('LocalStorage Storage Layer', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('loads DEFAULT_STATE when localStorage is empty', () => {
    const state = loadHabitState();
    expect(state).toEqual(DEFAULT_STATE);
  });

  it('saves and reloads a valid habit tracker state', () => {
    const customState: HabitTrackerState = {
      streak: 5,
      freezes: 1,
      freezeProgress: 2,
      deadlineDays: 3,
      lastStudiedDate: '2026-11-01',
    };

    saveHabitState(customState);
    const loaded = loadHabitState();
    expect(loaded).toEqual(customState);
  });

  it('falls back to DEFAULT_STATE when localStorage contains corrupted JSON', () => {
    localStorage.setItem(STORAGE_KEY, '{invalid-json:');
    const state = loadHabitState();
    expect(state).toEqual(DEFAULT_STATE);
  });

  it('falls back to DEFAULT_STATE when state has invalid types or missing keys', () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        streak: 'not-a-number',
        freezes: 1,
      })
    );
    const state = loadHabitState();
    expect(state).toEqual(DEFAULT_STATE);
  });

  it('falls back to DEFAULT_STATE when numeric fields violate boundary invariants', () => {
    // Negative streak
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...DEFAULT_STATE,
        streak: -1,
      })
    );
    expect(loadHabitState()).toEqual(DEFAULT_STATE);

    // Freezes > 2
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...DEFAULT_STATE,
        freezes: 3,
      })
    );
    expect(loadHabitState()).toEqual(DEFAULT_STATE);

    // Freeze progress not in 0..2
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...DEFAULT_STATE,
        freezeProgress: 3,
      })
    );
    expect(loadHabitState()).toEqual(DEFAULT_STATE);

    // Deadline outside 1..7
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...DEFAULT_STATE,
        deadlineDays: 8,
      })
    );
    expect(loadHabitState()).toEqual(DEFAULT_STATE);
  });
});
