// app/payment/[id]/page.tsx
import type { Metadata } from "next";
import PembayaranBCAWithDetail from "./PymentManual";

export const metadata: Metadata = {
  title: "Payment Manual | FuLusme",
  description: "Payment Manual",
};

export default function Page({ params }: { params: { id: string } }) {
  // Tidak fetch di server karena endpoint butuh Bearer token
  // Biarkan komponen client yang fetch pakai axios + getUser()
  return <PembayaranBCAWithDetail inboxId={params.id} />;
}
