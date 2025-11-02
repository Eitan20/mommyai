"use client";

import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Video, Music, Trash2 } from 'lucide-react';
import useWhiteboardStore, { NodeData } from '@/store/whiteboardStore';

function MediaNode({ id, data, selected }: NodeProps<NodeData>) {
  const { updateNodeData, deleteNode } = useWhiteboardStore();
  const [mediaUrl, setMediaUrl] = useState(data.mediaUrl || '');
  const [mediaType, setMediaType] = useState<'video' | 'audio'>(data.mediaType || 'video');

  const handleMediaUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setMediaUrl(url);
    updateNodeData(id, { mediaUrl: url });
  }, [id, updateNodeData]);

  const handleMediaTypeChange = useCallback((type: 'video' | 'audio') => {
    setMediaType(type);
    updateNodeData(id, { mediaType: type });
  }, [id, updateNodeData]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  }, [id, deleteNode]);

  return (
    <div
      className="px-4 py-3 rounded-lg shadow-lg min-w-[300px] border-2"
      style={{
        backgroundColor: data.backgroundColor || '#ffffff',
        borderColor: selected ? '#3b82f6' : 'transparent',
      }}
    >
      <Handle type="target" position={Position.Top} className="w-2 h-2" />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {mediaType === 'video' ? (
            <Video size={16} style={{ color: data.textColor || '#000000' }} />
          ) : (
            <Music size={16} style={{ color: data.textColor || '#000000' }} />
          )}
          <span className="font-semibold text-sm" style={{ color: data.textColor || '#000000' }}>
            Media
          </span>
        </div>
        <button
          onClick={handleDelete}
          className="hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded transition-colors"
        >
          <Trash2 size={14} className="text-red-500" />
        </button>
      </div>

      <div className="flex gap-2 mb-2">
        <button
          onClick={() => handleMediaTypeChange('video')}
          className={`flex-1 px-3 py-1 rounded text-sm ${
            mediaType === 'video'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          Video
        </button>
        <button
          onClick={() => handleMediaTypeChange('audio')}
          className={`flex-1 px-3 py-1 rounded text-sm ${
            mediaType === 'audio'
              ? 'bg-blue-500 text-white'
              : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          Audio
        </button>
      </div>

      <input
        type="text"
        value={mediaUrl}
        onChange={handleMediaUrlChange}
        placeholder={`Enter ${mediaType} URL...`}
        className="w-full p-2 border rounded mb-2 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
      />

      {data.mediaUrl && (
        <div className="w-full bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
          {mediaType === 'video' ? (
            <video
              src={data.mediaUrl}
              controls
              className="w-full"
              style={{ maxHeight: '200px' }}
            >
              Your browser does not support the video tag.
            </video>
          ) : (
            <audio
              src={data.mediaUrl}
              controls
              className="w-full"
            >
              Your browser does not support the audio tag.
            </audio>
          )}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

export default memo(MediaNode);
