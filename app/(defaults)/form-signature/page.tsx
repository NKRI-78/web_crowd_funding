import React from "react";

import type { Metadata } from "next";
import FormSignature from "@/app/components/signature/FormSignature";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Form Signature | CapBridge",
  description: "Form Signature",
};

const FormSignaturePage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FormSignature />
    </Suspense>
  );
};

export default FormSignaturePage;
