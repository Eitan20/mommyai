"use client";

import { useCallback } from 'react';
import { Type, Image, Link, Video, Folder, Trash2, Sparkles, Download, Upload } from 'lucide-react';
import useWhiteboardStore from '@/store/whiteboardStore';

interface ToolbarProps {
  onAIAssist: () => void;
  onExport: () => void;
  onImport: () => void;
}

export default function Toolbar({ onAIAssist, onExport, onImport }: ToolbarProps) {
  const { addNode, clearBoard, groupSelectedNodes } = useWhiteboardStore();

  const handleAddNode = useCallback((type: string) => {
    const centerX = window.innerWidth / 2 - 100;
    const centerY = window.innerHeight / 2 - 100;
    const randomOffset = () => Math.random() * 100 - 50;

    addNode(type, {
      x: centerX + randomOffset(),
      y: centerY + randomOffset(),
    });
  }, [addNode]);

  return (
    <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-2 flex gap-1">
        {/* Add Node Buttons */}
        <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
          <button
            onClick={() => handleAddNode('text')}
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors group relative"
            title="Add Text"
          >
            <Type size={20} className="text-gray-700 dark:text-gray-300" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Text
            </span>
          </button>

          <button
            onClick={() => handleAddNode('image')}
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors group relative"
            title="Add Image"
          >
            <Image size={20} className="text-gray-700 dark:text-gray-300" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Image
            </span>
          </button>

          <button
            onClick={() => handleAddNode('link')}
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors group relative"
            title="Add Link"
          >
            <Link size={20} className="text-gray-700 dark:text-gray-300" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Link
            </span>
          </button>

          <button
            onClick={() => handleAddNode('media')}
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors group relative"
            title="Add Media"
          >
            <Video size={20} className="text-gray-700 dark:text-gray-300" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Media
            </span>
          </button>

          <button
            onClick={() => handleAddNode('group')}
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors group relative"
            title="Add Group"
          >
            <Folder size={20} className="text-gray-700 dark:text-gray-300" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Group
            </span>
          </button>
        </div>

        {/* AI and Actions */}
        <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
          <button
            onClick={onAIAssist}
            className="p-2 hover:bg-purple-100 dark:hover:bg-purple-900 rounded transition-colors group relative"
            title="AI Assist"
          >
            <Sparkles size={20} className="text-purple-600 dark:text-purple-400" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              AI Assist
            </span>
          </button>

          <button
            onClick={groupSelectedNodes}
            className="p-2 hover:bg-blue-100 dark:hover:bg-blue-900 rounded transition-colors group relative"
            title="Group Selected"
          >
            <Folder size={20} className="text-blue-600 dark:text-blue-400" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Group Selected
            </span>
          </button>
        </div>

        {/* Export/Import */}
        <div className="flex gap-1 pr-2 border-r border-gray-300 dark:border-gray-600">
          <button
            onClick={onExport}
            className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded transition-colors group relative"
            title="Export"
          >
            <Download size={20} className="text-gray-700 dark:text-gray-300" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Export
            </span>
          </button>

          <button
            onClick={onImport}
            className="p-2 hover:bg-green-100 dark:hover:bg-green-900 rounded transition-colors group relative"
            title="Import"
          >
            <Upload size={20} className="text-gray-700 dark:text-gray-300" />
            <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
              Import
            </span>
          </button>
        </div>

        {/* Clear Board */}
        <button
          onClick={() => {
            if (confirm('Are you sure you want to clear the entire board?')) {
              clearBoard();
            }
          }}
          className="p-2 hover:bg-red-100 dark:hover:bg-red-900 rounded transition-colors group relative"
          title="Clear Board"
        >
          <Trash2 size={20} className="text-red-500" />
          <span className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 text-xs bg-gray-900 text-white rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
            Clear Board
          </span>
        </button>
      </div>
    </div>
  );
}
