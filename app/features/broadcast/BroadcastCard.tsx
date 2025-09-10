import React from "react";
import moment from "moment";
import { Broadcast } from "@/app/interfaces/broadcast/IBroadcast";

interface Props {
  broadcast: Broadcast;
  onClick: () => void;
}

const broadcastCard: React.FC<Props> = ({ broadcast, onClick }) => {
  return (
    <div
      className="w-full p-4 rounded-lg bg-white shadow-sm border border-gray-200 hover:bg-gray-100 transition-colors cursor-pointer"
      onClick={onClick}
    >
      <div className="flex items-start justify-between">
        <p className="text-sm font-semibold">{broadcast.title}</p>
        {!broadcast.is_read && (
          <span className="text-xs text-blue-600 font-medium bg-blue-100 px-2 py-0.5 rounded-full">
            Baru
          </span>
        )}
      </div>
      <p className="text-sm text-gray-400 mt-2">
        {moment(broadcast.created_at)
          .utc()
          .locale("id")
          .format("DD MMMM YYYY, HH:mm")}
      </p>
    </div>
  );
};

export default broadcastCard;
