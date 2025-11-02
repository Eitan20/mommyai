"use client";

import { useCallback, useState } from 'react';
import { Upload, FileVideo, FileAudio, Image as ImageIcon, FileText } from 'lucide-react';
import { getFileCategory } from '@/utils/mediaProcessing';

interface MediaDropZoneProps {
  onFileDrop: (file: File, category: 'image' | 'video' | 'audio' | 'document') => void;
  acceptedTypes?: string[];
  className?: string;
}

export default function MediaDropZone({
  onFileDrop,
  acceptedTypes = ['image/*', 'video/*', 'audio/*', 'application/pdf'],
  className = '',
}: MediaDropZoneProps) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        const file = files[0]; // Handle first file
        const category = getFileCategory(file);

        if (category !== 'unknown') {
          onFileDrop(file, category);
        } else {
          alert('Unsupported file type. Please upload images, videos, audio, or PDF files.');
        }
      }
    },
    [onFileDrop]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        const file = files[0];
        const category = getFileCategory(file);

        if (category !== 'unknown') {
          onFileDrop(file, category);
        } else {
          alert('Unsupported file type. Please upload images, videos, audio, or PDF files.');
        }
      }
    },
    [onFileDrop]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative border-2 border-dashed rounded-lg transition-all ${
        isDragging
          ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
          : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'
      } ${className}`}
    >
      <label className="cursor-pointer block">
        <input
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileInput}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center p-8 space-y-4">
          {/* Icon */}
          <div className="flex gap-3">
            <ImageIcon size={32} className="text-green-500" />
            <FileVideo size={32} className="text-blue-500" />
            <FileAudio size={32} className="text-purple-500" />
            <FileText size={32} className="text-orange-500" />
          </div>

          {/* Main Text */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center gap-2">
              <Upload size={24} className="text-gray-400" />
              <h3 className="text-lg font-semibold text-gray-700 dark:text-gray-300">
                {isDragging ? 'Drop to upload' : 'Drag & drop files here'}
              </h3>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              or click to browse
            </p>
          </div>

          {/* Supported Files */}
          <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-500 dark:text-gray-400">
            <span className="px-2 py-1 bg-green-100 dark:bg-green-900 rounded">Images</span>
            <span className="px-2 py-1 bg-blue-100 dark:bg-blue-900 rounded">Videos (MP4)</span>
            <span className="px-2 py-1 bg-purple-100 dark:bg-purple-900 rounded">Audio (MP3)</span>
            <span className="px-2 py-1 bg-orange-100 dark:bg-orange-900 rounded">Documents (PDF)</span>
          </div>

          {/* Additional Info */}
          <p className="text-xs text-gray-400 dark:text-gray-500 text-center max-w-sm">
            Files will be automatically analyzed: images captioned, videos/audio transcribed, PDFs extracted
          </p>
        </div>
      </label>

      {/* Drag Overlay */}
      {isDragging && (
        <div className="absolute inset-0 bg-blue-500/10 rounded-lg pointer-events-none flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 px-6 py-3 rounded-lg shadow-xl">
            <p className="text-blue-600 dark:text-blue-400 font-semibold">Drop file to upload</p>
          </div>
        </div>
      )}
    </div>
  );
}
