"use server";
import { cookies } from "next/headers";
export const fetchCreateChat = async (userId: any) => {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/chat/create/${userId}`,
    {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "failed to create chat");
  }
  const chatData = await response.json();

  return chatData;
};
