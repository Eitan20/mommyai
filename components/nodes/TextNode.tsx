"use client";

import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Type, Trash2 } from 'lucide-react';
import useWhiteboardStore, { NodeData } from '@/store/whiteboardStore';

function TextNode({ id, data, selected }: NodeProps<NodeData>) {
  const { updateNodeData, deleteNode } = useWhiteboardStore();
  const [isEditing, setIsEditing] = useState(false);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { content: e.target.value });
  }, [id, updateNodeData]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  }, [id, deleteNode]);

  return (
    <div
      className="px-4 py-3 rounded-lg shadow-lg min-w-[200px] max-w-[400px] border-2"
      style={{
        backgroundColor: data.backgroundColor || '#ffffff',
        borderColor: selected ? '#3b82f6' : 'transparent',
      }}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <Type size={16} style={{ color: data.textColor || '#000000' }} />
          <span className="font-semibold text-sm" style={{ color: data.textColor || '#000000' }}>
            Text
          </span>
        </div>
        <button
          onClick={handleDelete}
          className="hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded transition-colors"
        >
          <Trash2 size={14} className="text-red-500" />
        </button>
      </div>

      <textarea
        value={data.content || ''}
        onChange={handleContentChange}
        onFocus={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
        placeholder="Type your text here..."
        className="w-full min-h-[80px] p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          color: data.textColor || '#000000',
          fontSize: `${data.fontSize || 14}px`,
        }}
      />

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

export default memo(TextNode);
