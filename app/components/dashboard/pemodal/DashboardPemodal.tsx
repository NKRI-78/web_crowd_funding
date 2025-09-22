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
        <PanelContainer>
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-100 text-left">
                <th className="px-4 py-2 text-gray-600 font-semibold">
                  Keterangan
                </th>
                <th className="px-4 py-2 text-gray-600 font-semibold">Nilai</th>
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
                  <td className="px-4 py-2">{data?.summary.active_invoices}</td>
                </tr>
              </Tippy>
            </tbody>
          </table>
        </PanelContainer>
      )}
    </div>
  );
};

export default DashboardPemodal;
