import React, { Component, ErrorInfo, ReactNode } from 'react';
import Button from './Button';
import { AlertTriangleIcon } from '../icons/MiscIcons';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  // FIX: Replaced the constructor with class property syntax for state initialization.
  // This modern approach resolves TypeScript errors where `this.state` and `this.props` were not
  // being recognized on the component instance, and fixes the downstream error in `App.tsx`.
  public state: State = { hasError: false };

  public static getDerivedStateFromError(_: Error): State {
    // Update state so the next render will show the fallback UI.
    return { hasError: true };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }
  
  private handleReset = () => {
    // This is a simple reset. For a more complex app, you might clear state or re-authenticate.
    window.location.reload();
  };

  public render(): ReactNode {
    if (this.state.hasError) {
      return (
        <div className="flex items-center justify-center min-h-screen bg-light-bg dark:bg-dark-bg text-slate-800 dark:text-slate-200">
            <div className="text-center p-8 max-w-lg mx-auto">
                <AlertTriangleIcon className="w-16 h-16 mx-auto text-red-500 mb-4" />
                <h1 className="text-3xl font-display font-bold mb-2">Oops! Something went wrong.</h1>
                <p className="text-slate-600 dark:text-slate-400 mb-6">
                    We've encountered an unexpected error. Our team has been notified. Please try refreshing the page.
                </p>
                <Button onClick={this.handleReset} variant="primary">
                    Reload Application
                </Button>
            </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
