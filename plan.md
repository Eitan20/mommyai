# MommyAI → Poppy AI-Style Platform: Comprehensive Implementation Plan

## Executive Summary

**Current State:**
- MommyAI is a functional frontend prototype with visual whiteboard capabilities
- Well-architected UI with React Flow, 8 node types, and mock AI integration
- No backend database, authentication, or real AI processing
- Everything stored in localStorage with simulated responses

**Target State:**
- Transform into a Poppy AI-style collaborative visual AI platform for content creators
- Multi-source content ingestion (videos, podcasts, PDFs, links, files)
- RAG-based knowledge system with real AI processing
- Visual node-based workflows connecting sources to specialized AI assistants
- API access for automation and integrations
- Real-time collaboration and persistent storage

**Estimated Timeline:** 12-16 weeks (3-4 months)

---

## Table of Contents

1. [Current Assessment](#current-assessment)
2. [Architecture Overview](#architecture-overview)
3. [Phase 1: Foundation & Backend](#phase-1-foundation--backend)
4. [Phase 2: AI & Knowledge Base](#phase-2-ai--knowledge-base)
5. [Phase 3: Content Processing](#phase-3-content-processing)
6. [Phase 4: Advanced Features](#phase-4-advanced-features)
7. [Phase 5: API & Integrations](#phase-5-api--integrations)
8. [Phase 6: Polish & Launch](#phase-6-polish--launch)
9. [Technical Stack Recommendations](#technical-stack-recommendations)
10. [Database Schema](#database-schema)
11. [API Endpoints Design](#api-endpoints-design)
12. [Security Considerations](#security-considerations)

---

## Current Assessment

### ✅ What Works (Keep & Build On)

**UI/UX Layer:**
- ✅ React Flow infinite canvas with drag-drop
- ✅ 8 node types (Text, Image, Link, Video, Audio, Document, Group, Chat)
- ✅ Node connections and visual edges
- ✅ Dashboard with board management
- ✅ Dark mode support
- ✅ Clean Zustand state management
- ✅ TypeScript with strict mode
- ✅ Shadcn/UI component library
- ✅ Responsive design patterns

**Core Concepts:**
- ✅ Board-based organization (like Poppy)
- ✅ Visual node graph structure
- ✅ Node connections representing data flow
- ✅ Multi-modal content support
- ✅ Chat-based AI interface

### ❌ What's Missing (Must Build)

**Critical Backend:**
- ❌ Database for persistent storage
- ❌ Real authentication system
- ❌ User/workspace management
- ❌ API server infrastructure

**AI & Processing:**
- ❌ Real AI API integration (OpenAI, Anthropic, Google)
- ❌ RAG/knowledge base system
- ❌ Vector embeddings and search
- ❌ Multi-model orchestration
- ❌ Streaming responses

**Content Ingestion:**
- ❌ Video transcription (YouTube, TikTok, etc.)
- ❌ Audio transcription (Whisper API)
- ❌ PDF text extraction (production-grade)
- ❌ Web scraping and metadata extraction
- ❌ Image analysis and OCR

**Collaboration:**
- ❌ Real-time synchronization (WebSockets)
- ❌ Live cursors and presence
- ❌ Conflict resolution
- ❌ Multi-user permissions

**Advanced Features:**
- ❌ Public API for developers
- ❌ Webhooks and automation
- ❌ Credit/usage tracking
- ❌ Export to multiple formats
- ❌ Template marketplace

---

## Architecture Overview

### High-Level System Design

```
┌─────────────────────────────────────────────────────────────────┐
│                         Frontend Layer                          │
│  Next.js 14 + React 18 + TypeScript + React Flow + Shadcn/UI  │
│                    (Deployed on Vercel)                         │
└────────────────────┬────────────────────────────────────────────┘
                     │
                     │ HTTPS / WebSocket
                     │
┌────────────────────▼────────────────────────────────────────────┐
│                        API Gateway                              │
│           Next.js API Routes + tRPC (optional)                  │
│     Authentication, Rate Limiting, Request Routing              │
└────────────┬───────────────────────┬────────────────────────────┘
             │                       │
             │                       │
┌────────────▼────────┐   ┌─────────▼──────────┐
│   PostgreSQL DB     │   │  Vector Database   │
│   (Supabase or      │   │  (pgvector or      │
│    Railway)         │   │   Pinecone)        │
│                     │   │                    │
│ - Users             │   │ - Embeddings       │
│ - Workspaces        │   │ - Knowledge chunks │
│ - Boards            │   │ - Similarity search│
│ - Nodes/Sources     │   │                    │
│ - Conversations     │   │                    │
│ - Assistants        │   │                    │
│ - Messages          │   │                    │
└─────────────────────┘   └────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    Processing Layer (Workers)                    │
│                                                                  │
│  ┌────────────┐  ┌────────────┐  ┌────────────┐  ┌──────────┐ │
│  │   Video    │  │   Audio    │  │  Document  │  │   Web    │ │
│  │ Transcript │  │ Transcript │  │  Parsing   │  │ Scraping │ │
│  │  Worker    │  │  Worker    │  │  Worker    │  │  Worker  │ │
│  └────────────┘  └────────────┘  └────────────┘  └──────────┘ │
│                                                                  │
│  ┌────────────────────────────────────────────────────────┐    │
│  │          Embedding Generation Worker                   │    │
│  │          (Generates vectors for RAG)                   │    │
│  └────────────────────────────────────────────────────────┘    │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    AI Orchestration Layer                        │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │              Multi-Model Router                          │  │
│  │  (Routes requests to OpenAI, Anthropic, Google, xAI)    │  │
│  └──────────────────────────────────────────────────────────┘  │
│                                                                  │
│  ┌──────────────────────────────────────────────────────────┐  │
│  │         RAG Pipeline (Retrieval + Generation)            │  │
│  │  1. Query → 2. Embed → 3. Vector Search →               │  │
│  │  4. Context Retrieval → 5. LLM Generation                │  │
│  └──────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    External Services                             │
│                                                                  │
│  • Object Storage (S3/R2/Supabase Storage) - Raw files          │
│  • OpenAI API - GPT models + Whisper                            │
│  • Anthropic API - Claude models                                │
│  • Google AI - Gemini models                                    │
│  • YouTube Transcript API - Video transcripts                   │
│  • Web scraping service - Link metadata                         │
│  • Email service (Resend/SendGrid) - Notifications              │
│  • WebSocket service (Pusher/Ably/Socket.io) - Real-time       │
└─────────────────────────────────────────────────────────────────┘
```

### Data Flow Example: "User Uploads YouTube Video"

```
1. User drops YouTube link → VideoNode on canvas
2. Frontend sends POST /api/sources with URL + boardId
3. Backend:
   a. Creates source record in DB
   b. Enqueues video processing job
4. Video Worker:
   a. Fetches transcript from YouTube API
   b. Extracts metadata (title, thumbnail, duration)
   c. Stores transcript text in DB
   d. Enqueues embedding job
5. Embedding Worker:
   a. Chunks transcript into paragraphs
   b. Generates embeddings via OpenAI/Cohere
   c. Stores vectors in vector DB with metadata
6. Frontend polls or receives WebSocket update
7. VideoNode updates with transcript preview
8. User connects VideoNode → ChatNode
9. When user chats:
   a. System queries vector DB for relevant chunks
   b. Retrieves top K similar chunks
   c. Constructs prompt with context
   d. Calls AI model (GPT/Claude/Gemini)
   e. Streams response back to user
```

---

## Phase 1: Foundation & Backend
**Duration:** 3-4 weeks
**Priority:** CRITICAL - Everything depends on this

### Week 1-2: Database & Authentication

#### 1.1 Set Up Database (PostgreSQL)

**Option A: Supabase (Recommended for speed)**
- ✅ Hosted PostgreSQL + Auth + Storage in one
- ✅ Built-in real-time subscriptions
- ✅ Row-level security
- ✅ Generous free tier
- ✅ pgvector extension available

**Option B: Railway/Render + Separate Services**
- More control, more setup time

**Tasks:**
```bash
# 1. Create Supabase project
# 2. Install Supabase client
npm install @supabase/supabase-js @supabase/auth-helpers-nextjs

# 3. Set up environment variables
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=xxx
SUPABASE_SERVICE_ROLE_KEY=xxx
```

**Database Schema (Initial):**

See [Database Schema](#database-schema) section below for full details.

#### 1.2 Implement Real Authentication

**Replace mock auth with Supabase Auth:**

```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)
```

**Update authStore.ts:**
```typescript
// store/authStore.ts
const signup = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  if (error) throw error
  set({ user: data.user, isAuthenticated: true })
}

const login = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  if (error) throw error
  set({ user: data.user, isAuthenticated: true })
}

const logout = async () => {
  await supabase.auth.signOut()
  set({ user: null, isAuthenticated: false })
}
```

**Add OAuth providers:**
- Google OAuth
- GitHub OAuth
- Email magic links

**Implement:**
- ✅ Email verification
- ✅ Password reset flow
- ✅ Session management
- ✅ Protected API routes

#### 1.3 Workspace & Multi-Tenancy

**Create workspace system:**

```typescript
// models/workspace.ts
interface Workspace {
  id: string
  name: string
  slug: string
  owner_id: string
  plan: 'free' | 'pro' | 'power'
  credits_used: number
  credits_limit: number
  created_at: string
  updated_at: string
}

// API: /api/workspaces
POST   /api/workspaces           // Create workspace
GET    /api/workspaces           // List user workspaces
GET    /api/workspaces/:id       // Get workspace
PATCH  /api/workspaces/:id       // Update workspace
DELETE /api/workspaces/:id       // Delete workspace
```

**Implement Row-Level Security (RLS):**

```sql
-- Only workspace members can access their data
CREATE POLICY "Users can only access their workspace data"
  ON boards
  FOR ALL
  USING (workspace_id IN (
    SELECT workspace_id FROM workspace_members WHERE user_id = auth.uid()
  ));
```

### Week 2-3: Board & Node Persistence

#### 1.4 Migrate Boards to Database

**Update boardStore.ts to use Supabase:**

```typescript
// store/boardStore.ts
const createBoard = async (title: string, description: string) => {
  const { data, error } = await supabase
    .from('boards')
    .insert({
      workspace_id: currentWorkspace.id,
      title,
      description,
      owner_id: user.id,
    })
    .select()
    .single()

  if (error) throw error
  set(state => ({ boards: [...state.boards, data] }))
  return data
}

const fetchBoards = async (workspaceId: string) => {
  const { data, error } = await supabase
    .from('boards')
    .select('*')
    .eq('workspace_id', workspaceId)
    .order('updated_at', { ascending: false })

  if (error) throw error
  set({ boards: data })
}
```

**API Routes:**
```typescript
// app/api/boards/route.ts
export async function GET(request: Request) {
  const user = await getUser(request)
  const { workspaceId } = await request.json()

  const boards = await db.boards.findMany({
    where: {
      workspace_id: workspaceId,
      workspace: {
        members: { some: { user_id: user.id } }
      }
    }
  })

  return Response.json(boards)
}
```

#### 1.5 Persist Nodes & Edges

**Store whiteboard state in database:**

```typescript
// store/whiteboardStore.ts
const saveToDatabase = async (boardId: string) => {
  const { nodes, edges } = get()

  const { error } = await supabase
    .from('board_state')
    .upsert({
      board_id: boardId,
      nodes: JSON.stringify(nodes),
      edges: JSON.stringify(edges),
      updated_at: new Date().toISOString(),
    })

  if (error) throw error
}

// Auto-save every 3 seconds
useEffect(() => {
  const interval = setInterval(() => {
    saveToDatabase(boardId)
  }, 3000)
  return () => clearInterval(interval)
}, [boardId])
```

**Separate tables for sources (nodes with content):**

```sql
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  node_id TEXT NOT NULL, -- React Flow node ID
  type TEXT NOT NULL, -- 'video', 'link', 'document', 'audio', 'image'
  url TEXT,
  file_path TEXT,
  metadata JSONB, -- title, description, thumbnail, etc.
  content TEXT, -- Extracted text/transcript
  processed BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Week 3-4: Object Storage & File Uploads

#### 1.6 Set Up Cloud Storage

**Use Supabase Storage or AWS S3:**

```typescript
// lib/storage.ts
export async function uploadFile(
  file: File,
  bucket: string,
  path: string
): Promise<string> {
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) throw error

  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(data.path)

  return publicUrl
}
```

**Update ImageNode, VideoNode, AudioNode, DocumentNode:**

```typescript
// components/nodes/ImageNode.tsx
const handleFileUpload = async (file: File) => {
  setUploading(true)
  try {
    const path = `${workspaceId}/${boardId}/${nodeId}/${file.name}`
    const url = await uploadFile(file, 'images', path)

    // Save to database
    await supabase.from('sources').insert({
      board_id: boardId,
      node_id: nodeId,
      type: 'image',
      url,
      metadata: { filename: file.name, size: file.size },
    })

    setImageUrl(url)
  } catch (error) {
    console.error('Upload failed:', error)
  } finally {
    setUploading(false)
  }
}
```

**File size limits & validation:**
- Images: 10 MB
- Videos: 100 MB (or use external URLs)
- Audio: 25 MB
- Documents: 20 MB

---

## Phase 2: AI & Knowledge Base
**Duration:** 3-4 weeks
**Priority:** HIGH - Core value proposition

### Week 4-5: AI API Integration

#### 2.1 Multi-Model Orchestration Layer

**Create unified AI client:**

```typescript
// lib/ai/index.ts
export type AIModel =
  | 'gpt-4o'
  | 'gpt-4o-mini'
  | 'claude-3-5-sonnet-20241022'
  | 'claude-3-5-haiku-20241022'
  | 'gemini-2.0-flash-exp'
  | 'gemini-1.5-pro'

interface GenerateOptions {
  model: AIModel
  messages: Message[]
  systemPrompt?: string
  temperature?: number
  maxTokens?: number
  stream?: boolean
}

export async function generate(options: GenerateOptions) {
  const { model } = options

  if (model.startsWith('gpt-')) {
    return generateOpenAI(options)
  } else if (model.startsWith('claude-')) {
    return generateAnthropic(options)
  } else if (model.startsWith('gemini-')) {
    return generateGoogle(options)
  }

  throw new Error(`Unsupported model: ${model}`)
}
```

**OpenAI Integration:**

```typescript
// lib/ai/openai.ts
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export async function generateOpenAI(options: GenerateOptions) {
  const { messages, systemPrompt, temperature = 0.7, maxTokens = 2000, stream = false } = options

  const response = await openai.chat.completions.create({
    model: options.model,
    messages: [
      { role: 'system', content: systemPrompt || 'You are a helpful AI assistant.' },
      ...messages,
    ],
    temperature,
    max_tokens: maxTokens,
    stream,
  })

  if (stream) {
    return response as any // Stream
  }

  return response.choices[0].message.content
}
```

**Anthropic Integration:**

```typescript
// lib/ai/anthropic.ts
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

export async function generateAnthropic(options: GenerateOptions) {
  const { messages, systemPrompt, temperature = 0.7, maxTokens = 2000 } = options

  const response = await anthropic.messages.create({
    model: options.model,
    max_tokens: maxTokens,
    system: systemPrompt,
    messages: messages.map(m => ({
      role: m.role === 'assistant' ? 'assistant' : 'user',
      content: m.content,
    })),
    temperature,
  })

  return response.content[0].text
}
```

**Google AI Integration:**

```typescript
// lib/ai/google.ts
import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_AI_API_KEY!)

export async function generateGoogle(options: GenerateOptions) {
  const { messages, systemPrompt, temperature = 0.7 } = options

  const model = genAI.getGenerativeModel({
    model: options.model,
    systemInstruction: systemPrompt,
  })

  const chat = model.startChat({
    history: messages.slice(0, -1).map(m => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    })),
    generationConfig: {
      temperature,
    },
  })

  const result = await chat.sendMessage(messages[messages.length - 1].content)
  return result.response.text()
}
```

#### 2.2 Streaming Responses

**Update API route for streaming:**

```typescript
// app/api/chat/route.ts
export async function POST(request: Request) {
  const { boardId, conversationId, message, model } = await request.json()
  const user = await getUser(request)

  // Check permissions
  await checkBoardAccess(user.id, boardId)

  // Get conversation context
  const conversation = await getConversation(conversationId)
  const messages = conversation.messages

  // Stream response
  const stream = await generate({
    model,
    messages: [...messages, { role: 'user', content: message }],
    stream: true,
  })

  // Return ReadableStream
  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  })
}
```

**Update ChatPanel.tsx to handle streaming:**

```typescript
// components/ChatPanel.tsx
const sendMessage = async (content: string) => {
  const response = await fetch('/api/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      boardId,
      conversationId: activeConversation.id,
      message: content,
      model: selectedModel,
    }),
  })

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let accumulatedText = ''

  while (true) {
    const { done, value } = await reader!.read()
    if (done) break

    const chunk = decoder.decode(value)
    accumulatedText += chunk

    // Update UI in real-time
    setMessages(prev => [
      ...prev.slice(0, -1),
      { role: 'assistant', content: accumulatedText },
    ])
  }

  // Save to database
  await saveMessage(conversationId, 'assistant', accumulatedText)
}
```

### Week 5-6: Vector Database & RAG

#### 2.3 Set Up Vector Database

**Option A: pgvector (Recommended if using Supabase/PostgreSQL)**

```sql
-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create embeddings table
CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  embedding vector(1536), -- OpenAI embedding dimension
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index for similarity search
CREATE INDEX ON embeddings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);
```

**Option B: Pinecone (Managed vector database)**

```typescript
// lib/pinecone.ts
import { Pinecone } from '@pinecone-database/pinecone'

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY!,
})

const index = pinecone.index('mommyai')

export async function upsertEmbeddings(
  vectors: { id: string; values: number[]; metadata: any }[]
) {
  await index.upsert(vectors)
}

export async function queryEmbeddings(
  embedding: number[],
  filter: any,
  topK = 5
) {
  const results = await index.query({
    vector: embedding,
    filter,
    topK,
    includeMetadata: true,
  })
  return results.matches
}
```

#### 2.4 Embedding Generation

**Create embedding service:**

```typescript
// lib/embeddings.ts
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small', // 1536 dimensions, cheaper
    input: text,
  })
  return response.data[0].embedding
}

