import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { RoadmapStage } from '../types';
import { 
  Sparkles, 
  Settings, 
  Lightbulb, 
  Palette, 
  GitBranch, 
  Code, 
  Database,
  Rocket,
  Lock,
  CheckCircle,
  Zap
} from 'lucide-react';

interface RoadmapPathProps {
  stages: RoadmapStage[];
  onStageClick: (stage: RoadmapStage) => void;
}

const RoadmapPath: React.FC<RoadmapPathProps> = ({ stages, onStageClick }) => {
  const [hoveredStage, setHoveredStage] = useState<string | null>(null);
  const [particles, setParticles] = useState<Array<{id: number, x: number, y: number}>>([]);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 10000);
    return () => clearInterval(interval);
  }, []);

  const getIcon = (iconName: string) => {
    const icons = {
      'sparkles': Sparkles,
      'settings': Settings,
      'lightbulb': Lightbulb,
      'palette': Palette,
      'git-branch': GitBranch,
      'code': Code,
      'database': Database,
      'rocket': Rocket
    };
    const IconComponent = icons[iconName as keyof typeof icons] || Sparkles;
    return <IconComponent className="h-6 w-6" />;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-5 w-5 text-green-400" />;
      case 'locked':
        return <Lock className="h-5 w-5 text-gray-500" />;
      default:
        return null;
    }
  };

  const getStageColors = (status: string) => {
    switch (status) {
      case 'completed':
        return {
          gradient: 'from-green-500 via-emerald-500 to-green-600',
          border: 'border-green-400',
          glow: 'shadow-green-500/50',
          text: 'text-white'
        };
      case 'available':
        return {
          gradient: 'from-blue-500 via-purple-500 to-pink-500',
          border: 'border-blue-400',
          glow: 'shadow-blue-500/50',
          text: 'text-white'
        };
      case 'locked':
        return {
          gradient: 'from-gray-600 to-gray-700',
          border: 'border-gray-500',
          glow: 'shadow-gray-500/20',
          text: 'text-gray-300'
        };
      default:
        return {
          gradient: 'from-gray-600 to-gray-700',
          border: 'border-gray-500',
          glow: 'shadow-gray-500/20',
          text: 'text-gray-300'
        };
    }
  };

  const getConnectionOpacity = (fromStage: RoadmapStage, toStage: RoadmapStage) => {
    if (fromStage.status === 'completed') return 1;
    if (fromStage.status === 'available') return 0.6;
    return 0.2;
  };

  return (
    <div className="relative w-full h-full p-8 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400/30 rounded-full"
            initial={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`,
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              x: `${(particle.x + 20) % 100}%`,
              y: `${(particle.y + 15) % 100}%`,
              scale: [0, 1, 0],
              opacity: [0, 0.6, 0]
            }}
            transition={{ 
              duration: 8,
              repeat: Infinity,
              ease: "linear"
            }}
          />
        ))}
      </div>

      {/* Connecting Lines with Animation */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="50%" stopColor="#8B5CF6" />
            <stop offset="100%" stopColor="#EC4899" />
          </linearGradient>
          <linearGradient id="completedGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10B981" />
            <stop offset="100%" stopColor="#059669" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {stages.slice(0, -1).map((stage, index) => {
          const nextStage = stages[index + 1];
          const opacity = getConnectionOpacity(stage, nextStage);
          const isCompleted = stage.status === 'completed';
          
          return (
            <motion.line
              key={`line-${stage.id}`}
              x1={`${stage.position.x}%`}
              y1={`${stage.position.y}%`}
              x2={`${nextStage.position.x}%`}
              y2={`${nextStage.position.y}%`}
              stroke={isCompleted ? "url(#completedGradient)" : "url(#pathGradient)"}
              strokeWidth="3"
              strokeDasharray={isCompleted ? "0" : "8,8"}
              opacity={opacity}
              filter="url(#glow)"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1, delay: index * 0.2 }}
            />
          );
        })}
      </svg>

      {/* Stage Cards */}
      {stages.map((stage, index) => {
        const colors = getStageColors(stage.status);
        const isHovered = hoveredStage === stage.id;
        
        return (
          <motion.div
            key={stage.id}
            className="absolute transform -translate-x-1/2 -translate-y-1/2"
            style={{
              left: `${stage.position.x}%`,
              top: `${stage.position.y}%`
            }}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ 
              duration: 0.6, 
              delay: index * 0.1,
              type: "spring",
              stiffness: 100
            }}
            onMouseEnter={() => setHoveredStage(stage.id)}
            onMouseLeave={() => setHoveredStage(null)}
            onClick={() => stage.status !== 'locked' && onStageClick(stage)}
          >
            <div
              className={`
                relative group
                ${stage.status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}
                transition-all duration-300
              `}
            >
              {/* Glow Effect */}
              <motion.div
                className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${colors.gradient} opacity-20 blur-xl`}
                animate={{
                  scale: isHovered ? 1.2 : 1,
                  opacity: isHovered ? 0.4 : 0.2
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Main Card */}
              <motion.div
                className={`
                  relative w-24 h-24 rounded-2xl border-2 ${colors.border}
                  bg-gradient-to-br ${colors.gradient} ${colors.text}
                  flex items-center justify-center shadow-xl ${colors.glow}
                  transition-all duration-300
                `}
                whileHover={{ 
                  scale: stage.status !== 'locked' ? 1.1 : 1,
                  rotate: stage.status !== 'locked' ? [0, -2, 2, 0] : 0
                }}
                whileTap={{ scale: stage.status !== 'locked' ? 0.95 : 1 }}
                animate={{
                  boxShadow: stage.status === 'available' && isHovered 
                    ? '0 0 30px rgba(59, 130, 246, 0.6)' 
                    : stage.status === 'completed'
                    ? '0 0 20px rgba(16, 185, 129, 0.4)'
                    : '0 10px 25px rgba(0, 0, 0, 0.3)'
                }}
              >
                {/* Animated Background Pattern */}
                {stage.status === 'available' && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.1) 0%, transparent 70%)'
                    }}
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.3, 0.6, 0.3]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                {/* Icon */}
                <motion.div
                  animate={{
                    rotate: stage.status === 'available' && isHovered ? 360 : 0
                  }}
                  transition={{ duration: 0.6 }}
                >
                  {getIcon(stage.icon)}
                </motion.div>

                {/* Pulse Effect for Available Stages */}
                {stage.status === 'available' && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl border-2 border-blue-400"
                    animate={{
                      scale: [1, 1.2, 1],
                      opacity: [0.5, 0, 0.5]
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}
              </motion.div>

              {/* Status Badge */}
              <AnimatePresence>
                {getStatusIcon(stage.status) && (
                  <motion.div
                    className="absolute -top-2 -right-2 bg-slate-800 rounded-full p-1 shadow-lg border border-slate-600"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {getStatusIcon(stage.status)}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Stage Number */}
              <motion.div
                className="absolute -top-3 -left-3 w-8 h-8 bg-slate-800 border border-slate-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-lg"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.1 }}
              >
                {index + 1}
              </motion.div>

              {/* Enhanced Tooltip */}
              <AnimatePresence>
                {isHovered && (
                  <motion.div
                    className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 pointer-events-none z-10"
                    initial={{ opacity: 0, y: -10, scale: 0.8 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="bg-slate-800 border border-slate-600 text-white px-4 py-3 rounded-xl shadow-2xl max-w-xs">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-sm">{stage.title}</h3>
                        {stage.status === 'available' && (
                          <Zap className="h-4 w-4 text-yellow-400" />
                        )}
                      </div>
                      <p className="text-xs text-gray-300 leading-relaxed">{stage.description}</p>
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded-full ${
                          stage.status === 'completed' 
                            ? 'bg-green-500/20 text-green-300'
                            : stage.status === 'available'
                            ? 'bg-blue-500/20 text-blue-300'
                            : 'bg-gray-500/20 text-gray-400'
                        }`}>
                          {stage.status === 'completed' ? 'Completed' : 
                           stage.status === 'available' ? 'Click to start' : 'Locked'}
                        </span>
                      </div>
                    </div>
                    {/* Tooltip Arrow */}
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-slate-800 border-l border-t border-slate-600 rotate-45"></div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Click Ripple Effect */}
              {stage.status !== 'locked' && (
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  initial={false}
                  whileTap={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.3) 0%, transparent 70%)"
                  }}
                />
              )}
            </div>
          </motion.div>
        );
      })}
    </div>
  );
};

export default RoadmapPath;