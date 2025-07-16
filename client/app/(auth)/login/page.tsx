"use client";

import React from "react";
import SidePanel from "@/app/components/auth/SidePanel";
import LoginForm from "@/app/components/auth/LoginForm";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen bg-gray-900">
      <div className="hidden lg:flex lg:w-1/2">
        <SidePanel 
          title="Welcome Back"
          description={"Sign in to your account and continue\nyour journey with SkillSwap."}
          isLogin={true}
        />
      </div>
      
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <LoginForm />
      </div>
    </div>
  );
}
