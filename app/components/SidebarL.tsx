"use client";
import React, { useEffect, useState } from "react";
import { IoIosChatbubbles } from "react-icons/io";
import { HiStatusOnline } from "react-icons/hi";
import { CgProfile } from "react-icons/cg";
import { FaSearch } from "react-icons/fa";
import { BiLogOut } from "react-icons/bi"; // import logout icon
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useMutation } from "@tanstack/react-query";
import { getUsersDataLogOut } from "@/app/actions/getLogout";

const buttons = [
  { icon: <IoIosChatbubbles />, label: "Chat", route: "/chat" },
  { icon: <HiStatusOnline />, label: "Online", route: "/online" },
  { icon: <CgProfile />, label: "Profile", route: "/profile" },
  { icon: <FaSearch />, label: "Search", route: "/search" },
  { icon: <BiLogOut />, label: "Logout", route: "/logout" }, // Add logout button here
];

export default function SidebarL() {
  const router = useRouter();
  const pathname = usePathname();
  const [activeButton, setActiveButton] = useState<number | null>(null);
  const { mutateAsync } = useMutation({
    mutationFn: getUsersDataLogOut,
    onSuccess: () => {
      // Delete userId from localStorage
      localStorage.removeItem("userId");
      // Navigate to the login page
      window.location.href = "/login";
    },
    onError: (error) => {
      console.error("Error logging out:", error);
    },
  });

  useEffect(() => {
    const currentButtonIndex = buttons.findIndex(
      (button) => button.route === pathname
    );
    if (currentButtonIndex !== -1) {
      setActiveButton(currentButtonIndex);
    }
  }, [pathname]);

  const handleClick = (index: any) => {
    setActiveButton(index);
  };

  const handleLogoutClick = async () => {
    await mutateAsync();
  };

  return (
    <>
      <div className="hidden lg:block h-screen min-w-60 drop-shadow-lg bg-[#F9F9F9]">
        <h1 className="text-4xl font-extrabold">logo here</h1>
        <div className="flex flex-col gap-4 mt-4 text-gray-900 font-medium">
          {buttons.map((button, index) => {
            const isLogoutButton = button.label === "Logout";
            return isLogoutButton ? (
              <div
                key={index}
                className={`flex  text-2xl gap-2 p-5 cursor-pointer  ${
                  activeButton === index
                    ? "text-white bg-blue-500"
                    : "hover:bg-gray-100"
                }`}
                onClick={handleLogoutClick}
              >
                {button.icon}
                <h1>{button.label}</h1>
              </div>
            ) : (
              <Link
                className={`flex  text-2xl gap-2 p-5 cursor-pointer  ${
                  activeButton === index
                    ? "text-white bg-blue-500"
                    : "hover:bg-gray-100"
                }`}
                key={index}
                href={button.route}
                onClick={() => handleClick(index)}
              >
                {button.icon}
                <h1>{button.label}</h1>
              </Link>
            );
          })}
        </div>
      </div>
    </>
  );
}
