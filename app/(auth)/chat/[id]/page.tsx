import { getAuthData } from "@/app/actions/getAuth";
import Chat from "@/app/components/Chat";

import React from "react";
export const dynamic = "force-dynamic";
export default async function page() {
  // await getAuthData();

  return <Chat />;
}
