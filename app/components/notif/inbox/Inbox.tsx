"use client";

import useOnlineStatus from "@/app/hooks/useOnlineStatus";
import { API_BACKEND } from "@/app/utils/constant";
import axios from "axios";
import { useEffect, useState } from "react";
import InboxModalDialog from "../InboxModalDialog";
import Swal from "sweetalert2";
import { InboxResponse } from "../inbox-interface";
import InboxEmpty from "../InboxEmpty";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import { createSocket } from "@/app/utils/sockets";
import { useDispatch } from "react-redux";
import { setBadge } from "@/redux/slices/badgeSlice";
import { getUser } from "@/app/lib/auth";
import InboxCard from "../InboxCard";

const Inbox = () => {
  // data hook
  const [inboxes, setInboxes] = useState<InboxResponse[]>([]);
  const [selectedInbox, setSelectedInbox] = useState<InboxResponse | null>(
    null
  );

  // badge
  const dispatch = useDispatch();

  // state hook
  const isOnline = useOnlineStatus();
  const [dialogIsOpen, setOpenDialog] = useState<boolean>(false);

  const router = useRouter();
  const user = getUser();

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

  // update formKey liat: "app\(defaults)\form-penerbit\UpdateProfileInterface.ts" untuk detail key nya
  // admin mengirim key melalui field_4 yang nanti dicocokan dengan formKey
  const updateKey = selectedInbox?.field_4;

  //* initstate
  useEffect(() => {
    if (isOnline) {
      console.log("isOnline" + isOnline);
      fetchInbox();
    }
  }, [isOnline]);

  //* socket
  useEffect(() => {
    const socket = createSocket(user?.id ?? "-");

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
      console.log("Socket connected user id :", user?.id ?? "-");
    });

    socket.on("inbox-update", (data) => {
      console.log("Update");
      fetchInbox();
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  //* set badge to reducer
  useEffect(() => {
    dispatch(
      setBadge(inboxes.filter((inbox) => inbox.is_read == false).length)
    );
  }, [inboxes]);

  //* fetch inbox
  const fetchInbox = async () => {
    try {
      console.log("user token");
      console.log(user?.token);
      if (user?.token) {
        const res = await axios(`${API_BACKEND}/api/v1/inbox/list`, {
          headers: {
            Authorization: `Bearer ${user?.token}`,
          },
        });
        if (!res.data["data"]) {
          setInboxes([]);
          return;
        }
        const filteredInboxes = res.data["data"]
          .filter(
            (inbox: InboxResponse) =>
              inbox.type === "billing" && inbox.status !== "REJECTED"
          )
          .reverse();
        setInboxes(filteredInboxes);
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Gagal Mendapatkan Data Inbox",
        text: `Maaf saat ini tidak bisa mendapatkan data inbox ${error}`,
        showConfirmButton: false,
        timer: 3000,
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

  //* navigate to billing info
  const navigateToBillingInfo = (inbox: InboxResponse) => {
    // raw payment detail dari api masih berupa data json dalam bentuk string
    // perlu dikonversi dulu ke json
    const rawPaymentDetail = inbox.data;
    const inboxId = inbox.id;
    const projectId = inbox.field_2;

    if (inboxId && rawPaymentDetail) {
      const paymentDetail = JSON.parse(rawPaymentDetail);
      const administrationFee = paymentDetail.total_amount;
      router.push(`/payment-manual/${inboxId}`);
    }
  };

  //* navigate to additional document
  const navigateToAddAditionalDocument = (projectId: string | undefined) => {
    if (projectId) {
      router.push(`/dashboard/dokumen-pelengkap?projectId=${projectId}`);
    }
  };

  //* handle inbox on click
  const handleInboxOnClick = (inbox: InboxResponse) => {
    markAsRead(inbox.id);

    // is update document ketika field_3 berisi key "reupload-document" dari admin
    const isUpdateDocument = inbox.field_3 === "reupload-document";
    console.log(inbox.field_3);
    if (isUpdateDocument) {
      setSelectedInbox(inbox);
      setOpenDialog(true);
    } else {
      console.log(inbox.field_3 === "additional-document");
      if (inbox.field_3 === "additional-document") {
        navigateToAddAditionalDocument(inbox.field_2);
      } else {
        navigateToBillingInfo(inbox);
      }
    }
  };

  return (
    <>
      <div className="py-28 px-6 text-black">
        {inboxes.length ? (
          <div className="flex flex-col gap-y-3">
            {inboxes?.map((inbox) => {
              return (
                <InboxCard
                  key={inbox.id}
                  inbox={inbox}
                  onClick={() => {
                    handleInboxOnClick(inbox);
                  }}
                />
              );
            })}
          </div>
        ) : (
          <InboxEmpty
            title="Belum ada inbox"
            message="Kamu belum menerima pesan apa pun saat ini."
          />
        )}
      </div>

      {dialogIsOpen && user?.token && (
        <InboxModalDialog
          inbox={selectedInbox}
          onAccept={() => {
            if (updateKey) {
              if (roleUser !== "investor") {
                router.push(`/form-penerbit?update=true&form=${updateKey}`);
              } else {
                router.push(`/form-pemodal?update=true&form=${updateKey}`);
              }
            }
          }}
          onReject={() => {
            setOpenDialog(false);
          }}
          onClose={() => {
            setOpenDialog(false);
          }}
        />
      )}
    </>
  );
};

export default Inbox;
