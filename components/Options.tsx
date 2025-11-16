
import React from 'react';

// FIX: DocType was not exported from '../types'. Defined it locally to fix the compile error.
// This component is currently unused in the application.
type DocType = 'drive' | 'notion';

interface OptionsProps {
  selected: DocType;
  onSelect: (type: DocType) => void;
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

export const Options: React.FC<OptionsProps> = ({ selected, onSelect, disabled }) => {
  return (
    <div className="mt-6">
      <label className="text-lg font-semibold text-gray-300 mb-2 block">
        Choose your document format
      </label>
      <div className="grid grid-cols-2 gap-4">
        <OptionButton
          label="Google Drive"
          isSelected={selected === 'drive'}
          onClick={() => onSelect('drive')}
          disabled={disabled}
        />
        <OptionButton
          label="Notion"
          isSelected={selected === 'notion'}
          onClick={() => onSelect('notion')}
          disabled={disabled}
        />
      </div>
    </div>
  );
};
