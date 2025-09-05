"use client";
import { Users } from 'lucide-react';
import Image from 'next/image';
import React from 'react';

type Course = {
    image: string;
    title: string;
    users: string;
};

interface CourseCardProps {
    course: Course;
}

const CourseCard = ({ course }: CourseCardProps) => {
    return (
        <div className="relative group cursor-pointer">
            {/* Gradient border effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
            
            <div className="relative bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20 dark:border-gray-700/20 group-hover:scale-[1.02] group-hover:-translate-y-1">
                <div className="relative h-48 overflow-hidden">
                    <Image
                        src={course.image}
                        alt={course.title}
                        layout="fill"
                        objectFit="cover"
                        className="group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent group-hover:from-black/70 transition-all duration-500"></div>
                    
                    {/* Floating badge */}
                    <div className="absolute top-4 right-4 bg-white/90 dark:bg-gray-800/90 backdrop-blur-sm rounded-full px-3 py-1 shadow-lg">
                        <span className="text-xs font-semibold text-purple-600 dark:text-purple-400">Popular</span>
                    </div>
                    
                    {/* Animated shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                </div>
                
                <div className="p-6">
                    <h3 className="text-xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent mb-3">{course.title}</h3>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                            <div className="p-1.5 bg-purple-100 dark:bg-purple-800/50 rounded-full mr-2">
                                <Users className="h-3 w-3 text-purple-600 dark:text-purple-400" />
                            </div>
                            <span className="font-medium">{course.users}+ learners</span>
                        </div>
                        <div className="flex items-center space-x-1">
                            {[...Array(5)].map((_, i) => (
                                <div key={i} className="w-1.5 h-1.5 bg-purple-400 rounded-full opacity-60"></div>
                            ))}
                        </div>
                    </div>
                </div>
                
                {/* Hover overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-purple-600/10 to-indigo-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-3xl"></div>
            </div>
        </div>
    );
};

export default CourseCard;
