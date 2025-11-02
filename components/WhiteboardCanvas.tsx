"use client";

import { useCallback, useEffect, useMemo, useState } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  BackgroundVariant,
  Connection,
  addEdge,
  useReactFlow,
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
import MediaDropZone from './MediaDropZone';
import { isValidUrl, fetchLinkMetadata } from '@/utils/linkMetadata';
import { detectVideoType } from '@/utils/mediaProcessing';

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
    addNode,
  } = useWhiteboardStore();

  const { getCurrentBoard, updateBoard } = useBoardStore();
  const [isDraggingFile, setIsDraggingFile] = useState(false);

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

  // Handle file drop
  const handleFileDrop = useCallback(
    (file: File, category: 'image' | 'video' | 'audio' | 'document') => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        const centerX = window.innerWidth / 2 - 150;
        const centerY = window.innerHeight / 2 - 100;

        // Create appropriate node based on category
        switch (category) {
          case 'image':
            addNode('image', { x: centerX, y: centerY }, {
              imageUrl: dataUrl,
              fileName: file.name,
              label: file.name,
            });
            break;
          case 'video':
          case 'audio':
            addNode('media', { x: centerX, y: centerY }, {
              mediaUrl: dataUrl,
              fileName: file.name,
              mediaType: category,
              label: file.name,
            });
            break;
          case 'document':
            addNode('document', { x: centerX, y: centerY }, {
              fileName: file.name,
              label: file.name,
            });
            break;
        }
      };

      reader.readAsDataURL(file);
      setIsDraggingFile(false);
    },
    [addNode]
  );

  // Handle drag over canvas
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDraggingFile(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    // Only set to false if leaving the canvas container
    if (e.currentTarget === e.target) {
      setIsDraggingFile(false);
    }
  }, []);

  // Handle paste events (Cmd+V / Ctrl+V)
  useEffect(() => {
    const handlePaste = async (e: ClipboardEvent) => {
      const pastedText = e.clipboardData?.getData('text');

      if (!pastedText || !isValidUrl(pastedText)) {
        return; // Not a URL, ignore
      }

      e.preventDefault();

      const centerX = window.innerWidth / 2 - 150;
      const centerY = window.innerHeight / 2 - 100;

      // Check if it's a video URL
      const videoType = detectVideoType(pastedText);

      if (videoType && videoType !== 'unknown') {
        // Create media node for videos
        addNode('media', { x: centerX, y: centerY }, {
          mediaUrl: pastedText,
          mediaType: 'video',
          label: `${videoType.charAt(0).toUpperCase() + videoType.slice(1)} Video`,
        });
      } else {
        // Fetch metadata for regular links
        const metadata = await fetchLinkMetadata(pastedText);

        addNode('link', { x: centerX, y: centerY }, {
          url: pastedText,
          label: metadata.title || 'Link',
          content: metadata.description,
          imageUrl: metadata.image,
          icon: metadata.icon,
        });
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [addNode]);

  return (
    <div
      className="relative w-full h-full"
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
    >
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
        className="bg-white dark:bg-gray-900"
        minZoom={0.1}
        maxZoom={4}
        defaultViewport={{ x: 0, y: 0, zoom: 1 }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={12}
          size={1}
          className="bg-white dark:bg-gray-900"
        />
        <Controls
          showZoom={true}
          showFitView={true}
          showInteractive={true}
        />
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

      {/* Media Drop Zone - shown when empty or dragging files */}
      {(nodes.length === 0 || isDraggingFile) && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="pointer-events-auto max-w-2xl w-full mx-4">
            {nodes.length === 0 && !isDraggingFile && (
              <div className="text-center space-y-4 mb-8">
                <h2 className="text-3xl font-bold text-gray-800 dark:text-gray-200">
                  Start Creating
                </h2>
                <p className="text-lg text-gray-600 dark:text-gray-400">
                  Drag & drop files below, use the toolbar above,
                  <br />
                  or ask the AI assistant for help!
                </p>
              </div>
            )}
            <MediaDropZone
              onFileDrop={handleFileDrop}
              className={isDraggingFile ? 'scale-105 shadow-2xl' : ''}
            />
          </div>
        </div>
      )}

      {/* Collaboration Cursors */}
      <CollaborationCursors boardId={boardId} />
    </div>
  );
}
