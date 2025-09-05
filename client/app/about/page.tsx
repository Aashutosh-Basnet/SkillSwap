import React from 'react';
import { Users, Target, Heart, Zap } from 'lucide-react';

const AboutPage = () => {
  const features = [
    {
      icon: <Users className="w-8 h-8 text-purple-600" />,
      title: "Community Driven",
      description: "Connect with passionate learners and skilled teachers from around the world."
    },
    {
      icon: <Target className="w-8 h-8 text-blue-600" />,
      title: "Goal Oriented",
      description: "Set learning objectives and track your progress with personalized skill paths."
    },
    {
      icon: <Heart className="w-8 h-8 text-pink-600" />,
      title: "Passion Based",
      description: "Learn from people who are genuinely passionate about sharing their expertise."
    },
    {
      icon: <Zap className="w-8 h-8 text-yellow-600" />,
      title: "Fast & Effective",
      description: "Experience accelerated learning through peer-to-peer knowledge exchange."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-6xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-6">
            About SkillSwap
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Empowering individuals to learn, teach, and grow together through the power of skill exchange
          </p>
        </div>

        {/* Mission Statement */}
        <div className="bg-white rounded-3xl shadow-xl p-12 mb-16 border border-gray-100">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold text-gray-800 mb-8">Our Mission</h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              SkillSwap is a revolutionary platform that connects individuals who want to learn new skills 
              with those who are passionate about teaching them. We believe that everyone has something 
              valuable to offer, and everyone has something new to learn.
            </p>
            <p className="text-lg text-gray-600 leading-relaxed">
              Whether you want to master programming, learn a musical instrument, explore culinary arts, 
              or dive into creative design, SkillSwap provides the perfect environment to find mentors, 
              peers, and learning opportunities that match your interests and goals.
            </p>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mb-16">
          <h2 className="text-4xl font-bold text-center text-gray-800 mb-12">Why Choose SkillSwap?</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-2 border border-gray-100">
                <div className="mb-6">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 rounded-3xl p-12 text-center text-white">
          <h2 className="text-4xl font-bold mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of learners and teachers in our vibrant community
          </p>
          <button className="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold text-lg hover:bg-gray-100 transition-colors duration-300 shadow-lg hover:shadow-xl">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
