import { SocketContext } from "@/provider/context";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import React, {
  useContext,
  useDeferredValue,
  useEffect,
  useState,
} from "react";
import { fetchCreateChat } from "../actions/FetchCreateChat";
import { useMutation, useQuery } from "@tanstack/react-query";
import { fetchUserProfile } from "../actions/FetchedUserProfile";
import { getSearchData } from "../actions/getSearch";

export default function SearchCard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [chatId, setChatId] = useState(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const ageMin = useDeferredValue(searchParams.get("ageMin"));

  const ageMax = useDeferredValue(searchParams.get("ageMax"));

  const name = useDeferredValue(searchParams.get("name"));
  const ageMinNumber = parseInt(ageMin as string);
  const ageMaxNumber = parseInt(ageMax as string);
  const { socket } = useContext(SocketContext);
  const {
    data: search,
    isPending,
    isError,
    error: searchError,
  } = useQuery({
    queryKey: ["search", { name, ageMinNumber, ageMaxNumber }],
    queryFn: () => getSearchData(name as string, ageMinNumber, ageMaxNumber),
  });
  const {
    data: selectedUser,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userProfile", selectedUserId],
    queryFn: () => fetchUserProfile(selectedUserId as string),
    enabled: isModalOpen,
  });
  const {
    mutate: createChatMutation,
    isPending: isCreatingChat,
    isError: createChatError,
    error: mutationError,
    data,
  } = useMutation({
    mutationFn: fetchCreateChat,
    onSuccess: (data: any) => {
      if (socket) {
        socket.emit("createChat", {
          userId: localStorage.getItem("userId"),
          otherUserId: chatId,
        });
      }
      setIsModalOpen(false);
      setChatId(data.id);
    },
    onError: (error: any) => {
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
    if (chatId) {
      router.push(`/chat/${chatId}`);
    }
  }, [chatId, router]);

  if (isPending) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        Loading...
      </div>
    );
  }
  if (isError) {
    return <div>{searchError.message}</div>;
  }

  return (
    <>
      {search.length === 0 ? (
        <h1 className="flex justify-center">no users found</h1>
      ) : (
        search.flat().map((user: any, index: number) => (
          <div key={index} className="flex flex-col relative gap-3">
            <div
              onClick={() => handleModalOpen(user.id)}
              className="relative w-44 h-60 border-2 overflow-hidden border-white rounded-lg object-cover cursor-pointer"
            >
              <Image
                src={user.ProfilePic}
                fill
                alt="User card"
                className="object-cover"
              />
              {user.status === "ONLINE" && (
                <>
                  <div className="absolute top-2 left-2 inline-flex h-2 w-2 bg-green-500 rounded-full"></div>
                  <div className="absolute top-2 left-2 inline-flex h-2 w-2 bg-green-500 rounded-full animate-ping"></div>
                </>
              )}
            </div>
            <h1
              className="cursor-pointer bg-blue-500 text-white flex items-center justify-center rounded-lg p-2"
              onClick={() => handleModalOpen(user.id)}
            >
              {user.name},{user.age}
            </h1>
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
                  Chat
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
