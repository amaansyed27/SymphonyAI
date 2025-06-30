import React, { useState, useEffect } from 'react';
import { ProjectData, RoadmapStage } from './types';
import LandingPage from './components/LandingPage';
import Questionnaire from './components/Questionnaire';
import RoadmapPath from './components/RoadmapPath';
import SidePanel from './components/SidePanel';
import APIKeyManager from './components/APIKeyManager';
import DocumentationModal from './components/DocumentationModal';
import Bootloader from './components/Bootloader';
import Logo from './components/Logo';
import { Settings, FileText, CheckCircle, ArrowLeft } from 'lucide-react';

const ROADMAP_STAGES: RoadmapStage[] = [
  {
    id: 'name-logo',
    title: 'Name & Logo',
    description: 'Generate project name, slogan, and logo concepts',
    status: 'available',
    icon: 'sparkles',
    position: { x: 15, y: 20 }
  },
  {
    id: 'stack-select',
    title: 'Stack Select',
    description: 'Choose your technology stack and tools',
    status: 'locked',
    icon: 'settings',
    position: { x: 35, y: 40 }
  },
  {
    id: 'feature-brainstorm',
    title: 'Feature Brainstorm',
    description: 'Define core features and brainstorm additions',
    status: 'locked',
    icon: 'lightbulb',
    position: { x: 15, y: 60 }
  },
  {
    id: 'ui-design',
    title: 'UI Design',
    description: 'Design color palettes and visual style',
    status: 'locked',
    icon: 'palette',
    position: { x: 65, y: 25 }
  },
  {
    id: 'ui-flow',
    title: 'UI Flow',
    description: 'Map out user interface flow and navigation',
    status: 'locked',
    icon: 'git-branch',
    position: { x: 85, y: 45 }
  },
  {
    id: 'builder-tools',
    title: 'Builder Tools',
    description: 'Get AI tool recommendations and custom prompts',
    status: 'locked',
    icon: 'code',
    position: { x: 65, y: 70 }
  },
  {
    id: 'deployment',
    title: 'Deployment',
    description: 'Choose deployment platform and strategy',
    status: 'locked',
    icon: 'rocket',
    position: { x: 35, y: 85 }
  }
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<'landing' | 'questionnaire' | 'roadmap'>('landing');
  const [projectData, setProjectData] = useState<Partial<ProjectData>>({});
  const [roadmapStages, setRoadmapStages] = useState<RoadmapStage[]>(ROADMAP_STAGES);
  const [selectedStage, setSelectedStage] = useState<RoadmapStage | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [documentationModalOpen, setDocumentationModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('symphony-gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const handleBootloaderComplete = () => {
    setIsLoading(false);
  };

  const handleGetStarted = () => {
    setCurrentStep('questionnaire');
  };

  const handleBackToLanding = () => {
    setCurrentStep('landing');
    setProjectData({});
    setRoadmapStages(ROADMAP_STAGES);
    setSelectedStage(null);
    setSidePanelOpen(false);
  };

  const handleQuestionnaireComplete = (data: Partial<ProjectData>) => {
    const newProjectData = {
      ...data,
      id: 'project-' + Date.now(),
      features: [],
      decidedFeatures: []
    };
    
    setProjectData(newProjectData);
    setCurrentStep('roadmap');
    
    // Update stage availability (but don't mark anything as completed)
    updateStageAvailability(newProjectData);
  };

  const updateStageAvailability = (data: Partial<ProjectData>) => {
    const updatedStages = roadmapStages.map((stage, index) => {
      // Check if this stage is completed
      const isCompleted = checkStageCompletion(stage.id, data);
      
      if (isCompleted && stage.status === 'completed') {
        // Keep it completed if it was already marked as completed
        return { ...stage, status: 'completed' as const };
      }
      
      // First stage is always available
      if (index === 0) {
        return { ...stage, status: 'available' as const };
      }
      
      // Check if previous stages are completed
      const previousStagesCompleted = roadmapStages.slice(0, index).every(prevStage => {
        return prevStage.status === 'completed';
      });
      
      if (previousStagesCompleted) {
        return { ...stage, status: 'available' as const };
      }
      
      return { ...stage, status: 'locked' as const };
    });
    
    setRoadmapStages(updatedStages);
  };

  const checkStageCompletion = (stageId: string, data: Partial<ProjectData>): boolean => {
    switch (stageId) {
      case 'name-logo':
        return !!(data.name && data.slogan);
      case 'stack-select':
        return !!data.techStack;
      case 'feature-brainstorm':
        return !!(data.decidedFeatures && data.decidedFeatures.length > 0);
      case 'ui-design':
        return !!data.uiStyle;
      case 'ui-flow':
        return !!(data.uiFlow && data.uiFlow.length > 0);
      case 'builder-tools':
        return !!data.builderTools;
      case 'deployment':
        return !!data.deployment;
      default:
        return false;
    }
  };

  const markStageAsCompleted = (stageId: string) => {
    // Update the roadmap stages to show completion
    const updatedStages = roadmapStages.map(stage =>
      stage.id === stageId
        ? { ...stage, status: 'completed' as const }
        : stage
    );
    setRoadmapStages(updatedStages);
    
    // Update stage availability for next stages
    updateStageAvailability(projectData);
  };

  const handleStageClick = (stage: RoadmapStage) => {
    setSelectedStage(stage);
    setSidePanelOpen(true);
  };

  const handleProjectUpdate = (updates: Partial<ProjectData>) => {
    const updatedData = { ...projectData, ...updates };
    setProjectData(updatedData);
    
    // Update stage availability but don't auto-complete stages
    updateStageAvailability(updatedData);
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('symphony-gemini-api-key', key);
  };

  // Check if all stages are completed
  const allStagesCompleted = roadmapStages.every(stage => 
    stage.status === 'completed'
  );

  // Show bootloader on first load
  if (isLoading) {
    return <Bootloader onComplete={handleBootloaderComplete} />;
  }

  // Landing Page
  if (currentStep === 'landing') {
    return <LandingPage onGetStarted={handleGetStarted} />;
  }

  // Questionnaire
  if (currentStep === 'questionnaire') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Header with back button */}
        <header className="p-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button
              onClick={handleBackToLanding}
              className="flex items-center px-4 py-2 text-blue-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              Back to Home
            </button>
            <Logo size={48} showText textSize="md" />
          </div>
        </header>
        
        <div className="px-4">
          <Questionnaire onComplete={handleQuestionnaireComplete} />
        </div>
      </div>
    );
  }

  // Main App (Roadmap)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-900 to-slate-800">
      {/* Header */}
      <header className="bg-slate-800/80 backdrop-blur-lg border-b border-slate-700/50 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <button
                onClick={handleBackToLanding}
                className="flex items-center px-3 py-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-2" />
                Home
              </button>
              
              <div className="h-8 w-px bg-slate-600" />
              
              <div className="flex items-center space-x-3">
                {projectData.logo ? (
                  <img src={projectData.logo} alt="Project logo" className="h-10 w-10 object-contain" />
                ) : (
                  <Logo size={40} />
                )}
                <div>
                  <h1 className="text-xl font-bold text-white">
                    {projectData.name || 'Symphony'}
                  </h1>
                  {projectData.slogan && (
                    <p className="text-sm text-gray-400">
                      {projectData.slogan}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Generate Documentation Button */}
              {allStagesCompleted && (
                <button
                  onClick={() => setDocumentationModalOpen(true)}
                  className="flex items-center px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg"
                >
                  <FileText className="h-5 w-5 mr-2" />
                  Generate Docs
                </button>
              )}
              
              <button
                onClick={() => setApiKeyModalOpen(true)}
                className={`p-2 rounded-lg transition-colors ${
                  apiKey 
                    ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30' 
                    : 'bg-slate-700 text-gray-400 hover:bg-slate-600'
                }`}
                title={apiKey ? 'API Key Configured' : 'Configure API Key'}
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* All Stages Completed Banner */}
      {allStagesCompleted && (
        <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-3">
            <CheckCircle className="h-5 w-5" />
            <span className="font-medium">🎉 All stages completed! Your project plan is ready.</span>
            <button
              onClick={() => setDocumentationModalOpen(true)}
              className="ml-4 px-4 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
            >
              Generate Documentation
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">Project Planning Roadmap</h2>
            <p className="text-gray-400">Follow the path to build your {projectData.projectType}</p>
            <div className="mt-4 bg-slate-800/50 backdrop-blur-lg rounded-lg p-4 border border-slate-700/50">
              <p className="text-blue-300 text-sm">
                💡 Click on each stage to generate AI-powered content and customize your project plan. 
                Mark stages as complete when you're satisfied with the results.
              </p>
            </div>
          </div>

          {/* Roadmap */}
          <div className="bg-slate-800/30 backdrop-blur-lg rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
            <div style={{ height: '600px' }}>
              <RoadmapPath 
                stages={roadmapStages} 
                onStageClick={handleStageClick}
              />
            </div>
          </div>

          {/* Progress Summary */}
          <div className="mt-8 bg-slate-800/30 backdrop-blur-lg rounded-2xl border border-slate-700/50 p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Progress Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Completed', count: roadmapStages.filter(s => s.status === 'completed').length, color: 'green' },
                { label: 'Available', count: roadmapStages.filter(s => s.status === 'available').length, color: 'blue' },
                { label: 'Locked', count: roadmapStages.filter(s => s.status === 'locked').length, color: 'gray' },
                { label: 'Total', count: roadmapStages.length, color: 'purple' }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-2xl font-bold ${
                    stat.color === 'green' ? 'text-green-400' :
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'gray' ? 'text-gray-400' :
                    'text-purple-400'
                  }`}>{stat.count}</div>
                  <div className="text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {allStagesCompleted && (
              <div className="mt-4 p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-green-300 font-medium">Project planning complete!</span>
                  </div>
                  <button
                    onClick={() => setDocumentationModalOpen(true)}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                  >
                    View Documentation
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Side Panel */}
        <SidePanel
          isOpen={sidePanelOpen}
          onClose={() => setSidePanelOpen(false)}
          currentStage={selectedStage}
          projectData={projectData}
          onUpdateProject={handleProjectUpdate}
          onMarkCompleted={markStageAsCompleted}
          apiKey={apiKey}
        />

        {/* API Key Modal */}
        <APIKeyManager
          isOpen={apiKeyModalOpen}
          onClose={() => setApiKeyModalOpen(false)}
          apiKey={apiKey}
          onSaveApiKey={handleSaveApiKey}
        />

        {/* Documentation Modal */}
        <DocumentationModal
          isOpen={documentationModalOpen}
          onClose={() => setDocumentationModalOpen(false)}
          projectData={projectData}
          apiKey={apiKey}
        />
      </main>
    </div>
  );
}

export default App;