"use client";
import { Bell, User } from "lucide-react";
import Image from "next/image";
import React, { useState, useEffect } from "react";
import authService from "@/lib/auth";

interface UserProfile {
  username: string;
  fullname: string;
  avatar?: string;
}

const Header = () => {
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadUserProfile = async () => {
      try {
        if (!authService.isAuthenticated()) {
          setLoading(false);
          return;
        }

        const response = await authService.makeAuthenticatedRequest('/user/profile');
        const data = await response.json();

        if (response.ok) {
          setUserProfile({
            username: data.user.username,
            fullname: data.user.fullname,
            avatar: data.user.avatar
          });
        } else {
          console.error('Failed to load profile:', data.message);
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserProfile();
  }, []);

  if (loading) {
    return <HeaderSkeleton />;
  }

  const displayName = userProfile?.fullname || userProfile?.username || "Guest";

  return (
    <header className="flex justify-between items-center">
      <div className="flex items-center gap-5">
        {userProfile?.avatar ? (
          <div className="relative">
            <Image
              src={userProfile.avatar}
              alt="User Avatar"
              width={56}
              height={56}
              className="w-14 h-14 rounded-full object-cover border-3 border-gradient-to-r from-purple-500 to-indigo-500 shadow-lg ring-4 ring-purple-100 dark:ring-purple-800/30"
            />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
          </div>
        ) : (
          <div className="relative">
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-600 to-indigo-600 flex items-center justify-center text-white shadow-lg ring-4 ring-purple-100 dark:ring-purple-800/30">
              <User size={28} />
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
          </div>
        )}
        <div>
          <p className="text-sm font-medium text-purple-600 dark:text-purple-400 bg-purple-100/50 dark:bg-purple-800/30 px-3 py-1 rounded-full">Welcome back,</p>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mt-2">{displayName}</h1>
        </div>
      </div>
      <button className="relative p-3 rounded-2xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-700 shadow-lg hover:shadow-xl border border-gray-200/50 dark:border-gray-600/50 hover:scale-105 transition-all duration-300 group">
        <Bell className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors" />
        <span className="absolute -top-1 -right-1 h-4 w-4 bg-gradient-to-r from-red-500 to-pink-500 rounded-full border-2 border-white dark:border-gray-800 shadow-sm animate-bounce">
          <span className="block h-full w-full bg-red-400 rounded-full animate-ping absolute"></span>
        </span>
        <div className="absolute inset-0 rounded-2xl bg-purple-500 opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
      </button>
    </header>
  );
};

const HeaderSkeleton = () => (
  <header className="flex justify-between items-center animate-pulse">
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full bg-gray-300 dark:bg-gray-700"></div>
      <div>
        <div className="h-4 w-24 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="h-7 w-32 bg-gray-300 dark:bg-gray-700 rounded mt-2"></div>
      </div>
    </div>
    <div className="w-10 h-10 rounded-full bg-gray-300 dark:bg-gray-700"></div>
  </header>
);

export default Header; 