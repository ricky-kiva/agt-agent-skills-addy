# Implementation Plan: Korean Vocabulary Habit Tracker

## Overview

Build a lightweight, client-side Korean vocabulary habit tracker in React, TypeScript, and Tailwind CSS. The app persists state exclusively in `localStorage`, tracking streaks with configurable inactivity deadlines (1–7 days) and a 2-slot freeze bank earned every 3 study days.

---

## Architecture Decisions

1. **Pure Domain Logic & Utility Separation:**
   - Keep all streak increments, freeze accruals, and deadline evaluations in pure functions (`src/core/streak-engine.ts`) with zero React or browser dependencies.
   - Group general date calculation helpers (e.g., calendar day diffing, local ISO date extraction) into a dedicated utility directory (`src/utils/date.ts`).
   - Inject calendar date strings (`today: string`, format `YYYY-MM-DD`) to keep calculations 100% deterministic and testable.
2. **Minimal LocalStorage State:**
   - Persist only the 5 required fields defined in `SPEC.md`: `streak`, `freezes`, `freezeProgress`, `deadlineDays`, `lastStudiedDate`.
   - On load, validate data shape and bounds; fallback to `DEFAULT_STATE` if missing or corrupted.
3. **Decoupled UI Components:**
   - Separate the **Streak Counter** (`src/components/StreakCounter.tsx`) from the **Mark Day Done Action** (`src/components/MarkDoneButton.tsx`).
   - Isolate **Freeze Bank stats** (`src/components/FreezeBank.tsx`) from **User Settings** (`src/components/settings/DeadlineSettings.tsx`).
   - Centralize state in a custom hook / root state (`src/App.tsx`) that synchronizes atomically to `localStorage` on any transition.

---

## Dependency Graph

```
Task 1: Project Setup (Vite + React + TS + Tailwind + Vitest)
   │
Task 2: Data Model & LocalStorage Persistence (Types, Defaults, Validation)
   │
Task 3: Pure Streak & Freeze Engine + Date Utils (`src/utils/date.ts`)
   │
   ├── [Checkpoint: Foundation & Domain Logic]
   │
Task 4: Separated Streak Counter & Mark Day Done Components
   │
Task 5: Freeze Bank Stats & Dedicated User Settings Component
   │
Task 6: Application Integration & Smoke Verification
   │
   └── [Checkpoint: Complete System]
```

---

## Detailed Task Breakdown

### Phase 1: Foundation & Domain Logic

#### Task 1: Project Scaffolding & Test Environment Setup
- **Description:** Initialize Vite with React and TypeScript, configure Tailwind CSS, set up Vitest with jsdom and React Testing Library, and define package scripts matching `SPEC.md`.
- **Acceptance criteria:**
  - `package.json` contains `dev`, `build`, `test`, and `lint` scripts.
  - Vitest runs cleanly in a jsdom environment with `@testing-library/react`.
  - Base TypeScript and Tailwind configurations build without errors.
- **Verification:**
  - Tests pass: `npm run test`
  - Build succeeds: `npm run build`
- **Dependencies:** None
- **Files likely touched:**
  - `package.json`
  - `vite.config.ts`
  - `tsconfig.json`
  - `tailwind.config.js`
  - `index.html`
  - `src/main.tsx`
  - `src/App.tsx`
- **Estimated scope:** Medium (M)

#### Task 2: Data Model, Storage Layer & Default Habit Initialization ("add a habit" & "persist to localStorage")
- **Description:** Define `HabitTrackerState` and `DEFAULT_STATE` in `src/types/habit.ts`. Implement `src/core/storage.ts` to load, validate, and write state to `localStorage` under `korean_vocab_habit_tracker`, with automatic fallback to `DEFAULT_STATE` on corrupt/missing data.
- **Acceptance criteria:**
  - Types match `SPEC.md`: `streak`, `freezes` (0–2), `freezeProgress` (0–2), `deadlineDays` (1–7), `lastStudiedDate` (`string | null`).
  - `loadHabitState()` initializes default habit state when storage is empty.
  - `loadHabitState()` safely falls back to defaults when encountering unparseable or out-of-bounds data.
  - `saveHabitState()` writes state atomically to `localStorage`.
- **Verification:**
  - Tests pass: `npm run test -- tests/storage.test.ts`
  - Build succeeds: `npm run build`
- **Dependencies:** Task 1
- **Files likely touched:**
  - `src/types/habit.ts`
  - `src/core/storage.ts`
  - `tests/storage.test.ts`
- **Estimated scope:** Small (S)

#### Task 3: Pure Streak and Freeze Calculation Engine & Dedicated Date Utils ("compute streaks")
- **Description:** Implement calendar date calculations in dedicated `src/utils/date.ts` and pure domain logic in `src/core/streak-engine.ts` for check-ins, freeze accrual, and inactivity deadline evaluation against calendar dates.
- **Acceptance criteria:**
  - `src/utils/date.ts`: provides deterministic date string conversion and calendar day diffing functions.
  - `recordStudySession(state, today)`: increments streak by 1; is idempotent for the same date; increments `freezeProgress`; awards 1 freeze every 3 days (capped at 2).
  - `evaluateInactivity(state, today)`: checks inactivity days against `deadlineDays`. Inactivity $\le$ `deadlineDays` preserves streak; exceeding deadline consumes 1 freeze; exceeding deadline with 0 freezes resets streak to 0.
  - Pure calculation functions accept `today: string` (format `YYYY-MM-DD`) with zero non-deterministic `new Date()` calls inside.
