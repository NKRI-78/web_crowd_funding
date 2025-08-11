import React from "react";
import SectionPoint from "./SectionPoint";

interface MonthSelectionProps {
  label: string;
  selected: string;
  onChange: (value: string) => void;
}

const options = ["3 Bulan", "6 Bulan", "9 Bulan", "12 Bulan"];

const MonthSelection: React.FC<MonthSelectionProps> = ({
  label,
  selected,
  onChange,
}) => {
  return (
    <div className="w-full mb-6">
      <SectionPoint text={label} className="mb-2" />
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-y-4 gap-x-4">
        {options.map((option) => (
          <label
            key={option}
            className="inline-flex items-center gap-2 text-[13px] text-gray-700"
          >
            <input
              type="radio"
              name={label}
              value={option}
              checked={selected === option}
              onChange={() => onChange(option)}
              className="accent-blue-600"
            />
            {option}
          </label>
        ))}
      </div>
    </div>
  );
};

export default MonthSelection;
