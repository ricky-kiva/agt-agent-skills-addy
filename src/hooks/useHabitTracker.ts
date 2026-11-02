import { useState, useEffect, useCallback } from 'react';
import { loadHabitState, saveHabitState } from '../core/storage';
import {
  recordStudySession,
  evaluateInactivity,
  getHabitStatus,
  HabitStatus,
} from '../core/streak-engine';
import { formatLocalDate } from '../utils/date';
import { HabitTrackerState } from '../types/habit';

export interface UseHabitTrackerReturn {
  state: HabitTrackerState;
  status: HabitStatus;
  isCompletedToday: boolean;
  markDone: () => void;
  setDeadline: (deadlineDays: number) => void;
}

export function useHabitTracker(initialToday?: string): UseHabitTrackerReturn {
  const [initialBoot] = useState(() => {
    const todayStr = initialToday ?? formatLocalDate(new Date());
    const loaded = loadHabitState();
    const evaluated = evaluateInactivity(loaded, todayStr);
    const freezeConsumed = evaluated.freezes < loaded.freezes;
    if (
      evaluated.streak !== loaded.streak ||
      evaluated.freezes !== loaded.freezes ||
      evaluated.lastStudiedDate !== loaded.lastStudiedDate
    ) {
      saveHabitState(evaluated);
    }
    return { evaluated, freezeConsumed, todayStr };
  });

  const [today] = useState(() => initialBoot.todayStr);
  const [freezeUsed, setFreezeUsed] = useState<boolean>(() => initialBoot.freezeConsumed);
  const [state, setState] = useState<HabitTrackerState>(() => initialBoot.evaluated);

  useEffect(() => {
    const checkInactivity = () => {
      const currentToday = initialToday ?? formatLocalDate(new Date());
      setState((prev) => {
        const evaluated = evaluateInactivity(prev, currentToday);
        if (
          evaluated.streak !== prev.streak ||
          evaluated.freezes !== prev.freezes ||
          evaluated.lastStudiedDate !== prev.lastStudiedDate
        ) {
          if (evaluated.freezes < prev.freezes) {
            setFreezeUsed(true);
          }
          saveHabitState(evaluated);
          return evaluated;
        }
        return prev;
      });
    };

    window.addEventListener('focus', checkInactivity);
    return () => window.removeEventListener('focus', checkInactivity);
  }, [initialToday]);

  const markDone = useCallback(() => {
    setState((prev) => {
      const next = recordStudySession(prev, today);
      saveHabitState(next);
      return next;
    });
    setFreezeUsed(false);
  }, [today]);

  const setDeadline = useCallback((deadlineDays: number) => {
    if (!Number.isInteger(deadlineDays) || deadlineDays < 1 || deadlineDays > 7) {
      console.warn(`Invalid deadlineDays: ${deadlineDays}. Must be an integer between 1 and 7.`);
      return;
    }
    setState((prev) => {
      if (prev.deadlineDays === deadlineDays) {
        return prev;
      }
      const next: HabitTrackerState = { ...prev, deadlineDays };
      saveHabitState(next);
      return next;
    });
  }, []);

  const baseStatus = getHabitStatus(state, today);
  const status: HabitStatus =
    freezeUsed && baseStatus === 'due' ? 'frozen' : baseStatus;
  const isCompletedToday = state.lastStudiedDate === today;

  return {
    state,
    status,
    isCompletedToday,
    markDone,
    setDeadline,
  };
}
