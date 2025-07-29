"use client";

import useOnlineStatus from "@/app/hooks/useOnlineStatus";
import { API_BACKEND } from "@/app/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { InboxModel } from "../InboxModel";
import Link from "next/link";
import EmptyTransaction from "../EmptyInbox";
import moment from "moment";

interface TransactionState {
  loading?: boolean;
  errorMessage?: string | null;
}

const Transaction = () => {
  // data hook
  const [transactions, setTransactions] = useState<InboxModel[]>([]);

  // state hook
  const isOnline = useOnlineStatus();
  const [inboxState, setTransactionState] = useState<TransactionState>({
    loading: true,
    errorMessage: null,
  });

  function getUserToken(): string | null {
    const user = localStorage.getItem("user");
    if (!user) return null;
    const userJson = JSON.parse(user);
    return userJson.token;
  }

  //* use effect
  useEffect(() => {
    if (isOnline) {
      fetchTransaction();
    } else {
      setTransactionState({
        loading: false,
        errorMessage: "Tidak ada koneksi internet",
      });
    }
  }, [isOnline]);

  //* fetch inbox
  const fetchTransaction = async () => {
    try {
      const token = getUserToken();
      console.log("hastoken ", token);
      if (token) {
        const res = await axios(`${API_BACKEND}/api/v1/inbox/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.data["data"]) {
          setTransactions([]);
          return;
        }
        const filteredTransactionTransactiones = res.data["data"]
          .filter((inbox: InboxModel) => inbox.type === "transaction")
          .reverse();
        console.log("Fil ", filteredTransactionTransactiones);
        setTransactions(filteredTransactionTransactiones);
        setTransactionState({
          loading: false,
        });
      }
    } catch (error) {
      setTransactionState({
        loading: false,
        errorMessage: "Terjadi Kesalahan",
      });
    }
  };

  return (
    <>
      <div className="py-28 px-6 text-black">
        {transactions.length ? (
          <div className="flex flex-col gap-y-3">
            {transactions?.map((transaction) => {
              return (
                <Link
                  key={transaction.id}
                  href={`/waiting-payment?orderId=${transaction.id}`}
                >
                  <div
                    className="relative w-full p-4 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => {}}
                  >
                    <div className="flex items-start justify-between">
                      <p className="text-sm font-semibold">
                        {transaction.title}
                      </p>

                      {transaction.is_read === false && (
                        <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded-full">
                          Baru
                        </span>
                      )}
                    </div>

                    {/* STATUS POJOK KANAN ATAS */}
                    <div className="absolute top-2 right-2">
                      <span className="text-xs font-medium bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                        {transaction.status}
                      </span>
                    </div>

                    <p className="text-sm text-gray-400 mt-2">
                      {moment(transaction.created_at)
                        .utc()
                        .locale("id")
                        .format("DD MMMM YYYY, HH:mm")}
                    </p>
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptyTransaction
            title="Belum ada transaksi"
            message="Kamu belum menerima transaksi apa pun saat ini."
          />
        )}
      </div>
    </>
  );
};

export default Transaction;
