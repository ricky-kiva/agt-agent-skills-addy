# Task List: Korean Vocabulary Habit Tracker

## Phase 1: Foundation & Domain Logic

- [x] Task 1: Project Scaffolding & Test Environment Setup
  - Acceptance: `package.json` configures scripts; Vitest + jsdom + RTL runs; Vite + React + TS + Tailwind builds clean.
  - Verify: `npm run test`, `npm run build`
  - Files: `package.json`, `vite.config.ts`, `tsconfig.json`, `tailwind.config.js`, `index.html`, `src/main.tsx`, `src/App.tsx`
- [x] Task 2: Data Model, Storage Layer & Default Habit Initialization ("add a habit" & "persist to localStorage")
  - Acceptance: Schema matches `SPEC.md`; `loadHabitState` validates and falls back to `DEFAULT_STATE`; `saveHabitState` persists atomically.
  - Verify: `npm run test -- tests/storage.test.ts`, `npm run build`
  - Files: `src/types/habit.ts`, `src/core/storage.ts`, `tests/storage.test.ts`
- [x] Task 3: Pure Streak and Freeze Calculation Engine & Dedicated Date Utils ("compute streaks")
  - Acceptance: Pure functions in `src/utils/date.ts` for calendar day calculations; `src/core/streak-engine.ts` for check-ins, freeze accrual, and deadline evaluation.
  - Verify: `npm run test -- tests/streak.test.ts tests/date.test.ts`
  - Files: `src/utils/date.ts`, `src/core/streak-engine.ts`, `tests/date.test.ts`, `tests/streak.test.ts`

### Checkpoint: Foundation & Domain Logic
- [x] All unit tests pass (`storage.test.ts`, `date.test.ts`, `streak.test.ts`)
- [x] Clean build with zero TypeScript or bundling errors
- [x] Review domain logic against SPEC.md requirements

---

## Phase 2: User Interface & Feature Slices

- [x] Task 4: Separated Streak Counter & "Mark Day Done" Action Components ("mark a day done")
  - Acceptance: `StreakCounter.tsx` displays active streak count; `MarkDoneButton.tsx` displays enabled "Mark Studied Today" or disabled "Completed Today ✓" and triggers check-in.
  - Verify: `npm run test -- tests/StreakCounter.test.tsx tests/MarkDoneButton.test.tsx`
  - Files: `src/components/StreakCounter.tsx`, `src/components/MarkDoneButton.tsx`, `tests/StreakCounter.test.tsx`, `tests/MarkDoneButton.test.tsx`
- [x] Task 5: Freeze Bank Stats & Dedicated User Settings Component ("show stats")
  - Acceptance: `FreezeBank.tsx` isolated for 2-slot freeze bank stats and progress; `DeadlineSettings.tsx` isolated in `src/components/settings/` for deadline selection and status.
  - Verify: `npm run test -- tests/FreezeBank.test.tsx tests/DeadlineSettings.test.tsx`, `npm run build`
  - Files: `src/components/FreezeBank.tsx`, `src/components/settings/DeadlineSettings.tsx`, `tests/FreezeBank.test.tsx`, `tests/DeadlineSettings.test.tsx`
- [x] Task 6: Application Integration & Local Persistence Wiring
  - Acceptance: `App.tsx` connects state to `localStorage` on boot; runs deadline checks; updates and persists state on check-ins and settings changes; smoke tests verify full user flow.
  - Verify: `npm run test`, `npm run build`, `tests/App.test.tsx`
  - Files: `src/App.tsx`, `tests/App.test.tsx`

### Checkpoint: Complete System
- [x] Full test suite passes cleanly
- [x] Production build succeeds
- [x] All SPEC.md acceptance criteria and behaviors verified
