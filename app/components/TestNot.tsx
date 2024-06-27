"use client";
import { useQuery } from "@tanstack/react-query";
import React, { useEffect } from "react";
import { getNotificationData } from "../actions/getNotification";

export default function TestNot() {
  const {
    data: notification,
    isPending,
    isError,
    error,
  } = useQuery({
    queryKey: ["notification"],
    queryFn: () => getNotificationData(),
  });
  useEffect(() => {
    console.log("this is notification from testNot", notification);
  });
  return <div></div>;
}
