"use client";
import React, { Children, useDeferredValue, useEffect, useState } from "react";
import ChatMessage from "./ChatMessage";
import {
  useParams,
  usePathname,
  useRouter,
  useSearchParams,
} from "next/navigation";
export default function ChatL() {
  const [name, setName] = useState("");
  const router = useRouter();
  const pathName = usePathname();
  const params = useParams();
  const [hasTyped, setHasTyped] = useState<boolean>(false);

  useEffect(() => {
    if (hasTyped) {
      const handle = setTimeout(() => {
        const query = new URLSearchParams();
        if (name) query.set("name", name);
        if (pathName === "/chat") {
          router.push(`/chat?${query.toString()}`);
        } else if (pathName === `/chat/${params.id}`) {
          router.push(`/chat/${params.id}?${query.toString()}`);
        }
      }, 500);
      return () => clearTimeout(handle);
    }
  }, [router, pathName, params.id, name, hasTyped]);
  return (
    <div className="flex-[1] flex flex-col px-2 gap-10 ">
      <div className="flex w-full items-baseline justify-center gap-2 p-2">
        <input
          placeholder="search member..."
          className="rounded-full outline-none px-2 h-8"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setHasTyped(true);
          }}
        />
      </div>
      <div className="flex flex-col h-[calc(95vh-85px)] overflow-y-scroll p-2 gap-2">
        <ChatMessage />
      </div>
    </div>
  );
}
