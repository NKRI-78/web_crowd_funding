import React from "react";
import { PanelContainer } from "./PanelContainer";
import { PanelContent } from "./PanelContent";
import { UserSearch } from "lucide-react";
import { Project } from "@/app/interfaces/project/IProject";
import { User } from "@/app/interfaces/user/IUser";
import { ProjectCard } from "../project/ProjectCard";

interface Props {
  profile: User | null;
  projects: Project[];
}

const DashboardPemodal: React.FC<Props> = ({ profile, projects }) => {
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

      {/* project */}
      {projects.length > 0 && (
        <PanelContainer>
          <h2 className="font-bold text-lg text-black mb-5">
            Proyek yang sedang berjalan
          </h2>

          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </PanelContainer>
      )}
    </div>
  );
};

export default DashboardPemodal;
