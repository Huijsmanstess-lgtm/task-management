"use client";

import React, { ReactNode } from "react";

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Error caught by boundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4 py-12">
          <div className="w-full max-w-md rounded-[2rem] border border-slate-800 bg-slate-900/95 p-8 shadow-2xl shadow-slate-950/20">
            <div className="text-center">
              <p className="text-sm uppercase tracking-[0.3em] text-rose-400/70">Error</p>
              <h1 className="mt-4 text-2xl font-semibold text-slate-100">Er is iets misgegaan</h1>
              <p className="mt-3 text-slate-400">
                Probeer de pagina opnieuw te laden of contact het support team.
              </p>
              <button
                onClick={() => window.location.reload()}
                className="mt-6 inline-flex items-center justify-center rounded-2xl border border-slate-700 bg-slate-950/80 px-4 py-3 text-sm font-semibold text-slate-200 transition hover:bg-slate-900 hover:text-slate-100"
              >
                Pagina verversen
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
