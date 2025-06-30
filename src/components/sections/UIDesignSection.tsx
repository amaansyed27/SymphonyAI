import React, { useState } from 'react';
import { useGemini } from '../../hooks/useGemini';
import { Palette, RefreshCw, Sparkles, Eye } from 'lucide-react';

interface UIDesignSectionProps {
  projectData: any;
  onUpdate: (updates: any) => void;
  apiKey: string;
}

const UIDesignSection: React.FC<UIDesignSectionProps> = ({ 
  projectData, 
  onUpdate, 
  apiKey 
}) => {
  const { generateStructuredContent, isLoading } = useGemini();
  const [designSuggestions, setDesignSuggestions] = useState<any>(null);

  const generateDesignSuggestions = async () => {
    const prompt = `
      Based on the following project details, generate UI design suggestions:
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Target Audience: ${projectData.targetAudience}
      - Selected Features: ${projectData.decidedFeatures?.map((f: any) => f.name).join(', ') || 'None selected'}

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
        ],
        "inspirationSources": [
          {
            "name": "App/Website name",
            "reason": "Why this is good inspiration",
            "elements": ["element1", "element2"]
          }
        ]
      }

      Consider the target audience and project type when suggesting colors and styles.
    `;

    const result = await generateStructuredContent(prompt, apiKey);
    if (result) {
      setDesignSuggestions(result);
    }
  };

  const selectPalette = (palette: any) => {
    const uiStyle = {
      ...projectData.uiStyle,
      colorPalette: [palette.primary, palette.secondary, palette.accent, palette.background, palette.text],
      selectedPalette: palette
    };
    onUpdate({ uiStyle });
  };

  const selectDesignStyle = (style: any) => {
    const uiStyle = {
      ...projectData.uiStyle,
      designStyle: style.name,
      selectedStyle: style
    };
    onUpdate({ uiStyle });
  };

  return (
    <div className="space-y-8">
      {/* Current Selection */}
      {projectData.uiStyle && (
        <div className="bg-slate-700/30 rounded-xl p-6 border border-slate-600">
          <h3 className="text-lg font-semibold text-white mb-4">Current Design</h3>
          
          {projectData.uiStyle.selectedPalette && (
            <div className="mb-6">
              <h4 className="font-medium text-gray-300 mb-3">Color Palette: {projectData.uiStyle.selectedPalette.name}</h4>
              <div className="flex space-x-2 mb-2">
                <div 
                  className="w-12 h-12 rounded-lg border border-slate-500 shadow-sm"
                  style={{ backgroundColor: projectData.uiStyle.selectedPalette.primary }}
                  title="Primary"
                />
                <div 
                  className="w-12 h-12 rounded-lg border border-slate-500 shadow-sm"
                  style={{ backgroundColor: projectData.uiStyle.selectedPalette.secondary }}
                  title="Secondary"
                />
                <div 
                  className="w-12 h-12 rounded-lg border border-slate-500 shadow-sm"
                  style={{ backgroundColor: projectData.uiStyle.selectedPalette.accent }}
                  title="Accent"
                />
                <div 
                  className="w-12 h-12 rounded-lg border border-slate-500 shadow-sm"
                  style={{ backgroundColor: projectData.uiStyle.selectedPalette.background }}
                  title="Background"
                />
                <div 
                  className="w-12 h-12 rounded-lg border border-slate-500 shadow-sm"
                  style={{ backgroundColor: projectData.uiStyle.selectedPalette.text }}
                  title="Text"
                />
              </div>
              <p className="text-sm text-gray-400">{projectData.uiStyle.selectedPalette.description}</p>
            </div>
          )}

          {projectData.uiStyle.selectedStyle && (
            <div>
              <h4 className="font-medium text-gray-300 mb-2">Design Style: {projectData.uiStyle.selectedStyle.name}</h4>
              <p className="text-sm text-gray-400 mb-2">{projectData.uiStyle.selectedStyle.description}</p>
              <div className="flex flex-wrap gap-2">
                {projectData.uiStyle.selectedStyle.characteristics?.map((char: string, index: number) => (
                  <span key={index} className="bg-blue-500/20 text-blue-300 px-2 py-1 text-xs rounded">
                    {char}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Generate Design Suggestions */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Design Suggestions</h3>
        <button
          onClick={generateDesignSuggestions}
          disabled={isLoading || !apiKey}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Generate Designs
        </button>
      </div>

      {!apiKey && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-amber-200 text-sm">
            Please add your Gemini API key to generate design suggestions.
          </p>
        </div>
      )}

      {designSuggestions && (
        <div className="space-y-8">
          {/* Color Palettes */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4 flex items-center">
              <Palette className="h-5 w-5 text-purple-400 mr-2" />
              Color Palettes
            </h4>
            <div className="grid gap-4">
              {designSuggestions.colorPalettes?.map((palette: any, index: number) => (
                <div key={index} className="border border-slate-600 rounded-lg p-4 hover:border-purple-400 transition-colors bg-slate-700/20">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h5 className="font-medium text-white">{palette.name}</h5>
                      <p className="text-sm text-gray-400">{palette.description}</p>
                      <span className="inline-block bg-purple-500/20 text-purple-300 px-2 py-1 text-xs rounded mt-1">
                        {palette.mood}
                      </span>
                    </div>
                    <button
                      onClick={() => selectPalette(palette)}
                      className="px-3 py-1 bg-purple-600 text-white text-sm rounded hover:bg-purple-700 transition-colors"
                    >
                      Select
                    </button>
                  </div>
                  <div className="flex space-x-2">
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-lg border border-slate-500 shadow-sm mb-1"
                        style={{ backgroundColor: palette.primary }}
                      />
                      <span className="text-xs text-gray-400">Primary</span>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-lg border border-slate-500 shadow-sm mb-1"
                        style={{ backgroundColor: palette.secondary }}
                      />
                      <span className="text-xs text-gray-400">Secondary</span>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-lg border border-slate-500 shadow-sm mb-1"
                        style={{ backgroundColor: palette.accent }}
                      />
                      <span className="text-xs text-gray-400">Accent</span>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-lg border border-slate-500 shadow-sm mb-1"
                        style={{ backgroundColor: palette.background }}
                      />
                      <span className="text-xs text-gray-400">Background</span>
                    </div>
                    <div className="text-center">
                      <div 
                        className="w-12 h-12 rounded-lg border border-slate-500 shadow-sm mb-1"
                        style={{ backgroundColor: palette.text }}
                      />
                      <span className="text-xs text-gray-400">Text</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Design Styles */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4 flex items-center">
              <Eye className="h-5 w-5 text-blue-400 mr-2" />
              Design Styles
            </h4>
            <div className="grid gap-4">
              {designSuggestions.designStyles?.map((style: any, index: number) => (
                <div key={index} className="border border-slate-600 rounded-lg p-4 hover:border-blue-400 transition-colors bg-slate-700/20">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <h5 className="font-medium text-white">{style.name}</h5>
                      <p className="text-sm text-gray-400 mb-2">{style.description}</p>
                      <div className="flex flex-wrap gap-2 mb-2">
                        {style.characteristics?.map((char: string, i: number) => (
                          <span key={i} className="bg-slate-600/50 text-gray-300 px-2 py-1 text-xs rounded">
                            {char}
                          </span>
                        ))}
                      </div>
                      <p className="text-sm text-blue-300">
                        <strong>Best for:</strong> {style.suitableFor}
                      </p>
                    </div>
                    <button
                      onClick={() => selectDesignStyle(style)}
                      className="ml-3 px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                    >
                      Select
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Inspiration Sources */}
          <div>
            <h4 className="text-lg font-medium text-white mb-4">Design Inspiration</h4>
            <div className="grid gap-4">
              {designSuggestions.inspirationSources?.map((source: any, index: number) => (
                <div key={index} className="border border-slate-600 rounded-lg p-4 bg-slate-700/20">
                  <h5 className="font-medium text-white mb-2">{source.name}</h5>
                  <p className="text-sm text-gray-400 mb-2">{source.reason}</p>
                  <div className="flex flex-wrap gap-2">
                    {source.elements?.map((element: string, i: number) => (
                      <span key={i} className="bg-green-500/20 text-green-300 px-2 py-1 text-xs rounded">
                        {element}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UIDesignSection;