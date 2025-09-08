"use client";

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { Clipboard, AlertTriangle, XCircle } from "lucide-react";
import moment from "moment";
import { API_BACKEND } from "@/app/utils/constant";
import CountdownTimer from "@/app/utils/CountDownTimer";
import socket, { createSocket } from "@/app/utils/sockets";
import { Socket as ClientSocket } from "socket.io-client";
import Cookies from "js-cookie";
import Link from "next/link";
import SkeletonWaitingPayment from "./components/SkeletonWaitingPayment";

export interface PaymentData {
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
  const [waitingPayment, setWaitingPayment] = useState<PaymentData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const imgRef = useRef<HTMLImageElement>(null);
  const [error, setError] = useState<any>(null);
  const [status, setStatus] = useState<any>({});
  const [expired, setExpired] = useState(false);
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [socketInstance, setSocketInstance] = useState<ClientSocket | null>(
    null
  );

  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  /** Helper safe parse integer */
  const safeInt = (val?: string) => {
    const n = parseInt(val ?? "0");
    return isNaN(n) ? 0 : n;
  };

  function getUserToken(): string | null {
    const userCookie = Cookies.get("user");
    if (!userCookie) return null;
    const userJson = JSON.parse(userCookie);
    return userJson.token;
  }

  function getUserId(): string | null {
    const userCookie = Cookies.get("user");
    if (!userCookie) return null;
    const userJson = JSON.parse(userCookie);
    return userJson.id;
  }

  const handleTick = (timeLeft: any) => setStatus(timeLeft);
  const handleExpire = () => setExpired(true);

