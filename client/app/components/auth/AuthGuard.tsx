"use client";

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import authService from '@/lib/auth';

const AuthGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const isAuthenticated = authService.isAuthenticated();
    // Allow access to landing page (/), login, and register without authentication
    const publicPaths = ['/', '/login', '/register'];
    
    if (!isAuthenticated && !publicPaths.includes(pathname)) {
      router.push('/login');
    } else {
      setIsAuth(true);
    }
  }, [router, pathname]);

  // Allow access to public paths without authentication
  const publicPaths = ['/', '/login', '/register'];
  if (!isAuth && !publicPaths.includes(pathname)) {
    return null; // or a loading spinner
  }

  return <>{children}</>;
};

export default AuthGuard; 