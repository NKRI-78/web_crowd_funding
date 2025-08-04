import React from "react";

import type { Metadata } from "next";
import FormPemodal from "@/app/components/inputFormPemodal/FormPemodal";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Form Pemodal | CapBridge",
  description: "Form Pemodal",
};

const FormPemodalPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormPemodal />
    </Suspense>
  );
};

export default FormPemodalPage;
