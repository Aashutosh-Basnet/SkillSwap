"use client";
import React from "react";

const categories = ["Macrame", "Sculpture", "Knitting", "Pottery", "Drawing", "Crafts"];

const CategoryFilter = () => {
  return (
    <div className="flex space-x-3 overflow-x-auto pb-2 -mx-4 px-4">
      {categories.map((category, index) => (
        <button
          key={index}
          className={`px-4 py-2 text-sm font-medium rounded-lg whitespace-nowrap ${
            index === 0
              ? "bg-purple-200 text-purple-800"
              : "bg-white text-gray-700"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter; 