export async function generateEmbeddings(texts: string[]): Promise<number[][]> {
  const response = await openai.embeddings.create({
    model: 'text-embedding-3-small',
    input: texts,
  })
  return response.data.map(d => d.embedding)
}
```

**Chunk text intelligently:**

```typescript
// lib/chunking.ts
export function chunkText(
  text: string,
  maxChunkSize = 1000,
  overlap = 200
): string[] {
  const sentences = text.match(/[^.!?]+[.!?]+/g) || [text]
  const chunks: string[] = []
  let currentChunk = ''

  for (const sentence of sentences) {
    if (currentChunk.length + sentence.length > maxChunkSize) {
      if (currentChunk) chunks.push(currentChunk.trim())

      // Add overlap from previous chunk
      const overlapText = currentChunk.slice(-overlap)
      currentChunk = overlapText + sentence
    } else {
      currentChunk += sentence
    }
  }

  if (currentChunk) chunks.push(currentChunk.trim())
  return chunks
}
```

#### 2.5 RAG Pipeline Implementation

**Create retrieval service:**

```typescript
// lib/rag.ts
export async function retrieveContext(
  query: string,
  boardId: string,
  topK = 5
): Promise<{ text: string; source: string; score: number }[]> {
  // 1. Generate query embedding
  const queryEmbedding = await generateEmbedding(query)

  // 2. Search vector database
  const { data, error } = await supabase.rpc('match_embeddings', {
    query_embedding: queryEmbedding,
    match_threshold: 0.7,
    match_count: topK,
    board_id: boardId,
  })

  if (error) throw error

  // 3. Return ranked results
  return data.map((d: any) => ({
    text: d.chunk_text,
    source: d.source_metadata.title || d.source_metadata.url,
    score: d.similarity,
  }))
}
```

**SQL function for similarity search:**

```sql
-- RPC function for vector similarity search
CREATE OR REPLACE FUNCTION match_embeddings(
  query_embedding vector(1536),
  match_threshold float,
  match_count int,
  board_id uuid
)
RETURNS TABLE (
  id uuid,
  source_id uuid,
  chunk_text text,
  source_metadata jsonb,
  similarity float
)
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN QUERY
  SELECT
    e.id,
    e.source_id,
    e.chunk_text,
    s.metadata as source_metadata,
    1 - (e.embedding <=> query_embedding) as similarity
  FROM embeddings e
  JOIN sources s ON e.source_id = s.id
  WHERE
    e.board_id = match_embeddings.board_id
    AND 1 - (e.embedding <=> query_embedding) > match_threshold
  ORDER BY e.embedding <=> query_embedding
  LIMIT match_count;
