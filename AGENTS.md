# AGENTS.md

## Project Overview
Client-side Korean Vocabulary habit tracking web app built with React, TypeScript, and Tailwind CSS. The app tracks daily study streaks, awards streak freezes (max 2) every 3 study sessions, provides configurable inactivity deadlines (1–7 days), and persists state strictly to browser `localStorage`. No backend or external database.

---

## Tech Stack
- **Framework:** React 18.3 (Strict Mode)
- **Language:** TypeScript 5.7 (strict mode, isolated modules, ES2020 target)
- **Build & Dev Tool:** Vite 6.1
- **Styling:** Tailwind CSS 3.4 (dark slate palette, amber/emerald/rose accents)
- **Testing:** Vitest 3.0, Testing Library (`@testing-library/react`, `@testing-library/jest-dom`), jsdom

---

## Directory Structure
```
├── src/
│   ├── components/         # Presentational UI components (props down, events up)
│   │   ├── ui/             # shadcn/ui shared primitives (Button, Card, Badge, Progress)
│   │   ├── settings/       # Settings subcomponents (e.g., DeadlineSettings.tsx)
│   │   ├── ErrorBoundary.tsx
│   │   ├── FreezeBank.tsx
│   │   ├── MarkDoneButton.tsx
│   │   └── StreakCounter.tsx
│   ├── lib/
│   │   └── utils.ts        # cn() className merging utility
│   ├── core/               # Pure domain logic & persistence (no React/DOM dependencies)
│   │   ├── storage.ts      # LocalStorage serialization, validation, and sanitization
│   │   └── streak-engine.ts # Inactivity evaluation, streak recording, status calculation
│   ├── hooks/              # Custom React hooks orchestrating core logic
│   │   └── useHabitTracker.ts
│   ├── types/              # Domain interfaces and default state
│   │   └── habit.ts
│   ├── utils/              # Pure utilities
│   │   └── date.ts         # Calendar day math and YYYY-MM-DD formatting
│   ├── App.tsx             # Root application view
│   ├── main.tsx            # DOM root mounting & ErrorBoundary wrapping
│   └── index.css           # Tailwind directives & base styles
├── tests/                  # Root-level test suite (unit and component integration tests)
│   ├── setup.ts            # Test setup (@testing-library/jest-dom/vitest)
│   ├── storage.test.ts
│   ├── streak.test.ts
│   ├── useHabitTracker.test.ts
│   └── *.test.tsx
├── public/                 # Static assets and deployment headers/redirects
├── index.html
├── package.json
├── tsconfig.json
└── vite.config.ts
```

---

## Commands

| Action | Command |
|---|---|
| Start dev server | `npm run dev` |
| Run all tests | `npm test` (or `npx vitest run`) |
| Run single test file | `npx vitest run tests/<filename>` |
| Run tests in watch mode | `npx vitest` |
| Type check / Lint | `npm run lint` (`tsc --noEmit`) |
| Production build | `npm run build` (`tsc && vite build`) |

---

## Code Conventions

### Architecture & Separation of Concerns
1. **Pure Domain Logic in `src/core/`:** All streak calculations, freeze logic, and storage validation must be pure TypeScript functions independent of React or DOM APIs.
2. **State Orchestration in `src/hooks/`:** React state, effects, and interaction handlers reside in `useHabitTracker`.
3. **Presentational Components in `src/components/`:** Accept props, emit events via callbacks, and contain zero direct storage calls.

### Exports & Imports
- **Components:** Default exports for application views (`export default function ComponentName(props: ComponentNameProps) { ... }`). Named exports for shadcn UI primitives in `src/components/ui/` (`export { Button, buttonVariants }`).
- **Core, Hooks, Utils, Types:** Named exports (`export function recordStudySession`, `export interface HabitTrackerState`).
- **Module Resolution:** Relative paths or `@/*` alias mapped to `./src/*` (`import { cn } from '@/lib/utils'`).

### Component Design
- Define a dedicated interface for props: `interface <ComponentName>Props { ... }`.
- Prioritize semantic HTML (`<main>`, `<header>`, `<section>`, `<button>`) with ARIA labels (`aria-label`, `aria-disabled`, `role="status"`).
- Styling with Tailwind CSS utility classes; no CSS modules or styled-components.
- Icons use native emojis/accessible unicode or inline SVG; avoid external icon libraries.

