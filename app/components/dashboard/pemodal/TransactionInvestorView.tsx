"use client";

import { useEffect, useState } from "react";
import { Building2, Calendar, CircleDollarSign, Inbox } from "lucide-react";
import { getTransactions } from "@/actions/fetchTransaction";
import { TransactionItem } from "@/app/interfaces/transaction/transaction";
import Pagination from "../../pagination/pagination";
import { getUser } from "@/app/lib/auth";

export default function TransactionInvestorView() {
  const [transactions, setTransactions] = useState<TransactionItem[]>([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(5);
  const [totalItems, setTotalItems] = useState(0);
  const [loading, setLoading] = useState(false);

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

  return (
    <div className="">
      {/* <h1 className="text-2xl font-bold mb-6 flex items-center gap-2 text-black">
        <FileText className="w-6 h-6 text-black" />
        Daftar Transaksi
      </h1> */}

      {loading ? (
        <p>Loading...</p>
      ) : transactions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-gray-500">
          <Inbox className="w-12 h-12 mb-3 text-gray-400" />
          <p className="text-lg font-medium">Belum ada transaksi</p>
          <p className="text-sm">Transaksi Anda akan muncul di sini.</p>
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse rounded-lg overflow-hidden shadow text-black">
              <thead className="bg-primary/10 text-black text-sm uppercase">
                <tr>
                  <th className="p-3 text-left">#</th>
                  <th className="p-3 text-left">Project</th>
                  <th className="p-3 text-left">Perusahaan</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-center">Tanggal</th>
                  <th className="p-3 text-center">Aksi</th>
                </tr>
              </thead>
              <tbody className="text-sm text-black">
                {transactions.map((trx, idx) => (
                  <tr
                    key={trx.payment_id}
                    className="border-b hover:bg-gray-50 transition"
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
                    <td className="p-3 flex items-center justify-center gap-2 text-center">
                      <Calendar className="w-4 h-4 text-primary" />
                      {new Date(trx.created_at).toLocaleString("id-ID")}
                    </td>
                    <td className="p-3 text-center">
                      <a
                        href={`/waiting-payment?orderId=${trx.payment_id}`}
                        className="text-sm font-semibold text-[#10565C] hover:underline flex items-center justify-center gap-1"
                      >
                        Lihat Detail
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <Pagination
              page={page}
              totalPages={totalPages}
              onPageChange={(p) => setPage(p)}
            />
          )}
        </>
      )}
    </div>
  );
}
