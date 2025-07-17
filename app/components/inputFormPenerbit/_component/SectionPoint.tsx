import React from "react";

interface SectionPointProps {
  text: string;
  className?: string;
}

const SectionPoint: React.FC<SectionPointProps> = ({ text, className }) => {
  return (
    <div className={className}>
      <h4 className="font-semibold text-sm text-gray-600">{text}</h4>
    </div>
  );
};

export default SectionPoint;
