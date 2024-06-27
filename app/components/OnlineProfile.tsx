"use client";
import { useMutation, useQuery } from "@tanstack/react-query";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  useState,
  useContext,
  useEffect,
  useDeferredValue,
} from "react";

import { SocketContext } from "@/provider/context";
import { fetchUserProfile } from "../actions/FetchedUserProfile";
import { getSearchOnlineData } from "../actions/getOnlineSearch";
import { fetchCreateChat } from "../actions/FetchCreateChat";

export default function OnlineProfile() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [chatId, setChatId] = useState(null);
  const [fetchOnline, setFetchedOnline] = useState(null);
  const searchParams = useSearchParams();
  const ageMin = useDeferredValue(searchParams.get("ageMin"));

  const ageMax = useDeferredValue(searchParams.get("ageMax"));

  const name = useDeferredValue(searchParams.get("name"));
  const ageMinNumber = parseInt(ageMin as string);
  const ageMaxNumber = parseInt(ageMax as string);
  const router = useRouter();
  const { socket } = useContext(SocketContext);
  const {
    data: selectedUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile", selectedUserId],
    queryFn: () => fetchUserProfile(selectedUserId),
    enabled: isModalOpen,
  });
  const {
    data: FetchedOnlineUsers,
    isLoading: OnlineLoading,
    error: onlineError,
  } = useQuery({
    queryKey: ["onlineUsers", { ageMinNumber, ageMaxNumber, name }],
    queryFn: () => getSearchOnlineData(ageMinNumber, ageMaxNumber, name),
  });
  const {
    mutate: createChatMutation,
    isPending: isCreatingChat,
    isError: createChatError,
    error: mutationError,
    data,
  } = useMutation({
    mutationFn: fetchCreateChat,
    onSuccess: (data) => {
      if (socket) {
        socket.emit("createChat", {
          userId: localStorage.getItem("userId"),
          otherUserId: chatId,
        });
      }
      setIsModalOpen(false);
      setChatId(data.id);
    },
    onError: (error) => {
      console.error("Error creating chat:", error);
    },
  });
  const handleModalOpen = (userId: any) => {
    setIsModalOpen(true);
    setSelectedUserId(userId);
  };

  const handleModalClose = (e: any) => {
    e.stopPropagation();
    setIsModalOpen(false);
    setSelectedUserId(null);
  };

  const handleParentClose = (e: any) => {
    e.stopPropagation();
    setIsModalOpen(false);
  };

  const handleModalContentClick = (e: any) => {
    e.stopPropagation();
  };

  const CreateChat = (userId: any) => {
    createChatMutation(userId);
  };
  useEffect(() => {
    console.log("this is the fetched users", FetchedOnlineUsers);
  });

  useEffect(() => {
    if (chatId) {
      router.push(`/chat/${chatId}`);
    }
  }, [chatId, router]);
  if (OnlineLoading) {
    return <div className="text-center text-gray-500">Loading...</div>;
  }
  if (onlineError) {
    return (
      <div className="text-center text-red-500">
        Error: {onlineError.message}
      </div>
    );
  }
  return (
    <>
      {FetchedOnlineUsers?.length === 0 ? (
        <div className="text-center text-gray-500">No users found</div>
      ) : (
        FetchedOnlineUsers?.map((profile: any, i: any) => (
          <div
            key={i}
            className="flex bg-white p-6 rounded-lg drop-shadow-lg gap-20"
          >
            <div className="flex flex-col gap-4">
              <div className="relative w-40 h-40 overflow-hidden rounded-full">
                <Image
                  src={profile.ProfilePic}
                  fill
                  alt="this is online"
                  className="object-cover"
                />
              </div>
              <button
                className="bg-blue-500 text-white p-4 rounded-lg"
                onClick={() => handleModalOpen(profile.id)}
              >
                profile
              </button>
            </div>
            <div className="flex gap-3">
              {profile.Picture.map((pic: any, j: any) => (
                <div
                  key={j}
                  className="relative w-32 h-48 overflow-hidden rounded-lg"
                >
                  <Image
                    src={pic}
                    fill
                    alt="this is online"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
        ))
      )}
      {isModalOpen && (
        <div
          onClick={handleParentClose}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
        >
          <div
            onClick={handleModalContentClick}
            className="bg-white p-8 rounded-lg"
          >
            <h2>User Profile</h2>
            {isLoading && <div>Loading...</div>}
            {error && <div>Error loading data</div>}
            {selectedUser && !isLoading && !error && (
              <>
                <h1>ProfilePic</h1>
                <div className="relative size-16 rounded-full overflow-hidden">
                  <Image
                    src={selectedUser.ProfilePic}
                    fill
                    alt="this is profile"
                    className="object-cover"
                  />
                </div>
                <h1>Pictures</h1>
                <div className="flex flex-wrap gap-4">
                  {selectedUser.Picture.map((picture: any, i: any) => (
                    <div key={i} className="relative size-40 overflow-hidden">
                      <Image
                        src={picture}
                        fill
                        alt="this is profile"
                        className="object-cover"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <h3>Name: {selectedUser.name}</h3>
                  <p>Email: {selectedUser.email}</p>
                </div>
                <button
                  onClick={() => CreateChat(selectedUser.id)}
                  className="bg-blue-300 text-white p-4 rounded-lg"
                >
                  chat
                </button>
              </>
            )}
            <div className="flex gap-2">
              <button
                onClick={handleModalClose}
                className="bg-blue-300 text-white p-4 rounded-lg"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
