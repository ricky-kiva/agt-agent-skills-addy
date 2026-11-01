import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import FreezeBank from '../src/components/FreezeBank';

describe('FreezeBank Component', () => {
  it('renders 0 freezes available with progress', () => {
    render(<FreezeBank freezes={0} freezeProgress={1} />);
    expect(screen.getByText(/Freeze Bank/i)).toBeInTheDocument();
    expect(screen.getByText('0 / 2 freezes available')).toBeInTheDocument();
    expect(screen.getByText(/1\/3 days to next freeze/i)).toBeInTheDocument();
  });

  it('renders 1 freeze available with progress', () => {
    render(<FreezeBank freezes={1} freezeProgress={2} />);
    expect(screen.getByText('1 / 2 freezes available')).toBeInTheDocument();
    expect(screen.getByText(/2\/3 days to next freeze/i)).toBeInTheDocument();
  });

  it('shows bank full message and hides days progress when at 2 freezes capacity', () => {
    render(<FreezeBank freezes={2} freezeProgress={0} />);
    expect(screen.getByText('2 / 2 freezes available')).toBeInTheDocument();
    expect(screen.getByText(/Bank full/i)).toBeInTheDocument();
    expect(screen.queryByText(/days to next freeze/i)).not.toBeInTheDocument();
  });

  it('renders two visual freeze slots with proper accessibility label', () => {
    render(<FreezeBank freezes={1} freezeProgress={0} />);
    const container = screen.getByLabelText(/Freeze slots/i);
    expect(container).toBeInTheDocument();
    expect(container.children.length).toBe(2);
  });
});
