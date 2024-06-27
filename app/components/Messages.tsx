"use client";
import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import { SocketContext } from "@/provider/context";
import { useQuery } from "@tanstack/react-query";
import { getMessageData } from "../actions/getMessages";

interface Message {
  senderId: string;
  content: string;
  createdAt: string;
  chat: { id: string };
  status: "SEEN" | "UNSEEN";
}
export default function Messages({ typed, setTyped }: any) {
  const [id, setId] = useState<string | null>(null);
  const [fetchedMessages, setFetchedMessages] = useState<Message[]>([]);
  const { socket } = useContext(SocketContext);
  const params = useParams();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };
  const {
    data: messages,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["messages", params.id],
    queryFn: () => getMessageData(params.id as string),
  });
  useEffect(() => {
    setId(localStorage.getItem("userId"));
  }, []);

  useEffect(() => {
    setFetchedMessages(messages?.messages);
  }, [messages?.messages]);

  useEffect(() => {
    if (socket) {
      const handleNewMessage = (newMessage: Message) => {
        console.log("Received new message:", newMessage);
        console.log(
          "this is the data of the params",
          params.id,
          newMessage.chat.id
        );
        if (!typed) {
          setTyped(true);
        }

        if (params.id === newMessage.chat.id) {
          setFetchedMessages((prevMessages) => [...prevMessages, newMessage]);
        }
      };

      const handleMessageSeen = (seenInfo: {
        senderId: string;
        message: string;
      }) => {
        setFetchedMessages((prevMessages) =>
          prevMessages?.map((msg) =>
            msg.senderId === seenInfo.senderId
              ? { ...msg, status: "SEEN" }
              : msg
          )
        );
      };
      const handleMessageSeen1 = (seenInfo: {
        senderId: string;
        message: string;
      }) => {
        setFetchedMessages((prevMessages) =>
          prevMessages?.map((msg) =>
            msg.senderId === seenInfo.senderId
              ? { ...msg, status: "SEEN" }
              : msg
          )
        );
      };

      socket.on("newMessage1", handleNewMessage);
      socket.on("messageSeen", handleMessageSeen);
      socket.on("messageSeen1", handleMessageSeen1);

      return () => {
        socket.off("newMessage1", handleNewMessage);
        socket.off("messageSeen", handleMessageSeen);
        socket.off("messageSeen1", handleMessageSeen1);
      };
    }
  }, [socket, params.id, typed, setTyped]);

  useEffect(() => {
    const scrollChatToBottomInit = () => {
      messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
    };
    const scroll = () => {
      if (!typed) {
        scrollChatToBottomInit();
      }
    };
    scroll();
  }, [fetchedMessages, typed, setTyped]);
  useEffect(() => {
    if (typed) {
      scrollChatToBottom();
    }
  }, [fetchedMessages, typed]);
  const scrollChatToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };
  if (isPending) {
    return <h1>Loading...</h1>;
  }
  if (isError) {
    return <h1>{error.message}</h1>;
  }
  return (
    <div
      ref={chatContainerRef}
      className="h-[calc(100vh-260px)] overflow-y-scroll"
    >
      {fetchedMessages?.map((message, i) => (
        <div
          key={i}
          className={`flex items-end gap-1 p-2 ${
            id === message?.senderId ? "justify-end" : "justify-start"
          }`}
        >
          {id !== message?.senderId && (
            <div className="relative w-10 h-10 overflow-hidden rounded-full">
              <Image
                src={messages?.participants[0].ProfilePic}
                fill
                className="absolute object-cover"
                alt="Participant Profile Pic"
              />
            </div>
          )}
          <div className="flex flex-col items-end gap-1">
            <div
              className={`flex flex-col p-4 ${
                id === message?.senderId
                  ? "bg-blue-300 rounded-tr-lg rounded-l-lg"
                  : "bg-gray-100 rounded-tl-lg rounded-r-lg"
              } w-96 `}
            >
              <h1>{message?.content}</h1>
              <div className="flex justify-between mt-2">
                <h1 className="text-gray-400 text-sm">
                  {formatTime(message?.createdAt)}
                </h1>
                {id === message?.senderId && (
                  <h1 className="text-gray-400 text-sm">{message?.status}</h1>
                )}
              </div>
            </div>
          </div>
          {id === message?.senderId && (
            <div className="relative w-10 h-10 overflow-hidden rounded-full">
              <Image
                src={messages?.participants[0].ProfilePic}
                fill
                className="absolute object-cover"
                alt="Participant Profile Pic"
              />
            </div>
          )}
        </div>
      ))}
      <div ref={messagesEndRef} />
    </div>
  );
}
