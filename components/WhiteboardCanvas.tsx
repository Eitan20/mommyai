"use client";

import { useCallback, useEffect, useMemo } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Connection,
  addEdge,
} from 'reactflow';
import 'reactflow/dist/style.css';
import { X } from 'lucide-react';

import useWhiteboardStore from '@/store/whiteboardStore';
import useBoardStore from '@/store/boardStore';
import TextNode from './nodes/TextNode';
import ImageNode from './nodes/ImageNode';
import LinkNode from './nodes/LinkNode';
import MediaNode from './nodes/MediaNode';
import DocumentNode from './nodes/DocumentNode';
import GroupNode from './nodes/GroupNode';
import CollaborationCursors from './CollaborationCursors';

interface WhiteboardCanvasProps {
  boardId: string;
  isFullscreen: boolean;
  onExitFullscreen: () => void;
}

export default function WhiteboardCanvas({
  boardId,
  isFullscreen,
  onExitFullscreen,
}: WhiteboardCanvasProps) {
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    setNodes,
    setEdges,
  } = useWhiteboardStore();

  const { getCurrentBoard, updateBoard } = useBoardStore();

  // Define custom node types
  const nodeTypes = useMemo(
    () => ({
      text: TextNode,
      image: ImageNode,
      link: LinkNode,
      media: MediaNode,
      document: DocumentNode,
      group: GroupNode,
    }),
    []
  );

  // Load board data when component mounts
  useEffect(() => {
    const board = getCurrentBoard();
    if (board && board.nodes) {
      setNodes(board.nodes);
      setEdges(board.edges || []);
    }
  }, [boardId, getCurrentBoard, setNodes, setEdges]);

  // Save board data whenever nodes or edges change
  useEffect(() => {
    const board = getCurrentBoard();
    if (board) {
      updateBoard(board.id, { nodes, edges });
    }
  }, [nodes, edges, getCurrentBoard, updateBoard]);

  // Handle new connections between nodes
  const onConnect = useCallback(
    (params: Connection) => {
      setEdges(addEdge(params, edges));
    },
    [edges, setEdges]
  );

  return (
    <div className="relative w-full h-full">
      {isFullscreen && (
        <button
          onClick={onExitFullscreen}
          className="absolute top-4 right-4 z-10 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
        >
          <X size={20} />
        </button>
      )}

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
            <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
              Start Creating
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Use the toolbar above to add elements to your board,
              <br />
              or ask the AI assistant for help!
            </p>
          </div>
        </div>
      )}

      {/* Collaboration Cursors */}
      <CollaborationCursors boardId={boardId} />
    </div>
  );
}
