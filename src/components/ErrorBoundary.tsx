import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RefreshCcw } from 'lucide-react';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-[#010409] flex items-center justify-center p-8">
          <div className="glass-card max-w-md w-full p-8 text-center space-y-6 border-red-500/20 shadow-[0_0_50px_rgba(239,68,68,0.1)]">
            <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle className="text-red-500" size={32} />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-white">System Critical Failure</h2>
              <p className="text-sm text-white/40 leading-relaxed">
                The intelligence core encountered an unexpected exception. Terminal session has been detached to prevent data corruption.
              </p>
            </div>
            <div className="p-4 bg-black/40 rounded-lg border border-white/5 text-left overflow-auto max-h-32">
              <code className="text-[10px] font-mono text-red-400">
                {this.state.error?.toString()}
              </code>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="w-full py-3 bg-white/10 hover:bg-white/20 rounded-xl text-xs font-black uppercase tracking-[0.2em] transition-all flex items-center justify-center gap-2"
            >
              <RefreshCcw size={14} />
              Reboot Command Center
            </button>
          </div>
        </div>
      );
    }

    return (this as any).props.children;
  }
}