- **Verification:**
  - Tests pass: `npm run test -- tests/streak.test.ts tests/date.test.ts`
  - 100% path coverage on freeze accrual, cap at 2, freeze consumption, and reset to 0.
- **Dependencies:** Task 2
- **Files likely touched:**
  - `src/utils/date.ts`
  - `src/core/streak-engine.ts`
  - `tests/date.test.ts`
  - `tests/streak.test.ts`
- **Estimated scope:** Small (S)

### Checkpoint: Foundation & Domain Logic
- [ ] All unit tests pass (`storage.test.ts`, `date.test.ts`, `streak.test.ts`).
- [ ] Production build succeeds without TypeScript or bundling warnings.
- [ ] Core business logic verified against `SPEC.md`.

---

### Phase 2: User Interface & Feature Slices

#### Task 4: Separated Streak Counter & "Mark Day Done" Action Components ("mark a day done")
- **Description:** Build separate, dedicated components for displaying the streak count (`src/components/StreakCounter.tsx`) and triggering the daily study check-in (`src/components/MarkDoneButton.tsx`).
- **Acceptance criteria:**
  - `StreakCounter.tsx`: displays active streak count with visual flame/momentum indicator.
  - `MarkDoneButton.tsx`: displays an enabled "Mark Studied Today" button when not studied today, and a disabled "Completed Today ✓" button when already completed today.
  - Clicking `MarkDoneButton` fires the check-in callback.
- **Verification:**
  - Tests pass: `npm run test -- tests/StreakCounter.test.tsx tests/MarkDoneButton.test.tsx`
  - Build succeeds: `npm run build`
- **Dependencies:** Task 3
- **Files likely touched:**
  - `src/components/StreakCounter.tsx`
  - `src/components/MarkDoneButton.tsx`
  - `tests/StreakCounter.test.tsx`
  - `tests/MarkDoneButton.test.tsx`
- **Estimated scope:** Small (S)

#### Task 5: Freeze Bank Stats & Dedicated User Settings Component ("show stats")
- **Description:** Build `src/components/FreezeBank.tsx` (strictly for displaying 2-slot freeze bank stats and progress) and a dedicated `src/components/settings/DeadlineSettings.tsx` component (isolated user-settings for the 1–7 day deadline selector and status badge).
- **Acceptance criteria:**
  - `FreezeBank.tsx`: visually renders 2 slots (active vs. empty) and shows "X/3 days to next freeze" when under capacity. Completely isolated from settings logic.
  - `DeadlineSettings.tsx`: isolated settings component allowing selection of inactivity limit (1 to 7 days) and displaying current status indicator (Active, Freeze Used, Reset).
- **Verification:**
  - Tests pass: `npm run test -- tests/FreezeBank.test.tsx tests/DeadlineSettings.test.tsx`
  - Build succeeds: `npm run build`
- **Dependencies:** Task 4
- **Files likely touched:**
  - `src/components/FreezeBank.tsx`
  - `src/components/settings/DeadlineSettings.tsx`
  - `tests/FreezeBank.test.tsx`
  - `tests/DeadlineSettings.test.tsx`
- **Estimated scope:** Small (S)

#### Task 6: Application Integration & Local Persistence Wiring
- **Description:** Wire all components together in `src/App.tsx`. Load state from `localStorage` on mount, run inactivity evaluation on load/visibility change, and persist state updates on check-in or settings adjustments. Add end-to-end smoke tests.
- **Acceptance criteria:**
  - `App.tsx` initializes state from `localStorage` and evaluates inactivity for `today`.
  - Checking in increments streak, awards freezes if earned, and updates `localStorage`.
  - Inactivity exceeding deadline consumes freeze or resets streak appropriately on load.
  - End-to-end integration test verifies the full workflow.
- **Verification:**
  - Tests pass: `npm run test` (full suite passes).
  - Build succeeds: `npm run build`.
  - Smoke test: `tests/App.test.tsx` validates mounting, state transitions, and persistence.
- **Dependencies:** Task 5
- **Files likely touched:**
  - `src/App.tsx`
  - `tests/App.test.tsx`
- **Estimated scope:** Small (S)

### Checkpoint: Complete System
- [ ] All unit, component, and integration tests pass cleanly.
- [ ] Application builds production bundle without errors.
- [ ] End-to-end flow verified against all `SPEC.md` success criteria.

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Timezone / midnight shifts causing premature streak resets | High | Use pure calendar date strings (`YYYY-MM-DD`) via `src/utils/date.ts` and inject `today` explicitly into calculations. |
| Corrupt or outdated `localStorage` data crashing the app | Medium | Implement strict shape & boundary validation in `loadHabitState()` with safe fallback to `DEFAULT_STATE`. |
| Off-by-one errors in multi-day inactivity calculations | Medium | Write comprehensive test matrix in `streak.test.ts` covering 1-day, 2-day, 7-day, and 8-day intervals. |

---

## Open Questions

None. Ready for execution upon plan approval.
