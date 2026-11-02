# Spec: Shadcn UI Migration and Modern Interface Polish

## Objective
Modernize and polish the user interface of the Korean Vocabulary Habit Tracker using standard **shadcn/ui** components and design tokens, without altering any domain logic, storage invariants, or streak engine behaviors. The goal is a clean, accessible, modern SaaS-grade interface (cards, refined typography, smooth transitions, standardized button states, and cohesive dark-slate/amber/emerald visual hierarchy) while maintaining 100% test pass rates across the test suite.

---

## Tech Stack & Architecture Alignment
- **Framework:** React 18.3 (Strict Mode)
- **Language:** TypeScript 5.7 (strict)
- **Styling:** Tailwind CSS 3.4 + `tailwindcss-animate` plugin
- **UI Primitives:** shadcn/ui components built on Radix UI, `class-variance-authority`, `clsx`, `tailwind-merge`, and `lucide-react`
- **Build Tool:** Vite 6.1 with `@/*` path alias resolution
- **Test Runner:** Vitest 3.0 + Testing Library (jsdom)

---

## Commands
```bash
# Start local development server
npm run dev

# Run all unit and integration tests
npm test

# Run type checking and linting
npm run lint

# Run production build
npm run build
```

---

## Project Structure Changes
```
src/
├── components/
│   ├── ui/                 # NEW: shadcn/ui shared primitives (button, card, badge, dialog, progress)
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── badge.tsx
│   │   ├── dialog.tsx
│   │   └── progress.tsx
│   ├── settings/
│   │   └── DeadlineSettings.tsx  # REFACTORED: Uses Dialog, Button, Badge
│   ├── ErrorBoundary.tsx         # REFACTORED: Uses Card, Button
│   ├── FreezeBank.tsx            # REFACTORED: Uses Card, Progress, Badge
│   ├── MarkDoneButton.tsx        # REFACTORED: Uses Button, Lucide icons
│   └── StreakCounter.tsx         # REFACTORED: Uses Card, Badge, Lucide Flame
├── core/                         # UNCHANGED: Pure streak & storage logic
├── hooks/                        # UNCHANGED: useHabitTracker React hook
├── lib/
│   └── utils.ts                  # NEW: cn() className merging helper
├── types/                        # UNCHANGED: Domain models and state definitions
├── utils/                        # UNCHANGED: Calendar day utilities
├── App.tsx                       # REFACTORED: Modern layout container, header, stats grid
├── index.css                     # UPDATED: shadcn CSS variables & color tokens
components.json                   # NEW: shadcn CLI configuration
tailwind.config.js                # UPDATED: shadcn CSS variable mappings & tailwindcss-animate
tsconfig.json                     # UPDATED: baseUrl and @/* path mappings
vite.config.ts                    # UPDATED: resolve.alias for @/*
```

---

## Code Style & Implementation Conventions
- **Component Pattern:** App components retain default exports (`export default function ComponentName(props: Props) { ... }`). Shadcn UI primitives in `src/components/ui/` use standard shadcn named exports (`export { Button, buttonVariants }`).
- **Styling:** Use `cn(...)` for merging conditional class names with Tailwind utilities.
- **Accessibility:** All interactive elements must maintain clear ARIA attributes (`aria-label`, `role="status"`, `aria-disabled`), keyboard accessibility (focus visible rings), and semantic markup.
- **Domain Decoupling:** UI components accept props and emit callback events only. Zero direct imports of `storage.ts` or `streak-engine.ts` inside UI components.

