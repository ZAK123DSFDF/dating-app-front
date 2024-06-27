"use client";
import Image from "next/image";
import React, { useContext, useEffect, useRef, useState } from "react";
import { LuSendHorizonal } from "react-icons/lu";
import Messages from "./Messages";
import { SocketContext } from "@/provider/context";
import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { getProfileData } from "../actions/getProfile";
import { getMessageData } from "@/app/actions/getMessages";
import { useMutation } from "@tanstack/react-query";
import CreateCheckOut from "@/app/actions/CreateCheckout";

export default function ChatR() {
  const [messageInput, setMessageInput] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [typed, setTyped] = useState<boolean>(false);
  const params = useParams();
  const { socket } = useContext(SocketContext);
  const router = useRouter();
  const { data: profile } = useQuery({
    queryKey: ["profile"],
    queryFn: () => getProfileData(),
  });
  useEffect(() => {
    console.log("this is the profile data", profile);
  }, [profile]);
  const { mutateAsync: createCheckout, isPending: checkoutPending } =
    useMutation({
      mutationFn: CreateCheckOut,
      onSuccess: () => {
        console.log("success");
      },
    });
  const checkOutPage = async () => {
    try {
      const data = await createCheckout();
      if (data && data.url) {
        router.push(data.url);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const { data: messages, isPending } = useQuery({
    queryKey: ["messages", params.id],
    queryFn: () => getMessageData(params.id as string),
  });

  const createMessageData = async (chatId: string) => {
    try {
      if (messageInput.trim() === "") {
        setModalMessage("You need to type something.");
        setIsModalOpen(true);
      } else if (profile?.credits <= 0) {
        setModalMessage("insufficient credits");
        setIsModalOpen(true);
      } else {
        if (socket) {
          socket.emit("newMessage", { chatId: chatId, content: messageInput });
        }
      }
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const createMessage = (chatId: string) => {
    console.log("message created");
    createMessageData(chatId);
    setMessageInput("");
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  return (
    <div className="flex-[2] border flex flex-col overflow-hidden">
      <div className="flex bg-blue-400 p-4 gap-4 ">
        {isPending ? (
          <h1>Loading</h1>
        ) : (
          <>
            <div className="relative w-20 h-20 rounded-full overflow-hidden">
              <Image
                src={messages?.participants[0].ProfilePic}
                fill
                alt="this is profile"
                className="object-cover"
              />
            </div>
            <div className="flex flex-col items-start justify-end">
              <h1 className="text-white font-bold">
                {messages?.participants[0].name},{messages?.participants[0].age}
              </h1>
              <p className="text-red-200">id: {messages?.participants[0].id}</p>
            </div>
          </>
        )}
      </div>
      <div className="flex flex-col overflow-y-auto h-[calc(95vh-260px)] gap-10 border-b border-gray-100 ">
        <Messages typed={typed} setTyped={setTyped} />
      </div>

      <div className="flex items-center justify-start p-10">
        <input
          placeholder="send message..."
          className="w-full h-10 p-2 outline-none bg-gray-200 rounded-l-full"
          value={messageInput}
          onChange={(e) => {
            setMessageInput(e.target.value);
            setTyped(true);
          }}
        />
        <div
          onClick={() => createMessage(messages.id)}
          className="flex items-center justify-center w-10 h-10 bg-blue-300 rounded-r-full"
        >
          <LuSendHorizonal className="text-xl cursor-pointer" />
        </div>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-8 rounded-lg">
            <p>{modalMessage}</p>
            <div className="flex gap-3">
              <button
                onClick={closeModal}
                className="mt-4 bg-blue-500 text-white p-2 rounded"
              >
                Close
              </button>
              {modalMessage.includes("credits") && (
                <button
                  onClick={checkOutPage}
                  className="mt-4 bg-blue-500 text-white p-2 rounded"
                >
                  {checkoutPending ? "redirecting" : "checkout"}
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
