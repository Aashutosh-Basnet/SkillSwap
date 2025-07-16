"use client";
import { Heart, Star } from "lucide-react";
import Image from "next/image";
import React from "react";

interface Course {
  image: string;
  title: string;
  users: string;
  background: string;
}

const CourseCard = ({ course }: { course: Course }) => {
  return (
    <div className={`${course.background} rounded-xl shadow-md flex`}>
      <Image
        src={course.image}
        alt={course.title}
        width={600}
        height={520}
        className="w-full h-32 rounded-3xl object-cover p-3"
      />
      <div className="p-5 min-w-[180px]">
        <h3 className="text-white font-bold mt-2 text-xl md:text-2xl">{course.title}</h3>
        <p className="text-gray-500 text-md md:text-lg">{course.users} users</p>
      </div>
    </div>
  );
};

export default CourseCard;
