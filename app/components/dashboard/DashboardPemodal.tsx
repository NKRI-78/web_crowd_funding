import React, { useEffect } from "react";
import { PanelContainer } from "./PanelContainer";
import { PanelContent } from "./PanelContent";
import { UserRoundCheck, UserSearch } from "lucide-react";
import { Project } from "@/app/interfaces/project/IProject";
import { User } from "@/app/interfaces/user/IUser";
import { ProjectCard } from "../project/ProjectCard";
import GridView from "../GridView";
import PortfolioCard from "../portfolio/PortfolioCard";
import { InvestorData } from "@/app/interfaces/investor/IInvestorData";
import { formatRupiah } from "@/app/lib/utils";

interface Props {
  profile: User | null;
  projects: Project[];
  data: InvestorData | null;
}

const DashboardPemodal: React.FC<Props> = ({ profile, projects, data }) => {
  return (
    <div className="space-y-4">
      {/* panel container */}
      {!profile?.verify_investor && (
        <PanelContainer clasName="flex flex-col items-center text-center">
          <PanelContent
            icon={<UserSearch className="w-16 h-16" />}
            title="Akun Anda Sedang Direview"
            message="Tim kami sedang memproses data akun Anda. Mohon tunggu hingga selesai. Setelah itu, Anda dapat mulai berinvestasi."
          />
        </PanelContainer>
      )}
      {/* <PanelContent
          icon={<UserRoundCheck className="w-16 h-16" />}
          title="Akun Berhasil Diverifikasi"
          message="Selamat! Akun Anda telah berhasil diverifikasi. Kini Anda sudah dapat mengakses seluruh fitur dan melakukan investasi pada proyek yang tersedia."
        /> */}

      <PanelContainer clasName="space-y-4">
        <div>
          <p className="font-semibold text-gray-500 text-lg">
            Limit Investasi Saya
          </p>
          <p className="font-black text-black text-2xl">
            {formatRupiah(data?.summary.remaining_quota_idr)}
          </p>
        </div>

        <div>
          <p className="font-semibold text-gray-500 text-lg">
            Total Pengeluaran
          </p>
          <p className="font-black text-black text-2xl">
            {formatRupiah(data?.summary.paid_all_time_idr)}
          </p>
        </div>
      </PanelContainer>
    </div>
  );
};

export default DashboardPemodal;
