"use server";
import { cookies } from "next/headers";
export async function getUsersDataLogOut() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/logout`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });

  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "Logout failed");
  }

  const data = await res.json();
  // if (data) {
  //   cookies().delete("token");
  // }
  return data;
}
