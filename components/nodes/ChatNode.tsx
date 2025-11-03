"use client";

import { memo, useState, useCallback, useEffect, useRef } from 'react';
import { Handle, Position, NodeProps, NodeResizer, useReactFlow } from 'reactflow';
import {
  MessageSquare,
  Trash2,
  Plus,
  Mic,
  Search,
  Upload,
  Image as ImageIcon,
  Send,
  MoreVertical,
  X,
  Square,
  Loader,
} from 'lucide-react';
import useWhiteboardStore, { NodeData } from '@/store/whiteboardStore';
import useChatStore from '@/store/chatStore';
import useContentStore from '@/store/contentStore';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

function ChatNode({ id, data, selected }: NodeProps<NodeData>) {
  const { updateNodeData, deleteNode } = useWhiteboardStore();
  const {
    conversations,
    createConversation,
    setActiveConversation,
    addMessage,
    deleteConversation,
    updateConversationTitle,
    updateConnectedNodes,
  } = useChatStore();

  const { getContent } = useContentStore();
  const { getEdges, getNode } = useReactFlow();

  const [currentConversationId, setCurrentConversationId] = useState<string | null>(
    data.conversationId || null
  );
  const [inputMessage, setInputMessage] = useState('');
  const [showConversations, setShowConversations] = useState(false);
  const [selectedModel, setSelectedModel] = useState(data.model || 'gpt-4');
  const [isRecording, setIsRecording] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  // Get current conversation
  const conversation = currentConversationId
    ? conversations[currentConversationId]
    : null;

  // Get connected nodes for context
  useEffect(() => {
    if (!currentConversationId) return;

    const edges = getEdges();
    const connectedNodeIds = edges
      .filter((edge) => edge.target === id)
      .map((edge) => edge.source);

    updateConnectedNodes(currentConversationId, connectedNodeIds);
  }, [currentConversationId, id, getEdges, updateConnectedNodes]);

  // Auto-scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages]);

  // Initialize with a conversation if none exists
  useEffect(() => {
    if (!currentConversationId) {
      const newId = createConversation(id, 'AI Assistant');
      setCurrentConversationId(newId);
      updateNodeData(id, { conversationId: newId });
    }
  }, [currentConversationId, id, createConversation, updateNodeData]);

  const handleNewConversation = useCallback(() => {
    const newId = createConversation(id, 'New Conversation');
    setCurrentConversationId(newId);
    setActiveConversation(newId);
    updateNodeData(id, { conversationId: newId });
    setShowConversations(false);
  }, [id, createConversation, setActiveConversation, updateNodeData]);

  const handleSelectConversation = useCallback((convId: string) => {
    setCurrentConversationId(convId);
    setActiveConversation(convId);
    updateNodeData(id, { conversationId: convId });
    setShowConversations(false);
  }, [id, setActiveConversation, updateNodeData]);

  const handleDeleteConversation = useCallback((convId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    deleteConversation(convId);
    if (currentConversationId === convId) {
      const remaining = Object.keys(conversations).filter((cid) => cid !== convId);
      if (remaining.length > 0) {
        handleSelectConversation(remaining[0]);
      } else {
        handleNewConversation();
      }
    }
  }, [currentConversationId, conversations, deleteConversation, handleSelectConversation, handleNewConversation]);

  const gatherContextFromNodes = useCallback(() => {
    if (!currentConversationId) return '';

    const edges = getEdges();
    const connectedNodeIds = edges
      .filter((edge) => edge.target === id)
      .map((edge) => edge.source);

    let context = '';
    connectedNodeIds.forEach((nodeId) => {
      const node = getNode(nodeId);
      const content = getContent(nodeId);

      if (node && content?.transcript) {
        context += `\n\n[From ${node.type} node: ${node.data.label || node.type}]\n${content.transcript}`;
      } else if (node?.data.content) {
        context += `\n\n[From ${node.type} node: ${node.data.label || node.type}]\n${node.data.content}`;
      }
    });

    return context;
  }, [currentConversationId, id, getEdges, getNode, getContent]);

  const handleSendMessage = useCallback(async () => {
    if (!inputMessage.trim() || !currentConversationId) return;

    const context = gatherContextFromNodes();
    const fullMessage = context
      ? `${inputMessage}\n\nContext from connected nodes:${context}`
      : inputMessage;

    // Add user message
    addMessage(currentConversationId, {
      role: 'user',
      content: inputMessage,
    });

    setInputMessage('');

    // Simulate AI response (replace with actual API call)
    setTimeout(() => {
      addMessage(currentConversationId, {
        role: 'assistant',
        content: `I received your message: "${inputMessage}". ${context ? 'I also have context from the connected nodes.' : ''}`,
      });
    }, 1000);
  }, [inputMessage, currentConversationId, addMessage, gatherContextFromNodes]);

  const handleSuggestedPrompt = useCallback((prompt: string) => {
    setInputMessage(prompt);
  }, []);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  }, [id, deleteNode]);

  // Voice recording functions
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const recorder = new MediaRecorder(stream, { mimeType: 'audio/webm' });

      audioChunksRef.current = [];

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      recorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });

        // Simulate transcription (replace with actual API call)
        setTimeout(() => {
          const transcribedText = 'Voice input transcription would appear here...';
          setInputMessage(prev => prev ? `${prev} ${transcribedText}` : transcribedText);
        }, 500);

        stream.getTracks().forEach(track => track.stop());
      };

      recorder.start();
      mediaRecorderRef.current = recorder;
      setIsRecording(true);
    } catch (error) {
      console.error('Error starting recording:', error);
      alert('Could not access microphone. Please check permissions.');
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current = null;
      setIsRecording(false);
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  // Search internet function
  const handleSearchInternet = useCallback(async () => {
    if (!inputMessage.trim() || !currentConversationId) return;

    setIsSearching(true);

    // Add user message
    addMessage(currentConversationId, {
      role: 'user',
      content: `🔍 Search: ${inputMessage}`,
    });

    // Simulate search (replace with actual API call)
    setTimeout(() => {
      addMessage(currentConversationId, {
        role: 'assistant',
        content: `Search results for "${inputMessage}":\n\n1. Example result 1\n2. Example result 2\n3. Example result 3\n\n(This would be replaced with actual search results)`,
      });
      setIsSearching(false);
      setInputMessage('');
    }, 1500);
  }, [inputMessage, currentConversationId, addMessage]);

  // Image upload function
  const handleImageUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !currentConversationId) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload a valid image file');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const imageUrl = e.target?.result as string;

      addMessage(currentConversationId, {
        role: 'user',
        content: inputMessage || '📷 Uploaded an image',
        imageUrl,
      });

      setInputMessage('');
    };

    reader.readAsDataURL(file);
  }, [currentConversationId, inputMessage, addMessage]);

  // Image generation function
  const handleGenerateImage = useCallback(async () => {
    if (!inputMessage.trim() || !currentConversationId) return;

    setIsGeneratingImage(true);

    // Add user message
    addMessage(currentConversationId, {
      role: 'user',
      content: `🎨 Generate image: ${inputMessage}`,
    });

    // Simulate image generation (replace with actual API call)
    setTimeout(() => {
      addMessage(currentConversationId, {
        role: 'assistant',
        content: `Generated image for: "${inputMessage}"`,
        imageUrl: 'https://via.placeholder.com/400x300?text=Generated+Image',
      });
      setIsGeneratingImage(false);
      setInputMessage('');
    }, 2000);
  }, [inputMessage, currentConversationId, addMessage]);

  const suggestedPrompts = [
    { icon: '✉️', text: 'Create me an email' },
    { icon: '📝', text: 'Summarize' },
    { icon: '💡', text: 'Key insights' },
  ];

  const models = [
    { id: 'gpt-4', name: 'GPT-4' },
    { id: 'gpt-3.5', name: 'GPT-3.5' },
    { id: 'claude-3', name: 'Claude 3' },
    { id: 'gemini', name: 'Gemini' },
  ];

  return (
    <div
      className={cn(
        "rounded-lg shadow-lg min-w-[400px] border-2 flex flex-col bg-card",
        selected && "border-purple-400"
      )}
      style={{
        height: data.height || 500,
      }}
    >
      <NodeResizer
        minWidth={400}
        minHeight={500}
        isVisible={selected}
        lineClassName="border-purple-400"
        handleClassName="h-3 w-3 bg-white border-2 border-purple-400"
      />
      <Handle type="target" position={Position.Left} className="w-2 h-2" />

      {/* Purple gradient header for Chat Node */}
      <div className="flex items-center justify-between px-4 py-2 rounded-t-lg bg-gradient-to-r from-purple-500 to-pink-500">
        <div className="flex items-center gap-2">
          <MessageSquare size={16} className="text-white" />
          <span className="font-semibold text-sm text-white">AI Chat</span>
        </div>
        <div className="flex gap-1">
          <Button
            onClick={handleNewConversation}
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-purple-600"
            title="New Conversation"
          >
            <Plus size={14} className="text-white" />
          </Button>
          <DropdownMenu open={showConversations} onOpenChange={setShowConversations}>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 hover:bg-purple-600"
                title="Conversations"
              >
                <MoreVertical size={14} className="text-white" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 max-h-80">
              <DropdownMenuLabel>Conversations</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {Object.values(conversations).length === 0 ? (
                <div className="p-4 text-center text-xs text-muted-foreground">
                  No conversations yet
                </div>
              ) : (
                Object.values(conversations).map((conv) => (
                  <DropdownMenuItem
                    key={conv.id}
                    className={cn(
                      "flex items-center justify-between cursor-pointer",
                      currentConversationId === conv.id && "bg-accent"
                    )}
                    onClick={() => handleSelectConversation(conv.id)}
                  >
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">{conv.title}</p>
                      <p className="text-xs text-muted-foreground">
                        {conv.messages.length} messages
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 hover:bg-destructive/10"
                      onClick={(e) => handleDeleteConversation(conv.id, e)}
                    >
                      <X size={12} className="text-destructive" />
                    </Button>
                  </DropdownMenuItem>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
          <Button
            onClick={handleDelete}
            variant="ghost"
            size="icon"
            className="h-6 w-6 hover:bg-purple-600"
          >
            <Trash2 size={14} className="text-white" />
          </Button>
        </div>
      </div>

      {/* Model selector */}
      <div className="px-4 py-2 border-b flex items-center gap-2">
        <span className="text-xs text-muted-foreground">Model:</span>
        <Select
          value={selectedModel}
          onValueChange={(value) => {
            setSelectedModel(value);
            updateNodeData(id, { model: value });
          }}
        >
          <SelectTrigger className="flex-1 h-8 text-xs">
            <SelectValue placeholder="Select model" />
          </SelectTrigger>
          <SelectContent>
            {models.map((model) => (
              <SelectItem key={model.id} value={model.id}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Messages area */}
      <ScrollArea className="flex-1 p-4">
        {!conversation || conversation.messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <MessageSquare size={48} className="text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground mb-2">
              Start a conversation
            </p>
            <p className="text-xs text-muted-foreground">
              Connect nodes to add context to your chat
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {conversation.messages.map((message) => (
              <div
                key={message.id}
                className={cn(
                  "flex",
                  message.role === 'user' ? 'justify-end' : 'justify-start'
                )}
              >
                <div
                  className={cn(
                    "max-w-[80%] rounded-lg px-3 py-2",
                    message.role === 'user'
                      ? 'bg-purple-500 text-white'
                      : 'bg-muted text-foreground'
                  )}
                >
                  <p className="text-xs whitespace-pre-wrap">{message.content}</p>
                  {message.imageUrl && (
                    <img src={message.imageUrl} alt="" className="mt-2 rounded max-w-full" />
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </ScrollArea>

      {/* Suggested prompts */}
      {(!conversation || conversation.messages.length === 0) && (
        <div className="px-4 pb-2 flex gap-2 flex-wrap">
          {suggestedPrompts.map((prompt, idx) => (
            <Button
              key={idx}
              variant="secondary"
              size="sm"
              onClick={() => handleSuggestedPrompt(prompt.text)}
              className="text-xs h-7"
            >
              {prompt.icon} {prompt.text}
            </Button>
          ))}
        </div>
      )}

      {/* Input area */}
      <div className="border-t p-3 space-y-2">
        {/* Action buttons */}
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleRecording}
            className={cn(
              "h-8 w-8",
              isRecording && "bg-red-100 dark:bg-red-900/20 animate-pulse"
            )}
            title={isRecording ? 'Stop recording' : 'Voice input'}
          >
            {isRecording ? (
              <Square size={16} className="text-red-500" />
            ) : (
              <Mic size={16} />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleSearchInternet}
            disabled={!inputMessage.trim() || isSearching}
            className="h-8 w-8"
            title="Search internet"
          >
            {isSearching ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <Search size={16} />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            className="h-8 w-8"
            title="Upload image"
          >
            <Upload size={16} />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={handleGenerateImage}
            disabled={!inputMessage.trim() || isGeneratingImage}
            className="h-8 w-8"
            title="Generate image"
          >
            {isGeneratingImage ? (
              <Loader size={16} className="animate-spin" />
            ) : (
              <ImageIcon size={16} />
            )}
          </Button>
        </div>

        {/* Input field */}
        <div className="flex gap-2">
          <Input
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 h-9"
          />
          <Button
            onClick={handleSendMessage}
            disabled={!inputMessage.trim()}
            size="icon"
            className="h-9 w-9"
          >
            <Send size={16} />
          </Button>
        </div>
      </div>

      <Handle type="source" position={Position.Right} className="w-2 h-2" />
    </div>
  );
}

export default memo(ChatNode);
