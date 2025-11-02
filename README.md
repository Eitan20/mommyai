# MommyAI - Visual Whiteboard Workspace

An AI-powered, free-form canvas (mind-map style) for organizing ideas and content. Create, arrange, and connect text, links, images, and media on an infinite whiteboard - similar to Figma or Miro, but with built-in AI assistance.

## Features

### Core Functionality
- **Infinite Canvas**: Drag, zoom, and pan across an unlimited workspace
- **Multiple Node Types**:
  - 📝 **Text Nodes**: Rich text content with customizable colors and fonts
  - 🖼️ **Image Nodes**: Display images from URLs
  - 🔗 **Link Nodes**: Organize and quick-access web links
  - 🎥 **Media Nodes**: Embed videos and audio
  - 📁 **Group Nodes**: Organize related elements together

### AI-Powered Features
- **AI Assistant**: Get intelligent suggestions for:
  - Content generation
  - Board organization
  - Brainstorming templates
  - Automatic node creation
  - Layout recommendations

### Workspace Features
- **Drag & Drop**: Intuitive node placement and rearrangement
- **Connections**: Link related nodes with visual connections
- **Grouping**: Select and group multiple nodes together
- **Mini-Map**: Navigate large boards easily
- **Auto-Save**: Automatic persistence to local storage
- **Export/Import**: Save and share your boards as JSON files

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

## Usage

### Adding Nodes
1. Click the toolbar buttons at the top to add different types of nodes:
   - Text icon: Add a text node
   - Image icon: Add an image node
   - Link icon: Add a link node
   - Video icon: Add a media node
   - Folder icon: Add a group container

### Editing Nodes
- Click on any node to select it
- Edit content directly within the node
- Delete nodes using the trash icon
- Drag nodes to reposition them

### Connecting Nodes
- Drag from the connection point (small circle) at the bottom of a node
- Drop on the connection point at the top of another node
- Creates a visual link between related ideas

### AI Assistant
1. Click the sparkle (✨) icon in the toolbar
2. Type your request in the AI panel
3. Get intelligent suggestions and auto-generated content

Examples:
- "Create a brainstorming template"
- "Add a text node about project planning"
- "Help me organize my ideas"

### Grouping Elements
1. Select multiple nodes (Shift + Click)
2. Click the "Group Selected" button
3. Nodes will be organized in a group container

### Export & Import
- **Export**: Save your board as a JSON file
- **Import**: Load a previously saved board

## Project Structure

```
mommyai/
├── app/
│   ├── layout.tsx         # Root layout
│   ├── page.tsx           # Home page
│   └── globals.css        # Global styles
├── components/
│   ├── nodes/
│   │   ├── TextNode.tsx   # Text node component
│   │   ├── ImageNode.tsx  # Image node component
│   │   ├── LinkNode.tsx   # Link node component
│   │   ├── MediaNode.tsx  # Media node component
│   │   └── GroupNode.tsx  # Group container component
│   ├── WhiteboardWorkspace.tsx  # Main canvas component
│   ├── Toolbar.tsx        # Top toolbar
│   └── AIAssistPanel.tsx  # AI assistant panel
├── store/
│   └── whiteboardStore.ts # Zustand state management
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

## Future Enhancements

- [ ] Real-time collaboration
- [ ] Cloud storage integration
- [ ] Advanced AI features (OpenAI integration)
- [ ] Templates library
- [ ] Advanced export options (PDF, PNG)
- [ ] Undo/Redo functionality
- [ ] Keyboard shortcuts panel
- [ ] Mobile responsive design
- [ ] Custom themes

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Support

For issues, questions, or suggestions, please open an issue on GitHub.

---

Built with ❤️ using Next.js and React Flow
