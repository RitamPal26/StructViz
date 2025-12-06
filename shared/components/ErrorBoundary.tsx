import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';
import { Button } from './Button';

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false
  };

  public static getDerivedStateFromError(error: Error): Partial<State> {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div className="flex flex-col items-center justify-center min-h-[400px] p-8 bg-gray-900 rounded-xl border border-red-900/50 text-center">
          <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mb-4">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Visualizer Crashed</h2>
          <p className="text-gray-400 mb-6 max-w-md">
            Something went wrong while rendering this component. 
            {this.state.error && <span className="block mt-2 text-xs font-mono text-red-400 bg-black/30 p-2 rounded">{this.state.error.message}</span>}
          </p>
          <Button onClick={this.handleReset} variant="outline" className="border-red-500 text-red-400 hover:bg-red-900/20">
            <RefreshCcw className="w-4 h-4 mr-2" />
            Reload Application
          </Button>
        </div>
      );
    }

    return this.props.children;
  }
}