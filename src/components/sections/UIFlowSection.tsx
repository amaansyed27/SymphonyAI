import React, { useState } from 'react';
import { useGemini } from '../../hooks/useGemini';
import { GitBranch, Plus, Trash2, RefreshCw, Sparkles } from 'lucide-react';
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

  const generateFlow = async () => {
    const features = projectData.decidedFeatures?.map((f: any) => f.name).join(', ') || 'Basic functionality';
    
    const prompt = `
      Based on the following project details, generate a user flow:
      - Platform: ${projectData.platform}
      - Project Type: ${projectData.projectType}
      - Features: ${features}

      Generate a logical user flow in JSON format:
      {
        "flow": [
          {
            "id": "unique_id",
            "name": "Screen/Action name",
            "type": "screen|action|decision",
            "description": "Brief description",
            "connections": ["id1", "id2"],
            "position": {"x": 100, "y": 100}
          }
        ]
      }

      Create 8-12 nodes that represent the main user journey through the app.
      Include different types: screens (main app pages), actions (user interactions), decisions (choice points).
      Position them in a logical flow from left to right, top to bottom.
    `;

    const result = await generateStructuredContent(prompt, apiKey);
    if (result && result.flow) {
      onUpdate({ uiFlow: result.flow });
    }
  };

  const addNode = () => {
    const newNode: FlowNode = {
      id: `node-${Date.now()}`,
      name: 'New Node',
      type: 'screen',
      connections: [],
      position: { x: 200, y: 200 }
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

  const getNodeColor = (type: string) => {
    switch (type) {
      case 'screen': return 'bg-blue-500 border-blue-600';
      case 'action': return 'bg-green-500 border-green-600';
      case 'decision': return 'bg-orange-500 border-orange-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  const flow = projectData.uiFlow || [];

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">User Flow Designer</h3>
        <div className="flex space-x-2">
          <button
            onClick={addNode}
            className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
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
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
          <p className="text-amber-800 text-sm">
            Please add your Gemini API key to generate AI-powered user flows.
          </p>
        </div>
      )}

      <div className="flex space-x-6">
        {/* Flow Canvas */}
        <div className="flex-1">
          <div className="bg-gray-50 rounded-lg border border-gray-200 relative overflow-hidden" style={{ height: '500px' }}>
            {flow.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                <div className="text-center">
                  <GitBranch className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                  <p>No flow created yet. Generate one with AI or add nodes manually.</p>
                </div>
              </div>
            ) : (
              <>
                {/* Connections */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {flow.map((node: FlowNode) =>
                    node.connections.map((targetId: string) => {
                      const targetNode = flow.find((n: FlowNode) => n.id === targetId);
                      if (!targetNode) return null;
                      
                      return (
                        <line
                          key={`${node.id}-${targetId}`}
                          x1={node.position.x + 40}
                          y1={node.position.y + 20}
                          x2={targetNode.position.x + 40}
                          y2={targetNode.position.y + 20}
                          stroke="#6B7280"
                          strokeWidth="2"
                          markerEnd="url(#arrowhead)"
                        />
                      );
                    })
                  )}
                  <defs>
                    <marker id="arrowhead" markerWidth="10" markerHeight="7" 
                            refX="9" refY="3.5" orient="auto">
                      <polygon points="0 0, 10 3.5, 0 7" fill="#6B7280" />
                    </marker>
                  </defs>
                </svg>

                {/* Nodes */}
                {flow.map((node: FlowNode) => (
                  <div
                    key={node.id}
                    className={`absolute cursor-pointer transition-transform hover:scale-105 ${
                      selectedNode?.id === node.id ? 'ring-2 ring-blue-500' : ''
                    }`}
                    style={{
                      left: `${node.position.x}px`,
                      top: `${node.position.y}px`,
                      transform: 'translate(-50%, -50%)'
                    }}
                    onClick={() => setSelectedNode(node)}
                  >
                    <div className={`px-4 py-2 rounded-lg text-white text-sm font-medium shadow-lg border-2 ${getNodeColor(node.type)}`}>
                      {node.name}
                    </div>
                    <div className="text-xs text-gray-600 text-center mt-1 capitalize">
                      {node.type}
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>

          {/* Legend */}
          <div className="mt-4 flex items-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-blue-500 rounded"></div>
              <span>Screen</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-green-500 rounded"></div>
              <span>Action</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 bg-orange-500 rounded"></div>
              <span>Decision</span>
            </div>
          </div>
        </div>

        {/* Node Editor */}
        {selectedNode && (
          <div className="w-80 bg-white border border-gray-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-4">
              <h4 className="font-medium text-gray-900">Edit Node</h4>
              <button
                onClick={() => deleteNode(selectedNode.id)}
                className="p-1 text-red-600 hover:bg-red-100 rounded"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  value={selectedNode.name}
                  onChange={(e) => updateNode(selectedNode.id, { name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={selectedNode.type}
                  onChange={(e) => updateNode(selectedNode.id, { type: e.target.value as any })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="screen">Screen</option>
                  <option value="action">Action</option>
                  <option value="decision">Decision</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Position</label>
                <div className="grid grid-cols-2 gap-2">
                  <input
                    type="number"
                    placeholder="X"
                    value={selectedNode.position.x}
                    onChange={(e) => updateNode(selectedNode.id, { 
                      position: { ...selectedNode.position, x: parseInt(e.target.value) || 0 }
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                  <input
                    type="number"
                    placeholder="Y"
                    value={selectedNode.position.y}
                    onChange={(e) => updateNode(selectedNode.id, { 
                      position: { ...selectedNode.position, y: parseInt(e.target.value) || 0 }
                    })}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Connections (Node IDs, comma-separated)
                </label>
                <input
                  type="text"
                  value={selectedNode.connections.join(', ')}
                  onChange={(e) => updateNode(selectedNode.id, { 
                    connections: e.target.value.split(',').map(s => s.trim()).filter(Boolean)
                  })}
                  placeholder="node-1, node-2"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UIFlowSection;