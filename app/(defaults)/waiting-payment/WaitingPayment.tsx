"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Clipboard } from "lucide-react";
import moment from "moment";
import Link from "next/link";
import { API_BACKEND } from "@/app/utils/constant";
import CountdownTimer from "@/app/utils/CountDownTimer";
import FormButton from "@/app/components/inputFormPenerbit/_component/FormButton";

interface Bank {
  name: string;
  nameCode: string;
  logo: string;
  fee: number;
}

interface PaymentData {
  id: number;
  title: string;
  content: string;
  field_1: string;
  field_2: string;
  field_3: string;
  field_4: string;
  field_5: string;
  field_6: string;
  field_7: string;
  field_8: string;
  type: string;
  status: string;
  is_read: boolean;
  created_at: string;
}

const WaitingPayment = () => {
  const router = useRouter();

  const [waitingPayment, setWaitingPayment] = useState<PaymentData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [loadingDownload, setLoadingDownload] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const [error, setError] = useState<any>(null);
  const [status, setStatus] = useState<any>({});
  const [expired, setExpired] = useState(false);

  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  const handleTick = (timeLeft: any) => {
    setStatus(timeLeft);
  };

  const handleExpire = () => {
    setExpired(true);
  };

  const fetchDetailPayment = async () => {
    if (!orderId) return;
    setLoading(true);
    const userData = localStorage.getItem("user");

    if (userData) {
      try {
        const userParsed = JSON.parse(userData);
        const response = await axios.get(
          `${API_BACKEND}/api/v1/inbox/detail/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${userParsed.token}`,
            },
          }
        );
        setWaitingPayment(response.data["data"]);
      } catch (err) {
        console.error("Failed to parse user or fetch profile:", err);
      }
    }
    setLoading(false);
  };

  const handleDownload = async (url: string, filename: string) => {
    try {
      setLoadingDownload(true);

      const img = imgRef.current;
      if (!img) return;

      // Jika gambar berasal dari domain lain, pastikan crossOrigin diset
      // dan gambarnya sudah load dengan benar
      if (img.crossOrigin !== "anonymous") {
        img.crossOrigin = "anonymous";
      }

      // Pastikan gambar sudah load
      if (!img.complete) {
        await new Promise<void>((resolve, reject) => {
          img.onload = () => resolve();
          img.onerror = () => reject(new Error("Gambar gagal dimuat"));
        });
      }

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) throw new Error("Canvas context gagal dibuat");

      canvas.width = img.naturalWidth;
      canvas.height = img.naturalHeight;
      ctx.drawImage(img, 0, 0);

      // Convert canvas ke data URL
      const dataUrl = canvas.toDataURL("image/png");

      // Download
      const link = document.createElement("a");
      link.href = dataUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (err) {
      console.error("Gagal mendownload gambar:", err);
      alert(
        "Gagal mendownload gambar. Sumber gambar mungkin tidak mengizinkan CORS."
      );
    } finally {
      setLoadingDownload(false);
    }
  };

  useEffect(() => {
    if (!orderId) return;
    fetchDetailPayment();
  }, [orderId]);

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading payment details.</div>;
  if (!waitingPayment) return <div>Data not found.</div>;

  const expiredTime = moment(waitingPayment?.field_4).toISOString();

  return (
    <div className="py-28 md:flex md:flex-col md:items-center px-4 md:px-12">
      <div className="w-full md:w-1/2 bg-white rounded-2xl p-6 shadow-md text-center">
        <h2 className="text-gray-700 font-semibold mb-2">Total</h2>
        <p className="text-2xl font-bold mb-2">
          Rp
          {(
            parseInt(waitingPayment.field_7) + parseInt(waitingPayment.field_2)
          ).toLocaleString("id-ID")}
        </p>

        <p className="text-gray-500 text-sm mb-1">Bayar sebelum</p>
        <CountdownTimer
          expiryDate={expiredTime}
          onTick={handleTick}
          onExpire={handleExpire}
        />
      </div>

      <div className="w-full md:w-1/2 bg-white my-6 rounded-2xl p-6 shadow-md text-center">
        <div className="flex items-center justify-between">
          <img
            className="w-14 h-10 object-contain"
            src={waitingPayment.field_6}
            alt="Bank Logo"
          />
          <h2 className="text-gray-700 font-semibold">
            {waitingPayment.field_1}
          </h2>
        </div>

        {waitingPayment.field_1 === "Gopay" ? (
          <img
            ref={imgRef}
            className="w-full md:w-1/2 my-4 m-auto"
            src={waitingPayment.field_3}
            alt="QRIS"
          />
        ) : (
          <div className="flex justify-between text-black text-sm my-3">
            <div>Virtual Account</div>
            <div className="flex items-center">
              <span className="mr-2">{waitingPayment.field_3}</span>
              <button onClick={() => handleCopy(waitingPayment.field_3)}>
                <Clipboard size={15} />
              </button>
            </div>
          </div>
        )}

        <div className="flex text-black justify-between text-sm">
          <h2>Biaya Admin</h2>
          <h2>Rp{waitingPayment.field_2}</h2>
        </div>

        {/* <FormButton
          onClick={() =>
            handleDownload(waitingPayment.field_3, "qr-download.jpg")
          }
          className={"w-full"}
        >
          {!loadingDownload ? "Downloading..." : "Download Image"}
        </FormButton> */}
      </div>

      {/* <div className="text-center">
        <div className="p-2">
          <Link href="/cart">
            <h3 className="w-full bg-blue-800 rounded-xl text-white text-[21px] font-bold py-2">
              Cek Pesanan Anda
            </h3>
          </Link>
        </div>
      </div> */}
    </div>
  );
};

export default WaitingPayment;
