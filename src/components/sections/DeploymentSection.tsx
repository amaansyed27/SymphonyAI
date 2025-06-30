import React, { useState, useEffect } from 'react';
import { useGemini } from '../../hooks/useGemini';
import { Rocket, MessageCircle, RefreshCw, Sparkles, ExternalLink, Send, Globe, DollarSign, Clock, Zap, CheckCircle, Star, Search } from 'lucide-react';

interface DeploymentSectionProps {
  projectData: any;
  onUpdate: (updates: any) => void;
  apiKey: string;
}

const DeploymentSection: React.FC<DeploymentSectionProps> = ({ 
  projectData, 
  onUpdate, 
  apiKey 
}) => {
  const { generateStructuredContent, generateContent, isLoading } = useGemini();
  const [activeTab, setActiveTab] = useState<'recommendations' | 'chat'>('recommendations');
  const [recommendations, setRecommendations] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isGeneratingRecommendations, setIsGeneratingRecommendations] = useState(false);

  // Initialize chat with welcome message
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([{
        role: 'assistant',
        content: `👋 **Welcome to Deployment Expert Chat!**

I'm here to help you deploy your **${projectData.projectType}** successfully!

**Your Project Context:**
• **Platform:** ${projectData.platform}
• **Experience:** ${projectData.experience}
• **Budget:** ${projectData.budget}
• **Tech Stack:** ${projectData.techStack ? `${projectData.techStack.frontend}, ${projectData.techStack.backend}` : 'Not selected yet'}
• **Selected Tools:** ${projectData.builderTools ? 'Tools configured' : 'No tools selected yet'}

**I can help you with:**
🚀 Platform recommendations (Vercel, Netlify, Railway, etc.)
💰 Cost analysis and budget optimization
⚙️ Setup and configuration guidance
🔧 CI/CD pipeline setup
🌐 Domain and DNS configuration
📊 Performance optimization
🛡️ Security best practices
🔍 Troubleshooting deployment issues

**What would you like to know about deploying your project?**`
      }]);
    }
  }, [projectData]);

  const generateRecommendations = async () => {
    if (!apiKey) return;

    setIsGeneratingRecommendations(true);
    
    // Build context from all project data
    const selectedTools = projectData.builderTools || [];
    const toolNames = selectedTools.map((tool: any) => tool.name).join(', ');
    
    const prompt = `
      Search for the best deployment platforms and strategies for this project:
      
      **Project Context:**
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Experience Level: ${projectData.experience}
      - Budget: ${projectData.budget} (low: $0-$500/month, medium: $500-$2000/month, high: $2000+/month)
      - Timeline: ${projectData.timeline}
      
      **Technical Stack:**
      - Frontend: ${projectData.techStack?.frontend || 'Not selected'}
      - Backend: ${projectData.techStack?.backend || 'Not selected'}
      - Database: ${projectData.techStack?.database || 'Not selected'}
      - Current Hosting: ${projectData.techStack?.hosting || 'Not selected'}
      
      **Selected Development Tools:**
      ${toolNames || 'No tools selected yet'}
      
      **Selected Features:**
      ${projectData.decidedFeatures?.map((f: any) => f.name).join(', ') || 'Basic functionality'}
      
      Search for current deployment options and provide recommendations in JSON format:
      {
        "analysis": {
          "projectComplexity": "Simple/Medium/Complex",
          "estimatedTraffic": "Low/Medium/High",
          "scalabilityNeeds": "Basic/Moderate/High",
          "budgetFit": "Analysis of budget vs requirements"
        },
        "recommendations": [
          {
            "name": "Platform name",
            "type": "Frontend/Backend/Full-stack/Database",
            "pricing": "Free tier + paid plans with current prices",
            "pros": ["advantage1", "advantage2", "advantage3"],
            "cons": ["limitation1", "limitation2"],
            "bestFor": "Who should use this",
            "setup": ["step1", "step2", "step3"],
            "url": "https://platform.com",
            "score": 85,
            "monthlyEstimate": "$0-50",
            "deploymentTime": "5-15 minutes",
            "scalability": "Excellent/Good/Limited",
            "easeOfUse": "Beginner/Intermediate/Advanced"
          }
        ],
        "deploymentStrategy": {
          "recommendedApproach": "Strategy description",
          "cicdSuggestions": ["suggestion1", "suggestion2"],
          "domainAdvice": "Domain and DNS recommendations",
          "securityTips": ["tip1", "tip2", "tip3"]
        }
      }
      
      Consider platforms like Vercel, Netlify, Railway, Render, DigitalOcean, AWS, Heroku, Firebase Hosting, Supabase, PlanetScale, etc.
      Score each platform based on suitability for this specific project (0-100).
      Include current pricing information and recent updates.
      Consider the selected development tools for integration recommendations.
    `;

    try {
      const result = await generateStructuredContent(prompt, apiKey, true); // Enable Google Search grounding
      if (result) {
        setRecommendations(result);
      }
    } catch (error) {
      console.error('Error generating recommendations:', error);
    } finally {
      setIsGeneratingRecommendations(false);
    }
  };

  // Auto-generate recommendations when component loads
  useEffect(() => {
    if (apiKey && projectData.platform) {
      generateRecommendations();
    }
  }, [projectData.platform, projectData.techStack, apiKey]);

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !apiKey) return;

    const userMessage = { role: 'user', content: chatInput };
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsChatLoading(true);

    const conversationHistory = updatedMessages.slice(-6).map(msg => `${msg.role}: ${msg.content}`).join('\n');
    
    const prompt = `
      You are a deployment expert helping with a ${projectData.projectType} project.
      
      **Project Context:**
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Experience Level: ${projectData.experience}
      - Budget: ${projectData.budget}
      - Timeline: ${projectData.timeline}
      - Tech Stack: ${projectData.techStack ? 
        `Frontend: ${projectData.techStack.frontend}, Backend: ${projectData.techStack.backend}, Database: ${projectData.techStack.database}` : 
        'Not selected'}
      - Selected Tools: ${projectData.builderTools ? 'Tools configured' : 'No tools selected'}
      - Current Deployment: ${projectData.deployment ? projectData.deployment.platform : 'Not selected'}
      
      **Recent Conversation:**
      ${conversationHistory}
      
      **User Question:** ${chatInput}
      
      Search for the latest information about deployment platforms, pricing, and best practices.
      Provide helpful, specific guidance that considers:
      - Current deployment platform features and pricing
      - Integration with their selected tech stack and tools
      - Best practices for ${projectData.projectType} projects
      - Step-by-step instructions when appropriate
      - Cost optimization tips
      - Performance and security recommendations
      - Recent updates or changes in the deployment landscape
      
      Format your response clearly and be practical and actionable.
      Consider the user's ${projectData.experience} experience level.
      Include specific examples and current pricing when relevant.
    `;

    try {
      const result = await generateContent(prompt, apiKey, true); // Enable Google Search grounding
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
        content: 'Sorry, I encountered an error. Please try again or try rephrasing your question.'
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const selectPlatform = (platform: any) => {
    onUpdate({ 
      deployment: {
        platform: platform.name,
        reasoning: `Selected ${platform.name} because: ${platform.bestFor}`,
        steps: platform.setup,
        pricing: platform.monthlyEstimate,
        score: platform.score
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return 'text-green-300 bg-green-500/20 border-green-500/30';
    if (score >= 70) return 'text-yellow-300 bg-yellow-500/20 border-yellow-500/30';
    if (score >= 50) return 'text-orange-300 bg-orange-500/20 border-orange-500/30';
    return 'text-red-300 bg-red-500/20 border-red-500/30';
  };

  const getComplexityColor = (complexity: string) => {
    switch (complexity?.toLowerCase()) {
      case 'simple': return 'text-green-300 bg-green-500/20';
      case 'medium': return 'text-yellow-300 bg-yellow-500/20';
      case 'complex': return 'text-red-300 bg-red-500/20';
      default: return 'text-gray-300 bg-gray-500/20';
    }
  };

  const tabs = [
    { id: 'recommendations', label: 'Smart Recommendations', icon: Sparkles },
    { id: 'chat', label: 'Deployment Expert Chat', icon: MessageCircle }
  ];

  return (
    <div className="space-y-6">
      {/* Current Selection */}
      {projectData.deployment && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Rocket className="h-5 w-5 text-green-400 mr-2" />
            Selected Deployment Platform
          </h3>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div>
                <span className="font-medium text-gray-300">Platform:</span>
                <span className="ml-2 text-white text-lg">{projectData.deployment.platform}</span>
              </div>
              <div>
                <span className="font-medium text-gray-300">Estimated Cost:</span>
                <span className="ml-2 text-green-300">{projectData.deployment.pricing || 'Contact for pricing'}</span>
              </div>
              {projectData.deployment.score && (
                <div>
                  <span className="font-medium text-gray-300">Suitability Score:</span>
                  <span className={`ml-2 px-2 py-1 rounded text-sm ${getScoreColor(projectData.deployment.score)}`}>
                    {projectData.deployment.score}/100
                  </span>
                </div>
              )}
            </div>
            <div>
              <span className="font-medium text-gray-300">Reasoning:</span>
              <p className="text-gray-400 mt-1">{projectData.deployment.reasoning}</p>
            </div>
          </div>
          
          {projectData.deployment.steps && (
            <div className="mt-4">
              <span className="font-medium text-gray-300">Setup Steps:</span>
              <ol className="list-decimal list-inside mt-2 space-y-1 text-sm text-gray-400">
                {projectData.deployment.steps.map((step: string, index: number) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Deployment & Sharing</h3>
        {activeTab === 'recommendations' && (
          <button
            onClick={generateRecommendations}
            disabled={isGeneratingRecommendations || !apiKey}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
          >
            {isGeneratingRecommendations ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Refresh Recommendations
          </button>
        )}
      </div>

      {!apiKey && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-amber-200 text-sm">
            Please add your Gemini API key to get AI-powered deployment recommendations with real-time pricing and expert chat assistance.
          </p>
        </div>
      )}

      {/* Tab Navigation */}
      <div className="border-b border-slate-600">
        <nav className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center py-2 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === tab.id
                  ? 'border-blue-500 text-blue-400'
                  : 'border-transparent text-gray-400 hover:text-gray-300 hover:border-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4 mr-2" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Tab Content */}
      <div className="mt-6">
        {/* Recommendations Tab */}
        {activeTab === 'recommendations' && (
          <div className="space-y-6">
            {/* Project Analysis */}
            {recommendations?.analysis && (
              <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                  <Zap className="h-5 w-5 text-purple-400 mr-2" />
                  Project Analysis
                </h4>
                <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <div className="bg-slate-600/30 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 text-blue-400 mr-2" />
                      <span className="font-medium text-gray-300">Complexity</span>
                    </div>
                    <span className={`px-2 py-1 rounded text-sm ${getComplexityColor(recommendations.analysis.projectComplexity)}`}>
                      {recommendations.analysis.projectComplexity}
                    </span>
                  </div>
                  <div className="bg-slate-600/30 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Globe className="h-4 w-4 text-green-400 mr-2" />
                      <span className="font-medium text-gray-300">Traffic</span>
                    </div>
                    <span className="text-white">{recommendations.analysis.estimatedTraffic}</span>
                  </div>
                  <div className="bg-slate-600/30 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <Rocket className="h-4 w-4 text-orange-400 mr-2" />
                      <span className="font-medium text-gray-300">Scalability</span>
                    </div>
                    <span className="text-white">{recommendations.analysis.scalabilityNeeds}</span>
                  </div>
                  <div className="bg-slate-600/30 rounded-lg p-4">
                    <div className="flex items-center mb-2">
                      <DollarSign className="h-4 w-4 text-yellow-400 mr-2" />
                      <span className="font-medium text-gray-300">Budget Fit</span>
                    </div>
                    <span className="text-white text-sm">{recommendations.analysis.budgetFit}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Platform Recommendations */}
            {recommendations?.recommendations && (
              <div className="space-y-4">
                <h4 className="font-medium text-white">Recommended Platforms</h4>
                {recommendations.recommendations.map((platform: any, index: number) => (
                  <div key={index} className="border border-slate-600 rounded-xl p-6 hover:border-blue-400 transition-colors bg-slate-700/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center space-x-3">
                        <h5 className="text-xl font-semibold text-white">{platform.name}</h5>
                        <span className="bg-slate-600/50 text-gray-300 px-3 py-1 text-sm rounded-full">
                          {platform.type}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded border font-medium ${getScoreColor(platform.score)}`}>
                          {platform.score}/100
                        </span>
                      </div>
                      <div className="flex space-x-2">
                        {platform.url && (
                          <a
                            href={platform.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                          >
                            <ExternalLink className="h-4 w-4" />
                          </a>
                        )}
                        <button
                          onClick={() => selectPlatform(platform)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          Select Platform
                        </button>
                      </div>
                    </div>

                    {/* Platform Details */}
                    <div className="grid md:grid-cols-3 gap-4 mb-4">
                      <div className="bg-slate-600/30 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <DollarSign className="h-4 w-4 text-green-400 mr-2" />
                          <span className="font-medium text-gray-300">Cost</span>
                        </div>
                        <p className="text-white text-sm">{platform.monthlyEstimate}</p>
                        <p className="text-gray-400 text-xs">{platform.pricing}</p>
                      </div>
                      <div className="bg-slate-600/30 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <Clock className="h-4 w-4 text-blue-400 mr-2" />
                          <span className="font-medium text-gray-300">Deploy Time</span>
                        </div>
                        <p className="text-white text-sm">{platform.deploymentTime}</p>
                      </div>
                      <div className="bg-slate-600/30 rounded-lg p-3">
                        <div className="flex items-center mb-2">
                          <Rocket className="h-4 w-4 text-purple-400 mr-2" />
                          <span className="font-medium text-gray-300">Ease of Use</span>
                        </div>
                        <p className="text-white text-sm">{platform.easeOfUse}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6 mb-4">
                      <div>
                        <h6 className="font-medium text-green-400 mb-2">Advantages</h6>
                        <ul className="space-y-1">
                          {platform.pros?.map((pro: string, i: number) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start">
                              <CheckCircle className="h-4 w-4 text-green-400 mr-2 mt-0.5 flex-shrink-0" />
                              {pro}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-medium text-red-400 mb-2">Considerations</h6>
                        <ul className="space-y-1">
                          {platform.cons?.map((con: string, i: number) => (
                            <li key={i} className="text-sm text-gray-300 flex items-start">
                              <span className="text-red-400 mr-2 mt-0.5">⚠</span>
                              {con}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 mb-4">
                      <p className="text-sm text-blue-200">
                        <strong>Best for:</strong> {platform.bestFor}
                      </p>
                    </div>

                    <div>
                      <h6 className="font-medium text-gray-300 mb-2">Setup Process</h6>
                      <ol className="list-decimal list-inside space-y-1 text-sm text-gray-400">
                        {platform.setup?.map((step: string, i: number) => (
                          <li key={i}>{step}</li>
                        ))}
                      </ol>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Deployment Strategy */}
            {recommendations?.deploymentStrategy && (
              <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
                <h4 className="text-lg font-semibold text-white mb-4">Deployment Strategy</h4>
                <div className="space-y-4">
                  <div>
                    <h5 className="font-medium text-blue-400 mb-2">Recommended Approach</h5>
                    <p className="text-gray-300">{recommendations.deploymentStrategy.recommendedApproach}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-green-400 mb-2">CI/CD Suggestions</h5>
                    <ul className="space-y-1">
                      {recommendations.deploymentStrategy.cicdSuggestions?.map((suggestion: string, i: number) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start">
                          <span className="text-green-400 mr-2">•</span>
                          {suggestion}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-purple-400 mb-2">Domain & DNS</h5>
                    <p className="text-gray-300 text-sm">{recommendations.deploymentStrategy.domainAdvice}</p>
                  </div>
                  
                  <div>
                    <h5 className="font-medium text-orange-400 mb-2">Security Tips</h5>
                    <ul className="space-y-1">
                      {recommendations.deploymentStrategy.securityTips?.map((tip: string, i: number) => (
                        <li key={i} className="text-sm text-gray-300 flex items-start">
                          <span className="text-orange-400 mr-2">🛡️</span>
                          {tip}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {isGeneratingRecommendations && (
              <div className="text-center py-12">
                <RefreshCw className="h-12 w-12 animate-spin text-blue-400 mx-auto mb-4" />
                <p className="text-gray-400">Analyzing your project and searching for the best deployment options...</p>
              </div>
            )}
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                <MessageCircle className="h-5 w-5 text-blue-400 mr-2" />
                Deployment Expert Chat
                <span className="ml-2 text-sm text-gray-400">• Powered by Google Search</span>
              </h4>
              <p className="text-gray-400">Get real-time deployment advice, pricing info, and troubleshooting help</p>
            </div>

            {/* Chat Messages */}
            <div className="bg-slate-600/30 rounded-lg p-4 max-h-96 overflow-y-auto">
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
                  </div>
                ))}
                {isChatLoading && (
                  <div className="bg-slate-700/50 text-gray-200 mr-8 p-4 rounded-lg">
                    <div className="flex items-center">
                      <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                      <span className="text-sm">Searching for the latest deployment information...</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Chat Input */}
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Ask about deployment platforms, pricing, setup..."
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

            <div className="text-xs text-gray-400">
              💡 Try asking: "What's the cheapest way to deploy my {projectData.projectType}?" or "Compare Vercel vs Netlify pricing" or "How do I set up CI/CD for my project?" or "What are the security best practices for deployment?"
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DeploymentSection;