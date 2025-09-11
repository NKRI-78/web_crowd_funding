import { Portfolio } from "@/app/interfaces/portfolio/IPortfolio";
import React from "react";

interface PortfolioCardProps {
  data: Portfolio;
}

const formatRupiah = (value: number) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(value);
};

const PortfolioCard: React.FC<PortfolioCardProps> = ({ data }) => {
  const {
    project_title,
    funding_status,
    target_amount_idr,
    user_paid_idr,
    project_paid_amount_idr,
  } = data;

  const progress =
    target_amount_idr > 0
      ? Math.min((project_paid_amount_idr / target_amount_idr) * 100, 100)
      : 0;

  return (
    <div className="bg-white shadow-md rounded-2xl p-4 flex flex-col justify-between border">
      {/* Title & Status */}
      <div>
        <h3 className="font-semibold text-lg text-gray-800 mb-1">
          {project_title}
        </h3>
        <span
          className={`text-xs px-2 py-1 rounded-full ${
            funding_status === "OPEN"
              ? "bg-[#13733b] text-white"
              : "bg-gray-300 text-gray-700"
          }`}
        >
          {funding_status}
        </span>
      </div>

      {/* Progress */}
      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="h-2 rounded-full"
            style={{
              width: `${progress}%`,
              backgroundColor: "#13733b",
            }}
          />
        </div>
        <p className="text-xs text-gray-600 mt-1">
          {formatRupiah(project_paid_amount_idr)} dari{" "}
          {formatRupiah(target_amount_idr)}
        </p>
      </div>

      {/* User Investment */}
      <div className="mt-4 flex justify-between items-center">
        <span className="text-sm text-gray-700">Investasi Anda:</span>
        <span className="text-sm font-semibold text-[#13733b]">
          {formatRupiah(user_paid_idr)}
        </span>
      </div>
    </div>
  );
};

export default PortfolioCard;
