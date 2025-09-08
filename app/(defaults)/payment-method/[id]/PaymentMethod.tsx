"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { API_BACKEND } from "@/app/utils/constant";
import { getUser } from "@/app/lib/auth";
import { PaymentMethodType } from "./components/types";
import TransactionSummary from "./components/TransactionSummary";
import ConfirmButton from "./components/ConfirmButton";
import ProjectCardDummy from "./components/ProjectCardDummy";
import ProjectCardSkeleton from "./components/ProjectCardSkeleton";

const PaymentMethod = ({ id }: { id: string }) => {
  const [methods, setMethods] = useState<PaymentMethodType[]>([]);
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethodType | null>(null);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  // 🔹 dummy harga dasar
  const baseAmount = 250000;

  useEffect(() => {
    const userData = getUser();
    if (userData) {
      setLoading(true);
      axios
        .get(`https://api.pg.capbridge.langitdigital78.com/api/v1/channel`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
        .then((response) => {
          setMethods(response.data.data);
        })
        .catch((error) => {
          console.error("Failed to fetch payment list:", error);
        })
        .finally(() => setLoading(false));
    }
  }, []);

  const handleSelect = (method: PaymentMethodType) => {
    setSelectedMethod(method);
  };

  const handleStorePayment = async () => {
    if (!selectedMethod) return;
    try {
      const payload = {
        project_id: id,
        payment_method: selectedMethod.id.toString(),
      };

      const userData = getUser();
      if (userData) {
        const endpoint = `${API_BACKEND}/api/v1/payment/order`;
        const result = await axios.post(endpoint, payload, {
          headers: { Authorization: `Bearer ${userData?.token}` },
        });
        router.push(`/waiting-payment?orderId=${result.data.data.inbox.id}`);
      }
    } catch (err: any) {
      let errorMessage = "Terjadi kesalahan. Silakan coba lagi.";
      if (axios.isAxiosError(err)) {
        if (err.response) {
          errorMessage =
            err.response.data?.message || JSON.stringify(err.response.data);
        } else if (err.request) {
          errorMessage = "Tidak ada respon dari server.";
        } else {
          errorMessage = err.message;
        }
      }
      Swal.fire({ icon: "error", title: "Oops...", text: errorMessage });
    }
  };

  // skeleton shimmer card
  const SkeletonCard = () => (
    <div className="relative flex flex-col items-center justify-center rounded-xl border p-4 overflow-hidden">
      <div className="h-10 w-16 bg-gray-200 rounded mb-2 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      <div className="h-3 w-20 bg-gray-200 rounded mb-1 relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
      <div className="h-2 w-12 bg-gray-200 rounded relative overflow-hidden">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/60 to-transparent" />
      </div>
    </div>
  );

  return (
    <div className="py-28 px-4 md:px-12 flex flex-col items-center">
      {/* Card Proyek */}
      {loading ? (
        <ProjectCardSkeleton />
      ) : (
        <ProjectCardDummy
          title="Grand Ocean Beach Club and Resort"
          company="PT Cipta Karya Nusantara"
          category="KONTRAKTOR"
          price={90000}
          location="Canggu, Bali"
          image="https://picsum.photos/id/1018/800/400"
        />
      )}
      {/* Card Utama */}
      <div className="w-full bg-white rounded-2xl my-2 p-6 shadow-md">
        <h2 className="text-gray-700 font-semibold mb-4">
          Pilih Metode Pembayaran
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 6 }).map((_, idx) => (
                <SkeletonCard key={idx} />
              ))
            : methods.map((method) => (
                <div
                  key={method.id}
                  onClick={() => handleSelect(method)}
                  className={`flex flex-col items-center justify-center rounded-xl border p-4 cursor-pointer transition-all duration-200 hover:scale-105 ${
                    selectedMethod?.id === method.id
                      ? "border-[#10565C] bg-[#10565C]/10 shadow-md"
                      : "border-gray-200 hover:border-[#10565C]"
                  }`}
                >
                  <img
                    src={method.logo}
                    alt={method.name}
                    className="h-10 object-contain mb-2"
                  />
                  <p className="text-sm font-medium text-gray-800 text-center">
                    {method.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    Fee Rp{method.fee.toLocaleString("id-ID")}
                  </p>
                </div>
              ))}
        </div>

        {/* Rincian + Button */}
        {selectedMethod && (
          <div className="mt-6">
            <TransactionSummary
              method={selectedMethod}
              baseAmount={baseAmount}
            />

            <hr className="my-6 border-gray-200" />

            <div className="flex justify-end">
              <ConfirmButton
                onClick={() => handleStorePayment()}
                disabled={!selectedMethod || loading}
                loading={loading}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentMethod;
