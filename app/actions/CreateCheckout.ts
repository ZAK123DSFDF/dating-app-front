"use server";
import { cookies } from "next/headers";

export default async function CreateCheckOut() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/stripe/create-checkout`,
    {
      method: "POST",
      headers: {
        Cookie: cookies().toString(),
      },
    }
  );
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "checkout failed");
  }

  const data = await response.json();
  return data;
}
