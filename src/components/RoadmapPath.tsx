import React, { useState, useEffect, useRef } from 'react';
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
  const [tooltipPosition, setTooltipPosition] = useState<{x: number, y: number} | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const tooltipRef = useRef<HTMLDivElement>(null);

  // Generate floating particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100
      }));
      setParticles(newParticles);
    };

    generateParticles();
    const interval = setInterval(generateParticles, 8000);
    return () => clearInterval(interval);
  }, []);

  // Calculate tooltip position to keep it in bounds
  const calculateTooltipPosition = (stagePosition: {x: number, y: number}) => {
    if (!containerRef.current || !tooltipRef.current) return { x: 50, y: 50 };

    const container = containerRef.current.getBoundingClientRect();
    const tooltip = tooltipRef.current.getBoundingClientRect();
    
    // Convert percentage to pixels
    const stageX = (stagePosition.x / 100) * container.width;
    const stageY = (stagePosition.y / 100) * container.height;
    
    // Calculate initial position (below the stage)
    let tooltipX = stageX - tooltip.width / 2;
    let tooltipY = stageY + 60; // 60px below the stage
    
    // Adjust horizontal position if tooltip goes out of bounds
    if (tooltipX < 10) {
      tooltipX = 10;
    } else if (tooltipX + tooltip.width > container.width - 10) {
      tooltipX = container.width - tooltip.width - 10;
    }
    
    // Adjust vertical position if tooltip goes out of bounds
    if (tooltipY + tooltip.height > container.height - 10) {
      tooltipY = stageY - tooltip.height - 20; // Show above the stage
    }
    
    // Convert back to percentages
    return {
      x: (tooltipX / container.width) * 100,
      y: (tooltipY / container.height) * 100
    };
  };

  const handleStageHover = (stage: RoadmapStage) => {
    setHoveredStage(stage.id);
    // Small delay to ensure tooltip is rendered before calculating position
    setTimeout(() => {
      const position = calculateTooltipPosition(stage.position);
      setTooltipPosition(position);
    }, 10);
  };

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
          text: 'text-white',
          bgGlow: 'bg-green-500/20'
        };
      case 'available':
        return {
          gradient: 'from-blue-500 via-purple-500 to-pink-500',
          border: 'border-blue-400',
          glow: 'shadow-blue-500/50',
          text: 'text-white',
          bgGlow: 'bg-blue-500/20'
        };
      case 'locked':
        return {
          gradient: 'from-gray-600 to-gray-700',
          border: 'border-gray-500',
          glow: 'shadow-gray-500/20',
          text: 'text-gray-300',
          bgGlow: 'bg-gray-500/10'
        };
      default:
        return {
          gradient: 'from-gray-600 to-gray-700',
          border: 'border-gray-500',
          glow: 'shadow-gray-500/20',
          text: 'text-gray-300',
          bgGlow: 'bg-gray-500/10'
        };
    }
  };

  const getConnectionOpacity = (fromStage: RoadmapStage, toStage: RoadmapStage) => {
    if (fromStage.status === 'completed') return 1;
    if (fromStage.status === 'available') return 0.6;
    return 0.2;
  };

  const hoveredStageData = stages.find(stage => stage.id === hoveredStage);

  return (
    <div ref={containerRef} className="relative w-full h-full p-8 overflow-hidden">
      {/* Animated Background Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute w-1 h-1 bg-blue-400/20 rounded-full"
            initial={{ 
              x: `${particle.x}%`, 
              y: `${particle.y}%`,
              scale: 0,
              opacity: 0
            }}
            animate={{ 
              x: `${(particle.x + 25) % 100}%`,
              y: `${(particle.y + 20) % 100}%`,
              scale: [0, 1, 0],
              opacity: [0, 0.4, 0]
            }}
            transition={{ 
              duration: 10,
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
            onMouseEnter={() => handleStageHover(stage)}
            onMouseLeave={() => {
              setHoveredStage(null);
              setTooltipPosition(null);
            }}
            onClick={() => stage.status !== 'locked' && onStageClick(stage)}
          >
            <div
              className={`
                relative group
                ${stage.status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}
                transition-all duration-300
              `}
            >
              {/* Enhanced Glow Effect */}
              <motion.div
                className={`absolute inset-0 rounded-2xl ${colors.bgGlow} blur-xl`}
                animate={{
                  scale: isHovered ? 1.4 : 1,
                  opacity: isHovered ? 0.6 : stage.status === 'available' ? 0.3 : 0.1
                }}
                transition={{ duration: 0.3 }}
              />

              {/* Main Card with Enhanced Design */}
              <motion.div
                className={`
                  relative w-28 h-28 rounded-2xl border-2 ${colors.border}
                  bg-gradient-to-br ${colors.gradient} ${colors.text}
                  flex items-center justify-center shadow-2xl ${colors.glow}
                  transition-all duration-300 backdrop-blur-sm
                `}
                whileHover={{ 
                  scale: stage.status !== 'locked' ? 1.1 : 1,
                  rotate: stage.status !== 'locked' ? [0, -1, 1, 0] : 0
                }}
                whileTap={{ scale: stage.status !== 'locked' ? 0.95 : 1 }}
                animate={{
                  boxShadow: stage.status === 'available' && isHovered 
                    ? '0 0 40px rgba(59, 130, 246, 0.8)' 
                    : stage.status === 'completed'
                    ? '0 0 25px rgba(16, 185, 129, 0.5)'
                    : '0 15px 35px rgba(0, 0, 0, 0.4)'
                }}
              >
                {/* Animated Background Pattern for Available Stages */}
                {stage.status === 'available' && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl"
                    style={{
                      background: 'radial-gradient(circle at 50% 50%, rgba(255,255,255,0.15) 0%, transparent 70%)'
                    }}
                    animate={{
                      scale: [1, 1.3, 1],
                      opacity: [0.2, 0.5, 0.2]
                    }}
                    transition={{
                      duration: 2.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                )}

                {/* Icon with Enhanced Animation */}
                <motion.div
                  animate={{
                    rotate: stage.status === 'available' && isHovered ? 360 : 0,
                    scale: isHovered ? 1.1 : 1
                  }}
                  transition={{ duration: 0.6 }}
                  className="relative z-10"
                >
                  {getIcon(stage.icon)}
                </motion.div>

                {/* Enhanced Pulse Effect for Available Stages */}
                {stage.status === 'available' && (
                  <>
                    <motion.div
                      className="absolute inset-0 rounded-2xl border-2 border-blue-400"
                      animate={{
                        scale: [1, 1.3, 1],
                        opacity: [0.6, 0, 0.6]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    <motion.div
                      className="absolute inset-0 rounded-2xl border border-purple-400"
                      animate={{
                        scale: [1, 1.5, 1],
                        opacity: [0.4, 0, 0.4]
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 0.5
                      }}
                    />
                  </>
                )}
              </motion.div>

              {/* Enhanced Status Badge */}
              <AnimatePresence>
                {getStatusIcon(stage.status) && (
                  <motion.div
                    className="absolute -top-2 -right-2 bg-slate-800 rounded-full p-1.5 shadow-xl border border-slate-600"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    {getStatusIcon(stage.status)}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Enhanced Stage Number */}
              <motion.div
                className="absolute -top-3 -left-3 w-9 h-9 bg-slate-800 border-2 border-slate-600 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-xl"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 0.3 }}
                whileHover={{ scale: 1.15 }}
              >
                {index + 1}
              </motion.div>

              {/* Click Ripple Effect */}
              {stage.status !== 'locked' && (
                <motion.div
                  className="absolute inset-0 rounded-2xl pointer-events-none"
                  initial={false}
                  whileTap={{
                    background: "radial-gradient(circle, rgba(255,255,255,0.4) 0%, transparent 70%)"
                  }}
                />
              )}
            </div>
          </motion.div>
        );
      })}

      {/* Enhanced Tooltip with Smart Positioning */}
      <AnimatePresence>
        {hoveredStage && hoveredStageData && tooltipPosition && (
          <motion.div
            ref={tooltipRef}
            className="absolute pointer-events-none z-20"
            style={{
              left: `${tooltipPosition.x}%`,
              top: `${tooltipPosition.y}%`
            }}
            initial={{ opacity: 0, y: -10, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            <div className="bg-slate-800/95 backdrop-blur-lg border border-slate-600 text-white px-5 py-4 rounded-xl shadow-2xl max-w-xs">
              <div className="flex items-center space-x-3 mb-3">
                <div className={`p-2 rounded-lg ${getStageColors(hoveredStageData.status).bgGlow}`}>
                  {getIcon(hoveredStageData.icon)}
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-white">{hoveredStageData.title}</h3>
                  {hoveredStageData.status === 'available' && (
                    <div className="flex items-center space-x-1 mt-1">
                      <Zap className="h-3 w-3 text-yellow-400" />
                      <span className="text-xs text-yellow-300">Ready to start</span>
                    </div>
                  )}
                </div>
              </div>
              
              <p className="text-xs text-gray-300 leading-relaxed mb-3">
                {hoveredStageData.description}
              </p>
              
              <div className="flex items-center justify-between">
                <span className={`inline-block px-3 py-1 text-xs rounded-full font-medium ${
                  hoveredStageData.status === 'completed' 
                    ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                    : hoveredStageData.status === 'available'
                    ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                    : 'bg-gray-500/20 text-gray-400 border border-gray-500/30'
                }`}>
                  {hoveredStageData.status === 'completed' ? '✓ Completed' : 
                   hoveredStageData.status === 'available' ? '→ Click to start' : '🔒 Locked'}
                </span>
                
                {hoveredStageData.status === 'available' && (
                  <motion.div
                    animate={{ x: [0, 3, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="text-blue-400"
                  >
                    →
                  </motion.div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default RoadmapPath;