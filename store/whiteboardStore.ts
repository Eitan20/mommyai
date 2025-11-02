import { create } from 'zustand';
import { Node, Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from 'reactflow';

export type NodeData = {
  label?: string;
  content?: string;
  url?: string;
  imageUrl?: string;
  mediaUrl?: string;
  mediaType?: 'video' | 'audio';
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  width?: number;
  height?: number;
};

interface WhiteboardState {
  nodes: Node<NodeData>[];
  edges: Edge[];
  selectedNodeId: string | null;

  // Actions
  setNodes: (nodes: Node<NodeData>[]) => void;
  setEdges: (edges: Edge[]) => void;
  onNodesChange: (changes: NodeChange[]) => void;
  onEdgesChange: (changes: EdgeChange[]) => void;
  addNode: (type: string, position: { x: number; y: number }, data?: Partial<NodeData>) => void;
  updateNodeData: (nodeId: string, data: Partial<NodeData>) => void;
  deleteNode: (nodeId: string) => void;
  setSelectedNodeId: (nodeId: string | null) => void;
  clearBoard: () => void;
  groupSelectedNodes: () => void;
}

const useWhiteboardStore = create<WhiteboardState>((set, get) => ({
  nodes: [],
  edges: [],
  selectedNodeId: null,

  setNodes: (nodes) => set({ nodes }),
  setEdges: (edges) => set({ edges }),

  onNodesChange: (changes) => {
    set({
      nodes: applyNodeChanges(changes, get().nodes),
    });
  },

  onEdgesChange: (changes) => {
    set({
      edges: applyEdgeChanges(changes, get().edges),
    });
  },

  addNode: (type, position, data = {}) => {
    const newNode: Node<NodeData> = {
      id: `${type}-${Date.now()}`,
      type,
      position,
      data: {
        label: `New ${type}`,
        backgroundColor: '#ffffff',
        textColor: '#000000',
        fontSize: 14,
        ...data,
      },
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  updateNodeData: (nodeId, data) => {
    set({
      nodes: get().nodes.map((node) =>
        node.id === nodeId
          ? { ...node, data: { ...node.data, ...data } }
          : node
      ),
    });
  },

  deleteNode: (nodeId) => {
    set({
      nodes: get().nodes.filter((node) => node.id !== nodeId),
      edges: get().edges.filter(
        (edge) => edge.source !== nodeId && edge.target !== nodeId
      ),
    });
  },

  setSelectedNodeId: (nodeId) => set({ selectedNodeId: nodeId }),

  clearBoard: () => set({ nodes: [], edges: [], selectedNodeId: null }),

  groupSelectedNodes: () => {
    const selectedNodes = get().nodes.filter((node) => node.selected);
    if (selectedNodes.length < 2) return;

    // Calculate bounding box of selected nodes
    const minX = Math.min(...selectedNodes.map((n) => n.position.x));
    const minY = Math.min(...selectedNodes.map((n) => n.position.y));
    const maxX = Math.max(...selectedNodes.map((n) => n.position.x + (n.width || 200)));
    const maxY = Math.max(...selectedNodes.map((n) => n.position.y + (n.height || 100)));

    const groupNode: Node<NodeData> = {
      id: `group-${Date.now()}`,
      type: 'group',
      position: { x: minX - 20, y: minY - 20 },
      data: {
        label: 'Group',
        width: maxX - minX + 40,
        height: maxY - minY + 40,
      },
      style: {
        width: maxX - minX + 40,
        height: maxY - minY + 40,
      },
    };

    set({ nodes: [...get().nodes, groupNode] });
  },
}));

export default useWhiteboardStore;
