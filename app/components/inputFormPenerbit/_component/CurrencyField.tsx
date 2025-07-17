import SectionPoint from "./SectionPoint";

interface CurrencyFieldProps {
  label?: string;
  placeholder: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  disabled?: boolean;
}

const formatToRupiah = (value: string) => {
  const numeric = value.replace(/\D/g, "");
  if (!numeric) return "";
  const formatted = numeric.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp ${formatted}`;
};

const CurrencyField: React.FC<CurrencyFieldProps> = ({
  label,
  placeholder,
  value,
  onChange,
  className = "",
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/\D/g, ""); // Hanya angka
    const syntheticEvent = {
      ...e,
      target: {
        ...e.target,
        value: rawValue,
      },
    } as React.ChangeEvent<HTMLInputElement>;
    onChange(syntheticEvent);
  };

  const inputStyle = `w-full px-4 py-2 border border-gray-300 focus:border-gray-400 rounded-md text-sm ${
    disabled ? "bg-gray-100 text-gray-500 cursor-not-allowed" : ""
  }`;

  return (
    <div className={`${className}`}>
      {label && <SectionPoint text={label} className="mb-1" />}
      <input
        type="text"
        inputMode="numeric"
        value={formatToRupiah(value)}
        onChange={handleChange}
        placeholder={placeholder}
        readOnly={disabled}
        className={inputStyle}
      />
    </div>
  );
};

export default CurrencyField;
