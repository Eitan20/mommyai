"use client";

import { useCallback, useEffect, useState, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Connection,
  addEdge,
  Edge,
} from 'reactflow';
import 'reactflow/dist/style.css';

import useWhiteboardStore from '@/store/whiteboardStore';
import Toolbar from './Toolbar';
import AIAssistPanel from './AIAssistPanel';
import TextNode from './nodes/TextNode';
import ImageNode from './nodes/ImageNode';
import LinkNode from './nodes/LinkNode';
import MediaNode from './nodes/MediaNode';
import GroupNode from './nodes/GroupNode';

export default function WhiteboardWorkspace() {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setNodes,
    setEdges,
  } = useWhiteboardStore();

  const [isAIOpen, setIsAIOpen] = useState(false);

  // Define custom node types
  const nodeTypes = useMemo(
    () => ({
      text: TextNode,
      image: ImageNode,
      link: LinkNode,
      media: MediaNode,
      group: GroupNode,
    }),
    []
  );

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges(addEdge(params, edges));
    },
    [edges, setEdges]
  );

  // Load saved state from localStorage
  useEffect(() => {
    const savedNodes = localStorage.getItem('whiteboard-nodes');
    const savedEdges = localStorage.getItem('whiteboard-edges');

    if (savedNodes) {
      try {
        setNodes(JSON.parse(savedNodes));
      } catch (e) {
        console.error('Failed to load nodes:', e);
      }
    }

    if (savedEdges) {
      try {
        setEdges(JSON.parse(savedEdges));
      } catch (e) {
        console.error('Failed to load edges:', e);
      }
    }
  }, [setNodes, setEdges]);

  // Save state to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('whiteboard-nodes', JSON.stringify(nodes));
    localStorage.setItem('whiteboard-edges', JSON.stringify(edges));
  }, [nodes, edges]);

  // Export board to JSON
  const handleExport = useCallback(() => {
    const data = {
      nodes,
      edges,
      version: '1.0',
      exportedAt: new Date().toISOString(),
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `whiteboard-${Date.now()}.json`;
    link.click();
    URL.revokeObjectURL(url);
  }, [nodes, edges]);

  // Import board from JSON
  const handleImport = useCallback(() => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (!file) return;

      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (data.nodes && data.edges) {
            setNodes(data.nodes);
            setEdges(data.edges);
          }
        } catch (error) {
          alert('Failed to import file. Please check the file format.');
        }
      };
      reader.readAsText(file);
    };
    input.click();
  }, [setNodes, setEdges]);

  return (
    <div className="w-full h-full relative">
      <Toolbar
        onAIAssist={() => setIsAIOpen(true)}
        onExport={handleExport}
        onImport={handleImport}
      />

      <AIAssistPanel isOpen={isAIOpen} onClose={() => setIsAIOpen(false)} />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        nodeTypes={nodeTypes}
        fitView
        className="bg-gray-50 dark:bg-gray-900"
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls />
        <MiniMap
          nodeColor={(node) => {
            switch (node.type) {
              case 'text':
                return '#3b82f6';
              case 'image':
                return '#10b981';
              case 'link':
                return '#f59e0b';
              case 'media':
                return '#8b5cf6';
              case 'group':
                return '#93c5fd';
              default:
                return '#6b7280';
            }
          }}
          className="bg-white dark:bg-gray-800"
        />
      </ReactFlow>

      {/* Welcome message for empty board */}
      {nodes.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center space-y-4 max-w-md">
            <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-200">
              MommyAI Whiteboard
            </h1>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Your AI-powered visual workspace for organizing ideas
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-500">
              Use the toolbar above to add text, images, links, and media.
              <br />
              Click the AI Assist button for intelligent suggestions!
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
