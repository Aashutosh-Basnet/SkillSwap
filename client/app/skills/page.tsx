import React from 'react';
import { Star, TrendingUp, Award, Code, Music, ChefHat, Palette, Languages, Wrench, Camera, BookOpen, Dumbbell, Gamepad2, Heart } from 'lucide-react';

const SkillsPage = () => {
  const recommendedSkills = [
    { 
      name: 'React Development', 
      description: 'Build modern web applications with React and TypeScript',
      icon: <Code className="w-6 h-6" />,
      students: '2.4k',
      rating: 4.9,
      level: 'Intermediate',
      timeToComplete: '6 weeks',
      gradient: 'from-blue-500 to-cyan-500',
      bgColor: 'bg-blue-50',
      iconColor: 'text-blue-600'
    },
    { 
      name: 'Guitar Basics', 
      description: 'Learn to play your favorite songs on acoustic guitar',
      icon: <Music className="w-6 h-6" />,
      students: '1.8k',
      rating: 4.8,
      level: 'Beginner',
      timeToComplete: '4 weeks',
      gradient: 'from-purple-500 to-pink-500',
      bgColor: 'bg-purple-50',
      iconColor: 'text-purple-600'
    },
    { 
      name: 'Italian Cooking', 
      description: 'Master authentic Italian recipes and techniques',
      icon: <ChefHat className="w-6 h-6" />,
      students: '1.2k',
      rating: 4.7,
      level: 'Beginner',
      timeToComplete: '5 weeks',
      gradient: 'from-orange-500 to-red-500',
      bgColor: 'bg-orange-50',
      iconColor: 'text-orange-600'
    },
    { 
      name: 'UI/UX Design', 
      description: 'Create beautiful and user-friendly digital experiences',
      icon: <Palette className="w-6 h-6" />,
      students: '3.1k',
      rating: 4.9,
      level: 'Intermediate',
      timeToComplete: '8 weeks',
      gradient: 'from-green-500 to-teal-500',
      bgColor: 'bg-green-50',
      iconColor: 'text-green-600'
    }
  ];

  const featuredSkills = [
    { 
      name: 'Machine Learning', 
      description: 'Dive into AI and machine learning with Python',
      icon: <Code className="w-6 h-6" />,
      badge: 'New',
      color: 'bg-gradient-to-r from-blue-500 to-purple-600'
    },
    { 
      name: 'Photography', 
      description: 'Capture stunning photos with professional techniques',
      icon: <Camera className="w-6 h-6" />,
      badge: 'Featured',
      color: 'bg-gradient-to-r from-pink-500 to-orange-500'
    },
    { 
      name: 'Spanish Language', 
      description: 'Become conversational in Spanish with native speakers',
      icon: <Languages className="w-6 h-6" />,
      badge: 'Popular',
      color: 'bg-gradient-to-r from-green-500 to-teal-600'
    }
  ];

  const popularSkills = [
    { name: 'JavaScript', icon: <Code className="w-5 h-5" />, learners: '5.2k' },
    { name: 'Piano', icon: <Music className="w-5 h-5" />, learners: '3.8k' },
    { name: 'Graphic Design', icon: <Palette className="w-5 h-5" />, learners: '4.1k' },
    { name: 'French', icon: <Languages className="w-5 h-5" />, learners: '2.9k' },
    { name: 'Cooking', icon: <ChefHat className="w-5 h-5" />, learners: '3.5k' },
    { name: 'Woodworking', icon: <Wrench className="w-5 h-5" />, learners: '1.7k' },
    { name: 'Writing', icon: <BookOpen className="w-5 h-5" />, learners: '2.3k' },
    { name: 'Fitness', icon: <Dumbbell className="w-5 h-5" />, learners: '4.6k' },
    { name: 'Game Development', icon: <Gamepad2 className="w-5 h-5" />, learners: '2.1k' },
    { name: 'Meditation', icon: <Heart className="w-5 h-5" />, learners: '1.9k' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-6">
            Explore Skills
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover amazing skills to learn from our community of passionate teachers and learners
          </p>
        </div>

        {/* Recommended Skills Section */}
        <div className="mb-16">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <div className="p-2 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-xl mr-3">
                <Star className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-4xl font-bold text-gray-800">Recommended for You</h2>
                <p className="text-gray-600 mt-1">Personalized picks based on your interests</p>
              </div>
            </div>
            <button className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center transition-colors duration-300">
              View All Recommendations
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {recommendedSkills.map((skill, index) => (
              <div key={index} className="group relative bg-white rounded-3xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-3 border border-gray-100 overflow-hidden">
                {/* Background gradient overlay */}
                <div className={`absolute inset-0 bg-gradient-to-br ${skill.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-500 rounded-3xl`}></div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <div className={`p-4 ${skill.bgColor} rounded-2xl ${skill.iconColor} group-hover:scale-110 transition-transform duration-300`}>
                      {skill.icon}
                    </div>
                    <span className={`text-sm px-3 py-1 rounded-full font-medium bg-gradient-to-r ${skill.gradient} text-white`}>
                      {skill.level}
                    </span>
                  </div>
                  
                  <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900 transition-colors duration-300">{skill.name}</h3>
                  <p className="text-gray-600 mb-4 text-sm leading-relaxed">{skill.description}</p>
                  
                  {/* Time to complete */}
                  <div className="mb-4">
                    <div className="flex items-center text-sm text-gray-500 mb-2">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {skill.timeToComplete} to complete
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4">
                    <span className="flex items-center">
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                      </svg>
                      {skill.students} students
                    </span>
                    <div className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-400 mr-1 fill-current" />
                      <span className="font-medium">{skill.rating}</span>
                    </div>
                  </div>

                  <button className={`w-full py-3 rounded-xl font-semibold text-white bg-gradient-to-r ${skill.gradient} hover:shadow-lg transform hover:scale-[1.02] transition-all duration-300`}>
                    Start Learning
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Featured Skills Section */}
        <div className="mb-16">
          <div className="flex items-center mb-8">
            <Award className="w-8 h-8 text-purple-500 mr-3" />
            <h2 className="text-4xl font-bold text-gray-800">Featured Skills</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {featuredSkills.map((skill, index) => (
              <div key={index} className={`${skill.color} rounded-3xl p-8 text-white relative overflow-hidden`}>
                <div className="absolute top-4 right-4">
                  <span className="bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm font-medium">
                    {skill.badge}
                  </span>
                </div>
                <div className="mb-6">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl inline-block">
                    {skill.icon}
                  </div>
                </div>
                <h3 className="text-2xl font-bold mb-3">{skill.name}</h3>
                <p className="text-white/90 leading-relaxed">{skill.description}</p>
                <button className="mt-6 bg-white/20 backdrop-blur-sm hover:bg-white/30 px-6 py-2 rounded-full font-medium transition-colors duration-300">
                  Learn More
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* Popular Skills Section */}
        <div>
          <div className="flex items-center mb-8">
            <TrendingUp className="w-8 h-8 text-green-500 mr-3" />
            <h2 className="text-4xl font-bold text-gray-800">Popular Skills</h2>
          </div>
          <div className="bg-white rounded-3xl p-8 shadow-xl border border-gray-100">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              {popularSkills.map((skill, index) => (
                <div key={index} className="flex items-center p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors duration-300 cursor-pointer">
                  <div className="p-2 bg-white rounded-lg shadow-sm mr-3 text-gray-600">
                    {skill.icon}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800 text-sm">{skill.name}</h4>
                    <p className="text-xs text-gray-500">{skill.learners} learners</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="mt-16 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Learn Something New?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join our community and start your learning journey today
          </p>
          <button className="bg-white text-indigo-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl">
            Browse All Skills
          </button>
        </div>
      </div>
    </div>
  );
};

export default SkillsPage;
