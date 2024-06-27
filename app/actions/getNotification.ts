"use server";
import { cookies } from "next/headers";
export async function getNotificationData() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/chat/notification`,
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
    throw new Error(errorData.message || "failed to fetch Notification");
  }
  const data = await res.json();
  console.log("this is the data", data);
  return data;
}
