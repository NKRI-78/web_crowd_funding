"use client";

import { formatRupiah } from "@/app/utils/formatRupiah";

type PaymentItem = {
  id: number;
  template_name: string;
  calculated_amount: number;
  template_description?: string;
};

type PaymentDetail = {
  info: PaymentItem[];
  total_amount: number;
};

export default function DetailPembayaran({
  detail,
}: {
  detail: PaymentDetail;
}) {
  return (
    <div className="bg-white border border-[#10565C] rounded-2xl p-5">
      <h3 className="text-lg font-semibold text-gray-800 mb-3">
        Detail Pembayaran
      </h3>

      <ul className="divide-y divide-gray-200">
        {detail.info.map((item) => (
          <li key={item.id} className="py-3">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-700">
                {item.template_name}
              </span>
              <span className="font-semibold text-[#10565C]">
                {formatRupiah(item.calculated_amount)}
              </span>
            </div>
            {item.template_description && (
              <p className="text-sm text-gray-500">
                {item.template_description}
              </p>
            )}
          </li>
        ))}
      </ul>

      <div className="pt-4 mt-1 border-t flex items-center justify-between">
        <span className="text-gray-700 font-semibold">Total</span>
        <span className="text-xl font-bold text-[#10565C]">
          {formatRupiah(detail.total_amount)}
        </span>
      </div>
    </div>
  );
}
