import React, { useState } from 'react';
import { useGemini } from '../../hooks/useGemini';
import { Sparkles, RefreshCw, Download, Image, Wand2, AlertCircle } from 'lucide-react';

interface NameLogoSectionProps {
  projectData: any;
  onUpdate: (updates: any) => void;
  apiKey: string;
}

const NameLogoSection: React.FC<NameLogoSectionProps> = ({ 
  projectData, 
  onUpdate, 
  apiKey 
}) => {
  const { generateStructuredContent, generateLogo, isLoading, error } = useGemini();
  const [suggestions, setSuggestions] = useState<any>(null);
  const [generatedLogos, setGeneratedLogos] = useState<any[]>([]);
  const [isGeneratingLogo, setIsGeneratingLogo] = useState(false);
  const [logoError, setLogoError] = useState<string | null>(null);

  const generateSuggestions = async () => {
    const prompt = `
      Based on the following project details, generate creative suggestions:
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Target Audience: ${projectData.targetAudience}
      - Budget: ${projectData.budget}
      - Timeline: ${projectData.timeline}

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

    const result = await generateStructuredContent(prompt, apiKey);
    if (result) {
      setSuggestions(result);
    }
  };

  const generateLogoImage = async (logoDescription?: string) => {
    setIsGeneratingLogo(true);
    setLogoError(null);
    
    const projectName = projectData.name || 'Project';
    const description = logoDescription || `Modern, clean logo for ${projectData.projectType}`;
    
    const logoPrompt = `Create a professional, modern logo for "${projectName}" - ${description}. 
    The logo should be:
    - Clean and minimalist design
    - Suitable for ${projectData.platform} platform
    - Appealing to ${projectData.targetAudience}
    - Vector-style with clear, bold shapes
    - Professional color scheme
    - Scalable and readable at small sizes
    - No text/typography, just the icon/symbol
    
    Style: Modern, professional, ${projectData.projectType} themed`;

    try {
      const result = await generateLogo(logoPrompt, apiKey);
      if (result) {
        const newLogo = {
          id: Date.now(),
          imageUrl: result.imageUrl,
          description: description,
          prompt: logoPrompt
        };
        setGeneratedLogos(prev => [newLogo, ...prev]);
        
        // Auto-select the first generated logo
        if (generatedLogos.length === 0) {
          onUpdate({ logo: result.imageUrl });
        }
      } else if (error) {
        setLogoError(error);
      }
    } catch (error) {
      console.error('Logo generation failed:', error);
      setLogoError('Failed to generate logo. Please try again.');
    } finally {
      setIsGeneratingLogo(false);
    }
  };

  const selectName = (name: string) => {
    onUpdate({ name });
  };

  const selectSlogan = (slogan: string) => {
    onUpdate({ slogan });
  };

  const selectLogo = (logoUrl: string) => {
    onUpdate({ logo: logoUrl });
  };

  const downloadLogo = (logoUrl: string, logoId: number) => {
    const link = document.createElement('a');
    link.href = logoUrl;
    link.download = `${projectData.name || 'logo'}-${logoId}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-8">
      {/* Current Selection */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Current Selection</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Name</label>
            <input
              type="text"
              value={projectData.name || ''}
              onChange={(e) => onUpdate({ name: e.target.value })}
              placeholder="Enter your project name"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Slogan</label>
            <input
              type="text"
              value={projectData.slogan || ''}
              onChange={(e) => onUpdate({ slogan: e.target.value })}
              placeholder="Enter your project slogan"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Current Logo Display */}
          {projectData.logo && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Selected Logo</label>
              <div className="flex items-center space-x-4">
                <img 
                  src={projectData.logo} 
                  alt="Selected logo" 
                  className="w-16 h-16 object-contain bg-white rounded-lg border border-gray-200 p-2"
                />
                <button
                  onClick={() => downloadLogo(projectData.logo, Date.now())}
                  className="flex items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors text-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* AI Logo Generation */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">AI Logo Generation</h3>
          <button
            onClick={() => generateLogoImage()}
            disabled={isGeneratingLogo || !apiKey || !projectData.name}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
          >
            {isGeneratingLogo ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Wand2 className="h-4 w-4 mr-2" />
            )}
            Generate Logo
          </button>
        </div>

        {!apiKey && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-4">
            <p className="text-amber-800 text-sm">
              Please add your Gemini API key to generate logos with AI.
            </p>
          </div>
        )}

        {!projectData.name && apiKey && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
            <p className="text-blue-800 text-sm">
              Please enter a project name first to generate a logo.
            </p>
          </div>
        )}

        {/* Logo Generation Error Display */}
        {logoError && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5 mr-3 flex-shrink-0" />
              <div>
                <p className="text-red-800 text-sm font-medium">Logo Generation Failed</p>
                <p className="text-red-700 text-sm mt-1">{logoError}</p>
                {logoError.includes('overloaded') && (
                  <p className="text-red-600 text-xs mt-2">
                    💡 Tip: The AI service is busy. Wait a moment and try again, or try generating a different logo concept.
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Generated Logos */}
        {generatedLogos.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
            {generatedLogos.map((logo) => (
              <div key={logo.id} className="bg-white rounded-lg border border-gray-200 p-4 hover:border-purple-300 transition-colors">
                <img 
                  src={logo.imageUrl} 
                  alt={logo.description}
                  className="w-full h-24 object-contain bg-gray-50 rounded-lg mb-3"
                />
                <p className="text-xs text-gray-600 mb-3">{logo.description}</p>
                <div className="flex space-x-2">
                  <button
                    onClick={() => selectLogo(logo.imageUrl)}
                    className={`flex-1 px-3 py-2 text-sm rounded transition-colors ${
                      projectData.logo === logo.imageUrl
                        ? 'bg-purple-600 text-white'
                        : 'bg-purple-100 text-purple-700 hover:bg-purple-200'
                    }`}
                  >
                    {projectData.logo === logo.imageUrl ? 'Selected' : 'Select'}
                  </button>
                  <button
                    onClick={() => downloadLogo(logo.imageUrl, logo.id)}
                    className="p-2 text-gray-600 hover:text-purple-600 transition-colors"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* AI Text Suggestions */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">AI Text Suggestions</h3>
          <button
            onClick={generateSuggestions}
            disabled={isLoading || !apiKey}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Sparkles className="h-4 w-4 mr-2" />
            )}
            Generate Ideas
          </button>
        </div>

        {suggestions && (
          <div className="space-y-6">
            {/* Name Suggestions */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Name Suggestions</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {suggestions.names?.map((name: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => selectName(name)}
                    className="text-left p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <span className="font-medium text-gray-900">{name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Slogan Suggestions */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Slogan Suggestions</h4>
              <div className="space-y-2">
                {suggestions.slogans?.map((slogan: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => selectSlogan(slogan)}
                    className="text-left w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-all duration-200"
                  >
                    <span className="text-gray-900">{slogan}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Logo Ideas for Generation */}
            <div>
              <h4 className="font-medium text-gray-900 mb-3">Logo Concept Ideas</h4>
              <div className="space-y-3">
                {suggestions.logoIdeas?.map((idea: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200"
                  >
                    <p className="text-gray-700 flex-1">{idea}</p>
                    <button
                      onClick={() => generateLogoImage(idea)}
                      disabled={isGeneratingLogo || !apiKey || !projectData.name}
                      className="ml-4 flex items-center px-3 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 text-sm"
                    >
                      <Image className="h-4 w-4 mr-2" />
                      Generate
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Manual Input Guide */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Tips for Great Names & Logos</h3>
        <div className="space-y-2 text-sm text-gray-600">
          <p>• Keep names short, memorable, and easy to pronounce</p>
          <p>• Ensure the name reflects your project's core purpose</p>
          <p>• Make slogans concise and impactful (under 10 words)</p>
          <p>• Consider your target audience when choosing tone</p>
          <p>• Check domain availability for web projects</p>
          <p>• Logos should be simple, scalable, and work in different sizes</p>
          <p>• Test logos in both color and black & white versions</p>
        </div>
      </div>
    </div>
  );
};

export default NameLogoSection;