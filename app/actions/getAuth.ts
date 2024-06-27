"use server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
export async function getAuthData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/check`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().toString(),
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    redirect("/login");
  }
  const data = await res.json();
  console.log(data);
  return data;
}
