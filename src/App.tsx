import React, { useState, useEffect } from 'react';
import { ProjectData, RoadmapStage } from './types';
import Questionnaire from './components/Questionnaire';
import RoadmapPath from './components/RoadmapPath';
import SidePanel from './components/SidePanel';
import APIKeyManager from './components/APIKeyManager';
import DocumentationModal from './components/DocumentationModal';
import { Settings, Sparkles, RefreshCw, FileText, CheckCircle } from 'lucide-react';
import { useGemini } from './hooks/useGemini';

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
  const [currentStep, setCurrentStep] = useState<'questionnaire' | 'roadmap'>('questionnaire');
  const [projectData, setProjectData] = useState<Partial<ProjectData>>({});
  const [roadmapStages, setRoadmapStages] = useState<RoadmapStage[]>(ROADMAP_STAGES);
  const [selectedStage, setSelectedStage] = useState<RoadmapStage | null>(null);
  const [sidePanelOpen, setSidePanelOpen] = useState(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState(false);
  const [documentationModalOpen, setDocumentationModalOpen] = useState(false);
  const [apiKey, setApiKey] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [generationProgress, setGenerationProgress] = useState('');
  const [stageCompletions, setStageCompletions] = useState<Record<string, boolean>>({});

  const { generateStructuredContent, generateLogo } = useGemini();

  // Load API key from localStorage on mount
  useEffect(() => {
    const savedApiKey = localStorage.getItem('symphony-gemini-api-key');
    if (savedApiKey) {
      setApiKey(savedApiKey);
    }
  }, []);

  const generateAllContent = async (data: Partial<ProjectData>) => {
    if (!apiKey) {
      console.warn('No API key available for content generation');
      return data;
    }

    setIsGenerating(true);
    let updatedData = { ...data };

    try {
      // 1. Generate Name & Logo
      setGenerationProgress('Generating project name and branding...');
      const nameLogoPrompt = `
        Based on the following project details, generate creative suggestions:
        - Platform: ${data.platform}
        - Project Type: ${data.projectType}
        - Target Audience: ${data.targetAudience}
        - Budget: ${data.budget}
        - Timeline: ${data.timeline}

        Please provide the response in JSON format with the following structure:
        {
          "names": ["name1", "name2", "name3", "name4", "name5"],
          "slogans": ["slogan1", "slogan2", "slogan3", "slogan4", "slogan5"],
          "logoIdeas": ["description1", "description2", "description3"]
        }

        Make the names catchy, memorable, and relevant to the project type.
        Make the slogans concise and impactful.
        Describe logo concepts that would work well for this type of project.
      `;

      const nameLogoResult = await generateStructuredContent(nameLogoPrompt, apiKey);
      if (nameLogoResult) {
        updatedData.name = nameLogoResult.names?.[0] || 'My Project';
        updatedData.slogan = nameLogoResult.slogans?.[0] || 'Building something amazing';
        
        // Generate a logo for the selected name
        if (updatedData.name) {
          setGenerationProgress('Creating AI-generated logo...');
          const logoPrompt = `Create a professional, modern logo for "${updatedData.name}" - ${data.projectType}. 
          The logo should be:
          - Clean and minimalist design
          - Suitable for ${data.platform} platform
          - Appealing to ${data.targetAudience}
          - Vector-style with clear, bold shapes
          - Professional color scheme
          - Scalable and readable at small sizes
          - No text/typography, just the icon/symbol
          
          Style: Modern, professional, ${data.projectType} themed`;

          try {
            const logoResult = await generateLogo(logoPrompt, apiKey);
            if (logoResult) {
              updatedData.logo = logoResult.imageUrl;
            }
          } catch (logoError) {
            console.warn('Logo generation failed, continuing without logo:', logoError);
          }
        }
      }

      // 2. Generate Tech Stack
      setGenerationProgress('Selecting optimal technology stack...');
      const stackPrompt = `
        Based on the following project requirements, recommend the best technology stack:
        - Platform: ${data.platform}
        - Project Type: ${data.projectType}
        - Target Audience: ${data.targetAudience}
        - Budget: ${data.budget}
        - Timeline: ${data.timeline}
        - Experience Level: ${data.experience}

        Provide the best stack option in JSON format:
        {
          "stack": {
            "tier": "Budget-Friendly|Balanced|Premium",
            "priceRange": "$0-$50/month",
            "frontend": "Technology name",
            "backend": "Technology name",
            "database": "Technology name",
            "hosting": "Platform name",
            "pros": ["advantage1", "advantage2", "advantage3"],
            "cons": ["limitation1", "limitation2"],
            "suitableFor": "Who this is best for"
          }
        }

        Choose the most appropriate tier based on budget and requirements.
      `;

      const stackResult = await generateStructuredContent(stackPrompt, apiKey);
      if (stackResult?.stack) {
        updatedData.techStack = {
          frontend: stackResult.stack.frontend,
          backend: stackResult.stack.backend,
          database: stackResult.stack.database,
          hosting: stackResult.stack.hosting,
          priceRange: stackResult.stack.priceRange
        };
      }

      // 3. Generate Features
      setGenerationProgress('Brainstorming essential features...');
      const featuresPrompt = `
        Based on the following project details, generate essential must-have features:
        - Platform: ${data.platform}
        - Project Type: ${data.projectType}
        - Target Audience: ${data.targetAudience}
        - Budget: ${data.budget}
        - Timeline: ${data.timeline}

        Generate 8-10 must-have features in JSON format:
        {
          "features": [
            {
              "name": "Feature name",
              "description": "Brief description of the feature",
              "priority": "high|medium|low",
              "category": "Category name (e.g., Core, User Management, Content, etc.)"
            }
          ]
        }

        Focus on core functionality that this type of ${data.projectType} absolutely needs.
      `;

      const featuresResult = await generateStructuredContent(featuresPrompt, apiKey);
      if (featuresResult?.features) {
        const features = featuresResult.features.map((f: any, index: number) => ({
          ...f,
          id: `feature-${index}`
        }));
        updatedData.features = features;
        updatedData.decidedFeatures = features.filter((f: any) => f.priority === 'high');
      }

      // 4. Generate UI Design
      setGenerationProgress('Creating UI design concepts...');
      const uiDesignPrompt = `
        Based on the following project details, generate UI design suggestions:
        - Platform: ${data.platform}
        - Project Type: ${data.projectType}
        - Target Audience: ${data.targetAudience}
        - Selected Features: ${updatedData.decidedFeatures?.map((f: any) => f.name).join(', ') || 'Core features'}

        Generate design suggestions in JSON format:
        {
          "colorPalettes": [
            {
              "name": "Palette name",
              "description": "Brief description",
              "primary": "#hex",
              "secondary": "#hex",
              "accent": "#hex",
              "background": "#hex",
              "text": "#hex",
              "mood": "Professional/Playful/Modern/etc"
            }
          ],
          "designStyles": [
            {
              "name": "Style name",
              "description": "Description of the style",
              "characteristics": ["trait1", "trait2", "trait3"],
              "suitableFor": "Who this works best for"
            }
          ]
        }

        Provide 3 color palettes and 3 design styles. Consider the target audience and project type.
      `;

      const uiDesignResult = await generateStructuredContent(uiDesignPrompt, apiKey);
      if (uiDesignResult) {
        const selectedPalette = uiDesignResult.colorPalettes?.[0];
        const selectedStyle = uiDesignResult.designStyles?.[0];
        
        if (selectedPalette && selectedStyle) {
          updatedData.uiStyle = {
            colorPalette: [selectedPalette.primary, selectedPalette.secondary, selectedPalette.accent, selectedPalette.background, selectedPalette.text],
            designStyle: selectedStyle.name,
            selectedPalette,
            selectedStyle,
            inspiration: []
          };
        }
      }

      // 5. Generate UI Flow
      setGenerationProgress('Mapping user interface flow...');
      const uiFlowPrompt = `
        Based on the following project details, generate a user flow:
        - Platform: ${data.platform}
        - Project Type: ${data.projectType}
        - Features: ${updatedData.decidedFeatures?.map((f: any) => f.name).join(', ') || 'Core features'}

        Generate a logical user flow in JSON format:
        {
          "flow": [
            {
              "id": "unique_id",
              "name": "Screen/Action name",
              "type": "screen|action|decision",
              "description": "Brief description",
              "connections": ["id1", "id2"],
              "position": {"x": 100, "y": 100}
            }
          ]
        }

        Create 8-12 nodes that represent the main user journey through the app.
        Include different types: screens (main app pages), actions (user interactions), decisions (choice points).
        Position them in a logical flow from left to right, top to bottom.
      `;

      const uiFlowResult = await generateStructuredContent(uiFlowPrompt, apiKey);
      if (uiFlowResult?.flow) {
        updatedData.uiFlow = uiFlowResult.flow;
      }

      // 6. Generate Builder Tools
      setGenerationProgress('Recommending development tools...');
      const builderToolsPrompt = `
        Based on the following project details, recommend development tools:
        - Platform: ${data.platform}
        - Project Type: ${data.projectType}
        - Tech Stack: ${updatedData.techStack ? 
          `${updatedData.techStack.frontend}, ${updatedData.techStack.backend}, ${updatedData.techStack.database}` : 
          'Not selected'}
        - Experience Level: ${data.experience}
        - Budget: ${data.budget}

        Recommend tools in JSON format:
        {
          "frontendTools": [
            {
              "name": "Tool name",
              "type": "frontend",
              "description": "What this tool does",
              "pricing": "Free/Paid/Freemium",
              "learningCurve": "Easy/Medium/Hard",
              "features": ["feature1", "feature2"],
              "bestFor": "Who should use this",
              "url": "https://example.com"
            }
          ],
          "backendTools": [similar structure],
          "databaseTools": [similar structure],
          "noCodeTools": [similar structure]
        }

        Include tools like: Bolt.new, v0 by Vercel, Lovable.dev, Cursor, GitHub Copilot, Claude, Firebase, Supabase, etc.
        Consider the user's experience level and budget. Provide 2-3 tools per category.
      `;

      const builderToolsResult = await generateStructuredContent(builderToolsPrompt, apiKey);
      if (builderToolsResult) {
        updatedData.builderTools = builderToolsResult;
      }

      // 7. Generate Deployment Recommendations
      setGenerationProgress('Planning deployment strategy...');
      const deploymentPrompt = `
        Based on the following project details, recommend deployment platforms:
        - Platform: ${data.platform}
        - Project Type: ${data.projectType}
        - Tech Stack: ${updatedData.techStack ? 
          `Frontend: ${updatedData.techStack.frontend}, Backend: ${updatedData.techStack.backend}, Database: ${updatedData.techStack.database}` : 
          'Not selected'}
        - Budget: ${data.budget}
        - Timeline: ${data.timeline}
        - Experience Level: ${data.experience}

        Recommend the best deployment platform in JSON format:
        {
          "recommendation": {
            "name": "Platform name",
            "type": "Frontend/Backend/Full-stack/Database",
            "pricing": "Free tier info + paid plans",
            "pros": ["advantage1", "advantage2", "advantage3"],
            "cons": ["limitation1", "limitation2"],
            "bestFor": "Who should use this",
            "setup": ["step1", "step2", "step3"],
            "url": "https://platform.com",
            "score": 85
          }
        }

        Consider platforms like Vercel, Netlify, Railway, Render, DigitalOcean, AWS, Heroku, Firebase Hosting, etc.
        Choose the most suitable one based on the project requirements.
      `;

      const deploymentResult = await generateStructuredContent(deploymentPrompt, apiKey);
      if (deploymentResult?.recommendation) {
        updatedData.deployment = {
          platform: deploymentResult.recommendation.name,
          reasoning: `Selected ${deploymentResult.recommendation.name} because: ${deploymentResult.recommendation.bestFor}`,
          steps: deploymentResult.recommendation.setup
        };
      }

      setGenerationProgress('Complete! Your project plan is ready.');
      
    } catch (error) {
      console.error('Error generating content:', error);
      setGenerationProgress('Generation completed with some errors. You can manually generate missing sections.');
    } finally {
      setIsGenerating(false);
      setTimeout(() => setGenerationProgress(''), 3000);
    }

    return updatedData;
  };

  const handleQuestionnaireComplete = async (data: Partial<ProjectData>) => {
    const newProjectData = {
      ...data,
      id: 'project-' + Date.now(),
      features: [],
      decidedFeatures: []
    };
    
    setProjectData(newProjectData);
    setCurrentStep('roadmap');
    
    // Generate all content automatically
    const completeProjectData = await generateAllContent(newProjectData);
    setProjectData(completeProjectData);
    
    // Update stage availability
    updateStageAvailability(completeProjectData);
  };

  const updateStageAvailability = (data: Partial<ProjectData>) => {
    const updatedStages = roadmapStages.map((stage, index) => {
      // First stage is always available
      if (index === 0) {
        return { ...stage, status: 'available' };
      }
      
      // Check if previous stages are completed
      const previousStagesCompleted = roadmapStages.slice(0, index).every(prevStage => {
        return checkStageCompletion(prevStage.id, data);
      });
      
      if (previousStagesCompleted) {
        return { ...stage, status: 'available' };
      }
      
      return stage;
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
    setStageCompletions(prev => ({ ...prev, [stageId]: true }));
    
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
    updateStageAvailability(updatedData);
    
    // Mark current stage as completed if it meets requirements
    if (selectedStage && checkStageCompletion(selectedStage.id, updatedData)) {
      markStageAsCompleted(selectedStage.id);
    }
  };

  const handleSaveApiKey = (key: string) => {
    setApiKey(key);
    localStorage.setItem('symphony-gemini-api-key', key);
  };

  // Check if all stages are completed
  const allStagesCompleted = roadmapStages.every(stage => 
    stage.status === 'completed' || checkStageCompletion(stage.id, projectData)
  );

  if (currentStep === 'questionnaire') {
    return <Questionnaire onComplete={handleQuestionnaireComplete} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-lg border-b border-white/20 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              {projectData.logo ? (
                <img src={projectData.logo} alt="Project logo" className="h-8 w-8 object-contain" />
              ) : (
                <Sparkles className="h-8 w-8 text-blue-600" />
              )}
              <div>
                <h1 className="text-xl font-bold text-gray-900">Symphony</h1>
                <p className="text-sm text-gray-600">AI Project Planner</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {projectData.name && (
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{projectData.name}</p>
                  <p className="text-xs text-gray-600">{projectData.slogan}</p>
                </div>
              )}
              
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
                    ? 'bg-green-100 text-green-700 hover:bg-green-200' 
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                title={apiKey ? 'API Key Configured' : 'Configure API Key'}
              >
                <Settings className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Generation Progress */}
      {isGenerating && (
        <div className="bg-blue-600 text-white px-4 py-3">
          <div className="max-w-7xl mx-auto flex items-center justify-center space-x-3">
            <RefreshCw className="h-5 w-5 animate-spin" />
            <span className="font-medium">Generating your project plan...</span>
            <span className="text-blue-200">{generationProgress}</span>
          </div>
        </div>
      )}

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
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Project Planning Roadmap</h2>
            <p className="text-gray-600">AI-generated plan for your {projectData.projectType}</p>
            {isGenerating && (
              <div className="mt-4 bg-blue-50 rounded-lg p-4">
                <p className="text-blue-800 text-sm">
                  🤖 AI is automatically generating your complete project plan. This may take a few moments...
                </p>
              </div>
            )}
          </div>

          {/* Roadmap */}
          <div className="bg-white/60 backdrop-blur-lg rounded-3xl border border-white/20 shadow-xl overflow-hidden">
            <div style={{ height: '600px' }}>
              <RoadmapPath 
                stages={roadmapStages} 
                onStageClick={handleStageClick}
              />
            </div>
          </div>

          {/* Progress Summary */}
          <div className="mt-8 bg-white/60 backdrop-blur-lg rounded-2xl border border-white/20 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Progress Summary</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Completed', count: roadmapStages.filter(s => s.status === 'completed').length, color: 'green' },
                { label: 'Available', count: roadmapStages.filter(s => s.status === 'available').length, color: 'blue' },
                { label: 'Locked', count: roadmapStages.filter(s => s.status === 'locked').length, color: 'gray' },
                { label: 'Total', count: roadmapStages.length, color: 'purple' }
              ].map((stat) => (
                <div key={stat.label} className="text-center">
                  <div className={`text-2xl font-bold text-${stat.color}-600`}>{stat.count}</div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
            
            {allStagesCompleted && (
              <div className="mt-4 p-4 bg-green-50 rounded-lg border border-green-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <CheckCircle className="h-5 w-5 text-green-600 mr-2" />
                    <span className="text-green-800 font-medium">Project planning complete!</span>
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