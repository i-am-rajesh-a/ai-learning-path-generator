import React from 'react';
// FIX: The type LearnerLevel does not exist. The correct type is SkillLevel.
import { SkillLevel } from '../types';

interface LevelSelectorProps {
  selected: SkillLevel;
  onSelect: (level: SkillLevel) => void;
  disabled: boolean;
}

const OptionButton: React.FC<{
  label: string;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}> = ({ label, isSelected, onClick, disabled }) => {
  const baseClasses = "w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800";
  const selectedClasses = "bg-indigo-600 text-white shadow-lg";
  const unselectedClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      {label}
    </button>
  );
};

export const LevelSelector: React.FC<LevelSelectorProps> = ({ selected, onSelect, disabled }) => {
  return (
    <div className="mt-6">
      <label className="text-lg font-semibold text-gray-300 mb-2 block">
        What is your current level?
      </label>
      <div className="grid grid-cols-3 gap-4">
        <OptionButton
          label="Beginner"
          isSelected={selected === 'beginner'}
          onClick={() => onSelect('beginner')}
          disabled={disabled}
        />
        <OptionButton
          label="Intermediate"
          isSelected={selected === 'intermediate'}
          onClick={() => onSelect('intermediate')}
          disabled={disabled}
        />
        <OptionButton
          label="Advanced"
          isSelected={selected === 'advanced'}
          onClick={() => onSelect('advanced')}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
