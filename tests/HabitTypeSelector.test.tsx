import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import HabitTypeSelector from '../src/components/HabitTypeSelector';

describe('HabitTypeSelector Component', () => {
  it('renders tablist with all available habit options and appropriate ARIA attributes', () => {
    const onSelect = vi.fn();
    render(
      <HabitTypeSelector
        activeHabitType="vocabulary"
        onSelectHabitType={onSelect}
      />
    );

    const tablist = screen.getByRole('tablist', { name: /Habit type selector/i });
    expect(tablist).toBeInTheDocument();

    const vocabTab = screen.getByRole('tab', { name: /Vocabulary/i });
    const grammarTab = screen.getByRole('tab', { name: /Grammar/i });

    expect(vocabTab).toHaveAttribute('aria-selected', 'true');
    expect(grammarTab).toHaveAttribute('aria-selected', 'false');
  });

  it('triggers onSelectHabitType callback when a tab is clicked', () => {
    const onSelect = vi.fn();
    render(
      <HabitTypeSelector
        activeHabitType="vocabulary"
        onSelectHabitType={onSelect}
      />
    );

    const grammarTab = screen.getByRole('tab', { name: /Grammar/i });
    fireEvent.click(grammarTab);

    expect(onSelect).toHaveBeenCalledTimes(1);
    expect(onSelect).toHaveBeenCalledWith('grammar');
  });
});
