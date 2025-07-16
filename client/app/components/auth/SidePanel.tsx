import React from 'react';
import { FiUserPlus, FiLogIn, FiCheckCircle } from 'react-icons/fi';

interface StepProps {
    icon: React.ReactNode;
    title: string;
    isActive: boolean;
}

const Step = ({ icon, title, isActive }: StepProps) => (
    <div className={`flex items-center space-x-4 rounded-lg p-4 min-w-[300px] transition-all duration-300 ${
        isActive ? 'bg-white/20 scale-105 shadow-lg' : 'bg-black/20'
    }`}>
        <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${
            isActive ? 'bg-white' : 'bg-gray-600'
        }`}>
            {icon}
        </div>
        <span className={`text-lg font-medium transition-colors duration-300 ${
            isActive ? 'text-white' : 'text-gray-300'
        }`}>{title}</span>
    </div>
);

interface SidePanelProps {
    title?: string;
    description?: string;
    isLogin?: boolean;
}

export default function SidePanel({ 
    title = "Get Started with Us", 
    description = "Complete these easy steps to register\nyour account.",
    isLogin = false 
}: SidePanelProps) {
    
    const steps = isLogin 
    ? [
        { icon: <FiLogIn className="text-purple-700" size={20} />, title: "Enter Credentials", isActive: true },
        { icon: <FiCheckCircle className="text-gray-400" size={20} />, title: "Access Dashboard", isActive: false },
        { icon: <FiUserPlus className="text-gray-400" size={20} />, title: "Start Collaborating", isActive: false }
    ] 
    : [
        { icon: <FiUserPlus className="text-purple-700" size={20} />, title: "Sign Up Your Account", isActive: true },
        { icon: <FiCheckCircle className="text-gray-400" size={20} />, title: "Set Up Workspace", isActive: false },
        { icon: <FiUserPlus className="text-gray-400" size={20} />, title: "Set up your profile", isActive: false }
    ];

    return(
        <div className="bg-gradient-to-br from-purple-700 via-purple-800 to-indigo-900 text-white p-12 flex flex-col justify-center items-center min-h-screen">
            <div className="text-center mb-16">
                <div className="flex items-center justify-center mb-8">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mr-4 shadow-lg">
                        <span className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-indigo-800">
                            S
                        </span>
                    </div>
                    <h1 className="text-3xl font-bold tracking-wider">SkillSwap</h1>
                </div>
                
                <h2 className="text-5xl font-extrabold mb-4 text-shadow-lg">{title}</h2>
                <p className="text-purple-200 text-xl whitespace-pre-line leading-relaxed">
                    {description}
                </p>
            </div>
            
            <div className="space-y-6 w-full max-w-sm">
                {steps.map((step, index) => (
                    <Step key={index} {...step} />
                ))}
            </div>
        </div>
    )
}