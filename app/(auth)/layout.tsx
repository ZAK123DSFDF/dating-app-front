import React from "react";
import SidebarL from "../components/SidebarL";
import SidebarR from "../components/SidebarR";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex justify-between">
      <SidebarL />
      {children}
      <SidebarR />
    </div>
  );
}
