import React, { useState, useRef, useCallback, useEffect } from 'react';
import { useGemini } from '../../hooks/useGemini';
import { GitBranch, Plus, Trash2, RefreshCw, Sparkles, Download, FileText, Move, MousePointer, Zap, Copy, CheckCircle } from 'lucide-react';
import { FlowNode } from '../../types';

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
  const { generateStructuredContent, isLoading } = useGemini();
  const [selectedNode, setSelectedNode] = useState<FlowNode | null>(null);
  const [draggedNode, setDraggedNode] = useState<FlowNode | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [canvasSize, setCanvasSize] = useState({ width: 1200, height: 800 });
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });
  const [markdownFlow, setMarkdownFlow] = useState('');
  const [showMarkdown, setShowMarkdown] = useState(false);
  const [copiedMarkdown, setCopiedMarkdown] = useState(false);
  
  const canvasRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<SVGSVGElement>(null);

  const flow = projectData.uiFlow || [];

  // Generate markdown flow whenever flow changes
  useEffect(() => {
    if (flow.length > 0) {
      generateMarkdownFlow();
    }
  }, [flow]);

  const generateFlow = async () => {
    const features = projectData.decidedFeatures?.map((f: any) => f.name).join(', ') || 'Basic functionality';
    
    const prompt = `
      Based on the following project details, generate a comprehensive user flow:
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Features: ${features}
      - Target Audience: ${projectData.targetAudience}
      - Experience Level: ${projectData.experience}

      Generate a logical user flow in JSON format:
      {
        "flow": [
          {
            "id": "unique_id",
            "name": "Screen/Action name",
            "type": "screen|action|decision",
            "description": "Brief description of what happens here",
            "connections": ["id1", "id2"],
            "position": {"x": 100, "y": 100},
            "details": "Additional details about this step"
          }
        ]
      }

      Create 10-15 nodes that represent the complete user journey through the app.
      Include different types:
      - screens: Main app pages/views (Login, Dashboard, Profile, etc.)
      - actions: User interactions (Submit Form, Upload File, etc.)
      - decisions: Choice points (Authentication Check, Payment Method, etc.)
      
      Position them in a logical flow from left to right, with proper spacing.
      Make sure the flow covers the entire user experience from entry to completion.
      Include error states and alternative paths where relevant.
    `;

    const result = await generateStructuredContent(prompt, apiKey);
    if (result && result.flow) {
      // Ensure proper spacing and positioning
      const enhancedFlow = result.flow.map((node: any, index: number) => ({
        ...node,
        position: {
          x: (index % 4) * 250 + 150,
          y: Math.floor(index / 4) * 150 + 100
        }
      }));
      onUpdate({ uiFlow: enhancedFlow });
    }
  };

  const generateMarkdownFlow = () => {
    if (flow.length === 0) return;

    let markdown = `# User Flow: ${projectData.name || projectData.projectType}\n\n`;
    markdown += `## Overview\n`;
    markdown += `This user flow outlines the complete user journey through the ${projectData.projectType}.\n\n`;
    
    // Group nodes by type
    const screens = flow.filter((node: FlowNode) => node.type === 'screen');
    const actions = flow.filter((node: FlowNode) => node.type === 'action');
    const decisions = flow.filter((node: FlowNode) => node.type === 'decision');

    if (screens.length > 0) {
      markdown += `## Screens (${screens.length})\n`;
      screens.forEach((node: FlowNode, index: number) => {
        markdown += `### ${index + 1}. ${node.name}\n`;
        if (node.description) {
          markdown += `${node.description}\n`;
        }
        if (node.connections && node.connections.length > 0) {
          const connectedNodes = node.connections
            .map(id => flow.find((n: FlowNode) => n.id === id)?.name)
            .filter(Boolean);
          if (connectedNodes.length > 0) {
            markdown += `**Leads to:** ${connectedNodes.join(', ')}\n`;
          }
        }
        markdown += '\n';
      });
    }

    if (actions.length > 0) {
      markdown += `## User Actions (${actions.length})\n`;
      actions.forEach((node: FlowNode, index: number) => {
        markdown += `### ${index + 1}. ${node.name}\n`;
        if (node.description) {
          markdown += `${node.description}\n`;
        }
        if (node.connections && node.connections.length > 0) {
          const connectedNodes = node.connections
            .map(id => flow.find((n: FlowNode) => n.id === id)?.name)
            .filter(Boolean);
          if (connectedNodes.length > 0) {
            markdown += `**Triggers:** ${connectedNodes.join(', ')}\n`;
          }
        }
        markdown += '\n';
      });
    }

    if (decisions.length > 0) {
      markdown += `## Decision Points (${decisions.length})\n`;
      decisions.forEach((node: FlowNode, index: number) => {
        markdown += `### ${index + 1}. ${node.name}\n`;
        if (node.description) {
          markdown += `${node.description}\n`;
        }
        if (node.connections && node.connections.length > 0) {
          const connectedNodes = node.connections
            .map(id => flow.find((n: FlowNode) => n.id === id)?.name)
            .filter(Boolean);
          if (connectedNodes.length > 0) {
            markdown += `**Possible outcomes:** ${connectedNodes.join(', ')}\n`;
          }
        }
        markdown += '\n';
      });
    }

    // Add flow sequence
    markdown += `## Flow Sequence\n`;
    markdown += `\`\`\`\n`;
    flow.forEach((node: FlowNode, index: number) => {
      const indent = '  '.repeat(Math.floor(index / 3));
      markdown += `${indent}${index + 1}. [${node.type.toUpperCase()}] ${node.name}\n`;
      if (node.connections && node.connections.length > 0) {
        node.connections.forEach(connectionId => {
          const connectedNode = flow.find((n: FlowNode) => n.id === connectionId);
          if (connectedNode) {
            markdown += `${indent}   ↓ ${connectedNode.name}\n`;
          }
        });
      }
    });
    markdown += `\`\`\`\n\n`;

    // Add implementation notes
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
    markdown += `5. Optimize based on user feedback\n`;

    setMarkdownFlow(markdown);
  };

  const addNode = () => {
    const newNode: FlowNode = {
      id: `node-${Date.now()}`,
      name: 'New Node',
      type: 'screen',
      connections: [],
      position: { x: 200 + flow.length * 50, y: 200 + flow.length * 30 },
      description: 'New flow step'
    };

    const currentFlow = projectData.uiFlow || [];
    onUpdate({ uiFlow: [...currentFlow, newNode] });
  };

  const updateNode = (nodeId: string, updates: Partial<FlowNode>) => {
    const currentFlow = projectData.uiFlow || [];
    const updatedFlow = currentFlow.map((node: FlowNode) =>
      node.id === nodeId ? { ...node, ...updates } : node
    );
    onUpdate({ uiFlow: updatedFlow });
  };

  const deleteNode = (nodeId: string) => {
    const currentFlow = projectData.uiFlow || [];
    const updatedFlow = currentFlow
      .filter((node: FlowNode) => node.id !== nodeId)
      .map((node: FlowNode) => ({
        ...node,
        connections: node.connections.filter(id => id !== nodeId)
      }));
    onUpdate({ uiFlow: updatedFlow });
    if (selectedNode?.id === nodeId) {
      setSelectedNode(null);
    }
  };

  const handleMouseDown = useCallback((e: React.MouseEvent, node: FlowNode) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.button === 0) { // Left click
      setSelectedNode(node);
      setDraggedNode(node);
      
      const rect = canvasRef.current?.getBoundingClientRect();
      if (rect) {
        const x = (e.clientX - rect.left - pan.x) / zoom;
        const y = (e.clientY - rect.top - pan.y) / zoom;
        setDragOffset({
          x: x - node.position.x,
          y: y - node.position.y
        });
      }
    }
  }, [pan, zoom]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (draggedNode && canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const x = (e.clientX - rect.left - pan.x) / zoom - dragOffset.x;
      const y = (e.clientY - rect.top - pan.y) / zoom - dragOffset.y;
      
      // Constrain to canvas bounds
      const constrainedX = Math.max(50, Math.min(canvasSize.width - 50, x));
      const constrainedY = Math.max(50, Math.min(canvasSize.height - 50, y));
      
      updateNode(draggedNode.id, {
        position: { x: constrainedX, y: constrainedY }
      });
    } else if (isPanning && canvasRef.current) {
      const deltaX = e.clientX - lastPanPoint.x;
      const deltaY = e.clientY - lastPanPoint.y;
      
      setPan(prev => ({
        x: prev.x + deltaX,
        y: prev.y + deltaY
      }));
      
      setLastPanPoint({ x: e.clientX, y: e.clientY });
    }
  }, [draggedNode, dragOffset, pan, zoom, canvasSize, isPanning, lastPanPoint, updateNode]);

  const handleMouseUp = useCallback(() => {
    setDraggedNode(null);
    setIsPanning(false);
  }, []);

  const handleCanvasMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      setSelectedNode(null);
      if (e.button === 0) { // Left click for panning
        setIsPanning(true);
        setLastPanPoint({ x: e.clientX, y: e.clientY });
      }
    }
  }, []);

  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? 0.9 : 1.1;
    const newZoom = Math.max(0.3, Math.min(2, zoom * delta));
    setZoom(newZoom);
  }, [zoom]);

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'screen': return 'bg-blue-500 border-blue-600 shadow-blue-500/50';
      case 'action': return 'bg-green-500 border-green-600 shadow-green-500/50';
      case 'decision': return 'bg-orange-500 border-orange-600 shadow-orange-500/50';
      default: return 'bg-gray-500 border-gray-600 shadow-gray-500/50';
    }
  };

  const copyMarkdownToClipboard = () => {
    navigator.clipboard.writeText(markdownFlow);
    setCopiedMarkdown(true);
    setTimeout(() => setCopiedMarkdown(false), 2000);
  };

  const downloadMarkdown = () => {
    const blob = new Blob([markdownFlow], { type: 'text/markdown' });
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
      {/* Header Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-white">Interactive UI Flow Designer</h3>
        <div className="flex items-center space-x-2">
          <button
            onClick={resetView}
            className="flex items-center px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors text-sm"
          >
            <MousePointer className="h-4 w-4 mr-2" />
            Reset View
          </button>
          <button
            onClick={addNode}
            className="flex items-center px-3 py-2 bg-slate-600 text-white rounded-lg hover:bg-slate-500 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Node
          </button>
          <button
            onClick={generateFlow}
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
      </div>

      {!apiKey && (
        <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
          <p className="text-amber-200 text-sm">
            Please add your Gemini API key to generate AI-powered user flows.
          </p>
        </div>
      )}

      {/* Canvas and Editor Layout */}
      <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
        {/* Main Canvas - Takes up 3/4 of the width on large screens */}
        <div className="xl:col-span-3">
          <div className="bg-slate-700/30 rounded-xl border border-slate-600 overflow-hidden">
            {/* Canvas Controls */}
            <div className="bg-slate-800/50 border-b border-slate-600 p-3 flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300">
                  Zoom: {Math.round(zoom * 100)}%
                </span>
                <span className="text-sm text-gray-300">
                  Nodes: {flow.length}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setShowMarkdown(!showMarkdown)}
                  className="flex items-center px-3 py-1 bg-purple-600 text-white rounded text-sm hover:bg-purple-700 transition-colors"
                >
                  <FileText className="h-4 w-4 mr-1" />
                  {showMarkdown ? 'Hide' : 'Show'} Markdown
                </button>
                {markdownFlow && (
                  <>
                    <button
                      onClick={copyMarkdownToClipboard}
                      className="flex items-center px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700 transition-colors"
                    >
                      {copiedMarkdown ? (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      ) : (
                        <Copy className="h-4 w-4 mr-1" />
                      )}
                      {copiedMarkdown ? 'Copied!' : 'Copy'}
                    </button>
                    <button
                      onClick={downloadMarkdown}
                      className="flex items-center px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700 transition-colors"
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Download
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Canvas */}
            <div 
              ref={canvasRef}
              className="relative bg-slate-800/30 cursor-grab active:cursor-grabbing"
              style={{ height: '600px' }}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
              onWheel={handleWheel}
            >
              {flow.length === 0 ? (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <GitBranch className="h-16 w-16 mx-auto mb-4 text-gray-500" />
                    <p className="text-lg font-medium mb-2">No flow created yet</p>
                    <p className="text-sm">Generate one with AI or add nodes manually</p>
                  </div>
                </div>
              ) : (
                <>
                  {/* SVG for connections */}
                  <svg 
                    ref={svgRef}
                    className="absolute inset-0 w-full h-full pointer-events-none"
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
                    }}
                  >
                    <defs>
                      <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                              refX="9" refY="3.5" orient="auto">
                        <polygon points="0 0, 10 3.5, 0 7" fill="#64748B" />
                      </marker>
                      <filter id="glow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                          <feMergeNode in="coloredBlur"/>
                          <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                      </filter>
                    </defs>
                    
                    {flow.map((node: FlowNode) =>
                      node.connections.map((targetId: string) => {
                        const targetNode = flow.find((n: FlowNode) => n.id === targetId);
                        if (!targetNode) return null;
                        
                        return (
                          <line
                            key={`${node.id}-${targetId}`}
                            x1={node.position.x + 60}
                            y1={node.position.y + 25}
                            x2={targetNode.position.x + 60}
                            y2={targetNode.position.y + 25}
                            stroke="#64748B"
                            strokeWidth="2"
                            markerEnd="url(#arrowhead)"
                            filter="url(#glow)"
                          />
                        );
                      })
                    )}
                  </svg>

                  {/* Nodes */}
                  <div 
                    className="absolute inset-0"
                    style={{
                      transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
                    }}
                  >
                    {flow.map((node: FlowNode) => (
                      <div
                        key={node.id}
                        className={`absolute cursor-move transition-all duration-200 ${
                          selectedNode?.id === node.id ? 'ring-2 ring-blue-400 ring-opacity-75' : ''
                        } ${draggedNode?.id === node.id ? 'z-50' : 'z-10'}`}
                        style={{
                          left: `${node.position.x}px`,
                          top: `${node.position.y}px`,
                          transform: 'translate(-50%, -50%)'
                        }}
                        onMouseDown={(e) => handleMouseDown(e, node)}
                      >
                        <div className={`px-4 py-3 rounded-xl text-white text-sm font-medium shadow-xl border-2 min-w-[120px] text-center ${getNodeColor(node.type)} hover:scale-105 transition-transform`}>
                          <div className="font-semibold">{node.name}</div>
                          <div className="text-xs opacity-75 capitalize mt-1">{node.type}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Legend */}
            <div className="bg-slate-800/50 border-t border-slate-600 p-3">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-6 text-sm">
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-blue-500 rounded"></div>
                    <span className="text-gray-300">Screen</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-green-500 rounded"></div>
                    <span className="text-gray-300">Action</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-4 h-4 bg-orange-500 rounded"></div>
                    <span className="text-gray-300">Decision</span>
                  </div>
                </div>
                <div className="text-xs text-gray-400">
                  💡 Drag nodes to reposition • Click to select • Scroll to zoom • Drag canvas to pan
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Node Editor - Takes up 1/4 of the width on large screens */}
        <div className="xl:col-span-1">
          <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6 h-full">
            {selectedNode ? (
              <>
                <div className="flex items-center justify-between mb-6">
                  <h4 className="font-medium text-white">Edit Node</h4>
                  <button
                    onClick={() => deleteNode(selectedNode.id)}
                    className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                    <input
                      type="text"
                      value={selectedNode.name}
                      onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Type</label>
                    <select
                      value={selectedNode.type}
                      onChange={(e) => updateNode(selectedNode.id, { type: e.target.value as any })}
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                    >
                      <option value="screen">Screen</option>
                      <option value="action">Action</option>
                      <option value="decision">Decision</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Description</label>
                    <textarea
                      value={selectedNode.description || ''}
                      onChange={(e) => updateNode(selectedNode.id, { description: e.target.value })}
                      placeholder="Describe what happens at this step..."
                      className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white placeholder-gray-400 resize-none"
                      rows={3}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">Position</label>
                    <div className="grid grid-cols-2 gap-2">
                      <input
                        type="number"
                        placeholder="X"
                        value={Math.round(selectedNode.position.x)}
                        onChange={(e) => updateNode(selectedNode.id, { 
                          position: { ...selectedNode.position, x: parseInt(e.target.value) || 0 }
                        })}
                        className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                      />
                      <input
                        type="number"
                        placeholder="Y"
                        value={Math.round(selectedNode.position.y)}
                        onChange={(e) => updateNode(selectedNode.id, { 
                          position: { ...selectedNode.position, y: parseInt(e.target.value) || 0 }
                        })}
                        className="px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-white"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Connections
                    </label>
                    <div className="space-y-2">
                      {flow.filter((n: FlowNode) => n.id !== selectedNode.id).map((node: FlowNode) => (
                        <label key={node.id} className="flex items-center">
                          <input
                            type="checkbox"
                            checked={selectedNode.connections.includes(node.id)}
                            onChange={(e) => {
                              const connections = e.target.checked
                                ? [...selectedNode.connections, node.id]
                                : selectedNode.connections.filter(id => id !== node.id);
                              updateNode(selectedNode.id, { connections });
                            }}
                            className="mr-2 rounded border-slate-600 bg-slate-700 text-blue-600 focus:ring-blue-500"
                          />
                          <span className="text-sm text-gray-300">{node.name}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8">
                <Move className="h-12 w-12 text-gray-500 mx-auto mb-4" />
                <h4 className="text-lg font-medium text-white mb-2">No Node Selected</h4>
                <p className="text-gray-400 text-sm">Click on a node to edit its properties</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Markdown Preview */}
      {showMarkdown && markdownFlow && (
        <div className="bg-slate-700/30 border border-slate-600 rounded-xl p-6">
          <div className="flex items-center justify-between mb-4">
            <h4 className="text-lg font-semibold text-white flex items-center">
              <FileText className="h-5 w-5 text-purple-400 mr-2" />
              Generated Markdown Flow
            </h4>
            <div className="flex space-x-2">
              <button
                onClick={copyMarkdownToClipboard}
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
          
          <div className="bg-slate-800/50 rounded-lg p-4 max-h-96 overflow-y-auto">
            <pre className="text-sm text-gray-300 whitespace-pre-wrap font-mono">
              {markdownFlow}
            </pre>
          </div>
          
          <div className="mt-4 p-4 bg-blue-500/10 rounded-lg border border-blue-500/20">
            <p className="text-sm text-blue-200">
              <Zap className="h-4 w-4 inline mr-2" />
              <strong>Builder Tools Integration:</strong> This markdown flow can be used in the Builder Tools section to generate detailed prompts for your selected development tools. The structured flow helps AI understand your app's navigation and user journey.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default UIFlowSection;