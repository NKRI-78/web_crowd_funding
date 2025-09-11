import React from "react";
import { PanelContainer } from "./PanelContainer";
import { PanelContent } from "./PanelContent";
import { UserSearch } from "lucide-react";
import { Project } from "@/app/interfaces/project/IProject";
import { User } from "@/app/interfaces/user/IUser";
import { ProjectCard } from "../project/ProjectCard";
import GridView from "../GridView";
import { Portfolio } from "@/app/interfaces/portfolio/IPortfolio";
import PortfolioCard from "../portfolio/PortfolioCard";

interface Props {
  profile: User | null;
  projects: Project[];
  investedProjects: Portfolio[];
}

const DashboardPemodal: React.FC<Props> = ({
  profile,
  projects,
  investedProjects,
}) => {
  console.log("investedProjects.length");
  console.log(investedProjects.length);
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

      {/* proyek yang ia invest */}
      {investedProjects.length > 0 && (
        <PanelContainer>
          <h2 className="font-bold text-lg text-black mb-5">Portfolio</h2>

          <GridView
            items={investedProjects}
            gapClass="gap-4"
            breakpointCols={{ sm: 2, md: 3, lg: 4 }}
            itemKey={(p) => p.project_uid}
            renderItem={(p) => {
              return <PortfolioCard data={p} />;
            }}
          />
        </PanelContainer>
      )}

      {/* semua proyek yang sedang berjalan */}
      {projects.length > 0 && (
        <PanelContainer>
          <h2 className="font-bold text-lg text-black mb-5">
            Proyek yang sedang berjalan
          </h2>

          <GridView
            items={projects}
            gapClass="gap-4"
            breakpointCols={{ sm: 2, md: 3, lg: 4 }}
            itemKey={(p) => p.id}
            renderItem={(p) => {
              return <ProjectCard project={p} />;
            }}
          />
        </PanelContainer>
      )}
    </div>
  );
};

export default DashboardPemodal;
