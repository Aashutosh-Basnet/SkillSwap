'use client';

import React from 'react';
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { TSignInSchema, signInSchema } from "@/lib/types";
import Link from 'next/link';
import { FaGoogle, FaGithub } from 'react-icons/fa';
import { FiMail, FiLock } from 'react-icons/fi';

export default function LoginForm(){
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
        reset,
        setError,
    } = useForm<TSignInSchema>({
        resolver: zodResolver(signInSchema),
    });

    const onSubmit = async (data: TSignInSchema) => {
        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                body: JSON.stringify(data),
                headers: {
                    "Content-Type": "application/json",
                },
            });
            
            const responseData = await response.json();
            
            if (!response.ok) {
                if (responseData.message) {
                    if (responseData.error === "USER_NOT_FOUND") {
                        setError("username", { type: "server", message: "User not found" });
                    } else if (responseData.error === "INVALID_CREDENTIALS") {
                        setError("password", { type: "server", message: "Invalid password" });
                    } else {
                        alert(responseData.message);
                    }
                } else {
                    alert("Login failed!");
                }
                return;
            }

            if (responseData.token) {
                localStorage.setItem('token', responseData.token);
                localStorage.setItem('user', JSON.stringify(responseData.user));
                alert("Login successful!");
                window.location.href = '/';
            }
        } catch (error) {
            console.error("Login error:", error);
            alert("Something went wrong!");
        }
    };

    return(
            <div className="max-w-2xl w-full bg-gray-900 rounded-xl shadow-2xl p-8 sm:p-10 border border-gray-800">
                <div className="mb-10 text-center">
                    <h1 className="text-4xl sm:text-5xl font-extrabold text-white mb-3 leading-tight">Welcome Back!</h1>
                    <p className="text-gray-400 text-lg">Sign in to continue to SkillSwap.</p>
                </div>

                {/* Social Login Buttons */}
                <div className="flex flex-col sm:flex-row gap-5 mb-8">
                    <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                        <FaGoogle className="text-red-500" size={20}/>
                        <span>Sign in with Google</span>
                    </button>
                    <button className="w-full bg-gray-800 hover:bg-gray-700 text-white font-semibold py-3 px-6 rounded-lg flex items-center justify-center gap-3 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg">
                        <FaGithub size={20} />
                        <span>Sign in with Github</span>
                    </button>
                </div>

                {/* Divider */}
                <div className="relative flex items-center mb-8">
                    <div className="flex-grow border-t border-gray-700"></div>
                    <span className="flex-shrink mx-4 text-gray-500 text-sm font-medium">Or continue with email</span>
                    <div className="flex-grow border-t border-gray-700"></div>
                </div>

                {/* Login Form */}
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                    <div className="relative">
                        <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                        <input
                            {...register("username")}
                            type="text"
                            placeholder="Username or Email"
                            className="w-full bg-gray-800 border border-gray-700 rounded-xl pl-12 pr-5 py-3.5 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent transition-colors text-base"
                        />
                        {errors.username && (
                            <p className="text-red-400 text-sm mt-1 absolute -bottom-6 left-0">{errors.username.message}</p>
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

                    <div className="flex items-center justify-between text-sm">
                        <label className="flex items-center gap-2 text-gray-400 cursor-pointer">
                            <input
                                type="checkbox"
                                className="h-4 w-4 rounded bg-gray-800 border-gray-600 text-purple-600 focus:ring-purple-500"
                            />
                            Remember me
                        </label>
                        <Link href="/forgot-password" className="text-purple-500 hover:underline font-medium">
                            Forgot password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="w-full bg-purple-700 text-white py-3.5 px-6 rounded-xl font-bold text-lg hover:bg-purple-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 shadow-lg"
                    >
                        {isSubmitting ? "Signing In..." : "Sign In"}
                    </button>
                </form>

                {/* Footer Link */}
                <div className="text-center mt-10">
                    <p className="text-gray-400 text-base">
                        Don't have an account?{" "}
                        <Link href="/register" className="text-purple-500 hover:underline font-medium">
                            Sign Up
                        </Link>
                    </p>
                </div>
            </div>
    );
}
