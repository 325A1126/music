import React, { Component, ErrorInfo, ReactNode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('App runtime error caught by ErrorBoundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 text-center font-mono">
          <div className="max-w-md p-6 bg-[#141418] border-2 border-[#ff1744] shadow-[0_0_30px_rgba(255,23,68,0.5)]">
            <h1 className="text-xl font-bold text-[#ff1744] mb-3">STAGE OVERLOAD // エラー検知</h1>
            <p className="text-sm text-neutral-300 mb-4">
              {this.state.error?.message || '予期せぬエラーが発生しました'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-2.5 bg-[#e60026] text-white font-bold text-sm tracking-wider hover:bg-[#ff1744] transition-colors uppercase"
            >
              RELOAD STAGE (再読み込み)
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <ErrorBoundary>
    <App />
  </ErrorBoundary>
);

