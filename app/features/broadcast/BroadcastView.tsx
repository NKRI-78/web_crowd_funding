"use client";

import CircularProgressIndicator from "@/app/components/CircularProgressIndicator";
import { Broadcast } from "@/app/interfaces/broadcast/IBroadcast";
import { API_BACKEND } from "@/app/utils/constant";
import axios from "axios";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import BroadcastCard from "./BroadcastCard";
import { useRouter } from "next/navigation";

const BroadcastView = () => {
  const router = useRouter();

  const [loading, setLoading] = useState(true);

  const [broadcasts, setBroadcasts] = useState<Broadcast[]>([]);

  //* fetch data
  useEffect(() => {
    setLoading(true);
    const fetchBroadcast = async () => {
      try {
        const res = await axios.get(`${API_BACKEND}/api/v1/broadcast/list`);
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
                router.push(`/broadcast/${broadcast.id}`);
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default BroadcastView;
