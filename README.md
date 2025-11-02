# MommyAI - Visual Whiteboard Workspace

An AI-powered, free-form canvas for organizing ideas and content - like Figma or Miro, but with built-in AI support. Create mind maps, brainstorm, and collaborate on an infinite whiteboard with intelligent assistance.

## ✨ User Flow

```
Login → Dashboard → Select/Create Board → Canvas (left) + AI Chat (right) → Collaborate
```

The application follows an intuitive workflow:
1. **Authentication**: Secure login/signup
2. **Dashboard**: Manage multiple boards
3. **Board Workspace**: Split-panel interface with canvas on the left and AI chat on the right
4. **Real-time Collaboration**: See other users' cursors and edits

## 🎨 Features

### Authentication & Board Management
- **User Authentication**: Secure login and signup system
- **Dashboard**: Create, organize, and manage multiple boards
- **Board Gallery**: Grid and list views with search functionality
- **Quick Actions**: Duplicate, delete, and organize boards

### Infinite Canvas (Left Panel)
- **Drag & Drop**: Intuitive node placement and rearrangement
- **Multiple Node Types**:
  - 📝 **Text Nodes**: Rich text editor with color picker, font sizes, and formatting
  - 🖼️ **Image Nodes**: Support both URL input and file upload
  - 🔗 **Link Nodes**: Organize and quick-access web links
  - 🎥 **Media Nodes**: Embed videos and audio (URL or file upload)
  - 📁 **Group Nodes**: Container for organizing related elements
- **Visual Connections**: Link nodes to show relationships
- **Mini-Map**: Navigate large boards easily
- **Controls**: Zoom, pan, and fit-to-screen

### AI Chat Panel (Right Panel)
- **Model Selector**: Choose from GPT-4, GPT-3.5, Claude 3, or Gemini Pro
- **Conversational Interface**: Natural language interaction with AI
- **Smart Actions**:
  - Generate content and ideas
  - Create nodes automatically
  - Organize and arrange boards
  - Brainstorming templates
  - Layout suggestions
- **Chat History**: Persistent conversation within each session

### Templates & Quick Actions (Top Bar)
- **Templates**:
  - 💡 Brainstorming
  - 📋 Project Planning
  - 🧠 Mind Map
  - 📊 Kanban Board
- **Add Media Menu**: Quick access to add any node type
- **View Toggles**:
  - Freeform view (default)
  - Mind-map view
  - Full-screen mode

### Collaboration Features
- **User Indicators**: See active collaborators
- **Live Cursors**: Real-time cursor positions with user names
- **Color-coded Users**: Each user has a unique color

