import React from 'react';

interface ResultDisplayProps {
  goal: string;
  onStartOver: () => void;
}

export const ResultDisplay: React.FC<ResultDisplayProps> = ({ goal, onStartOver }) => {
  return (
    <div className="bg-gray-800 shadow-2xl rounded-xl p-6 sm:p-8 border border-gray-700 animate-fade-in">
      <div className="text-center">
        <svg className="h-16 w-16 mx-auto text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-4">Your Learning Path is Ready!</h2>
        <p className="mt-2 text-lg text-gray-400">You can now start your journey to learn: <span className="font-semibold text-indigo-400">"{goal}"</span></p>
        <p className="mt-2 text-gray-400">Good luck!</p>
      </div>

      <div className="mt-10 text-center">
        <button
          onClick={onStartOver}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-indigo-500/50"
        >
          Create Another Path
        </button>
      </div>
    </div>
  );
};