END;
$$;
```

**Integrate RAG into chat endpoint:**

```typescript
// app/api/chat/route.ts
export async function POST(request: Request) {
  const { boardId, conversationId, message, model } = await request.json()

  // 1. Get conversation history
  const messages = await getConversationMessages(conversationId)

  // 2. Retrieve relevant context from knowledge base
  const context = await retrieveContext(message, boardId, 5)

  // 3. Build context-aware prompt
  const contextPrompt = context.length > 0
    ? `Here is relevant information from the knowledge base:

${context.map((c, i) => `[${i + 1}] From "${c.source}":
${c.text}`).join('\n\n')}

Please use this information to answer the user's question.`
    : ''

  // 4. Generate response
  const systemPrompt = `You are an AI assistant helping with content creation and brainstorming.
${contextPrompt}`

  const response = await generate({
    model,
    systemPrompt,
    messages: [...messages, { role: 'user', content: message }],
    stream: true,
  })

  return new Response(response)
}
```

### Week 6-7: Assistant Configuration System

#### 2.6 Specialized AI Assistants

**Create assistant presets:**

```typescript
// lib/assistants/presets.ts
export const assistantPresets = {
  'content-writer': {
    name: 'Content Writer',
    description: 'Writes blog posts, articles, and long-form content',
    systemPrompt: `You are an expert content writer. Create engaging, well-structured content that:
- Has compelling hooks and introductions
- Uses clear, concise language
- Includes relevant examples and data
- Follows SEO best practices
- Matches the brand voice provided`,
    icon: '✍️',
    suggestedModels: ['gpt-4o', 'claude-3-5-sonnet-20241022'],
  },

  'email-copywriter': {
    name: 'Email Copywriter',
    description: 'Crafts persuasive email sequences and newsletters',
    systemPrompt: `You are a direct-response email copywriter. Write emails that:
- Have attention-grabbing subject lines
- Use conversational, personal tone
- Follow AIDA framework (Attention, Interest, Desire, Action)
- Include clear CTAs
- Are optimized for conversion`,
    icon: '📧',
    suggestedModels: ['gpt-4o-mini', 'claude-3-5-haiku-20241022'],
  },

  'video-script-doctor': {
    name: 'Video Script Doctor',
    description: 'Analyzes and improves video scripts for engagement',
    systemPrompt: `You are a video script expert. Analyze scripts and:
- Identify strong hooks and suggest improvements
- Ensure proper pacing and structure
- Optimize for retention and engagement
- Suggest B-roll and visual cues
- Adapt scripts for different platforms (YouTube, TikTok, Instagram)`,
    icon: '🎬',
    suggestedModels: ['gpt-4o', 'gemini-1.5-pro'],
  },

  'hook-generator': {
    name: 'Hook Generator',
    description: 'Creates viral hooks and attention-grabbing openers',
    systemPrompt: `You are a viral content specialist. Generate hooks that:
- Stop the scroll immediately
- Create curiosity gaps
- Use pattern interrupts
- Are platform-specific (TikTok vs YouTube vs LinkedIn)
- Drive clicks and engagement`,
    icon: '🎣',
    suggestedModels: ['gpt-4o', 'claude-3-5-sonnet-20241022'],
  },

  'summarizer': {
    name: 'Content Summarizer',
    description: 'Extracts key points and creates concise summaries',
    systemPrompt: `You are an expert at distilling complex content. Create summaries that:
- Extract the most important points
- Maintain accuracy and nuance
- Are scannable and well-organized
- Include actionable takeaways
- Preserve the original tone`,
    icon: '📝',
    suggestedModels: ['gpt-4o-mini', 'gemini-2.0-flash-exp'],
  },

  'podcast-outliner': {
    name: 'Podcast Outliner',
    description: 'Creates structured outlines from podcast transcripts',
    systemPrompt: `You are a podcast production expert. Create outlines that:
- Identify main topics and subtopics
- Extract key quotes and moments
- Suggest timestamps for chapters
- Highlight shareable clips
- Organize content for show notes`,
    icon: '🎙️',
    suggestedModels: ['gpt-4o', 'claude-3-5-sonnet-20241022'],
  },

  'social-media-adapter': {
    name: 'Social Media Adapter',
    description: 'Repurposes content for different social platforms',
    systemPrompt: `You are a multi-platform content strategist. Adapt content for:
- Platform-specific formats (Twitter threads, LinkedIn posts, TikTok scripts)
- Optimal character counts and structures
- Platform culture and best practices
- Hashtag and engagement optimization
- Cross-platform content calendars`,
    icon: '📱',
    suggestedModels: ['gpt-4o-mini', 'claude-3-5-haiku-20241022'],
  },
}
```

**Assistant model:**

```typescript
// models/assistant.ts
interface Assistant {
  id: string
  board_id: string
  name: string
  description?: string
  preset_type?: keyof typeof assistantPresets
  custom_system_prompt?: string
  default_model: AIModel
  temperature: number
  max_tokens: number
  connected_source_ids: string[] // Which nodes feed this assistant
  output_format?: 'text' | 'markdown' | 'json' | 'list'
  created_at: string
  updated_at: string
}
```

**Create assistant configuration UI:**

```typescript
// components/AssistantConfig.tsx
export function AssistantConfig({ assistant }: { assistant: Assistant }) {
  return (
    <div className="space-y-4">
      <Select
        label="Assistant Type"
        value={assistant.preset_type}
        onChange={handlePresetChange}
      >
        {Object.entries(assistantPresets).map(([key, preset]) => (
          <option key={key} value={key}>
            {preset.icon} {preset.name}
          </option>
        ))}
        <option value="custom">🔧 Custom Assistant</option>
      </Select>

      <Select
        label="AI Model"
        value={assistant.default_model}
        onChange={handleModelChange}
      >
        <optgroup label="OpenAI">
          <option value="gpt-4o">GPT-4o (Powerful)</option>
          <option value="gpt-4o-mini">GPT-4o Mini (Fast & Cheap)</option>
        </optgroup>
        <optgroup label="Anthropic">
          <option value="claude-3-5-sonnet-20241022">Claude 3.5 Sonnet</option>
          <option value="claude-3-5-haiku-20241022">Claude 3.5 Haiku</option>
        </optgroup>
        <optgroup label="Google">
          <option value="gemini-2.0-flash-exp">Gemini 2.0 Flash</option>
          <option value="gemini-1.5-pro">Gemini 1.5 Pro</option>
        </optgroup>
      </Select>

      <Textarea
        label="System Prompt"
        value={assistant.custom_system_prompt || getCurrentPrompt()}
        onChange={handlePromptChange}
        rows={10}
      />

      <div className="grid grid-cols-2 gap-4">
        <Slider
          label="Temperature"
          min={0}
          max={1}
          step={0.1}
          value={assistant.temperature}
          onChange={handleTempChange}
        />
        <Input
          label="Max Tokens"
          type="number"
          value={assistant.max_tokens}
          onChange={handleMaxTokensChange}
        />
      </div>

      <div>
        <h3 className="font-medium mb-2">Connected Sources</h3>
        <SourceConnectionList assistant={assistant} />
      </div>
    </div>
  )
}
```

---

## Phase 3: Content Processing
**Duration:** 3-4 weeks
**Priority:** HIGH - Enables core use cases

### Week 7-8: Video Transcription

#### 3.1 YouTube Integration

**YouTube transcript fetching:**

```typescript
// lib/transcripts/youtube.ts
import { YoutubeTranscript } from 'youtube-transcript'

