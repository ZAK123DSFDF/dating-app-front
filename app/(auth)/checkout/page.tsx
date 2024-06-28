import { getAuthData } from "@/app/actions/getAuth";
import Checkout from "@/app/components/Checkout";
import React from "react";
export const dynamic = "force-dynamic";
export default async function page() {
  await getAuthData();

  return <Checkout />;
}
