import React, { useState, useEffect } from 'react';
import { useGemini } from '../../hooks/useGemini';
import { GitBranch, RefreshCw, Sparkles, Download, FileText, Copy, CheckCircle, MessageCircle, Send, Wand2, Eye, Code, Zap } from 'lucide-react';

interface UIFlowSectionProps {
  projectData: any;
  onUpdate: (updates: any) => void;
  apiKey: string;
}

const UIFlowSection: React.FC<UIFlowSectionProps> = ({ 
  projectData, 
  onUpdate, 
  apiKey 
}) => {
  const { generateStructuredContent, generateContent, isLoading } = useGemini();
  const [mermaidCode, setMermaidCode] = useState('');
  const [chatMessages, setChatMessages] = useState<{role: string, content: string}[]>([]);
  const [chatInput, setChatInput] = useState('');
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  const [activeView, setActiveView] = useState<'diagram' | 'code'>('diagram');

  // Initialize chat with welcome message
  useEffect(() => {
    if (chatMessages.length === 0) {
      setChatMessages([{
        role: 'assistant',
        content: `🎨 **Welcome to the UI Flow Designer!**

I'll help you create and refine the user flow for your **${projectData.projectType}**.

**Your Project Context:**
• **Platform:** ${projectData.platform}
• **Features:** ${projectData.decidedFeatures?.map((f: any) => f.name).join(', ') || 'Basic functionality'}
• **Experience Level:** ${projectData.experience}

**I can help you:**
🔄 Generate complete user flows in Mermaid format
✏️ Modify existing flows
🎯 Add specific screens or actions
🔀 Adjust flow logic and connections
📱 Optimize for ${projectData.platform} platform
🎨 Improve user experience

**Example requests:**
• "Create a user flow for user registration and login"
• "Add a forgot password flow"
• "Show me the checkout process"
• "Make the onboarding flow simpler"
• "Add error handling screens"

**What kind of user flow would you like to create or modify?**`
      }]);
    }
  }, [projectData]);

  // Auto-send markdown to builder tools when mermaid code changes
  useEffect(() => {
    if (mermaidCode) {
      const markdownFlow = generateMarkdownFromMermaid();
      onUpdate({ 
        uiFlowMarkdown: markdownFlow,
        mermaidFlow: mermaidCode,
        uiFlow: [], // Clear old flow format
        builderTools: {
          ...projectData.builderTools,
          uiFlowReady: true,
          lastUpdated: new Date().toISOString()
        }
      });
    }
  }, [mermaidCode]);

  const generateInitialFlow = async () => {
    if (!apiKey) return;

    const features = projectData.decidedFeatures?.map((f: any) => f.name).join(', ') || 'Basic functionality';
    
    const prompt = `
      Create a comprehensive user flow diagram in Mermaid format for this project:
      
      **Project Details:**
      - Type: ${projectData.projectType}
      - Platform: ${projectData.platform}
      - Features: ${features}
      - Target Audience: ${projectData.targetAudience}
      - Experience Level: ${projectData.experience}
      
      Generate a Mermaid flowchart that shows the complete user journey. Include:
      - Entry points (landing, login, signup)
      - Main user flows for key features
      - Decision points and error handling
      - Success and failure paths
      - Exit points
      
      Use this format:
      \`\`\`mermaid
      flowchart TD
          A[Landing Page] --> B{User Logged In?}
          B -->|Yes| C[Dashboard]
          B -->|No| D[Login Screen]
          D --> E[Authentication]
          E -->|Success| C
          E -->|Failed| F[Error Message]
          F --> D
          C --> G[Main Features]
          G --> H[Feature 1]
          G --> I[Feature 2]
      \`\`\`
      
      Make it comprehensive with 15-25 nodes covering the entire user experience.
      Use descriptive node names and clear decision points.
      Include error states and alternative paths.
      
      Return only the mermaid code block, nothing else.
    `;

    try {
      const result = await generateContent(prompt, apiKey);
      if (result) {
        // Extract mermaid code from the response
        const mermaidMatch = result.match(/```mermaid\n([\s\S]*?)\n```/);
        if (mermaidMatch) {
          setMermaidCode(mermaidMatch[1]);
        } else {
          // If no code block, assume the entire response is mermaid code
          setMermaidCode(result.trim());
        }
      }
    } catch (error) {
      console.error('Error generating flow:', error);
    }
  };

  const sendChatMessage = async () => {
    if (!chatInput.trim() || !apiKey) return;

    const userMessage = { role: 'user', content: chatInput };
    const updatedMessages = [...chatMessages, userMessage];
    setChatMessages(updatedMessages);
    setChatInput('');
    setIsChatLoading(true);

    const conversationHistory = updatedMessages.slice(-6).map(msg => `${msg.role}: ${msg.content}`).join('\n');
    
    const prompt = `
      You are a UX/UI flow expert helping design user flows for a ${projectData.projectType}.
      
      **Project Context:**
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Features: ${projectData.decidedFeatures?.map((f: any) => f.name).join(', ') || 'Basic functionality'}
      - Target Audience: ${projectData.targetAudience}
      - Experience Level: ${projectData.experience}
      
      **Current Mermaid Flow:**
      ${mermaidCode ? `\`\`\`mermaid\n${mermaidCode}\n\`\`\`` : 'No flow created yet'}
      
      **Recent Conversation:**
      ${conversationHistory}
      
      **User Request:** ${chatInput}
      
      If the user wants to modify the flow, generate an updated Mermaid flowchart.
      If they're asking questions, provide helpful UX advice.
      
      For flow modifications, respond with:
      1. A brief explanation of the changes
      2. The updated Mermaid code in a code block
      
      For questions, provide detailed UX guidance considering their ${projectData.experience} experience level.
      
      Use Mermaid flowchart TD format with descriptive node names and clear connections.
      Include decision points with {Question?} format and use -->|Label| for conditional flows.
    `;

    try {
      const result = await generateContent(prompt, apiKey);
      if (result) {
        setChatMessages([...updatedMessages, { 
          role: 'assistant', 
          content: result
        }]);

        // Check if the response contains updated mermaid code
        const mermaidMatch = result.match(/```mermaid\n([\s\S]*?)\n```/);
        if (mermaidMatch) {
          setMermaidCode(mermaidMatch[1]);
        }
      }
    } catch (error) {
      console.error('Chat error:', error);
      setChatMessages([...updatedMessages, { 
        role: 'assistant', 
        content: 'Sorry, I encountered an error. Please try again or try rephrasing your request.'
      }]);
    } finally {
      setIsChatLoading(false);
    }
  };

  const generateMarkdownFromMermaid = () => {
    if (!mermaidCode) return '';

    let markdown = `# User Flow: ${projectData.name || projectData.projectType}\n\n`;
    markdown += `## Overview\n`;
    markdown += `This user flow outlines the complete user journey through the ${projectData.projectType}.\n\n`;
    
    markdown += `## Mermaid Diagram\n`;
    markdown += `\`\`\`mermaid\n${mermaidCode}\n\`\`\`\n\n`;
    
    // Parse mermaid code to extract information
    const lines = mermaidCode.split('\n').filter(line => line.trim());
    const nodes = new Set<string>();
    const connections: string[] = [];
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed.includes('-->')) {
        connections.push(trimmed);
        // Extract node names
        const parts = trimmed.split('-->');
        parts.forEach(part => {
          const nodeMatch = part.match(/([A-Z]+)\[([^\]]+)\]|([A-Z]+)\{([^}]+)\}/);
          if (nodeMatch) {
            const nodeName = nodeMatch[2] || nodeMatch[4];
            if (nodeName) nodes.add(nodeName);
          }
        });
      }
    });

    if (nodes.size > 0) {
      markdown += `## Flow Components\n`;
      markdown += `**Total Screens/Actions:** ${nodes.size}\n`;
      markdown += `**Connections:** ${connections.length}\n\n`;
      
      markdown += `### Key Screens and Actions\n`;
      Array.from(nodes).forEach((node, index) => {
        markdown += `${index + 1}. ${node}\n`;
      });
      markdown += '\n';
    }

    markdown += `## Implementation Notes\n`;
    markdown += `- **Platform:** ${projectData.platform}\n`;
    markdown += `- **Target Audience:** ${projectData.targetAudience}\n`;
    markdown += `- **Key Features:** ${projectData.decidedFeatures?.map((f: any) => f.name).join(', ') || 'Basic functionality'}\n`;
    if (projectData.techStack) {
      markdown += `- **Tech Stack:** ${projectData.techStack.frontend}, ${projectData.techStack.backend}\n`;
    }
    markdown += `\n`;

    markdown += `## Development Recommendations\n`;
    markdown += `1. Start with the core user flow (main path)\n`;
    markdown += `2. Implement error handling and edge cases\n`;
    markdown += `3. Add loading states and transitions\n`;
    markdown += `4. Test user flow with real users\n`;
    markdown += `5. Optimize based on user feedback\n\n`;

    markdown += `## Mermaid Integration\n`;
    markdown += `This flow can be visualized using Mermaid in documentation, GitHub, or development tools.\n`;
    markdown += `Copy the mermaid code block above to use in your project documentation.\n`;

    return markdown;
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const downloadMarkdown = () => {
    const markdown = generateMarkdownFromMermaid();
    const blob = new Blob([markdown], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${projectData.name || 'project'}-user-flow.md`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">UI Flow Designer</h3>
        <button
          onClick={generateInitialFlow}
          disabled={isLoading || !apiKey}
          className="flex items-center px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-200 disabled:opacity-50"
        >
          {isLoading ? (
            <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Sparkles className="h-4 w-4 mr-2" />
          )}
          Generate Flow
        </button>
      </div>

      {!apiKey && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-amber-200 text-sm">
            Please add your Gemini API key to generate AI-powered user flows.
          </p>
        </div>
      )}

      {/* Main Content - Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column - Mermaid Diagram */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-lg font-medium text-white">Mermaid Flow Diagram</h4>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setActiveView('diagram')}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${
                  activeView === 'diagram' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </button>
              <button
                onClick={() => setActiveView('code')}
                className={`flex items-center px-3 py-2 rounded-lg transition-colors text-sm ${
                  activeView === 'code' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-slate-700 text-gray-300 hover:bg-slate-600'
                }`}
              >
                <Code className="h-4 w-4 mr-2" />
                Code
              </button>
            </div>
          </div>

          <div className="bg-slate-700/30 rounded-xl border border-slate-600 p-6 h-96 overflow-auto">
            {mermaidCode ? (
              activeView === 'diagram' ? (
                <div className="h-full flex items-center justify-center">
                  <div className="text-center max-w-full">
                    <div className="bg-white rounded-lg p-6 mb-4 max-w-full overflow-auto">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                        {mermaidCode}
                      </pre>
                    </div>
                    <p className="text-gray-400 text-sm">
                      Copy the Mermaid code and paste it into any Mermaid-compatible viewer to see the visual diagram.
                    </p>
                    <div className="mt-4 flex justify-center space-x-4">
                      <a
                        href={`https://mermaid.live/edit#pako:${btoa(mermaidCode)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                      >
                        View in Mermaid Live
                      </a>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="h-full">
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-300">Mermaid Code:</span>
                    <button
                      onClick={() => copyToClipboard(mermaidCode)}
                      className="flex items-center px-3 py-1 bg-slate-600 hover:bg-slate-500 rounded transition-colors text-sm text-gray-300"
                    >
                      {copiedMarkdown ? (
                        <CheckCircle className="h-4 w-4 mr-2 text-green-400" />
                      ) : (
                        <Copy className="h-4 w-4 mr-2" />
                      )}
                      {copiedMarkdown ? 'Copied!' : 'Copy'}
                    </button>
                  </div>
                  <div className="bg-slate-800/50 rounded-lg p-4 h-80 overflow-auto">
                    <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
                      {mermaidCode}
                    </pre>
                  </div>
                </div>
              )
            ) : (
              <div className="h-full flex items-center justify-center text-center">
                <div>
                  <GitBranch className="h-16 w-16 text-gray-500 mx-auto mb-4" />
                  <h4 className="text-xl font-medium text-white mb-2">No Flow Created Yet</h4>
                  <p className="text-gray-400 mb-4">Generate a flow with AI or chat with the assistant to create one</p>
                </div>
              </div>
            )}
          </div>

          {/* Export Options */}
          {mermaidCode && (
            <div className="flex items-center justify-between bg-slate-700/20 rounded-lg p-4">
              <div className="flex items-center">
                <Zap className="h-5 w-5 text-green-400 mr-2" />
                <span className="text-sm text-green-300 font-medium">Flow ready for Builder Tools!</span>
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => copyToClipboard(generateMarkdownFromMermaid())}
                  className="flex items-center px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                >
                  {copiedMarkdown ? (
                    <CheckCircle className="h-4 w-4 mr-2" />
                  ) : (
                    <Copy className="h-4 w-4 mr-2" />
                  )}
                  {copiedMarkdown ? 'Copied!' : 'Copy Markdown'}
                </button>
                <button
                  onClick={downloadMarkdown}
                  className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                >
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - AI Chat */}
        <div className="space-y-4">
          <h4 className="text-lg font-medium text-white flex items-center">
            <MessageCircle className="h-5 w-5 text-blue-400 mr-2" />
            Flow Design Assistant
          </h4>

          {/* Chat Messages */}
          <div className="bg-slate-700/30 rounded-xl border border-slate-600 p-4 h-80 overflow-y-auto">
            <div className="space-y-4">
              {chatMessages.map((message, index) => (
                <div
                  key={index}
                  className={`p-4 rounded-lg ${
                    message.role === 'user'
                      ? 'bg-blue-500/20 text-blue-100 ml-8'
                      : 'bg-slate-600/50 text-gray-200 mr-8'
                  }`}
                >
                  <div className="text-sm whitespace-pre-wrap">{message.content}</div>
                </div>
              ))}
              {isChatLoading && (
                <div className="bg-slate-600/50 text-gray-200 mr-8 p-4 rounded-lg">
                  <div className="flex items-center">
                    <RefreshCw className="h-4 w-4 animate-spin mr-2" />
                    <span className="text-sm">Designing your flow...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Chat Input */}
          <div className="space-y-3">
            <div className="flex space-x-2">
              <input
                type="text"
                value={chatInput}
                onChange={(e) => setChatInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && sendChatMessage()}
                placeholder="Describe the flow you want to create or modify..."
                className="flex-1 px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400"
                disabled={!apiKey || isChatLoading}
              />
              <button
                onClick={sendChatMessage}
                disabled={!chatInput.trim() || isChatLoading || !apiKey}
                className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center"
              >
                {isChatLoading ? (
                  <RefreshCw className="h-4 w-4 animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2">
              {[
                "Create a login flow",
                "Add user registration",
                "Design checkout process",
                "Add error handling",
                "Create onboarding flow"
              ].map((suggestion, index) => (
                <button
                  key={index}
                  onClick={() => setChatInput(suggestion)}
                  className="px-3 py-1 bg-slate-600/50 hover:bg-slate-600 rounded-full text-xs text-gray-300 hover:text-white transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>

            <div className="text-xs text-gray-400">
              💡 Try: "Create a user flow for {projectData.projectType}" or "Add a forgot password flow" or "Make the navigation simpler"
            </div>
          </div>
        </div>
      </div>

      {/* Auto-Integration Notice */}
      {mermaidCode && (
        <div className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-6">
          <div className="flex items-start space-x-3">
            <Zap className="h-6 w-6 text-blue-400 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-blue-300 mb-2">Auto-Integrated with Builder Tools</h4>
              <p className="text-blue-200 text-sm mb-3">
                Your Mermaid flow has been automatically converted to structured markdown and sent to the Builder Tools section. 
                This will help generate better prompts for your development tools.
              </p>
              <div className="flex items-center space-x-4 text-sm">
                <span className="text-blue-300">✓ Mermaid diagram generated</span>
                <span className="text-blue-300">✓ Markdown documentation created</span>
                <span className="text-blue-300">✓ Builder tools updated</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UIFlowSection;