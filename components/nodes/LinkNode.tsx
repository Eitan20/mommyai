"use client";

import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
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
      className="px-4 py-3 rounded-lg shadow-lg min-w-[250px] border-2"
      style={{
        backgroundColor: data.backgroundColor || '#ffffff',
        borderColor: selected ? '#3b82f6' : 'transparent',
        width: data.width || 250,
        height: data.height || 200,
      }}
    >
      <NodeResizer
        minWidth={250}
        minHeight={150}
        isVisible={selected}
        lineClassName="border-blue-400"
        handleClassName="h-3 w-3 bg-white border-2 border-blue-400"
      />
      <Handle type="target" position={Position.Right} className="w-2 h-2" />

      {/* Orange header bar for Link/Social Media Node */}
      <div className="flex items-center justify-between mb-2 -mx-4 -mt-3 px-4 py-2 rounded-t-lg" style={{ backgroundColor: '#f59e0b' }}>
        <div className="flex items-center gap-2">
          {data.icon ? (
            <img src={data.icon} alt="" className="w-4 h-4" onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }} />
          ) : (
            <LinkIcon size={16} className="text-white" />
          )}
          <span className="font-semibold text-sm text-white">
            Link
          </span>
        </div>
        <div className="flex gap-1">
          {data.url && (
            <button
              onClick={handleOpenLink}
              className="p-1 hover:bg-orange-600 rounded transition-colors"
              title="Open link"
            >
              <ExternalLink size={14} className="text-white" />
            </button>
          )}
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-orange-600 rounded transition-colors"
          >
            <Trash2 size={14} className="text-white" />
          </button>
        </div>
      </div>

      {/* Thumbnail */}
      {data.imageUrl && (
        <div className="mb-2 rounded overflow-hidden">
          <img
            src={data.imageUrl}
            alt={data.label || 'Link preview'}
            className="w-full h-32 object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none';
            }}
          />
        </div>
      )}

      <input
        type="text"
        value={label}
        onChange={handleLabelChange}
        placeholder="Link title..."
        className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-medium"
        style={{ color: data.textColor || '#000000' }}
      />

      {/* Description */}
      {data.content && (
        <p className="text-xs text-gray-600 dark:text-gray-400 mb-2 line-clamp-2">
          {data.content}
        </p>
      )}

      <input
        type="url"
        value={url}
        onChange={handleUrlChange}
        placeholder="https://example.com"
        className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />

      <Handle type="source" position={Position.Right} className="w-2 h-2" />
    </div>
  );
}

export default memo(LinkNode);
