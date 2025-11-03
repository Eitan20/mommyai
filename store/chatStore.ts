import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type ChatMessage = {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: number;
  imageUrl?: string;
};

export type Conversation = {
  id: string;
  title: string;
  messages: ChatMessage[];
  createdAt: number;
  updatedAt: number;
  model?: string;
  connectedNodeIds?: string[]; // Track which nodes are connected for context
};

type ChatStore = {
  conversations: Record<string, Conversation>;
  activeConversationId: string | null;

  createConversation: (nodeId: string, title?: string) => string;
  deleteConversation: (conversationId: string) => void;
  setActiveConversation: (conversationId: string) => void;
  addMessage: (conversationId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => void;
  updateConversationTitle: (conversationId: string, title: string) => void;
  getConversation: (conversationId: string) => Conversation | undefined;
  updateConnectedNodes: (conversationId: string, nodeIds: string[]) => void;
};

const useChatStore = create<ChatStore>()(
  persist(
    (set, get) => ({
      conversations: {},
      activeConversationId: null,

      createConversation: (nodeId: string, title?: string) => {
        const id = `chat-${Date.now()}`;
        const newConversation: Conversation = {
          id,
          title: title || 'New Conversation',
          messages: [],
          createdAt: Date.now(),
          updatedAt: Date.now(),
          model: 'gpt-4',
          connectedNodeIds: [],
        };

        set((state) => ({
          conversations: {
            ...state.conversations,
            [id]: newConversation,
          },
        }));

        return id;
      },

      deleteConversation: (conversationId: string) => {
        set((state) => {
          const newConversations = { ...state.conversations };
          delete newConversations[conversationId];

          return {
            conversations: newConversations,
            activeConversationId:
              state.activeConversationId === conversationId
                ? null
                : state.activeConversationId,
          };
        });
      },

      setActiveConversation: (conversationId: string) => {
        set({ activeConversationId: conversationId });
      },

      addMessage: (conversationId: string, message: Omit<ChatMessage, 'id' | 'timestamp'>) => {
        const newMessage: ChatMessage = {
          ...message,
          id: `msg-${Date.now()}-${Math.random()}`,
          timestamp: Date.now(),
        };

        set((state) => {
          const conversation = state.conversations[conversationId];
          if (!conversation) return state;

          return {
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...conversation,
                messages: [...conversation.messages, newMessage],
                updatedAt: Date.now(),
              },
            },
          };
        });
      },

      updateConversationTitle: (conversationId: string, title: string) => {
        set((state) => {
          const conversation = state.conversations[conversationId];
          if (!conversation) return state;

          return {
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...conversation,
                title,
                updatedAt: Date.now(),
              },
            },
          };
        });
      },

      getConversation: (conversationId: string) => {
        return get().conversations[conversationId];
      },

      updateConnectedNodes: (conversationId: string, nodeIds: string[]) => {
        set((state) => {
          const conversation = state.conversations[conversationId];
          if (!conversation) return state;

          return {
            conversations: {
              ...state.conversations,
              [conversationId]: {
                ...conversation,
                connectedNodeIds: nodeIds,
              },
            },
          };
        });
      },
    }),
    {
      name: 'chat-storage',
    }
  )
);

export default useChatStore;
