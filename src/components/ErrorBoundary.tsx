import { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[400px] flex items-center justify-center p-8">
          <div className="glass-card rounded-2xl p-8 max-w-md text-center">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center mx-auto mb-6">
              <AlertTriangle className="w-8 h-8 text-destructive" aria-hidden="true" />
            </div>
            <h2 className="font-display text-2xl font-bold mb-3 text-foreground">
              Something went wrong
            </h2>
            <p className="text-muted-foreground mb-6">
              We encountered an unexpected error. Please try refreshing the page or click the button below.
            </p>
            {this.state.error && (
              <details className="mb-6 text-left">
                <summary className="text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
                  Technical details
                </summary>
                <pre className="mt-2 p-3 bg-secondary rounded-lg text-xs text-muted-foreground overflow-auto max-h-32">
                  {this.state.error.message}
                </pre>
              </details>
            )}
            <div className="flex gap-3 justify-center">
              <Button onClick={this.handleReset} variant="default" className="gap-2">
                <RefreshCw className="w-4 h-4" aria-hidden="true" />
                Try Again
              </Button>
              <Button
                onClick={() => window.location.reload()}
                variant="outline"
              >
                Refresh Page
              </Button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
