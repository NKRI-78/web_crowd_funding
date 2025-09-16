"use client";

import React from "react";
import DashboardPemodal from "./DashboardPemodal";
import DashboardUser from "./DashboardUser";
import { DashboardPenerbit } from "./DashboardPenerbit";
import { Project } from "@/app/interfaces/project/IProject";
import { User } from "@/app/interfaces/user/IUser";
import { InvestorData } from "@/app/interfaces/investor/IInvestorData";
import UndefinedRole from "./UndefinedRole";

interface ContentProps {
  userAuthData: AuthDataResponse | null;
  userProfile: User | null;
  projects: Project[];
  investorData: InvestorData | null;
}

export const DashboardContent: React.FC<ContentProps> = ({
  userAuthData,
  userProfile,
  projects,
  investorData,
}) => {
  const role = userAuthData?.role ?? "-";

  return (
    <div>
      {role === "emiten" ? (
        <DashboardPenerbit profile={userProfile} />
      ) : role === "investor" ? (
        <DashboardPemodal
          profile={userProfile}
          projects={projects}
          data={investorData}
        />
      ) : role === "user" ? (
        <DashboardUser user={userAuthData} />
      ) : (
        <UndefinedRole />
      )}
    </div>
  );
};
