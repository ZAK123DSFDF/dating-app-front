import { getAuthData } from "@/app/actions/getAuth";
import Checkout from "@/app/components/Checkout";
import React from "react";

export default async function page() {
  await getAuthData();

  return <Checkout />;
}
