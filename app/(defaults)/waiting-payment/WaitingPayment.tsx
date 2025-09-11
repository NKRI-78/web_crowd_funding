"use client";

import axios from "axios";
import React, { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  Clipboard,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle,
  BarChart3,
  PieChart,
} from "lucide-react";
import moment from "moment";
import { API_BACKEND } from "@/app/utils/constant";
import { createSocket } from "@/app/utils/sockets";
import { Socket as ClientSocket } from "socket.io-client";
import Cookies from "js-cookie";
import Link from "next/link";
import SkeletonWaitingPayment from "./components/SkeletonWaitingPayment";
import { motion } from "framer-motion";
import CaraPembayaran from "./components/HowToPayment";
import FundingProgressCard from "./components/FundingProgressCard";
import { getUser } from "@/app/lib/auth";

export interface PaymentMethod {
  id: number;
  name: string;
  name_code: string;
  logo: string;
  platform: string;
  fee: number;
}

export interface InvoiceData {
  invoice_id: number;
  provider: string;
  order_id: string;
  invoice_status: string;
  channel_code: string;
  created_at: string;
  qr_url?: string;
  vaNumber?: string;
  expire?: string | null;
  payment_method?: PaymentMethod | null;
}

export interface PaymentData {
  payment_id: number;
  project_title: string;
  amount: number;
  payment_status: string;
  created_at: string;
  project_target_amount_idr: number;
  project_paid_amount_idr: number;
  project_reserved_amount_idr: number;
  invoices: InvoiceData[];
}