export async function getYouTubeTranscript(videoId: string) {
  try {
    const transcript = await YoutubeTranscript.fetchTranscript(videoId)

    return {
      text: transcript.map(t => t.text).join(' '),
      segments: transcript.map(t => ({
        start: t.offset / 1000,
        duration: t.duration / 1000,
        text: t.text,
      })),
    }
  } catch (error) {
    console.error('YouTube transcript error:', error)
    throw new Error('Failed to fetch YouTube transcript')
  }
}
```

**Video metadata extraction:**

```typescript
// lib/transcripts/metadata.ts
import ytdl from 'ytdl-core'

export async function getYouTubeMetadata(videoId: string) {
  const info = await ytdl.getInfo(videoId)

  return {
    title: info.videoDetails.title,
    description: info.videoDetails.description,
    thumbnail: info.videoDetails.thumbnails[0].url,
    duration: parseInt(info.videoDetails.lengthSeconds),
    author: info.videoDetails.author.name,
    publishDate: info.videoDetails.publishDate,
  }
}
```

#### 3.2 Audio Transcription (Whisper API)

**Whisper integration for uploaded audio/video:**

```typescript
// lib/transcripts/whisper.ts
import OpenAI from 'openai'
import fs from 'fs'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function transcribeAudio(
  filePath: string,
  language?: string
): Promise<{ text: string; segments: any[] }> {
  const audioFile = fs.createReadStream(filePath)

  const response = await openai.audio.transcriptions.create({
    file: audioFile,
    model: 'whisper-1',
    language,
    response_format: 'verbose_json',
    timestamp_granularities: ['segment'],
  })

  return {
    text: response.text,
    segments: response.segments || [],
  }
}
```

**Background processing worker:**

```typescript
// workers/transcription.ts
import { Queue, Worker } from 'bullmq'

const transcriptionQueue = new Queue('transcription', {
  connection: { host: 'localhost', port: 6379 },
})

const transcriptionWorker = new Worker(
  'transcription',
  async (job) => {
    const { sourceId, filePath, type } = job.data

    let transcript

    if (type === 'youtube') {
      const videoId = extractYouTubeId(filePath)
      transcript = await getYouTubeTranscript(videoId)
    } else {
      transcript = await transcribeAudio(filePath)
    }

    // Save to database
    await supabase
      .from('sources')
      .update({
        content: transcript.text,
        metadata: { segments: transcript.segments },
        processed: true,
      })
      .eq('id', sourceId)

    // Generate embeddings
    await transcriptionQueue.add('embed', { sourceId })

    return { success: true }
  },
  { connection: { host: 'localhost', port: 6379 } }
)
```

**API endpoint for triggering transcription:**

```typescript
// app/api/sources/transcribe/route.ts
export async function POST(request: Request) {
  const { sourceId } = await request.json()
  const user = await getUser(request)

  const source = await getSource(sourceId)
  await checkBoardAccess(user.id, source.board_id)

  // Add to queue
  await transcriptionQueue.add('transcribe', {
    sourceId,
    filePath: source.url || source.file_path,
    type: source.type,
  })

  return Response.json({ status: 'processing' })
}
```

### Week 8-9: Document & Link Processing

#### 3.3 PDF Text Extraction

**Upgrade PDF processing:**

```typescript
// lib/documents/pdf.ts
import pdf from 'pdf-parse'
import fs from 'fs/promises'

export async function extractPDFText(filePath: string) {
  const dataBuffer = await fs.readFile(filePath)
  const data = await pdf(dataBuffer)

  return {
    text: data.text,
    numPages: data.numpages,
    info: data.info,
  }
}

// Alternative: Use OCR for scanned PDFs
import Tesseract from 'tesseract.js'

export async function extractPDFWithOCR(filePath: string) {
  // Convert PDF pages to images, then OCR each
  // Implementation depends on use case
}
```

#### 3.4 Web Scraping & Link Metadata

**Enhanced link processing:**

```typescript
// lib/scraping/web.ts
import * as cheerio from 'cheerio'
import axios from 'axios'

export async function scrapeWebPage(url: string) {
  const response = await axios.get(url)
  const $ = cheerio.load(response.data)

  // Extract metadata
  const metadata = {
    title: $('meta[property="og:title"]').attr('content') || $('title').text(),
    description: $('meta[property="og:description"]').attr('content') || $('meta[name="description"]').attr('content'),
    image: $('meta[property="og:image"]').attr('content'),
    favicon: $('link[rel="icon"]').attr('href'),
    author: $('meta[name="author"]').attr('content'),
  }

  // Extract main content
  const mainContent = $('article, main, .content').text() || $('body').text()

  // Clean up text
  const cleanText = mainContent
    .replace(/\s+/g, ' ')
    .replace(/\n+/g, '\n')
    .trim()

  return {
    metadata,
    content: cleanText,
  }
}
```

**Handle different content types:**

```typescript
// lib/scraping/router.ts
export async function processURL(url: string) {
  // Detect URL type
  if (isYouTubeURL(url)) {
    return processYouTube(url)
  } else if (isTikTokURL(url)) {
    return processTikTok(url)
  } else if (isTwitterURL(url)) {
    return processTwitter(url)
  } else {
    return scrapeWebPage(url)
  }
}
```

#### 3.5 Image Analysis

**Vision API integration:**

```typescript
// lib/vision/analyze.ts
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

export async function analyzeImage(imageUrl: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Describe this image in detail. Include any text, objects, people, and context.' },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      },
    ],
  })

  return response.choices[0].message.content
}

export async function extractTextFromImage(imageUrl: string) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: [
      {
        role: 'user',
        content: [
          { type: 'text', text: 'Extract all text from this image. Return only the text, exactly as it appears.' },
          { type: 'image_url', image_url: { url: imageUrl } },
        ],
      },
    ],
  })

  return response.choices[0].message.content
}
```

### Week 9-10: Embedding Generation Pipeline

#### 3.6 Automated Embedding Workflow

**Create embedding worker:**

```typescript
// workers/embedding.ts
import { Worker } from 'bullmq'

const embeddingWorker = new Worker(
  'embedding',
  async (job) => {
    const { sourceId } = job.data

    // 1. Get source content
    const source = await getSource(sourceId)

    if (!source.content || !source.processed) {
      throw new Error('Source not processed yet')
    }

    // 2. Chunk the content
    const chunks = chunkText(source.content, 1000, 200)

    // 3. Generate embeddings
    const embeddings = await generateEmbeddings(chunks)

    // 4. Store in vector database
    const embeddingRecords = chunks.map((chunk, i) => ({
      source_id: sourceId,
      board_id: source.board_id,
      workspace_id: source.workspace_id,
      chunk_text: chunk,
      chunk_index: i,
      embedding: embeddings[i],
      metadata: {
        source_type: source.type,
        source_title: source.metadata.title,
      },
    }))

    await supabase.from('embeddings').insert(embeddingRecords)

    // 5. Mark source as indexed
    await supabase
      .from('sources')
      .update({ indexed: true })
      .eq('id', sourceId)

    return { chunks: chunks.length }
  },
  { connection: { host: 'localhost', port: 6379 } }
)
```

**Trigger embeddings after content processing:**

```typescript
// After transcription completes:
await embeddingQueue.add('generate', { sourceId })
```

---

## Phase 4: Advanced Features
**Duration:** 2-3 weeks
**Priority:** MEDIUM - Enhances usability

### Week 10-11: Real-Time Collaboration

#### 4.1 WebSocket Setup

**Option A: Supabase Realtime (Easiest)**

```typescript
// lib/realtime.ts
import { supabase } from './supabase'

export function subscribeToBoardChanges(
  boardId: string,
  onUpdate: (payload: any) => void
) {
  const channel = supabase
    .channel(`board:${boardId}`)
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'board_state',
        filter: `board_id=eq.${boardId}`,
      },
      onUpdate
    )
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}
```

**Option B: Socket.io (More control)**

```typescript
// lib/socket.ts
import { Server } from 'socket.io'

