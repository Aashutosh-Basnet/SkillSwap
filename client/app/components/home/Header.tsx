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
    return (
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
          <div className="ml-3">
            <div className="h-5 w-24 bg-gray-300 animate-pulse rounded"></div>
          </div>
        </div>
        <div className="relative">
          <Bell className="h-6 w-6" />
          <span className="absolute top-0 right-0 h-2 w-2 bg-red-500 rounded-full"></span>
        </div>
      </div>
    );
  }

  const displayName = userProfile?.fullname || userProfile?.username || "Guest";

  return (
    <div className="flex justify-between items-center">
      <div className="flex items-center">
        {userProfile?.avatar ? (
          <Image
            src={userProfile.avatar}
            alt="User Avatar"
            width={40}
            height={40}
            className="w-10 h-10 rounded-full object-cover border-2 border-purple-300"
          />
        ) : (
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
            <User size={20} className="text-white" />
          </div>
        )}
        <div className="ml-3">
          <p className="text-lg font-semibold">Hello, {displayName}</p>
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