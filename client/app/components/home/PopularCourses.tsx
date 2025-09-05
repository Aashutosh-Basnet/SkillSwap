"use client"
import React from 'react'
import CourseCard from './CourseCard';

const courses = [
    {
      image: '/images/popular/business.jpg',
      title: 'Business',
      users: '50',
    },
    {
      image: '/images/popular/coding.jpg',
      title: 'Coding',
      users: '50',
    },
    {
      image: '/images/popular/trading.jpg',
      title: 'Trading',
      users: '50',
    },
    {
      image: '/images/popular/dancing.jpg',
      title: 'Dancing',
      users: '50',
    },
    {
      image: '/images/popular/singing.jpg',
      title: 'Singing',
      users: '50',
    },
    {
      image: '/images/popular/cooking.jpg',
      title: 'Cooking',
      users: '50',
    },
    {
      image: '/images/popular/workout.jpg',
      title: 'Workout',
      users: '50',
    }
  ];

const PopularCourses = () => {
  return (
    <section>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Popular Skills</h2>
            <a href="#" className="text-sm font-semibold text-purple-600 hover:underline">See all</a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {courses.slice(0, 6).map((course, index) => (
                <CourseCard key={index} course={course} />
            ))}
        </div>
    </section>
  )
}

export default PopularCourses; 