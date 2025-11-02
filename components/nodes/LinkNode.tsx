"use client";

import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Link as LinkIcon, Trash2, ExternalLink } from 'lucide-react';
import useWhiteboardStore, { NodeData } from '@/store/whiteboardStore';

function LinkNode({ id, data, selected }: NodeProps<NodeData>) {
  const { updateNodeData, deleteNode } = useWhiteboardStore();
  const [url, setUrl] = useState(data.url || '');
  const [label, setLabel] = useState(data.label || '');

  const handleUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newUrl = e.target.value;
    setUrl(newUrl);
    updateNodeData(id, { url: newUrl });
  }, [id, updateNodeData]);

  const handleLabelChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const newLabel = e.target.value;
    setLabel(newLabel);
    updateNodeData(id, { label: newLabel });
  }, [id, updateNodeData]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  }, [id, deleteNode]);

  const handleOpenLink = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    if (data.url) {
      window.open(data.url, '_blank', 'noopener,noreferrer');
    }
  }, [data.url]);

  return (
    <div
      className="px-4 py-3 rounded-lg shadow-lg min-w-[250px] max-w-[350px] border-2"
      style={{
        backgroundColor: data.backgroundColor || '#ffffff',
        borderColor: selected ? '#3b82f6' : 'transparent',
      }}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <LinkIcon size={16} style={{ color: data.textColor || '#000000' }} />
          <span className="font-semibold text-sm" style={{ color: data.textColor || '#000000' }}>
            Link
          </span>
        </div>
        <div className="flex gap-1">
          {data.url && (
            <button
              onClick={handleOpenLink}
              className="hover:bg-blue-100 dark:hover:bg-blue-900 p-1 rounded transition-colors"
              title="Open link"
            >
              <ExternalLink size={14} className="text-blue-500" />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded transition-colors"
          >
            <Trash2 size={14} className="text-red-500" />
          </button>
        </div>
      </div>

      <input
        type="text"
        value={label}
        onChange={handleLabelChange}
        placeholder="Link title..."
        className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
        style={{ color: data.textColor || '#000000' }}
      />

      <input
        type="url"
        value={url}
        onChange={handleUrlChange}
        placeholder="https://example.com"
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

export default memo(LinkNode);
