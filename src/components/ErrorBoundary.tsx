import { Component, ErrorInfo, ReactNode } from 'react';

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
        <main className="max-w-md mx-auto p-6 space-y-4 text-center mt-12 bg-slate-800 rounded-xl border border-red-800/50 shadow-lg text-slate-100">
          <div className="text-4xl select-none" role="img" aria-label="Error alert">
            ⚠️
          </div>
          <h1 className="text-xl font-bold text-red-400">Something went wrong</h1>
          <p className="text-sm text-slate-300">
            An unexpected error occurred while loading your habit tracker. Your saved data remains intact.
          </p>
          <button
            type="button"
            onClick={this.handleReset}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-colors cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400"
          >
            Reload Application
          </button>
        </main>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
