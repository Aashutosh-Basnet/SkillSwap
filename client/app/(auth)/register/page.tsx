"use client";

import React from "react";
import SidePanel from "@/app/components/auth/SidePanel";
import RegisterForm from "@/app/components/auth/RegisterForm";

export default function RegisterPage() {
  return (
    <div className="flex min-h-screen bg-gray-900">
      {/* Left side - SidePanel */}
      <div className="hidden lg:flex lg:w-1/2">
        <SidePanel />
      </div>
      
      {/* Right side - RegisterForm */}
      <div className="w-full lg:w-1/2 flex items-center justify-center">
        <RegisterForm />
      </div>
    </div>
  );
}