"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import React from "react";

const SearchBar = () => {
  return (
    <div className="flex items-center bg-white rounded-lg shadow-sm p-2">
      <Search className="h-5 w-5 text-gray-400" />
      <input
        type="text"
        placeholder="Search"
        className="flex-grow bg-transparent focus:outline-none ml-2"
      />
      <SlidersHorizontal className="h-5 w-5 text-gray-400" />
    </div>
  );
};

export default SearchBar; 