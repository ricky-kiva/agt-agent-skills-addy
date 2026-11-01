import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../src/App';
import { STORAGE_KEY } from '../src/core/storage';
import { HabitTrackerState } from '../src/types/habit';
import { formatLocalDate } from '../src/utils/date';

describe('App End-to-End Integration', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('renders initial clean habit tracker state with full freeze bank', () => {
    render(<App />);

    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Korean Vocabulary/i);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText(/Start your streak today!/i)).toBeInTheDocument();
    expect(screen.getByText('2 / 2 freezes available')).toBeInTheDocument();
    expect(screen.getByText(/Bank full/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Mark Studied Today/i })).not.toBeDisabled();
    expect(screen.getByText(/Ready to Start/i)).toBeInTheDocument();
  });
  it('performs daily study check-in and persists to localStorage', () => {
    render(<App />);

    const button = screen.getByRole('button', { name: /Mark Studied Today/i });
    fireEvent.click(button);

    // Streak incremented
    expect(screen.getByText('1')).toBeInTheDocument();
    expect(screen.getByText(/Day Streak/i)).toBeInTheDocument();

    // Bank remains full at capacity
    expect(screen.getByText('2 / 2 freezes available')).toBeInTheDocument();
    expect(screen.getByText(/Bank full/i)).toBeInTheDocument();

    // Button disabled and marked complete
    expect(screen.getByRole('button', { name: /Completed Today ✓/i })).toBeDisabled();
    expect(screen.getByText('Completed Today', { selector: 'span' })).toBeInTheDocument();

    // Persisted to localStorage
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.streak).toBe(1);
    expect(saved.freezes).toBe(2);
    expect(saved.freezeProgress).toBe(0);
    expect(saved.lastStudiedDate).toBe(formatLocalDate(new Date()));
  });

  it('updates inactivity deadline and persists changes', () => {
    render(<App />);

    const select = screen.getByLabelText(/Inactivity Deadline/i);
    fireEvent.change(select, { target: { value: '7' } });

    expect(select).toHaveValue('7');
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
    expect(saved.deadlineDays).toBe(7);
  });

  it('evaluates inactivity on mount and consumes freeze when deadline was missed', () => {
    const today = formatLocalDate(new Date());
    // Studied 2 days ago with 1-day deadline -> 1 period missed, consumes 1 freeze
    const [y, m, d] = today.split('-').map(Number);
    const twoDaysAgo = new Date(y, m - 1, d - 2);
    const twoDaysAgoStr = formatLocalDate(twoDaysAgo);

    const savedState: HabitTrackerState = {
      streak: 5,
      freezes: 1,
      freezeProgress: 2,
      deadlineDays: 1,
      lastStudiedDate: twoDaysAgoStr,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));

    render(<App />);

    // Streak preserved at 5, freeze consumed from 1 -> 0
    expect(screen.getByText('5')).toBeInTheDocument();
    expect(screen.getByText('0 / 2 freezes available')).toBeInTheDocument();
    expect(screen.getByText(/Protected by Freeze/i)).toBeInTheDocument();
  });

  it('evaluates inactivity on mount and resets streak to 0 when unshielded', () => {
    const today = formatLocalDate(new Date());
    const [y, m, d] = today.split('-').map(Number);
    const twoDaysAgo = new Date(y, m - 1, d - 2);
    const twoDaysAgoStr = formatLocalDate(twoDaysAgo);

    const savedState: HabitTrackerState = {
      streak: 5,
      freezes: 0,
      freezeProgress: 2,
      deadlineDays: 1,
      lastStudiedDate: twoDaysAgoStr,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));

    render(<App />);

    // Streak dropped to 0
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText(/Streak Reset/i)).toBeInTheDocument();
  });
});
