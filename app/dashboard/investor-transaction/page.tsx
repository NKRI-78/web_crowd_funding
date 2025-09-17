import TransactionInvestorView from "@/app/components/dashboard/pemodal/TransactionInvestorView";
import { Metadata } from "next";
import React from "react";

export const metadata: Metadata = {
  title: "Transaksi Pemodal | FuLusme",
  description: "Transaksi Pemodal",
};

const InvestorTransactionPage: React.FC = () => {
  return <TransactionInvestorView />;
};

export default InvestorTransactionPage;
