import React from 'react'
import { UserPen } from 'lucide-react';
import Image from 'next/image';

const Navbar = () => {
  return (
    <nav className="hidden lg:flex justify-between items-center p-4">
        <Image src="/logo.png" alt="logo" width={100} height={100} className='rounded-full' />
        <div className='flex gap-12 bg-purple-300 p-4 px-12 rounded-full shadow-md sticky'>
            <a href="#" className="mr-4 ">home</a>
            <a href="#" className="mr-4">popular</a>
            <a href="#" className="mr-4">explore</a>
            <a href="#" className="mr-4">skills</a>
        </div>
        <div className='mx-5'>
          <a href="/profile" className='flex items-center gap-2 p-3 rounded-full shadow-md bg-black text-white' ><UserPen size={20}/>profile</a>
        </div>
    </nav>
  )
}

export default Navbar
