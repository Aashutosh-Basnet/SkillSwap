import React from 'react'

const Footer = () => {
  return (
    <footer className="hidden lg:block bg-gray-800 text-white p-8 mt-8">
        <div className="container mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
                <h3 className="font-bold text-lg mb-2">SkillSwap</h3>
                <p>Learn, share, and grow your skills with a vibrant community.</p>
            </div>
            <div>
                <h3 className="font-bold text-lg mb-2">Links</h3>
                <ul>
                    <li><a href="#" className="hover:underline">About Us</a></li>
                    <li><a href="#" className="hover:underline">Contact</a></li>
                    <li><a href="#" className="hover:underline">FAQ</a></li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold text-lg mb-2">Follow Us</h3>
                <div className="flex space-x-4">
                    <a href="#" className="hover:text-purple-400">Facebook</a>
                    <a href="#" className="hover:text-purple-400">Twitter</a>
                    <a href="#" className="hover:text-purple-400">Instagram</a>
                </div>
            </div>
        </div>
        <div className="text-center mt-8 pt-4 border-t border-gray-700">
            © 2024 SkillSwap. All rights reserved.
        </div>
    </footer>
  )
}

export default Footer
