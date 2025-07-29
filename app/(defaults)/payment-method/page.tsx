import React, { Suspense } from "react";
import type { Metadata } from "next";
import PaymentMethod from "./PaymentMethod";

export const metadata: Metadata = {
  title: "Pilih Metode Pembayaran | CapBridge",
  description: "Pilih Metode Pembayaran",
};

const FormPenerbitPage: React.FC = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PaymentMethod />
    </Suspense>
  );
};

export default FormPenerbitPage;