### Workspace Features
- **Auto-Save**: Automatic persistence to browser storage
- **Export/Import**: Save and share boards as JSON files
- **Undo/Redo**: (Coming soon)
- **Keyboard Shortcuts**: Efficient navigation and editing

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **UI Library**: React 18
- **Canvas**: React Flow
- **Styling**: Tailwind CSS
- **State Management**: Zustand
- **Icons**: Lucide React

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd mommyai
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Run the development server:
```bash
npm run dev
# or
yarn dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🚀 Usage Guide

### Getting Started

1. **Login/Signup**
   - Visit the app and create an account or login
   - Secure authentication with email and password

2. **Dashboard**
   - View all your boards in grid or list view
   - Search boards by title or description
   - Create new board with "New Board" button
   - Click any board to open it

### Working with the Canvas

#### Adding Elements
Three ways to add nodes:
1. **Templates Menu**: Click "Templates" → Select a template (Brainstorming, Project Planning, etc.)
2. **Add Media Menu**: Click "Add Media" → Choose node type (Text, Image, Link, Media, Group)
3. **AI Assistant**: Ask AI to create nodes for you

#### Editing Text Nodes
- Click to edit content
- Use color picker to change text color
- Use palette icon to change background color
- Select font size from dropdown (Small, Normal, Medium, Large, Extra Large)
- Delete with trash icon

#### Working with Images
- **URL Method**: Paste image URL in the input field
- **File Upload**: Click "Or upload file" to select from your computer
- Images auto-display once loaded

#### Links and Media
- Add titles and URLs to link nodes
- Click external link icon to open links
- Toggle between video and audio for media nodes
- Support for both URL and file upload

#### Connecting Nodes
- Drag from the connection point (bottom circle) of a node
- Drop on the connection point (top circle) of another node
- Creates visual connections showing relationships

### Using the AI Assistant

The AI chat panel on the right provides intelligent assistance:

**Example Prompts:**
- "Create a brainstorming template"
- "Add a text node about user research"
- "Help me organize my ideas"
- "Generate a project planning board"
- "Summarize my current board"

**Model Selection:**
- Click the model selector dropdown
- Choose from GPT-4, GPT-3.5, Claude 3, or Gemini Pro
- Each model has different strengths

### View Modes

- **Freeform**: Default drag-and-drop canvas
- **Mind-map**: Hierarchical organization (button in top bar)
- **Full-screen**: Distraction-free mode (Maximize icon)

### Collaboration

- See active users in the top-right corner
- Watch real-time cursor movements
- Each collaborator has a colored cursor with their name

### Saving and Sharing

- **Auto-save**: All changes automatically saved to browser
- **Export**: Download board as JSON file
- **Import**: Upload previously saved JSON file
- **Board Management**: Duplicate or delete boards from dashboard

## 📁 Project Structure

```
mommyai/
├── app/
│   ├── auth/
│   │   └── page.tsx              # Login/Signup page
│   ├── dashboard/
│   │   └── page.tsx              # Board management dashboard
│   ├── board/
│   │   └── [id]/
│   │       └── page.tsx          # Individual board workspace
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing/redirect page
│   └── globals.css               # Global styles
├── components/
│   ├── nodes/
│   │   ├── TextNode.tsx          # Rich text editor node
│   │   ├── ImageNode.tsx         # Image with upload support
│   │   ├── LinkNode.tsx          # Web link node
│   │   ├── MediaNode.tsx         # Video/audio node
│   │   └── GroupNode.tsx         # Container node
│   ├── WhiteboardCanvas.tsx      # Main canvas (left panel)
│   ├── ChatPanel.tsx             # AI chat (right panel)
│   ├── BoardHeader.tsx           # Top toolbar with controls
│   ├── Toolbar.tsx               # Quick action buttons
│   ├── AIAssistPanel.tsx         # AI panel (legacy)
│   └── CollaborationCursors.tsx  # User cursors overlay
├── store/
│   ├── authStore.ts              # Authentication state
│   ├── boardStore.ts             # Multi-board management
│   └── whiteboardStore.ts        # Canvas state (nodes/edges)
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── next.config.js
```

## Keyboard Shortcuts

- **Delete**: Remove selected node
- **Ctrl/Cmd + Click**: Multi-select nodes
- **Mouse Wheel**: Zoom in/out
- **Click + Drag**: Pan canvas
- **Shift + Drag**: Select multiple nodes

## Customization

### Adding New Node Types
1. Create a new component in `components/nodes/`
2. Register it in `WhiteboardWorkspace.tsx` nodeTypes
3. Add a toolbar button in `Toolbar.tsx`

### Styling
- Modify `app/globals.css` for global styles
- Use Tailwind classes for component-level styling
- Customize node colors in individual node components

## 🎯 Architecture Highlights

### State Management
- **Zustand**: Lightweight and performant state management
- **Persistence**: Auto-save to localStorage with Zustand middleware
- **Multi-board Support**: Each board maintains independent state

### Layout System
- **Two-Panel Design**: Canvas (left) + Chat (right)
- **Responsive**: Resizable panels, collapsible chat
- **Full-screen**: Maximize canvas when needed

### AI Integration
- **Model Agnostic**: Supports multiple AI providers
- **Contextual**: AI understands current board state
- **Action-oriented**: Can create and modify board elements

### Real-time Features
- **Mock Collaboration**: Simulated multi-user cursors (ready for WebSocket integration)
- **Live Updates**: React Flow handles real-time node updates

## 🔮 Future Enhancements

- [ ] Real WebSocket-based collaboration (replace mock)
- [ ] Cloud storage with PostgreSQL/Supabase
- [ ] Actual AI API integration (OpenAI, Anthropic, Google)
- [ ] Advanced export: PDF, PNG, SVG
- [ ] Undo/Redo with command pattern
- [ ] Keyboard shortcuts panel
- [ ] Mobile responsive design
- [ ] Custom themes and color schemes
- [ ] Board sharing and permissions
- [ ] Comments and annotations
- [ ] Version history
- [ ] Infinite canvas optimizations

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and React Flow
