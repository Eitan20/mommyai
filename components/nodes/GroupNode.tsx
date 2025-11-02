"use client";

import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Folder, Trash2, Plus, Type, Link as LinkIcon } from 'lucide-react';
import useWhiteboardStore, { NodeData } from '@/store/whiteboardStore';

function GroupNode({ id, data, selected }: NodeProps<NodeData>) {
  const { updateNodeData, deleteNode, addChildNode } = useWhiteboardStore();

  const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { label: e.target.value });
  }, [id, updateNodeData]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  }, [id, deleteNode]);

  const handleAddText = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Add text node in the center of the group
    const centerX = (data.width || 400) / 2 - 100;
    const centerY = (data.height || 300) / 2 - 50;
    addChildNode(id, 'text', { x: centerX, y: centerY + 50 }, {
      content: 'New text...',
      backgroundColor: '#fef3c7',
    });
  }, [id, data.width, data.height, addChildNode]);

  const handleAddLink = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    // Add link node in the center of the group
    const centerX = (data.width || 400) / 2 - 100;
    const centerY = (data.height || 300) / 2 - 50;
    addChildNode(id, 'link', { x: centerX, y: centerY + 50 }, {
      url: 'https://',
      label: 'New link',
      backgroundColor: '#fed7aa',
    });
  }, [id, data.width, data.height, addChildNode]);

  const childCount = data.childNodes?.length || 0;

  return (
    <div
      className="rounded-lg border-2 border-dashed p-4 bg-opacity-10"
      style={{
        backgroundColor: data.backgroundColor || '#f0f9ff',
        borderColor: selected ? '#3b82f6' : '#93c5fd',
        width: data.width || 400,
        height: data.height || 300,
      }}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Folder size={16} className="text-blue-500" />
          <input
            type="text"
            value={data.label || 'Group'}
            onChange={handleLabelChange}
            className="font-semibold text-sm bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
            style={{ color: data.textColor || '#1e40af' }}
          />
          <span className="text-xs text-gray-400">({childCount} items)</span>
        </div>
        <button
          onClick={handleDelete}
          className="hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded transition-colors"
        >
          <Trash2 size={14} className="text-red-500" />
        </button>
      </div>

      {/* Action buttons to add content */}
      <div className="flex gap-2 mb-3">
        <button
          onClick={handleAddText}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
        >
          <Plus size={12} />
          <Type size={12} />
          <span>Add Text</span>
        </button>
        <button
          onClick={handleAddLink}
          className="flex items-center gap-1 px-2 py-1 text-xs bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
        >
          <Plus size={12} />
          <LinkIcon size={12} />
          <span>Add Link</span>
        </button>
      </div>

      {childCount === 0 && (
        <div className="text-xs text-gray-500 dark:text-gray-400 text-center mt-8">
          Click the buttons above to add text or links to this group
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

export default memo(GroupNode);
