import React, { useState } from 'react';
import { useGemini } from '../../hooks/useGemini';
import { Rocket, MessageCircle, RefreshCw, Sparkles, ExternalLink } from 'lucide-react';

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
  const [recommendations, setRecommendations] = useState<any>(null);
  const [chatMessage, setChatMessage] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: string, content: string}[]>([]);

  const generateRecommendations = async () => {
    const prompt = `
      Based on the following project details, recommend deployment platforms:
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Tech Stack: ${projectData.techStack ? 
        `Frontend: ${projectData.techStack.frontend}, Backend: ${projectData.techStack.backend}, Database: ${projectData.techStack.database}` : 
        'Not selected'}
      - Budget: ${projectData.budget}
      - Timeline: ${projectData.timeline}
      - Experience Level: ${projectData.experience}

      Recommend 3-5 deployment platforms in JSON format:
      {
        "recommendations": [
          {
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
        ]
      }

      Consider platforms like Vercel, Netlify, Railway, Render, DigitalOcean, AWS, Heroku, Firebase Hosting, etc.
      Score each platform based on suitability for this specific project (0-100).
    `;

    const result = await generateStructuredContent(prompt, apiKey);
    if (result) {
      setRecommendations(result);
    }
  };

  const handleChatSubmit = async () => {
    if (!chatMessage.trim() || !apiKey) return;

    const newMessage = { role: 'user', content: chatMessage };
    const updatedHistory = [...chatHistory, newMessage];
    setChatHistory(updatedHistory);
    setChatMessage('');

    const contextPrompt = `
      You are a deployment expert helping with this project:
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Tech Stack: ${projectData.techStack ? 
        `${projectData.techStack.frontend}, ${projectData.techStack.backend}, ${projectData.techStack.database}` : 
        'Not decided'}
      - Budget: ${projectData.budget}
      - Experience: ${projectData.experience}

      User question: ${chatMessage}

      Provide helpful, specific advice about deployment options, costs, setup processes, or troubleshooting.
      Be practical and consider the user's experience level.
    `;

    const result = await generateContent(contextPrompt, apiKey);
    if (result) {
      const assistantMessage = { role: 'assistant', content: result };
      setChatHistory([...updatedHistory, assistantMessage]);
    }
  };

  const selectPlatform = (platform: any) => {
    onUpdate({ 
      deployment: {
        platform: platform.name,
        reasoning: `Selected ${platform.name} because: ${platform.bestFor}`,
        steps: platform.setup
      }
    });
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-300 bg-green-500/20';
    if (score >= 60) return 'text-yellow-300 bg-yellow-500/20';
    return 'text-red-300 bg-red-500/20';
  };

  return (
    <div className="space-y-8">
      {/* Current Selection */}
      {projectData.deployment && (
        <div className="bg-green-500/10 border border-green-500/20 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
            <Rocket className="h-5 w-5 text-green-400 mr-2" />
            Selected Deployment Platform
          </h3>
          <div className="space-y-3">
            <div>
              <span className="font-medium text-gray-300">Platform:</span>
              <span className="ml-2 text-white">{projectData.deployment.platform}</span>
            </div>
            <div>
              <span className="font-medium text-gray-300">Reasoning:</span>
              <p className="text-gray-400 mt-1">{projectData.deployment.reasoning}</p>
            </div>
            {projectData.deployment.steps && (
              <div>
                <span className="font-medium text-gray-300">Setup Steps:</span>
                <ol className="list-decimal list-inside mt-2 space-y-1 text-sm text-gray-400">
                  {projectData.deployment.steps.map((step: string, index: number) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Generate Recommendations */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Deployment Recommendations</h3>
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
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-amber-200 text-sm">
            Please add your Gemini API key to get deployment recommendations and expert advice.
          </p>
        </div>
      )}

      {/* Platform Recommendations */}
      {recommendations && (
        <div className="space-y-4">
          <h4 className="font-medium text-white">Recommended Platforms</h4>
          {recommendations.recommendations?.map((platform: any, index: number) => (
            <div key={index} className="border border-slate-600 rounded-lg p-6 hover:border-blue-400 transition-colors bg-slate-700/20">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <h5 className="text-lg font-semibold text-white">{platform.name}</h5>
                  <span className="bg-slate-600/50 text-gray-300 px-2 py-1 text-xs rounded">
                    {platform.type}
                  </span>
                  <span className={`px-2 py-1 text-xs rounded font-medium ${getScoreColor(platform.score)}`}>
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

              <div className="grid md:grid-cols-2 gap-6 mb-4">
                <div>
                  <h6 className="font-medium text-green-400 mb-2">Advantages</h6>
                  <ul className="space-y-1">
                    {platform.pros?.map((pro: string, i: number) => (
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
                    {platform.cons?.map((con: string, i: number) => (
                      <li key={i} className="text-sm text-gray-300 flex items-start">
                        <span className="text-red-400 mr-2">!</span>
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
                <p className="text-sm text-blue-300 mt-1">
                  <strong>Pricing:</strong> {platform.pricing}
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

      {/* Deployment Expert Chat */}
      <div className="border border-slate-600 rounded-xl p-6 bg-slate-700/20">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <MessageCircle className="h-5 w-5 text-blue-400 mr-2" />
          Deployment Expert Chat
        </h3>

        {/* Chat History */}
        <div className="bg-slate-600/30 rounded-lg p-4 max-h-64 overflow-y-auto mb-4">
          {chatHistory.length === 0 ? (
            <p className="text-gray-400 text-sm">
              Ask me about deployment strategies, platform comparisons, pricing, or setup help. 
              For example: "What's the difference between Vercel and Netlify?" or "How much will it cost to deploy my app?"
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
                  <p className="text-sm whitespace-pre-wrap">{message.content}</p>
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
            placeholder="Ask about deployment options..."
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
    </div>
  );
};

export default DeploymentSection;