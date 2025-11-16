import React from 'react';
// FIX: The type LearningDuration does not exist. The correct type is LearningIntensity.
import { LearningIntensity } from '../types';

interface DurationSelectorProps {
  selected: LearningIntensity;
  onSelect: (duration: LearningIntensity) => void;
  disabled: boolean;
}

const OptionButton: React.FC<{
  label: string;
  description: string;
  isSelected: boolean;
  onClick: () => void;
  disabled: boolean;
}> = ({ label, description, isSelected, onClick, disabled }) => {
  const baseClasses = "w-full py-3 px-4 rounded-lg font-semibold transition-all duration-300 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 flex flex-col items-center justify-center text-center";
  const selectedClasses = "bg-indigo-600 text-white shadow-lg";
  const unselectedClasses = "bg-gray-700 text-gray-300 hover:bg-gray-600";
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${isSelected ? selectedClasses : unselectedClasses}`}
    >
      <span>{label}</span>
      <span className="text-xs font-normal mt-1">{description}</span>
    </button>
  );
};

export const DurationSelector: React.FC<DurationSelectorProps> = ({ selected, onSelect, disabled }) => {
  return (
    <div className="mt-6">
      <label className="text-lg font-semibold text-gray-300 mb-2 block">
        How intense do you want your plan to be?
      </label>
      <div className="grid grid-cols-3 gap-4">
        <OptionButton
          label="Casual"
          description="3-5 Days"
          isSelected={selected === 'casual'}
          onClick={() => onSelect('casual')}
          disabled={disabled}
        />
        <OptionButton
          label="Moderate"
          description="7-8 Days"
          isSelected={selected === 'moderate'}
          onClick={() => onSelect('moderate')}
          disabled={disabled}
        />
        <OptionButton
          label="Intense"
          description="10-12 Days"
          isSelected={selected === 'intense'}
          onClick={() => onSelect('intense')}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
