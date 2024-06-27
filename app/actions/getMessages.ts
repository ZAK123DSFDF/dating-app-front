"use server";
import { cookies } from "next/headers";
export async function getMessageData(id: string) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/chat/allmessages/${id}`,
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
    throw new Error(errorData.message || "failed to fetch messages");
  }
  const data = await res.json();
  console.log(data);
  return data;
}
