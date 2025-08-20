import React from "react";

import type { Metadata } from "next";
import FormDataPemodalPerusahaan from "@/app/components/inputFormPemodalPerusahaan/FormDataPemodalPerusahaan";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Form Pemodal Perusahaan | CapBridge",
  description: "Form Pemodal Perusahaan",
};

const FormDataPemodalPerusahaanPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormDataPemodalPerusahaan />
    </Suspense>
  );
};

export default FormDataPemodalPerusahaanPage;
