"use client";
import { ArrowRight } from "lucide-react";
import React from "react";

const FeaturedEvent = () => {
  return (
    <section className="relative overflow-hidden group cursor-pointer">
      {/* Animated background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-600 rounded-3xl transition-all duration-500 group-hover:scale-105"></div>
      
      {/* Animated overlay patterns */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full animate-pulse"></div>
        <div className="absolute bottom-8 left-6 w-12 h-12 bg-yellow-300 rounded-full animate-bounce" style={{animationDelay: '1s'}}></div>
        <div className="absolute top-1/2 left-8 w-6 h-6 bg-pink-300 rounded-full animate-ping" style={{animationDelay: '2s'}}></div>
      </div>
      
      {/* Shine effect */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
      
      <div className="relative backdrop-blur-sm bg-white/10 rounded-3xl p-8 text-white shadow-2xl border border-white/20 flex flex-col justify-between h-full min-h-[320px]">
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-white/20 backdrop-blur-sm rounded-full text-xs font-semibold border border-white/30">Featured Skill</span>
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
            </div>
          </div>
          
          <h3 className="font-bold text-3xl leading-tight bg-gradient-to-r from-white to-purple-100 bg-clip-text text-transparent">
            Learn Python for Beginners
          </h3>
          
          <p className="text-purple-100 leading-relaxed">
            Join our AI-powered interactive session to kickstart your programming journey with hands-on projects and personalized guidance.
          </p>
          
          <div className="flex items-center gap-4 text-sm">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-400 rounded-full"></div>
              <span className="text-green-200">Live Session</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
              <span className="text-blue-200">AI-Powered</span>
            </div>
          </div>
        </div>
        
        <button className="mt-8 flex items-center justify-center gap-3 w-full bg-white/90 backdrop-blur-sm text-purple-700 font-bold py-4 rounded-2xl hover:bg-white hover:scale-105 transition-all duration-300 shadow-xl border border-white/30 group-hover:shadow-2xl">
          <span>Start Learning Journey</span>
          <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-300" />
        </button>
      </div>
    </section>
  );
};

export default FeaturedEvent; 