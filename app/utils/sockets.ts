import { io, Socket } from "socket.io-client";

export const createSocket = (userId: string): Socket => {
  console.log(process.env.NEXT_PUBLIC_SOCKET_URL! + userId);
  return io(process.env.NEXT_PUBLIC_SOCKET_URL!, {
    transports: ["websocket"],
    query: { user_id: userId },
  });
};

const socket = io(process.env.NEXT_PUBLIC_SOCKET_URL!);
export default socket;
