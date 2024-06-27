"use server";

import { cookies } from "next/headers";

export default async function deleteProfileImage(userId: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/delete/profileImage/${userId}`,
    {
      method: "PATCH",
      headers: {
        Cookie: cookies().toString(),
      },
    }
  );
  console.log("this is the user Id", userId);
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "delete failed");
  }

  const data = await response.json();
  return data;
}
