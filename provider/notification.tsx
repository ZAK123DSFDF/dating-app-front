"use client";
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
  Dispatch,
  SetStateAction,
} from "react";
import { SocketContext } from "@/provider/context";
import { useParams } from "next/navigation";

interface NotificationItem {
  participants: string;
  name: string;
  message: string;
  chatId: string;
  senderId: string;
  status: string;
}

interface NotificationContextType {
  notifications: NotificationItem[];
  setNotifications: Dispatch<SetStateAction<NotificationItem[]>>;
}
export const NotificationContext = createContext<
  NotificationContextType | undefined
>(undefined);

export const NotificationProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const { socket } = useContext(SocketContext);
  const params = useParams();

  useEffect(() => {
    if (socket) {
      socket.on("notification", (message: any) => {
        if (message.chatId === params.id) {
          socket.emit("notificationSeen", {
            chatId: message.chatId,
            senderId: message.senderId,
          });
          console.log("this massage seen is sent");
        } else {
          setNotifications((prevNotifications) => [
            ...prevNotifications,
            {
              participants: message.sender.ProfilePic,
              name: message.sender.name,
              message: message.content,
              chatId: message.chatId,
              senderId: message.senderId,
              status: message.status,
            },
          ]);
        }
      });
      socket.on("messageSeen", (seenInfo: { senderId: string }) => {
        setNotifications((prevNotifications: NotificationItem[]) =>
          prevNotifications.filter(
            (notif) => notif.senderId !== seenInfo.senderId,
          ),
        );
      });

      return () => {
        socket.off("notification");
      };
    }
  }, [socket, params]);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        setNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider",
    );
  }
  return context;
};
