import React from "react";

interface ProgressBarProps {
  percentage: number;
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage }) => {
  const safePercentage = Math.max(0, Math.min(percentage, 100));

  // Ukuran label (dalam rem, perlu menyesuaikan dengan padding px-2)
  const labelWidthRem = 3; // Kurang lebih 3rem lebar label hijau

  // Hitung posisi left (agar tidak kelewat kiri/kanan)
  const labelLeft = `calc(${safePercentage}% - ${labelWidthRem / 2}rem)`;

  return (
    <div className="relative w-full max-w-md h-4 bg-white rounded-full my-4 mx-auto">
      {/* Bar Isi */}
      <div
        className="absolute top-0 left-0 h-4 bg-gradient-to-r from-[#039BA9] to-[#37F9D2] rounded-full transition-all duration-300"
        style={{
          width: `${safePercentage}%`,
          borderTopRightRadius: safePercentage === 100 ? "0.5rem" : "9999px",
          borderBottomRightRadius: safePercentage === 100 ? "0.5rem" : "9999px",
        }}
      ></div>

      {/* Label Hijau */}
      <div
        className="absolute top-1/2 -translate-y-1/2 transform bg-gradient-to-r from-[#039BA9] to-[#2abc9f] text-white text-xs border border-white font-bold px-2 py-[1px] rounded-full shadow transition-all duration-300 whitespace-nowrap"
        style={{
          left: `min(max(${labelLeft}, 0rem), calc(100% - ${labelWidthRem}rem))`,
        }}
      >
        {safePercentage}%
      </div>
    </div>
  );
};

export default ProgressBar;
