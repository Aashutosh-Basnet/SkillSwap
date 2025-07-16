import React from 'react'
import { UserPen } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="hidden lg:flex justify-between items-center p-4">
        <div className="text-2xl font-bold text-purple-600 shadow-md p-3 rounded-3xl">SkillSwap</div>
        <div className='flex gap-12 bg-purple-300 p-4 px-12 rounded-full shadow-md sticky'>
            <a href="#" className="mr-4 ">home</a>
            <a href="#" className="mr-4">popular</a>
            <a href="#" className="mr-4">explore</a>
            <a href="#" className="mr-4">skills</a>
        </div>
        <div className='mx-5'>
          <a href="" className='flex items-center gap-2 p-3 rounded-full shadow-md bg-black text-white' ><UserPen size={20}/>profile</a>
        </div>
    </nav>
  )
}

export default Navbar
