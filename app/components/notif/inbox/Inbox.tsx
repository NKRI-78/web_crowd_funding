"use client";

import useOnlineStatus from "@/app/hooks/useOnlineStatus";
import { API_BACKEND } from "@/app/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import InboxDialogMessage from "../InboxDialogMessage";
import Swal from "sweetalert2";
import { InboxModel } from "../InboxModel";

interface InboxState {
  loading?: boolean;
  errorMessage?: string | null;
}

const Inbox = () => {
  // data hook
  const [inboxes, setInboxes] = useState<InboxModel[]>([]);

  // state hook
  const isOnline = useOnlineStatus();
  const [dialogIsOpen, setOpenDialog] = useState<boolean>(false);
  const [inboxId, setInboxId] = useState<number>(0);
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
        const filteredBillingInboxes = res.data["data"].filter(
          (inbox: InboxModel) =>
            inbox.type === "billing" && inbox.status !== "REJECTED"
        );
        setInboxes(filteredBillingInboxes);
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

  //* mark as read
  const markAsRead = (inboxId: number) => {
    const updatedInboxes = inboxes.map((inbox) => {
      if (inbox.id === inboxId) {
        return {
          ...inbox,
          is_read: true,
        };
      }
      return inbox;
    });
    setInboxes(updatedInboxes);
  };

  //* reject project
  const rejectProject = async (projectId: string) => {
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Jika iya maka project Anda akan ditolak",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#e3342f",
      cancelButtonColor: "#6c757d",
      confirmButtonText: "Ya, Setuju",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        const token = getUserToken();
        if (!token) throw new Error("Unauthorized");

        await axios.put(
          `${API_BACKEND}/api/v1/admin/verify/project`,
          {
            id: projectId,
            status: "3", // REJECTED
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        setOpenDialog(false);
        deleteInboxById(inboxId);
      } catch (error) {
        console.error("Gagal menolak proyek:", error);
        Swal.fire({
          title: "Gagal",
          text: "Terjadi kesalahan saat menolak proyek.",
          icon: "error",
        });
      }
    }
  };

  //* delete inbox by id
  const deleteInboxById = (inboxId: number) => {
    const updatedInboxes = inboxes.filter((inbox) => inbox.id !== inboxId);
    setInboxes(updatedInboxes);
  };

  return (
    <>
      <div className="py-28 px-6 text-black">
        {inboxes.length ? (
          <div className="flex flex-col gap-y-3">
            {inboxes?.map((inbox) => {
              return (
                <div
                  key={inbox.id}
                  className="w-full p-4 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
                  onClick={() => {
                    setInboxId(inbox.id);
                    setOpenDialog(true);
                    markAsRead(inbox.id);
                  }}
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
        ) : (
          <div className="h-[560px] flex flex-col justify-center items-center text-center text-gray-500">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-16 h-16 mb-4 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M20.25 14.25v3.375a2.625 2.625 0 01-2.625 2.625H6.375A2.625 2.625 0 013.75 17.625V14.25M12 12l-9-4.5V6.375a2.625 2.625 0 012.625-2.625h12.75A2.625 2.625 0 0121.25 6.375v1.125L12 12z"
              />
            </svg>
            <p className="text-lg font-semibold">Belum ada inbox</p>
            <p className="text-sm text-gray-400">
              Kamu belum menerima pesan apa pun saat ini.
            </p>
          </div>
        )}
      </div>

      {dialogIsOpen && getUserToken() && (
        <InboxDialogMessage
          userToken={getUserToken()!}
          inboxId={inboxId}
          onReject={(id) => {
            rejectProject(id);
          }}
          onAccept={() => setOpenDialog(false)}
          barrierAction={() => {
            setOpenDialog(false);
          }}
        />
      )}
    </>
  );
};

export default Inbox;
