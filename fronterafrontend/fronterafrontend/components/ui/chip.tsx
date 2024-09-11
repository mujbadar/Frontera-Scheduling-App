// components/ui/chip.tsx
import React from 'react';

interface ChipProps {
  label: string;
  onRemove: () => void;
}

const Chip: React.FC<ChipProps> = ({ label, onRemove }) => {
  return (
    <div className="flex items-center bg-gray-200 rounded-full px-3 py-1 mr-2 mb-2 text-sm text-gray-700">
      {label}
      <button
        onClick={onRemove}
        className="ml-2 text-gray-500 hover:text-gray-700"
      >
        &times;
      </button>
    </div>
  );
};

export default Chip;
