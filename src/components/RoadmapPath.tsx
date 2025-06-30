import React from 'react';
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
  CheckCircle
} from 'lucide-react';

interface RoadmapPathProps {
  stages: RoadmapStage[];
  onStageClick: (stage: RoadmapStage) => void;
}

const RoadmapPath: React.FC<RoadmapPathProps> = ({ stages, onStageClick }) => {
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
        return <Lock className="h-5 w-5 text-gray-400" />;
      default:
        return null;
    }
  };

  const getStageColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'from-green-500 to-emerald-500 border-green-400';
      case 'available':
        return 'from-blue-500 to-purple-500 border-blue-400';
      case 'locked':
        return 'from-gray-400 to-gray-500 border-gray-300';
      default:
        return 'from-gray-400 to-gray-500 border-gray-300';
    }
  };

  return (
    <div className="relative w-full h-full p-8">
      {/* Connecting Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none">
        {stages.slice(0, -1).map((stage, index) => {
          const nextStage = stages[index + 1];
          return (
            <line
              key={`line-${stage.id}`}
              x1={`${stage.position.x}%`}
              y1={`${stage.position.y}%`}
              x2={`${nextStage.position.x}%`}
              y2={`${nextStage.position.y}%`}
              stroke="url(#pathGradient)"
              strokeWidth="3"
              strokeDasharray={stage.status === 'completed' ? "0" : "8,8"}
              className="transition-all duration-500"
            />
          );
        })}
        <defs>
          <linearGradient id="pathGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3B82F6" />
            <stop offset="100%" stopColor="#8B5CF6" />
          </linearGradient>
        </defs>
      </svg>

      {/* Stage Cards */}
      {stages.map((stage, index) => (
        <div
          key={stage.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 cursor-pointer"
          style={{
            left: `${stage.position.x}%`,
            top: `${stage.position.y}%`
          }}
          onClick={() => stage.status !== 'locked' && onStageClick(stage)}
        >
          <div
            className={`
              relative group
              ${stage.status === 'locked' ? 'cursor-not-allowed' : 'cursor-pointer'}
              transition-all duration-300 transform hover:scale-110
            `}
          >
            {/* Main Card */}
            <div
              className={`
                w-24 h-24 rounded-2xl border-3 shadow-lg
                bg-gradient-to-br ${getStageColor(stage.status)}
                flex items-center justify-center text-white
                transition-all duration-300
                ${stage.status !== 'locked' ? 'hover:shadow-2xl hover:shadow-blue-500/25' : ''}
              `}
            >
              {getIcon(stage.icon)}
            </div>

            {/* Status Badge */}
            {getStatusIcon(stage.status) && (
              <div className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-lg">
                {getStatusIcon(stage.status)}
              </div>
            )}

            {/* Stage Number */}
            <div className="absolute -top-3 -left-3 w-8 h-8 bg-white rounded-full flex items-center justify-center text-sm font-bold text-gray-700 shadow-lg">
              {index + 1}
            </div>

            {/* Tooltip */}
            <div className="absolute top-full mt-4 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
              <div className="bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap shadow-lg">
                {stage.title}
                <div className="text-xs text-gray-300 mt-1">{stage.description}</div>
              </div>
              <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-2 bg-gray-900 rotate-45"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default RoadmapPath;