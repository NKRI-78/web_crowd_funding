"use client";

import { Radio } from "lucide-react";
import React from "react";

interface BroadcastIconProps {
  active?: boolean; // true = animasi jalan
  color?: string; // warna fleksibel, default putih
}

const BroadcastIcon: React.FC<BroadcastIconProps> = ({
  active = true,
  color = "white",
}) => {
  return (
    <div className="relative flex items-center justify-center w-5 h-5">
      {/* Gelombang pancaran */}
      {active && (
        <>
          <span
            className={`absolute w-10 h-10 rounded-full border-2 animate-ping`}
            style={{ borderColor: color }}
          ></span>
          <span
            className={`absolute w-14 h-14 rounded-full border-2 opacity-70 animate-ping delay-200`}
            style={{ borderColor: color }}
          ></span>
        </>
      )}

      {/* Ikon Radio */}
      <Radio
        className={`w-8 h-8 transition-all ${
          active ? "animate-pulse" : "opacity-70"
        }`}
        style={{ color }}
      />
    </div>
  );
};

export default BroadcastIcon;
