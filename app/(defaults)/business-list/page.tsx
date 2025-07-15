import React from "react";

import type { Metadata } from "next";
import BussinesList from "@components/bussines-list/BusinessList";

export const metadata: Metadata = {
  title: "Daftar Bisnis | CapBridge",
  description: "Daftar Bisnis",
};

const BussinesListPage: React.FC = () => {
  return (
    <BussinesList/>
  );
};

export default BussinesListPage;
