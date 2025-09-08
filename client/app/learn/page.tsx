"use client";

import { useState, useEffect } from 'react';
import { BookOpen, Search, Star, Clock, CreditCard } from 'lucide-react';

interface Teacher {
  _id: string;
  username: string;
  fullname: string;
  avatar?: string;
  about: string;
  teaching_skills: string[];
}

const LearnPage = () => {
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [selectedSkill, setSelectedSkill] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [credits, setCredits] = useState<number>(0);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    fetchCredits();
    fetchTeachers();
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

  const fetchTeachers = async (skill?: string) => {
    setLoading(true);
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please log in to view teachers');
        return;
      }

      const url = skill 
        ? `/api/learn/teachers?skill=${encodeURIComponent(skill)}`
        : '/api/learn/teachers';

      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        setTeachers(data.teachers);
        setError('');
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to fetch teachers');
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSkillSearch = () => {
    fetchTeachers(selectedSkill);
  };

  const requestLearning = async (teacherId: string, skill: string) => {
    if (credits < 1) {
      setError('You need at least 1 credit to request learning');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        setError('Please log in to request learning');
        return;
      }

      const response = await fetch('/api/learn/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ teacherId, skill })
      });

      if (response.ok) {
        const data = await response.json();
        setCredits(data.remainingCredits);
        alert(`Learning request sent successfully! Remaining credits: ${data.remainingCredits}`);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to send learning request');
      }
    } catch (error) {
      console.error('Error requesting learning:', error);
      setError('Network error occurred');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <BookOpen className="text-blue-600" size={32} />
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Learn New Skills
            </h1>
          </div>
          <p className="text-gray-600 text-lg">
            Connect with skilled teachers and expand your knowledge
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
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Find Teachers</h2>
          <div className="flex gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search for a skill (e.g., JavaScript, Guitar, Spanish)"
                value={selectedSkill}
                onChange={(e) => setSelectedSkill(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button
              onClick={handleSkillSearch}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-all duration-300 flex items-center gap-2"
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
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading teachers...</p>
          </div>
        )}

        {/* Teachers Grid */}
        {!loading && teachers.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {teachers.map((teacher) => (
              <div key={teacher._id} className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4 mb-4">
                  <div className="w-16 h-16 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full flex items-center justify-center text-white font-bold text-xl">
                    {teacher.fullname.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-800">{teacher.fullname}</h3>
                    <p className="text-gray-600">@{teacher.username}</p>
                  </div>
                </div>
                
                <p className="text-gray-700 mb-4">{teacher.about || 'No description available'}</p>
                
                <div className="mb-4">
                  <h4 className="font-semibold text-gray-800 mb-2">Teaching Skills:</h4>
                  <div className="flex flex-wrap gap-2">
                    {teacher.teaching_skills.map((skill, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-wrap gap-2">
                  {teacher.teaching_skills.map((skill, index) => (
                    <button
                      key={index}
                      onClick={() => requestLearning(teacher._id, skill)}
                      disabled={credits < 1}
                      className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                        credits >= 1
                          ? 'bg-blue-600 text-white hover:bg-blue-700'
                          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                      }`}
                    >
                      Learn {skill} (1 Credit)
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* No Teachers Found */}
        {!loading && teachers.length === 0 && !error && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto text-gray-400 mb-4" size={64} />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">No Teachers Found</h3>
            <p className="text-gray-500">
              {selectedSkill 
                ? `No teachers found for "${selectedSkill}". Try searching for a different skill.`
                : 'Click search to find available teachers.'
              }
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default LearnPage;
