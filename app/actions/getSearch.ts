"use server";
import { cookies } from "next/headers";
export async function getSearchData(
  name?: string,
  ageMin?: number,
  ageMax?: number
) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/auth/search?name=${
      name ? name : ""
    }&&ageMin=${ageMin ? +ageMin : ""}&&ageMax=${ageMax ? +ageMax : ""}`,
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
