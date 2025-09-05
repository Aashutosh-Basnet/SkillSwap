'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { TProfileUpdateSchema, profileUpdateSchema } from '@/lib/types';
import authService from '@/lib/auth';
import { useRouter } from 'next/navigation';
import { Mail, Pencil, Calendar, Star, Save, X, Plus, Trash2, User, BookOpen, GraduationCap, Camera } from 'lucide-react';

// Helper function to convert file to base64
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

interface UserProfile {
  id: string;
  fullname: string;
  username: string;
  email: string;
  phone?: string;
  gender?: string;
  avatar?: string;
  about?: string;
  learning_skills: string[];
  teaching_skills: string[];
  createdAt: string;
  updatedAt: string;
}

const ProfilePage = () => {
  const router = useRouter();
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // Simple state for skills during editing
  const [editingLearningSkills, setEditingLearningSkills] = useState<string[]>(['']);
  const [editingTeachingSkills, setEditingTeachingSkills] = useState<string[]>(['']);
  
  // Avatar state
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
    getValues
  } = useForm<TProfileUpdateSchema>({
    resolver: zodResolver(profileUpdateSchema),
    mode: 'onChange'
  });

  useEffect(() => {
    const loadProfile = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push('/login');
          return;
        }

        const response = await authService.makeAuthenticatedRequest('/user/profile');
        const data = await response.json();

        if (response.ok) {
          setUser(data.user);
          // Set form values properly
          setValue('fullname', data.user.fullname);
          setValue('gender', data.user.gender as "male" | "female" | "other" | "prefer-not-to-say" | undefined);
          setValue('avatar', data.user.avatar || '');
          setValue('about', data.user.about || '');
          setValue('learning_skills', data.user.learning_skills);
          setValue('teaching_skills', data.user.teaching_skills);
          
          // Set editing state
          setEditingLearningSkills(data.user.learning_skills.length > 0 ? data.user.learning_skills : ['']);
          setEditingTeachingSkills(data.user.teaching_skills.length > 0 ? data.user.teaching_skills : ['']);
          
          // Set avatar preview
          setAvatarPreview(data.user.avatar || null);
        } else {
          console.error('Failed to load profile:', data.message);
          if (response.status === 401) {
            router.push('/login');
          }
        }
      } catch (error) {
        console.error('Error loading profile:', error);
      } finally {
        setLoading(false);
      }
    };

    loadProfile();
  }, [router, setValue]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long'
    });
  };

  const onSubmit = async (data: TProfileUpdateSchema) => {
    console.log('🚀 FORM SUBMIT TRIGGERED');
    console.log('Form submitted with data:', data);
    console.log('Form errors:', errors);
    console.log('Current user:', user);
    console.log('Editing learning skills:', editingLearningSkills);
    console.log('Editing teaching skills:', editingTeachingSkills);
    
    // Prevent form submission if already saving
    if (saving) {
      console.log('❌ Already saving, preventing duplicate submission');
      return;
    }
    
    setSaving(true);
    console.log('✅ Setting saving state to true');
    
    try {
      console.log('🔍 Starting validation...');
      
      // Use the editing skills state instead of form data
      const filteredLearningSkills = editingLearningSkills.filter(skill => skill.trim() !== '');
      const filteredTeachingSkills = editingTeachingSkills.filter(skill => skill.trim() !== '');

      console.log('Filtered learning skills:', filteredLearningSkills);
      console.log('Filtered teaching skills:', filteredTeachingSkills);

      // Validate skills before submitting
      if (filteredLearningSkills.length === 0) {
        alert('Please add at least one learning skill');
        setSaving(false);
        return;
      }

      if (filteredTeachingSkills.length === 0) {
        alert('Please add at least one teaching skill');
        setSaving(false);
        return;
      }

      // Validate fullname
      if (!data.fullname || data.fullname.trim().length < 2) {
        alert('Full name must be at least 2 characters long');
        setSaving(false);
        return;
      }

      console.log('✅ Validation passed');

      // Handle avatar conversion to base64 if new file selected
      let avatarData = data.avatar;
      if (avatarFile) {
        console.log('🖼️ Converting avatar file...');
        try {
          avatarData = await convertFileToBase64(avatarFile);
          console.log('✅ Avatar converted successfully');
        } catch (avatarError) {
          console.error('❌ Error converting avatar:', avatarError);
          alert('Error processing avatar image');
          setSaving(false);
          return;
        }
      }

      const submitData = {
        fullname: data.fullname.trim(),
        gender: data.gender,
        avatar: avatarData,
        about: data.about || '',
        learning_skills: filteredLearningSkills,
        teaching_skills: filteredTeachingSkills
      };

      console.log('📤 Sending data to API:', submitData);
      console.log('🔗 Making API request...');
      
      const response = await authService.makeAuthenticatedRequest('/user/profile', {
        method: 'PUT',
        body: JSON.stringify(submitData),
      });

      console.log('📥 API response received');
      console.log('API response status:', response.status);
      console.log('API response ok:', response.ok);
      
      let result;
      try {
        result = await response.json();
        console.log('API response data:', result);
      } catch (jsonError) {
        console.error('❌ Error parsing response JSON:', jsonError);
        alert('Invalid response from server');
        setSaving(false);
        return;
      }

      if (response.ok) {
        console.log('✅ Profile update successful!');
        console.log('Updated user data:', result.user);
        
        // Update user state with the response data
        setUser(result.user);
        
        // Update form values to match saved data
        setValue('fullname', result.user.fullname);
        setValue('gender', result.user.gender);
        setValue('avatar', result.user.avatar);
        setValue('about', result.user.about);
        setValue('learning_skills', result.user.learning_skills);
        setValue('teaching_skills', result.user.teaching_skills);
        
        // Reset editing skills state to match the saved data
        setEditingLearningSkills(result.user.learning_skills.length > 0 ? result.user.learning_skills : ['']);
        setEditingTeachingSkills(result.user.teaching_skills.length > 0 ? result.user.teaching_skills : ['']);
        
        // Clear avatar file state
        setAvatarFile(null);
        setAvatarPreview(result.user.avatar || null);
        
        console.log('🎉 Exiting edit mode...');
        setIsEditing(false);
        alert('Profile updated successfully!');
      } else {
        console.error('❌ API Error:', result);
        alert(result.message || `Failed to update profile (${response.status})`);
      }
    } catch (error) {
      console.error('❌ Error updating profile:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error';
      console.error('Error details:', errorMessage);
      
      // Provide more specific error messages
      if (errorMessage.includes('Authentication failed')) {
        alert('Your session has expired. Please log in again.');
        router.push('/login');
      } else if (errorMessage.includes('No authentication token')) {
        alert('Authentication required. Please log in again.');
        router.push('/login');
      } else {
        alert(`Something went wrong while updating your profile: ${errorMessage}`);
      }
    } finally {
      console.log('🏁 Setting saving state to false');
      setSaving(false);
    }
  };

  const addLearningSkill = () => {
    const newSkills = [...editingLearningSkills, ''];
    setEditingLearningSkills(newSkills);
    
    // Update form value
    const filteredSkills = newSkills.filter(skill => skill.trim() !== '');
    setValue('learning_skills', filteredSkills);
  };

  const addTeachingSkill = () => {
    const newSkills = [...editingTeachingSkills, ''];
    setEditingTeachingSkills(newSkills);
    
    // Update form value
    const filteredSkills = newSkills.filter(skill => skill.trim() !== '');
    setValue('teaching_skills', filteredSkills);
  };

  const removeLearningSkill = (index: number) => {
    const newSkills = editingLearningSkills.filter((_, i) => i !== index);
    setEditingLearningSkills(newSkills.length > 0 ? newSkills : ['']);
    
    // Update form value
    const filteredSkills = newSkills.filter(skill => skill.trim() !== '');
    setValue('learning_skills', filteredSkills);
  };

  const removeTeachingSkill = (index: number) => {
    const newSkills = editingTeachingSkills.filter((_, i) => i !== index);
    setEditingTeachingSkills(newSkills.length > 0 ? newSkills : ['']);
    
    // Update form value
    const filteredSkills = newSkills.filter(skill => skill.trim() !== '');
    setValue('teaching_skills', filteredSkills);
  };

  const updateLearningSkill = (index: number, value: string) => {
    const newSkills = [...editingLearningSkills];
    newSkills[index] = value;
    setEditingLearningSkills(newSkills);
    
    // Also update the form value to keep validation in sync
    const filteredSkills = newSkills.filter(skill => skill.trim() !== '');
    setValue('learning_skills', filteredSkills);
  };

  const updateTeachingSkill = (index: number, value: string) => {
    const newSkills = [...editingTeachingSkills];
    newSkills[index] = value;
    setEditingTeachingSkills(newSkills);
    
    // Also update the form value to keep validation in sync
    const filteredSkills = newSkills.filter(skill => skill.trim() !== '');
    setValue('teaching_skills', filteredSkills);
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }

      setAvatarFile(file);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarFile(null);
    setAvatarPreview(null);
    setValue('avatar', '');
    console.log('🗑️ Avatar removed, form value set to empty string');
  };

  const cancelEdit = () => {
    setIsEditing(false);
    if (user) {
      // Reset form to original values
      setValue('fullname', user.fullname);
      setValue('gender', user.gender as "male" | "female" | "other" | "prefer-not-to-say" | undefined);
      setValue('learning_skills', user.learning_skills);
      setValue('teaching_skills', user.teaching_skills);
      
      // Reset editing skills
      setEditingLearningSkills(user.learning_skills.length > 0 ? user.learning_skills : ['']);
      setEditingTeachingSkills(user.teaching_skills.length > 0 ? user.teaching_skills : ['']);
    }
  };

  const startEditing = () => {
    setIsEditing(true);
    if (user) {
      // Ensure editing skills are properly set
      const learningSkills = user.learning_skills.length > 0 ? user.learning_skills : [''];
      const teachingSkills = user.teaching_skills.length > 0 ? user.teaching_skills : [''];
      
      setEditingLearningSkills(learningSkills);
      setEditingTeachingSkills(teachingSkills);
      
      // Also initialize form values for validation
      setValue('learning_skills', user.learning_skills);
      setValue('teaching_skills', user.teaching_skills);
      
      console.log('🎬 Started editing mode');
      console.log('Initial skills set:', { learningSkills, teachingSkills });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading profile...</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Profile not found</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-4 sm:p-6 md:p-8">
      <form onSubmit={handleSubmit(onSubmit, (errors) => {
        console.log('❌ FORM VALIDATION FAILED');
        console.log('Validation errors:', errors);
        console.log('Avatar error details:', errors.avatar);
        console.log('Current form values:', getValues());
        console.log('Current editing skills:', { editingLearningSkills, editingTeachingSkills });
      })}>
        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: User Info */}
        <div className="lg:col-span-1 space-y-8">
          <div className="bg-gray-800 rounded-xl shadow-xl p-6">
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                {avatarPreview || user.avatar ? (
                  <img
                    src={avatarPreview || user.avatar || ''}
                    alt="Avatar"
                    className="w-24 h-24 rounded-full object-cover border-4 border-purple-600"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center">
                    <User size={40} className="text-white" />
                  </div>
                )}
                
                {isEditing && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full">
                    <label className="cursor-pointer">
                      <Camera size={24} className="text-white hover:text-purple-300" />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarChange}
                        className="hidden"
                      />
                    </label>
                  </div>
                )}
                
                {isEditing && (avatarPreview || user.avatar) && (
                  <button
                    type="button"
                    onClick={removeAvatar}
                    className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <input
                    {...register("fullname")}
                    type="text"
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white text-center text-xl font-bold"
                    placeholder="Full Name"
                  />
                  {errors.fullname && (
                    <p className="text-red-400 text-sm">{errors.fullname.message}</p>
                  )}
                </div>
              ) : (
                <h1 className="text-3xl font-bold mt-4">{user.fullname}</h1>
              )}
              
              <p className="text-gray-400 mt-2">@{user.username}</p>
              
              <div className="flex justify-center gap-4 mt-6">
                {!isEditing ? (
                  <>
                    <button type="button" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors">
                      <Mail size={16} />
                      Message
                    </button>
                                        <button
                      type="button"
                      onClick={startEditing}
                      className="border border-purple-600 text-purple-400 hover:bg-purple-600 hover:text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <Pencil size={16} />
                      Edit Profile
                    </button>
                  </>
                ) : (
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      disabled={saving}
                      onClick={() => {
                        // Update form with current skills before submission
                        const filteredLearningSkills = editingLearningSkills.filter(skill => skill.trim() !== '');
                        const filteredTeachingSkills = editingTeachingSkills.filter(skill => skill.trim() !== '');
                        
                        setValue('learning_skills', filteredLearningSkills);
                        setValue('teaching_skills', filteredTeachingSkills);
                      }}
                      className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors disabled:opacity-50"
                    >
                      <Save size={16} />
                      {saving ? 'Saving...' : 'Save'}
                    </button>
                    <button
                      type="button"
                      onClick={cancelEdit}
                      className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors"
                    >
                      <X size={16} />
                      Cancel
                    </button>

                  </div>
                )}
              </div>
            </div>
            
            <div className="mt-8">
              <h2 className="text-xl font-semibold mb-4">Details</h2>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <Mail className="w-5 h-5 text-gray-400"/>
                  <span className="text-gray-300">{user.email}</span>
                </div>
                {user.phone && (
                  <div className="flex items-center gap-3">
                    <span className="text-gray-300">{user.phone}</span>
                  </div>
                )}
                {(isEditing ? true : user.gender) && (
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 text-gray-400"/>
                    {isEditing ? (
                      <select
                        {...register("gender")}
                        className="bg-gray-700 border border-gray-600 rounded px-3 py-1 text-white text-sm"
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                        <option value="prefer-not-to-say">Prefer not to say</option>
                      </select>
                    ) : (
                      <span className="text-gray-300 capitalize">{user.gender?.replace('-', ' ')}</span>
                    )}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-gray-400"/>
                  <span className="text-gray-300">Joined {formatDate(user.createdAt)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Skills */}
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <div className="bg-gray-800 rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-4">About Me</h2>
            {isEditing ? (
              <div className="space-y-2">
                <textarea
                  {...register("about")}
                  placeholder="Tell us about yourself, your interests, and what you're passionate about..."
                  rows={4}
                  className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent resize-none"
                />
                {errors.about && (
                  <p className="text-red-400 text-sm">{errors.about.message}</p>
                )}
              </div>
            ) : (
              <p className="text-gray-300">
                {user.about || "No description provided yet. Click edit to add information about yourself!"}
              </p>
            )}
          </div>

          {/* Skills Section */}
          <div className="bg-gray-800 rounded-xl shadow-xl p-6">
            <h2 className="text-2xl font-semibold mb-6">Skills</h2>
            
            {isEditing ? (
              <div className="space-y-8">
                {/* Learning Skills */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="text-purple-500" size={20} />
                    <h3 className="text-xl font-semibold">Skills I Want to Learn</h3>
                  </div>
                  
                  {editingLearningSkills.map((skill, index) => (
                    <div key={index} className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => updateLearningSkill(index, e.target.value)}
                        placeholder="e.g., Guitar, Programming, Cooking"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeLearningSkill(index)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addLearningSkill}
                    className="w-full bg-gray-700 border-2 border-dashed border-gray-600 text-gray-400 py-3 px-4 rounded-lg hover:border-purple-500 hover:text-purple-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Add Learning Skill
                  </button>
                </div>

                {/* Teaching Skills */}
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="text-green-500" size={20} />
                    <h3 className="text-xl font-semibold">Skills I Can Teach</h3>
                  </div>
                  
                  {editingTeachingSkills.map((skill, index) => (
                    <div key={index} className="flex gap-2 mb-3">
                      <input
                        type="text"
                        value={skill}
                        onChange={(e) => updateTeachingSkill(index, e.target.value)}
                        placeholder="e.g., Photography, Math, Dancing"
                        className="flex-1 bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600"
                      />
                      <button
                        type="button"
                        onClick={() => removeTeachingSkill(index)}
                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                  
                  <button
                    type="button"
                    onClick={addTeachingSkill}
                    className="w-full bg-gray-700 border-2 border-dashed border-gray-600 text-gray-400 py-3 px-4 rounded-lg hover:border-green-500 hover:text-green-500 transition-colors flex items-center justify-center gap-2"
                  >
                    <Plus size={16} />
                    Add Teaching Skill
                  </button>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <BookOpen className="text-purple-500" size={20} />
                    <h3 className="text-xl font-semibold">Skills I Want to Learn</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.learning_skills.map((skill, index) => (
                      <span key={index} className="bg-purple-600 text-white px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center gap-2 mb-4">
                    <GraduationCap className="text-green-500" size={20} />
                    <h3 className="text-xl font-semibold">Skills I Can Teach</h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {user.teaching_skills.map((skill, index) => (
                      <span key={index} className="bg-green-600 text-white px-3 py-1 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Reviews Section (placeholder for future) */}
          {!isEditing && (
            <div className="bg-gray-800 rounded-xl shadow-xl p-6">
              <h2 className="text-2xl font-semibold mb-4">Reviews</h2>
              <div className="text-center py-8 text-gray-400">
                <Star size={48} className="mx-auto mb-4 opacity-50" />
                <p>No reviews yet. Start skill swapping to get your first review!</p>
              </div>
            </div>
          )}
        </div>
      </div>
      </form>
    </div>
  );
};

export default ProfilePage;