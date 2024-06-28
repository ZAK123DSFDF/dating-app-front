import { getAuthData } from "@/app/actions/getAuth";
import Chat from "@/app/components/Chat";
import { redirect } from "next/navigation";
import React from "react";
export const dynamic = "force-dynamic";
export default async function page() {
  const auth = await getAuthData();
  if (!auth.isAuthenticated) {
    redirect("/login");
  }
  return <Chat />;
}
