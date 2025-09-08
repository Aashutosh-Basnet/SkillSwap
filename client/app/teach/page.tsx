"use client";

import { useState, useEffect } from 'react';
import { GraduationCap, Search, Users, CreditCard } from 'lucide-react';

interface Learner {
  _id: string;
  username: string;
  fullname: string;
  avatar?: string;
  about: string;
  learning_skills: string[];
  skillswap_credits: number;
}

const TeachPage = () => {
  const [learners, setLearners] = useState<Learner[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number>(0);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchCredits();
    fetchLearners();
  }, []);

  const fetchCredits = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) return;

      const response = await fetch('/api/teach/credits', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setCredits(data.credits);
      }
    } catch (error) {
      console.error('Error fetching credits:', error);
    }
  };

  const fetchLearners = async (skill?: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please log in to view learners');
        return;
      }

      const url = skill 
        ? `/api/teach/learners?skill=${encodeURIComponent(skill)}`
        : '/api/teach/learners';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setLearners(data.learners);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch learners');
      }
    } catch (error) {
      console.error('Error fetching learners:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillSearch = () => {
    fetchLearners(selectedSkill);
  };

  const acceptTeaching = async (learnerId: string, skill: string) => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please log in to accept teaching');
        return;
      }

      const response = await fetch('/api/teach/accept', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ learnerId, skill })
      });

      if (response.ok) {
        const data = await response.json();
        setCredits(data.newCredits);
        alert(`Teaching session accepted! You earned 1 credit. Total credits: ${data.newCredits}`);
        fetchLearners(selectedSkill); // Refresh the list
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to accept teaching');
      }
    } catch (error) {
      console.error('Error accepting teaching:', error);
      setError('Network error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-blue-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <GraduationCap className="text-green-600" size={32} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Teach Your Skills
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Share your knowledge and earn credits by teaching others
          </p>
          
          {/* Credits Display */}
          <div className="flex items-center justify-center gap-2 mt-4 p-3 bg-white rounded-xl shadow-md">
            <CreditCard className="text-green-600" size={20} />
            <span className="font-semibold text-gray-700">
              Your Credits: {credits}
            </span>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Find Learners</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for learners interested in a skill (e.g., JavaScript, Guitar, Spanish)"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-green-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSkillSearch}
              className="px-6 py-3 bg-green-600 text-white rounded-xl hover:bg-green-700 transition-all duration-300 flex items-center gap-2"
            >
              <Search size={20} />
              Search
            </button>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading learners...</p>
          </div>
        )}

        {/* Learners Grid */}
        {!loading && learners.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {learners.map((learner) => (
              <div key={learner._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-green-400 to-blue-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {learner.fullname.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{learner.fullname}</h3>
                    <p className="text-gray-600">@{learner.username}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <CreditCard size={14} className="text-green-600" />
                      <span className="text-sm text-green-600 font-medium">
                        {learner.skillswap_credits} credits
                      </span>
                    </div>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{learner.about || 'No description available'}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Wants to Learn:</h4>
                  <div className="flex flex-wrap gap-2">
                    {learner.learning_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {learner.learning_skills.map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => acceptTeaching(learner._id, skill)}
                      disabled={learner.skillswap_credits < 1}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        learner.skillswap_credits >= 1
                          ? 'bg-green-600 text-white hover:bg-green-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Teach {skill} (+1 Credit)
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Learners Found */}
        {!loading && learners.length === 0 && !error && (
          <div className="text-center py-12">
            <Users className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Learners Found</h3>
            <p className="text-gray-500">
              {selectedSkill 
                ? `No learners found interested in "${selectedSkill}". Try searching for a different skill.`
                : 'Click search to find learners looking for teachers.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeachPage;
