"use client";
import { Search, SlidersHorizontal } from "lucide-react";
import React from "react";

const SearchBar = () => {
  return (
    <div className="relative group">
      <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-xl"></div>
      <div className="relative backdrop-blur-sm bg-white/70 dark:bg-gray-800/70 rounded-full border border-white/30 dark:border-gray-600/30 shadow-xl hover:shadow-2xl transition-all duration-300">
        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-purple-500 dark:text-purple-400" />
        </div>
        <input
          type="text"
          placeholder="Search for skills, tutors, courses..."
          className="w-full pl-14 pr-16 py-4 bg-transparent border-0 rounded-full focus:outline-none placeholder-gray-500 dark:placeholder-gray-400 text-gray-800 dark:text-white font-medium"
        />
        <button className="absolute inset-y-0 right-0 pr-5 flex items-center group">
          <div className="p-2 rounded-full bg-purple-100 dark:bg-purple-800/50 hover:bg-purple-200 dark:hover:bg-purple-700/50 transition-all duration-300 hover:scale-110">
            <SlidersHorizontal className="h-4 w-4 text-purple-600 dark:text-purple-400" />
          </div>
        </button>
      </div>
      
      {/* Floating particles effect */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden rounded-full">
        <div className="absolute top-2 left-8 w-1 h-1 bg-purple-400 rounded-full animate-ping"></div>
        <div className="absolute top-4 right-12 w-1 h-1 bg-indigo-400 rounded-full animate-ping" style={{animationDelay: '1s'}}></div>
        <div className="absolute bottom-3 left-20 w-1 h-1 bg-pink-400 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
      </div>
    </div>
  );
};

export default SearchBar; 