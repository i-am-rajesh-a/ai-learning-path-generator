
import React from 'react';

interface GoalInputProps {
  value: string;
  onChange: (value: string) => void;
  disabled: boolean;
}

export const GoalInput: React.FC<GoalInputProps> = ({ value, onChange, disabled }) => {
  return (
    <div className="flex flex-col space-y-2">
      <label htmlFor="goal" className="text-lg font-semibold text-gray-300">
        What do you want to learn?
      </label>
      <textarea
        id="goal"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        placeholder="e.g., 'Learn React for web development in 10 days'"
        className="w-full p-3 bg-gray-700 border-2 border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all duration-300 text-white placeholder-gray-400 h-28 resize-none"
      />
    </div>
  );
};
