import React from 'react';

interface ErrorStateProps {
  message?: string;
  onRetry?: () => void;
}

export default function ErrorState({ message = "Something went wrong.", onRetry }: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-12 text-center bg-surface rounded-[16px] border border-danger/30">
      <h3 className="font-display text-h3 font-bold text-danger mb-2">Error Occurred</h3>
      <p className="text-ink-2 text-[0.9375rem] mb-6 max-w-sm">{message}</p>
      {onRetry && (
        <button 
          onClick={onRetry}
          className="btn btn-outline"
        >
          Try Again
        </button>
      )}
    </div>
  );
}
