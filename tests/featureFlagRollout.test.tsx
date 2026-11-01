import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, beforeEach } from 'vitest';
import App from '../src/App';
import { STORAGE_KEY } from '../src/core/storage';
import { HABIT_DEFINITIONS } from '../src/types/habit';

describe('Feature Flag Rollout: New Habit Type (Grammar)', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  describe('Flag OFF State (Baseline Production)', () => {
    it('does not render habit type selector when flag is off', () => {
      render(<App flags={{ newHabitType: false }} />);

      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Korean Vocabulary/i);
      expect(screen.getByText(/Daily Vocabulary Habit Tracker/i)).toBeInTheDocument();
    });

    it('stores study data exclusively under the baseline vocabulary storage key', () => {
      render(<App flags={{ newHabitType: false }} />);

      const markBtn = screen.getByRole('button', { name: /Mark Studied Today/i });
      fireEvent.click(markBtn);

      expect(localStorage.getItem(STORAGE_KEY)).not.toBeNull();
      expect(localStorage.getItem(HABIT_DEFINITIONS.grammar.storageKey)).toBeNull();
    });
  });

  describe('Flag ON State (Feature Enabled)', () => {
    it('renders habit type selector allowing navigation between Vocabulary and Grammar', () => {
      render(<App flags={{ newHabitType: true }} />);

      const tablist = screen.getByRole('tablist', { name: /Habit type selector/i });
      expect(tablist).toBeInTheDocument();

      const grammarTab = screen.getByRole('tab', { name: /Grammar/i });
      fireEvent.click(grammarTab);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Korean Grammar/i);
      expect(screen.getByText(/Daily Grammar Habit Tracker/i)).toBeInTheDocument();
    });

    it('maintains independent streaks and storage partitions for each habit type', () => {
      render(<App flags={{ newHabitType: true }} />);

      // 1. Mark Vocabulary done
      const markVocabBtn = screen.getByRole('button', { name: /Mark Studied Today/i });
      fireEvent.click(markVocabBtn);
      expect(screen.getByRole('button', { name: /Completed Today/i })).toBeDisabled();

      // 2. Switch to Grammar
      const grammarTab = screen.getByRole('tab', { name: /Grammar/i });
      fireEvent.click(grammarTab);

      // Grammar starts with 0 streak and button is active (due)
      expect(screen.getByRole('button', { name: /Mark Studied Today/i })).not.toBeDisabled();
      expect(screen.getByText('0')).toBeInTheDocument();

      // 3. Mark Grammar done
      const markGrammarBtn = screen.getByRole('button', { name: /Mark Studied Today/i });
      fireEvent.click(markGrammarBtn);
      expect(screen.getByRole('button', { name: /Completed Today/i })).toBeDisabled();

      // 4. Verify separate storage records exist
      const vocabData = JSON.parse(localStorage.getItem(STORAGE_KEY)!);
      const grammarData = JSON.parse(
        localStorage.getItem(HABIT_DEFINITIONS.grammar.storageKey)!
      );

      expect(vocabData.streak).toBe(1);
      expect(grammarData.streak).toBe(1);

      // 5. Switch back to Vocabulary
      const vocabTab = screen.getByRole('tab', { name: /Vocabulary/i });
      fireEvent.click(vocabTab);

      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Korean Vocabulary/i);
      expect(screen.getByRole('button', { name: /Completed Today/i })).toBeDisabled();
    });
  });

  describe('Rollback Simulation (Flag toggled from ON back to OFF)', () => {
    it('seamlessly reverts UI to baseline Vocabulary tracker without data corruption', () => {
      // Step 1: User previously used app with flag ON and created grammar streak
      const { unmount } = render(<App flags={{ newHabitType: true }} />);
      const grammarTab = screen.getByRole('tab', { name: /Grammar/i });
      fireEvent.click(grammarTab);
      fireEvent.click(screen.getByRole('button', { name: /Mark Studied Today/i }));
      unmount();

      // Step 2: Emergency rollback occurs (flag switched back to false)
      render(<App flags={{ newHabitType: false }} />);

      // UI returns to clean baseline Korean Vocabulary
      expect(screen.queryByRole('tablist')).not.toBeInTheDocument();
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Korean Vocabulary/i);
      expect(screen.getByText(/Daily Vocabulary Habit Tracker/i)).toBeInTheDocument();

      // Vocabulary storage is safe and intact
      expect(screen.getByRole('button', { name: /Mark Studied Today/i })).not.toBeDisabled();
    });
  });
});
