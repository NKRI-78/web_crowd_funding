import React from "react";

import type { Metadata } from "next";
import { Dashboard } from "../components/dashboard/Dashboard";
import DashboardLayout from "../components/dashboard/DashboardLayout";

export const metadata: Metadata = {
  title: "Dashboard | FuLusme",
  description: "Dashboard",
};

const DashboardPage: React.FC = () => {
  return <DashboardLayout />;
};

export default DashboardPage;
