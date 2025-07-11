import React, { useState } from 'react';
import { useGemini } from '../../hooks/useGemini';
import { Feature } from '../../types';
import { Lightbulb, MessageCircle, Plus, Check, X, Sparkles, RefreshCw } from 'lucide-react';

interface FeatureBrainstormSectionProps {
  projectData: any;
  onUpdate: (updates: any) => void;
  apiKey: string;
}

const FeatureBrainstormSection: React.FC<FeatureBrainstormSectionProps> = ({ 
  projectData, 
  onUpdate, 
  apiKey 
}) => {
  const { generateStructuredContent, generateContent, isLoading } = useGemini();
  const [mustHaveFeatures, setMustHaveFeatures] = useState<Feature[]>([]);
  const [brainstormFeatures, setBrainstormFeatures] = useState<Feature[]>([]);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);

  const generateMustHaveFeatures = async () => {
    // Build context from all previous decisions
    const context = `
      Project Context (use this to inform feature suggestions):
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Target Audience: ${projectData.targetAudience}
      - Budget: ${projectData.budget}
      - Timeline: ${projectData.timeline}
      - Experience Level: ${projectData.experience}
      ${projectData.name ? `- Project Name: ${projectData.name}` : ''}
      ${projectData.slogan ? `- Project Slogan: ${projectData.slogan}` : ''}
      ${projectData.techStack ? `- Tech Stack: ${projectData.techStack.frontend}, ${projectData.techStack.backend}, ${projectData.techStack.database}` : ''}
    `;

    const prompt = `
      ${context}

      Based on the project details above, generate essential must-have features for this ${projectData.projectType}.

      Generate 6-8 must-have features in JSON format:
      {
        "features": [
          {
            "name": "Feature name",
            "description": "Brief description of the feature",
            "priority": "high",
            "category": "Category name (e.g., Core, User Management, Content, etc.)"
          }
        ]
      }

      Focus on core functionality that this type of ${projectData.projectType} absolutely needs to function properly.
      Consider the target audience and platform when suggesting features.
    `;

    const result = await generateStructuredContent(prompt, apiKey);
    if (result && result.features) {
      const features = result.features.map((f: any, index: number) => ({
        ...f,
        id: `must-${index}`
      }));
      setMustHaveFeatures(features);
      onUpdate({ features: features });
    }
  };

  const handleChatSubmit = async () => {
    if (!chatMessage.trim() || !apiKey) return;

    const newMessage = { role: 'user', content: chatMessage };
    const updatedHistory = [...chatHistory, newMessage];
    setChatHistory(updatedHistory);
    setChatMessage('');

    // Build comprehensive context from all project data
    const context = `
      Project Context:
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Target Audience: ${projectData.targetAudience}
      - Budget: ${projectData.budget}
      - Timeline: ${projectData.timeline}
      - Experience Level: ${projectData.experience}
      ${projectData.name ? `- Project Name: ${projectData.name}` : ''}
      ${projectData.slogan ? `- Project Slogan: ${projectData.slogan}` : ''}
      ${projectData.techStack ? `- Tech Stack: ${projectData.techStack.frontend}, ${projectData.techStack.backend}, ${projectData.techStack.database}` : ''}
      ${projectData.uiStyle ? `- Design Style: ${projectData.uiStyle.designStyle}` : ''}
      
      Current Features: ${projectData.features?.map((f: Feature) => f.name).join(', ') || 'None yet'}
      Selected Features: ${projectData.decidedFeatures?.map((f: Feature) => f.name).join(', ') || 'None yet'}
    `;

    const contextPrompt = `
      ${context}
      
      User Question: ${chatMessage}
      
      If the user is asking for feature suggestions, respond with JSON format:
      {
        "response": "Your response text",
        "features": [
          {
            "name": "Feature name",
            "description": "Description",
            "priority": "medium",
            "category": "Category"
          }
        ]
      }
      
      If it's a general question, just respond with:
      {
        "response": "Your response text"
      }

      Consider all the project context when suggesting features. Make suggestions that fit the platform, target audience, and technical constraints.
    `;

    const result = await generateStructuredContent(contextPrompt, apiKey);
    if (result) {
      const assistantMessage = { role: 'assistant', content: result.response };
      setChatHistory([...updatedHistory, assistantMessage]);

      if (result.features) {
        const newFeatures = result.features.map((f: any, index: number) => ({
          ...f,
          id: `brainstorm-${Date.now()}-${index}`
        }));
        setBrainstormFeatures(prev => [...prev, ...newFeatures]);
      }
    }
  };

  const addFeatureToProject = (feature: Feature) => {
    const decidedFeatures = projectData.decidedFeatures || [];
    const updatedFeatures = [...decidedFeatures, feature];
    onUpdate({ decidedFeatures: updatedFeatures });
  };

  const removeFeatureFromProject = (featureId: string) => {
    const decidedFeatures = projectData.decidedFeatures || [];
    const updatedFeatures = decidedFeatures.filter((f: Feature) => f.id !== featureId);
    onUpdate({ decidedFeatures: updatedFeatures });
  };

  const isFeatureSelected = (featureId: string) => {
    const decidedFeatures = projectData.decidedFeatures || [];
    return decidedFeatures.some((f: Feature) => f.id === featureId);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  return (
    <div className="space-y-8">
      {/* Decided Features */}
      {projectData.decidedFeatures && projectData.decidedFeatures.length > 0 && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Check className="h-5 w-5 text-green-400 mr-2" />
            Selected Features ({projectData.decidedFeatures.length})
          </h3>
          <div className="grid gap-3">
            {projectData.decidedFeatures.map((feature: Feature) => (
              <div key={feature.id} className="flex items-center justify-between bg-slate-700/30 p-3 rounded-lg border border-green-500/30">
                <div className="flex-1">
                  <h4 className="font-medium text-white">{feature.name}</h4>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </div>
                <button
                  onClick={() => removeFeatureFromProject(feature.id)}
                  className="ml-3 p-1 text-red-400 hover:bg-red-500/20 rounded"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Must-Have Features */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-white">Must-Have Features</h3>
          <button
            onClick={generateMustHaveFeatures}
            disabled={isLoading || !apiKey}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Generate Features
          </button>
        </div>

        {!apiKey && (
          <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4 mb-4">
            <p className="text-amber-200 text-sm">
              Please add your Gemini API key to generate feature suggestions.
            </p>
          </div>
        )}

        <div className="grid gap-4">
          {mustHaveFeatures.map((feature) => (
            <div key={feature.id} className="border border-slate-600 rounded-lg p-4 hover:border-blue-400 transition-colors bg-slate-700/20">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h4 className="font-medium text-white">{feature.name}</h4>
                    <span className={`px-2 py-1 text-xs rounded border ${getPriorityColor(feature.priority)}`}>
                      {feature.priority}
                    </span>
                    <span className="bg-blue-500/20 text-blue-300 px-2 py-1 text-xs rounded">
                      {feature.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-300">{feature.description}</p>
                </div>
                <button
                  onClick={() => isFeatureSelected(feature.id) 
                    ? removeFeatureFromProject(feature.id) 
                    : addFeatureToProject(feature)}
                  className={`ml-3 p-2 rounded-lg transition-colors ${
                    isFeatureSelected(feature.id)
                      ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                      : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                  }`}
                >
                  {isFeatureSelected(feature.id) ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feature Brainstorm Chat */}
      <div className="border border-slate-600 rounded-xl p-6 bg-slate-700/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <MessageCircle className="h-5 w-5 text-blue-400 mr-2" />
          Feature Brainstorm Chat
        </h3>

        {/* Chat History */}
        <div className="bg-slate-600/30 rounded-lg p-4 max-h-64 overflow-y-auto mb-4">
          {chatHistory.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Ask me about feature ideas for your {projectData.projectType}. For example:
              "What authentication features should I include?" or "Suggest some unique features for my project"
            </p>
          ) : (
            <div className="space-y-3">
              {chatHistory.map((message, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500/20 text-blue-100 ml-8'
                      : 'bg-slate-700/50 text-gray-200 mr-8'
                  }`}
                >
                  <p className="text-sm">{message.content}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="flex space-x-2">
          <input
            type="text"
            value={chatMessage}
            onChange={(e) => setChatMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
            placeholder="Ask about feature ideas..."
            className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
            disabled={!apiKey}
          />
          <button
            onClick={handleChatSubmit}
            disabled={!chatMessage.trim() || isLoading || !apiKey}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 animate-spin" />
            ) : (
              'Send'
            )}
          </button>
        </div>
      </div>

      {/* Brainstormed Features */}
      {brainstormFeatures.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-white mb-4">Brainstormed Features</h3>
          <div className="grid gap-4">
            {brainstormFeatures.map((feature) => (
              <div key={feature.id} className="border border-purple-500/30 rounded-lg p-4 bg-purple-500/10">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="font-medium text-white">{feature.name}</h4>
                      <span className={`px-2 py-1 text-xs rounded border ${getPriorityColor(feature.priority)}`}>
                        {feature.priority}
                      </span>
                      <span className="bg-purple-500/20 text-purple-300 px-2 py-1 text-xs rounded">
                        {feature.category}
                      </span>
                    </div>
                    <p className="text-sm text-gray-300">{feature.description}</p>
                  </div>
                  <button
                    onClick={() => isFeatureSelected(feature.id) 
                      ? removeFeatureFromProject(feature.id) 
                      : addFeatureToProject(feature)}
                    className={`ml-3 p-2 rounded-lg transition-colors ${
                      isFeatureSelected(feature.id)
                        ? 'bg-green-500/20 text-green-400 hover:bg-green-500/30'
                        : 'bg-blue-500/20 text-blue-400 hover:bg-blue-500/30'
                    }`}
                  >
                    {isFeatureSelected(feature.id) ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Plus className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FeatureBrainstormSection;