export function initSocketServer(httpServer: any) {
  const io = new Server(httpServer, {
    cors: { origin: '*' },
  })

  io.on('connection', (socket) => {
    socket.on('join-board', (boardId) => {
      socket.join(`board:${boardId}`)
    })

    socket.on('node-update', ({ boardId, node }) => {
      socket.to(`board:${boardId}`).emit('node-updated', node)
    })

    socket.on('cursor-move', ({ boardId, position, userId }) => {
      socket.to(`board:${boardId}`).emit('cursor-moved', {
        userId,
        position,
      })
    })
  })

  return io
}
```

**Update WhiteboardCanvas.tsx:**

```typescript
// components/WhiteboardCanvas.tsx
useEffect(() => {
  const channel = supabase
    .channel(`board:${boardId}`)
    .on('broadcast', { event: 'node-change' }, ({ payload }) => {
      // Update local state
      setNodes(prevNodes =>
        prevNodes.map(n => n.id === payload.id ? payload : n)
      )
    })
    .subscribe()

  return () => {
    supabase.removeChannel(channel)
  }
}, [boardId])

// Broadcast changes
const onNodesChange = useCallback((changes) => {
  reactFlowInstance?.setNodes(changes)

  // Broadcast to other users
  channel.send({
    type: 'broadcast',
    event: 'node-change',
    payload: changes,
  })
}, [channel])
```

#### 4.2 Presence & Cursors

**Track active users:**

```typescript
// components/CollaborationCursors.tsx
const [presences, setPresences] = useState<any[]>([])

useEffect(() => {
  const channel = supabase.channel(`board:${boardId}`)

  channel
    .on('presence', { event: 'sync' }, () => {
      const state = channel.presenceState()
      setPresences(Object.values(state).flat())
    })
    .on('presence', { event: 'join' }, ({ newPresences }) => {
      console.log('User joined:', newPresences)
    })
    .on('presence', { event: 'leave' }, ({ leftPresences }) => {
      console.log('User left:', leftPresences)
    })
    .subscribe(async (status) => {
      if (status === 'SUBSCRIBED') {
        await channel.track({
          user_id: user.id,
          user_name: user.name,
          online_at: new Date().toISOString(),
        })
      }
    })

  return () => {
    supabase.removeChannel(channel)
  }
}, [boardId, user])

// Track cursor position
useEffect(() => {
  const handleMouseMove = (e: MouseEvent) => {
    if (!channel) return

    const rect = canvasRef.current?.getBoundingClientRect()
    if (!rect) return

    channel.send({
      type: 'broadcast',
      event: 'cursor',
      payload: {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
        user_id: user.id,
        user_name: user.name,
      },
    })
  }

  window.addEventListener('mousemove', handleMouseMove)
  return () => window.removeEventListener('mousemove', handleMouseMove)
}, [channel, user])
```

### Week 11-12: Credits & Usage Tracking

#### 4.3 Implement Credit System

**Credit tracking:**

```typescript
// lib/credits.ts
interface CreditCost {
  embedding_generation: 1 // per 1000 tokens
  ai_message_gpt4o: 10
  ai_message_gpt4o_mini: 2
  ai_message_claude_sonnet: 8
  ai_message_gemini: 5
  video_transcription: 5 // per minute
  audio_transcription: 3 // per minute
  image_analysis: 2
}

export async function deductCredits(
  workspaceId: string,
  amount: number,
  reason: string
) {
  const { data: workspace, error } = await supabase
    .from('workspaces')
    .select('credits_used, credits_limit')
    .eq('id', workspaceId)
    .single()

  if (error) throw error

  if (workspace.credits_used + amount > workspace.credits_limit) {
    throw new Error('Credit limit exceeded')
  }

  await supabase
    .from('workspaces')
    .update({ credits_used: workspace.credits_used + amount })
    .eq('id', workspaceId)

  // Log usage
  await supabase.from('credit_usage').insert({
    workspace_id: workspaceId,
    amount,
    reason,
  })
}

export async function checkCredits(workspaceId: string, required: number) {
  const { data } = await supabase
    .from('workspaces')
    .select('credits_used, credits_limit')
    .eq('id', workspaceId)
    .single()

  return data!.credits_used + required <= data!.credits_limit
}
```

**Usage dashboard:**

```typescript
// app/dashboard/usage/page.tsx
export default function UsagePage() {
  const { workspace } = useWorkspace()
  const { usage } = useUsage(workspace.id)

  return (
    <div>
      <h1>Usage & Credits</h1>

      <Card>
        <h2>Current Plan: {workspace.plan}</h2>
        <Progress
          value={workspace.credits_used}
          max={workspace.credits_limit}
        />
        <p>{workspace.credits_used} / {workspace.credits_limit} credits used</p>
      </Card>

      <Card>
        <h2>Usage This Month</h2>
        <BarChart data={usage.byCategory} />
      </Card>

      <Card>
        <h2>Recent Activity</h2>
        <UsageTable data={usage.recent} />
      </Card>
    </div>
  )
}
```

#### 4.4 Pricing Plans

**Plan definitions:**

```typescript
// lib/plans.ts
export const plans = {
  free: {
    name: 'Free',
    price: 0,
    credits: 1000,
    features: [
      '5 boards',
      '10 AI assistants',
      'Basic models (GPT-4o Mini, Gemini Flash)',
      '100 MB storage',
      'Community support',
    ],
    limits: {
      boards: 5,
      assistants_per_board: 10,
      storage_mb: 100,
      api_access: false,
    },
  },

  pro: {
    name: 'Pro',
    price: 29,
    credits: 5000,
    features: [
      'Unlimited boards',
      'Unlimited AI assistants',
      'All models (GPT-4o, Claude Sonnet, etc.)',
      '10 GB storage',
      'Priority support',
      'Advanced analytics',
    ],
    limits: {
      boards: -1, // unlimited
      assistants_per_board: -1,
      storage_mb: 10000,
      api_access: false,
    },
  },

  power: {
    name: 'Power User',
    price: 99,
    credits: 20000,
    features: [
      'Everything in Pro',
      'API access',
      'Webhooks & automation',
      '100 GB storage',
      'Custom integrations',
      'Dedicated support',
      'SSO (coming soon)',
    ],
    limits: {
      boards: -1,
      assistants_per_board: -1,
      storage_mb: 100000,
      api_access: true,
    },
  },
}
```

---

## Phase 5: API & Integrations
**Duration:** 2-3 weeks
**Priority:** MEDIUM-HIGH - Enables power users

### Week 12-13: Public API

#### 5.1 API Key Management

**API key model:**

```typescript
// models/api-key.ts
interface APIKey {
  id: string
  workspace_id: string
  name: string
  key_hash: string // bcrypt hash of actual key
  key_preview: string // Last 4 characters for display
  scopes: string[] // ['boards:read', 'conversations:write', etc.]
  rate_limit: number // requests per minute
  last_used_at?: string
  expires_at?: string
  created_by: string
  created_at: string
}
```

**Generate API keys:**

```typescript
// lib/api-keys.ts
import { randomBytes } from 'crypto'
import bcrypt from 'bcrypt'

export async function createAPIKey(
  workspaceId: string,
  name: string,
  scopes: string[]
) {
  // Generate random key: mmai_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
  const keyBytes = randomBytes(32).toString('hex')
  const apiKey = `mmai_${keyBytes}`

  // Hash for storage
  const keyHash = await bcrypt.hash(apiKey, 10)

  // Save to database
  const { data, error } = await supabase
    .from('api_keys')
    .insert({
      workspace_id: workspaceId,
      name,
      key_hash: keyHash,
      key_preview: apiKey.slice(-4),
      scopes,
      rate_limit: 100, // 100 requests per minute
    })
    .select()
    .single()

  // Return full key only once
  return { apiKey, record: data }
}

