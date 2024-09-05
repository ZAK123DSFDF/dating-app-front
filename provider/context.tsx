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
  const [isPolling, setIsPolling] = useState(false);
  const [messages, setMessages] = useState<any[]>([]);

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/messages`,
          {
            method: "GET",
            credentials: "include",
          }
        );
        const newMessages = await response.json();
        setMessages((prevMessages) => [...prevMessages, ...newMessages]);
      } catch (error) {
        console.error("Error fetching messages during polling:", error);
      }
    };

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
            // Attempt WebSocket connection
            const newSocket = io(`${process.env.NEXT_PUBLIC_BASE_URL}`, {
              query: { id: localStorage.getItem("userId") },
              withCredentials: true,
            });
            socketRef.current = newSocket;
            setSocket(newSocket);

            const handleConnect = () => {
              console.log("WebSocket connected successfully", newSocket.id);
              setIsPolling(false); // Stop polling if WebSocket is active
            };

            const handleMessage = (message: any) => {
              console.log("Received message via WebSocket:", message);
              setMessages((prevMessages) => [...prevMessages, message]);
            };

            const handleDisconnect = () => {
              console.log("WebSocket disconnected, starting polling...");
              setIsPolling(true); // Switch to polling if WebSocket disconnects
            };

            newSocket.on("connect", handleConnect);
            newSocket.on("testMessage", handleMessage);
            newSocket.on("disconnect", handleDisconnect);

            // Cleanup function for WebSocket
            return () => {
              newSocket.off("connect", handleConnect);
              newSocket.off("testMessage", handleMessage);
              newSocket.off("disconnect", handleDisconnect);
              newSocket.disconnect();
              console.log("WebSocket disconnected on component unmount");
            };
          }
        } else {
          // If not authenticated, clean up any existing WebSocket and start polling
          if (socketRef.current) {
            socketRef.current.disconnect();
            socketRef.current = null;
            setSocket(null);
          }
          setIsPolling(true);
        }
      } catch (error) {
        console.error("Error checking authentication:", error);
      }
    };

    checkAuthentication();

    // Polling logic if WebSocket is not connected
    let pollingInterval: NodeJS.Timeout;
    if (isPolling) {
      pollingInterval = setInterval(fetchMessages, 5000); // Poll every 5 seconds
    }

    // Cleanup function for polling and WebSocket
    return () => {
      if (pollingInterval) clearInterval(pollingInterval);
      if (socketRef.current) {
        socketRef.current.disconnect();
        socketRef.current = null;
        setSocket(null);
        console.log("WebSocket disconnected on component unmount");
      }
    };
  }, [isPolling]);

  return (
    <SocketContext.Provider value={{ socket }}>
      {children}
    </SocketContext.Provider>
  );
};
