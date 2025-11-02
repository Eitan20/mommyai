"use client";

import { memo, useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Video, Music, Trash2, Loader, Sparkles, FileText, Upload } from 'lucide-react';
import dynamic from 'next/dynamic';
import useWhiteboardStore, { NodeData } from '@/store/whiteboardStore';
import useContentStore from '@/store/contentStore';
import {
  detectVideoType,
  transcribeVideo,
  transcribeAudio,
  getVideoThumbnail,
} from '@/utils/mediaProcessing';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

function MediaNode({ id, data, selected }: NodeProps<NodeData>) {
  const { updateNodeData, deleteNode } = useWhiteboardStore();
  const { addContent, updateContent, getContent } = useContentStore();

  const [mediaUrl, setMediaUrl] = useState(data.mediaUrl || '');
  const [mediaType, setMediaType] = useState<'video' | 'audio'>(data.mediaType || 'video');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [videoType, setVideoType] = useState<string | null>(null);

  // Detect video platform when URL changes
  useEffect(() => {
    if (mediaUrl && mediaType === 'video') {
      const type = detectVideoType(mediaUrl);
      setVideoType(type);
    }
  }, [mediaUrl, mediaType]);

  const handleMediaUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setMediaUrl(url);
    updateNodeData(id, { mediaUrl: url });
  }, [id, updateNodeData]);

  const handleMediaTypeChange = useCallback((type: 'video' | 'audio') => {
    setMediaType(type);
    updateNodeData(id, { mediaType: type });
  }, [id, updateNodeData]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setMediaUrl(dataUrl);
        updateNodeData(id, { mediaUrl: dataUrl, fileName: file.name });

        // Auto-process audio files
        if (mediaType === 'audio') {
          handleProcessAudio(file);
        }
      };
      reader.readAsDataURL(file);
    }
  }, [id, updateNodeData, mediaType]);

  const handleProcessVideo = useCallback(async () => {
    if (!mediaUrl) return;

    setIsProcessing(true);
    addContent(id, {
      id,
      type: 'video',
      originalUrl: mediaUrl,
      status: 'processing',
      metadata: {
        platform: videoType || undefined,
      },
    });

    try {
      // Transcribe video
      const transcript = await transcribeVideo(mediaUrl);

      updateContent(id, {
        status: 'completed',
        transcript,
        summary: `Video from ${videoType || 'source'} has been analyzed.`,
        keyPoints: [
          'Video content transcribed',
          'Key topics identified',
          'Ready for AI analysis',
        ],
      });

      updateNodeData(id, { processed: true });
    } catch (error) {
      updateContent(id, { status: 'error' });
    } finally {
      setIsProcessing(false);
    }
  }, [mediaUrl, id, videoType, addContent, updateContent, updateNodeData]);

  const handleProcessAudio = useCallback(async (file: File) => {
    setIsProcessing(true);
    addContent(id, {
      id,
      type: 'audio',
      fileName: file.name,
      status: 'processing',
    });

    try {
      const transcript = await transcribeAudio(file);

      updateContent(id, {
        status: 'completed',
        transcript,
        summary: `Audio transcribed from ${file.name}`,
      });

      updateNodeData(id, { processed: true });
    } catch (error) {
      updateContent(id, { status: 'error' });
    } finally {
      setIsProcessing(false);
    }
  }, [id, addContent, updateContent, updateNodeData]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  }, [id, deleteNode]);

  const content = getContent(id);
  const hasTranscript = content?.transcript;

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
            {videoType ? `${videoType.charAt(0).toUpperCase() + videoType.slice(1)}` : 'Media'}
          </span>
          {content?.status === 'completed' && (
            <Sparkles size={14} className="text-green-500" title="Processed" />
          )}
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

      <div className="space-y-2 mb-2">
        <input
          type="text"
          value={mediaUrl}
          onChange={handleMediaUrlChange}
          placeholder={`Paste ${mediaType} URL (YouTube, TikTok, IG, etc.)...`}
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <label className="block">
          <input
            type="file"
            accept={mediaType === 'video' ? 'video/*' : 'audio/*'}
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="w-full p-2 border border-dashed rounded text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Upload size={16} className="inline mr-2" />
            <span className="text-sm">Or upload {mediaType} file</span>
          </div>
        </label>
      </div>

      {data.mediaUrl && (
        <div className="space-y-2">
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
            {mediaType === 'video' ? (
              videoType ? (
                <ReactPlayer
                  url={data.mediaUrl}
                  controls
                  width="100%"
                  height="200px"
                  config={{
                    youtube: {
                      playerVars: { showinfo: 1 }
                    }
                  }}
                />
              ) : (
                <video
                  src={data.mediaUrl}
                  controls
                  className="w-full"
                  style={{ maxHeight: '200px' }}
                >
                  Your browser does not support the video tag.
                </video>
              )
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

          {/* Process Button */}
          {!content?.transcript && (
            <button
              onClick={mediaType === 'video' ? handleProcessVideo : undefined}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 transition-colors text-sm"
            >
              {isProcessing ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Transcribe & Analyze
                </>
              )}
            </button>
          )}

          {/* Show Transcript */}
          {hasTranscript && (
            <div className="space-y-1">
              <button
                onClick={() => setShowTranscript(!showTranscript)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm"
              >
                <FileText size={14} />
                {showTranscript ? 'Hide' : 'Show'} Transcript
              </button>
              {showTranscript && (
                <div className="p-3 bg-white dark:bg-gray-700 border rounded text-xs max-h-40 overflow-y-auto">
                  {content.transcript}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      <Handle type="source" position={Position.Bottom} className="w-2 h-2" />
    </div>
  );
}

export default memo(MediaNode);
