"use client";
import { Star } from "lucide-react";
import Image from "next/image";
import React from "react";

const authors = [
  {
    avatar: "https://i.pravatar.cc/150?img=1",
    name: "Anna",
    rating: 4.7,
  },
  {
    avatar: "https://i.pravatar.cc/150?img=2",
    name: "John",
    rating: 4.7,
  },
  {
    avatar: "https://i.pravatar.cc/150?img=3",
    name: "Liza",
    rating: 4.7,
  },
  {
    avatar: "https://i.pravatar.cc/150?img=4",
    name: "Mike",
    rating: 4.7,
  },
];

const TopAuthors = () => {
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Top Authors</h2>
        <a href="#" className="text-sm font-semibold text-purple-600">
          See all
        </a>
      </div>
      <div className="flex space-x-4 overflow-x-auto pb-2 -mx-4 px-4">
        {authors.map((author, index) => (
          <div key={index} className="flex-shrink-0 text-center">
            <div className="relative">
              <Image
                src={author.avatar}
                alt={author.name}
                width={80}
                height={80}
                className="w-20 h-20 rounded-full object-cover"
              />
              <div className="absolute bottom-0 right-0 bg-white rounded-full px-1.5 py-0.5 text-xs font-semibold flex items-center">
                <Star className="h-3 w-3 text-yellow-400 fill-current" />
                <span className="ml-1">{author.rating}</span>
              </div>
            </div>
            <p className="mt-2 font-semibold">{author.name}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TopAuthors; 