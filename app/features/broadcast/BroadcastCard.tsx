import React from "react";
import moment from "moment";
import { Broadcast } from "@/app/interfaces/broadcast/IBroadcast";
import Image from "next/image";

interface Props {
  broadcast: Broadcast;
  onClick: () => void;
}

const BroadcastCard: React.FC<Props> = ({ broadcast, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="w-full p-4 rounded-lg bg-white shadow hover:shadow-md border border-gray-200 transition cursor-pointer"
    >
      <div className="flex gap-4">
        {/* Foto Broadcast */}
        {broadcast.path && (
          <div className="relative w-16 h-16 flex-shrink-0 rounded-md overflow-hidden">
            <Image
              src={broadcast.path}
              alt={broadcast.title}
              fill
              className="object-cover"
            />
          </div>
        )}

        {/* Konten */}
        <div className="flex-1">
          <div className="flex items-start justify-between">
            <p className="text-sm font-semibold text-gray-800">
              {broadcast.title}
            </p>
            {!broadcast.is_read && (
              <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded-full">
                Baru
              </span>
            )}
          </div>

          <p className="text-xs text-gray-500 mt-1">
            {moment(broadcast.created_at)
              .utc()
              .locale("id")
              .format("DD MMMM YYYY, HH:mm")}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BroadcastCard;