### Example: Component Styling with `cn` and shadcn Primitives
```tsx
import { Button } from '@/components/ui/button';
import { CheckCircle2, Flame } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MarkDoneButtonProps {
  isCompletedToday: boolean;
  onMarkDone: () => void;
}

export default function MarkDoneButton({
  isCompletedToday,
  onMarkDone,
}: MarkDoneButtonProps) {
  return (
    <section aria-label="Habit Completion Action" className="w-full">
      <Button
        type="button"
        size="lg"
        disabled={isCompletedToday}
        aria-disabled={isCompletedToday}
        onClick={onMarkDone}
        className={cn(
          "w-full h-14 text-base font-semibold shadow-md transition-all duration-200",
          isCompletedToday
            ? "bg-emerald-950/60 text-emerald-300 border border-emerald-800/80 cursor-default"
            : "bg-emerald-600 hover:bg-emerald-500 text-white active:scale-[0.99]"
        )}
      >
        {isCompletedToday ? (
          <>
            <CheckCircle2 className="w-5 h-5 mr-2 text-emerald-400" />
            Completed Today ✓
          </>
        ) : (
          <>
            <Flame className="w-5 h-5 mr-2" />
            Mark Studied Today
          </>
        )}
      </Button>
    </section>
  );
}
```

---

## Testing Strategy
- **Framework:** Vitest + Testing Library (`@testing-library/react`, `@testing-library/jest-dom`).
- **Location:** All tests remain in root `tests/`.
- **Requirements:**
  1. All 10 existing test files must pass.
  2. Component integration tests (`MarkDoneButton.test.tsx`, `StreakCounter.test.tsx`, `FreezeBank.test.tsx`, `DeadlineSettings.test.tsx`, `App.test.tsx`) must continue to verify user interactions, accessibility labels, and rendered states.
  3. No snapshot regressions or silent test deletions.

---

## Boundaries

### Always Do
- Preserve all existing state invariants (streak cap, freeze cap of 2, 5-key validation, UTC date math).
- Keep tests passing and run `npm test` and `npm run lint` before completing tasks.
- Keep `src/core/` completely decoupled from React and DOM APIs.
- Retain semantic roles and ARIA labels needed by existing tests.

### Ask First
- Adding external icon packs other than `lucide-react` (standard in shadcn).
- Upgrading Tailwind CSS from v3 to v4 (since v4 removes `tailwind.config.js` and requires migration).
- Altering user-facing test text (e.g., "Mark Studied Today", "Day Streak").

### Never Do
- Never add external state management libraries (Redux, Zustand) or backend APIs.
- Never use `new Date().toISOString().split('T')[0]` for calendar dates.
- Never mutate state objects directly in hooks or components.
- Never remove failing assertions from `tests/`.

---

## Success Criteria
1. `tsconfig.json` and `vite.config.ts` support `@/*` path aliases.
2. `components.json` is configured and compatible with Tailwind CSS v3.
3. Essential shadcn UI primitives (`Button`, `Card`, `Badge`, `Progress`, `Dialog`) are cleanly installed and functional in `src/components/ui/`.
4. Existing app components (`StreakCounter`, `FreezeBank`, `MarkDoneButton`, `DeadlineSettings`, `ErrorBoundary`, and `App`) are redesigned with shadcn components, refined typography, and cohesive spacing.
5. `npm run lint` (`tsc --noEmit`) passes with zero errors.
6. `npm test` (`vitest run`) executes 10 test suites and 59+ tests with 100% passing.
7. `npm run build` generates clean production assets without bundle errors.

---

## Open Questions & Tradeoffs
1. **Tailwind Version: Pin to v3 (`shadcn@2.3.0`) vs Upgrade to v4 (`shadcn@latest`):**
   - *Option A (Recommended):* Keep Tailwind CSS `3.4.17` and use `shadcn@2.3.0` conventions + `tailwindcss-animate`. This avoids disrupting the existing PostCSS setup and build pipeline.
   - *Option B:* Upgrade the whole repository to Tailwind CSS v4 and `@tailwindcss/vite`.
2. **Dialog vs Modal for `DeadlineSettings`:**
   - *Option A (Recommended):* Implement shadcn's Radix-based `Dialog` accessible modal.
   - *Option B:* Keep an inline card section inside `App.tsx` instead of a modal overlay.
