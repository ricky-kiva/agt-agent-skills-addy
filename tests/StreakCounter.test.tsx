import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import StreakCounter from '../src/components/StreakCounter';

describe('StreakCounter Component', () => {
  it('renders 0 streak with prompt when streak is 0', () => {
    render(<StreakCounter streak={0} />);
    expect(screen.getByText('0')).toBeInTheDocument();
    expect(screen.getByText(/Start your streak today!/i)).toBeInTheDocument();
  });

  it('renders positive streak count with day streak label', () => {
    render(<StreakCounter streak={12} />);
    expect(screen.getByText('12')).toBeInTheDocument();
    expect(screen.getByText(/Day Streak/i)).toBeInTheDocument();
  });

  it('renders flame visual indicator', () => {
    render(<StreakCounter streak={5} />);
    expect(screen.getByLabelText(/Streak status/i)).toHaveTextContent('🔥');
  });
});
