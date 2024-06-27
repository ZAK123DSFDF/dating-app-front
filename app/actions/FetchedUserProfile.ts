"use server";
import { cookies } from "next/headers";
export const fetchUserProfile = async (userId: any) => {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/profile/${userId}`,
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
    throw new Error(errorData.message || "failed to fetch user profile");
  }

  return res.json();
};
