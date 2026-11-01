import { useState, useEffect, useCallback, useRef } from 'react';
import { loadHabitState, saveHabitState, STORAGE_KEY } from '../core/storage';
import {
  recordStudySession,
  evaluateInactivity,
  getHabitStatus,
  HabitStatus,
} from '../core/streak-engine';
import { formatLocalDate } from '../utils/date';
import { HabitTrackerState, HabitType, DEFAULT_HABIT_TYPE, HABIT_DEFINITIONS } from '../types/habit';

export interface UseHabitTrackerReturn {
  state: HabitTrackerState;
  status: HabitStatus;
  isCompletedToday: boolean;
  markDone: () => void;
  setDeadline: (deadlineDays: number) => void;
}

export function useHabitTracker(
  initialToday?: string,
  habitType: HabitType = DEFAULT_HABIT_TYPE
): UseHabitTrackerReturn {
  const storageKey = HABIT_DEFINITIONS[habitType]?.storageKey ?? STORAGE_KEY;

  const loadAndEvaluate = useCallback((key: string, todayStr: string) => {
    const loaded = loadHabitState(key);
    const evaluated = evaluateInactivity(loaded, todayStr);
    const freezeConsumed = evaluated.freezes < loaded.freezes;
    if (
      evaluated.streak !== loaded.streak ||
      evaluated.freezes !== loaded.freezes ||
      evaluated.lastStudiedDate !== loaded.lastStudiedDate
    ) {
      saveHabitState(evaluated, key);
    }
    return { evaluated, freezeConsumed };
  }, []);

  const [initialBoot] = useState(() => {
    const todayStr = initialToday ?? formatLocalDate(new Date());
    const bootResult = loadAndEvaluate(storageKey, todayStr);
    return { ...bootResult, todayStr };
  });

  const [today] = useState(() => initialBoot.todayStr);
  const [state, setState] = useState<HabitTrackerState>(() => initialBoot.evaluated);
  const [freezeUsed, setFreezeUsed] = useState<boolean>(() => initialBoot.freezeConsumed);

  const prevStorageKeyRef = useRef<string>(storageKey);

  // Synchronize when switching habit type
  useEffect(() => {
    if (prevStorageKeyRef.current !== storageKey) {
      prevStorageKeyRef.current = storageKey;
      const { evaluated, freezeConsumed } = loadAndEvaluate(storageKey, today);
      setState(evaluated);
      setFreezeUsed(freezeConsumed);
    }
  }, [storageKey, today, loadAndEvaluate]);
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
          saveHabitState(evaluated, storageKey);
          return evaluated;
        }
        return prev;
      });
    };

    window.addEventListener('focus', checkInactivity);
    return () => window.removeEventListener('focus', checkInactivity);
  }, [initialToday, storageKey]);

  const markDone = useCallback(() => {
    setState((prev) => {
      const next = recordStudySession(prev, today);
      saveHabitState(next, storageKey);
      return next;
    });
    setFreezeUsed(false);
  }, [today, storageKey]);

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
      saveHabitState(next, storageKey);
      return next;
    });
  }, [storageKey]);

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
