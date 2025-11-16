import React from 'react';
import './LoadingDisplay.css';

interface LoadingDisplayProps {
  title: string;
  progress: string[];
}

const CheckmarkIcon: React.FC = () => (
    <svg className="w-6 h-6 text-green-400 checkmark-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
    </svg>
);

const LoadingSpinner: React.FC = () => (
  <div className="w-6 h-6">
    <div className="loading-spinner-dot"></div>
  </div>
);


export const LoadingDisplay: React.FC<LoadingDisplayProps> = ({ title, progress }) => {
  return (
    <div className="bg-slate-800 shadow-2xl rounded-xl p-6 sm:p-8 border border-slate-700 flex flex-col items-center text-center">
      <h2 className="text-xl sm:text-2xl font-bold text-sky-400 mb-4">{title}</h2>
      <p className="text-slate-400 mb-8 max-w-lg">Our AI is meticulously analyzing your request, researching resources, and structuring your path. This may take a moment.</p>
      
      <div className="w-full max-w-lg text-left">
        <ul className="relative border-l-2 border-slate-700 ml-3">
          {progress.map((step, index) => {
            const isCompleted = index < progress.length - 1;
            const isCurrent = index === progress.length - 1;
            const isSubStep = step.startsWith('- ');
            const stepText = isSubStep ? step.substring(2) : step;

            return (
              <li key={index} className={`mb-6 ml-8 animate-step-in ${isSubStep ? 'pl-4' : ''}`}>
                <span className="absolute flex items-center justify-center w-6 h-6 bg-slate-700 rounded-full -left-3 ring-8 ring-slate-800">
                  {isCompleted && <CheckmarkIcon />}
                  {isCurrent && <LoadingSpinner />}
                </span>
                <p className={`transition-colors duration-300 ${isCompleted ? 'text-slate-400' : 'text-slate-100'}`}>
                  {stepText}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};
