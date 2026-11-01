import { describe, it, expect } from 'vitest';
import { getCalendarDaysBetween, formatLocalDate } from '../src/utils/date';

describe('Date Utilities', () => {
  it('formats Date to local YYYY-MM-DD string', () => {
    const d = new Date(2026, 10, 1); // Nov 1, 2026 local time
    expect(formatLocalDate(d)).toBe('2026-11-01');
  });

  it('computes 0 calendar days difference for same date', () => {
    expect(getCalendarDaysBetween('2026-11-01', '2026-11-01')).toBe(0);
  });

  it('computes positive calendar day difference within same month', () => {
    expect(getCalendarDaysBetween('2026-11-01', '2026-11-02')).toBe(1);
    expect(getCalendarDaysBetween('2026-11-01', '2026-11-08')).toBe(7);
  });

  it('computes calendar day difference across month boundaries', () => {
    expect(getCalendarDaysBetween('2026-10-31', '2026-11-01')).toBe(1);
    expect(getCalendarDaysBetween('2026-02-28', '2026-03-01')).toBe(1);
  });

  it('computes calendar day difference across year boundaries', () => {
    expect(getCalendarDaysBetween('2026-12-31', '2027-01-01')).toBe(1);
  });

  it('returns 0 if toDate is earlier than fromDate', () => {
    expect(getCalendarDaysBetween('2026-11-05', '2026-11-01')).toBe(0);
  });
});
