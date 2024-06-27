"use client";
import React, { useContext, useEffect, useState } from "react";
import ChatR from "./ChatR";
import ChatL from "./ChatL";
import ChatNoSelect from "./ChatNoSelect";
import { useParams, useRouter } from "next/navigation";
import { SocketContext } from "@/provider/context";

export default function Chat() {
  const params = useParams();
  const { id } = params;
  const { socket } = useContext(SocketContext);
  const router = useRouter();
  useEffect(() => {
    if (socket === null) {
      console.log("socket is null");
    } else {
      socket.on("testMessage", (message: any) => {
        console.log("this is from chat page", message);
      });
      socket.on("connect", () => {
        console.log("connected successfully from the chat page");
      });
      socket.on("disconnect", () => {
        console.log("disconnected successfully", socket.id);
      });
    }
  }, [socket]);
  return (
    <>
      {id ? (
        <div className="flex w-full lg:w-[calc(100%-20rem-15rem)]">
          <ChatL />
          <ChatR />
        </div>
      ) : (
        <div className="flex w-[calc(100%-20rem-15rem)]">
          <ChatL />
          <ChatNoSelect />
        </div>
      )}
    </>
  );
}