export async function validateAPIKey(key: string) {
  const { data: keys } = await supabase
    .from('api_keys')
    .select('*')
    .limit(100) // Get all active keys

  for (const record of keys) {
    const isValid = await bcrypt.compare(key, record.key_hash)
    if (isValid) {
      // Update last used
      await supabase
        .from('api_keys')
        .update({ last_used_at: new Date().toISOString() })
        .eq('id', record.id)

      return record
    }
  }

  return null
}
```

**API key UI:**

```typescript
// app/dashboard/settings/api-keys/page.tsx
export default function APIKeysPage() {
  const [keys, setKeys] = useState([])
  const [showNewKey, setShowNewKey] = useState(false)
  const [newKey, setNewKey] = useState('')

  const handleCreateKey = async () => {
    const { apiKey } = await createAPIKey(workspace.id, 'My API Key', [
      'boards:read',
      'conversations:write',
    ])
    setNewKey(apiKey)
    setShowNewKey(true)
  }

  return (
    <div>
      <h1>API Keys</h1>

      {showNewKey && (
        <Alert variant="success">
          <h3>API Key Created</h3>
          <p>Save this key - it won't be shown again!</p>
          <code>{newKey}</code>
        </Alert>
      )}

      <Button onClick={handleCreateKey}>Create New Key</Button>

      <Table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Key</th>
            <th>Scopes</th>
            <th>Last Used</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {keys.map(key => (
            <tr key={key.id}>
              <td>{key.name}</td>
              <td>mmai_****{key.key_preview}</td>
              <td>{key.scopes.join(', ')}</td>
              <td>{key.last_used_at || 'Never'}</td>
              <td>
                <Button onClick={() => revokeKey(key.id)}>Revoke</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </div>
  )
}
```

#### 5.2 Public API Endpoints

**API authentication middleware:**

```typescript
// lib/api/auth.ts
export async function authenticateAPIRequest(request: Request) {
  // Check for API key in header or query param
  const apiKey =
    request.headers.get('x-api-key') ||
    new URL(request.url).searchParams.get('api_key')

  if (!apiKey) {
    throw new Error('API key required')
  }

  const keyRecord = await validateAPIKey(apiKey)

  if (!keyRecord) {
    throw new Error('Invalid API key')
  }

  // Check rate limit
  const rateLimitOk = await checkRateLimit(keyRecord.id, keyRecord.rate_limit)
  if (!rateLimitOk) {
    throw new Error('Rate limit exceeded')
  }

  return keyRecord
}
```

**API endpoints (following Poppy's pattern):**

```typescript
// app/api/v1/conversation/route.ts
export async function POST(request: Request) {
  try {
    const apiKey = await authenticateAPIRequest(request)
    const { boardId, assistantId, message, model } = await request.json()

    // Verify access
    await verifyWorkspaceAccess(apiKey.workspace_id, boardId)

    // Create or get conversation
    const conversation = await getOrCreateConversation(boardId, assistantId)

    // Get connected sources
    const assistant = await getAssistant(assistantId)
    const sources = await getSources(assistant.connected_source_ids)

    // Retrieve context from knowledge base
    const context = await retrieveContext(message, boardId, 5)

    // Generate response
    const response = await generate({
      model: model || assistant.default_model,
      systemPrompt: assistant.custom_system_prompt || getPresetPrompt(assistant.preset_type),
      messages: [
        ...conversation.messages,
        { role: 'user', content: message },
      ],
      context,
    })

    // Save messages
    await saveMessage(conversation.id, 'user', message)
    await saveMessage(conversation.id, 'assistant', response)

    // Deduct credits
    await deductCredits(apiKey.workspace_id, calculateCost(model), `AI message: ${model}`)

    return Response.json({ response, conversationId: conversation.id })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 400 })
  }
}

// app/api/v1/conversation/[conversationId]/route.ts
export async function POST(
  request: Request,
  { params }: { params: { conversationId: string } }
) {
  const apiKey = await authenticateAPIRequest(request)
  const { message, model } = await request.json()

  const conversation = await getConversation(params.conversationId)
  await verifyWorkspaceAccess(apiKey.workspace_id, conversation.board_id)

  // Continue conversation...
  // (Similar to above)
}

// app/api/v1/boards/route.ts
export async function GET(request: Request) {
  const apiKey = await authenticateAPIRequest(request)

  const boards = await supabase
    .from('boards')
    .select('*')
    .eq('workspace_id', apiKey.workspace_id)

  return Response.json(boards.data)
}

// app/api/v1/boards/[boardId]/sources/route.ts
export async function POST(
  request: Request,
  { params }: { params: { boardId: string } }
) {
  const apiKey = await authenticateAPIRequest(request)
  const { type, url, content } = await request.json()

  await verifyWorkspaceAccess(apiKey.workspace_id, params.boardId)

  // Create source
  const source = await createSource({
    board_id: params.boardId,
    type,
    url,
    content,
  })

  // Trigger processing
  await processSourceQueue.add('process', { sourceId: source.id })

  return Response.json(source)
}
```

**API documentation:**

```markdown
# MommyAI API Documentation

Base URL: `https://api.mommyai.com/v1`

## Authentication

Include your API key in the `x-api-key` header or as `api_key` query parameter.

```bash
curl -H "x-api-key: mmai_xxxxxxxxxxxxxxxx" \
  https://api.mommyai.com/v1/boards
```

## Endpoints

### GET /boards
List all boards in your workspace.

### POST /conversation
Start a new conversation with an AI assistant.

**Request:**
```json
{
  "boardId": "uuid",
  "assistantId": "uuid",
  "message": "Summarize the key points from the video",
  "model": "gpt-4o"
}
```

**Response:**
```json
{
  "response": "Here are the key points...",
  "conversationId": "uuid"
}
```

### POST /conversation/{conversationId}
Continue an existing conversation.

### POST /boards/{boardId}/sources
Add a new source to a board.

**Request:**
```json
{
  "type": "video",
  "url": "https://youtube.com/watch?v=xxx"
}
```
```

### Week 13-14: Webhooks & Automation

#### 5.3 Webhook System

**Webhook events:**

```typescript
// models/webhook.ts
interface Webhook {
  id: string
  workspace_id: string
  url: string
  events: string[] // ['source.processed', 'conversation.completed', etc.]
  secret: string // For signature verification
  active: boolean
  created_at: string
}

type WebhookEvent =
  | 'source.created'
  | 'source.processed'
  | 'conversation.started'
  | 'conversation.message'
  | 'board.created'
  | 'board.updated'
```

**Trigger webhooks:**

```typescript
// lib/webhooks.ts
import crypto from 'crypto'

export async function triggerWebhook(
  workspaceId: string,
  event: WebhookEvent,
  data: any
) {
  const webhooks = await getWebhooks(workspaceId, event)

  for (const webhook of webhooks) {
    if (!webhook.active) continue

    const payload = {
      event,
      data,
      timestamp: new Date().toISOString(),
    }

    // Generate signature
    const signature = crypto
      .createHmac('sha256', webhook.secret)
      .update(JSON.stringify(payload))
      .digest('hex')

    // Send webhook
    try {
      await fetch(webhook.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-MommyAI-Signature': signature,
          'X-MommyAI-Event': event,
        },
        body: JSON.stringify(payload),
      })
    } catch (error) {
      console.error('Webhook delivery failed:', error)
      // Log failure, retry later
    }
  }
}

// Usage after source processing:
await triggerWebhook(workspaceId, 'source.processed', {
  sourceId: source.id,
  boardId: source.board_id,
  type: source.type,
  url: source.url,
  content: source.content,
})
```

#### 5.4 Zapier/n8n Integration Templates

**Zapier integration example:**

```json
{
  "version": "1.0.0",
  "platformVersion": "14.1.0",
  "authentication": {
    "type": "custom",
    "fields": [
      {
        "key": "api_key",
        "label": "API Key",
        "required": true,
        "type": "string",
        "helpText": "Get your API key from Settings > API Keys"
      }
    ],
    "test": {
      "url": "https://api.mommyai.com/v1/auth/test"
    }
  },
  "triggers": {
    "source_processed": {
      "noun": "Source",
      "display": {
        "label": "New Source Processed",
        "description": "Triggers when a source (video, document, etc.) is processed."
      },
      "operation": {
        "type": "polling",
        "url": "https://api.mommyai.com/v1/sources/recent"
      }
    }
  },
  "creates": {
    "create_conversation": {
      "noun": "Conversation",
      "display": {
        "label": "Ask AI Assistant",
        "description": "Send a message to an AI assistant and get a response."
      },
      "operation": {
        "url": "https://api.mommyai.com/v1/conversation",
        "method": "POST"
      },
      "inputFields": [
        { "key": "boardId", "label": "Board ID", "required": true },
        { "key": "assistantId", "label": "Assistant ID", "required": true },
        { "key": "message", "label": "Message", "required": true },
        { "key": "model", "label": "AI Model", "default": "gpt-4o-mini" }
      ]
    }
  }
}
```

**n8n workflow example:**

```json
{
  "name": "MommyAI Content Pipeline",
  "nodes": [
    {
      "name": "Webhook",
      "type": "n8n-nodes-base.webhook",
      "parameters": {
        "path": "mommyai-source"
      }
    },
    {
      "name": "MommyAI - Ask Assistant",
      "type": "n8n-nodes-base.httpRequest",
      "parameters": {
        "url": "https://api.mommyai.com/v1/conversation",
        "method": "POST",
        "authentication": "headerAuth",
        "body": {
          "boardId": "={{$json.boardId}}",
          "assistantId": "={{$json.assistantId}}",
          "message": "Create a Twitter thread from this source"
        }
      }
    },
    {
      "name": "Twitter - Post Thread",
      "type": "n8n-nodes-base.twitter",
      "parameters": {
        "text": "={{$json.response}}"
      }
    }
  ],
  "connections": {
    "Webhook": { "main": [[{ "node": "MommyAI - Ask Assistant" }]] },
    "MommyAI - Ask Assistant": { "main": [[{ "node": "Twitter - Post Thread" }]] }
  }
}
```

---

## Phase 6: Polish & Launch
**Duration:** 2-3 weeks
**Priority:** HIGH - Essential for user experience

### Week 14-15: Performance & Optimization

#### 6.1 Performance Improvements

**Implement lazy loading:**

```typescript
// components/WhiteboardCanvas.tsx
const VideoNode = lazy(() => import('./nodes/VideoNode'))
const AudioNode = lazy(() => import('./nodes/AudioNode'))
const DocumentNode = lazy(() => import('./nodes/DocumentNode'))

