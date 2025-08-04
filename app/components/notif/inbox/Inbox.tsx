"use client";

import useOnlineStatus from "@/app/hooks/useOnlineStatus";
import { API_BACKEND } from "@/app/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import InboxDialogMessage from "../InboxDialogMessage";
import Swal from "sweetalert2";
import { InboxModel } from "../InboxModel";
import EmptyInbox from "../EmptyInbox";
import { useRouter } from "next/navigation";
import moment from "moment";
import Cookies from "js-cookie";
import { createSocket } from "@/app/utils/sockets";
import { useDispatch, useSelector } from "react-redux";
import { setBadge } from "@/redux/slices/badgeSlice";

interface InboxState {
  loading?: boolean;
  errorMessage?: string | null;
}

const Inbox = () => {
  // data hook
  const [inboxes, setInboxes] = useState<InboxModel[]>([]);

  // badge
  const dispatch = useDispatch();

  // state hook
  const isOnline = useOnlineStatus();
  const [dialogIsOpen, setOpenDialog] = useState<boolean>(false);
  const [inboxId, setInboxId] = useState<number>(0);
  const [selectedProject, setSelectedProject] = useState<{
    projectId: string;
    price: string;
  }>({ projectId: "", price: "" });
  const [inboxState, setInboxState] = useState<InboxState>({
    loading: true,
    errorMessage: null,
  });

  function getUserToken(): string | null {
    const userCookie = Cookies.get("user");
    if (!userCookie) return null; // ✅ tambahkan return

    const userJson = JSON.parse(userCookie);
    return userJson.token;
  }
  function getUserId(): string | null {
    const userCookie = Cookies.get("user");
    if (!userCookie) return null; // ✅ tambahkan return

    const userJson = JSON.parse(userCookie);
    return userJson.id;
  }

  const router = useRouter();

  const roleCookie = Cookies.get("role");
  const userRoleCookie = Cookies.get("user");
  let role = null;

  if (roleCookie) {
    try {
      const parsed = JSON.parse(roleCookie);
      role = parsed.role;
    } catch (e) {
      console.error("Gagal parsing roleCookie", e);
    }
  }

  let roleUser = null;

  if (userRoleCookie) {
    try {
      const parsed = JSON.parse(userRoleCookie);
      roleUser = parsed.role;
    } catch (e) {
      console.error("Gagal parsing roleCookie", e);
    }
  }

  //* use effect
  useEffect(() => {
    if (isOnline) {
      console.log("isOnline" + isOnline);
      fetchInbox();
    } else {
      setInboxState({
        loading: false,
        errorMessage: "Tidak ada koneksi internet",
      });
    }
  }, [isOnline]);

  //* set badge to reducer
  useEffect(() => {
    dispatch(
      setBadge(inboxes.filter((inbox) => inbox.is_read == false).length)
    );
  }, [inboxes]);

  //* fetch inbox
  const fetchInbox = async () => {
    try {
      const token = getUserToken();
      console.log("user token");
      console.log(token);
      if (token) {
        const res = await axios(`${API_BACKEND}/api/v1/inbox/list`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (!res.data["data"]) {
          setInboxes([]);
          return;
        }
        const filteredBillingInboxes = res.data["data"]
          .filter(
            (inbox: InboxModel) =>
              inbox.type === "billing" && inbox.status !== "REJECTED"
          )
          .reverse();
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

  const approveProject = (projectId: string, price: string) => {
    return router.push(`/payment-method?projectId=${projectId}&price=${price}`);
  };

  //* delete inbox by id
  const deleteInboxById = (inboxId: number) => {
    const updatedInboxes = inboxes.filter((inbox) => inbox.id !== inboxId);
    setInboxes(updatedInboxes);
  };

  useEffect(() => {
    const userId = getUserId();
    console.log("user token");
    console.log(userId);

    const socket = createSocket(userId ?? "-");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      console.log("Socket connected user id :", userId ?? "-");
    });

    socket.on("inbox-update", (data) => {
      console.log("Update");
      fetchInbox();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

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
                    setSelectedProject({
                      projectId: inbox.field_2,
                      price: inbox.field_1,
                    });
                    markAsRead(inbox.id);

                    console.log(
                      "is update document?" + inbox.field_3 ===
                        "reupload-document"
                    );

                    setOpenDialog(true);
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
                    {moment(inbox.created_at)
                      .utc()
                      .locale("id")
                      .format("DD MMMM YYYY, HH:mm")}
                  </p>
                </div>
              );
            })}
          </div>
        ) : (
          <EmptyInbox
            title="Belum ada inbox"
            message="Kamu belum menerima pesan apa pun saat ini."
          />
        )}
      </div>

      {dialogIsOpen && getUserToken() && (
        <InboxDialogMessage
          userToken={getUserToken()!}
          inboxId={inboxId}
          onReject={(id, isUpdateDocument) => {
            if (isUpdateDocument) {
              setOpenDialog(false);
            } else {
              rejectProject(id);
            }
          }}
          onAccept={(isUpdateDocument, form) => {
            if (isUpdateDocument) {
              if (role !== 1 || roleUser !== "investor") {
                console.log("update dokumen");
                console.log(form);
                router.push(`/form-penerbit?update=true&form=${form}`);
              } else {
                router.push(`/form-pemodal?update=true&form=${form}`);
              }
            } else {
              approveProject(selectedProject.projectId, selectedProject.price);
            }
          }}
          barrierAction={() => {
            setOpenDialog(false);
          }}
        />
      )}
    </>
  );
};

export default Inbox;
