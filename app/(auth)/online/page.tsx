import React from "react";
import Online from "@/app/components/Online";
import { getAuthData } from "@/app/actions/getAuth";
import { redirect } from "next/navigation";
export const dynamic = "force-dynamic";
export default async function page() {
  const auth = await getAuthData();
  if (!auth.isAuthenticated) {
    redirect("/login");
  }

  return <Online />;
}
