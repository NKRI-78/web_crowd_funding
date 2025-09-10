"use client";

import CircularProgressIndicator from "@/app/components/CircularProgressIndicator";
import { Broadcast } from "@/app/interfaces/broadcast/IBroadcast";
import { getUser } from "@/app/lib/auth";
import { API_BACKEND } from "@/app/utils/constant";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import BroadcastCard from "./BroadcastCard";
import GeneralDialog from "@/app/components/GeneralDialog";
import moment from "moment";

const BroadcastView = () => {
  const userCookie = getUser();

  const [loading, setLoading] = useState(true);

  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);
  const [selectedBroadcast, setSelectedBroadcast] = useState<Broadcast | null>(
    null
  );

  const [detailDialogIsOpen, setOpenDetailDialog] = useState(false);

  //* fetch data
  useEffect(() => {
    setLoading(true);
    const token = userCookie?.token;
    if (token) {
      const fetchBroadcast = async () => {
        try {
          const res = await axios.get(`${API_BACKEND}/api/v1/broadcast/list`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          const broadcastData = res.data.data as Broadcast[];
          const mappedBroadcasts = broadcastData.map((broadcast) => ({
            ...broadcast,
            is_read: false,
          }));
          setBroadcasts(mappedBroadcasts);
          setLoading(false);
        } catch (error) {
          Swal.fire({
            icon: "error",
            title: "Gagal Mendapatkan Broadcast",
            text: "Terjadi kesalahan saat mengambil data broadcast. Silakan coba lagi.",
            confirmButtonText: "Coba Lagi 🔄",
            allowOutsideClick: false,
          }).then((result) => {
            if (result.isConfirmed) {
              fetchBroadcast();
            }
          });
        }
      };
      fetchBroadcast();
    }
  }, []);

  //* mark as read
  const markAsRead = (id: number) => {
    const updatedBroadcasts = broadcasts.map((broadcast) => {
      if (id === broadcast.id) {
        return { ...broadcast, is_read: true };
      }
      return broadcast;
    });
    setBroadcasts(updatedBroadcasts);
  };

  return (
    <div className="py-28 px-6">
      {loading ? (
        <div className="w-full h-[70vh] flex flex-col items-center justify-center">
          <CircularProgressIndicator textDescription="Memuat Halaman" />
        </div>
      ) : (
        <div className="space-y-3">
          {broadcasts.map((broadcast, i) => (
            <BroadcastCard
              key={i}
              broadcast={broadcast}
              onClick={() => {
                markAsRead(broadcast.id);
                setOpenDetailDialog(true);
                setSelectedBroadcast(broadcast);
              }}
            />
          ))}
        </div>
      )}

      <GeneralDialog
        isOpen={detailDialogIsOpen && selectedBroadcast != null}
        onClose={() => {
          setOpenDetailDialog(false);
        }}
      >
        <img
          src={selectedBroadcast?.path}
          alt={`Image Broadcast ${selectedBroadcast?.title}`}
          className="w-full h-[220px] object-cover"
          onError={(e) => {
            const target = e.currentTarget as HTMLImageElement;
            if (target.src !== window.location.origin + "/images/img.jpg") {
              target.src = "/images/img.jpg";
            }
          }}
        />

        <p className="text-xl font-semibold mt-4">
          {selectedBroadcast?.title ?? "-"}
        </p>

        <p className="text-xs text-gray-400 mt-1">
          {moment(selectedBroadcast?.created_at)
            .utc()
            .locale("id")
            .format("DD MMMM YYYY")}
        </p>

        <p className="text-sm mt-2">{selectedBroadcast?.content ?? "-"}</p>
      </GeneralDialog>
    </div>
  );
};

export default BroadcastView;
