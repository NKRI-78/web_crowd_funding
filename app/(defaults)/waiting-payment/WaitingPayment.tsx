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
import socket, { createSocket } from "@/app/utils/sockets";
import { Socket } from "dgram";
import { io, Socket as ClientSocket } from "socket.io-client";
import Cookies from "js-cookie";

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
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [socketInstance, setSocketInstance] = useState<ClientSocket | null>(
    null
  );

  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  function getUserToken(): string | null {
    const userCookie = Cookies.get("user");
    if (!userCookie) return null; // ✅ tambahkan return

    const userJson = JSON.parse(userCookie);
    return userJson.token;
  }

  const handleTick = (timeLeft: any) => {
    setStatus(timeLeft);
  };

  const handleExpire = () => {
    setExpired(true);
  };

  const fetchDetailPayment = async () => {
    if (!orderId) return;
    setLoading(true);
    const token = getUserToken();

    if (token) {
      try {
        const response = await axios.get(
          `${API_BACKEND}/api/v1/inbox/detail/${orderId}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
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

  function getUserId(): string | null {
    const userCookie = Cookies.get("user");
    if (!userCookie) return null; // ✅ tambahkan return

    const userJson = JSON.parse(userCookie);
    return userJson.id;
  }

  useEffect(() => {
    if (expired) {
      document.title = "Pembayaran Kadaluarsa | CapBridge";
    } else if (waitingPayment?.status === "PAID") {
      document.title = "Pembayaran Berhasil | CapBridge";
    } else {
      document.title = "Menunggu Pembayaran | CapBridge";
    }
  }, [expired, waitingPayment?.status]);

  useEffect(() => {
    const userId = getUserId();
    console.log("user token");
    console.log(userId);

    const socket = createSocket(userId ?? "-");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      console.log("Socket connected user id :", userId ?? "-");
    });

    socket.on("payment-update", (data) => {
      console.log("PAID");
      setWaitingPayment((prev) => ({ ...prev!, status: "PAID" }));
    });

    socket.on("connect", () => setIsConnected(true));
    socket.on("disconnect", () => setIsConnected(false));

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

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

  const expiredTime = moment(waitingPayment?.field_4).add().toISOString();
  if (loading) {
    return (
      <div className="py-28 flex flex-col items-center px-4 md:px-12">
        <div className="w-full md:w-1/2 bg-white rounded-2xl p-6 shadow-md text-center">
          <div className="w-full h-20 bg-gray-200 animate-pulse rounded-lg" />
          <p className="mt-4 text-gray-500">Memuat detail pembayaran...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="py-28 flex flex-col items-center px-4 md:px-12">
        <div className="text-black font-semibold text-sm mt-4 text-center">
          Error loading payment details.
        </div>
      </div>
    );
  }

  if (!waitingPayment) {
    return (
      <div className="py-28 flex flex-col items-center px-4 md:px-12">
        <div className="text-black font-semibold text-sm mt-4 text-center">
          Data not found.
        </div>
      </div>
    );
  }

  return (
    <div className="py-28 md:flex md:flex-col md:items-center px-4 md:px-12">
      <div className="w-full md:w-1/2 bg-white rounded-2xl p-6 shadow-md text-center">
        {/* <p className="text-sm text-gray-500">
          Status Socket:{" "}
          <span className={isConnected ? "text-green-500" : "text-red-500"}>
            {isConnected ? "Terhubung" : "Terputus"}
          </span>
        </p> */}
        {waitingPayment.status == "PAID" ? (
          <>
            <div className="text-green-600 font-bold text-xl mt-4">
              Pembayaran Berhasil!
            </div>
            <div className="text-black font-semibold text-sm mt-4 text-center">
              Pembayaran Anda telah berhasil diproses. Terima kasih!
            </div>
          </>
        ) : (
          <>
            <h2 className="text-gray-700 font-semibold mb-2">Total</h2>
            <p className="text-2xl font-bold mb-2">
              Rp
              {(
                parseInt(waitingPayment.field_7) +
                parseInt(waitingPayment.field_2)
              ).toLocaleString("id-ID")}
            </p>

            <p className="text-gray-500 text-sm mb-1">Bayar sebelum</p>
            <CountdownTimer
              expiryDate={expiredTime}
              onTick={handleTick}
              onExpire={handleExpire}
            />
          </>
        )}
      </div>

      {expired ? (
        <div className="w-full md:w-1/2 bg-white my-6 rounded-2xl p-6 shadow-md text-center">
          <div className="text-red-600 font-semibold text-lg mt-4 text-center">
            Pembayaran tidak diselesaikan tepat waktu dan telah dibatalkan
            otomatis.
          </div>
        </div>
      ) : (
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

          {waitingPayment.status == "PAID" ? (
            <></>
          ) : waitingPayment.field_1 === "Gopay" ? (
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

          {loading ? (
            <div className="w-full h-20 bg-gray-200 animate-pulse rounded-lg"></div>
          ) : (
            <>
              <div className="flex text-black justify-between text-sm my-3">
                <h2>Harga</h2>
                <h2>
                  Rp{parseInt(waitingPayment.field_7).toLocaleString("id-ID")}
                </h2>
              </div>
              <div className="flex text-black justify-between text-sm my-3">
                <h2>Biaya Admin</h2>
                <h2>
                  Rp{parseInt(waitingPayment.field_2).toLocaleString("id-ID")}
                </h2>
              </div>
              <div className="flex text-black justify-between text-sm my-3">
                <h2>Total</h2>
                <h2>
                  Rp
                  {(
                    parseInt(waitingPayment.field_7) +
                    parseInt(waitingPayment.field_2)
                  ).toLocaleString("id-ID")}
                </h2>
              </div>
            </>
          )}

          {/* <FormButton
          onClick={() =>
            handleDownload(waitingPayment.field_3, "qr-download.jpg")
          }
          className={"w-full"}
        >
          {!loadingDownload ? "Downloading..." : "Download Image"}
        </FormButton> */}
        </div>
      )}

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
