"use client";

import React from 'react'
import { UserPen, Home, Info, Zap, GraduationCap, BookOpen, Menu, X, CreditCard } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const [credits, setCredits] = React.useState<number>(0);

  // Fetch user credits
  React.useEffect(() => {
    const fetchCredits = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) return;

        const response = await fetch('/api/teach/credits', {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          setCredits(data.credits);
        }
      } catch (error) {
        console.error('Error fetching credits:', error);
      }
    };

    fetchCredits();
  }, []);

  const navItems = [
    { href: '/home', label: 'Home', icon: <Home size={18} /> },
    { href: '/about', label: 'About', icon: <Info size={18} /> },
    { href: '/skills', label: 'Skills', icon: <Zap size={18} /> },
    { href: '/learn', label: 'Learn', icon: <BookOpen size={18} /> },
    { href: '/teach', label: 'Teach', icon: <GraduationCap size={18} /> },
  ];

  return (
    <>
      <nav className="flex justify-between items-center p-4 lg:px-8 bg-white/95 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-purple-100">
        {/* Logo Section */}
        <Link href="/home" className="flex items-center gap-3 group">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 rounded-full blur opacity-30 group-hover:opacity-50 transition-opacity duration-300"></div>
            <Image 
              src="/logo.png" 
              alt="SkillSwap Logo" 
              width={60} 
              height={60} 
              className='relative rounded-full group-hover:scale-110 transition-all duration-300 shadow-lg' 
            />
          </div>
          <div className="hidden sm:block">
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
              SkillSwap
            </h1>
            <p className="text-xs text-gray-500 -mt-1">Learn & Teach</p>
          </div>
        </Link>
        
        {/* Desktop Navigation */}
        <div className='hidden lg:flex items-center gap-2 bg-gradient-to-r from-purple-50 to-blue-50 p-2 rounded-2xl shadow-inner border border-purple-100'>
          {navItems.map((item) => (
            <Link 
              key={item.href}
              href={item.href} 
              className="group flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:shadow-lg hover:scale-105 relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">{item.icon}</span>
              <span className="relative z-10 group-hover:text-white transition-colors duration-300">{item.label}</span>
            </Link>
          ))}
        </div>
        
        {/* Right Section */}
        <div className='flex items-center gap-4'>
          {/* Credits Display */}
          <div className='hidden sm:flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl shadow-md'>
            <CreditCard className="w-4 h-4 text-green-600" />
            <span className="text-sm font-semibold text-green-700">
              {credits} Credits
            </span>
          </div>

          {/* Mobile Menu Button */}
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className='lg:hidden p-3 rounded-xl bg-gradient-to-r from-purple-100 to-blue-100 hover:from-purple-200 hover:to-blue-200 transition-all duration-300 shadow-md hover:shadow-lg'
          >
            {isMobileMenuOpen ? 
              <X className="w-5 h-5 text-purple-600" /> : 
              <Menu className="w-5 h-5 text-purple-600" />
            }
          </button>
          
          {/* Profile Button */}
          <Link href="/profile" className='group flex items-center gap-3 px-6 py-3 rounded-2xl shadow-lg bg-gradient-to-r from-purple-600 via-purple-700 to-blue-600 text-white hover:from-purple-700 hover:via-purple-800 hover:to-blue-700 transition-all duration-300 hover:shadow-xl hover:scale-105 relative overflow-hidden'>
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <UserPen size={20} className="relative z-10 group-hover:rotate-12 transition-transform duration-300"/>
            <span className="hidden sm:inline relative z-10 font-semibold">Profile</span>
          </Link>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      {isMobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)}>
          <div className="absolute top-20 left-4 right-4 bg-white rounded-3xl shadow-2xl border border-purple-100 p-6 animate-in slide-in-from-top duration-300">
            {/* Credits Display for Mobile */}
            <div className='flex items-center justify-center gap-2 px-4 py-3 mb-4 bg-gradient-to-r from-green-100 to-emerald-100 rounded-xl shadow-md'>
              <CreditCard className="w-4 h-4 text-green-600" />
              <span className="text-sm font-semibold text-green-700">
                {credits} Credits
              </span>
            </div>
            
            <div className="flex flex-col gap-2">
              {navItems.map((item) => (
                <Link 
                  key={item.href}
                  href={item.href} 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-4 px-6 py-4 rounded-2xl font-medium text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-purple-600 hover:to-blue-600 transition-all duration-300 hover:shadow-lg group"
                >
                  <span className="group-hover:text-white transition-colors duration-300">{item.icon}</span>
                  <span className="group-hover:text-white transition-colors duration-300">{item.label}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Navbar
