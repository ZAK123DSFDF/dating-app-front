import { SocketContext } from "@/provider/context";
import { useContext } from "react";
import { Socket } from "socket.io-client";

export const useSocket = (): Socket | null => {
  const { socket } = useContext(SocketContext);
  if (!socket) {
    throw new Error("Socket is not available.");
  }
  console.log(socket);
  return socket;
};
