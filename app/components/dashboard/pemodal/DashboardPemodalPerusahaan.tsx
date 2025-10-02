import React, { useState } from "react";
import { PanelContainer } from "../PanelContainer";
import { PanelContent } from "../PanelContent";
import { UserSearch, Infinity, Info } from "lucide-react";
import { User } from "@/app/interfaces/user/IUser";
import { InvestorData } from "@/app/interfaces/investor/IInvestorData";
import { formatRupiah } from "@/app/lib/utils";
import GeneralDialog from "../../GeneralDialog";

interface Props {
  profile: User | null;
  data: InvestorData | null;
}

const DashboardPemodalPerusahaan: React.FC<Props> = ({ profile, data }) => {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <p className="text-xl font-bold">Pemodal Perusahaan</p>
        <p className="text-sm text-gray-500">
          Sebagai pemodal perusahaan, Anda tidak memiliki limit pembelian efek
          dan bebas berinvestasi di berbagai proyek tanpa batasan.
        </p>
      </div>

      {!profile?.verify_investor && (
        <PanelContainer clasName="flex flex-col items-center text-center">
          <PanelContent
            icon={<UserSearch className="w-16 h-16" />}
            title="Akun Anda Sedang Direview"
            message="Tim kami sedang memproses data akun Anda. Mohon tunggu hingga selesai. Setelah itu, Anda dapat mulai berinvestasi."
          />
        </PanelContainer>
      )}

      {profile?.verify_investor && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <PanelContainer>
              <div>
                <h1 className="text-gray-800 text-lg font-semibold mb-2">
                  Kuota Investasi Tersedia
                </h1>

                <p className="text-green-500 text-3xl font-bold">
                  <Infinity />
                </p>

                {(() => {
                  const annual = data?.summary.annual_quota_idr || 0;
                  const remaining = data?.summary.remaining_quota_idr || 0;
                  const used = annual - remaining;
                  const percentage =
                    annual > 0 ? Math.min((used / annual) * 100, 100) : 0;

                  return (
                    <>
                      <p className="text-sm text-gray-500 mt-1">
                        {percentage.toFixed(0)}% Terpakai Tahun Ini
                      </p>

                      <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </>
                  );
                })()}
              </div>
            </PanelContainer>
            <PanelContainer>
              <div>
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <h1 className="text-gray-800 text-lg font-semibold flex items-center gap-2">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    Informasi
                  </h1>
                </div>
                <hr className="mb-4 border-gray-200" />

                {/* Body */}
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Pendapatan Tahunan</span>
                    <span className="font-semibold text-gray-900">
                      {formatRupiah(data?.summary.annual_income_idr)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Terpakai Tahun Ini</span>
                    <span className="font-semibold text-gray-900">
                      {formatRupiah(data?.summary.used_this_year_idr)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Tagihan Aktif</span>
                    <span className="font-semibold text-gray-900">
                      {data?.summary.active_invoices}
                    </span>
                  </div>
                </div>
              </div>
            </PanelContainer>
          </div>
        </>
      )}
    </div>
  );
};

export default DashboardPemodalPerusahaan;
