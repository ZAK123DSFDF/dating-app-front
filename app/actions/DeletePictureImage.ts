"use server";
import { cookies } from "next/headers";

export default async function deletePictureImage({ userId, imageIndex }: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/delete/image/${userId}/${imageIndex}`,
    {
      method: "PATCH",
      headers: {
        Cookie: cookies().toString(),
      },
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "delete failed");
  }

  const data = await response.json();
  return data;
}
