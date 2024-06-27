"use client";
import React, { useContext, useEffect } from "react";
import Notification from "@/app/components/Notification";
export default function SidebarR() {
  return (
    <div className="hidden lg:block h-100% w-80">
      <div className="bg-[#eee] h-32 w-80 border-b-2 py-10 font-bold flex justify-center items-center">
        Notification
      </div>
      <div className="mt-2 h-[calc(95vh-130px)] border-b  border-b-gray-200 flex gap-4 items-center flex-col overflow-y-scroll">
        <Notification />
      </div>
    </div>
  );
}
