import { getAuthData } from "@/app/actions/getAuth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const auth = await getAuthData();
  if (auth.isAuthenticated) {
    redirect("/chat");
  }
  return (
    <div className="h-screen w-screen flex flex-col gap-3 items-center justify-center">
      <h1 className="font-bold">checkout successful</h1>
      <Link href="/chat" className="bg-blue-400 p-3 rounded-md text-white">
        go to chat page
      </Link>
    </div>
  );
}
