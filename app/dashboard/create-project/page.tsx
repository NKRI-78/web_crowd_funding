import React from "react";

import type { Metadata } from "next";
import CreateProjectPenerbit from "@/app/components/create-project-penerbit/CreateProjectPenerbit";

export const metadata: Metadata = {
  title: "Create Project | CapBridge",
  description: "Create Project Penerbit",
};

const CreateProjectPenerbitPage: React.FC = () => {
  return <CreateProjectPenerbit />;
};

export default CreateProjectPenerbitPage;
