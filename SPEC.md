# Spec: Korean Vocabulary Habit Tracker

## Objective

A minimalist, single-page web tracker dedicated to maintaining a personal Korean vocabulary study routine. Tracks streaks with a configurable inactivity deadline (1–7 days) and a Duolingo-style freeze bank (up to 2 freezes, earned every 3 streak days). All data persists exclusively in `localStorage`.

---

## Tech Stack & Commands

- **Stack:** React 19 + TypeScript + Vite + Tailwind CSS
- **Testing:** Vitest + React Testing Library + jsdom
- **Storage:** Browser `localStorage` (client-only)

```bash
npm install     # Install dependencies
npm run dev     # Start dev server
npm run test    # Run unit/integration tests
npm run build   # Production build
```

---

## localStorage Data Model

### Key: `korean_vocab_habit_tracker`

```ts
export interface HabitTrackerState {
  streak: number; // Current streak count (>= 0)
  freezes: number; // Banked freezes: 0, 1, or 2
  freezeProgress: number; // Days toward next freeze: 0, 1, or 2 (at 3, +1 freeze)
  deadlineDays: number; // Allowed inactivity limit: 1 to 7 (default: 1)
  lastStudiedDate: string | null; // "YYYY-MM-DD" of last study session, or null
}

export const DEFAULT_STATE: HabitTrackerState = {
  streak: 0,
  freezes: 2, // Starts fully loaded with 2 freezes
  freezeProgress: 0,
  deadlineDays: 1,
  lastStudiedDate: null,
};
```

*Note:* Dates are stored as `"YYYY-MM-DD"` calendar strings to ensure timezone-safe persistence in `localStorage`.

---

## Streak & Freeze Requirements

### Streak Progression
- Each unique calendar day studied increments the streak count by 1.
- Multiple check-ins on the same calendar day are idempotent and count as a single study day.

### Freeze Accrual
- Every 3 accumulated study days award 1 streak freeze.
- The freeze bank holds a maximum capacity of 2 freezes. Excess completions while at capacity do not exceed this limit.

### Inactivity & Missed Deadlines
- The user can configure the inactivity deadline between 1 day (default) and 7 days (weekly).
- Inactivity within the configured deadline preserves the streak with no penalty.
- Exceeding the inactivity deadline without studying consumes 1 streak freeze to keep the streak intact.
- Exceeding the deadline when 0 freezes remain resets the streak to 0.

---

## Core Screens and UI States

Single-view dashboard containing:

1. **Streak Counter Component:**
   - Displays active streak count and visual habit momentum.
2. **Mark Day Done Action Component:**
   - Isolated action button: enabled when study is due; disabled and marked complete once studied today.
3. **Freeze Bank Component:**
   - Displays 2 visual freeze slots (active vs. empty) and progress toward next freeze (e.g., "1/3 days").
4. **User Settings Component:**
   - Dedicated settings panel containing the inactivity deadline selector (1 to 7 days) and status badge.

| State | Condition | Expected Behavior / Visual Indicator |
|---|---|---|
| **Empty** | No study recorded (`streak === 0`) | Prompts user to start their first streak |
| **Due** | Not studied today, deadline active | Displays current streak with active study button |
| **Completed** | Studied today | Shows completed badge; study button disabled |
| **Freeze Used** | Deadline missed, protected by freeze | Shows freeze consumed alert with remaining freeze count |
| **Reset** | Deadline missed with 0 freezes left | Displays broken streak alert; streak reset to 0 |

---

## Testing Strategy

- **Unit Tests (`tests/streak.test.ts`):**
  - Verify check-in increments streak and is idempotent per calendar day.
  - Verify 1 freeze is earned per 3 study days up to the 2-freeze cap.
  - Verify inactivity within deadline preserves streak without penalty.
  - Verify exceeding deadline consumes 1 freeze when available.
  - Verify exceeding deadline with 0 freezes resets streak to 0.
- **Storage Tests (`tests/storage.test.ts`):**
  - Verify fallback to `DEFAULT_STATE` on missing or corrupt `localStorage`.
  - Verify state changes persist across reloads.
- **Smoke Tests (`tests/App.test.tsx`):**
  - Verify initial dashboard render and state updates on study completion.

---

## Boundaries

- **Always:** Pass date strings into calculation functions for deterministic verification.
- **Ask first:** Adding external dependencies or modifying the storage schema.
- **Never:** Cloud sync, user accounts, multi-habit abstractions, or external network requests.

---

## Explicit Non-Goals

- Multi-habit management or custom habit creation.
- Flashcards, vocabulary lists, or spaced repetition (SRS).
- Cloud sync, user accounts, or backend servers.
- Push notifications or social features.
