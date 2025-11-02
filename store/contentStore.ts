import { create } from 'zustand';
import { ProcessedContent } from '@/utils/mediaProcessing';

interface ContentState {
  contents: Map<string, ProcessedContent>; // nodeId -> ProcessedContent

  addContent: (nodeId: string, content: ProcessedContent) => void;
  updateContent: (nodeId: string, updates: Partial<ProcessedContent>) => void;
  getContent: (nodeId: string) => ProcessedContent | undefined;
  getAllContents: () => ProcessedContent[];
  removeContent: (nodeId: string) => void;
  clearContents: () => void;

  // Get all processed text for AI context
  getAllProcessedText: () => string;
}

const useContentStore = create<ContentState>((set, get) => ({
  contents: new Map(),

  addContent: (nodeId, content) => {
    set((state) => {
      const newContents = new Map(state.contents);
      newContents.set(nodeId, content);
      return { contents: newContents };
    });
  },

  updateContent: (nodeId, updates) => {
    set((state) => {
      const newContents = new Map(state.contents);
      const existing = newContents.get(nodeId);
      if (existing) {
        newContents.set(nodeId, { ...existing, ...updates });
      }
      return { contents: newContents };
    });
  },

  getContent: (nodeId) => {
    return get().contents.get(nodeId);
  },

  getAllContents: () => {
    return Array.from(get().contents.values());
  },

  removeContent: (nodeId) => {
    set((state) => {
      const newContents = new Map(state.contents);
      newContents.delete(nodeId);
      return { contents: newContents };
    });
  },

  clearContents: () => {
    set({ contents: new Map() });
  },

  getAllProcessedText: () => {
    const contents = Array.from(get().contents.values());
    const processedTexts: string[] = [];

    contents.forEach((content) => {
      if (content.status === 'completed') {
        let text = `\n--- ${content.type.toUpperCase()}: ${content.fileName || content.originalUrl || 'Unknown'} ---\n`;

        if (content.transcript) {
          text += `Transcript:\n${content.transcript}\n`;
        }
        if (content.caption) {
          text += `Image Caption:\n${content.caption}\n`;
        }
        if (content.extractedText) {
          text += `Extracted Text:\n${content.extractedText}\n`;
        }
        if (content.summary) {
          text += `Summary:\n${content.summary}\n`;
        }
        if (content.keyPoints && content.keyPoints.length > 0) {
          text += `Key Points:\n${content.keyPoints.map(p => `- ${p}`).join('\n')}\n`;
        }

        processedTexts.push(text);
      }
    });

    return processedTexts.join('\n');
  },
}));

export default useContentStore;
