import { Portfolio } from "@/app/interfaces/portfolio/IPortfolio";
import { formatRupiah } from "@/app/lib/utils";
import React from "react";

interface PortfolioCardProps {
  data: Portfolio;
}

const PortfolioCard: React.FC<PortfolioCardProps> = ({ data }) => {
  const {
    project_title,
    target_amount_idr,
    user_paid_idr,
    project_paid_amount_idr,
  } = data;

  const percentage = (user_paid_idr / target_amount_idr) * 100;

  return (
    <div className="bg-white rounded-xl p-4 flex flex-col justify-between border border-[#13733b] hover:bg-gray-50">
      {/* Title & Status */}
      <h3 className="font-semibold text-lg text-gray-800">{project_title}</h3>

      {/* Progress */}
      <div className="mt-3">
        <p className="text-xs text-gray-600 mt-1">
          {formatRupiah(project_paid_amount_idr)} dari{" "}
          {formatRupiah(target_amount_idr)}
        </p>
      </div>

      <p className="text-xs text-gray-600 mt-1">
        Alokasi {percentage}% dari total limit yang Anda punya
      </p>

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
