import { cookies } from "next/headers";

export async function getUsersData() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/auth/search`, {
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Cookie: cookies().toString(),
    },
  });
  if (!res.ok) {
    const errorData = await res.json();
    throw new Error(errorData.message || "failed to fetch all users");
  }
  const data = await res.json();
  return data;
}
