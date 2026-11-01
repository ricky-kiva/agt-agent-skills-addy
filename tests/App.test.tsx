import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../src/App';

describe('App Smoke and Initial Render', () => {
  it('renders the Korean Vocabulary header', () => {
    render(<App />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(/Korean Vocabulary/i);
  });

  it('renders initial streak of 0 with start prompt', () => {
    render(<App />);
    expect(screen.getByText(/Start your streak today!/i)).toBeInTheDocument();
    expect(screen.getByText('0')).toBeInTheDocument();
  });

  it('renders freeze bank indicators showing available slots', () => {
    render(<App />);
    expect(screen.getByText(/Freeze Bank/i)).toBeInTheDocument();
    expect(screen.getByText(/0 \/ 2/i)).toBeInTheDocument();
  });

  it('renders enabled Mark Studied Today action button on initial load', () => {
    render(<App />);
    const button = screen.getByRole('button', { name: /Mark Studied Today/i });
    expect(button).toBeInTheDocument();
    expect(button).not.toBeDisabled();
  });
});
