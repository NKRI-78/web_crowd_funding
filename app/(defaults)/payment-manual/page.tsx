import React, { Suspense } from "react";
import type { Metadata } from "next";
import PembayaranDanamon from "./PymentManual";

export const metadata: Metadata = {
  title: "Payment Manual | CapBridge",
  description: "Payment Manual",
};

const FormPenerbitPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PembayaranDanamon />
    </Suspense>
  );
};

export default FormPenerbitPage;
