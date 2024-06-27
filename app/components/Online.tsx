"use client";
import React, { useEffect } from "react";
import OnlineProfile from "./OnlineProfile";
import SearchHeader from "./SearchHeader";

export default function Online() {
  return (
    <>
      <div className="flex flex-col w-[calc(100%-20rem-1rem)] p-8 border-r-2 gap-10">
        <SearchHeader />
        <div className="flex flex-col gap-4 overflow-y-scroll h-[calc(100vh-200px)]  ">
          <OnlineProfile />
        </div>
      </div>
    </>
  );
}
