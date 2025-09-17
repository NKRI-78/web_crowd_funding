"use client";

import { useEffect, useState } from "react";
import {
  Building2,
  Calendar,
  CircleDollarSign,
  Inbox,
  X,
  FileText,
  Eye,
  RotateCcw,
  Loader2,
} from "lucide-react";
import axios from "axios";
import { getTransactions } from "@/actions/fetchTransaction";
import { TransactionItem } from "@/app/interfaces/transaction/transaction";
import Pagination from "../../pagination/pagination";
import { getUser } from "@/app/lib/auth";
import GeneralDialog from "../../GeneralDialog";
import { API_BACKEND } from "@/app/utils/constant";
import Swal from "sweetalert2";

export default function TransactionInvestorView() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false); // modal utama
  const [showConfirm, setShowConfirm] = useState(false); // modal konfirmasi sebelum refund
  const [selectedPaymentId, setSelectedPaymentId] = useState<string | null>(
    null
  );
  const [processing, setProcessing] = useState(false); // loading state refund

  const totalPages = Math.ceil(totalItems / limit);

  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const u = getUser();
    setUser(u);
  }, []);

  const fetchData = async (p: number) => {
    try {
      setLoading(true);
      const data = await getTransactions(user?.token ?? "", p, limit);
      setTransactions(data.items);
      setTotalItems(data.total_items);
    } catch (err) {
      console.error("Error fetch transaksi:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      fetchData(page);
    }
  }, [page, user]);

  const refundPayment = async (paymentId: string, token: string) => {
    try {
      const res = await axios.post(
        `${API_BACKEND}/api/v1/project/refund`,
        { payment_id: paymentId },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      return res.data;
    } catch (error: any) {
      throw error.response?.data || error;
    }
  };

  return (
    <div className="">
      {loading ? (
        <div className="flex justify-center items-center py-20 text-gray-500">
          <p>Loading...</p>
        </div>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Inbox className="w-12 h-12 mb-3 text-gray-400" />
          <p className="text-lg font-medium">Belum ada transaksi</p>
          <p className="text-sm">Transaksi Anda akan muncul di sini.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto rounded-xl shadow border border-gray-200 bg-white">
            <table className="w-full border-collapse text-black">
              <thead className="bg-gray-100 text-gray-700 text-sm uppercase">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Project</th>
                  <th className="p-3 text-left">Perusahaan</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Tanggal</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-gray-700">
                {transactions.map((trx, idx) => (
                  <tr
                    key={trx.payment_id}
                    className="border-t hover:bg-gray-50 transition"
                  >
                    <td className="p-3 text-left">
                      {(page - 1) * limit + idx + 1}
                    </td>
                    <td className="p-3 font-medium text-left">
                      {trx.project_title}
                    </td>
                    <td className="p-3 flex items-center gap-2 text-left">
                      <Building2 className="w-4 h-4 text-primary" />
                      {trx.company.name == "" ? "-" : trx.company.name}
                    </td>
                    <td className="p-3 flex items-center gap-2 font-semibold text-left">
                      <CircleDollarSign className="w-4 h-4 text-green-600" />
                      Rp {trx.amount.toLocaleString("id-ID")}
                    </td>
                    <td className="p-3 text-left">
                      <span
                        className={`px-2 py-1 text-xs rounded-full font-medium ${
                          trx.payment_status === "PENDING"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-green-100 text-green-700"
                        }`}
                      >
                        {trx.payment_status}
                      </span>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <Calendar className="w-4 h-4 text-primary" />
                        <span>
                          {new Date(trx.created_at).toLocaleString("id-ID")}
                        </span>
                      </div>
                    </td>
                    <td className="p-3 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <a
                          href={`/waiting-payment?orderId=${trx.payment_id}`}
                          className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md bg-blue-50 text-blue-600 hover:bg-blue-100 transition duration-200"
                        >
                          <Eye className="w-4 h-4" />
                          Lihat Detail
                        </a>
                        {trx.payment_status == "PAID" && (
                          <>
                            <button
                              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md bg-green-600 text-white hover:bg-green-700 shadow-sm transition duration-200"
                              onClick={() => {
                                setSelectedPaymentId(
                                  trx.payment_id.toString() ?? ""
                                );
                                setShowConfirm(true);
                              }}
                            >
                              <RotateCcw className="w-4 h-4" />
                              Kembalikan Dana
                            </button>
                          </>
                        )}

                        {trx.payment_status === "REFUNDED" && (
                          <>
                            <button
                              onClick={() =>
                                Swal.fire({
                                  icon: "info",
                                  title: "Pengembalian Dana Diproses",
                                  text: "Dana akan masuk ke rekening Anda dalam waktu maksimal 3 hari kerja.",
                                  confirmButtonColor: "#10565C",
                                })
                              }
                              className="inline-flex items-center gap-1 px-3 py-2 text-sm font-medium rounded-md bg-indigo-600 text-white hover:bg-indigo-700 transition duration-200"
                            >
                              <Eye className="w-4 h-4" />
                              Information
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Modal Konfirmasi */}
          <GeneralDialog
            isOpen={showConfirm}
            onClose={() => {
              setShowConfirm(false);
              setSelectedPaymentId(null);
            }}
          >
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">Konfirmasi</h2>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => {
                    setShowConfirm(false);
                    setSelectedPaymentId(null);
                  }}
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-sm text-gray-700 mb-6">
                Apakah Anda yakin ingin mengajukan{" "}
                <span className="font-semibold">pengembalian dana</span>?<br />
                Proses ini membutuhkan waktu maksimal{" "}
                <span className="font-semibold text-gray-900">
                  3 hari kerja
                </span>
                . Setelah dana diproses, silakan periksa rekening Anda secara
                berkala.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setSelectedPaymentId(null);
                  }}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300"
                >
                  Batal
                </button>
                <button
                  onClick={() => {
                    setShowConfirm(false);
                    setShowModal(true);
                  }}
                  className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700"
                >
                  Ya, Ajukan
                </button>
              </div>
            </div>
          </GeneralDialog>

          {/* Modal Proses Refund */}
          <GeneralDialog
            isOpen={showModal}
            onClose={() => {
              if (!processing) {
                setShowModal(false);
                setSelectedPaymentId(null);
              }
            }}
          >
            <div className="w-full max-w-md">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-bold text-gray-800">
                  Pengembalian Dana
                </h2>
                <button
                  className="text-gray-600 hover:text-gray-800"
                  onClick={() => {
                    if (!processing) {
                      setShowModal(false);
                      setSelectedPaymentId(null);
                    }
                  }}
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4 text-gray-700 text-sm leading-relaxed">
                <p>
                  Permintaan pengembalian dana Anda sedang diproses. Mohon
                  tunggu hingga maksimal{" "}
                  <span className="font-semibold text-gray-900">
                    3 hari kerja
                  </span>
                  . Setelah selesai, silakan periksa rekening Anda.
                </p>
              </div>

              <div className="mt-6 flex justify-end gap-2">
                <button
                  disabled={processing}
                  onClick={() => {
                    setShowModal(false);
                    setSelectedPaymentId(null);
                  }}
                  className="px-4 py-2 rounded-md bg-gray-200 text-gray-700 hover:bg-gray-300 disabled:opacity-50"
                >
                  Tutup
                </button>
                <button
                  disabled={processing}
                  onClick={async () => {
                    if (!selectedPaymentId) return;
                    setProcessing(true);
                    try {
                      const data = await refundPayment(
                        selectedPaymentId,
                        user?.token ?? ""
                      );

                      Swal.fire({
                        icon: "success",
                        title: "Pengembalian Dana Diajukan",
                        text: "Proses membutuhkan waktu maksimal 3 hari kerja. Silakan periksa rekening Anda secara berkala.",
                        confirmButtonColor: "#16a34a", // hijau
                      });
                    } catch (err: any) {
                      Swal.fire({
                        icon: "error",
                        title: "Gagal Mengajukan Refund",
                        text:
                          err?.message ||
                          "Terjadi kesalahan pada server. Coba lagi nanti.",
                        confirmButtonColor: "#dc2626", // merah
                      });
                    } finally {
                      setProcessing(false);
                      setShowModal(false);
                      setSelectedPaymentId(null);
                    }
                  }}
                  className="px-4 py-2 rounded-md bg-green-600 text-white hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                >
                  {processing && <Loader2 className="w-4 h-4 animate-spin" />}
                  {processing ? "Memproses..." : "Konfirmasi Pengembalian"}
                </button>
              </div>
            </div>
          </GeneralDialog>

          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination
                page={page}
                totalPages={totalPages}
                onPageChange={(p) => setPage(p)}
              />
            </div>
          )}
        </>
      )}
    </div>
  );
}
