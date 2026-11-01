import { HabitTrackerState } from '../types/habit';
import { getCalendarDaysBetween, addDays } from '../utils/date';

export type HabitStatus = 'empty' | 'completed' | 'due' | 'frozen' | 'reset';

export function evaluateInactivity(
  state: HabitTrackerState,
  today: string
): HabitTrackerState {
  if (state.lastStudiedDate === null || state.streak === 0) {
    return state;
  }

  const daysInactive = getCalendarDaysBetween(state.lastStudiedDate, today);
  if (daysInactive <= state.deadlineDays) {
    return state;
  }

  const periodsMissed = Math.floor((daysInactive - 1) / state.deadlineDays);
  if (periodsMissed <= 0) {
    return state;
  }

  if (periodsMissed <= state.freezes) {
    return {
      ...state,
      freezes: state.freezes - periodsMissed,
      lastStudiedDate: addDays(
        state.lastStudiedDate,
        periodsMissed * state.deadlineDays
      ),
    };
  }

  // Missed deadlines exceed available freezes -> streak drops to 0
  return {
    ...state,
    streak: 0,
    freezes: 0,
    freezeProgress: 0,
  };
}

export function recordStudySession(
  state: HabitTrackerState,
  today: string
): HabitTrackerState {
  if (state.lastStudiedDate === today) {
    return state;
  }

  const evaluated = evaluateInactivity(state, today);

  const nextStreak = evaluated.streak + 1;
  let nextFreezes = evaluated.freezes;
  let nextProgress = evaluated.freezeProgress;

  if (nextFreezes < 2) {
    nextProgress += 1;
    if (nextProgress >= 3) {
      nextFreezes += 1;
      nextProgress = 0;
    }
  } else {
    nextProgress = 0;
  }

  return {
    ...evaluated,
    streak: nextStreak,
    freezes: nextFreezes,
    freezeProgress: nextProgress,
    lastStudiedDate: today,
  };
}

export function getHabitStatus(
  state: HabitTrackerState,
  today: string
): HabitStatus {
  if (state.lastStudiedDate === null && state.streak === 0) {
    return 'empty';
  }

  if (state.lastStudiedDate === today) {
    return 'completed';
  }

  const daysInactive = getCalendarDaysBetween(state.lastStudiedDate ?? today, today);
  if (daysInactive > state.deadlineDays) {
    if (state.freezes > 0) {
      return 'frozen';
    }
    return 'reset';
  }

  if (state.streak === 0) {
    return 'reset';
  }

  return 'due';
}
