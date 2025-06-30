import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface BootloaderProps {
  onComplete: () => void;
}

const Bootloader: React.FC<BootloaderProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    'Initializing Symphony...',
    'Loading AI Engine...',
    'Preparing Project Planner...',
    'Ready to Create!'
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress(prev => {
        const newProgress = prev + 2;
        
        // Update step based on progress
        if (newProgress >= 25 && currentStep === 0) setCurrentStep(1);
        if (newProgress >= 50 && currentStep === 1) setCurrentStep(2);
        if (newProgress >= 75 && currentStep === 2) setCurrentStep(3);
        
        if (newProgress >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        
        return newProgress;
      });
    }, 50);

    return () => clearInterval(timer);
  }, [currentStep, onComplete]);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center z-50">
      {/* Animated background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-blue-400 rounded-full opacity-30"
            animate={{
              x: [0, Math.random() * window.innerWidth],
              y: [0, Math.random() * window.innerHeight],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              left: Math.random() * window.innerWidth,
              top: Math.random() * window.innerHeight,
            }}
          />
        ))}
      </div>

      <div className="relative text-center">
        {/* Logo Container */}
        <div className="mb-8 relative">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="relative"
          >
            {/* Glow effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full blur-xl opacity-50 animate-pulse" />
            
            {/* Logo SVG with animated fill */}
            <div className="relative w-24 h-24 mx-auto">
              <svg width="96" height="96" viewBox="0 0 64 64" className="w-full h-full">
                <defs>
                  <linearGradient id="bootloaderGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
                    <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
                  </linearGradient>
                  <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" style={{ stopColor: '#60A5FA', stopOpacity: 1 }} />
                    <stop offset="100%" style={{ stopColor: '#A78BFA', stopOpacity: 1 }} />
                  </linearGradient>
                </defs>
                
                {/* Background circle */}
                <circle cx="32" cy="32" r="30" fill="url(#bootloaderGradient)" opacity="0.1"/>
                
                {/* Main S path with animated stroke */}
                <motion.path 
                  d="M20 16 C20 16, 28 12, 36 16 C44 20, 44 28, 36 32 C28 36, 28 36, 36 40 C44 44, 44 52, 36 56 C28 60, 20 56, 20 56"
                  stroke="url(#progressGradient)"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  fill="none"
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: progress / 100 }}
                  transition={{ duration: 0.5, ease: "easeInOut" }}
                />
                
                {/* Animated musical notes */}
                <motion.circle 
                  cx="24" cy="20" r="2" 
                  fill="url(#bootloaderGradient)" 
                  initial={{ scale: 0 }}
                  animate={{ scale: progress > 25 ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.circle 
                  cx="40" cy="24" r="1.5" 
                  fill="url(#bootloaderGradient)" 
                  initial={{ scale: 0 }}
                  animate={{ scale: progress > 50 ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.circle 
                  cx="24" cy="44" r="1.5" 
                  fill="url(#bootloaderGradient)" 
                  initial={{ scale: 0 }}
                  animate={{ scale: progress > 75 ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <motion.circle 
                  cx="40" cy="48" r="2" 
                  fill="url(#bootloaderGradient)" 
                  initial={{ scale: 0 }}
                  animate={{ scale: progress > 90 ? 1 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                
                {/* Sparkle effects */}
                <motion.path 
                  d="M48 20 L50 18 L52 20 L50 22 Z" 
                  fill="url(#bootloaderGradient)" 
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ 
                    scale: progress > 60 ? 1 : 0,
                    rotate: progress > 60 ? 360 : 0
                  }}
                  transition={{ duration: 0.5 }}
                />
                <motion.path 
                  d="M16 44 L17 42 L18 44 L17 46 Z" 
                  fill="url(#bootloaderGradient)" 
                  initial={{ scale: 0, rotate: 0 }}
                  animate={{ 
                    scale: progress > 80 ? 1 : 0,
                    rotate: progress > 80 ? -360 : 0
                  }}
                  transition={{ duration: 0.5 }}
                />
              </svg>
            </div>
          </motion.div>
        </div>

        {/* App Name */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.8 }}
          className="text-4xl font-bold text-white mb-2"
        >
          Symphony
        </motion.h1>
        
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8, duration: 0.8 }}
          className="text-blue-200 text-lg mb-8"
        >
          AI Project Planner
        </motion.p>

        {/* Progress Bar */}
        <div className="w-80 mx-auto mb-6">
          <div className="bg-slate-800 rounded-full h-2 overflow-hidden">
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.3, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between text-xs text-blue-300 mt-2">
            <span>0%</span>
            <span>{Math.round(progress)}%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Loading Steps */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 0.5 }}
          className="text-blue-200"
        >
          <motion.p
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="text-sm"
          >
            {steps[currentStep]}
          </motion.p>
        </motion.div>
      </div>
    </div>
  );
};

export default Bootloader;