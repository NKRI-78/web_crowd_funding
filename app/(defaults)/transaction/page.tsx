import React from "react";

import type { Metadata } from "next";
import Transaction from "@/app/components/notif/transaction/Transaction";

export const metadata: Metadata = {
  title: "Transaction | CapBridge",
  description: "Transaction",
};

const TransactionPage: React.FC = () => {
  return <Transaction />;
};

export default TransactionPage;
