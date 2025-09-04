import React from "react";
import { UserProfile } from "./IUserProfile";

interface Props {
  profile: UserProfile | null;
}

const DashboardPemodal: React.FC<Props> = ({ profile }) => {
  return <div></div>;
};

export default DashboardPemodal;
