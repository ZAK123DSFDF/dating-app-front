import { getAuthData } from "@/app/actions/getAuth";
import { getProfileData } from "@/app/actions/getProfile";
import Profile from "@/app/components/Profile";
import React from "react";
export const dynamic = "force-dynamic";
export default async function page() {
  await getAuthData();
  const profile = await getProfileData();
  console.log(profile);
  return <Profile />;
}
