import React, { useState, useEffect } from 'react';
import { X, FileText, Download, RefreshCw, Copy, CheckCircle } from 'lucide-react';
import { useGemini } from '../hooks/useGemini';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
  projectData: any;
  apiKey: string;
}

const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose,
  projectData,
  apiKey
}) => {
  const { generateStructuredContent, isLoading } = useGemini();
  const [documentation, setDocumentation] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('overview');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen && apiKey && !documentation) {
      generateDocumentation();
    }
  }, [isOpen, apiKey]);

  const generateDocumentation = async () => {
    const prompt = `
      Generate comprehensive project documentation based on the following project data:
      
      Project Details:
      - Name: ${projectData.name}
      - Slogan: ${projectData.slogan}
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Target Audience: ${projectData.targetAudience}
      - Budget: ${projectData.budget}
      - Timeline: ${projectData.timeline}
      - Experience Level: ${projectData.experience}
      
      Technology Stack:
      - Frontend: ${projectData.techStack?.frontend}
      - Backend: ${projectData.techStack?.backend}
      - Database: ${projectData.techStack?.database}
      - Hosting: ${projectData.techStack?.hosting}
      - Price Range: ${projectData.techStack?.priceRange}
      
      Selected Features:
      ${projectData.decidedFeatures?.map((f: any) => `- ${f.name}: ${f.description}`).join('\n') || 'No features selected'}
      
      UI Design:
      - Design Style: ${projectData.uiStyle?.designStyle}
      - Color Palette: ${projectData.uiStyle?.selectedPalette?.name}
      
      Deployment:
      - Platform: ${projectData.deployment?.platform}
      - Reasoning: ${projectData.deployment?.reasoning}
      
      Generate documentation in JSON format:
      {
        "projectOverview": {
          "title": "Project title",
          "description": "Comprehensive project description",
          "objectives": ["objective1", "objective2"],
          "targetMarket": "Market analysis",
          "valueProposition": "What makes this project unique"
        },
        "technicalSpecifications": {
          "architecture": "System architecture description",
          "techStackRationale": "Why this tech stack was chosen",
          "scalabilityConsiderations": "How the system will scale",
          "securityMeasures": ["security1", "security2"],
          "performanceTargets": "Performance goals"
        },
        "developmentPlan": {
          "phases": [
            {
              "name": "Phase name",
              "duration": "Time estimate",
              "deliverables": ["deliverable1", "deliverable2"],
              "milestones": ["milestone1", "milestone2"]
            }
          ],
          "timeline": "Overall timeline",
          "resourceRequirements": "Team and resource needs",
          "riskAssessment": ["risk1", "risk2"]
        },
        "implementationGuide": {
          "setupInstructions": ["step1", "step2"],
          "developmentWorkflow": "How to develop features",
          "testingStrategy": "Testing approach",
          "deploymentProcess": "How to deploy",
          "maintenancePlan": "Ongoing maintenance"
        },
        "businessPlan": {
          "marketAnalysis": "Market research insights",
          "competitiveAnalysis": "Competitor analysis",
          "monetizationStrategy": "How to make money",
          "marketingStrategy": "How to reach users",
          "budgetBreakdown": "Cost analysis"
        },
        "nextSteps": {
          "immediateActions": ["action1", "action2"],
          "shortTermGoals": ["goal1", "goal2"],
          "longTermVision": "Future roadmap",
          "successMetrics": ["metric1", "metric2"]
        }
      }
      
      Make the documentation comprehensive, professional, and actionable. Include specific recommendations and practical advice.
    `;

    const result = await generateStructuredContent(prompt, apiKey);
    if (result) {
      setDocumentation(result);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadDocumentation = () => {
    if (!documentation) return;
    
    const docText = generateMarkdownDoc();
    const blob = new Blob([docText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectData.name || 'project'}-documentation.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const generateMarkdownDoc = () => {
    if (!documentation) return '';
    
    return `# ${projectData.name} - Project Documentation

## Project Overview
${documentation.projectOverview?.description || ''}

### Objectives
${documentation.projectOverview?.objectives?.map((obj: string) => `- ${obj}`).join('\n') || ''}

### Target Market
${documentation.projectOverview?.targetMarket || ''}

### Value Proposition
${documentation.projectOverview?.valueProposition || ''}

## Technical Specifications

### Architecture
${documentation.technicalSpecifications?.architecture || ''}

### Technology Stack Rationale
${documentation.technicalSpecifications?.techStackRationale || ''}

### Scalability Considerations
${documentation.technicalSpecifications?.scalabilityConsiderations || ''}

### Security Measures
${documentation.technicalSpecifications?.securityMeasures?.map((measure: string) => `- ${measure}`).join('\n') || ''}

### Performance Targets
${documentation.technicalSpecifications?.performanceTargets || ''}

## Development Plan

### Timeline
${documentation.developmentPlan?.timeline || ''}

### Development Phases
${documentation.developmentPlan?.phases?.map((phase: any) => `
#### ${phase.name}
- **Duration:** ${phase.duration}
- **Deliverables:** ${phase.deliverables?.join(', ')}
- **Milestones:** ${phase.milestones?.join(', ')}
`).join('\n') || ''}

### Resource Requirements
${documentation.developmentPlan?.resourceRequirements || ''}

### Risk Assessment
${documentation.developmentPlan?.riskAssessment?.map((risk: string) => `- ${risk}`).join('\n') || ''}

## Implementation Guide

### Setup Instructions
${documentation.implementationGuide?.setupInstructions?.map((step: string) => `1. ${step}`).join('\n') || ''}

### Development Workflow
${documentation.implementationGuide?.developmentWorkflow || ''}

### Testing Strategy
${documentation.implementationGuide?.testingStrategy || ''}

### Deployment Process
${documentation.implementationGuide?.deploymentProcess || ''}

### Maintenance Plan
${documentation.implementationGuide?.maintenancePlan || ''}

## Business Plan

### Market Analysis
${documentation.businessPlan?.marketAnalysis || ''}

### Competitive Analysis
${documentation.businessPlan?.competitiveAnalysis || ''}

### Monetization Strategy
${documentation.businessPlan?.monetizationStrategy || ''}

### Marketing Strategy
${documentation.businessPlan?.marketingStrategy || ''}

### Budget Breakdown
${documentation.businessPlan?.budgetBreakdown || ''}

## Next Steps

### Immediate Actions
${documentation.nextSteps?.immediateActions?.map((action: string) => `- ${action}`).join('\n') || ''}

### Short-term Goals
${documentation.nextSteps?.shortTermGoals?.map((goal: string) => `- ${goal}`).join('\n') || ''}

### Long-term Vision
${documentation.nextSteps?.longTermVision || ''}

### Success Metrics
${documentation.nextSteps?.successMetrics?.map((metric: string) => `- ${metric}`).join('\n') || ''}

---
*Generated by Symphony AI Project Planner*
`;
  };

  const tabs = [
    { id: 'overview', label: 'Project Overview', icon: FileText },
    { id: 'technical', label: 'Technical Specs', icon: FileText },
    { id: 'development', label: 'Development Plan', icon: FileText },
    { id: 'implementation', label: 'Implementation', icon: FileText },
    { id: 'business', label: 'Business Plan', icon: FileText },
    { id: 'nextsteps', label: 'Next Steps', icon: FileText }
  ];

  const renderTabContent = () => {
    if (!documentation) return null;

    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Project Description</h3>
              <p className="text-gray-300">{documentation.projectOverview?.description}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Objectives</h3>
              <ul className="space-y-2">
                {documentation.projectOverview?.objectives?.map((obj: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{obj}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Target Market</h3>
              <p className="text-gray-300">{documentation.projectOverview?.targetMarket}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Value Proposition</h3>
              <p className="text-gray-300">{documentation.projectOverview?.valueProposition}</p>
            </div>
          </div>
        );
      
      case 'technical':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">System Architecture</h3>
              <p className="text-gray-300">{documentation.technicalSpecifications?.architecture}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Technology Stack Rationale</h3>
              <p className="text-gray-300">{documentation.technicalSpecifications?.techStackRationale}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Scalability Considerations</h3>
              <p className="text-gray-300">{documentation.technicalSpecifications?.scalabilityConsiderations}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Security Measures</h3>
              <ul className="space-y-2">
                {documentation.technicalSpecifications?.securityMeasures?.map((measure: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-blue-400 mr-2">•</span>
                    <span className="text-gray-300">{measure}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Performance Targets</h3>
              <p className="text-gray-300">{documentation.technicalSpecifications?.performanceTargets}</p>
            </div>
          </div>
        );
      
      case 'development':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Overall Timeline</h3>
              <p className="text-gray-300">{documentation.developmentPlan?.timeline}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Development Phases</h3>
              <div className="space-y-4">
                {documentation.developmentPlan?.phases?.map((phase: any, index: number) => (
                  <div key={index} className="border border-slate-600 rounded-lg p-4 bg-slate-700/30">
                    <h4 className="font-medium text-white mb-2">{phase.name}</h4>
                    <p className="text-sm text-gray-400 mb-2">Duration: {phase.duration}</p>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-gray-300 mb-1">Deliverables:</p>
                        <ul className="text-sm text-gray-400">
                          {phase.deliverables?.map((deliverable: string, i: number) => (
                            <li key={i}>• {deliverable}</li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-300 mb-1">Milestones:</p>
                        <ul className="text-sm text-gray-400">
                          {phase.milestones?.map((milestone: string, i: number) => (
                            <li key={i}>• {milestone}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Resource Requirements</h3>
              <p className="text-gray-300">{documentation.developmentPlan?.resourceRequirements}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Risk Assessment</h3>
              <ul className="space-y-2">
                {documentation.developmentPlan?.riskAssessment?.map((risk: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-red-400 mr-2">⚠</span>
                    <span className="text-gray-300">{risk}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      
      case 'implementation':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Setup Instructions</h3>
              <ol className="space-y-2">
                {documentation.implementationGuide?.setupInstructions?.map((step: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    <span className="text-gray-300">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Development Workflow</h3>
              <p className="text-gray-300">{documentation.implementationGuide?.developmentWorkflow}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Testing Strategy</h3>
              <p className="text-gray-300">{documentation.implementationGuide?.testingStrategy}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Deployment Process</h3>
              <p className="text-gray-300">{documentation.implementationGuide?.deploymentProcess}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Maintenance Plan</h3>
              <p className="text-gray-300">{documentation.implementationGuide?.maintenancePlan}</p>
            </div>
          </div>
        );
      
      case 'business':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Market Analysis</h3>
              <p className="text-gray-300">{documentation.businessPlan?.marketAnalysis}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Competitive Analysis</h3>
              <p className="text-gray-300">{documentation.businessPlan?.competitiveAnalysis}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Monetization Strategy</h3>
              <p className="text-gray-300">{documentation.businessPlan?.monetizationStrategy}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Marketing Strategy</h3>
              <p className="text-gray-300">{documentation.businessPlan?.marketingStrategy}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Budget Breakdown</h3>
              <p className="text-gray-300">{documentation.businessPlan?.budgetBreakdown}</p>
            </div>
          </div>
        );
      
      case 'nextsteps':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Immediate Actions</h3>
              <ul className="space-y-2">
                {documentation.nextSteps?.immediateActions?.map((action: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="bg-red-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm mr-3 mt-0.5 flex-shrink-0">
                      !
                    </span>
                    <span className="text-gray-300">{action}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Short-term Goals</h3>
              <ul className="space-y-2">
                {documentation.nextSteps?.shortTermGoals?.map((goal: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <CheckCircle className="h-5 w-5 text-blue-400 mr-2 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-300">{goal}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Long-term Vision</h3>
              <p className="text-gray-300">{documentation.nextSteps?.longTermVision}</p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Success Metrics</h3>
              <ul className="space-y-2">
                {documentation.nextSteps?.successMetrics?.map((metric: string, index: number) => (
                  <li key={index} className="flex items-start">
                    <span className="text-green-400 mr-2">📊</span>
                    <span className="text-gray-300">{metric}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        );
      
      default:
        return null;
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="bg-slate-800 border border-slate-700 rounded-2xl shadow-2xl w-full max-w-6xl max-h-[90vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-slate-700">
            <div className="flex items-center space-x-3">
              <FileText className="h-6 w-6 text-blue-400" />
              <div>
                <h2 className="text-xl font-semibold text-white">Project Documentation</h2>
                <p className="text-sm text-gray-400">{projectData.name}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {documentation && (
                <>
                  <button
                    onClick={() => copyToClipboard(generateMarkdownDoc())}
                    className="flex items-center px-3 py-2 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-sm text-gray-300"
                  >
                    {copied ? (
                      <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                    ) : (
                      <Copy className="h-4 w-4 mr-2" />
                    )}
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                  <button
                    onClick={downloadDocumentation}
                    className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    <Download className="h-4 w-4 mr-2" />
                    Download
                  </button>
                </>
              )}
              <button
                onClick={onClose}
                className="p-2 hover:bg-slate-700 rounded-lg transition-colors text-gray-400 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex flex-1 overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 bg-slate-700/30 border-r border-slate-700 p-4">
              <nav className="space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors text-sm ${
                      activeTab === tab.id
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-300 hover:bg-slate-600'
                    }`}
                  >
                    <div className="flex items-center">
                      <tab.icon className="h-4 w-4 mr-2" />
                      {tab.label}
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6">
              {isLoading ? (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-400 mx-auto mb-4" />
                    <p className="text-gray-400">Generating comprehensive documentation...</p>
                  </div>
                </div>
              ) : documentation ? (
                renderTabContent()
              ) : (
                <div className="flex items-center justify-center h-64">
                  <div className="text-center">
                    <FileText className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                    <p className="text-gray-400">Failed to generate documentation. Please try again.</p>
                    <button
                      onClick={generateDocumentation}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default DocumentationModal;