import React, { useState } from 'react';
import { useGemini } from '../../hooks/useGemini';
import { Code, Database, RefreshCw, Sparkles, Copy, ExternalLink } from 'lucide-react';

interface BuilderToolsSectionProps {
  projectData: any;
  onUpdate: (updates: any) => void;
  apiKey: string;
}

const BuilderToolsSection: React.FC<BuilderToolsSectionProps> = ({ 
  projectData, 
  onUpdate, 
  apiKey 
}) => {
  const { generateStructuredContent, isLoading } = useGemini();
  const [recommendations, setRecommendations] = useState<any>(null);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [generatedPrompts, setGeneratedPrompts] = useState<any>(null);

  const generateRecommendations = async () => {
    const prompt = `
      Based on the following project details, recommend development tools:
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Tech Stack: ${projectData.techStack ? 
        `${projectData.techStack.frontend}, ${projectData.techStack.backend}, ${projectData.techStack.database}` : 
        'Not selected'}
      - Experience Level: ${projectData.experience}
      - Budget: ${projectData.budget}

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
      Consider the user's experience level and budget.
    `;

    const result = await generateStructuredContent(prompt, apiKey);
    if (result) {
      setRecommendations(result);
    }
  };

  const generatePrompts = async (tool: any) => {
    const features = projectData.decidedFeatures?.map((f: any) => f.name).join(', ') || 'Basic functionality';
    
    const prompt = `
      Generate customized prompts for ${tool.name} to build this project:
      - Project Type: ${projectData.projectType}
      - Platform: ${projectData.platform}
      - Features: ${features}
      - Tech Stack: ${projectData.techStack ? 
        `${projectData.techStack.frontend}, ${projectData.techStack.backend}` : 
        'To be determined'}

      Create 3-5 segmented prompts in JSON format:
      {
        "prompts": [
          {
            "title": "Setup & Structure",
            "content": "Detailed prompt for initial setup...",
            "order": 1
          },
          {
            "title": "Core Features",
            "content": "Prompt for main functionality...",
            "order": 2
          }
        ]
      }

      Make prompts specific to ${tool.name} and break down the project into manageable chunks.
      Include specific technical requirements and UI/UX guidance.
    `;

    const result = await generateStructuredContent(prompt, apiKey);
    if (result) {
      setGeneratedPrompts(result);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const selectTool = (tool: any) => {
    setSelectedTool(tool);
    generatePrompts(tool);
  };

  const toolCategories = [
    { key: 'frontendTools', title: 'Frontend & Full-Stack Tools', icon: Code, color: 'blue' },
    { key: 'backendTools', title: 'Backend Tools', icon: Database, color: 'green' },
    { key: 'databaseTools', title: 'Database Tools', icon: Database, color: 'orange' },
    { key: 'noCodeTools', title: 'No-Code/Low-Code Tools', icon: Sparkles, color: 'purple' }
  ];

  const getCategoryColor = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      orange: 'bg-orange-50 border-orange-200',
      purple: 'bg-purple-50 border-purple-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      case 'Hard': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-8">
      {/* Generate Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Development Tool Recommendations</h3>
        <button
          onClick={generateRecommendations}
          disabled={isLoading || !apiKey}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Get Recommendations
        </button>
      </div>

      {!apiKey && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            Please add your Gemini API key to get tool recommendations and custom prompts.
          </p>
        </div>
      )}

      {/* Tool Recommendations */}
      {recommendations && (
        <div className="space-y-8">
          {toolCategories.map((category) => {
            const tools = recommendations[category.key] || [];
            if (tools.length === 0) return null;

            return (
              <div key={category.key}>
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <category.icon className={`h-5 w-5 text-${category.color}-600 mr-2`} />
                  {category.title}
                </h4>
                <div className="grid gap-4">
                  {tools.map((tool: any, index: number) => (
                    <div key={index} className={`border rounded-lg p-6 ${getCategoryColor(category.color)}`}>
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h5 className="text-lg font-semibold text-gray-900">{tool.name}</h5>
                            <span className="bg-gray-100 text-gray-700 px-2 py-1 text-xs rounded">
                              {tool.pricing}
                            </span>
                            <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(tool.learningCurve)}`}>
                              {tool.learningCurve}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">{tool.description}</p>
                          <div className="flex flex-wrap gap-2 mb-3">
                            {tool.features?.map((feature: string, i: number) => (
                              <span key={i} className="bg-white text-gray-700 px-2 py-1 text-xs rounded border">
                                {feature}
                              </span>
                            ))}
                          </div>
                          <p className="text-sm text-blue-700">
                            <strong>Best for:</strong> {tool.bestFor}
                          </p>
                        </div>
                        <div className="flex space-x-2 ml-4">
                          {tool.url && (
                            <a
                              href={tool.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 hover:text-blue-600 transition-colors"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                          <button
                            onClick={() => selectTool(tool)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                          >
                            Get Prompts
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Generated Prompts */}
      {selectedTool && generatedPrompts && (
        <div className="bg-gray-50 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">
            Custom Prompts for {selectedTool.name}
          </h4>
          <div className="space-y-4">
            {generatedPrompts.prompts?.map((prompt: any, index: number) => (
              <div key={index} className="bg-white rounded-lg p-4 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <h5 className="font-medium text-gray-900">
                    Step {prompt.order}: {prompt.title}
                  </h5>
                  <button
                    onClick={() => copyToClipboard(prompt.content)}
                    className="flex items-center px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 rounded transition-colors"
                  >
                    <Copy className="h-4 w-4 mr-1" />
                    Copy
                  </button>
                </div>
                <div className="bg-gray-50 rounded p-3 text-sm text-gray-700 font-mono whitespace-pre-wrap">
                  {prompt.content}
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
            <p className="text-sm text-blue-800">
              <strong>Tip:</strong> Use these prompts in sequence with {selectedTool.name}. 
              Each prompt builds on the previous one to create your complete project.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default BuilderToolsSection;