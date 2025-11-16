"use client";

import { memo, useState, useCallback, useEffect } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { Video, Music, Trash2, Loader, Sparkles, FileText, Upload, Mic } from 'lucide-react';
import dynamic from 'next/dynamic';
import useWhiteboardStore, { NodeData } from '@/store/whiteboardStore';
import useContentStore from '@/store/contentStore';
import VoiceRecorder from '@/components/VoiceRecorder';
import {
  detectVideoType,
  fetchVideoTranscript,
  transcribeAudio,
  getVideoThumbnail,
  isValidVideoFile,
  isValidAudioFile,
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
  const [showRecorder, setShowRecorder] = useState(false);

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

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isVideo = isValidVideoFile(file);
    const isAudio = isValidAudioFile(file);

    if (!isVideo && !isAudio) {
      alert('Please upload a valid video (mp4, webm) or audio (mp3, wav) file');
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      setMediaUrl(dataUrl);

      // Set media type based on file
      const detectedType = isVideo ? 'video' : 'audio';
      setMediaType(detectedType);
      updateNodeData(id, {
        mediaUrl: dataUrl,
        fileName: file.name,
        mediaType: detectedType,
      });

      // Auto-process audio files
      if (isAudio) {
        await handleProcessAudio(file);
      }
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
    } catch (error) {
      updateContent(id, { status: 'error' });
    } finally {
      setIsProcessing(false);
    }
  }, [mediaUrl, id, videoType, addContent, updateContent, updateNodeData]);

  const handleProcessAudio = useCallback(async (file: File | Blob, fileName?: string) => {
    setIsProcessing(true);
    const name = fileName || (file instanceof File ? file.name : 'voice-recording.webm');

    addContent(id, {
      id,
      type: 'audio',
      fileName: name,
      status: 'processing',
    });

    try {
      const transcript = await transcribeAudio(file, name);

      updateContent(id, {
        status: 'completed',
        transcript,
        summary: `Audio transcribed from ${name}`,
      });
    } catch (error) {
      updateContent(id, { status: 'error' });
    } finally {
      setIsProcessing(false);
    }
  }, [id, addContent, updateContent, updateNodeData]);

  const handleRecordingComplete = useCallback((audioBlob: Blob, duration: number) => {
    const reader = new FileReader();
    reader.onload = async (e) => {
      const dataUrl = e.target?.result as string;
      const fileName = `voice-note-${Date.now()}.webm`;

      setMediaUrl(dataUrl);
      setMediaType('audio');
      updateNodeData(id, {
        mediaUrl: dataUrl,
        fileName,
        mediaType: 'audio',
        recordingDuration: duration,
      });

      setShowRecorder(false);

      // Auto-process the recording
      await handleProcessAudio(audioBlob, fileName);
    };
    reader.readAsDataURL(audioBlob);
  }, [id, updateNodeData, handleProcessAudio]);

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
            <Sparkles size={14} className="text-green-500" />
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

      {!showRecorder ? (
        <div className="space-y-2 mb-2">
          <input
            type="text"
            value={mediaUrl}
            onChange={handleMediaUrlChange}
            placeholder={`Paste ${mediaType} URL (YouTube, TikTok, IG, Loom, FB...)...`}
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <label className="block">
            <input
              type="file"
              accept={mediaType === 'video' ? 'video/mp4,video/webm,video/ogg' : 'audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/webm'}
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-full p-2 border border-dashed rounded text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Upload size={16} className="inline mr-2" />
              <span className="text-sm">Upload {mediaType} file</span>
            </div>
          </label>

          {/* Voice Recording Button */}
          {mediaType === 'audio' && (
            <button
              onClick={() => setShowRecorder(true)}
              className="w-full flex items-center justify-center gap-2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:from-purple-600 hover:to-pink-600 transition-all"
            >
              <Mic size={16} />
              <span className="text-sm font-medium">Record Voice Note</span>
            </button>
          )}
        </div>
      ) : (
        <div className="mb-2">
          <VoiceRecorder
            onRecordingComplete={handleRecordingComplete}
            onCancel={() => setShowRecorder(false)}
          />
        </div>
      )}

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

      <Handle type="source" position={Position.Right} className="w-2 h-2" />
    </div>
  );
}

export default memo(MediaNode);
