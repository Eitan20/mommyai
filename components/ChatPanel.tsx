"use client";

import { useState, useRef, useEffect } from 'react';
import {
  Send,
  Bot,
  User,
  Sparkles,
  ChevronDown,
  Loader,
  X,
  Trash2,
} from 'lucide-react';
import useWhiteboardStore from '@/store/whiteboardStore';
import useContentStore from '@/store/contentStore';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface ChatPanelProps {
  boardId: string;
  onClose: () => void;
}

const AI_MODELS = [
  { id: 'gpt-4', name: 'GPT-4', description: 'Most capable, best for complex tasks' },
  { id: 'gpt-3.5', name: 'GPT-3.5 Turbo', description: 'Fast and efficient' },
  { id: 'claude-3', name: 'Claude 3', description: 'Excellent for analysis' },
  { id: 'gemini', name: 'Gemini Pro', description: 'Google\'s latest model' },
];

export default function ChatPanel({ boardId, onClose }: ChatPanelProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content:
        'Hi! I\'m your AI assistant. I can help you:\n\n• Generate ideas and content\n• Organize your board\n• Create nodes and connections\n• Suggest templates\n\nWhat can I help you with?',
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedModel, setSelectedModel] = useState(AI_MODELS[0]);
  const [showModelSelector, setShowModelSelector] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { addNode, nodes } = useWhiteboardStore();
  const { getAllContents, getAllProcessedText } = useContentStore();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Simulate AI processing (replace with actual API call)
    setTimeout(() => {
      const lowerInput = input.toLowerCase();
      const allContents = getAllContents();
      const processedText = getAllProcessedText();
      let aiResponse = '';

      // Check for multi-modal content queries
      if (lowerInput.includes('video') && lowerInput.includes('what') || lowerInput.includes('analyze') && allContents.length > 0) {
        const videos = allContents.filter(c => c.type === 'video' && c.status === 'completed');
        const images = allContents.filter(c => c.type === 'image' && c.status === 'completed');
        const docs = allContents.filter(c => c.type === 'document' && c.status === 'completed');
        const audio = allContents.filter(c => c.type === 'audio' && c.status === 'completed');

        aiResponse = `📊 **Multi-Modal Content Analysis**\n\n`;

        if (videos.length > 0) {
          aiResponse += `🎥 **Videos (${videos.length})**:\n`;
          videos.forEach(v => {
            aiResponse += `• ${v.metadata?.platform || 'Video'}: ${v.summary || 'Transcribed and analyzed'}\n`;
          });
          aiResponse += '\n';
        }

        if (images.length > 0) {
          aiResponse += `🖼️ **Images (${images.length})**:\n`;
          images.forEach(img => {
            aiResponse += `• ${img.caption || 'Image analyzed'}\n`;
          });
          aiResponse += '\n';
        }

        if (docs.length > 0) {
          aiResponse += `📄 **Documents (${docs.length})**:\n`;
          docs.forEach(doc => {
            aiResponse += `• ${doc.fileName}: ${doc.metadata?.pageCount || 0} pages extracted\n`;
          });
          aiResponse += '\n';
        }

        if (audio.length > 0) {
          aiResponse += `🎵 **Audio (${audio.length})**:\n`;
          audio.forEach(a => {
            aiResponse += `• ${a.fileName}: Transcribed\n`;
          });
          aiResponse += '\n';
        }

        if (processedText) {
          aiResponse += `\nAll content has been processed and is available for analysis. I can:\n• Answer questions about the content\n• Find connections between different media\n• Summarize key points\n• Generate insights\n\nWhat would you like to know?`;
        }
      } else if ((lowerInput.includes('summarize') || lowerInput.includes('summary')) && processedText) {
        const allContents = getAllContents();
        const contentTypes = allContents.map(c => c.type).join(', ');

        aiResponse = `📋 **Comprehensive Summary**\n\nI've analyzed ${allContents.length} pieces of content (${contentTypes}):\n\n`;

        allContents.forEach((content, idx) => {
          if (content.status === 'completed') {
            aiResponse += `${idx + 1}. **${content.type.toUpperCase()}**: ${content.summary || content.caption || content.extractedText?.substring(0, 100) + '...'}\n`;
            if (content.keyPoints && content.keyPoints.length > 0) {
              aiResponse += `   Key points:\n`;
              content.keyPoints.slice(0, 3).forEach(point => {
                aiResponse += `   • ${point}\n`;
              });
            }
            aiResponse += '\n';
          }
        });

        aiResponse += `Would you like me to:\n• Dive deeper into any specific content?\n• Find connections between these items?\n• Generate additional insights?`;
      } else if (lowerInput.includes('create') || lowerInput.includes('add')) {
        if (lowerInput.includes('text')) {
          addNode('text', { x: 200, y: 200 }, { content: 'AI Generated Text' });
          aiResponse = '✅ Created a text node for you! You can find it on your canvas.';
        } else if (lowerInput.includes('image')) {
          addNode('image', { x: 200, y: 200 });
          aiResponse = '✅ Added an image node. You can paste your image URL to display it.';
        } else if (lowerInput.includes('link')) {
          addNode('link', { x: 200, y: 200 });
          aiResponse = '✅ Created a link node. Add your URL and title.';
        } else if (lowerInput.includes('brainstorm')) {
          const ideas = ['Idea 1', 'Idea 2', 'Idea 3', 'Idea 4'];
          ideas.forEach((idea, index) => {
            addNode(
              'text',
              { x: 150 + (index % 2) * 300, y: 150 + Math.floor(index / 2) * 200 },
              { content: idea, backgroundColor: '#e0f2fe' }
            );
          });
          aiResponse = '✅ Created a brainstorming template with 4 idea nodes!';
        } else {
          aiResponse = 'I can create various types of nodes:\n\n• Text nodes\n• Image nodes\n• Link nodes\n• Media nodes\n• Group containers\n\nWhat would you like to add?';
        }
      } else if (lowerInput.includes('organize') || lowerInput.includes('arrange')) {
        aiResponse = `I can see you have ${nodes.length} nodes on your board. Here are some organization tips:\n\n1. **Group related items**: Select multiple nodes and group them\n2. **Use colors**: Color-code nodes by category\n3. **Create hierarchy**: Use connections to show relationships\n4. **Templates**: Try a mind map or kanban template\n\nWould you like me to help with a specific organization pattern?`;
      } else if (lowerInput.includes('help') || lowerInput.includes('what can you do')) {
        const processedCount = allContents.filter(c => c.status === 'completed').length;

        aiResponse = `I'm powered by ${selectedModel.name} and can assist you with:\n\n🎨 **Content Creation**\n• Generate text, ideas, and content\n• Add images, links, and media\n• Create structured templates\n\n📊 **Multi-Modal Analysis** ${processedCount > 0 ? `(${processedCount} items processed)` : ''}\n• Analyze videos (YouTube, TikTok, IG, etc.)\n• Transcribe audio and video\n• Extract text from PDFs\n• Caption and analyze images\n• Find insights across all media\n\n💡 **Ideas & Brainstorming**\n• Generate creative ideas\n• Expand on concepts\n• Create mind maps\n\n🔍 **Intelligence**\n• Answer questions about uploaded content\n• Summarize and synthesize information\n• Find connections between different media\n\nJust ask me what you need!`;
      } else {
        aiResponse = `I understand you're interested in "${input}". I can help you:\n\n• Create nodes related to this topic\n• Generate ideas and expand on concepts\n• Organize your thoughts into a structured layout\n\nWhat would you like me to do?`;
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1000);
  };

  const handleClearChat = () => {
    if (confirm('Clear all messages?')) {
      setMessages([
        {
          id: '1',
          role: 'assistant',
          content: 'Chat cleared. How can I help you?',
          timestamp: new Date(),
        },
      ]);
    }
  };

  return (
    <div className="w-96 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
              <Bot size={20} className="text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-gray-900 dark:text-white">
                AI Assistant
              </h2>
              <p className="text-xs text-gray-500 dark:text-gray-400">
                Powered by AI
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={handleClearChat}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
              title="Clear chat"
            >
              <Trash2 size={16} className="text-gray-600 dark:text-gray-400" />
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Model Selector */}
        <div className="relative">
          <button
            onClick={() => setShowModelSelector(!showModelSelector)}
            className="w-full flex items-center justify-between px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            <div className="flex items-center gap-2">
              <Sparkles size={16} className="text-purple-500" />
              <span className="text-sm font-medium">{selectedModel.name}</span>
            </div>
            <ChevronDown size={16} />
          </button>

          {showModelSelector && (
            <div className="absolute top-full mt-2 left-0 right-0 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 py-2 z-50">
              {AI_MODELS.map((model) => (
                <button
                  key={model.id}
                  onClick={() => {
                    setSelectedModel(model);
                    setShowModelSelector(false);
                  }}
                  className={`w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors ${
                    selectedModel.id === model.id
                      ? 'bg-purple-50 dark:bg-purple-900/20'
                      : ''
                  }`}
                >
                  <div className="font-medium text-sm text-gray-900 dark:text-white">
                    {model.name}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400">
                    {model.description}
                  </div>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div
            key={message.id}
            className={`flex gap-3 ${
              message.role === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                message.role === 'user'
                  ? 'bg-blue-500'
                  : 'bg-gradient-to-br from-purple-500 to-blue-500'
              }`}
            >
              {message.role === 'user' ? (
                <User size={16} className="text-white" />
              ) : (
                <Bot size={16} className="text-white" />
              )}
            </div>

            <div
              className={`flex-1 ${
                message.role === 'user' ? 'text-right' : ''
              }`}
            >
              <div
                className={`inline-block px-4 py-2 rounded-lg ${
                  message.role === 'user'
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white'
                }`}
              >
                <p className="text-sm whitespace-pre-line">{message.content}</p>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                {message.timestamp.toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-blue-500 flex items-center justify-center">
              <Bot size={16} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="inline-block px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700">
                <Loader size={16} className="animate-spin text-gray-600 dark:text-gray-400" />
              </div>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Ask AI to help..."
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 dark:bg-gray-700 dark:text-white"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="p-2 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          >
            <Send size={20} />
          </button>
        </div>

        <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
          Try: "Create a brainstorming template" or "Help me organize"
        </div>
      </div>
    </div>
  );
}
