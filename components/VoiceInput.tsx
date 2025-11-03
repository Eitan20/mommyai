"use client";

import { useState, useCallback, useRef, useEffect } from 'react';
import { Mic, Square } from 'lucide-react';

interface VoiceInputProps {
  onTranscript: (text: string) => void;
  isRecording: boolean;
  onRecordingChange: (recording: boolean) => void;
}

export default function VoiceInput({ onTranscript, isRecording, onRecordingChange }: VoiceInputProps) {
  const [mediaRecorder, setMediaRecorder] = useState<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, {
        mimeType: 'audio/webm',
      });

      chunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/webm' });

        // Simulate transcription (replace with actual API call)
        setTimeout(() => {
          onTranscript('Voice input transcription would appear here...');
        }, 500);

        // Stop all tracks
        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      setMediaRecorder(recorder);
      onRecordingChange(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  }, [onTranscript, onRecordingChange]);

  const stopRecording = useCallback(() => {
    if (mediaRecorder && mediaRecorder.state !== 'inactive') {
      mediaRecorder.stop();
      setMediaRecorder(null);
      onRecordingChange(false);
    }
  }, [mediaRecorder, onRecordingChange]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  return (
    <button
      onClick={toggleRecording}
      className={`p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors ${
        isRecording ? 'bg-red-100 dark:bg-red-900/20 animate-pulse' : ''
      }`}
      title={isRecording ? 'Stop recording' : 'Voice input'}
    >
      {isRecording ? (
        <Square size={16} className="text-red-500" />
      ) : (
        <Mic size={16} className="text-gray-600 dark:text-gray-400" />
      )}
    </button>
  );
}
