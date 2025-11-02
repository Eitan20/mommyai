"use client";

import { memo, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Folder, Trash2 } from 'lucide-react';
import useWhiteboardStore, { NodeData } from '@/store/whiteboardStore';

function GroupNode({ id, data, selected }: NodeProps<NodeData>) {
  const { updateNodeData, deleteNode } = useWhiteboardStore();

  const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    updateNodeData(id, { label: e.target.value });
  }, [id, updateNodeData]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  }, [id, deleteNode]);

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

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Folder size={16} className="text-blue-500" />
          <input
            type="text"
            value={data.label || 'Group'}
            onChange={handleLabelChange}
            className="font-semibold text-sm bg-transparent border-none focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1"
            style={{ color: data.textColor || '#1e40af' }}
          />
        </div>
        <button
          onClick={handleDelete}
          className="hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded transition-colors"
        >
          <Trash2 size={14} className="text-red-500" />
        </button>
      </div>

      <div className="text-xs text-gray-500 dark:text-gray-400">
        Drag elements here to group them
      </div>

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

export default memo(GroupNode);