<Suspense fallback={<NodeSkeleton />}>
  <VideoNode {...props} />
</Suspense>
```

**Optimize large boards:**

```typescript
// Only render visible nodes
const [viewport, setViewport] = useState({ x: 0, y: 0, zoom: 1 })

const visibleNodes = useMemo(() => {
  return nodes.filter(node => isNodeInViewport(node, viewport))
}, [nodes, viewport])
```

**Database query optimization:**

```sql
-- Add indexes
CREATE INDEX idx_sources_board_id ON sources(board_id);
CREATE INDEX idx_embeddings_board_id ON embeddings(board_id);
CREATE INDEX idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX idx_boards_workspace_id ON boards(workspace_id);

-- Optimize queries
SELECT * FROM sources
WHERE board_id = $1
AND processed = true
ORDER BY created_at DESC
LIMIT 50;
```

**Caching strategy:**

```typescript
// Redis caching for frequently accessed data
import Redis from 'ioredis'

const redis = new Redis(process.env.REDIS_URL)

export async function getCachedBoard(boardId: string) {
  const cached = await redis.get(`board:${boardId}`)
  if (cached) return JSON.parse(cached)

  const board = await fetchBoardFromDB(boardId)
  await redis.setex(`board:${boardId}`, 300, JSON.stringify(board)) // 5 min TTL

  return board
}
```

#### 6.2 Error Handling & User Feedback

**Global error boundary:**

```typescript
// components/ErrorBoundary.tsx
export class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null }

  static getDerivedStateFromError(error: any) {
    return { hasError: true, error }
  }

  componentDidCatch(error: any, info: any) {
    console.error('Error caught:', error, info)
    // Send to error tracking (Sentry, etc.)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-page">
          <h1>Something went wrong</h1>
          <p>{this.state.error?.message}</p>
          <Button onClick={() => window.location.reload()}>
            Reload Page
          </Button>
        </div>
      )
    }

    return this.props.children
  }
}
```

**Toast notifications:**

```typescript
// lib/toast.ts
import { toast } from 'sonner'

export const showSuccess = (message: string) => {
  toast.success(message)
}

export const showError = (message: string) => {
  toast.error(message)
}

export const showLoading = (message: string) => {
  return toast.loading(message)
}

// Usage:
const loadingToast = showLoading('Processing video...')
try {
  await processVideo(videoId)
  toast.success('Video processed!', { id: loadingToast })
} catch (error) {
  toast.error('Failed to process video', { id: loadingToast })
}
```

### Week 15-16: Testing & Documentation

#### 6.3 Testing Strategy

**Unit tests:**

```typescript
// lib/__tests__/chunking.test.ts
import { chunkText } from '../chunking'

describe('chunkText', () => {
  it('should split text into chunks', () => {
    const text = 'Lorem ipsum...'.repeat(100)
    const chunks = chunkText(text, 500, 100)

    expect(chunks.length).toBeGreaterThan(1)
    expect(chunks[0].length).toBeLessThanOrEqual(500)
  })

  it('should maintain overlap between chunks', () => {
    const text = 'Sentence one. Sentence two. Sentence three.'
    const chunks = chunkText(text, 30, 10)

    // Check overlap
    const overlap = chunks[0].slice(-10)
    expect(chunks[1].startsWith(overlap)).toBe(true)
  })
})
```

**Integration tests:**

```typescript
// __tests__/api/conversation.test.ts
import { POST } from '@/app/api/v1/conversation/route'

describe('POST /api/v1/conversation', () => {
  it('should create a conversation and return response', async () => {
    const request = new Request('http://localhost/api/v1/conversation', {
      method: 'POST',
      headers: {
        'x-api-key': 'test_key',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        boardId: 'test-board-id',
        assistantId: 'test-assistant-id',
        message: 'Hello',
        model: 'gpt-4o-mini',
      }),
    })

    const response = await POST(request)
    const data = await response.json()

    expect(response.status).toBe(200)
    expect(data.response).toBeDefined()
    expect(data.conversationId).toBeDefined()
  })
})
```

**E2E tests (Playwright):**

```typescript
// e2e/board-workflow.spec.ts
import { test, expect } from '@playwright/test'

test('user can create board and add nodes', async ({ page }) => {
  await page.goto('http://localhost:3000/dashboard')

  // Create board
  await page.click('button:has-text("New Board")')
  await page.fill('input[name="title"]', 'Test Board')
  await page.click('button:has-text("Create")')

  // Add text node
  await page.click('[data-testid="add-text-node"]')
  await page.fill('[data-testid="text-node-input"]', 'Hello world')

  // Verify node exists
  await expect(page.locator('text=Hello world')).toBeVisible()
})
```

#### 6.4 Documentation

**User documentation structure:**

```
docs/
├── getting-started/
│   ├── quickstart.md
│   ├── creating-your-first-board.md
│   └── adding-sources.md
├── features/
│   ├── ai-assistants.md
│   ├── video-transcription.md
│   ├── knowledge-base.md
│   └── real-time-collaboration.md
├── api/
│   ├── authentication.md
│   ├── endpoints.md
│   ├── rate-limits.md
│   └── webhooks.md
├── integrations/
│   ├── zapier.md
│   ├── n8n.md
│   └── slack.md
└── troubleshooting/
    ├── common-issues.md
    └── faq.md
```

**Interactive onboarding:**

```typescript
// components/Onboarding.tsx
export function Onboarding() {
  const steps = [
    {
      target: '[data-tour="create-board"]',
      content: 'Create your first board to organize your content and ideas.',
    },
    {
      target: '[data-tour="add-source"]',
      content: 'Add sources like videos, documents, or links to your board.',
    },
    {
      target: '[data-tour="create-assistant"]',
      content: 'Create AI assistants specialized for different tasks.',
    },
    {
      target: '[data-tour="connect-nodes"]',
      content: 'Connect sources to assistants to give them context.',
    },
  ]

  return <Joyride steps={steps} continuous showProgress />
}
```

---

## Technical Stack Recommendations

### Frontend
- **Framework:** Next.js 14+ (App Router)
- **Language:** TypeScript
- **UI Library:** React 18+
- **Canvas:** React Flow 11+
- **Components:** Shadcn/UI + Radix UI
- **Styling:** Tailwind CSS
- **State:** Zustand (local) + React Query (server)
- **Forms:** React Hook Form + Zod validation
- **Icons:** Lucide React
- **Notifications:** Sonner

### Backend
- **Runtime:** Node.js 18+
- **API:** Next.js API Routes or tRPC
- **Database:** PostgreSQL 15+ (Supabase recommended)
- **Vector DB:** pgvector or Pinecone
- **Object Storage:** S3-compatible (Supabase Storage, AWS S3, Cloudflare R2)
- **Queue:** BullMQ + Redis
- **Real-time:** Supabase Realtime or Socket.io
- **Caching:** Redis

### AI & Processing
- **AI Providers:** OpenAI, Anthropic, Google AI
- **Embeddings:** OpenAI text-embedding-3-small
- **Transcription:** Whisper API, YouTube Transcript API
- **Vision:** GPT-4o Vision API
- **Document Parsing:** pdf-parse, cheerio

### DevOps
- **Hosting:** Vercel (frontend), Railway/Render (backend)
- **Database:** Supabase or Railway PostgreSQL
- **Monitoring:** Sentry, LogRocket
- **Analytics:** PostHog or Mixpanel
- **Email:** Resend or SendGrid

---

## Database Schema

```sql
-- Users table (handled by Supabase Auth)

