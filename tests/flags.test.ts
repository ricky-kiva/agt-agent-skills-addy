import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { getFeatureFlags, FEATURE_FLAGS_METADATA } from '../src/config/flags';

describe('Feature Flags Configuration', () => {
  const originalLocation = window.location;

  beforeEach(() => {
    localStorage.clear();
  });

  afterEach(() => {
    // Restore window.location
    Object.defineProperty(window, 'location', {
      value: originalLocation,
      writable: true,
    });
  });

  it('has mandatory ownership, description, and expiration metadata', () => {
    const meta = FEATURE_FLAGS_METADATA.newHabitType;
    expect(meta.owner).toBe('frontend-habit-team@local');
    expect(meta.expirationDate).toBe('2026-11-16');
    expect(meta.defaultState).toBe(false);
    expect(meta.description).toBeTruthy();
  });

  it('defaults to false (flag OFF) in standard production configuration', () => {
    const flags = getFeatureFlags();
    expect(flags.newHabitType).toBe(false);
  });

  it('honors programmatic overrides', () => {
    expect(getFeatureFlags({ newHabitType: true }).newHabitType).toBe(true);
    expect(getFeatureFlags({ newHabitType: false }).newHabitType).toBe(false);
  });

  it('reads flag activation from URL query search parameters', () => {
    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost:5173/?ff_new_habit_type=1'),
      writable: true,
    });
    expect(getFeatureFlags().newHabitType).toBe(true);

    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost:5173/?ff_new_habit_type=true'),
      writable: true,
    });
    expect(getFeatureFlags().newHabitType).toBe(true);

    Object.defineProperty(window, 'location', {
      value: new URL('http://localhost:5173/?ff_new_habit_type=0'),
      writable: true,
    });
    expect(getFeatureFlags().newHabitType).toBe(false);
  });

  it('reads flag activation from localStorage override', () => {
    localStorage.setItem('ff_new_habit_type', '1');
    expect(getFeatureFlags().newHabitType).toBe(true);

    localStorage.setItem('ff_new_habit_type', '0');
    expect(getFeatureFlags().newHabitType).toBe(false);
  });
});
