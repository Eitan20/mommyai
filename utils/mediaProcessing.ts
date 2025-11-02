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
  if (url.includes('loom.com')) return 'loom';
  if (url.includes('facebook.com') || url.includes('fb.watch')) return 'facebook';
  if (url.includes('vimeo.com')) return 'vimeo';
  if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
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

// Extract Loom video ID
export const getLoomVideoId = (url: string): string | null => {
  const match = url.match(/loom\.com\/share\/([^/?#&]+)/);
  return match ? match[1] : null;
};

// Extract Facebook video ID
export const getFacebookVideoId = (url: string): string | null => {
  const patterns = [
    /facebook\.com\/.*\/videos\/(\d+)/,
    /fb\.watch\/([^/?#&]+)/,
    /facebook\.com\/watch\/\?v=(\d+)/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
};

// Fetch transcript from video URL
export const fetchVideoTranscript = async (videoUrl: string): Promise<{
  transcript: string;
  title?: string;
  author?: string;
  duration?: number;
}> => {
  const platform = detectVideoType(videoUrl);

  // In production, call actual APIs for each platform
  // For now, simulating with platform-specific responses
  await new Promise(resolve => setTimeout(resolve, 2000));

  switch (platform) {
    case 'youtube':
      const ytId = getYouTubeVideoId(videoUrl);
      // Production: Use YouTube Transcript API or youtube-transcript npm package
      return {
        transcript: `[YouTube Video Transcript]\n\nVideo ID: ${ytId}\n\nThis is a simulated transcript from YouTube. In production, use:\n- YouTube Transcript API\n- youtube-transcript npm package\n- Or extract from YouTube's built-in captions\n\nSample content:\nSpeaker: Welcome to this video about...\n[00:15] Let me explain the main concepts...\n[01:30] Here are the key takeaways...`,
        title: 'YouTube Video Title',
        author: 'Channel Name',
        duration: 180,
      };

    case 'tiktok':
      const ttId = getTikTokVideoId(videoUrl);
      // Production: Use TikTok API or third-party scraping services
      return {
        transcript: `[TikTok Video Transcript]\n\nVideo ID: ${ttId}\n\nThis is a simulated transcript from TikTok. In production:\n- Use TikTok API (if available)\n- Third-party services like RapidAPI TikTok scrapers\n- Audio extraction + Whisper API\n\nSample content:\n[Short-form video content]\n[Background music]\n[Voice overlay describing...]`,
        title: 'TikTok Video',
        duration: 45,
      };

    case 'instagram':
      const igId = getInstagramReelId(videoUrl);
      // Production: Use Instagram Graph API or third-party services
      return {
        transcript: `[Instagram Reel Transcript]\n\nReel ID: ${igId}\n\nThis is a simulated transcript from Instagram. In production:\n- Instagram Graph API (requires app approval)\n- Third-party services\n- Audio extraction + Whisper API\n\nSample content:\n[Reel content description]\n[Audio track]\n[Caption overlay text]`,
        title: 'Instagram Reel',
        duration: 60,
      };

    case 'loom':
      const loomId = getLoomVideoId(videoUrl);
      // Production: Use Loom API
      return {
        transcript: `[Loom Video Transcript]\n\nLoom ID: ${loomId}\n\nThis is a simulated transcript from Loom. In production:\n- Loom API (https://dev.loom.com)\n- Loom provides built-in transcription\n- Access via API with authentication\n\nSample content:\nPresenter: Let me show you how this works...\n[Screen recording narration]\n[Step-by-step walkthrough]`,
        title: 'Loom Screen Recording',
        duration: 300,
      };

    case 'facebook':
      const fbId = getFacebookVideoId(videoUrl);
      // Production: Use Facebook Graph API
      return {
        transcript: `[Facebook Video Transcript]\n\nVideo ID: ${fbId}\n\nThis is a simulated transcript from Facebook. In production:\n- Facebook Graph API\n- Requires app tokens and permissions\n- Audio extraction + Whisper API\n\nSample content:\n[Video description]\n[Spoken content]\n[User comments and reactions]`,
        title: 'Facebook Video',
        duration: 120,
      };

    default:
      return {
        transcript: `[Video Transcript]\n\nGeneric video transcription. In production:\n- Download video\n- Extract audio with ffmpeg\n- Transcribe with Whisper API\n\nSample content:\nThis is the transcribed content...`,
      };
  }
};

// Simulate video transcription (in production, use Whisper API or similar)
export const transcribeVideo = async (videoUrl: string): Promise<string> => {
  const result = await fetchVideoTranscript(videoUrl);
  return result.transcript;
};

// Simulate audio transcription
export const transcribeAudio = async (audioFile: File | Blob, fileName?: string): Promise<string> => {
  // Simulate API call
  await new Promise(resolve => setTimeout(resolve, 2000));

  const name = fileName || (audioFile instanceof File ? audioFile.name : 'recording.webm');
  const duration = audioFile instanceof File ? Math.round(audioFile.size / 16000) : 30;

  return `[Audio Transcription]\n\nTranscribed content from ${name}.\n\nThis would contain the actual transcription using Whisper API or similar service.\n\nIn production:\n- Send audio file to OpenAI Whisper API\n- Receive transcript with timestamps\n- Support for 99+ languages\n- Speaker diarization available\n\nSample transcript:\nSpeaker: [Recording starts]\n[00:00] This is a voice note recording...\n[00:15] Important points mentioned include...\n[00:30] Conclusion and summary...\n\nDuration: ${duration} seconds (estimated)`;
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

// Validate media file types
export const isValidImageFile = (file: File): boolean => {
  const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];
  return validTypes.includes(file.type);
};

export const isValidVideoFile = (file: File): boolean => {
  const validTypes = ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'];
  return validTypes.includes(file.type);
};

export const isValidAudioFile = (file: File): boolean => {
  const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/ogg', 'audio/webm', 'audio/mp4'];
  return validTypes.includes(file.type);
};

export const isValidDocumentFile = (file: File): boolean => {
  const validTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'text/plain'];
  return validTypes.includes(file.type);
};

// Get file type category
export const getFileCategory = (file: File): 'image' | 'video' | 'audio' | 'document' | 'unknown' => {
  if (isValidImageFile(file)) return 'image';
  if (isValidVideoFile(file)) return 'video';
  if (isValidAudioFile(file)) return 'audio';
  if (isValidDocumentFile(file)) return 'document';
  return 'unknown';
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
