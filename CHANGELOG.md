# Changelog

All notable changes to the Korean Vocabulary Habit Tracker are documented in this file.
The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.0.0] - 2026-11-02

### Added
- Single-page Korean Vocabulary Habit Tracker.
- Streak progression with daily check-in buttons and idempotency protection.
- Duolingo-style freeze bank (2-freeze capacity, earned every 3 active streak days).
- Inactivity deadline selector (configurable between 1 and 7 days).
- Local-first browser persistence using `localStorage`.
- Application-level error boundary with user-facing recovery action.
- Static hosting headers (`_headers`) with strict CSP and immutable asset caching.
- Single-page application route rewrite configuration (`_redirects`).

### Security
- Strict storage payload sanitization rejecting prototype pollution, unexpected keys, and payloads exceeding 1 KB.
- Content Security Policy (CSP) headers enforcing local script and asset execution.

### Fixed
- Calendar day calculations shifted to explicit UTC date methods to eliminate daylight saving and timezone drift.
- Fallback status indicator protection in deadline settings.
