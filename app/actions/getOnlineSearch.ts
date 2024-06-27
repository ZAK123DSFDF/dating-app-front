"use server";
import { cookies } from "next/headers";
export async function getSearchOnlineData(
  ageMin?: number,
  ageMax?: number,
  name?: string | null
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/searchOnline?ageMin=${
      ageMin ? ageMin : ""
    }&&ageMax=${ageMax ? ageMax : ""}&&name=${name ? name : ""}`,
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
    throw new Error(errorData.message || "failed to fetch search");
  }
  const data = await res.json();
  return data;
}
