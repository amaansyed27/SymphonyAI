import React from 'react';
import { X, CheckCircle } from 'lucide-react';
import { RoadmapStage } from '../types';
import NameLogoSection from './sections/NameLogoSection';
import StackSelectSection from './sections/StackSelectSection';
import FeatureBrainstormSection from './sections/FeatureBrainstormSection';
import UIDesignSection from './sections/UIDesignSection';
import UIFlowSection from './sections/UIFlowSection';
import BuilderToolsSection from './sections/BuilderToolsSection';
import DeploymentSection from './sections/DeploymentSection';

interface SidePanelProps {
  isOpen: boolean;
  onClose: () => void;
  currentStage: RoadmapStage | null;
  projectData: any;
  onUpdateProject: (updates: any) => void;
  onMarkCompleted: (stageId: string) => void;
  apiKey: string;
}

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  onClose,
  currentStage,
  projectData,
  onUpdateProject,
  onMarkCompleted,
  apiKey
}) => {
  const renderSectionContent = () => {
    if (!currentStage) return null;

    switch (currentStage.id) {
      case 'name-logo':
        return <NameLogoSection projectData={projectData} onUpdate={onUpdateProject} apiKey={apiKey} />;
      case 'stack-select':
        return <StackSelectSection projectData={projectData} onUpdate={onUpdateProject} apiKey={apiKey} />;
      case 'feature-brainstorm':
        return <FeatureBrainstormSection projectData={projectData} onUpdate={onUpdateProject} apiKey={apiKey} />;
      case 'ui-design':
        return <UIDesignSection projectData={projectData} onUpdate={onUpdateProject} apiKey={apiKey} />;
      case 'ui-flow':
        return <UIFlowSection projectData={projectData} onUpdate={onUpdateProject} apiKey={apiKey} />;
      case 'builder-tools':
        return <BuilderToolsSection projectData={projectData} onUpdate={onUpdateProject} apiKey={apiKey} />;
      case 'deployment':
        return <DeploymentSection projectData={projectData} onUpdate={onUpdateProject} apiKey={apiKey} />;
      default:
        return <div className="text-gray-400">Section coming soon...</div>;
    }
  };

  const checkStageCompletion = (stageId: string): boolean => {
    switch (stageId) {
      case 'name-logo':
        return !!(projectData.name && projectData.slogan);
      case 'stack-select':
        return !!projectData.techStack;
      case 'feature-brainstorm':
        return !!(projectData.decidedFeatures && projectData.decidedFeatures.length > 0);
      case 'ui-design':
        return !!projectData.uiStyle;
      case 'ui-flow':
        return !!(projectData.uiFlow && projectData.uiFlow.length > 0);
      case 'builder-tools':
        return !!projectData.builderTools;
      case 'deployment':
        return !!projectData.deployment;
      default:
        return false;
    }
  };

  const isStageCompleted = currentStage ? checkStageCompletion(currentStage.id) : false;
  const canMarkCompleted = currentStage && isStageCompleted && currentStage.status !== 'completed';

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full sm:max-w-2xl bg-slate-800 shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out border-l border-slate-700
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          overflow-y-auto
        `}
      >
        {currentStage && (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-slate-800 border-b border-slate-700 p-4 sm:p-6 z-10">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <h2 className="text-xl sm:text-2xl font-bold text-white truncate">{currentStage.title}</h2>
                    {currentStage.status === 'completed' && (
                      <CheckCircle className="h-5 sm:h-6 w-5 sm:w-6 text-green-400 flex-shrink-0" />
                    )}
                  </div>
                  <p className="text-gray-400 mt-1 text-sm sm:text-base">{currentStage.description}</p>
                  
                  {/* Stage Status */}
                  <div className="mt-3 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                    <div className={`px-3 py-1 rounded-full text-sm font-medium inline-block ${
                      currentStage.status === 'completed' 
                        ? 'bg-green-500/20 text-green-300'
                        : isStageCompleted
                        ? 'bg-blue-500/20 text-blue-300'
                        : 'bg-gray-500/20 text-gray-400'
                    }`}>
                      {currentStage.status === 'completed' 
                        ? 'Completed' 
                        : isStageCompleted 
                        ? 'Ready to Complete'
                        : 'In Progress'
                      }
                    </div>
                    
                    {canMarkCompleted && (
                      <button
                        onClick={() => onMarkCompleted(currentStage.id)}
                        className="flex items-center px-3 sm:px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Mark as Complete
                      </button>
                    )}
                  </div>
                </div>
                
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-slate-700 rounded-lg transition-colors ml-2 sm:ml-4 text-gray-400 hover:text-white flex-shrink-0"
                >
                  <X className="h-5 sm:h-6 w-5 sm:w-6" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-4 sm:p-6">
              {/* Completion Requirements */}
              {!isStageCompleted && (
                <div className="mb-4 sm:mb-6 p-3 sm:p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
                  <h3 className="font-medium text-blue-300 mb-2 text-sm sm:text-base">To complete this stage:</h3>
                  <ul className="text-sm text-blue-200 space-y-1">
                    {currentStage.id === 'name-logo' && (
                      <>
                        <li>• Choose a project name</li>
                        <li>• Create a slogan</li>
                        <li>• Optional: Generate a logo</li>
                      </>
                    )}
                    {currentStage.id === 'stack-select' && (
                      <li>• Select a technology stack</li>
                    )}
                    {currentStage.id === 'feature-brainstorm' && (
                      <li>• Select at least one feature for your project</li>
                    )}
                    {currentStage.id === 'ui-design' && (
                      <li>• Choose a color palette and design style</li>
                    )}
                    {currentStage.id === 'ui-flow' && (
                      <li>• Create or approve the user interface flow</li>
                    )}
                    {currentStage.id === 'builder-tools' && (
                      <li>• Review and select development tools</li>
                    )}
                    {currentStage.id === 'deployment' && (
                      <li>• Choose a deployment platform</li>
                    )}
                  </ul>
                </div>
              )}

              <div className="text-gray-300">
                {renderSectionContent()}
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SidePanel;