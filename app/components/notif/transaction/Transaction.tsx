"use client";

import useOnlineStatus from "@/app/hooks/useOnlineStatus";
import { API_BACKEND } from "@/app/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import { InboxModel } from "../InboxModel";

interface InboxState {
  loading?: boolean;
  errorMessage?: string | null;
}

const Transaction = () => {
  // data hook
  const [inboxes, setInboxes] = useState<InboxModel[]>([]);

  // state hook
  const isOnline = useOnlineStatus();
  const [inboxState, setInboxState] = useState<InboxState>({
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
      fetchInbox();
    } else {
      setInboxState({
        loading: false,
        errorMessage: "Tidak ada koneksi internet",
      });
    }
  }, [isOnline]);

  //* fetch inbox
  const fetchInbox = async () => {
    try {
      const token = getUserToken();
      if (token) {
        const res = await axios(`${API_BACKEND}/api/v1/inbox/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const filteredTransactionInboxes = res.data["data"].filter(
          (inbox: InboxModel) => inbox.type === "transaction"
        );
        setInboxes(filteredTransactionInboxes);
        setInboxState({
          loading: false,
        });
      }
    } catch (error) {
      setInboxState({
        loading: false,
        errorMessage: "Terjadi Kesalahan",
      });
    }
  };

  return (
    <>
      <div className="py-28 px-6 text-black">
        <div className="flex flex-col gap-y-3">
          {inboxes?.map((inbox) => {
            return (
              <div
                key={inbox.id}
                className="w-full p-4 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                onClick={() => {}}
              >
                <div className="flex items-start justify-between">
                  <p className="text-sm font-semibold">{inbox.title}</p>
                  {inbox.is_read === false && (
                    <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded-full">
                      Baru
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-400 mt-2">
                  {new Date(inbox.created_at).toLocaleString("id-ID", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </>
  );
};

export default Transaction;
