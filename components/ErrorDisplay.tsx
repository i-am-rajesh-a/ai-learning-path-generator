
import React from 'react';

interface ErrorDisplayProps {
  message: string;
  onRetry: () => void;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-900/50 border border-red-700 text-red-300 px-4 py-3 rounded-lg relative" role="alert">
      <strong className="font-bold">Oops! Something went wrong.</strong>
      <span className="block sm:inline ml-2">{message}</span>
      <button 
        onClick={onRetry}
        className="mt-2 text-sm font-semibold underline hover:text-red-200"
      >
        Click here to try again.
      </button>
    </div>
  );
};
