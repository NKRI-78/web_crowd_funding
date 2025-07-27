import React from "react";

import type { Metadata } from "next";
import WaitingPayment from "./WaitingPayment";

export const metadata: Metadata = {
  title: "Menunggu Pembayaran | CapBridge",
  description: "Menunggu Pembayaran",
};

const FormPenerbitPage: React.FC = () => {
  return <WaitingPayment />;
};

export default FormPenerbitPage;
