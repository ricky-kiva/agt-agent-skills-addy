import { describe, it, expect } from 'vitest';
import {
  recordStudySession,
  evaluateInactivity,
  getHabitStatus,
} from '../src/core/streak-engine';
import { DEFAULT_STATE, HabitTrackerState } from '../src/types/habit';

describe('Streak Engine', () => {
  describe('recordStudySession', () => {
    it('increments streak and freezeProgress on first study session', () => {
      const state = recordStudySession(DEFAULT_STATE, '2026-11-01');
      expect(state.streak).toBe(1);
      expect(state.freezeProgress).toBe(1);
      expect(state.freezes).toBe(0);
      expect(state.lastStudiedDate).toBe('2026-11-01');
    });

    it('is idempotent when called multiple times on the same date', () => {
      const state1 = recordStudySession(DEFAULT_STATE, '2026-11-01');
      const state2 = recordStudySession(state1, '2026-11-01');
      expect(state2).toEqual(state1);
    });

    it('awards 1 freeze after 3 accumulated study sessions', () => {
      let state = DEFAULT_STATE;
      state = recordStudySession(state, '2026-11-01'); // streak 1, prog 1
      expect(state.freezes).toBe(0);

      state = recordStudySession(state, '2026-11-02'); // streak 2, prog 2
      expect(state.freezes).toBe(0);

      state = recordStudySession(state, '2026-11-03'); // streak 3, awards freeze
      expect(state.streak).toBe(3);
      expect(state.freezes).toBe(1);
      expect(state.freezeProgress).toBe(0);
    });

    it('caps freeze bank at 2 maximum freezes', () => {
      let state = DEFAULT_STATE;
      // 3 days -> 1 freeze
      state = recordStudySession(state, '2026-11-01');
      state = recordStudySession(state, '2026-11-02');
      state = recordStudySession(state, '2026-11-03');
      expect(state.freezes).toBe(1);

      // 6 days -> 2 freezes
      state = recordStudySession(state, '2026-11-04');
      state = recordStudySession(state, '2026-11-05');
      state = recordStudySession(state, '2026-11-06');
      expect(state.freezes).toBe(2);
      expect(state.freezeProgress).toBe(0);

      // 7th day: bank already full, freezes stays at 2, progress stays 0
      state = recordStudySession(state, '2026-11-07');
      expect(state.streak).toBe(7);
      expect(state.freezes).toBe(2);
      expect(state.freezeProgress).toBe(0);
    });
  });

  describe('evaluateInactivity with 1-day deadline', () => {
    const baseState: HabitTrackerState = {
      streak: 5,
      freezes: 1,
      freezeProgress: 2,
      deadlineDays: 1,
      lastStudiedDate: '2026-11-01',
    };

    it('does nothing when streak is 0 and lastStudiedDate is null', () => {
      const state = evaluateInactivity(DEFAULT_STATE, '2026-11-05');
      expect(state).toEqual(DEFAULT_STATE);
    });

    it('preserves streak without penalty when checking in on the same or next day', () => {
      // Same day
      expect(evaluateInactivity(baseState, '2026-11-01')).toEqual(baseState);
      // Next day (1 day inactive <= 1 day deadline)
      expect(evaluateInactivity(baseState, '2026-11-02')).toEqual(baseState);
    });

    it('consumes 1 freeze when 1 deadline interval is missed', () => {
      // 2 days inactive > 1 day deadline -> 1 period missed
      const result = evaluateInactivity(baseState, '2026-11-03');
      expect(result.streak).toBe(5);
      expect(result.freezes).toBe(0);
      expect(result.freezeProgress).toBe(2);
      // The baseline advances so the consumed freeze covers up to that period
      expect(result.lastStudiedDate).toBe('2026-11-02');
    });

    it('resets streak to 0 when deadline is missed with 0 freezes available', () => {
      const noFreezesState: HabitTrackerState = {
        ...baseState,
        freezes: 0,
      };
      const result = evaluateInactivity(noFreezesState, '2026-11-03');
      expect(result.streak).toBe(0);
      expect(result.freezes).toBe(0);
      expect(result.freezeProgress).toBe(0);
    });

    it('consumes both freezes if 2 deadline intervals are missed', () => {
      const twoFreezesState: HabitTrackerState = {
        ...baseState,
        freezes: 2,
      };
      // 3 days inactive with 1-day deadline -> 2 missed intervals
      const result = evaluateInactivity(twoFreezesState, '2026-11-04');
      expect(result.streak).toBe(5);
      expect(result.freezes).toBe(0);
      expect(result.lastStudiedDate).toBe('2026-11-03');
    });

    it('resets to 0 if missed intervals exceed available freezes', () => {
      const oneFreezeState: HabitTrackerState = {
        ...baseState,
        freezes: 1,
      };
      // 3 days inactive with 1-day deadline -> 2 missed intervals > 1 freeze
      const result = evaluateInactivity(oneFreezeState, '2026-11-04');
      expect(result.streak).toBe(0);
      expect(result.freezes).toBe(0);
      expect(result.freezeProgress).toBe(0);
    });
  });

  describe('evaluateInactivity with weekly (7-day) deadline', () => {
    const weeklyState: HabitTrackerState = {
      streak: 4,
      freezes: 1,
      freezeProgress: 1,
      deadlineDays: 7,
      lastStudiedDate: '2026-11-01',
    };

    it('preserves streak when inactivity is within 7 days', () => {
      const result = evaluateInactivity(weeklyState, '2026-11-08');
      expect(result).toEqual(weeklyState);
    });

    it('consumes freeze when inactivity exceeds 7 days (day 8)', () => {
      const result = evaluateInactivity(weeklyState, '2026-11-09');
      expect(result.streak).toBe(4);
      expect(result.freezes).toBe(0);
      expect(result.lastStudiedDate).toBe('2026-11-08');
    });

    it('resets streak to 0 when exceeding 7 days with 0 freezes', () => {
      const noFreezesWeekly: HabitTrackerState = {
        ...weeklyState,
        freezes: 0,
      };
      const result = evaluateInactivity(noFreezesWeekly, '2026-11-09');
      expect(result.streak).toBe(0);
      expect(result.freezes).toBe(0);
      expect(result.freezeProgress).toBe(0);
    });
  });

  describe('getHabitStatus', () => {
    it('returns empty when no study has been recorded', () => {
      expect(getHabitStatus(DEFAULT_STATE, '2026-11-01')).toBe('empty');
    });

    it('returns completed when studied today', () => {
      const state: HabitTrackerState = {
        ...DEFAULT_STATE,
        streak: 1,
        lastStudiedDate: '2026-11-01',
      };
      expect(getHabitStatus(state, '2026-11-01')).toBe('completed');
    });

    it('returns due when not yet studied today within deadline', () => {
      const state: HabitTrackerState = {
        ...DEFAULT_STATE,
        streak: 1,
        lastStudiedDate: '2026-11-01',
      };
      expect(getHabitStatus(state, '2026-11-02')).toBe('due');
    });
  });
});
