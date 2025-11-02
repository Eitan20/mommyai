"use client";

import { useState, useCallback } from 'react';
import { X, Sparkles, Send, Loader } from 'lucide-react';
import useWhiteboardStore from '@/store/whiteboardStore';

interface AIAssistPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AIAssistPanel({ isOpen, onClose }: AIAssistPanelProps) {
  const [prompt, setPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [response, setResponse] = useState('');
  const { addNode, nodes } = useWhiteboardStore();

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setResponse('');

    try {
      // Simulate AI processing (replace with actual API call)
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Generate AI response based on prompt
      let aiResponse = '';
      const lowerPrompt = prompt.toLowerCase();

      if (lowerPrompt.includes('create') || lowerPrompt.includes('add')) {
        if (lowerPrompt.includes('text')) {
          addNode('text', { x: 200, y: 200 }, { content: 'AI Generated Text' });
          aiResponse = 'Created a text node for you!';
        } else if (lowerPrompt.includes('image')) {
          addNode('image', { x: 200, y: 200 });
          aiResponse = 'Created an image node. You can add your image URL.';
        } else if (lowerPrompt.includes('link')) {
          addNode('link', { x: 200, y: 200 });
          aiResponse = 'Created a link node for you!';
        } else {
          aiResponse = 'I can help you create text, image, link, or media nodes. What would you like to add?';
        }
      } else if (lowerPrompt.includes('organize') || lowerPrompt.includes('arrange')) {
        aiResponse = `I can see you have ${nodes.length} nodes on your board. To organize them, try:\n\n1. Select multiple nodes and use "Group Selected"\n2. Arrange nodes in a grid or hierarchical layout\n3. Use different colors for different categories\n\nWould you like me to suggest a specific organization pattern?`;
      } else if (lowerPrompt.includes('brainstorm') || lowerPrompt.includes('idea')) {
        const ideas = [
          'User Research',
          'Market Analysis',
          'Feature Planning',
          'Technical Design',
          'Implementation',
          'Testing & QA',
        ];

        ideas.forEach((idea, index) => {
          addNode('text',
            { x: 150 + (index % 3) * 250, y: 150 + Math.floor(index / 3) * 150 },
            { content: idea, backgroundColor: '#e0f2fe' }
          );
        });

        aiResponse = 'Created a brainstorming template with common project phases!';
      } else {
        aiResponse = `I'm your AI assistant for the whiteboard! I can help you:\n\n• Create and organize nodes\n• Suggest layouts and structures\n• Generate brainstorming ideas\n• Auto-arrange elements\n\nWhat would you like help with?`;
      }

      setResponse(aiResponse);
    } catch (error) {
      setResponse('Sorry, I encountered an error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [prompt, addNode, nodes.length]);

  if (!isOpen) return null;

  return (
    <div className="absolute right-4 top-4 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 z-20">
      <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-purple-600" />
          <h2 className="font-semibold text-lg">AI Assist</h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded transition-colors"
        >
          <X size={20} />
        </button>
      </div>

      <div className="p-4 space-y-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Ask me to help organize your whiteboard, generate ideas, or create content!
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., 'Create a brainstorming template' or 'Help me organize my ideas'"
            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
            rows={3}
          />

          <button
            type="submit"
            disabled={isLoading || !prompt.trim()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isLoading ? (
              <>
                <Loader size={16} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>
                <Send size={16} />
                Send
              </>
            )}
          </button>
        </form>

        {response && (
          <div className="p-3 bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-800 rounded-lg">
            <p className="text-sm whitespace-pre-line">{response}</p>
          </div>
        )}

        <div className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
          <p className="font-semibold">Try asking:</p>
          <ul className="list-disc list-inside space-y-1">
            <li>Create a project planning template</li>
            <li>Help me organize these ideas</li>
            <li>Add a text/image/link node</li>
            <li>Generate brainstorming ideas</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
