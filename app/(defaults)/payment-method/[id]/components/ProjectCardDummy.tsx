"use client";

import React from "react";

interface ProjectCardProps {
  title: string;
  company: string;
  category: string;
  price: number;
  location: string;
  image: string;
  fundedAmount?: number;
  targetAmount?: number;
  fundedPercent?: number;
  investors?: number;
  tenor?: string;
  roi?: string;
  daysLeft?: number;
  status?: "Prelisting" | "Listing" | "Berjalan" | "Terpenuhi";
}

const statusColors: Record<string, string> = {
  Prelisting: "bg-yellow-100 text-yellow-700",
  Listing: "bg-blue-100 text-blue-700",
  Berjalan: "bg-green-100 text-green-700",
  Terpenuhi: "bg-gray-100 text-gray-700",
};

const ProjectCardDummy: React.FC<ProjectCardProps> = ({
  title,
  company,
  category,
  price,
  location,
  image,
  fundedAmount = 175000000,
  targetAmount = 250000000,
  fundedPercent = 70,
  investors = 125,
  tenor = "12 Bulan",
  roi = "+8% / tahun",
  daysLeft = 15,
  status = "Listing",
}) => {
  return (
    <div className="w-full bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden mb-6 hover:shadow-md transition">
      {/* Grid 2 kolom */}
      <div className="grid grid-cols-1 md:grid-cols-2">
        {/* Gambar */}
        <div className="relative w-full h-48 md:h-full">
          <img src={image} alt={title} className="w-full h-full object-cover" />
          <span className="absolute top-3 left-3 bg-[#10565C] text-white text-xs font-medium px-3 py-1 rounded-full shadow-sm">
            {category}
          </span>
        </div>

        {/* Detail */}
        <div className="p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-lg font-bold text-gray-900">{title}</h3>
            <p className="text-sm text-gray-500">{company}</p>

            {/* Info Grid */}
            <div className="mt-3 grid grid-cols-2 gap-3 text-sm">
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-500">Harga Unit</span>
                <p className="font-semibold text-[#10565C]">
                  Rp{price.toLocaleString("id-ID")}
                </p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-500">Lokasi</span>
                <p className="font-semibold text-gray-900">{location}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-500">Tenor</span>
                <p className="font-semibold text-gray-900">{tenor}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <span className="text-gray-500">ROI (Proyeksi)</span>
                <p className="font-semibold text-green-600">{roi}</p>
              </div>
            </div>
          </div>

          {/* Progress Bar + Status + Tombol */}
          <div className="mt-4">
            {/* Status */}
            <div className="mb-2">
              <span
                className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[status]}`}
              >
                {status}
              </span>
            </div>

            {/* Dana Terkumpul */}
            <div className="mb-3">
              <div className="flex justify-between text-xs text-gray-500 mb-1">
                <span>
                  Rp{fundedAmount.toLocaleString("id-ID")} / Rp
                  {targetAmount.toLocaleString("id-ID")}
                </span>
                <span>{daysLeft} Hari Tersisa</span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className="h-2 bg-[#10565C] rounded-full"
                  style={{ width: `${fundedPercent}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>{fundedPercent}% Terkumpul</span>
                <span>{investors} Investor</span>
              </div>
            </div>

            {/* Tombol */}
            <button className="w-full py-2 px-4 rounded-lg bg-[#10565C] text-white text-sm font-medium hover:bg-[#0d494e] transition">
              Lihat Detail
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCardDummy;