const WaitingPayment = () => {
  const [waitingPayment, setWaitingPayment] = useState<PaymentData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any>(null);
  const [expired, setExpired] = useState(false);
  const [timeLeft, setTimeLeft] = useState<number>(0);
  const [totalDuration, setTotalDuration] = useState<number>(0);
  const [statusLoading, setStatusLoading] = useState(false);

  const hasExpiredRef = useRef(false);
  const hasPaidRef = useRef(false);
  const router = useRouter();

  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  function getUserToken(): string | null {
    const userCookie = Cookies.get("user");
    if (!userCookie) return null;
    const userJson = JSON.parse(userCookie);
    return userJson.token;
  }

  const fetchDetailPayment = async () => {
    if (!orderId) return;
    setLoading(true);
    const token = getUserToken();

    if (token) {
      try {
        const response = await axios.get(
          `${API_BACKEND}/api/v1/transaction/project/detail/${orderId}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const data = response.data.data;
        const mapped: PaymentData = {
          payment_id: data.payment_id,
          project_title: data.project_title,
          amount: data.amount,
          payment_status: data.payment_status,
          created_at: data.created_at,
          project_target_amount_idr: data.project_target_amount_idr,
          project_paid_amount_idr: data.project_paid_amount_idr,
          project_reserved_amount_idr: data.project_reserved_amount_idr,
          invoices: data.invoices.map((inv: any) => {
            const raw = inv.raw_response?.data?.data || {};
            return {
              invoice_id: inv.invoice_id,
              provider: inv.provider,
              order_id: inv.order_id,
              invoice_status: inv.invoice_status,
              channel_code: inv.channel_code,
              created_at: inv.created_at,
              qr_url: raw.actions?.[0]?.url || "",
              vaNumber: raw.vaNumber || "",
              expire: inv.raw_response?.data?.expire || inv.expires_at || null,
              payment_method: inv.payment_method || null,
            };
          }),
        };

        setWaitingPayment(mapped);
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
      alert("✅ Nomor berhasil disalin!");
    } catch (err) {
      console.error("Failed to copy: ", err);
    }
  };

  // Socket listener
  useEffect(() => {
    const user = getUser();
    const userId = user?.id;
    const socket: ClientSocket = createSocket(userId ?? "-");

    socket.on("connect", () => {
      console.log("Socket connected: Waiting ", socket.id);
      console.log("Socket connected Waiting user id : ", user?.id ?? "-");
    });

    socket.on("payment-update", (data: any) => {
      console.log("payment-update:", data);
      if (hasPaidRef.current) return;

      hasPaidRef.current = true;
      setStatusLoading(true);

      setTimeout(() => {
        setStatusLoading(false);

        setWaitingPayment((prev) => ({ ...prev!, payment_status: "PAID" }));
        setStatusLoading(false);

        setTimeout(() => {
          router.push("/dashboard");
        }, 2000);
      }, 1500);
    });

    return () => {
      socket.disconnect();
    };
  }, [orderId]);

  // Fetch detail
  useEffect(() => {
    if (!orderId) return;
    fetchDetailPayment();
  }, [orderId]);

  // Timer
  useEffect(() => {
    if (!waitingPayment) return;
    const invoice = waitingPayment.invoices[0];

    const expireMoment = invoice?.expire
      ? moment(invoice.expire, ["YYYY-MM-DD HH:mm:ss", moment.ISO_8601])
      : null;

    const expireTime =
      expireMoment && expireMoment.isValid()
        ? expireMoment.toDate().getTime()
        : moment(waitingPayment.created_at).toDate().getTime() + 30 * 60 * 1000;

    const createdTime = moment(waitingPayment.created_at).toDate().getTime();
    const duration = Math.floor((expireTime - createdTime) / 1000);
    setTotalDuration(duration);

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = expireTime - now;
      const secondsLeft = Math.floor(diff / 1000);
      setTimeLeft(Math.max(0, secondsLeft));

      if (
        diff <= 0 &&
        waitingPayment.payment_status === "PENDING" &&
        !hasExpiredRef.current
      ) {
        hasExpiredRef.current = true;
        setStatusLoading(true);
        setTimeout(() => {
          setExpired(true);
          setStatusLoading(false);
        }, 1500);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [waitingPayment]);

  const invoice = waitingPayment?.invoices[0];

  if (loading) return <SkeletonWaitingPayment />;
  if (error || !waitingPayment) {
    return (
      <EmptyState
        icon={<AlertTriangle className="text-yellow-500 w-14 h-14" />}
        title="Gagal memuat pembayaran"
        desc="Silakan coba lagi beberapa saat."
        action={{ label: "Coba Lagi", onClick: fetchDetailPayment }}
      />
    );
  }

  const formatTimer = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (d > 0) {
      return `${d} hari ${h}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    } else {
      return `${h}:${m.toString().padStart(2, "0")}:${s
        .toString()
        .padStart(2, "0")}`;
    }
  };

  return (
    <div className="py-28 px-4 bg-gray-50 flex flex-col items-center p-6">
      {/* Header Card */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-3xl mt-8"
      >
        <div className="rounded-2xl border bg-white shadow-md p-6 sm:p-8 text-center space-y-5">
          {/* Judul Proyek */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900">
            {waitingPayment.project_title}
          </h1>

          {/* Status Section */}
          <div className="space-y-3">
            {/* Ikon Status */}
            {statusLoading ? (
              <motion.div
                className="w-16 h-16 mx-auto rounded-full border-4 border-yellow-400 border-t-transparent animate-spin"
                initial={{ scale: 0.8, opacity: 0.5 }}
                animate={{ scale: 1, opacity: 1 }}
              />
            ) : waitingPayment.payment_status === "PAID" ? (
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
            ) : expired && waitingPayment.payment_status === "PENDING" ? (
              <XCircle className="w-16 h-16 text-red-500 mx-auto" />
            ) : (
              <Clock className="w-16 h-16 text-yellow-500 mx-auto animate-pulse" />
            )}

            {/* Badge Status */}
            <div className="flex justify-center">
              {statusLoading ? (
                <span className="px-4 py-1 rounded-full bg-blue-100 text-blue-700 text-sm font-medium flex items-center gap-2">
                  Harap Tunggu...
                </span>
              ) : (
                waitingPayment.payment_status === "PENDING" &&
                !expired && (
                  <span className="px-4 py-1 rounded-full bg-yellow-100 text-yellow-700 text-sm font-medium flex items-center gap-2">
                    <Clock size={16} /> Menunggu Pembayaran
                  </span>
                )
              )}
              {waitingPayment.payment_status === "PAID" && (
                <span className="px-4 py-1 rounded-full bg-green-100 text-green-700 text-sm font-medium flex items-center gap-2">
                  <CheckCircle2 size={16} /> Pembayaran Berhasil
                </span>
              )}
              {expired && waitingPayment.payment_status === "PENDING" && (
                <span className="px-4 py-1 rounded-full bg-red-100 text-red-700 text-sm font-medium flex items-center gap-2">
                  <XCircle size={16} /> Pembayaran Kadaluarsa
                </span>
              )}
            </div>

            {/* Timer */}
            {waitingPayment.payment_status === "PENDING" &&
              !expired &&
              timeLeft > 0 && (
                <div className="space-y-2">
                  <p className="text-sm text-gray-500">Sisa waktu pembayaran</p>
                  <p className="text-2xl sm:text-3xl font-extrabold text-yellow-600">
                    {formatTimer(timeLeft)}
                  </p>
                  <div className="w-full h-2 bg-gray-200 rounded-full">
                    <motion.div
                      className="h-2 rounded-full bg-gradient-to-r from-yellow-400 to-green-400"
                      initial={{ width: "100%" }}
                      animate={{
                        width: `${
                          totalDuration > 0
                            ? Math.max(0, (timeLeft / totalDuration) * 100)
                            : 0
                        }%`,
                      }}
                      transition={{ ease: "linear" }}
                    />
                  </div>
                </div>
              )}
          </div>

          {/* Sub-info */}
          <p className="text-gray-500 text-sm">
            Transaksi #
            {waitingPayment.invoices[0].order_id.replaceAll("CAPBRIDGE-", "")} •{" "}
            {moment(waitingPayment.created_at).format("DD MMM YYYY, HH:mm")}
          </p>
        </div>
      </motion.div>

      {/* Main Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2 }}
        className="mt-8 w-full max-w-3xl rounded-2xl shadow-xl border p-8 bg-white space-y-8"
      >
        {/* Payment Method */}
        <div className="rounded-2xl border bg-white shadow-sm p-6 space-y-6">
          <h3 className="text-lg font-bold text-gray-800 mb-2">
            Metode Pembayaran
          </h3>

          {/* Header Payment Method */}
          {invoice?.payment_method && (
            <div className="flex items-center gap-4 rounded-xl bg-gradient-to-r from-gray-50 to-gray-100 p-4 border">
              <img
                src={invoice.payment_method.logo}
                alt={invoice.payment_method.name}
                className="h-12 w-12 object-contain rounded-lg bg-white p-1 shadow"
              />
              <div className="flex-1">
                <p className="font-semibold text-gray-900 text-lg">
                  {invoice.payment_method.name}
                </p>
                <p className="text-xs text-gray-500">
                  {invoice.payment_method.platform}
                </p>
              </div>
            </div>
          )}

          {/* QRIS / VA Section */}
          {invoice?.qr_url ? (
            <div className="flex flex-col items-center">
              <img
                src={invoice.qr_url}
                alt="QRIS"
                className="w-56 rounded-xl border shadow-md"
              />
              <p className="text-xs text-gray-500 mt-2">
                Scan QR dengan aplikasi e-wallet Anda
              </p>
            </div>
          ) : invoice?.vaNumber ? (
            <div className="flex items-center justify-between bg-gray-50 px-4 py-3 rounded-lg border">
              <div>
                <p className="text-xs text-gray-500">Nomor Virtual Account</p>
                <span className="font-mono text-lg font-bold text-gray-900">
                  {invoice.vaNumber}
                </span>
              </div>
              <button
                onClick={() => handleCopy(invoice.vaNumber!)}
                className="p-2 hover:bg-gray-100 rounded-lg"
              >
                <Clipboard className="w-5 h-5 text-gray-600" />
              </button>
            </div>
          ) : (
            <p className="text-gray-500">Metode tidak tersedia</p>
          )}

          {/* Breakdown Harga */}
          <div className="border-t pt-4 space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-gray-600">Nominal Investasi</span>
              <span className="font-medium text-gray-800">
                Rp{waitingPayment.amount.toLocaleString("id-ID")}
              </span>
            </div>
            {invoice?.payment_method?.fee ? (
              <div className="flex justify-between">
                <span className="text-gray-600">Biaya Admin</span>
                <span className="font-medium text-gray-800">
                  Rp{invoice.payment_method.fee.toLocaleString("id-ID")}
                </span>
              </div>
            ) : null}
            <div className="flex justify-between font-semibold border-t pt-2">
              <span className="text-gray-800">Total</span>
              <span className="text-gray-900">
                Rp
                {(
                  waitingPayment.amount + (invoice?.payment_method?.fee || 0)
                ).toLocaleString("id-ID")}
              </span>
            </div>
          </div>
        </div>

        {/* Card Cara Pembayaran */}
        {waitingPayment?.invoices.map((inv) =>
          inv.payment_method ? (
            <CaraPembayaran
              key={inv.invoice_id}
              method={inv.payment_method}
              vaNumber={inv.vaNumber}
            />
          ) : null
        )}

        {/* Project Funding Progress */}

        {/* <FundingProgressCard
          title="Pendanaan Crowdfunding"
          icon={<PieChart className="w-5 h-5 text-pink-500" />}
          target={200000000}
          paid={150000000}
          reserved={20000000}
        /> */}

        <div className="text-center">
          <Link
            href="/transaction"
            className="inline-block px-6 py-3 rounded-lg bg-[#10565C] text-white font-semibold shadow"
          >
            Lihat Pesanan
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default WaitingPayment;

const EmptyState = ({
  icon,
  title,
  desc,
  action,
}: {
  icon: React.ReactNode;
  title: string;
  desc: string;
  action?: { label: string; href?: string; onClick?: () => void };
}) => (
  <div className="py-20 px-6 bg-gray-50 min-h-screen flex items-center justify-center">
    <div className="w-full max-w-lg rounded-2xl border p-10 shadow-lg bg-white text-center space-y-4">
      {icon}
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <p className="text-gray-600">{desc}</p>
      {action?.href ? (
        <Link
          href={action.href}
          className="inline-block bg-[#10565C] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#0d464a] transition"
        >
          {action.label}
        </Link>
      ) : action?.onClick ? (
        <button
          onClick={action.onClick}
          className="inline-block bg-[#10565C] text-white font-semibold px-6 py-2 rounded-lg hover:bg-[#0d464a] transition"
        >
          {action.label}
        </button>
      ) : null}
    </div>
  </div>
);
