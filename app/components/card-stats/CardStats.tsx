// components/card-stats/CardStats.tsx
import React from "react";

interface CardStatsProps {
  title: string;
  desc: string;
  value?: string;
  bgColor?: string;
}

const CardStats = ({
  title,
  desc,
  value = "Rp. 0",
  bgColor = "bg-white",
}: CardStatsProps) => {
  return (
    <div
      className={`flex flex-col justify-between shadow-lg rounded-xl p-4 sm:p-6 ${bgColor}`}
    >
      <div className="flex-1 flex flex-col gap-y-2">
        <h6 className="text-slate-600 text-sm">{title}</h6>
        <h2 className="text-black font-bold text-xl">{value}</h2>
        <p className="text-sm text-slate-500">{desc}</p>
      </div>
      <div className="mt-4 flex justify-end">
        <img className="w-12 h-12" src="/images/money.png" alt="icon" />
      </div>
    </div>
  );
};

export default CardStats;
