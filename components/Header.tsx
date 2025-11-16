
import React from 'react';

export const Header: React.FC = () => {
  return (
    <header className="text-center">
      <h1 className="text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-500">
        AI Learning Path Generator
      </h1>
      <p className="mt-4 text-lg text-gray-400 max-w-2xl mx-auto">
        Your personal AI guide to mastering new skills. Enter your goal, and get a structured, day-by-day learning plan complete with video resources.
      </p>
    </header>
  );
};