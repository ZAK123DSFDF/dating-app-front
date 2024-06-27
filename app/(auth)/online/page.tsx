import React from "react";
import Online from "@/app/components/Online";
import { getAuthData } from "@/app/actions/getAuth";
export default async function page() {
  await getAuthData();

  return <Online />;
}
