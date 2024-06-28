import { getAuthData } from "@/app/actions/getAuth";
import { getProfileData } from "@/app/actions/getProfile";
import Profile from "@/app/components/Profile";
import { redirect } from "next/navigation";
import React from "react";
export const dynamic = "force-dynamic";
export default async function page() {
  const auth = await getAuthData();
  if (!auth.isAuthenticated) {
    redirect("/login");
  }
  return <Profile />;
}
