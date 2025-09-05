"use client";
import { Clock, Video, Calendar, MessageCircle, Star } from "lucide-react";
import Image from "next/image";
import React from "react";

const meetingHistory = [
  {
    avatar: "https://i.pravatar.cc/150?img=1",
    name: "Anna Taylor",
    skill: "Pottery Basics",
    date: "2024-01-15",
    duration: "45 min",
    type: "video",
    rating: 4.9,
    status: "completed"
  },
  {
    avatar: "https://i.pravatar.cc/150?img=2",
    name: "John Smith",
    skill: "Guitar Lessons",
    date: "2024-01-12",
    duration: "60 min",
    type: "video",
    rating: 4.8,
    status: "completed"
  },
  {
    avatar: "https://i.pravatar.cc/150?img=3",
    name: "Liza Rose",
    skill: "Creative Writing",
    date: "2024-01-10",
    duration: "30 min",
    type: "chat",
    rating: 4.7,
    status: "completed"
  },
  {
    avatar: "https://i.pravatar.cc/150?img=4",
    name: "Mike Johnson",
    skill: "Yoga Session",
    date: "2024-01-08",
    duration: "40 min",
    type: "video",
    rating: 4.6,
    status: "completed"
  },
];

const MeetingHistory = () => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return "Yesterday";
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  return (
    <section>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">Recent Sessions</h2>
          <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">Your learning journey history</p>
        </div>
        <a href="#" className="group px-4 py-2 bg-purple-100 dark:bg-purple-800/30 hover:bg-purple-200 dark:hover:bg-purple-700/50 rounded-full text-sm font-semibold text-purple-600 dark:text-purple-400 transition-all duration-300 hover:scale-105">
          <span className="group-hover:mr-1 transition-all duration-300">View all</span>
          <span className="inline-block group-hover:translate-x-1 transition-transform duration-300">→</span>
        </a>
      </div>
      
      <div className="space-y-3">
        {meetingHistory.map((meeting, index) => (
          <div 
            key={index} 
            className="group relative overflow-hidden p-4 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm rounded-2xl shadow-lg hover:shadow-xl border border-white/30 dark:border-gray-700/30 transition-all duration-300 hover:scale-[1.02] hover:-translate-y-1 cursor-pointer"
            style={{
              animationDelay: `${index * 150}ms`
            }}
          >
            {/* Gradient border effect on hover */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 blur-sm"></div>
            
            <div className="relative flex items-center gap-4">
              <div className="relative">
                <Image
                  src={meeting.avatar}
                  alt={meeting.name}
                  width={56}
                  height={56}
                  className="w-14 h-14 rounded-full object-cover ring-3 ring-purple-200 dark:ring-purple-800/50 group-hover:ring-purple-300 dark:group-hover:ring-purple-600/70 transition-all duration-300"
                />
                
                {/* Meeting type indicator */}
                <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center">
                  {meeting.type === 'video' ? 
                    <Video className="w-3 h-3 text-white" /> : 
                    <MessageCircle className="w-3 h-3 text-white" />
                  }
                </div>
                
                {/* Status badge */}
                <div className="absolute -top-2 -left-2 w-6 h-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full flex items-center justify-center text-xs font-bold text-white shadow-lg">
                  ✓
                </div>
              </div>
              
              <div className="flex-grow">
                <h4 className="font-bold text-gray-800 dark:text-white group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                  {meeting.name}
                </h4>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                  {meeting.skill}
                </p>
                
                {/* Meeting details */}
                <div className="mt-2 flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>{formatDate(meeting.date)}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{meeting.duration}</span>
                  </div>
                </div>
              </div>
              
              <div className="flex flex-col items-end gap-2">
                <div className="flex items-center gap-1 px-3 py-1 bg-yellow-100 dark:bg-yellow-800/30 rounded-full">
                  <Star className="h-4 w-4 text-yellow-500 fill-current" />
                  <span className="text-sm font-bold text-yellow-600 dark:text-yellow-400">{meeting.rating}</span>
                </div>
                
                <button className="px-3 py-1 bg-purple-100 dark:bg-purple-800/50 hover:bg-purple-200 dark:hover:bg-purple-700/70 rounded-full text-xs font-semibold text-purple-600 dark:text-purple-400 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0">
                  Book Again
                </button>
              </div>
            </div>
            
            {/* Hover glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-purple-600/10 to-indigo-600/10 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MeetingHistory; 