### State Immutability
Always return new state objects; never mutate state in place:
```ts
return {
  ...evaluated,
  streak: nextStreak,
  freezes: nextFreezes,
  freezeProgress: nextProgress,
  lastStudiedDate: today,
};
```

---

## Domain Rules & Invariants

State schema:
```ts
interface HabitTrackerState {
  readonly streak: number;          // >= 0, integer (cap: 100,000)
  readonly freezes: FreezeCount;    // 0 | 1 | 2 (bank capacity is 2)
  readonly freezeProgress: FreezeProgress; // 0 | 1 | 2 (earns 1 freeze on 3)
  readonly deadlineDays: number;    // integer 1 to 7 (default: 1)
  readonly lastStudiedDate: string | null; // "YYYY-MM-DD" or null
}
```

Critical invariants enforced by `src/core/storage.ts`:
- **Capacity progress cap:** If `freezes === 2`, `freezeProgress` **must be 0**.
- **Active streak requires date:** If `streak > 0`, `lastStudiedDate` **cannot be null**.
- **Payload cleanliness:** Exactly the 5 expected keys are allowed. Extra keys, prototype-polluting keys (`__proto__`), or oversized payloads (> 1024 bytes) fail validation and reset to `DEFAULT_STATE`.
- **Idempotent study recording:** Calling `recordStudySession(state, today)` on the same calendar day returns unchanged state without incrementing streak or progress.
- **Freeze earning:** 1 freeze is earned every 3 completed study sessions when `freezes < 2`.
- **Inactivity evaluation:** Missed periods = `Math.floor((daysInactive - 1) / deadlineDays)`. Missed periods deduct freezes 1:1. If missed periods exceed banked freezes, streak drops to 0 and all banked freezes and progress are lost.

---

## Things Newcomers Get Wrong

1. **Test Location:**
   - Tests are located in `tests/`, **not** colocated inside `src/` (e.g. `tests/streak.test.ts`, `tests/StreakCounter.test.tsx`).
   - Vitest globals (`describe`, `it`, `expect`, `beforeEach`) are configured globally, with imports from `'vitest'` also supported.
2. **Date Manipulation & Timezones:**
   - Always use `formatLocalDate(date: Date)` and `getCalendarDaysBetween()` from `src/utils/date.ts`.
   - **Never** use `new Date().toISOString().split('T')[0]` (causes off-by-one errors near local midnight UTC boundaries).
   - Date strings must strictly adhere to `"YYYY-MM-DD"` and validate against `isValidDateString()`.
3. **Storage Sanitization Strictness:**
   - `saveHabitState()` and `loadHabitState()` enforce runtime schema validation. If adding a field to `HabitTrackerState`, you must update `ALLOWED_KEYS`, `ALLOWED_KEY_COUNT`, and boundary checks in `src/core/storage.ts`; otherwise, state fails validation and falls back to `DEFAULT_STATE`.
4. **Export Style Mismatch:**
   - Do not use named exports for React components (`export const StreakCounter = ...` is against convention). Use `export default function StreakCounter(...)`.
   - Do not use default exports for utilities or core modules.
5. **Adding Dependencies:**
   - Keep the project minimal. There is no external state management (Redux/Zustand), date library (date-fns/dayjs), or UI library (Shadcn/MUI). Native TypeScript, React, and Tailwind handle all requirements.

---

## Canonical Patterns

### 1. Pure Core Function Pattern (`src/core/`)
```ts
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
  // Compute missed periods and return freshly allocated state
  ...
}
```

### 2. UI Component Pattern (`src/components/`)
```tsx
interface MarkDoneButtonProps {
  isCompletedToday: boolean;
  onMarkDone: () => void;
}

export default function MarkDoneButton({
  isCompletedToday,
  onMarkDone,
}: MarkDoneButtonProps) {
  return (
    <section aria-label="Habit Completion Action">
      <button
        type="button"
        disabled={isCompletedToday}
        aria-disabled={isCompletedToday}
        onClick={onMarkDone}
        className={`w-full py-3.5 px-4 rounded-xl font-semibold text-base transition-all duration-150 ...`}
      >
        {isCompletedToday ? 'Completed Today ✓' : 'Mark Studied Today'}
      </button>
    </section>
  );
}
```
