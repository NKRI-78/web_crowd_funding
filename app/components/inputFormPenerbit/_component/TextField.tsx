import React from "react";
import SectionPoint from "./SectionPoint";

interface TextFieldProps {
  label?: string;
  placeholder: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => void;
  type?: string;
  className?: string;
  rows?: number;
}

const TextField: React.FC<TextFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  type = "text",
  className = "",
  rows = 6,
}) => {
  return (
    <div className={`${className}`}>
      {label && <SectionPoint text={label} className="mb-1" />}

      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          rows={rows}
          className="w-full px-4 py-2 border border-gray-300 focus:border focus:border-gray-400 rounded-md text-sm resize-none"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-2 border border-gray-300 focus:border focus:border-gray-400 rounded-md text-sm"
        />
      )}
    </div>
  );
};

export default TextField;
