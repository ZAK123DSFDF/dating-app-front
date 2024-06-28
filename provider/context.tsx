"use client";
import React, { createContext, useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";

interface SocketContextData {
  socket: Socket | null;
}

export const SocketContext = createContext<SocketContextData>({
  socket: null,
});

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const socketRef = useRef<Socket | null>(null);
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const checkAuthentication = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/check`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const data = await response.json();
        if (data.isAuthenticated) {
          if (!socketRef.current) {
            const newSocket = io(`${process.env.NEXT_PUBLIC_BASE_URL}`, {
              query: { id: localStorage.getItem("userId") },
              withCredentials: true,
              transports: ["websocket"],
            });
            socketRef.current = newSocket;
            setSocket(newSocket);

            const handleConnect = () => {
              console.log("connected successfully", newSocket.id);
            };

            const handleMessage = (message: any) => {
              console.log("Received message:", message);
            };

            newSocket.on("connect", handleConnect);
            newSocket.on("testMessage", handleMessage);

            // Cleanup function
            return () => {
              newSocket.off("connect", handleConnect);
              newSocket.off("testMessage", handleMessage);
              newSocket.disconnect();
              console.log("Socket disconnected on component unmount");
            };
          }
        } else {
          // If not authenticated, clean up any existing socket
          if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setSocket(null);
          }
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuthentication();

    // Cleanup function
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        console.log("Socket disconnected on component unmount");
      }
    };
  }, [socketRef]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
