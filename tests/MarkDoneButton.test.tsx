import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import MarkDoneButton from '../src/components/MarkDoneButton';

describe('MarkDoneButton Component', () => {
  it('renders enabled Mark Studied Today when not yet completed today', () => {
    const handleMark = vi.fn();
    render(<MarkDoneButton isCompletedToday={false} onMarkDone={handleMark} />);

    const button = screen.getByRole('button', { name: /Mark Studied Today/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();

    fireEvent.click(button);
    expect(handleMark).toHaveBeenCalledTimes(1);
  });

  it('renders disabled Completed Today when already completed today', () => {
    const handleMark = vi.fn();
    render(<MarkDoneButton isCompletedToday={true} onMarkDone={handleMark} />);

    const button = screen.getByRole('button', { name: /Completed Today ✓/i });
    expect(button).toBeInTheDocument();
    expect(button).toBeDisabled();

    fireEvent.click(button);
    expect(handleMark).not.toHaveBeenCalled();
  });
});
