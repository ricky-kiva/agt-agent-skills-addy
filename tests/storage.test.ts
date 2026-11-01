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

  it('falls back to DEFAULT_STATE when payload contains prototype pollution keys or extra properties', () => {
    // Extraneous injection property
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        ...DEFAULT_STATE,
        maliciousScript: '<script>alert("xss")</script>',
      })
    );
    expect(loadHabitState()).toEqual(DEFAULT_STATE);

    // Prototype pollution payload
    localStorage.setItem(
      STORAGE_KEY,
      '{"__proto__":{"polluted":true},"streak":0,"freezes":2,"freezeProgress":0,"deadlineDays":1,"lastStudiedDate":null}'
    );
    expect(loadHabitState()).toEqual(DEFAULT_STATE);
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it('falls back to DEFAULT_STATE on non-object JSON values or arrays', () => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([DEFAULT_STATE]));
    expect(loadHabitState()).toEqual(DEFAULT_STATE);

    localStorage.setItem(STORAGE_KEY, JSON.stringify(12345));
    expect(loadHabitState()).toEqual(DEFAULT_STATE);

    localStorage.setItem(STORAGE_KEY, JSON.stringify('plain-string'));
    expect(loadHabitState()).toEqual(DEFAULT_STATE);
  });

  it('falls back to DEFAULT_STATE when logical state invariants are violated', () => {
    // Streak > 0 but lastStudiedDate is null
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        streak: 5,
        freezes: 2,
        freezeProgress: 0,
        deadlineDays: 1,
        lastStudiedDate: null,
      })
    );
    expect(loadHabitState()).toEqual(DEFAULT_STATE);

    // Full freezes (2) but non-zero freeze progress
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        streak: 5,
        freezes: 2,
        freezeProgress: 1,
        deadlineDays: 1,
        lastStudiedDate: '2026-11-01',
      })
    );
    expect(loadHabitState()).toEqual(DEFAULT_STATE);
  });

  it('falls back to DEFAULT_STATE when lastStudiedDate is invalid or contains XSS strings', () => {
    // Non-existent calendar date
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        streak: 1,
        freezes: 2,
        freezeProgress: 0,
        deadlineDays: 1,
        lastStudiedDate: '2026-02-31',
      })
    );
    expect(loadHabitState()).toEqual(DEFAULT_STATE);

    // Script injection in date string
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        streak: 1,
        freezes: 2,
        freezeProgress: 0,
        deadlineDays: 1,
        lastStudiedDate: '<script>alert(1)</script>',
      })
    );
    expect(loadHabitState()).toEqual(DEFAULT_STATE);
  });

  it('falls back to DEFAULT_STATE on oversized localStorage payloads', () => {
    const hugeString = 'x'.repeat(2048);
    localStorage.setItem(STORAGE_KEY, `{"streak": 0, "pad": "${hugeString}"}`);
    expect(loadHabitState()).toEqual(DEFAULT_STATE);
  });

  it('refuses to save invalid habit state in saveHabitState()', () => {
    const invalid = {
      streak: -1,
      freezes: 2,
      freezeProgress: 0,
      deadlineDays: 1,
      lastStudiedDate: null,
    } as unknown as HabitTrackerState;

    const success = saveHabitState(invalid);
    expect(success).toBe(false);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
