"use server";
import { cookies } from "next/headers";
export default async function UpdatePicturesImage({ formData, userId }: any) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/update/PictureImage/${userId}`,
    {
      method: "POST",
      body: formData,
      headers: {
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
