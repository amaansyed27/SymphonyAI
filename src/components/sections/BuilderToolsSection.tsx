import React, { useState, useEffect } from 'react';
import { useGemini } from '../../hooks/useGemini';
import { Code, Smartphone, Monitor, Cog, RefreshCw, Sparkles, ExternalLink, MessageCircle, Send, Star, DollarSign, Clock, Search, Wand2, Copy, CheckCircle, Zap } from 'lucide-react';

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
  const { generateContent, generateStructuredContent, isLoading } = useGemini();
  const [activeTab, setActiveTab] = useState<'tools' | 'chat' | 'prompts'>('tools');
  const [selectedTool, setSelectedTool] = useState<any>(null);
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [toolsWithInfo, setToolsWithInfo] = useState<any[]>([]);
  const [generatedPrompts, setGeneratedPrompts] = useState<any[]>([]);
  const [isGeneratingPrompts, setIsGeneratingPrompts] = useState(false);
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  // Predefined tools based on platform
  const platformTools = {
    web: [
      { name: 'Bolt.new', category: 'AI-Powered', url: 'https://bolt.new', supportsPrompts: true },
      { name: 'v0 by Vercel', category: 'AI-Powered', url: 'https://v0.dev', supportsPrompts: false },
      { name: 'Lovable.dev', category: 'AI-Powered', url: 'https://lovable.dev', supportsPrompts: false },
      { name: 'VS Code with Copilot', category: 'IDE', url: 'https://code.visualstudio.com', supportsPrompts: false },
      { name: 'Claude Code', category: 'AI Assistant', url: 'https://claude.ai', supportsPrompts: false },
      { name: 'Gemini AI Studio', category: 'AI Assistant', url: 'https://aistudio.google.com', supportsPrompts: false }
    ],
    mobile: [
      { name: 'Android Studio with Gemini API', category: 'IDE', url: 'https://developer.android.com/studio', supportsPrompts: false },
      { name: 'Firebase Studio API', category: 'Backend Service', url: 'https://firebase.google.com', supportsPrompts: false },
      { name: 'Flutter Flow', category: 'No-Code', url: 'https://flutterflow.io', supportsPrompts: false },
      { name: 'Xcode with AI', category: 'IDE', url: 'https://developer.apple.com/xcode', supportsPrompts: false }
    ],
    desktop: [
      { name: 'Bolt.new', category: 'AI-Powered', url: 'https://bolt.new', supportsPrompts: true },
      { name: 'v0 by Vercel', category: 'AI-Powered', url: 'https://v0.dev', supportsPrompts: false },
      { name: 'Lovable.dev', category: 'AI-Powered', url: 'https://lovable.dev', supportsPrompts: false },
      { name: 'VS Code with Copilot', category: 'IDE', url: 'https://code.visualstudio.com', supportsPrompts: false },
      { name: 'Flutter Flow', category: 'No-Code', url: 'https://flutterflow.io', supportsPrompts: false },
      { name: 'Claude Code', category: 'AI Assistant', url: 'https://claude.ai', supportsPrompts: false }
    ],
    proprietary: [
      { name: 'VS Code with Copilot', category: 'IDE', url: 'https://code.visualstudio.com', supportsPrompts: false },
      { name: 'Jupyter Notebook', category: 'Data Science', url: 'https://jupyter.org', supportsPrompts: false },
      { name: 'TensorFlow', category: 'ML Framework', url: 'https://tensorflow.org', supportsPrompts: false },
      { name: 'Custom Development Environment', category: 'Custom', url: '#', supportsPrompts: false }
    ]
  };

  const currentTools = platformTools[projectData.platform as keyof typeof platformTools] || platformTools.web;

  // Enhance tools with AI information when component loads
  useEffect(() => {
    if (apiKey && currentTools.length > 0) {
      enhanceToolsWithAI();
    }
  }, [projectData.platform, apiKey]);

  const enhanceToolsWithAI = async () => {
    if (!apiKey) return;

    const toolNames = currentTools.map(tool => tool.name).join(', ');
    
    const prompt = `
      Search for current information about these development tools: ${toolNames}
      
      For each tool, find:
      - Current pricing (free/paid tiers)
      - Key features and capabilities
      - User ratings and reviews
      - Best use cases
      - Learning difficulty
      - Setup time
      
      Project context: ${projectData.projectType} for ${projectData.platform} platform
      Budget: ${projectData.budget} (low: $0-$500/month, medium: $500-$2000/month, high: $2000+/month)
      Experience: ${projectData.experience}
      
      Return information for each tool in a structured way, focusing on how well each fits this specific project.
    `;

    try {
      const result = await generateContent(prompt, apiKey, true); // Enable grounding
      
      // Parse the AI response and enhance our tools
      const enhancedTools = currentTools.map(tool => ({
        ...tool,
        aiInfo: result, // Store AI info for display
        enhanced: true
      }));
      
      setToolsWithInfo(enhancedTools);
    } catch (error) {
      console.error('Error enhancing tools:', error);
      setToolsWithInfo(currentTools);
    }
  };

  const selectTool = (tool: any) => {
    setSelectedTool(tool);
    setActiveTab('chat');
    setChatMessages([{
      role: 'assistant',
      content: `Great choice! I'll help you set up **${tool.name}** for your ${projectData.projectType}.

**Tool Overview:**
- **Category:** ${tool.category}
- **Platform:** ${projectData.platform}
- **Your Experience:** ${projectData.experience}

I can help you with:
• 🚀 Step-by-step setup instructions
• ⚙️ Configuration for your specific project
• 💡 Best practices and tips
• 🔗 Integration with other tools
• 🛠️ Troubleshooting common issues
• 💰 Pricing and plan recommendations

What would you like to start with? Just ask me anything about ${tool.name}!`
    }]);
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !selectedTool || !apiKey) return;

    const userMessage = { role: 'user', content: chatInput };
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsChatLoading(true);

    const conversationHistory = updatedMessages.slice(-6).map(msg => `${msg.role}: ${msg.content}`).join('\n');
    
    const prompt = `
      You are an expert developer assistant helping set up ${selectedTool.name} for a ${projectData.projectType} project.
      
      Project Context:
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Experience Level: ${projectData.experience}
      - Budget: ${projectData.budget}
      - Selected Features: ${projectData.decidedFeatures?.map((f: any) => f.name).join(', ') || 'None selected'}
      - Tech Stack: ${projectData.techStack ? `${projectData.techStack.frontend}, ${projectData.techStack.backend}` : 'Not selected'}
      
      Tool: ${selectedTool.name} (${selectedTool.category})
      
      Recent Conversation:
      ${conversationHistory}
      
      User Question: ${chatInput}
      
      Search for the latest information about ${selectedTool.name} and provide helpful, specific guidance.
      Include:
      - Current setup instructions and documentation
      - Best practices for ${projectData.projectType} projects
      - Integration tips for ${projectData.platform} platform
      - Pricing information if relevant
      - Recent updates or changes
      
      Format your response clearly with step-by-step instructions when appropriate.
      Consider the user's ${projectData.experience} experience level.
      Be practical and actionable.
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
        content: 'Sorry, I encountered an error. Please try again or try rephrasing your question.'
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const generatePrompts = async () => {
    if (!selectedTool || !apiKey) return;

    setIsGeneratingPrompts(true);
    
    const features = projectData.decidedFeatures?.map((f: any) => f.name).join(', ') || 'Basic functionality';
    
    const prompt = `
      Generate 3-5 detailed prompts for ${selectedTool.name} to build this project:
      
      Project Details:
      - Type: ${projectData.projectType}
      - Platform: ${projectData.platform}
      - Features: ${features}
      - Tech Stack: ${projectData.techStack ? `${projectData.techStack.frontend}, ${projectData.techStack.backend}` : 'To be determined'}
      - Experience Level: ${projectData.experience}
      - Budget: ${projectData.budget}
      
      Generate prompts in JSON format:
      {
        "prompts": [
          {
            "title": "Prompt title",
            "description": "What this prompt accomplishes",
            "prompt": "The actual prompt text to use",
            "order": 1,
            "estimatedTime": "Time estimate"
          }
        ]
      }
      
      Make prompts specific to ${selectedTool.name} and break down the project into manageable chunks.
      Include specific technical requirements, UI/UX guidance, and implementation details.
      Each prompt should be comprehensive enough to generate substantial progress.
      
      For Bolt.new prompts, make them detailed and specific about:
      - Exact technologies to use
      - Specific features to implement
      - UI/UX requirements
      - File structure and organization
      - Styling and design requirements
    `;

    try {
      const result = await generateStructuredContent(prompt, apiKey, true);
      if (result && result.prompts) {
        setGeneratedPrompts(result.prompts);
      }
    } catch (error) {
      console.error('Error generating prompts:', error);
    } finally {
      setIsGeneratingPrompts(false);
    }
  };

  const copyToClipboard = (text: string, promptId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedPrompt(promptId);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const sendToBolt = (prompt: string) => {
    const encodedPrompt = encodeURIComponent(prompt);
    const boltUrl = `https://bolt.new/?prompt=${encodedPrompt}`;
    window.open(boltUrl, '_blank');
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'AI-Powered': return <Sparkles className="h-5 w-5 text-purple-400" />;
      case 'IDE': return <Code className="h-5 w-5 text-blue-400" />;
      case 'No-Code': return <Cog className="h-5 w-5 text-green-400" />;
      case 'Backend Service': return <Monitor className="h-5 w-5 text-orange-400" />;
      case 'AI Assistant': return <Sparkles className="h-5 w-5 text-pink-400" />;
      case 'Data Science': return <Star className="h-5 w-5 text-yellow-400" />;
      case 'ML Framework': return <Star className="h-5 w-5 text-red-400" />;
      default: return <Code className="h-5 w-5 text-gray-400" />;
    }
  };

  const getPlatformIcon = () => {
    switch (projectData.platform) {
      case 'web': return <Monitor className="h-5 w-5 text-blue-400" />;
      case 'mobile': return <Smartphone className="h-5 w-5 text-green-400" />;
      case 'desktop': return <Monitor className="h-5 w-5 text-purple-400" />;
      case 'proprietary': return <Cog className="h-5 w-5 text-orange-400" />;
      default: return <Code className="h-5 w-5 text-gray-400" />;
    }
  };

  const displayTools = toolsWithInfo.length > 0 ? toolsWithInfo : currentTools;

  const tabs = [
    { id: 'tools', label: 'Tools', icon: Code },
    { id: 'chat', label: 'Tool Assist Chat', icon: MessageCircle },
    { id: 'prompts', label: 'Prompt Creation', icon: Wand2 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Development Tools for {projectData.platform}</h3>
        {activeTab === 'tools' && (
          <button
            onClick={enhanceToolsWithAI}
            disabled={isLoading || !apiKey}
            className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
          >
            {isLoading ? (
              <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Search className="h-4 w-4 mr-2" />
            )}
            Get Latest Info
          </button>
        )}
      </div>

      {!apiKey && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-amber-200 text-sm">
            Please add your Gemini API key to get real-time tool information and setup assistance with Google Search grounding.
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
        {/* Tools Tab */}
        {activeTab === 'tools' && (
          <div className="space-y-6">
            {/* Platform Info */}
            <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
              <h4 className="text-lg font-semibold text-white mb-4 flex items-center">
                {getPlatformIcon()}
                <span className="ml-2">Recommended Tools for {projectData.platform} Development</span>
              </h4>
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="bg-slate-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <Monitor className="h-4 w-4 text-blue-400 mr-2" />
                    <span className="font-medium text-gray-300">Platform</span>
                  </div>
                  <p className="text-white capitalize">{projectData.platform}</p>
                </div>
                <div className="bg-slate-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <DollarSign className="h-4 w-4 text-green-400 mr-2" />
                    <span className="font-medium text-gray-300">Budget</span>
                  </div>
                  <p className="text-white capitalize">{projectData.budget}</p>
                </div>
                <div className="bg-slate-600/30 rounded-lg p-3">
                  <div className="flex items-center mb-2">
                    <Clock className="h-4 w-4 text-orange-400 mr-2" />
                    <span className="font-medium text-gray-300">Experience</span>
                  </div>
                  <p className="text-white capitalize">{projectData.experience}</p>
                </div>
              </div>
            </div>

            {/* Tools List */}
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-white">Available Tools</h4>
              <div className="grid gap-4">
                {displayTools.map((tool, index) => (
                  <div key={index} className="border border-slate-600 rounded-xl p-6 hover:border-blue-400 transition-colors bg-slate-700/20">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-3">
                          {getCategoryIcon(tool.category)}
                          <h5 className="text-xl font-semibold text-white">{tool.name}</h5>
                          <span className="bg-slate-600/50 text-gray-300 px-3 py-1 text-sm rounded-full">
                            {tool.category}
                          </span>
                          {tool.supportsPrompts && (
                            <span className="bg-purple-500/20 text-purple-300 px-2 py-1 text-xs rounded-full">
                              Prompt Ready
                            </span>
                          )}
                        </div>
                        
                        <div className="space-y-2 mb-4">
                          <p className="text-gray-300">
                            {tool.category === 'AI-Powered' && 'AI-powered development platform for rapid prototyping and deployment'}
                            {tool.category === 'IDE' && 'Integrated development environment with advanced coding features'}
                            {tool.category === 'No-Code' && 'Visual development platform requiring minimal coding'}
                            {tool.category === 'Backend Service' && 'Cloud-based backend services and APIs'}
                            {tool.category === 'AI Assistant' && 'AI-powered coding assistant and helper'}
                            {tool.category === 'Data Science' && 'Interactive computing environment for data science'}
                            {tool.category === 'ML Framework' && 'Machine learning and AI development framework'}
                            {tool.category === 'Custom' && 'Tailored development environment for specific needs'}
                          </p>
                          
                          <div className="flex items-center space-x-4 text-sm">
                            <span className="text-blue-300">
                              <strong>Best for:</strong> {projectData.experience} developers
                            </span>
                            <span className="text-green-300">
                              <strong>Platform:</strong> {projectData.platform}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex space-x-2 ml-4">
                        {tool.url && tool.url !== '#' && (
                          <a
                            href={tool.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-2 text-gray-400 hover:text-blue-400 transition-colors"
                            title="Visit official website"
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

                    {/* Tool Features */}
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <h6 className="font-medium text-green-400 mb-2">Key Features</h6>
                        <ul className="space-y-1 text-sm text-gray-300">
                          {tool.category === 'AI-Powered' && (
                            <>
                              <li>• AI-assisted code generation</li>
                              <li>• Rapid prototyping</li>
                              <li>• Instant deployment</li>
                            </>
                          )}
                          {tool.category === 'IDE' && (
                            <>
                              <li>• Advanced code editing</li>
                              <li>• Debugging tools</li>
                              <li>• Extension ecosystem</li>
                            </>
                          )}
                          {tool.category === 'No-Code' && (
                            <>
                              <li>• Visual interface builder</li>
                              <li>• Drag-and-drop design</li>
                              <li>• Pre-built components</li>
                            </>
                          )}
                          {(tool.category === 'Backend Service' || tool.category === 'AI Assistant' || tool.category === 'Data Science' || tool.category === 'ML Framework') && (
                            <>
                              <li>• Cloud-based services</li>
                              <li>• Scalable infrastructure</li>
                              <li>• API integration</li>
                            </>
                          )}
                        </ul>
                      </div>
                      <div>
                        <h6 className="font-medium text-blue-400 mb-2">Perfect For</h6>
                        <ul className="space-y-1 text-sm text-gray-300">
                          <li>• {projectData.projectType}</li>
                          <li>• {projectData.experience} developers</li>
                          <li>• {projectData.budget} budget projects</li>
                        </ul>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Chat Tab */}
        {activeTab === 'chat' && (
          <div className="space-y-6">
            {selectedTool ? (
              <>
                <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                    {getCategoryIcon(selectedTool.category)}
                    <span className="ml-2">Setup Assistant for {selectedTool.name}</span>
                    <span className="ml-2 text-sm text-gray-400">• Powered by Google Search</span>
                  </h4>
                  <p className="text-gray-400">Get real-time help setting up {selectedTool.name} for your {projectData.projectType}</p>
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
                          <span className="text-sm">Searching for the latest information about {selectedTool.name}...</span>
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

                <div className="text-xs text-gray-400">
                  💡 Try asking: "How do I set up {selectedTool?.name} for my {projectData.projectType}?" or "What's the pricing for {selectedTool?.name}?" or "Show me step-by-step setup instructions"
                </div>
              </>
            ) : (
              <div className="text-center py-12">
                <MessageCircle className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-white mb-2">No Tool Selected</h4>
                <p className="text-gray-400 mb-4">Select a tool from the Tools tab to start getting personalized setup assistance.</p>
                <button
                  onClick={() => setActiveTab('tools')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Tools
                </button>
              </div>
            )}
          </div>
        )}

        {/* Prompts Tab */}
        {activeTab === 'prompts' && (
          <div className="space-y-6">
            {selectedTool ? (
              <>
                <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-lg font-semibold text-white mb-2 flex items-center">
                        <Wand2 className="h-5 w-5 text-purple-400 mr-2" />
                        Custom Prompts for {selectedTool.name}
                      </h4>
                      <p className="text-gray-400">AI-generated prompts tailored for your {projectData.projectType}</p>
                    </div>
                    <button
                      onClick={generatePrompts}
                      disabled={isGeneratingPrompts || !apiKey}
                      className="flex items-center px-4 py-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all duration-200 disabled:opacity-50"
                    >
                      {isGeneratingPrompts ? (
                        <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                      ) : (
                        <Sparkles className="h-4 w-4 mr-2" />
                      )}
                      Generate Prompts
                    </button>
                  </div>
                </div>

                {generatedPrompts.length > 0 ? (
                  <div className="space-y-4">
                    {generatedPrompts.map((prompt, index) => (
                      <div key={index} className="bg-slate-700/20 border border-slate-600 rounded-xl p-6">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex-1">
                            <h5 className="text-lg font-semibold text-white mb-2">
                              Step {prompt.order}: {prompt.title}
                            </h5>
                            <p className="text-gray-400 text-sm mb-3">{prompt.description}</p>
                            <div className="flex items-center space-x-4 text-sm">
                              <span className="text-blue-300">
                                <Clock className="h-4 w-4 inline mr-1" />
                                {prompt.estimatedTime}
                              </span>
                              <span className="text-green-300">
                                <Star className="h-4 w-4 inline mr-1" />
                                Step {prompt.order} of {generatedPrompts.length}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-800/50 rounded-lg p-4 mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-gray-300">Prompt:</span>
                            <button
                              onClick={() => copyToClipboard(prompt.prompt, `prompt-${index}`)}
                              className="flex items-center px-2 py-1 text-xs bg-slate-600 hover:bg-slate-500 rounded transition-colors text-gray-300"
                            >
                              {copiedPrompt === `prompt-${index}` ? (
                                <CheckCircle className="h-3 w-3 mr-1 text-green-400" />
                              ) : (
                                <Copy className="h-3 w-3 mr-1" />
                              )}
                              {copiedPrompt === `prompt-${index}` ? 'Copied!' : 'Copy'}
                            </button>
                          </div>
                          <div className="text-sm text-gray-300 font-mono whitespace-pre-wrap bg-slate-900/50 rounded p-3 max-h-32 overflow-y-auto">
                            {prompt.prompt}
                          </div>
                        </div>

                        <div className="flex space-x-3">
                          {selectedTool.supportsPrompts && selectedTool.name === 'Bolt.new' && (
                            <button
                              onClick={() => sendToBolt(prompt.prompt)}
                              className="flex items-center px-4 py-2 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-lg hover:from-orange-600 hover:to-red-600 transition-all duration-200"
                            >
                              <Zap className="h-4 w-4 mr-2" />
                              Send to Bolt.new
                            </button>
                          )}
                          <button
                            onClick={() => copyToClipboard(prompt.prompt, `prompt-${index}`)}
                            className="flex items-center px-4 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
                          >
                            {copiedPrompt === `prompt-${index}` ? (
                              <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                            ) : (
                              <Copy className="h-4 w-4 mr-2" />
                            )}
                            {copiedPrompt === `prompt-${index}` ? 'Copied!' : 'Copy Prompt'}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Wand2 className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                    <h4 className="text-lg font-medium text-white mb-2">No Prompts Generated</h4>
                    <p className="text-gray-400 mb-4">Click "Generate Prompts" to create custom prompts for {selectedTool.name}</p>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <Wand2 className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-white mb-2">No Tool Selected</h4>
                <p className="text-gray-400 mb-4">Select a tool from the Tools tab to generate custom prompts.</p>
                <button
                  onClick={() => setActiveTab('tools')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Browse Tools
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default BuilderToolsSection;