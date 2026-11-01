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
  const [today] = useState(() => initialToday ?? formatLocalDate(new Date()));

  const [freezeUsed, setFreezeUsed] = useState<boolean>(() => {
    const loaded = loadHabitState();
    const evaluated = evaluateInactivity(
      loaded,
      initialToday ?? formatLocalDate(new Date())
    );
    return evaluated.freezes < loaded.freezes;
  });

  const [state, setState] = useState<HabitTrackerState>(() => {
    const loaded = loadHabitState();
    const evaluated = evaluateInactivity(
      loaded,
      initialToday ?? formatLocalDate(new Date())
    );
    if (
      evaluated.streak !== loaded.streak ||
      evaluated.freezes !== loaded.freezes ||
      evaluated.lastStudiedDate !== loaded.lastStudiedDate
    ) {
      saveHabitState(evaluated);
    }
    return evaluated;
  });

  useEffect(() => {
    const checkInactivity = () => {
      const currentToday = formatLocalDate(new Date());
      setState((prev) => {
        const evaluated = evaluateInactivity(prev, currentToday);
        if (evaluated.freezes < prev.freezes) {
          setFreezeUsed(true);
        }
        if (
          evaluated.streak !== prev.streak ||
          evaluated.freezes !== prev.freezes ||
          evaluated.lastStudiedDate !== prev.lastStudiedDate
        ) {
          saveHabitState(evaluated);
          return evaluated;
        }
        return prev;
      });
    };

    window.addEventListener('focus', checkInactivity);
    return () => window.removeEventListener('focus', checkInactivity);
  }, []);

  const markDone = useCallback(() => {
    setState((prev) => {
      const next = recordStudySession(prev, today);
      saveHabitState(next);
      return next;
    });
    setFreezeUsed(false);
  }, [today]);

  const setDeadline = useCallback((deadlineDays: number) => {
    setState((prev) => {
      const next = { ...prev, deadlineDays };
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
