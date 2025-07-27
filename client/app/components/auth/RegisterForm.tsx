'use client';

import React, { useState } from 'react';
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TSignUpSchema, signUpSchema } from "@/lib/types";
import Link from 'next/link';
import { FaGoogle, FaGithub, FaPlus, FaTimes, FaChalkboardTeacher } from 'react-icons/fa';
import { FiMail, FiLock, FiUser, FiPhone, FiBook, FiEdit3 } from 'react-icons/fi';
import { useRouter } from 'next/navigation';

export default function RegisterForm(){
    const router = useRouter();
    const [currentStep, setCurrentStep] = useState(1);
    
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setError,
        control,
        watch,
    } = useForm<TSignUpSchema>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            learning_skills: [""],
            teaching_skills: [""],
        }
    });

    const { fields: learningFields, append: appendLearning, remove: removeLearning } = useFieldArray({
        control,
        name: "learning_skills" as const
    });

    const { fields: teachingFields, append: appendTeaching, remove: removeTeaching } = useFieldArray({
        control,
        name: "teaching_skills" as const
    });

    const addLearningSkill = () => {
        appendLearning("");
    };

    const addTeachingSkill = () => {
        appendTeaching("");
    };

    const onSubmit = async (data: TSignUpSchema) => {
        try {
            // Transform data to match server expectations
            const serverData = {
                fullname: `${data.firstName} ${data.lastName}`,
                username: data.username,
                email: data.email,
                password: data.password,
                gender: data.gender || '',
                about: data.about || '',
                learning_skills: data.learning_skills,
                teaching_skills: data.teaching_skills,
                phone: data.phone || '',
                previous_meeting: []
            };

            const response = await fetch("/api/auth/register", {
                method: "POST",
                body: JSON.stringify(serverData),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            const responseData = await response.json();
            
            if (!response.ok) {
                if (responseData.errors) {
                    const errors = responseData.errors;
                    if (errors.email) {
                        setError("email", {
                            type: "server",
                            message: errors.email,
                        });
                    } else if (errors.password) {
                        setError("password", {
                            type: "server",
                            message: errors.password,
                        });
                    } else if (errors.username) {
                        setError("username", {
                            type: "server",
                            message: errors.username,
                        });
                    }
                } else {
                    alert(responseData.message || "Registration failed!");
                }
                return;
            }

            // Success - redirect to home page
            alert("Registration successful! Welcome to SkillSwap!");
            router.push('/home');
        } catch (error) {
            console.error("Registration error:", error);
            alert("Something went wrong!");
        }
    };

    const nextStep = () => {
        setCurrentStep(2);
    };

    const prevStep = () => {
        setCurrentStep(1);
    };

    return(
        <div className="max-w-4xl w-full bg-gray-900 rounded-xl shadow-2xl p-8 sm:p-10 border border-gray-800">
            {/* Header */}
            <div className="mb-10 text-center">
                <h1 className="text-3xl font-bold text-white mb-2">Join SkillSwap</h1>
                <p className="text-gray-400 text-lg">Create your profile and start exchanging skills!</p>
                
                {/* Progress indicator */}
                <div className="flex justify-center mt-6 space-x-4">
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 1 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                        1
                    </div>
                    <div className={`w-20 h-1 mt-4 rounded ${currentStep === 2 ? 'bg-purple-600' : 'bg-gray-700'}`}></div>
                    <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${currentStep === 2 ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-400'}`}>
                        2
                    </div>
                </div>
                
                <div className="flex justify-center mt-2 space-x-8 text-sm">
                    <span className={currentStep === 1 ? 'text-purple-500' : 'text-gray-500'}>Basic Info</span>
                    <span className={currentStep === 2 ? 'text-purple-500' : 'text-gray-500'}>Skills & Profile</span>
                </div>
            </div>

            {currentStep === 1 && (
                <>
                    {/* Social Login Buttons */}
                    <div className="flex flex-col sm:flex-row gap-5 mb-8">
                        <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                            <FaGoogle className="text-red-500" size={20}/>
                            <span>Sign up with Google</span>
                        </button>
                        <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                            <FaGithub size={20} />
                            <span>Sign up with Github</span>
                        </button>
                    </div>

                    {/* Divider */}
                    <div className="relative flex items-center mb-8">
                        <div className="flex-grow border-t border-gray-700"></div>
                        <span className="flex-shrink mx-4 text-gray-500 text-sm font-medium">Or continue with email</span>
                        <div className="flex-grow border-t border-gray-700"></div>
                    </div>

                    {/* Basic Information Form */}
                    <form className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    {...register("firstName")}
                                    type="text"
                                    placeholder="First Name"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors text-base"
                                />
                                {errors.firstName && (
                                    <p className="text-red-400 text-sm mt-1 absolute -bottom-6 left-0">{errors.firstName.message}</p>
                                )}
                            </div>
                            <div className="relative">
                                <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    {...register("lastName")}
                                    type="text"
                                    placeholder="Last Name"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors text-base"
                                />
                                 {errors.lastName && (
                                    <p className="text-red-400 text-sm mt-1 absolute -bottom-6 left-0">{errors.lastName.message}</p>
                                )}
                            </div>
                        </div>

                        <div className="relative">
                            <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                {...register("username")}
                                type="text"
                                placeholder="Username"
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors text-base"
                            />
                            {errors.username && (
                                <p className="text-red-400 text-sm mt-1 absolute -bottom-6 left-0">{errors.username.message}</p>
                            )}
                        </div>

                        <div className="relative">
                             <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                             <input
                                {...register("email")}
                                type="email"
                                placeholder="Email Address"
                                className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors text-base"
                             />
                             {errors.email && (
                                <p className="text-red-400 text-sm mt-1 absolute -bottom-6 left-0">{errors.email.message}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="relative">
                                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    {...register("password")}
                                    type="password"
                                    placeholder="Password"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors text-base"
                                />
                                {errors.password && (
                                    <p className="text-red-400 text-sm mt-1 absolute -bottom-6 left-0">{errors.password.message}</p>
                                )}
                            </div>
                            <div className="relative">
                                 <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                 <input
                                    {...register("confirmPassword")}
                                    type="password"
                                    placeholder="Confirm Password"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors text-base"
                                 />
                                 {errors.confirmPassword && (
                                    <p className="text-red-400 text-sm mt-1 absolute -bottom-6 left-0">{errors.confirmPassword.message}</p>
                                )}
                            </div>
                        </div>

                        <button
                            type="button"
                            onClick={nextStep}
                            className="w-full bg-purple-700 text-white py-3.5 px-6 rounded-xl font-bold text-lg hover:bg-purple-800 transition-all duration-300 transform hover:scale-105 shadow-lg"
                        >
                            Next: Add Profile Details
                        </button>
                    </form>
                </>
            )}

            {currentStep === 2 && (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                    {/* Personal Details */}
                    <div className="space-y-6">
                        <h3 className="text-xl font-semibold text-white mb-4">Personal Details</h3>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="relative">
                                <select
                                    {...register("gender")}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-5 pr-5 py-3.5 text-white focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors text-base appearance-none"
                                >
                                    <option value="">Select Gender (Optional)</option>
                                    <option value="male">Male</option>
                                    <option value="female">Female</option>
                                    <option value="other">Other</option>
                                    <option value="prefer-not-to-say">Prefer not to say</option>
                                </select>
                                {errors.gender && (
                                    <p className="text-red-400 text-sm mt-1 absolute -bottom-6 left-0">{errors.gender.message}</p>
                                )}
                            </div>

                            <div className="relative">
                                <FiPhone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                                <input
                                    {...register("phone")}
                                    type="tel"
                                    placeholder="Phone Number (Optional)"
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors text-base"
                                />
                                {errors.phone && (
                                    <p className="text-red-400 text-sm mt-1 absolute -bottom-6 left-0">{errors.phone.message}</p>
                                )}
                            </div>
                            
                            <div className="relative">
                                <FiEdit3 className="absolute left-4 top-4 text-gray-400" />
                                <textarea
                                    {...register("about")}
                                    placeholder="Tell us about yourself... (Optional)"
                                    rows={4}
                                    className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors text-base resize-none"
                                />
                                {errors.about && (
                                    <p className="text-red-400 text-sm mt-1 absolute -bottom-6 left-0">{errors.about.message}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Skills Section */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Learning Skills */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <FiBook className="text-purple-500" size={20} />
                                <h3 className="text-xl font-semibold text-white">Skills I Want to Learn</h3>
                            </div>
                            
                            {learningFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <input
                                        {...register(`learning_skills.${index}` as const)}
                                        type="text"
                                        placeholder="e.g., Guitar, Programming, Cooking"
                                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeLearning(index)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-3 rounded-lg transition-colors"
                                    >
                                        <FaTimes size={14} />
                                    </button>
                                </div>
                            ))}
                            
                            <button
                                type="button"
                                onClick={addLearningSkill}
                                className="w-full bg-gray-800 border-2 border-dashed border-gray-600 text-gray-400 py-3 px-4 rounded-lg hover:border-purple-500 hover:text-purple-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <FaPlus size={14} />
                                Add Learning Skill
                            </button>
                            
                            {errors.learning_skills && (
                                <p className="text-red-400 text-sm">{errors.learning_skills.message}</p>
                            )}
                        </div>

                        {/* Teaching Skills */}
                        <div className="space-y-4">
                            <div className="flex items-center gap-2 mb-4">
                                <FaChalkboardTeacher className="text-green-500" size={20} />
                                <h3 className="text-xl font-semibold text-white">Skills I Can Teach</h3>
                            </div>
                            
                            {teachingFields.map((field, index) => (
                                <div key={field.id} className="flex gap-2">
                                    <input
                                        {...register(`teaching_skills.${index}` as const)}
                                        type="text"
                                        placeholder="e.g., Photography, Math, Dancing"
                                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent transition-colors"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeTeaching(index)}
                                        className="bg-red-600 hover:bg-red-700 text-white px-3 py-3 rounded-lg transition-colors"
                                    >
                                        <FaTimes size={14} />
                                    </button>
                                </div>
                            ))}
                            
                            <button
                                type="button"
                                onClick={addTeachingSkill}
                                className="w-full bg-gray-800 border-2 border-dashed border-gray-600 text-gray-400 py-3 px-4 rounded-lg hover:border-green-500 hover:text-green-500 transition-colors flex items-center justify-center gap-2"
                            >
                                <FaPlus size={14} />
                                Add Teaching Skill
                            </button>
                            
                            {errors.teaching_skills && (
                                <p className="text-red-400 text-sm">{errors.teaching_skills.message}</p>
                            )}
                        </div>
                    </div>

                    <div className="bg-gray-800 p-4 rounded-lg">
                        <p className="text-gray-300 text-sm">
                            💡 <strong>How SkillSwap works:</strong> Share your knowledge and learn from others! 
                            Add skills you can teach others, and skills you'd like to learn. 
                            We'll help you connect with people who can help you grow.
                        </p>
                    </div>

                    <p className="text-sm text-gray-500 text-center pt-2">
                        By signing up, you agree to our <Link href="/terms" className="text-purple-500 hover:underline font-medium">Terms and Conditions</Link>.
                    </p>

                    {/* Action Buttons */}
                    <div className="flex gap-4">
                        <button
                            type="button"
                            onClick={prevStep}
                            className="flex-1 bg-gray-700 text-white py-3.5 px-6 rounded-xl font-bold text-lg hover:bg-gray-600 transition-all duration-300"
                        >
                            Back
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="flex-1 bg-purple-700 text-white py-3.5 px-6 rounded-xl font-bold text-lg hover:bg-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                        >
                            {isSubmitting ? "Creating Account..." : "Create Account"}
                        </button>
                    </div>
                </form>
            )}

            {/* Footer Link */}
            <div className="text-center mt-10">
                <p className="text-gray-400 text-base">
                    Already have an account?{" "}
                    <Link href="/login" className="text-purple-500 hover:underline font-medium">
                        Log In
                    </Link>
                </p>
            </div>
        </div>
    );
}