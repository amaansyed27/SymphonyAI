import React, { useState } from 'react';
import { useGemini } from '../../hooks/useGemini';
import { Code, Database, RefreshCw, Sparkles, Copy, ExternalLink, MessageCircle, Send, Search, Star, DollarSign, Clock } from 'lucide-react';

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
  const { generateStructuredContent, generateContent, isLoading } = useGemini();
  const [recommendations, setRecommendations] = useState<any>(null);
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<{role: string, content: string, citations?: any[]}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);

  const generateRecommendations = async () => {
    const platformTools = {
      web: ['Bolt.new', 'v0 by Vercel', 'Lovable.dev', 'VS Code with Copilot', 'Claude Code', 'Gemini AI Studio'],
      mobile: ['Android Studio with Gemini API', 'Firebase Studio API', 'Flutter Flow', 'Xcode with AI'],
      desktop: ['Bolt.new', 'v0 by Vercel', 'Lovable.dev', 'VS Code with Copilot', 'Flutter Flow', 'Claude Code'],
      proprietary: ['VS Code with Copilot', 'Jupyter Notebook', 'TensorFlow', 'Custom development environments']
    };

    const relevantTools = platformTools[projectData.platform as keyof typeof platformTools] || platformTools.web;
    
    const prompt = `
      Search for the latest information about development tools for ${projectData.platform} platform projects.
      
      Project Context:
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Budget: ${projectData.budget} (low: $0-$500/month, medium: $500-$2000/month, high: $2000+/month)
      - Experience Level: ${projectData.experience}
      - Timeline: ${projectData.timeline}
      
      Focus on these tools: ${relevantTools.join(', ')}
      
      Find current pricing, features, and user reviews for each tool. Recommend 5-7 tools in JSON format:
      {
        "recommendations": [
          {
            "name": "Tool name",
            "category": "AI-Powered/Traditional/No-Code/IDE",
            "description": "What this tool does",
            "pricing": "Current pricing information",
            "features": ["feature1", "feature2", "feature3"],
            "pros": ["advantage1", "advantage2"],
            "cons": ["limitation1", "limitation2"],
            "bestFor": "Who should use this",
            "learningCurve": "Easy/Medium/Hard",
            "budgetFit": "low/medium/high",
            "setupTime": "Time to get started",
            "url": "Official website",
            "rating": 4.5,
            "userReviews": "Summary of recent user feedback"
          }
        ],
        "toolCount": "Estimated number of tools needed for this project",
        "totalCost": "Estimated monthly cost range",
        "recommendation": "Overall recommendation based on budget and experience"
      }
      
      Prioritize tools that fit the ${projectData.budget} budget and ${projectData.experience} experience level.
      Include real-time pricing and availability information.
    `;

    const result = await generateStructuredContent(prompt, apiKey, true); // Enable grounding
    if (result) {
      setRecommendations(result);
      onUpdate({ builderTools: result });
    }
  };

  const selectTool = (tool: any) => {
    setSelectedTool(tool);
    setChatMessages([{
      role: 'assistant',
      content: `Great choice! I'll help you set up ${tool.name} for your ${projectData.projectType}. 

**Tool Overview:**
- **Category:** ${tool.category}
- **Best for:** ${tool.bestFor}
- **Setup time:** ${tool.setupTime}
- **Learning curve:** ${tool.learningCurve}

What would you like to know? I can help with:
• Step-by-step setup instructions
• Configuration for your specific project
• Best practices and tips
• Integration with other tools
• Troubleshooting common issues

What would you like to start with?`
    }]);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !selectedTool || !apiKey) return;

    const userMessage = { role: 'user', content: chatInput };
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsChatLoading(true);

    const conversationHistory = updatedMessages.map(msg => `${msg.role}: ${msg.content}`).join('\n');
    
    const prompt = `
      You are an expert developer assistant helping set up ${selectedTool.name} for a ${projectData.projectType} project.
      
      Project Context:
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Experience Level: ${projectData.experience}
      - Selected Features: ${projectData.decidedFeatures?.map((f: any) => f.name).join(', ') || 'None selected'}
      - Tech Stack: ${projectData.techStack ? `${projectData.techStack.frontend}, ${projectData.techStack.backend}` : 'Not selected'}
      
      Tool Information:
      - Name: ${selectedTool.name}
      - Category: ${selectedTool.category}
      - Features: ${selectedTool.features?.join(', ')}
      
      Conversation History:
      ${conversationHistory}
      
      User Question: ${chatInput}
      
      Provide helpful, specific guidance for setting up and using ${selectedTool.name}. 
      Include step-by-step instructions when appropriate.
      Search for the latest setup guides, documentation, and best practices.
      Be practical and consider the user's experience level (${projectData.experience}).
      
      If providing setup steps, format them clearly with numbered lists.
      Include relevant links, commands, or configuration examples when helpful.
    `;

    try {
      const result = await generateContent(prompt, apiKey, true); // Enable grounding
      if (result) {
        setChatMessages([...updatedMessages, { 
          role: 'assistant', 
          content: result
        }]);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages([...updatedMessages, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again.'
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const getBudgetColor = (budgetFit: string) => {
    switch (budgetFit) {
      case 'low': return 'bg-green-500/20 text-green-300 border-green-500/30';
      case 'medium': return 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30';
      case 'high': return 'bg-red-500/20 text-red-300 border-red-500/30';
      default: return 'bg-gray-500/20 text-gray-300 border-gray-500/30';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-500/20 text-green-300';
      case 'Medium': return 'bg-yellow-500/20 text-yellow-300';
      case 'Hard': return 'bg-red-500/20 text-red-300';
      default: return 'bg-gray-500/20 text-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Generate Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">AI-Powered Tool Recommendations</h3>
        <button
          onClick={generateRecommendations}
          disabled={isLoading || !apiKey}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Search className="h-4 w-4 mr-2" />
          )}
          Find Best Tools
        </button>
      </div>

      {!apiKey && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-amber-200 text-sm">
            Please add your Gemini API key to get real-time tool recommendations with Google Search grounding.
          </p>
        </div>
      )}

      {/* Project Summary */}
      {recommendations && (
        <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
          <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Sparkles className="h-5 w-5 text-blue-400 mr-2" />
            Project Analysis
          </h4>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div className="bg-slate-600/30 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <Code className="h-4 w-4 text-blue-400 mr-2" />
                <span className="font-medium text-gray-300">Tools Needed</span>
              </div>
              <p className="text-white">{recommendations.toolCount}</p>
            </div>
            <div className="bg-slate-600/30 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <DollarSign className="h-4 w-4 text-green-400 mr-2" />
                <span className="font-medium text-gray-300">Estimated Cost</span>
              </div>
              <p className="text-white">{recommendations.totalCost}</p>
            </div>
            <div className="bg-slate-600/30 rounded-lg p-3">
              <div className="flex items-center mb-2">
                <Clock className="h-4 w-4 text-orange-400 mr-2" />
                <span className="font-medium text-gray-300">Platform</span>
              </div>
              <p className="text-white capitalize">{projectData.platform}</p>
            </div>
          </div>
          {recommendations.recommendation && (
            <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <p className="text-blue-200 text-sm">
                <strong>💡 Recommendation:</strong> {recommendations.recommendation}
              </p>
            </div>
          )}
        </div>
      )}

      {/* Tool Recommendations */}
      {recommendations?.recommendations && (
        <div className="space-y-6">
          <h4 className="text-lg font-medium text-white">Recommended Tools</h4>
          <div className="grid gap-6">
            {recommendations.recommendations.map((tool: any, index: number) => (
              <div key={index} className="border border-slate-600 rounded-xl p-6 hover:border-blue-400 transition-colors bg-slate-700/20">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-3 mb-2">
                      <h5 className="text-xl font-semibold text-white">{tool.name}</h5>
                      <span className="bg-slate-600/50 text-gray-300 px-2 py-1 text-xs rounded">
                        {tool.category}
                      </span>
                      <span className={`px-2 py-1 text-xs rounded border ${getBudgetColor(tool.budgetFit)}`}>
                        {tool.budgetFit} budget
                      </span>
                    </div>
                    
                    <div className="flex items-center space-x-4 mb-3">
                      <div className="flex items-center">
                        <Star className="h-4 w-4 text-yellow-400 mr-1" />
                        <span className="text-yellow-300 text-sm">{tool.rating}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded ${getDifficultyColor(tool.learningCurve)}`}>
                        {tool.learningCurve}
                      </span>
                      <span className="text-gray-400 text-sm">Setup: {tool.setupTime}</span>
                    </div>
                    
                    <p className="text-gray-300 mb-3">{tool.description}</p>
                    <p className="text-sm text-blue-300 mb-3">
                      <strong>Pricing:</strong> {tool.pricing}
                    </p>
                  </div>
                  
                  <div className="flex space-x-2 ml-4">
                    {tool.url && (
                      <a
                        href={tool.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <button
                      onClick={() => selectTool(tool)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Get Setup Help
                    </button>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h6 className="font-medium text-green-400 mb-2">Features</h6>
                    <div className="flex flex-wrap gap-2">
                      {tool.features?.map((feature: string, i: number) => (
                        <span key={i} className="bg-slate-600/30 text-gray-300 px-2 py-1 text-xs rounded border border-slate-600">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h6 className="font-medium text-blue-400 mb-2">Best For</h6>
                    <p className="text-sm text-gray-300">{tool.bestFor}</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <h6 className="font-medium text-green-400 mb-2">Advantages</h6>
                    <ul className="space-y-1">
                      {tool.pros?.map((pro: string, i: number) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start">
                          <span className="text-green-400 mr-2">✓</span>
                          {pro}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h6 className="font-medium text-red-400 mb-2">Considerations</h6>
                    <ul className="space-y-1">
                      {tool.cons?.map((con: string, i: number) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start">
                          <span className="text-red-400 mr-2">!</span>
                          {con}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {tool.userReviews && (
                  <div className="bg-slate-600/20 border border-slate-600 rounded-lg p-3">
                    <h6 className="font-medium text-gray-300 mb-2">Recent User Feedback</h6>
                    <p className="text-sm text-gray-400">{tool.userReviews}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tool Setup Chat */}
      {selectedTool && (
        <div className="border border-slate-600 rounded-xl p-6 bg-slate-700/20">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <MessageCircle className="h-5 w-5 text-blue-400 mr-2" />
            Setup Assistant for {selectedTool.name}
          </h3>

          {/* Chat Messages */}
          <div className="bg-slate-600/30 rounded-lg p-4 max-h-96 overflow-y-auto mb-4">
            {chatMessages.length === 0 ? (
              <p className="text-gray-400 text-sm">
                Select a tool above to start getting personalized setup assistance!
              </p>
            ) : (
              <div className="space-y-4">
                {chatMessages.map((message, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-lg ${
                      message.role === 'user'
                        ? 'bg-blue-500/20 text-blue-100 ml-8'
                        : 'bg-slate-700/50 text-gray-200 mr-8'
                    }`}
                  >
                    <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                    {message.citations && message.citations.length > 0 && (
                      <div className="mt-2 pt-2 border-t border-slate-600">
                        <p className="text-xs text-gray-400 mb-1">Sources:</p>
                        <div className="flex flex-wrap gap-2">
                          {message.citations.map((citation, i) => (
                            <a
                              key={i}
                              href={citation.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-blue-300 hover:text-blue-200 underline"
                            >
                              [{i + 1}] {citation.title}
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
                {isChatLoading && (
                  <div className="bg-slate-700/50 text-gray-200 mr-8 p-4 rounded-lg">
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">Getting the latest setup information...</span>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Chat Input */}
          <div className="flex space-x-2">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
              placeholder={`Ask about setting up ${selectedTool?.name}...`}
              className="flex-1 px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
              disabled={!apiKey || isChatLoading}
            />
            <button
              onClick={sendChatMessage}
              disabled={!chatInput.trim() || isChatLoading || !apiKey}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
            >
              {isChatLoading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </button>
          </div>

          <div className="mt-3 text-xs text-gray-400">
            💡 Try asking: "How do I set up {selectedTool?.name} for my project?" or "What are the best practices for {selectedTool?.name}?"
          </div>
        </div>
      )}
    </div>
  );
};

export default BuilderToolsSection;