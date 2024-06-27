import { usePathname, useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";

export default function SearchHeader() {
  const generateAges = () => {
    const ages = [];
    for (let age = 18; age <= 80; age++) {
      ages.push(age);
    }
    return ages;
  };

  const ages = generateAges();
  const router = useRouter();
  const pathName = usePathname();
  const [name, setName] = useState("");
  const [ageFrom, setAgeFrom] = useState("");
  const [ageTo, setAgeTo] = useState("");
  const [hasTyped, setHasTyped] = useState(false); // Track if user has typed anything

  useEffect(() => {
    if (hasTyped) {
      const handle = setTimeout(() => {
        const query = new URLSearchParams();

        if (ageFrom) query.set("ageMin", ageFrom);
        if (ageTo) query.set("ageMax", ageTo);
        if (name) query.set("name", name);
        if (pathName === "/online") {
          router.push(`/online?${query.toString()}`);
        } else if (pathName === "/search") {
          router.push(`/search?${query.toString()}`);
        }
      }, 500);

      return () => clearTimeout(handle);
    }
  }, [name, ageFrom, ageTo, hasTyped, router, pathName]);

  return (
    <div className="flex justify-between border-b-2 p-2">
      <div className="flex gap-2 h-[max-content]">
        <h1 className="font-medium self-center">Member Age</h1>
        <select
          className="h-10 w-24 rounded-lg outline-none"
          value={ageFrom}
          onChange={(e) => {
            setAgeFrom(e.target.value);
            setHasTyped(true);
          }}
        >
          <option value="">from</option>
          {ages.map((age) => (
            <option key={age} value={age} className="h-10">
              {age}
            </option>
          ))}
        </select>
        <select
          className="h-10 w-24 rounded-lg outline-none"
          value={ageTo}
          onChange={(e) => {
            setAgeTo(e.target.value);
            setHasTyped(true);
          }}
        >
          <option value="">to</option>
          {ages.map((age) => (
            <option key={age} value={age}>
              {age}
            </option>
          ))}
        </select>
      </div>
      <div>
        <input
          placeholder="Search name"
          className="p-2 rounded-lg outline-none"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
            setHasTyped(true);
          }}
        />
      </div>
    </div>
  );
}
