import { Component, ErrorInfo, ReactNode } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public override state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public override componentDidCatch(error: Error, errorInfo: ErrorInfo): void {
    console.error('Unhandled runtime application error caught by ErrorBoundary:', error, errorInfo);
  }

  private handleReset = (): void => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  public override render(): ReactNode {
    if (this.state.hasError) {
      return (
        <main className="max-w-md mx-auto p-6 mt-12 text-center">
          <Card className="border-destructive/50 bg-card shadow-lg">
            <CardHeader className="space-y-3 pb-3">
              <div
                className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10 text-2xl select-none"
                role="img"
                aria-label="Error alert"
              >
                ⚠️
              </div>
              <CardTitle className="text-xl font-bold text-destructive">
                Something went wrong
              </CardTitle>
              <CardDescription className="text-slate-300 text-sm">
                An unexpected error occurred while loading your habit tracker. Your saved data remains intact.
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-2">
              <Button
                type="button"
                variant="destructive"
                onClick={this.handleReset}
                className="w-full"
              >
                Reload Application
              </Button>
            </CardContent>
          </Card>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
