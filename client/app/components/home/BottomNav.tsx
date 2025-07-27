"use client";
import { Home, LayoutGrid, User, Video, Heart } from "lucide-react";
import React from "react";

const navItems = [
  { icon: Home, label: "Home", active: true, href: "/home" },
  { icon: LayoutGrid, label: "Skills", active: false, href: "/browse" },
  { icon: Video, label: "Explore", active: false, href: "/explore" },
  { icon: Heart, label: "History", active: false, href: "/requests" },
  { icon: User, label: "Profile", active: false, href: "/profile" },
];

const BottomNav = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 flex justify-around items-center p-2 lg:hidden z-50">
      {navItems.map((item, index) => (
        <a
          href={item.href}
          key={index}
          className={`flex flex-col items-center justify-center text-xs ${
            item.active ? "text-purple-600" : "text-gray-500"
          }`}
        >
          <item.icon className="h-6 w-6 mb-1" />
          <span>{item.label}</span>
        </a>
      ))}
    </div>
  );
};

export default BottomNav; 