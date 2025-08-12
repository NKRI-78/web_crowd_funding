"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter, useSearchParams } from "next/navigation";
import Swal from "sweetalert2";
import { API_BACKEND } from "@/app/utils/constant";
import FormButton from "@/app/components/inputFormPenerbit/_component/FormButton";
import { getUser } from "@/app/lib/auth";

interface PaymentMethodType {
  id: number;
  paymentType: string;
  name: string;
  nameCode: string;
  logo: string;
  fee: number;
  service_fee: any;
  platform: string;
  howToUseUrl: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: any;
}

interface OrderItemSize {
  price: string;
}

interface OrderItem {
  sizes: OrderItemSize[];
}

interface OrderData {
  email: string;
  status: string;
  orderId: string;
  items: OrderItem[];
}

const PaymentMethod = () => {
  const [qris, setQris] = useState<PaymentMethodType[]>([]);
  const [virtualAccount, setVirtualAccount] = useState<PaymentMethodType[]>([]);
  const [selectedMethod, setSelectedMethod] =
    useState<PaymentMethodType | null>(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  const projectId = searchParams.get("projectId");
  const price = searchParams.get("price");

  useEffect(() => {
    const orderDataString = localStorage.getItem("orderData");
    if (orderDataString) {
      try {
        const parsed = JSON.parse(orderDataString) as OrderData;
        setOrderData(parsed);
      } catch (e) {
        console.error("Failed to parse orderData", e);
      }
    }
  }, []);

  useEffect(() => {
    const userData = getUser();

    if (userData) {
      axios
        .get(`https://api.pg.capbridge.langitdigital78.com/api/v1/channel`, {
          headers: {
            Authorization: `Bearer ${userData.token}`,
          },
        })
        .then((response) => {
          const data: PaymentMethodType[] = response.data.data;
          setQris(data.filter((item) => item.nameCode === "gopay"));
          setVirtualAccount(data.filter((item) => item.nameCode !== "gopay"));
        })
        .catch((error) => {
          console.error("Failed to fetch payment list:", error);
        });
    }
  }, []);

  const handleSelect = (method: PaymentMethodType) => {
    console.log("Selected:", method); // cek di console browser
    setSelectedMethod(method);
  };

  const handleStorePayment = async () => {
    if (!selectedMethod) return;

    try {
      const payload = {
        project_id: projectId,
        payment_method: selectedMethod.id.toString(),
        price: parseInt(price ?? "0"),
      };

      console.log("Payload ", payload);

      const userData = getUser();

      if (userData) {
        const endpoint = `${API_BACKEND}/api/v1/payment/order`;

        const result = await axios.post(endpoint, payload, {
          headers: {
            Authorization: `Bearer ${userData?.token}`,
          },
        });
        router.push(
          `/waiting-payment?orderId=${result.data["data"]["inbox"]["id"]}`
        );
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

      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: errorMessage,
      });
    }
  };

  const calculateTotal = () => {
    if (selectedMethod) {
      return (parseInt(price ?? "0") + selectedMethod.fee).toLocaleString(
        "id-ID"
      );
    }

    return parseInt(price ?? "0").toLocaleString("id-ID");
  };

  return (
    <>
      <div className="py-28 md:flex md:flex-col md:items-center px-4 md:px-12">
        <div className="relative w-full bg-white rounded-2xl p-6 shadow-md text-center">
          <h2 className="text-gray-700 font-semibold mb-2">Total</h2>
          <p className="text-2xl font-bold mb-2">Rp{calculateTotal()}</p>
        </div>

        <div className="w-full bg-white rounded-2xl my-8 p-6 shadow-md">
          <h2 className="text-gray-500 text-sm mb-4">Select Payment Method</h2>

          {/* Virtual Account */}
          <div className="mb-4">
            <h3 className="text-gray-700 font-semibold mb-2">
              VIRTUAL ACCOUNT
            </h3>
            <div className="flex flex-wrap items-center gap-4">
              {virtualAccount.map((method) => (
                <img
                  key={method.id}
                  src={method.logo}
                  alt={method.name}
                  className={`h-8 object-contain cursor-pointer border rounded-md p-1 ${
                    selectedMethod?.id === method.id
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => handleSelect(method)}
                />
              ))}
            </div>
            <hr className="my-4 border-gray-300" />
          </div>

          {/* QRIS */}
          <div className="mb-4">
            <h3 className="text-gray-700 font-semibold mb-2">QRIS</h3>
            <div className="flex flex-wrap items-center gap-4">
              {qris.map((method) => (
                <img
                  key={method.id}
                  src={method.logo}
                  alt={method.name}
                  className={`h-8 object-contain cursor-pointer border rounded-md p-1 ${
                    selectedMethod?.id === method.id
                      ? "border-blue-500"
                      : "border-transparent"
                  }`}
                  onClick={() => handleSelect(method)}
                />
              ))}
            </div>
            <hr className="my-4 border-gray-300" />
            {selectedMethod && (
              <div className="flex justify-between text-sm">
                <h2 className="text-black">Biaya Admin</h2>
                <h2 className="text-black">
                  Rp{selectedMethod.fee.toLocaleString("id-ID")}
                </h2>
              </div>
            )}
          </div>
          <div className="flex flex-row items-end justify-end">
            <FormButton
              onClick={() => handleStorePayment()}
              disabled={!selectedMethod}
              className={
                !selectedMethod ? "w-full cursor-not-allowed" : "w-full"
              }
            >
              Konfirmasi Pembayaran
            </FormButton>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentMethod;
