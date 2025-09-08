import type { Metadata } from "next";
import PaymentMethod from "./PaymentMethod";

export const metadata: Metadata = {
  title: "Pilih Metode Pembayaran | CapBridge",
  description: "Pilih Metode Pembayaran",
};

// ✅ ambil [id] dari params, terus oper ke PaymentMethod sebagai props
export default function PaymentMethodPage({
  params,
}: {
  params: { id: string };
}) {
  return <PaymentMethod id={params.id} />;
}
