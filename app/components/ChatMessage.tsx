"use client";
import { SocketContext } from "@/provider/context";
import { useNotificationContext } from "@/provider/notification";
import { useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import React, {
  useContext,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import { getChatData } from "../actions/getAllChat";

type MessageType = {
  id: string;
  content: string;
  chatId: string;
  senderId: string;
  status: string;
};

type ParticipantType = {
  id: string;
  name: string;
  age: number;
  ProfilePic: string;
};

type ChatType = {
  id: string;
  participants: ParticipantType[];
  messages: MessageType[];
};

export default function ChatMessage() {
  const [activeChat, setActiveChat] = useState<string | null>(null);
  const searchParams = useSearchParams();
  const name = useDeferredValue(searchParams.get("name"));
  const { data, isPending, isError, error } = useQuery<ChatType[]>({
    queryKey: ["chatData", name],
    queryFn: () => getChatData(name as string),
    staleTime: 0,
  });
  const [messages, setMessages] = useState<ChatType[] | null>(null);
  const [filteredNotifications] = useState([]);
  const router = useRouter();
  const { socket } = useContext(SocketContext);
  const { notifications, setNotifications } = useNotificationContext();
  const params = useParams();

  useEffect(() => {
    const savedActiveChat = localStorage.getItem("activeChat");
    if (savedActiveChat) {
      setActiveChat(savedActiveChat);
    }
  }, []);

  useEffect(() => {
    setMessages(data || null);
    console.log("this is the chat data", data);
  }, [data]);

  useEffect(() => {
    if (!params.id) {
      setActiveChat(null);
    }
  }, [params.id]);

  const handleChatClick = (chatId: any) => {
    setActiveChat(chatId);
    localStorage.setItem("activeChat", chatId);
    console.log(chatId);
    router.push(`/chat/${chatId}`);

    const relevantNotifications = notifications.filter(
      (not) => not.chatId === chatId,
    );

    if (relevantNotifications.length > 0) {
      setTimeout(() => {
        setNotifications((prevNotifications) =>
          prevNotifications.filter((notif) => notif.chatId !== chatId),
        );
      }, 10000);
      relevantNotifications.forEach((not) => {
        if (socket) {
          socket.emit("markAsSeen", {
            chatId: not.chatId,
            senderId: not.senderId,
          });
        }
      });
    }
  };

  useEffect(() => {
    if (socket) {
      socket.on("newMessage1", (newMessage: MessageType) => {
        console.log("Received message from another user:", newMessage);
        setMessages((prevMessages) => {
          if (!prevMessages) return null;

          return prevMessages.map((chat) => {
            if (chat.id === newMessage.chatId) {
              return {
                ...chat,
                messages: [newMessage],
              };
            }
            return chat;
          });
        });
      });
      socket.on("messageSeen", (newMessage: any) => {
        setMessages((prevMessages) => {
          if (!prevMessages) return null;

          return prevMessages.map((chat) => {
            if (chat.id === newMessage.chatId) {
              return {
                ...chat,
                messages: [newMessage],
              };
            }
            return chat;
          });
        });
      });
      socket.on("messageSeen1", (newMessage: any) => {
        setMessages((prevMessages) => {
          if (!prevMessages) return null;

          return prevMessages.map((chat) => {
            if (chat.id === newMessage.chatId) {
              return {
                ...chat,
                messages: [newMessage],
              };
            }
            return chat;
          });
        });
      });
    }

    return () => {
      if (socket) {
        socket.off("newMessage1");
        socket.off("messageSeen");
        socket.off("messageSeen1");
      }
    };
  }, [socket, params.id]);

  if (isPending) {
    return <h1>Loading...</h1>;
  }
  if (isError) {
    return <h1>{error.message}</h1>;
  }

  return (
    <>
      {messages?.length === 0 ? (
        <h1>No chats found</h1>
      ) : (
        messages?.map((chat) => (
          <div
            className={`relative flex items-center justify-center w-full min-h-32 ${
              activeChat === chat.id ? "bg-blue-300" : "bg-white"
            } gap-6 p-2 rounded-lg drop-shadow-lg cursor-pointer`}
            key={chat.id}
            onClick={() => handleChatClick(chat.id)}
          >
            {chat.participants.map((participant) => (
              <div key={participant.id} className="flex justify-around  w-full">
                <div className="relative rounded-full w-20 h-20 overflow-hidden">
                  <Image
                    src={participant.ProfilePic}
                    fill
                    alt="Profile Picture"
                    className="object-cover"
                  />
                </div>
                <div className="flex flex-col w-32">
                  <h1 className="font-bold">
                    {participant.name}, {participant.age}
                  </h1>
                  {chat.messages.length === 0 &&
                  filteredNotifications.length === 0 ? (
                    <h1 className="font-normal text-gray-500">
                      No relevant messages
                    </h1>
                  ) : (
                    chat.messages.map((message) => (
                      <h1
                        key={message.id}
                        className="font-normal text-gray-500 line-clamp-2"
                      >
                        {message.content}
                      </h1>
                    ))
                  )}
                </div>
                {chat.messages.some(
                  (message) =>
                    message.status === "UNSEEN" &&
                    localStorage.getItem("userId") !== message.senderId &&
                    params.id !== chat.id,
                ) && (
                  <div className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    NEW
                  </div>
                )}
              </div>
            ))}
          </div>
        ))
      )}
    </>
  );
}
