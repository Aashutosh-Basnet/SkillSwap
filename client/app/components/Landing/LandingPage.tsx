"use client";

import Link from 'next/link';
import React from 'react';

// Placeholder data and components
const popularCategories = [
    { name: 'Coding', image: '/images/popular/coding.jpg', icon: '💻' },
    { name: 'Business', image: '/images/popular/business.jpg', icon: '💸' },
    { name: 'Dancing', image: '/images/popular/dancing.jpg', icon: '💃' },
    { name: 'Cooking', image: '/images/popular/cooking.jpg', icon: '👨‍🍳' },
    { name: 'Painting', image: '/images/popular/painting.jpg', icon: '🎨' },
    { name: 'Sculpting', image: '/images/popular/sculpting.jpg', icon: '🗿' },
    { name: 'Trading', image: '/images/popular/trading.jpg', icon: '📈' },
    { name: 'Singing', image: '/images/popular/singing.jpg', icon: '🎤' },
];

const testimonials = [
    {
        name: 'Sarah Johnson',
        role: 'Frontend Developer',
        testimonial: 'SkillSwap transformed my career! I learned React from industry experts and now I\'m building amazing apps. The one-on-one mentorship was game-changing.',
        avatar: `https://i.pravatar.cc/150?u=sarah`,
        rating: 5,
    },
    {
        name: 'Mike Thompson',
        role: 'Professional Guitarist',
        testimonial: 'Teaching guitar through SkillSwap has been incredibly rewarding. I\'ve connected with passionate students worldwide and earned great income doing what I love.',
        avatar: `https://i.pravatar.cc/150?u=mike`,
        rating: 5,
    },
    {
        name: 'Emily Rodriguez',
        role: 'Master Chef',
        testimonial: 'The platform makes sharing culinary knowledge so easy. I found students for my cooking classes within hours and built a thriving teaching business.',
        avatar: `https://i.pravatar.cc/150?u=emily`,
        rating: 5,
    },
];

const communityStats = [
    { value: '50,000+', label: 'Active Learners', icon: '👥' },
    { value: '25,000+', label: 'Skills Exchanged', icon: '🎯' },
    { value: '180+', label: 'Countries', icon: '🌍' },
    { value: '4.9/5', label: 'Average Rating', icon: '⭐' },
];

const features = [
    {
        step: '01',
        title: 'Discover Skills',
        description: 'Browse through thousands of skills taught by verified experts from around the world.',
        icon: '🔍',
        color: 'from-purple-500 to-pink-500'
    },
    {
        step: '02',
        title: 'Connect & Learn',
        description: 'Book personalized sessions with mentors who match your learning style and schedule.',
        icon: '🤝',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        step: '03',
        title: 'Share Your Expertise',
        description: 'Become a mentor and earn by teaching skills you\'re passionate about to eager learners.',
        icon: '🎓',
        color: 'from-green-500 to-emerald-500'
    },
];

const HeroSection = () => (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-black">
        {/* Animated background elements */}
        <div className="absolute inset-0 overflow-hidden">
            <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
            <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            <div className="absolute top-40 left-40 w-80 h-80 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6 text-center">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-6xl md:text-8xl font-bold text-white mb-8 leading-tight">
                    Learn <span className="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">Anything</span>,
                    <br />Teach <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">Everything</span>
                </h1>
                <p className="text-xl md:text-2xl text-gray-300 mb-12 leading-relaxed max-w-3xl mx-auto">
                    Join the world's most vibrant skill-sharing community. Connect with expert mentors, 
                    learn new skills, and share your expertise with passionate learners worldwide.
                </p>
                <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
                    <Link href="/login">
                        <button className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-bold text-lg rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl hover:shadow-purple-500/25">
                            <span className="relative z-10">Start Learning Today</span>
                            <div className="absolute inset-0 bg-gradient-to-r from-purple-700 to-pink-700 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </button>
                    </Link>
                    <button className="group px-8 py-4 border-2 border-white/20 text-white font-bold text-lg rounded-2xl backdrop-blur-sm transition-all duration-300 hover:bg-white/10 hover:border-white/40">
                        <span className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center group-hover:bg-white/30 transition-colors">
                                ▶️
                            </div>
                            Watch Demo
                        </span>
                    </button>
                </div>
            </div>
        </div>
        
        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
            <div className="w-6 h-10 border-2 border-white/30 rounded-full flex justify-center">
                <div className="w-1 h-3 bg-white/50 rounded-full mt-2"></div>
            </div>
        </div>
    </section>
);

