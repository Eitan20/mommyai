// Multi-modal content processing utilities for Mommy AI

export interface ProcessedContent {
  id: string;
  type: 'video' | 'audio' | 'image' | 'document';
  originalUrl?: string;
  fileName?: string;
  status: 'processing' | 'completed' | 'error';

  // Extracted data
  transcript?: string;
  caption?: string;
  extractedText?: string;
  metadata?: {
    duration?: number;
    title?: string;
    author?: string;
    platform?: string;
    pageCount?: number;
    dimensions?: { width: number; height: number };
  };

  // AI analysis
  summary?: string;
  keyPoints?: string[];
  sentiment?: 'positive' | 'negative' | 'neutral';
  topics?: string[];
}

// Video URL detection and parsing
export const detectVideoType = (url: string): string | null => {
  if (url.includes('youtube.com') || url.includes('youtu.be')) return 'youtube';
  if (url.includes('tiktok.com')) return 'tiktok';
  if (url.includes('instagram.com')) return 'instagram';
  if (url.includes('vimeo.com')) return 'vimeo';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
  if (url.includes('facebook.com')) return 'facebook';
  return null;
};

// Extract YouTube video ID
export const getYouTubeVideoId = (url: string): string | null => {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/,
    /youtube\.com\/embed\/([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Extract TikTok video ID
export const getTikTokVideoId = (url: string): string | null => {
  const match = url.match(/tiktok\.com\/.*\/video\/(\d+)/);
  return match ? match[1] : null;
};

// Extract Instagram Reel ID
export const getInstagramReelId = (url: string): string | null => {
  const match = url.match(/instagram\.com\/(?:reel|p)\/([^/?#&]+)/);
  return match ? match[1] : null;
};

// Simulate video transcription (in production, use Whisper API or similar)
export const transcribeVideo = async (videoUrl: string): Promise<string> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));

  const platform = detectVideoType(videoUrl);
  return `[Transcription from ${platform || 'video'}]\n\nThis is a simulated transcription of the video content. In production, this would use Whisper API or similar service to transcribe the actual audio from the video.\n\nKey points discussed:\n- Topic 1: Introduction and overview\n- Topic 2: Main content and discussion\n- Topic 3: Conclusion and takeaways`;
};

// Simulate audio transcription
export const transcribeAudio = async (audioFile: File): Promise<string> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));

  return `[Audio Transcription]\n\nTranscribed content from ${audioFile.name}.\n\nThis would contain the actual transcription using Whisper API or similar service.\n\nSpeaker: [Detected speaker]\nDuration: ${Math.round(audioFile.size / 16000)} seconds (estimated)`;
};

// Simulate image captioning and analysis
export const analyzeImage = async (imageUrl: string): Promise<{
  caption: string;
  objects: string[];
  text?: string;
}> => {
  // Simulate API call (would use GPT-4 Vision or similar)
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    caption: 'A visual representation showing various elements and composition. This image contains meaningful content that can be analyzed and discussed.',
    objects: ['object1', 'object2', 'background', 'text elements'],
    text: 'Any text detected in the image would appear here (OCR)',
  };
};

// Extract text from PDF
export const extractPDFText = async (file: File): Promise<{
  text: string;
  pageCount: number;
  pages: { pageNum: number; text: string }[];
}> => {
  // This would use pdf.js in production
  await new Promise(resolve => setTimeout(resolve, 2000));

  return {
    text: `Full extracted text from ${file.name}\n\nPage 1 content...\nPage 2 content...\n\nThis would contain the actual PDF text extraction using pdf.js library.`,
    pageCount: 5,
    pages: [
      { pageNum: 1, text: 'Page 1 content...' },
      { pageNum: 2, text: 'Page 2 content...' },
      { pageNum: 3, text: 'Page 3 content...' },
    ],
  };
};

// AI summary generation for any content
export const generateSummary = async (content: string, type: string): Promise<{
  summary: string;
  keyPoints: string[];
  topics: string[];
}> => {
  // Simulate AI summarization
  await new Promise(resolve => setTimeout(resolve, 1500));

  return {
    summary: `This ${type} discusses several important topics. The main theme revolves around [key concept]. Key insights include practical applications and theoretical frameworks.`,
    keyPoints: [
      'Main point 1: Introduction of core concepts',
      'Main point 2: Detailed analysis and examples',
      'Main point 3: Practical applications',
      'Main point 4: Conclusions and future directions',
    ],
    topics: ['topic1', 'topic2', 'topic3', 'analysis', 'insights'],
  };
};

// Get video thumbnail
export const getVideoThumbnail = (url: string): string | null => {
  const videoId = getYouTubeVideoId(url);
  if (videoId) {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }
  return null;
};

// Validate file type
export const validateFileType = (file: File, allowedTypes: string[]): boolean => {
  return allowedTypes.some(type => file.type.startsWith(type));
};

// Format file size
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

// Check if URL is valid
export const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};