  const fetchDetailPayment = async () => {
    if (!orderId) return;
    setLoading(true);
    const token = getUserToken();

    if (token) {
      try {
        const response = await axios.get(
          `${API_BACKEND}/api/v1/inbox/detail/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setWaitingPayment(response.data["data"]);
      } catch (err) {
        console.error("Failed to fetch payment detail:", err);
        setError(err);
      }
    }
    setLoading(false);
  };

  const handleCopy = async (textToCopy: string) => {
    try {
      await navigator.clipboard.writeText(textToCopy);
      alert("Copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  useEffect(() => {
    if (expired) {
      document.title = "Pembayaran Kadaluarsa | FuLusme";
    } else if (waitingPayment?.status === "PAID") {
      document.title = "Pembayaran Berhasil | FuLusme";
    } else {
      document.title = "Menunggu Pembayaran | FuLusme";
    }
  }, [expired, waitingPayment?.status]);

  useEffect(() => {
    const userId = getUserId();
    const socket = createSocket(userId ?? "-");

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));
    socket.on("payment-update", () => {
      setWaitingPayment((prev) => ({ ...prev!, status: "PAID" }));
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  useEffect(() => {
    if (!orderId) return;
    fetchDetailPayment();
  }, [orderId]);

  const expiredTime = moment(waitingPayment?.field_4).toISOString();

  /*** ORDER ID NOT FOUND ***/
  if (!orderId) {
    return (
      <div className="py-20 px-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl border p-10 shadow-md bg-white text-center space-y-4">
          <XCircle className="mx-auto text-red-500" size={56} />
          <h2 className="text-2xl font-bold text-gray-800">
            Order ID Tidak Ditemukan
          </h2>
          <p className="text-gray-600">
            Kami tidak menemukan order ID di link yang Anda akses.
          </p>
          <Link
            href="/cart"
            className="inline-block bg-[#10565C] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#0d464a] transition"
          >
            Kembali ke Pesanan
          </Link>
        </div>
      </div>
    );
  }

  /*** LOADING STATE ***/
  if (loading) {
    return <SkeletonWaitingPayment />;
  }

  /*** ERROR STATE ***/
  if (error) {
    return (
      <div className="py-20 px-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl border p-10 shadow-md bg-white text-center space-y-4">
          <AlertTriangle className="mx-auto text-yellow-500" size={56} />
          <h2 className="text-2xl font-bold text-gray-800">
            Terjadi Kesalahan
          </h2>
          <p className="text-gray-600">Gagal memuat detail pembayaran.</p>
          <button
            onClick={fetchDetailPayment}
            className="inline-block bg-[#10565C] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#0d464a] transition"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  /*** DATA NOT FOUND ***/
  if (!waitingPayment) {
    return (
      <div className="py-20 px-6 bg-gray-50 min-h-screen flex items-center justify-center">
        <div className="w-full max-w-lg rounded-2xl border p-10 shadow-md bg-white text-center space-y-4">
          <AlertTriangle className="mx-auto text-gray-400" size={56} />
          <h2 className="text-2xl font-bold text-gray-800">
            Data Pembayaran Tidak Ditemukan
          </h2>
          <p className="text-gray-600">
            Pesanan Anda tidak tersedia atau sudah dihapus.
          </p>
          <Link
            href="/cart"
            className="inline-block bg-[#10565C] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#0d464a] transition"
          >
            Lihat Pesanan
          </Link>
        </div>
      </div>
    );
  }

  /*** SUCCESS UI ***/
  return (
    <div className="py-28 px-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header Section */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-800">
            Detail Pembayaran
          </h1>
          <p className="text-gray-600 mt-2">
            Silakan selesaikan pembayaran sebelum waktu berakhir
          </p>
        </div>

        {/* Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* CARD STATUS / TOTAL */}
          <div className="w-full h-full rounded-2xl border p-10 shadow-lg bg-white text-center flex flex-col justify-center">
            {waitingPayment.status == "PAID" ? (
              <>
                <div className="text-green-600 font-bold text-2xl mt-2">
                  Pembayaran Berhasil!
                </div>
                <p className="text-base text-gray-600 mt-2">
                  Pembayaran Anda telah berhasil diproses. Terima kasih!
                </p>
              </>
            ) : expired ? (
              <div className="text-red-600 font-semibold text-lg text-center">
                Pembayaran tidak diselesaikan tepat waktu dan telah dibatalkan
                otomatis.
              </div>
            ) : (
              <>
                <h2 className="text-gray-700 font-semibold mb-2 text-lg">
                  Total
                </h2>
                <p className="text-4xl font-extrabold text-[#10565C] mb-4">
                  Rp
                  {(
                    safeInt(waitingPayment.field_7) +
                    safeInt(waitingPayment.field_2)
                  ).toLocaleString("id-ID")}
                </p>
                <p className="text-gray-600 text-sm mb-2">Bayar sebelum</p>
                <CountdownTimer
                  expiryDate={expiredTime}
                  onTick={handleTick}
                  onExpire={handleExpire}
                />
              </>
            )}
          </div>

          {/* CARD DETAIL BANK */}
          <div className="w-full h-full rounded-2xl border p-10 shadow-lg bg-white flex flex-col justify-center">
            <div className="flex items-center justify-between mb-6">
              <img
                className="h-12 object-contain"
                src={waitingPayment.field_6}
                alt="Bank Logo"
              />
              <h2 className="text-gray-700 font-semibold text-lg">
                {waitingPayment.field_1}
              </h2>
            </div>

            {waitingPayment.field_1 === "Gopay" ? (
              <img
                ref={imgRef}
                className="w-full max-w-xs mx-auto my-4"
                src={waitingPayment.field_3}
                alt="QRIS"
              />
            ) : (
              <div className="flex justify-between items-center text-sm my-4">
                <span className="text-gray-700">Virtual Account</span>
                <div className="flex items-center">
                  <span className="mr-2 font-mono text-gray-800">
                    {waitingPayment.field_3 || "-"}
                  </span>
                  <button onClick={() => handleCopy(waitingPayment.field_3)}>
                    <Clipboard size={18} className="text-gray-600" />
                  </button>
                </div>
              </div>
            )}

            <div className="mt-6 space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-700">Harga</span>
                <span className="text-gray-800">
                  Rp{safeInt(waitingPayment.field_7).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-700">Biaya Admin</span>
                <span className="text-gray-800">
                  Rp{safeInt(waitingPayment.field_2).toLocaleString("id-ID")}
                </span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-3">
                <span className="text-gray-800">Total</span>
                <span className="text-gray-900">
                  Rp
                  {(
                    safeInt(waitingPayment.field_7) +
                    safeInt(waitingPayment.field_2)
                  ).toLocaleString("id-ID")}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WaitingPayment;
