"use client";
import React, { useState } from "react";

const categories = ["All", "Coding", "Cooking", "Music", "Art", "Writing", "Fitness"];

const CategoryFilter = () => {
  const [selectedCategory, setSelectedCategory] = useState("All");

  return (
    <section>
      <div className="mb-4">
        <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-800 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
          Explore Categories
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Discover skills that match your interests</p>
      </div>
      
      <div className="flex space-x-3 overflow-x-auto pb-4 -mx-4 px-4 no-scrollbar">
        {categories.map((category, index) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`relative px-6 py-3 text-sm font-bold rounded-2xl whitespace-nowrap transition-all duration-300 transform hover:scale-105 hover:-translate-y-1 group ${
              selectedCategory === category
                ? "text-white shadow-lg shadow-purple-500/30"
                : "bg-white/70 dark:bg-gray-800/70 backdrop-blur-sm text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-800 border border-gray-200/50 dark:border-gray-600/50 shadow-md"
            }`}
            style={{
              animationDelay: `${index * 100}ms`
            }}
          >
            {selectedCategory === category && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl animate-pulse"></div>
            )}
            
            {selectedCategory === category && (
              <div className="absolute inset-0 bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 rounded-2xl opacity-80"></div>
            )}
            
            <span className="relative z-10">{category}</span>
            
            {selectedCategory === category && (
              <div className="absolute -inset-1 bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl blur-sm opacity-50 group-hover:opacity-75 transition-opacity duration-300"></div>
            )}
            
            {/* Hover sparkle effect */}
            {selectedCategory !== category && (
              <div className="absolute top-1 right-1 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping transition-opacity duration-300"></div>
            )}
          </button>
        ))}
      </div>
    </section>
  );
};

export default CategoryFilter; 