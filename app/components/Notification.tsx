import { useNotificationContext } from "@/provider/notification";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import React, { useEffect } from "react";
import { getNotificationData } from "../actions/getNotification";

export default function Notification() {
  const { notifications, setNotifications } = useNotificationContext();

  const {
    data: notification,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["notification"],
    queryFn: () => getNotificationData(),
  });

  useEffect(() => {
    console.log("Fetched notification:", notification);
  }, [notification]);

  useEffect(() => {
    if (notification) {
      const messages = notification.map((not: any) => not.messages);
      const flattenedMessages = messages.flat().map((message: any) => ({
        participants: message.sender.ProfilePic,
        name: message.sender.name,
        message: message.content,
        chatId: message.chatId,
        senderId: message.senderId,
        status: message.status,
      }));
      setNotifications(flattenedMessages);
    }
  }, [notification, setNotifications]);
  if (isPending) {
    return <h1>Loading...</h1>;
  }
  if (isError) {
    return <h1>{error.message}</h1>;
  }
  return (
    <>
      {notifications.length === 0 ? (
        <h1>no notification found</h1>
      ) : (
        notifications?.map((notification, i) => (
          <div
            key={i}
            className="flex items-center justify-around bg-blue-500 drop-shadow-lg text-white gap-3 rounded-lg mx-4 p-2 mb-2"
          >
            <div className="relative w-20 h-20">
              <Image
                src={notification.participants}
                fill
                alt="Notification"
                className="object-cover rounded-full"
              />
            </div>
            <div className="flex flex-col w-32">
              <h1 className="text-[#584940]">{notification.name}</h1>
              <div className="line-clamp-3">{notification.message}</div>
            </div>
          </div>
        ))
      )}
    </>
  );
}
