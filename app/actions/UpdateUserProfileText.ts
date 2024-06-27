"use server";
import { cookies } from "next/headers";
export default async function UpdateUserProfileText({
  userId,
  name,
  age,
  email,
}: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/profile/updateText/${userId}`,
    {
      method: "PATCH",
      body: JSON.stringify({ name, age, email }),
      headers: {
        "Content-Type": "application/json",
        Cookie: cookies().toString(),
      },
    }
  );

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "update failed");
  }
  const data = await response.json();
  return data;
}
