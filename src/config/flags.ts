/**
 * Feature Flags Configuration
 * 
 * Rules:
 * - Every feature flag has an explicit owner and expiration date.
 * - Clean up flags within 2 weeks of full rollout.
 * - Test both flag states (ON and OFF) in CI.
 */

export interface FeatureFlagMeta {
  readonly key: keyof FeatureFlags;
  readonly name: string;
  readonly description: string;
  readonly owner: string;
  readonly expirationDate: string; // ISO date YYYY-MM-DD
  readonly defaultState: boolean;
}

export interface FeatureFlags {
  /**
   * Gates the new Korean Grammar habit type selector.
   * When false (default): Displays only single Korean Vocabulary tracker.
   * When true: Enables switching between Korean Vocabulary and Korean Grammar habits.
   */
  readonly newHabitType: boolean;
}

export const FEATURE_FLAGS_METADATA: Record<keyof FeatureFlags, FeatureFlagMeta> = {
  newHabitType: {
    key: 'newHabitType',
    name: 'New Habit Type (Grammar)',
    description: 'Enables additional Korean Grammar habit tracking alongside Vocabulary',
    owner: 'frontend-habit-team@local',
    expirationDate: '2026-11-16', // 2-week cleanup target from 2026-11-02 launch
    defaultState: false, // Default is OFF for zero-downtime safe deployment
  },
};

/**
 * Resolves feature flags with hierarchical precedence:
 * 1. Explicit runtime override passed in parameters
 * 2. URL search parameter (?ff_new_habit_type=1|0|true|false)
 * 3. LocalStorage override ('ff_new_habit_type')
 * 4. Build-time environment variable (VITE_FEATURE_NEW_HABIT_TYPE)
 * 5. Default state (false)
 */
export function getFeatureFlags(overrides?: Partial<FeatureFlags>): FeatureFlags {
  if (overrides?.newHabitType !== undefined) {
    return {
      newHabitType: Boolean(overrides.newHabitType),
    };
  }

  // 1. URL search parameter
  if (typeof window !== 'undefined' && window.location?.search) {
    try {
      const params = new URLSearchParams(window.location.search);
      const urlValue = params.get('ff_new_habit_type');
      if (urlValue === '1' || urlValue?.toLowerCase() === 'true') {
        return { newHabitType: true };
      }
      if (urlValue === '0' || urlValue?.toLowerCase() === 'false') {
        return { newHabitType: false };
      }
    } catch {
      // Ignore URL parsing errors
    }
  }

  // 2. LocalStorage override
  if (typeof window !== 'undefined' && window.localStorage) {
    try {
      const stored = window.localStorage.getItem('ff_new_habit_type');
      if (stored === '1' || stored?.toLowerCase() === 'true') {
        return { newHabitType: true };
      }
      if (stored === '0' || stored?.toLowerCase() === 'false') {
        return { newHabitType: false };
      }
    } catch {
      // Ignore storage access errors
    }
  }

  // 3. Build-time environment variable
  const envVal = import.meta.env?.VITE_FEATURE_NEW_HABIT_TYPE;
  if (envVal === '1' || envVal === 'true') {
    return { newHabitType: true };
  }

  // 4. Default state
  return {
    newHabitType: FEATURE_FLAGS_METADATA.newHabitType.defaultState,
  };
}
