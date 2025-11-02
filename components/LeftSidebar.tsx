"use client";

import { MessageSquare, Video, Mic, Image, Type, Pen, Link as LinkIcon, FileText, Folder } from 'lucide-react';
import useWhiteboardStore from '@/store/whiteboardStore';
import { useCallback } from 'react';

interface LeftSidebarProps {
  onChatToggle?: () => void;
  isChatOpen?: boolean;
}

export default function LeftSidebar({ onChatToggle, isChatOpen }: LeftSidebarProps) {
  const { addNode } = useWhiteboardStore();

  const handleAddNode = useCallback((type: string, additionalData?: any) => {
    // Add node in center of visible viewport
    const centerX = window.innerWidth / 2 - 100;
    const centerY = window.innerHeight / 2 - 100;
    const randomOffset = () => Math.random() * 100 - 50;

    addNode(type, {
      x: centerX + randomOffset(),
      y: centerY + randomOffset(),
    }, additionalData);
  }, [addNode]);

  const tools = [
    {
      id: 'chat',
      name: 'Chat',
      icon: MessageSquare,
      description: 'AI interaction tool',
      color: 'bg-gradient-to-br from-purple-500 to-blue-500',
      action: onChatToggle,
    },
    {
      id: 'social-media',
      name: 'Social Media',
      icon: Video,
      description: 'YouTube, TikTok, Instagram',
      color: 'bg-gradient-to-br from-pink-500 to-red-500',
      action: () => handleAddNode('video', { label: 'Social Media Content' }),
    },
    {
      id: 'voice-over',
      name: 'Voice Over',
      icon: Mic,
      description: 'Record voice notes',
      color: 'bg-gradient-to-br from-green-500 to-teal-500',
      action: () => handleAddNode('audio', { label: 'Voice Over' }),
    },
    {
      id: 'images',
      name: 'Images',
      icon: Image,
      description: 'Upload or paste images',
      color: 'bg-gradient-to-br from-blue-500 to-cyan-500',
      action: () => handleAddNode('image'),
    },
    {
      id: 'text',
      name: 'Text',
      icon: Type,
      description: 'Text blocks & formatting',
      color: 'bg-gradient-to-br from-indigo-500 to-purple-500',
      action: () => handleAddNode('text', { content: 'New text block...' }),
    },
    {
      id: 'annotation',
      name: 'Annotation',
      icon: Pen,
      description: 'Markup and annotate',
      color: 'bg-gradient-to-br from-yellow-500 to-orange-500',
      action: () => handleAddNode('text', {
        content: '📝 Annotation...',
        backgroundColor: '#fef3c7',
        label: 'Annotation'
      }),
    },
    {
      id: 'website',
      name: 'Website',
      icon: LinkIcon,
      description: 'Links and web content',
      color: 'bg-gradient-to-br from-orange-500 to-amber-500',
      action: () => handleAddNode('link'),
    },
    {
      id: 'document',
      name: 'Document',
      icon: FileText,
      description: 'PDFs and documents',
      color: 'bg-gradient-to-br from-red-500 to-pink-500',
      action: () => handleAddNode('document'),
    },
    {
      id: 'group',
      name: 'Group',
      icon: Folder,
      description: 'Organize content together',
      color: 'bg-gradient-to-br from-cyan-500 to-blue-500',
      action: () => handleAddNode('group', {
        label: 'New Group',
        width: 400,
        height: 300,
      }),
    },
  ];

  return (
    <div className="w-20 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col items-center py-4 gap-3 overflow-y-auto">
      {tools.map((tool) => (
        <button
          key={tool.id}
          onClick={tool.action}
          className={`
            group relative w-14 h-14 rounded-xl shadow-md hover:shadow-lg
            transition-all duration-200 hover:scale-110
            ${tool.id === 'chat' && isChatOpen ? 'ring-2 ring-purple-500 ring-offset-2' : ''}
            ${tool.color}
          `}
          title={tool.name}
        >
          <div className="flex items-center justify-center w-full h-full">
            <tool.icon size={24} className="text-white" />
          </div>

          {/* Tooltip */}
          <div className="absolute left-full ml-2 top-1/2 -translate-y-1/2 px-3 py-2 bg-gray-900 text-white text-sm rounded-lg shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-50">
            <div className="font-medium">{tool.name}</div>
            <div className="text-xs text-gray-300">{tool.description}</div>
            <div className="absolute right-full top-1/2 -translate-y-1/2 border-8 border-transparent border-r-gray-900"></div>
          </div>
        </button>
      ))}
    </div>
  );
}
