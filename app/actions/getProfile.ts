"use server";
import { cookies } from "next/headers";
export async function getProfileData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/profile`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().toString(),
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "failed to fetch profile");
  }
  const data = await res.json();
  return data;
}
