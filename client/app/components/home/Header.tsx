"use client";
import { Bell } from "lucide-react";
import Image from "next/image";
import React from "react";

const Header = () => {
  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        <Image
          src="https://i.pravatar.cc/40"
          alt="User"
          width={40}
          height={40}
          className="w-10 h-10 rounded-full"
        />
        <div className="ml-3">
          <p className="text-lg font-semibold">Hello, Anna</p>
        </div>
      </div>
      <div className="relative">
        <Bell className="h-6 w-6" />
        <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
      </div>
    </div>
  );
};

export default Header; 