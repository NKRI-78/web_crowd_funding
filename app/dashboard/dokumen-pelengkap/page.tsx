import React from "react";

import type { Metadata } from "next";
import FormDokumenTambahanPage from "@/app/components/formDokumenTambahanPenerbit/FormDokumenTambahanPage";

export const metadata: Metadata = {
  title: "Form Pelengkap | FuLusme",
  description: "Add Form Pelengkap Penerbit",
};

const CreateProjectPenerbitPage: React.FC = () => {
  return <FormDokumenTambahanPage />;
};

export default CreateProjectPenerbitPage;
