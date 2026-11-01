# Changelog

All notable changes to the Korean Vocabulary Habit Tracker are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.0] - 2026-11-02

### Added
- **Korean Grammar Habit Mode (Feature Gated):** Added capability to track a daily Korean Grammar habit alongside Korean Vocabulary. Accessible through a habit type tab selector when the `newHabitType` feature flag is enabled.
- **Isolated Multi-Habit Persistence:** Separate local storage records ensure streak, freeze bank, and deadline progress for Grammar do not affect Vocabulary habits.
- **Error Recovery Boundary:** Installed an application error boundary that prevents crashes from corrupt storage and provides a one-click reload button.
- **Static Hosting Configurations:** Generated static headers and rewrite manifests (`_headers`, `_redirects`) for single-page routing and edge CDN deployments.

### Security
- **Strict Storage Sanitization:** Sealed state validation to block prototype pollution attacks and enforce a 1 KB payload safety limit.
- **Content Security Policy (CSP):** Configured strict script, style, and object isolation policies in deployment headers and HTML metadata.

### Fixed
- **Timezone Drift:** Shifted calendar date normalization to UTC date arithmetic, preventing off-by-one streak resets during daylight saving transitions.
- **Status Indicator Resiliency:** Added fallback protection in deadline settings to gracefully handle unexpected status states.

---

## [1.0.0] - 2026-11-02

### Added
- Initial release of the single-page Korean Vocabulary Habit Tracker.
- Streak progression with daily check-in buttons and idempotency protection.
- Duolingo-style freeze bank (2-freeze capacity, earned every 3 active streak days).
- Inactivity deadline selector (configurable between 1 and 7 days).
- Local-first browser persistence using `localStorage`.
