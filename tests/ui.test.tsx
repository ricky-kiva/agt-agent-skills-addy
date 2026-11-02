import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

describe('Shadcn UI Primitives', () => {
  it('renders Button with variants and handles click events', () => {
    const handleClick = vi.fn();
    render(
      <Button variant="default" size="lg" onClick={handleClick}>
        Test Button
      </Button>
    );

    const button = screen.getByRole('button', { name: 'Test Button' });
    expect(button).toBeInTheDocument();
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  it('renders Card with header and content', () => {
    render(
      <Card>
        <CardHeader>
          <CardTitle>Card Title</CardTitle>
        </CardHeader>
        <CardContent>Card Content Text</CardContent>
      </Card>
    );

    expect(screen.getByText('Card Title')).toBeInTheDocument();
    expect(screen.getByText('Card Content Text')).toBeInTheDocument();
  });

  it('renders Badge as a span element and supports color variants', () => {
    render(<Badge variant="emerald">Active Status</Badge>);

    const badge = screen.getByText('Active Status');
    expect(badge).toBeInTheDocument();
    expect(badge.tagName.toLowerCase()).toBe('span');
  });

  it('renders Progress with aria attributes and proper value percentage', () => {
    render(<Progress value={50} max={100} aria-label="Loading progress" />);

    const progress = screen.getByRole('progressbar');
    expect(progress).toBeInTheDocument();
    expect(progress).toHaveAttribute('aria-valuenow', '50');
    expect(progress).toHaveAttribute('aria-valuemax', '100');
  });
});
