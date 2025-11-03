"use client";

import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { Music, Trash2, Loader, Sparkles, FileText, Upload, Mic } from 'lucide-react';
import useWhiteboardStore, { NodeData } from '@/store/whiteboardStore';
import useContentStore from '@/store/contentStore';
import VoiceRecorder from '@/components/VoiceRecorder';
import {
  transcribeAudio,
  isValidAudioFile,
} from '@/utils/mediaProcessing';

function AudioNode({ id, data, selected }: NodeProps<NodeData>) {
  const { updateNodeData, deleteNode } = useWhiteboardStore();
  const { addContent, updateContent, getContent } = useContentStore();

  const [mediaUrl, setMediaUrl] = useState(data.mediaUrl || '');
  const [isProcessing, setIsProcessing] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showRecorder, setShowRecorder] = useState(false);

  const handleMediaUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setMediaUrl(url);
    updateNodeData(id, { mediaUrl: url });
  }, [id, updateNodeData]);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const isAudio = isValidAudioFile(file);

    if (!isAudio) {
      alert('Please upload a valid audio file (mp3, wav)');
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

      // Auto-process audio files
      await handleProcessAudio(file);
    };
    reader.readAsDataURL(file);
  }, [id, updateNodeData]);

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

      updateNodeData(id, { processed: true });
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
      updateNodeData(id, {
        mediaUrl: dataUrl,
        fileName,
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
        width: data.width || 300,
        height: data.height || 250,
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

      {/* Purple header bar for Audio Node */}
      <div className="flex items-center justify-between mb-2 -mx-4 -mt-3 px-4 py-2 rounded-t-lg" style={{ backgroundColor: '#8b5cf6' }}>
        <div className="flex items-center gap-2">
          <Music size={16} className="text-white" />
          <span className="font-semibold text-sm text-white">Audio</span>
          {content?.status === 'completed' && (
            <Sparkles size={14} className="text-white" title="Processed" />
          )}
        </div>
        <button
          onClick={handleDelete}
          className="p-1 hover:bg-purple-600 rounded transition-colors"
        >
          <Trash2 size={14} className="text-white" />
        </button>
      </div>

      {!showRecorder ? (
        <div className="space-y-2 mb-2">
          <input
            type="text"
            value={mediaUrl}
            onChange={handleMediaUrlChange}
            placeholder="Paste audio URL..."
            className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
          />
          <label className="block">
            <input
              type="file"
              accept="audio/mp3,audio/mpeg,audio/wav,audio/ogg,audio/webm"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="w-full p-2 border border-dashed rounded text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Upload size={16} className="inline mr-2" />
              <span className="text-sm">Upload audio file</span>
            </div>
          </label>

          {/* Voice Recording Button */}
          <button
            onClick={() => setShowRecorder(true)}
            className="w-full flex items-center justify-center gap-2 p-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded hover:from-purple-600 hover:to-pink-600 transition-all"
          >
            <Mic size={16} />
            <span className="text-sm font-medium">Record Voice Note</span>
          </button>
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
          <div className="w-full bg-gray-100 dark:bg-gray-800 rounded overflow-hidden p-2">
            <audio
              src={data.mediaUrl}
              controls
              className="w-full"
            >
              Your browser does not support the audio tag.
            </audio>
          </div>

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

          {isProcessing && (
            <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Loader size={16} className="animate-spin text-purple-600" />
              <span className="text-sm text-purple-600 dark:text-purple-400">
                Transcribing...
              </span>
            </div>
          )}
        </div>
      )}

      <Handle type="source" position={Position.Right} className="w-2 h-2" />
    </div>
  );
}

export default memo(AudioNode);
