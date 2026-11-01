import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import DeadlineSettings from '../src/components/settings/DeadlineSettings';

describe('DeadlineSettings Component', () => {
  it('renders current deadline and status badge', () => {
    render(
      <DeadlineSettings
        deadlineDays={1}
        status="due"
        onDeadlineChange={() => {}}
      />
    );

    expect(screen.getByLabelText(/Inactivity Deadline/i)).toBeInTheDocument();
    expect(screen.getByText(/Due Today/i)).toBeInTheDocument();
  });

  it('calls onDeadlineChange when selecting a different deadline', () => {
    const handleChange = vi.fn();
    render(
      <DeadlineSettings
        deadlineDays={1}
        status="due"
        onDeadlineChange={handleChange}
      />
    );

    const select = screen.getByLabelText(/Inactivity Deadline/i);
    fireEvent.change(select, { target: { value: '7' } });

    expect(handleChange).toHaveBeenCalledWith(7);
  });

  it('renders status badge for protected by freeze', () => {
    render(
      <DeadlineSettings
        deadlineDays={3}
        status="frozen"
        onDeadlineChange={() => {}}
      />
    );
    expect(screen.getByText(/Protected by Freeze/i)).toBeInTheDocument();
  });

  it('renders status badge for streak reset', () => {
    render(
      <DeadlineSettings
        deadlineDays={1}
        status="reset"
        onDeadlineChange={() => {}}
      />
    );
    expect(screen.getByText(/Streak Reset/i)).toBeInTheDocument();
  });

  it('renders status badge for completed today', () => {
    render(
      <DeadlineSettings
        deadlineDays={1}
        status="completed"
        onDeadlineChange={() => {}}
      />
    );
    expect(screen.getByText(/Completed Today/i)).toBeInTheDocument();
  });
});
