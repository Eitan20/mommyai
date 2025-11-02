"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft,
  MessageSquare,
  Maximize2,
  Minimize2,
  Download,
  Upload,
  Sparkles,
  Layout,
  Grid3x3,
  Image,
  Video,
  Type,
  Link as LinkIcon,
  Folder,
} from 'lucide-react';
import { Board } from '@/store/boardStore';
import useWhiteboardStore from '@/store/whiteboardStore';

interface BoardHeaderProps {
  board: Board;
  isChatOpen: boolean;
  onToggleChat: () => void;
  onToggleFullscreen: () => void;
}

export default function BoardHeader({
  board,
  isChatOpen,
  onToggleChat,
  onToggleFullscreen,
}: BoardHeaderProps) {
  const router = useRouter();
  const { addNode } = useWhiteboardStore();
  const [showTemplates, setShowTemplates] = useState(false);
  const [showMediaMenu, setShowMediaMenu] = useState(false);
  const [viewMode, setViewMode] = useState<'freeform' | 'mindmap'>('freeform');

  const handleAddNode = (type: string) => {
    const centerX = window.innerWidth / 2 - 100;
    const centerY = window.innerHeight / 2 - 100;
    const randomOffset = () => Math.random() * 100 - 50;

    addNode(type, {
      x: centerX + randomOffset(),
      y: centerY + randomOffset(),
    });
    setShowMediaMenu(false);
  };

  const templates = [
    {
      id: 'brainstorm',
      name: 'Brainstorming',
      description: 'Generate ideas and organize thoughts',
      icon: '💡',
    },
    {
      id: 'project',
      name: 'Project Planning',
      description: 'Plan and track project tasks',
      icon: '📋',
    },
    {
      id: 'mindmap',
      name: 'Mind Map',
      description: 'Visual hierarchy of ideas',
      icon: '🧠',
    },
    {
      id: 'kanban',
      name: 'Kanban Board',
      description: 'Task workflow management',
      icon: '📊',
    },
  ];

  const applyTemplate = (templateId: string) => {
    // Apply template logic
    switch (templateId) {
      case 'brainstorm':
        const ideas = ['Central Idea', 'Concept 1', 'Concept 2', 'Concept 3'];
        ideas.forEach((idea, index) => {
          addNode(
            'text',
            { x: 200 + (index % 2) * 300, y: 150 + Math.floor(index / 2) * 200 },
            { content: idea, backgroundColor: '#e0f2fe' }
          );
        });
        break;
      case 'project':
        const phases = ['Planning', 'Design', 'Development', 'Testing', 'Launch'];
        phases.forEach((phase, index) => {
          addNode(
            'text',
            { x: 150 + index * 200, y: 200 },
            { content: phase, backgroundColor: '#ddd6fe' }
          );
        });
        break;
      case 'mindmap':
        addNode('text', { x: 400, y: 200 }, { content: 'Main Topic', backgroundColor: '#fef3c7' });
        ['Subtopic 1', 'Subtopic 2', 'Subtopic 3'].forEach((topic, index) => {
          addNode(
            'text',
            { x: 200 + index * 250, y: 350 },
            { content: topic, backgroundColor: '#e0e7ff' }
          );
        });
        break;
    }
    setShowTemplates(false);
  };

  return (
    <header className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-4 py-3">
      <div className="flex items-center justify-between">
        {/* Left Section */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft size={20} />
          </button>

          <div>
            <h1 className="text-lg font-semibold text-gray-900 dark:text-white">
              {board.title}
            </h1>
            {board.description && (
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {board.description}
              </p>
            )}
          </div>
        </div>

        {/* Center Section - Controls */}
        <div className="flex items-center gap-2">
          {/* Templates */}
          <div className="relative">
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              className="flex items-center gap-2 px-3 py-2 bg-gradient-to-r from-purple-100 to-blue-100 dark:from-purple-900 dark:to-blue-900 text-purple-700 dark:text-purple-300 rounded-lg hover:from-purple-200 hover:to-blue-200 dark:hover:from-purple-800 dark:hover:to-blue-800 transition-all"
            >
              <Sparkles size={18} />
              <span className="text-sm font-medium">Templates</span>
            </button>

            {showTemplates && (
              <div className="absolute top-full mt-2 left-0 w-72 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 py-2 z-50">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => applyTemplate(template.id)}
                    className="w-full flex items-start gap-3 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-left"
                  >
                    <span className="text-2xl">{template.icon}</span>
                    <div>
                      <div className="font-medium text-gray-900 dark:text-white">
                        {template.name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {template.description}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Add Media Menu */}
          <div className="relative">
            <button
              onClick={() => setShowMediaMenu(!showMediaMenu)}
              className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
            >
              <Image size={18} />
              <span className="text-sm font-medium">Add Media</span>
            </button>

            {showMediaMenu && (
              <div className="absolute top-full mt-2 left-0 w-48 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 py-2 z-50">
                <button
                  onClick={() => handleAddNode('text')}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Type size={18} />
                  <span className="text-sm">Text</span>
                </button>
                <button
                  onClick={() => handleAddNode('image')}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Image size={18} />
                  <span className="text-sm">Image</span>
                </button>
                <button
                  onClick={() => handleAddNode('link')}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <LinkIcon size={18} />
                  <span className="text-sm">Link</span>
                </button>
                <button
                  onClick={() => handleAddNode('media')}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Video size={18} />
                  <span className="text-sm">Media</span>
                </button>
                <button
                  onClick={() => handleAddNode('group')}
                  className="w-full flex items-center gap-3 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors"
                >
                  <Folder size={18} />
                  <span className="text-sm">Group</span>
                </button>
              </div>
            )}
          </div>

          {/* View Mode Toggle */}
          <div className="flex gap-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
            <button
              onClick={() => setViewMode('freeform')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                viewMode === 'freeform'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Layout size={16} />
            </button>
            <button
              onClick={() => setViewMode('mindmap')}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${
                viewMode === 'mindmap'
                  ? 'bg-white dark:bg-gray-600 shadow-sm'
                  : 'text-gray-600 dark:text-gray-400'
              }`}
            >
              <Grid3x3 size={16} />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-2">
          <button
            onClick={onToggleChat}
            className={`p-2 rounded-lg transition-all ${
              isChatOpen
                ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400'
                : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
            }`}
          >
            <MessageSquare size={20} />
          </button>

          <button
            onClick={onToggleFullscreen}
            className="p-2 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-all"
          >
            <Maximize2 size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
