"use client";

import SearchHeader from "./SearchHeader";
import SearchCard from "./SearchCard";

export default function Search() {
  return (
    <>
      <div className="flex flex-col w-[calc(100%-20rem-1rem)] p-8 border-r-2 gap-2 ">
        <SearchHeader />
        <div className="flex justify-start items-start flex-wrap  gap-4 h-[calc(105vh-200px)] overflow-y-scroll">
          <SearchCard />
        </div>
      </div>
    </>
  );
}
