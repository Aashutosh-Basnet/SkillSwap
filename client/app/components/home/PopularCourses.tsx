"use client"
import React from 'react'
import CourseCard from './CourseCard';

const courses = [
    {
      image: '/images/popular/business.jpg',
      title: 'Business',
      users: '50',
      background: 'bg-purple-400',
    },
    {
      image: '/images/popular/coding.jpg',
      title: 'Coding',
      users: '50',
      background: 'bg-green-400',
    },
    {
      image: '/images/popular/trading.jpg',
      title: 'Trading',
      users: '50',
      background: 'bg-blue-400',
    },
    {
      image: '/images/popular/dancing.jpg',
      title: 'Dancing',
      users: '50',
      background: 'bg-green-400',
    },
    {
      image: '/images/popular/singing.jpg',
      title: 'Singing',
      users: '50',
      background: 'bg-purple-400',
    },
    {
      image: '/images/popular/cooking.jpg',
      title: 'Cooking',
      users: '50',
      background: 'bg-blue-400',
    },
    {
      image: '/images/popular/workout.jpg',
      title: 'Workout',
      users: '50',
      background: 'bg-green-400',
    }
  ];

const PopularCourses = () => {
  return (
    <div>
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Popular SKills</h2>
            <a href="#" className="text-sm font-semibold text-purple-600">See all</a>
        </div>
        <div className="flex overflow-x-auto space-x-4 p-4 no-scrollbar">
            {courses.map((course, index) => (
                <div key={index} className="flex-shrink-0">
                    <CourseCard course={course} />
                </div>
            ))}
        </div>
    </div>
  )
}

export default PopularCourses; 