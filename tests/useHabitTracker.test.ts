import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import { useHabitTracker } from '../src/hooks/useHabitTracker';
import { STORAGE_KEY } from '../src/core/storage';

describe('useHabitTracker hook', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('initializes with default state and full freezes', () => {
    const { result } = renderHook(() => useHabitTracker('2026-11-01'));

    expect(result.current.state.streak).toBe(0);
    expect(result.current.state.freezes).toBe(2);
    expect(result.current.status).toBe('empty');
    expect(result.current.isCompletedToday).toBe(false);
  });

  it('increments streak and marks completion on markDone()', () => {
    const { result } = renderHook(() => useHabitTracker('2026-11-01'));

    act(() => {
      result.current.markDone();
    });

    expect(result.current.state.streak).toBe(1);
    expect(result.current.isCompletedToday).toBe(true);
    expect(result.current.status).toBe('completed');

    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(persisted.streak).toBe(1);
  });

  it('updates deadline setting on setDeadline()', () => {
    const { result } = renderHook(() => useHabitTracker('2026-11-01'));

    act(() => {
      result.current.setDeadline(5);
    });

    expect(result.current.state.deadlineDays).toBe(5);
    const persisted = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(persisted.deadlineDays).toBe(5);
  });
});
