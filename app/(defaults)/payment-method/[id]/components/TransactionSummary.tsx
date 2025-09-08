"use client";

import React from "react";
import { PaymentMethodType } from "./types";

interface TransactionSummaryProps {
  method: PaymentMethodType;
  baseAmount: number;
}

const TransactionSummary: React.FC<TransactionSummaryProps> = ({
  method,
  baseAmount,
}) => {
  const subtotal = baseAmount;
  const fee = method.fee;
  const total = subtotal + fee;

  const transaction = {
    orderId: "INV-20250904-XYZ123",
    projectName: "Proyek CapBridge Dummy",
    subtotal,
    fee,
    total,
    date: "04 September 2025",
    status: "Menunggu Pembayaran",
    paymentMethod: method.name,
  };

  const row = (label: string, value: React.ReactNode) => (
    <div className="flex justify-between py-2 border-b border-gray-100 last:border-0">
      <span className="text-gray-600">{label}</span>
      <span className="font-medium text-gray-900">{value}</span>
    </div>
  );

  return (
    <div className="mt-8 rounded-xl border border-gray-200 overflow-hidden">
      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
        <h2 className="text-base font-semibold text-gray-900">
          Rincian Transaksi
        </h2>
      </div>
      <div className="px-4 py-4 space-y-2 text-sm">
        {row("Order ID", transaction.orderId)}
        {row("Proyek", transaction.projectName)}
        {row("Tanggal", transaction.date)}
        {row("Metode Pembayaran", transaction.paymentMethod)}
        {row("Subtotal", `Rp${transaction.subtotal.toLocaleString("id-ID")}`)}
        {row("Biaya Admin", `Rp${transaction.fee.toLocaleString("id-ID")}`)}

        {/* Total */}
        <div className="flex justify-between items-center py-3 border-t border-gray-200">
          <span className="text-gray-900 font-semibold">Total</span>
          <span className="text-lg font-bold text-[#10565C]">
            Rp{transaction.total.toLocaleString("id-ID")}
          </span>
        </div>

        {/* Status */}
        {/* <div className="flex justify-between items-center pt-2">
          <span className="text-gray-600">Status</span>
          <span
            className={`px-3 py-1 rounded-full text-xs font-medium ${
              transaction.status === "Menunggu Pembayaran"
                ? "bg-yellow-100 text-yellow-700"
                : "bg-[#10565C]/10 text-[#10565C]"
            }`}
          >
            {transaction.status}
          </span>
        </div> */}
      </div>
    </div>
  );
};

export default TransactionSummary;
