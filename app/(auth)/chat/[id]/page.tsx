import { getAuthData } from "@/app/actions/getAuth";
import Chat from "@/app/components/Chat";

import React from "react";

export default async function page() {
  await getAuthData();

  return <Chat />;
}
