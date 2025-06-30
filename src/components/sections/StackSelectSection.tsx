import React, { useState, useEffect } from 'react';
import { useGemini } from '../../hooks/useGemini';
import { TechStack } from '../../types';
import { Code, Database, Server, Globe, Sparkles, RefreshCw } from 'lucide-react';

interface StackSelectSectionProps {
  projectData: any;
  onUpdate: (updates: any) => void;
  apiKey: string;
}

const StackSelectSection: React.FC<StackSelectSectionProps> = ({ 
  projectData, 
  onUpdate, 
  apiKey 
}) => {
  const { generateStructuredContent, isLoading } = useGemini();
  const [recommendations, setRecommendations] = useState<any>(null);

  const generateRecommendations = async () => {
    const prompt = `
      Based on the following project requirements, recommend technology stacks:
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Target Audience: ${projectData.targetAudience}
      - Budget: ${projectData.budget}
      - Timeline: ${projectData.timeline}
      - Experience Level: ${projectData.experience}

      Provide 3 different stack options (Budget-Friendly, Balanced, Premium) in JSON format:
      {
        "stacks": [
          {
            "tier": "Budget-Friendly",
            "priceRange": "$0-$50/month",
            "frontend": "Technology name",
            "backend": "Technology name",
            "database": "Technology name",
            "hosting": "Platform name",
            "pros": ["advantage1", "advantage2", "advantage3"],
            "cons": ["limitation1", "limitation2"],
            "suitableFor": "Who this is best for"
          }
        ]
      }

      Consider the user's experience level and provide realistic recommendations.
      For ${projectData.platform} platform specifically.
    `;

    const result = await generateStructuredContent(prompt, apiKey);
    if (result) {
      setRecommendations(result);
    }
  };

  useEffect(() => {
    if (apiKey && projectData.platform) {
      generateRecommendations();
    }
  }, [projectData.platform, apiKey]);

  const selectStack = (stack: any) => {
    const techStack: TechStack = {
      frontend: stack.frontend,
      backend: stack.backend,
      database: stack.database,
      hosting: stack.hosting,
      priceRange: stack.priceRange
    };
    onUpdate({ techStack });
  };

  const getTierColor = (tier: string) => {
    switch (tier) {
      case 'Budget-Friendly':
        return 'from-green-500 to-emerald-500 border-green-300';
      case 'Balanced':
        return 'from-blue-500 to-cyan-500 border-blue-300';
      case 'Premium':
        return 'from-purple-500 to-pink-500 border-purple-300';
      default:
        return 'from-gray-500 to-gray-600 border-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Current Selection */}
      {projectData.techStack && (
        <div className="bg-blue-50 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Stack</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-3">
              <Code className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">Frontend</p>
                <p className="text-gray-900">{projectData.techStack.frontend}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Server className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">Backend</p>
                <p className="text-gray-900">{projectData.techStack.backend}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Database className="h-5 w-5 text-orange-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">Database</p>
                <p className="text-gray-900">{projectData.techStack.database}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Globe className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-medium text-gray-700">Hosting</p>
                <p className="text-gray-900">{projectData.techStack.hosting}</p>
              </div>
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-600">
            Price Range: {projectData.techStack.priceRange}
          </div>
        </div>
      )}

      {/* Regenerate Button */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Technology Recommendations</h3>
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
            Please add your Gemini API key in the settings to get AI recommendations.
          </p>
        </div>
      )}

      {/* Stack Recommendations */}
      {recommendations && (
        <div className="space-y-6">
          {recommendations.stacks?.map((stack: any, index: number) => (
            <div
              key={index}
              className="border border-gray-200 rounded-xl p-6 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${getTierColor(stack.tier)}`}></div>
                  <h4 className="text-xl font-semibold text-gray-900">{stack.tier}</h4>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                    {stack.priceRange}
                  </span>
                </div>
                <button
                  onClick={() => selectStack(stack)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Select Stack
                </button>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Code className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Frontend</p>
                  <p className="text-gray-900 font-semibold">{stack.frontend}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Server className="h-6 w-6 text-green-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Backend</p>
                  <p className="text-gray-900 font-semibold">{stack.backend}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Database className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Database</p>
                  <p className="text-gray-900 font-semibold">{stack.database}</p>
                </div>
                <div className="text-center p-3 bg-gray-50 rounded-lg">
                  <Globe className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                  <p className="text-sm font-medium text-gray-700">Hosting</p>
                  <p className="text-gray-900 font-semibold">{stack.hosting}</p>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h5 className="font-medium text-green-700 mb-2">Pros</h5>
                  <ul className="space-y-1">
                    {stack.pros?.map((pro: string, i: number) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start">
                        <span className="text-green-500 mr-2">✓</span>
                        {pro}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h5 className="font-medium text-red-700 mb-2">Considerations</h5>
                  <ul className="space-y-1">
                    {stack.cons?.map((con: string, i: number) => (
                      <li key={i} className="text-sm text-gray-600 flex items-start">
                        <span className="text-red-500 mr-2">!</span>
                        {con}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-3">
                <p className="text-sm text-blue-800">
                  <strong>Best for:</strong> {stack.suitableFor}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default StackSelectSection;