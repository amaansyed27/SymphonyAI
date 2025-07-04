import React, { useState, useEffect } from 'react';
import { ProjectData, RoadmapStage } from './types';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
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
    position: { x: 20, y: 15 }
  },
  {
    id: 'stack-select',
    title: 'Stack Select',
    description: 'Choose your technology stack and tools',
    status: 'available',
    icon: 'settings',
    position: { x: 40, y: 30 }
  },
  {
    id: 'feature-brainstorm',
    title: 'Feature Brainstorm',
    description: 'Define core features and brainstorm additions',
    status: 'available',
    icon: 'lightbulb',
    position: { x: 20, y: 50 }
  },
  {
    id: 'ui-design',
    title: 'UI Design',
    description: 'Design color palettes and visual style',
    status: 'available',
    icon: 'palette',
    position: { x: 70, y: 20 }
  },
  {
    id: 'ui-flow',
    title: 'UI Flow',
    description: 'Map out user interface flow and navigation',
    status: 'available',
    icon: 'git-branch',
    position: { x: 80, y: 45 }
  },
  {
    id: 'builder-tools',
    title: 'Builder Tools',
    description: 'Get AI tool recommendations and custom prompts',
    status: 'available',
    icon: 'code',
    position: { x: 60, y: 65 }
  },
  {
    id: 'deployment',
    title: 'Deployment',
    description: 'Choose deployment platform and strategy',
    status: 'available',
    icon: 'rocket',
    position: { x: 30, y: 75 }
  }
];

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [currentStep, setCurrentStep] = useState<'landing' | 'dashboard' | 'questionnaire' | 'roadmap'>('landing');
  const [projectData, setProjectData] = useState<Partial<ProjectData>>({});
  const [roadmapStages, setRoadmapStages] = useState<RoadmapStage[]>(ROADMAP_STAGES);
  const [selectedStage, setSelectedStage] = useState<RoadmapStage | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [documentationModalOpen, setDocumentationModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');

  // Load saved data on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('symphony-gemini-api-key');
    
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  // Save project data whenever it changes
  useEffect(() => {
    if (projectData.id && Object.keys(projectData).length > 1) {
      localStorage.setItem(`symphony-project-${projectData.id}`, JSON.stringify(projectData));
    }
  }, [projectData]);

  const handleBootloaderComplete = () => {
    setIsLoading(false);
  };

  const handleGetStarted = () => {
    setCurrentStep('dashboard');
  };

  const handleCreateNewProject = () => {
    setCurrentStep('questionnaire');
    setProjectData({});
    setRoadmapStages(ROADMAP_STAGES);
    setSelectedStage(null);
    setSidePanelOpen(false);
  };

  const handleLoadProject = (project: ProjectData) => {
    setProjectData(project);
    setCurrentStep('roadmap');
    
    // Restore roadmap stages based on project progress
    const updatedStages = ROADMAP_STAGES.map(stage => {
      const isCompleted = checkStageCompletion(stage.id, project);
      return {
        ...stage,
        status: isCompleted ? 'completed' as const : 'available' as const
      };
    });
    setRoadmapStages(updatedStages);
  };

  const handleBackToLanding = () => {
    setCurrentStep('landing');
    setProjectData({});
    setRoadmapStages(ROADMAP_STAGES);
    setSelectedStage(null);
    setSidePanelOpen(false);
  };

  const handleBackToDashboard = () => {
    setCurrentStep('dashboard');
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
    
    // All stages are available from the start
    const updatedStages = roadmapStages.map(stage => ({
      ...stage,
      status: 'available' as const
    }));
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
    const updatedStages = roadmapStages.map(stage =>
      stage.id === stageId
        ? { ...stage, status: 'completed' as const }
        : stage
    );
    setRoadmapStages(updatedStages);
  };

  const handleStageClick = (stage: RoadmapStage) => {
    setSelectedStage(stage);
    setSidePanelOpen(true);
  };

  const handleProjectUpdate = (updates: Partial<ProjectData>) => {
    const updatedData = { ...projectData, ...updates };
    setProjectData(updatedData);
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

  // Dashboard
  if (currentStep === 'dashboard') {
    return (
      <Dashboard 
        onCreateNew={handleCreateNewProject}
        onLoadProject={handleLoadProject}
        onBack={handleBackToLanding}
      />
    );
  }

  // Questionnaire
  if (currentStep === 'questionnaire') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
        {/* Header with back button */}
        <header className="p-4">
          <div className="max-w-2xl mx-auto flex items-center justify-between">
            <button
              onClick={handleBackToDashboard}
              className="flex items-center px-4 py-2 text-blue-200 hover:text-white transition-colors"
            >
              <ArrowLeft className="h-5 w-5 mr-2" />
              <span className="hidden sm:inline">Back to Dashboard</span>
              <span className="sm:hidden">Back</span>
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
            <div className="flex items-center space-x-2 sm:space-x-4">
              <button
                onClick={handleBackToDashboard}
                className="flex items-center px-2 sm:px-3 py-2 text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Dashboard</span>
              </button>
              
              <div className="h-8 w-px bg-slate-600 hidden sm:block" />
              
              <div className="flex items-center space-x-2 sm:space-x-3">
                {projectData.logo ? (
                  <img src={projectData.logo} alt="Project logo" className="h-8 sm:h-10 w-8 sm:w-10 object-contain" />
                ) : (
                  <Logo size={32} className="sm:hidden" />
                )}
                <Logo size={40} className="hidden sm:block" />
                <div className="hidden sm:block">
                  <h1 className="text-lg sm:text-xl font-bold text-white">
                    {projectData.name || 'Symphony'}
                  </h1>
                  {projectData.slogan && (
                    <p className="text-xs sm:text-sm text-gray-400">
                      {projectData.slogan}
                    </p>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Generate Documentation Button */}
              {allStagesCompleted && (
                <button
                  onClick={() => setDocumentationModalOpen(true)}
                  className="flex items-center px-2 sm:px-4 py-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white rounded-lg hover:from-green-600 hover:to-emerald-600 transition-all duration-200 shadow-lg text-sm"
                >
                  <FileText className="h-4 sm:h-5 w-4 sm:w-5 sm:mr-2" />
                  <span className="hidden sm:inline">Generate Docs</span>
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
          <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-center space-y-2 sm:space-y-0 sm:space-x-3 text-center">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5" />
              <span className="font-medium text-sm sm:text-base">🎉 All stages completed! Your project plan is ready.</span>
            </div>
            <button
              onClick={() => setDocumentationModalOpen(true)}
              className="px-4 py-1 bg-white/20 hover:bg-white/30 rounded-lg transition-colors text-sm"
            >
              Generate Documentation
            </button>
          </div>
        </div>
      )}

      {/* Main Content */}
      <main className="relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
          <div className="text-center mb-4 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-2">Project Planning Roadmap</h2>
            <p className="text-gray-400 text-sm sm:text-base">Follow the path to build your {projectData.projectType}</p>
            <div className="mt-4 bg-slate-800/50 backdrop-blur-lg rounded-lg p-3 sm:p-4 border border-slate-700/50">
              <p className="text-blue-300 text-xs sm:text-sm">
                💡 <strong>All stages are now accessible!</strong> Click on any stage to start working on it. 
                Complete stages in any order that works for you, and mark them as complete when finished.
              </p>
            </div>
          </div>

          {/* Roadmap - Responsive height and better positioning */}
          <div className="bg-slate-800/30 backdrop-blur-lg rounded-2xl sm:rounded-3xl border border-slate-700/50 shadow-2xl overflow-hidden">
            <div className="h-[500px] sm:h-[600px] lg:h-[800px] relative">
              <RoadmapPath 
                stages={roadmapStages} 
                onStageClick={handleStageClick}
              />
            </div>
          </div>

          {/* Progress Summary */}
          <div className="mt-4 sm:mt-8 bg-slate-800/30 backdrop-blur-lg rounded-xl sm:rounded-2xl border border-slate-700/50 p-4 sm:p-6">
            <h3 className="text-base sm:text-lg font-semibold text-white mb-4">Progress Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: 'Completed', count: roadmapStages.filter(s => s.status === 'completed').length, color: 'green' },
                { label: 'Available', count: roadmapStages.filter(s => s.status === 'available').length, color: 'blue' },
                { label: 'Locked', count: roadmapStages.filter(s => s.status === 'locked').length, color: 'gray' },
                { label: 'Total', count: roadmapStages.length, color: 'purple' }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-xl sm:text-2xl font-bold ${
                    stat.color === 'green' ? 'text-green-400' :
                    stat.color === 'blue' ? 'text-blue-400' :
                    stat.color === 'gray' ? 'text-gray-400' :
                    'text-purple-400'
                  }`}>{stat.count}</div>
                  <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {allStagesCompleted && (
              <div className="mt-4 p-3 sm:p-4 bg-green-500/10 rounded-lg border border-green-500/20">
                <div className="flex flex-col sm:flex-row items-center justify-between space-y-2 sm:space-y-0">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2" />
                    <span className="text-green-300 font-medium text-sm sm:text-base">Project planning complete!</span>
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