import { getAuthData } from "@/app/actions/getAuth";
import Login from "@/app/components/Login";
import { redirect } from "next/navigation";
import React from "react";

export default async function page() {
  const auth = await getAuthData();
  if (auth.isAuthenticated) {
    redirect("/chat");
  }
  return (
    <>
      <Login />
    </>
  );
}