-- Workspaces (multi-tenancy)
CREATE TABLE workspaces (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  plan TEXT DEFAULT 'free' CHECK (plan IN ('free', 'pro', 'power')),
  credits_used INTEGER DEFAULT 0,
  credits_limit INTEGER DEFAULT 1000,
  storage_used_mb INTEGER DEFAULT 0,
  storage_limit_mb INTEGER DEFAULT 100,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Workspace members
CREATE TABLE workspace_members (
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'member' CHECK (role IN ('owner', 'admin', 'member')),
  joined_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (workspace_id, user_id)
);

-- Boards
CREATE TABLE boards (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  thumbnail_url TEXT,
  owner_id UUID REFERENCES auth.users(id) NOT NULL,
  is_template BOOLEAN DEFAULT false,
  settings JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Board state (nodes & edges)
CREATE TABLE board_state (
  board_id UUID PRIMARY KEY REFERENCES boards(id) ON DELETE CASCADE,
  nodes JSONB NOT NULL DEFAULT '[]',
  edges JSONB NOT NULL DEFAULT '[]',
  viewport JSONB DEFAULT '{"x":0,"y":0,"zoom":1}',
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Sources (content nodes)
CREATE TABLE sources (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  node_id TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('video', 'audio', 'document', 'link', 'image', 'text')),
  url TEXT,
  file_path TEXT,
  metadata JSONB DEFAULT '{}',
  content TEXT,
  processed BOOLEAN DEFAULT false,
  indexed BOOLEAN DEFAULT false,
  processing_error TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Assistants
CREATE TABLE assistants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE NOT NULL,
  node_id TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  preset_type TEXT,
  custom_system_prompt TEXT,
  default_model TEXT DEFAULT 'gpt-4o-mini',
  temperature FLOAT DEFAULT 0.7,
  max_tokens INTEGER DEFAULT 2000,
  output_format TEXT DEFAULT 'text',
  connected_source_ids UUID[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Conversations
CREATE TABLE conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE NOT NULL,
  assistant_id UUID REFERENCES assistants(id) ON DELETE SET NULL,
  title TEXT,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Messages
CREATE TABLE messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE NOT NULL,
  role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
  content TEXT NOT NULL,
  model_used TEXT,
  tokens_used INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Embeddings
CREATE TABLE embeddings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source_id UUID REFERENCES sources(id) ON DELETE CASCADE NOT NULL,
  board_id UUID REFERENCES boards(id) ON DELETE CASCADE NOT NULL,
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  chunk_text TEXT NOT NULL,
  chunk_index INTEGER NOT NULL,
  embedding vector(1536),
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- API Keys
CREATE TABLE api_keys (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  key_hash TEXT NOT NULL,
  key_preview TEXT NOT NULL,
  scopes TEXT[] DEFAULT '{}',
  rate_limit INTEGER DEFAULT 100,
  last_used_at TIMESTAMPTZ,
  expires_at TIMESTAMPTZ,
  created_by UUID REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Webhooks
CREATE TABLE webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  url TEXT NOT NULL,
  events TEXT[] NOT NULL,
  secret TEXT NOT NULL,
  active BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Credit usage tracking
CREATE TABLE credit_usage (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  workspace_id UUID REFERENCES workspaces(id) ON DELETE CASCADE NOT NULL,
  amount INTEGER NOT NULL,
  reason TEXT NOT NULL,
  metadata JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_boards_workspace ON boards(workspace_id);
CREATE INDEX idx_sources_board ON sources(board_id);
CREATE INDEX idx_sources_workspace ON sources(workspace_id);
CREATE INDEX idx_embeddings_board ON embeddings(board_id);
CREATE INDEX idx_embeddings_source ON embeddings(source_id);
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_conversations_board ON conversations(board_id);
CREATE INDEX idx_assistants_board ON assistants(board_id);

-- Vector similarity index
CREATE INDEX ON embeddings USING ivfflat (embedding vector_cosine_ops) WITH (lists = 100);
```

---

## API Endpoints Design

### Authentication
```
POST   /api/auth/login
POST   /api/auth/signup
POST   /api/auth/logout
POST   /api/auth/reset-password
```

### Workspaces
```
GET    /api/workspaces
POST   /api/workspaces
GET    /api/workspaces/:id
PATCH  /api/workspaces/:id
DELETE /api/workspaces/:id
GET    /api/workspaces/:id/usage
```

### Boards
```
GET    /api/boards
POST   /api/boards
GET    /api/boards/:id
PATCH  /api/boards/:id
DELETE /api/boards/:id
POST   /api/boards/:id/duplicate
```

### Board State
```
GET    /api/boards/:id/state
PUT    /api/boards/:id/state
PATCH  /api/boards/:id/nodes
PATCH  /api/boards/:id/edges
```

### Sources
```
GET    /api/boards/:boardId/sources
POST   /api/boards/:boardId/sources
GET    /api/sources/:id
PATCH  /api/sources/:id
DELETE /api/sources/:id
POST   /api/sources/:id/process
```

### Assistants
```
GET    /api/boards/:boardId/assistants
POST   /api/boards/:boardId/assistants
GET    /api/assistants/:id
PATCH  /api/assistants/:id
DELETE /api/assistants/:id
```

### Conversations
```
POST   /api/conversation                    # Create new
POST   /api/conversation/:id                # Continue
GET    /api/conversations/:id               # Get history
GET    /api/conversations/:id/messages      # Get messages
DELETE /api/conversations/:id               # Delete
```

### API Keys
```
GET    /api/api-keys
POST   /api/api-keys
DELETE /api/api-keys/:id
```

### Webhooks
```
GET    /api/webhooks
POST   /api/webhooks
PATCH  /api/webhooks/:id
DELETE /api/webhooks/:id
```

### Public API (v1)
```
GET    /api/v1/boards
POST   /api/v1/conversation
POST   /api/v1/conversation/:id
POST   /api/v1/boards/:boardId/sources
GET    /api/v1/boards/:boardId/sources
```

---

## Security Considerations

### 1. Authentication & Authorization
- ✅ Use Supabase Auth or similar proven solution
- ✅ Implement Row-Level Security (RLS) on all tables
- ✅ Verify workspace access on every API call
- ✅ Hash API keys with bcrypt
- ✅ Rate limit all public endpoints

### 2. Data Protection
- ✅ Encrypt sensitive data at rest
- ✅ Use HTTPS everywhere
- ✅ Sanitize all user inputs
- ✅ Validate file uploads (type, size, content)
- ✅ Implement CORS properly

### 3. AI Safety
- ✅ Content moderation on user prompts
- ✅ Rate limiting on AI API calls
- ✅ Cost caps per workspace
- ✅ Prompt injection protection
- ✅ Output filtering

### 4. File Upload Security
- ✅ Virus scanning for uploads
- ✅ File type whitelisting
- ✅ Size limits enforced
- ✅ S3 bucket policies (private by default)
- ✅ Signed URLs for temporary access

### 5. API Security
- ✅ API key rotation
- ✅ Webhook signature verification
- ✅ Rate limiting per key
- ✅ IP whitelisting (optional)
- ✅ Audit logging

---

## Success Metrics

### Phase 1-2 (Foundation)
- [ ] User signup and authentication working
- [ ] Boards persist to database
- [ ] Real AI responses from multiple models
- [ ] Vector search returning relevant results

### Phase 3 (Content Processing)
- [ ] YouTube videos transcribed automatically
- [ ] PDFs extracted and searchable
- [ ] Audio files transcribed
- [ ] Embeddings generated for all content

### Phase 4 (Advanced)
- [ ] Real-time collaboration working
- [ ] Multiple users see changes live
- [ ] Credit system tracking usage
- [ ] Usage dashboard showing analytics

### Phase 5 (API)
- [ ] Public API endpoints functional
- [ ] API keys can be created/revoked
- [ ] Webhooks delivering events
- [ ] Zapier/n8n templates available

### Phase 6 (Launch)
- [ ] App loads in under 3 seconds
- [ ] No critical bugs in production
- [ ] Documentation complete
- [ ] Onboarding flow tested

---

## Launch Checklist

### Pre-Launch
- [ ] Security audit completed
- [ ] Load testing passed (100 concurrent users)
- [ ] Backup and disaster recovery plan
- [ ] Monitoring and alerting set up
- [ ] Terms of Service and Privacy Policy
- [ ] Pricing page and checkout flow
- [ ] Email templates for notifications
- [ ] Customer support system (Intercom, etc.)

### Launch Day
- [ ] Deploy to production
- [ ] DNS configured
- [ ] SSL certificates active
- [ ] Analytics tracking live
- [ ] Error monitoring active
- [ ] Social media accounts ready
- [ ] Landing page live
- [ ] Blog post announcing launch

### Post-Launch
- [ ] Monitor error rates
- [ ] Track user signups and retention
- [ ] Gather user feedback
- [ ] Fix critical bugs within 24h
- [ ] Weekly feature releases
- [ ] Monthly performance reviews

---

## Next Steps (Immediate Actions)

1. **Week 1:**
   - Set up Supabase project
   - Create database schema
   - Implement real authentication
   - Migrate boardStore to database

2. **Week 2:**
   - Set up object storage
   - Implement file uploads
   - Create background job queue
   - Begin AI API integration

3. **Week 3:**
   - Integrate OpenAI, Anthropic, Google APIs
   - Implement streaming responses
   - Set up vector database
   - Create embedding generation pipeline

4. **Week 4:**
   - Build RAG retrieval system
   - Test end-to-end AI conversations
   - Implement assistant presets
   - Begin video transcription work

**Priority Order:**
1. Database & Auth (critical)
2. AI Integration (core value)
3. Content Processing (enables use cases)
4. Real-time Collaboration (differentiator)
5. API & Integrations (power users)
6. Polish & Launch (market ready)

---

## Conclusion

This plan transforms MommyAI from a frontend prototype into a production-ready Poppy AI-style platform. The architecture is designed to scale, the feature set addresses real creator needs, and the implementation is practical for a full-stack developer.

**Key Success Factors:**
- Start with foundation (database, auth, AI)
- Build iteratively, test continuously
- Focus on core value (AI-powered content workflows)
- Launch with MVP, iterate based on feedback

**Timeline:** 12-16 weeks to launch
**Estimated Cost:** $200-500/month in infrastructure
**Team:** 1-2 full-stack developers

The app will enable content creators to:
- Turn scattered content into structured knowledge systems
- Generate viral content and ads with AI assistance
- Automate repetitive content workflows
- Collaborate visually on content projects
- Build custom content pipelines with APIs

This is a viable SaaS product with clear differentiation from generic chat tools and strong positioning in the content creation market.
