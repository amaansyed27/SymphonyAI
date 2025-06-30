import React from 'react';
import { X } from 'lucide-react';
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
  apiKey: string;
}

const SidePanel: React.FC<SidePanelProps> = ({
  isOpen,
  onClose,
  currentStage,
  projectData,
  onUpdateProject,
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
        return <div className="text-gray-600">Section coming soon...</div>;
    }
  };

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40 transition-opacity duration-300"
          onClick={onClose}
        />
      )}

      {/* Panel */}
      <div
        className={`
          fixed top-0 right-0 h-full w-full max-w-2xl bg-white shadow-2xl z-50
          transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
          overflow-y-auto
        `}
      >
        {currentStage && (
          <>
            {/* Header */}
            <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">{currentStage.title}</h2>
                  <p className="text-gray-600 mt-1">{currentStage.description}</p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="h-6 w-6 text-gray-600" />
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6">
              {renderSectionContent()}
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default SidePanel;