'use client';

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TSignUpSchema, signUpSchema } from "@/lib/types";
import Link from 'next/link';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { FiMail, FiLock, FiUser } from 'react-icons/fi';

export default function RegisterForm(){
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setError,
    } = useForm<TSignUpSchema>({
        resolver: zodResolver(signUpSchema),
    });

    const onSubmit = async (data: TSignUpSchema) => {
        try {
            // Transform data to match server expectations
            const serverData = {
                fullname: `${data.firstName} ${data.lastName}`,
                username: data.email.split('@')[0], // Use email prefix as username
                email: data.email,
                password: data.password,
                gender: '', // Optional field
                skills: [], // Optional field
                phone: '', // Optional field
                previous_meetings: [] // Optional field
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
                    }
                } else {
                    alert(responseData.message || "Registration failed!");
                }
                return;
            }

            // Success - redirect or show success message
            alert("Registration successful!");
            reset();
        } catch (error) {
            console.error("Registration error:", error);
            alert("Something went wrong!");
        }
    };

    return(
            <div className="max-w-2xl w-full bg-gray-900 rounded-xl shadow-2xl p-8 sm:p-10 border border-gray-800">
                {/* Header */}
                <div className="mb-10 text-center">
                    <p className="text-gray-400 text-lg">Join our vibrant community and start your journey.</p>
                </div>

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

                {/* Registration Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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

                    <p className="text-sm text-gray-500 text-center pt-2">
                        By signing up, you agree to our <Link href="/terms" className="text-purple-500 hover:underline font-medium">Terms and Conditions</Link>.
                    </p>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-purple-700 text-white py-3.5 px-6 rounded-xl font-bold text-lg hover:bg-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                    >
                        {isSubmitting ? "Creating Account..." : "Sign Up"}
                    </button>
                </form>

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