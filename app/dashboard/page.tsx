import React from "react";

import type { Metadata } from "next";
import { Dashboard } from "../components/dashboard/Dashboard";

export const metadata: Metadata = {
  title: "Dashboard | FuLusme",
  description: "Dashboard",
};

const DashboardPage: React.FC = () => {
  return <Dashboard />;
};

export default DashboardPage;
