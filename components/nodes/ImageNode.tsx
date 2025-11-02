"use client";

import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Image as ImageIcon, Trash2, Upload } from 'lucide-react';
import useWhiteboardStore, { NodeData } from '@/store/whiteboardStore';

function ImageNode({ id, data, selected }: NodeProps<NodeData>) {
  const { updateNodeData, deleteNode } = useWhiteboardStore();
  const [imageUrl, setImageUrl] = useState(data.imageUrl || '');

  const handleImageUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    updateNodeData(id, { imageUrl: url });
  }, [id, updateNodeData]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  }, [id, deleteNode]);

  return (
    <div
      className="px-4 py-3 rounded-lg shadow-lg min-w-[250px] border-2"
      style={{
        backgroundColor: data.backgroundColor || '#ffffff',
        borderColor: selected ? '#3b82f6' : 'transparent',
      }}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ImageIcon size={16} style={{ color: data.textColor || '#000000' }} />
          <span className="font-semibold text-sm" style={{ color: data.textColor || '#000000' }}>
            Image
          </span>
        </div>
        <button
          onClick={handleDelete}
          className="hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded transition-colors"
        >
          <Trash2 size={14} className="text-red-500" />
        </button>
      </div>

      <input
        type="text"
        value={imageUrl}
        onChange={handleImageUrlChange}
        placeholder="Enter image URL..."
        className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />

      {data.imageUrl ? (
        <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
          <img
            src={data.imageUrl}
            alt={data.label || 'Image'}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EError%3C/text%3E%3C/svg%3E';
            }}
          />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-48 bg-gray-100 dark:bg-gray-800 rounded">
          <Upload size={32} className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Enter URL above</p>
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

export default memo(ImageNode);
