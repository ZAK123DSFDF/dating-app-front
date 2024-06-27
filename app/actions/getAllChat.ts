"use server";
import { cookies } from "next/headers";
export async function getChatData(name: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/chat/user?name=${name ? name : ""}`,
    {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
    }
  );
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "failed to fetch chats");
  }
  const data = await res.json();
  return data;
}