const HowItWorksSection = () => (
    <section className="py-24 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-6">
            <div className="text-center mb-20">
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    How It <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Works</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Three simple steps to transform your learning journey and start sharing your expertise with the world.
                </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-12 max-w-6xl mx-auto">
                {features.map((feature, index) => (
                    <div key={feature.step} className="group relative">
                        <div className="text-center">
                            <div className={`inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r ${feature.color} rounded-3xl text-4xl mb-8 transform group-hover:scale-110 transition-transform duration-300 shadow-2xl`}>
                                {feature.icon}
                            </div>
                            <div className="text-6xl font-bold text-gray-200 mb-4">{feature.step}</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                            <p className="text-gray-600 leading-relaxed">{feature.description}</p>
                        </div>
                        
                        {/* Connecting line */}
                        {index < features.length - 1 && (
                            <div className="hidden md:block absolute top-10 left-full w-full h-1 bg-gradient-to-r from-purple-200 to-pink-200 transform translate-y-10 -translate-x-6"></div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const PopularCategoriesSection = () => (
    <section className="py-24 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-6">
            <div className="text-center mb-20">
                <h2 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
                    Popular <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">Categories</span>
                </h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                    Explore trending skills and discover new passions with our diverse range of expert-led categories.
                </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {popularCategories.map((category) => (
                    <div key={category.name} className="group relative overflow-hidden rounded-3xl aspect-square cursor-pointer transform transition-all duration-500 hover:scale-105">
                        <img 
                            src={category.image} 
                            alt={category.name} 
                            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                        <div className="absolute inset-0 bg-gradient-to-t from-purple-600/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        
                        <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                            <div className="text-4xl mb-2">{category.icon}</div>
                            <h3 className="text-xl font-bold mb-1">{category.name}</h3>
                            <p className="text-sm text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                Learn from experts
                            </p>
                        </div>
                        
                        <div className="absolute top-4 right-4 w-8 h-8 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                            <span className="text-white text-sm">→</span>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const TestimonialsSection = () => (
    <section className="py-24 bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 relative overflow-hidden">
        <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-40 h-40 bg-purple-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
            <div className="absolute bottom-20 right-20 w-40 h-40 bg-pink-500 rounded-full mix-blend-multiply filter blur-xl opacity-30"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-6">
            <div className="text-center mb-20">
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                    What Our <span className="bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">Community</span> Says
                </h2>
                <p className="text-xl text-gray-300 max-w-2xl mx-auto">
                    Real stories from learners and teachers who've transformed their lives through SkillSwap.
                </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                {testimonials.map((testimonial, index) => (
                    <div key={testimonial.name} className="group">
                        <div className="bg-white/10 backdrop-blur-md p-8 rounded-3xl border border-white/20 transform transition-all duration-500 hover:bg-white/20 hover:scale-105 hover:shadow-2xl">
                            <div className="flex items-center mb-6">
                                <img 
                                    src={testimonial.avatar} 
                                    alt={testimonial.name} 
                                    className="w-16 h-16 rounded-2xl mr-4 border-2 border-white/30" 
                                />
                                <div>
                                    <h4 className="font-bold text-white text-lg">{testimonial.name}</h4>
                                    <p className="text-gray-300">{testimonial.role}</p>
                                    <div className="flex mt-1">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <span key={i} className="text-yellow-400 text-sm">⭐</span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                            <p className="text-gray-200 leading-relaxed italic">
                                "{testimonial.testimonial}"
                            </p>
                            
                            <div className="absolute -top-4 -left-4 w-8 h-8 text-6xl text-purple-400/30 font-serif">"</div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    </section>
);

const CommunityStatsSection = () => (
    <section className="py-24 bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        
        <div className="relative z-10 container mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-5xl md:text-6xl font-bold text-white mb-6">
                    Join Our Growing <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Community</span>
                </h2>
                <p className="text-xl text-white/90 max-w-2xl mx-auto">
                    Be part of a global movement that's changing how people learn and share knowledge.
                </p>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-5xl mx-auto">
                {communityStats.map((stat, index) => (
                    <div key={stat.label} className="text-center group">
                        <div className="mb-4">
                            <div className="text-6xl mb-2">{stat.icon}</div>
                            <div className="text-5xl md:text-6xl font-bold text-white mb-2 group-hover:scale-110 transition-transform duration-300">
                                {stat.value}
                            </div>
                            <p className="text-lg text-white/80 font-medium">{stat.label}</p>
                        </div>
                    </div>
                ))}
            </div>
            
            {/* <div className="text-center mt-16">
                <Link href="/login">
                    <button className="px-10 py-4 bg-white text-purple-600 font-bold text-xl rounded-2xl transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
                        Join the Revolution
                    </button>
                </Link>
            </div> */}
        </div>
    </section>
);

const LandingPageFooter = () => (
    <footer className="bg-gray-900 text-white py-16 relative">
        <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
                <div className="col-span-2">
                    <div className="flex items-center mb-6">
                        <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mr-4">
                            <span className="font-bold text-xl">S</span>
                        </div>
                        <span className="text-2xl font-bold">SkillSwap</span>
                    </div>
                    <p className="text-gray-400 leading-relaxed max-w-md">
                        Empowering learners and teachers worldwide to share knowledge, 
                        build communities, and transform lives through skill exchange.
                    </p>
                </div>
                
                <div>
                    <h3 className="font-bold text-lg mb-4">Quick Links</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">How it Works</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Categories</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Become a Teacher</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Success Stories</a></li>
                    </ul>
                </div>
                
                <div>
                    <h3 className="font-bold text-lg mb-4">Support</h3>
                    <ul className="space-y-2 text-gray-400">
                        <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Contact Us</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
                        <li><a href="#" className="hover:text-white transition-colors">Terms of Service</a></li>
                    </ul>
                </div>
            </div>
            
            <div className="border-t border-gray-800 pt-8 text-center text-gray-400">
                <p>&copy; {new Date().getFullYear()} SkillSwap. All rights reserved. Made with ❤️ for learners worldwide.</p>
            </div>
        </div>
    </footer>
);

export default function LandingPage() {
    return (
        <div className="bg-white overflow-hidden">
            <style jsx>{`
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
            
            <main>
                <HeroSection />
                <HowItWorksSection />
                <PopularCategoriesSection />
                <TestimonialsSection />
                <CommunityStatsSection />
            </main>
            <LandingPageFooter />
        </div>
    );
}