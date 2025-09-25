import React from "react";
import { PanelContainer } from "../PanelContainer";
import { PanelContent } from "../PanelContent";
import { UserSearch } from "lucide-react";
import { User } from "@/app/interfaces/user/IUser";
import { InvestorData } from "@/app/interfaces/investor/IInvestorData";
import { formatRupiah } from "@/app/lib/utils";
import Tippy from "@tippyjs/react";
import { useRouter } from "next/navigation";

interface Props {
  profile: User | null;
  data: InvestorData | null;
}

const DashboardPemodal: React.FC<Props> = ({ profile, data }) => {
  const router = useRouter();

  return (
    <div className="space-y-4">
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
                  {formatRupiah(data?.summary.remaining_quota_idr)}
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

                <p className="text-sm text-gray-500 mt-2">
                  Limit Investasi: Rp{" "}
                  {formatRupiah(data?.summary.annual_quota_idr)}
                </p>
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

          {/* <PanelContainer>
            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-gray-100 text-left">
                  <th className="px-4 py-2 text-gray-600 font-semibold">
                    Keterangan
                  </th>
                  <th className="px-4 py-2 text-gray-600 font-semibold">
                    Nilai
                  </th>
                </tr>
              </thead>
              <tbody className="text-gray-800">
                <tr className="border-b">
                  <td className="px-4 py-2">Pendapatan Tahunan</td>
                  <td className="px-4 py-2 font-medium">
                    {formatRupiah(data?.summary.annual_income_idr)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Limit Investasi</td>
                  <td className="px-4 py-2 font-medium">
                    {formatRupiah(data?.summary.annual_quota_idr)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Sisa Kuota Investasi</td>
                  <td className="px-4 py-2 font-bold text-green-600">
                    {formatRupiah(data?.summary.remaining_quota_idr)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Terpakai Tahun Ini</td>
                  <td className="px-4 py-2 font-medium">
                    {formatRupiah(data?.summary.used_this_year_idr)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Total Pengeluaran</td>
                  <td className="px-4 py-2 font-medium">
                    {formatRupiah(data?.summary.paid_all_time_idr)}
                  </td>
                </tr>
                <tr className="border-b">
                  <td className="px-4 py-2">Pengeluaran Tahun Ini</td>
                  <td className="px-4 py-2 font-medium">
                    {formatRupiah(data?.summary.paid_this_year_idr)}
                  </td>
                </tr>

                <Tippy
                  content={`Masih ada ${data?.summary.active_invoices} transaksi pembelian efek yang belum dibayar`}
                >
                  <tr
                    className="hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      router.push("/dashboard/investor-transaction");
                    }}
                  >
                    <td className="px-4 py-2">Tagihan Aktif</td>
                    <td className="px-4 py-2">
                      {data?.summary.active_invoices}
                    </td>
                  </tr>
                </Tippy>
              </tbody>
            </table>
          </PanelContainer> */}
        </>
      )}
    </div>
  );
};

export default DashboardPemodal;
