import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  showText?: boolean;
  textSize?: 'sm' | 'md' | 'lg';
}

const Logo: React.FC<LogoProps> = ({ 
  size = 32, 
  className = '', 
  showText = false, 
  textSize = 'md' 
}) => {
  const getTextClasses = () => {
    switch (textSize) {
      case 'sm':
        return 'text-lg font-bold text-gray-900';
      case 'lg':
        return 'text-3xl font-bold text-white';
      default:
        return 'text-xl font-bold text-gray-900';
    }
  };

  return (
    <div className={`flex items-center space-x-3 ${className}`}>
      <svg 
        width={size} 
        height={size} 
        viewBox="0 0 64 64" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        className="flex-shrink-0"
      >
        <defs>
          <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style={{ stopColor: '#3B82F6', stopOpacity: 1 }} />
            <stop offset="50%" style={{ stopColor: '#8B5CF6', stopOpacity: 1 }} />
            <stop offset="100%" style={{ stopColor: '#EC4899', stopOpacity: 1 }} />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge> 
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Background circle */}
        <circle cx="32" cy="32" r="30" fill="url(#logoGradient)" opacity="0.1"/>
        
        {/* Main logo shape - stylized S for Symphony */}
        <path 
          d="M20 16 C20 16, 28 12, 36 16 C44 20, 44 28, 36 32 C28 36, 28 36, 36 40 C44 44, 44 52, 36 56 C28 60, 20 56, 20 56" 
          stroke="url(#logoGradient)" 
          strokeWidth="4" 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          fill="none"
          filter="url(#glow)"
        />
        
        {/* Musical note elements */}
        <circle cx="24" cy="20" r="2" fill="url(#logoGradient)" opacity="0.8"/>
        <circle cx="40" cy="24" r="1.5" fill="url(#logoGradient)" opacity="0.6"/>
        <circle cx="24" cy="44" r="1.5" fill="url(#logoGradient)" opacity="0.6"/>
        <circle cx="40" cy="48" r="2" fill="url(#logoGradient)" opacity="0.8"/>
        
        {/* Sparkle effects */}
        <path d="M48 20 L50 18 L52 20 L50 22 Z" fill="url(#logoGradient)" opacity="0.7"/>
        <path d="M16 44 L17 42 L18 44 L17 46 Z" fill="url(#logoGradient)" opacity="0.5"/>
      </svg>
      
      {showText && (
        <div>
          <h1 className={getTextClasses()}>Symphony</h1>
        </div>
      )}
    </div>
  );
};

export default Logo;