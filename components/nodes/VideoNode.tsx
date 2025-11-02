"use client";

import { memo, useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { Video, Trash2, Loader, Sparkles, FileText, Upload } from 'lucide-react';
import dynamic from 'next/dynamic';
import useWhiteboardStore, { NodeData } from '@/store/whiteboardStore';
import useContentStore from '@/store/contentStore';
import {
  detectVideoType,
  fetchVideoTranscript,
  getVideoThumbnail,
  isValidVideoFile,
} from '@/utils/mediaProcessing';

const ReactPlayer = dynamic(() => import('react-player'), { ssr: false });

function VideoNode({ id, data, selected }: NodeProps<NodeData>) {
  const { updateNodeData, deleteNode } = useWhiteboardStore();
  const { addContent, updateContent, getContent } = useContentStore();

  const [mediaUrl, setMediaUrl] = useState(data.mediaUrl || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [videoType, setVideoType] = useState<string | null>(null);

  // Detect video platform when URL changes
  useEffect(() => {
    if (mediaUrl) {
      const type = detectVideoType(mediaUrl);
      setVideoType(type);
    }
  }, [mediaUrl]);

  const handleMediaUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setMediaUrl(url);
    updateNodeData(id, { mediaUrl: url });
  }, [id, updateNodeData]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isVideo = isValidVideoFile(file);

    if (!isVideo) {
      alert('Please upload a valid video file (mp4, webm)');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setMediaUrl(dataUrl);
      updateNodeData(id, {
        mediaUrl: dataUrl,
        fileName: file.name,
      });
    };
    reader.readAsDataURL(file);
  }, [id, updateNodeData]);

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
      // Fetch transcript from video platform
      const result = await fetchVideoTranscript(mediaUrl);

      updateContent(id, {
        status: 'completed',
        transcript: result.transcript,
        summary: `${videoType || 'Video'} from ${videoType || 'source'} has been analyzed.`,
        metadata: {
          platform: videoType || undefined,
          title: result.title,
          author: result.author,
          duration: result.duration,
        },
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
      <NodeResizer
        minWidth={300}
        minHeight={200}
        isVisible={selected}
        lineClassName="border-blue-400"
        handleClassName="h-3 w-3 bg-white border-2 border-blue-400"
      />
      <Handle type="target" position={Position.Right} className="w-2 h-2" />

      {/* Blue header bar for Video Node */}
      <div className="flex items-center justify-between mb-2 -mx-4 -mt-3 px-4 py-2 rounded-t-lg" style={{ backgroundColor: '#3b82f6' }}>
        <div className="flex items-center gap-2">
          <Video size={16} className="text-white" />
          <span className="font-semibold text-sm text-white">
            {videoType ? `${videoType.charAt(0).toUpperCase() + videoType.slice(1)}` : 'Video'}
          </span>
          {content?.status === 'completed' && (
            <Sparkles size={14} className="text-white" title="Processed" />
          )}
        </div>
        <button
          onClick={handleDelete}
          className="p-1 hover:bg-blue-600 rounded transition-colors"
        >
          <Trash2 size={14} className="text-white" />
        </button>
      </div>

      <div className="space-y-2 mb-2">
        <input
          type="text"
          value={mediaUrl}
          onChange={handleMediaUrlChange}
          placeholder="Paste video URL (YouTube, TikTok, IG, Loom, FB...)..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <label className="block">
          <input
            type="file"
            accept="video/mp4,video/webm,video/ogg"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="w-full p-2 border border-dashed rounded text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Upload size={16} className="inline mr-2" />
            <span className="text-sm">Upload video file</span>
          </div>
        </label>
      </div>

      {data.mediaUrl && (
        <div className="space-y-2">
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
            {videoType ? (
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
            )}
          </div>

          {/* Process Button */}
          {!content?.transcript && (
            <button
              onClick={handleProcessVideo}
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
                  <pre className="whitespace-pre-wrap font-mono text-black dark:text-gray-200">
                    {content.transcript}
                  </pre>
                </div>
              )}
              <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                ✓ Content available to AI
              </div>
            </div>
          )}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="w-2 h-2" />
    </div>
  );
}

export default memo(VideoNode);
