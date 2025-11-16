import { create } from 'zustand';
import { Node, Edge, NodeChange, EdgeChange, applyNodeChanges, applyEdgeChanges } from 'reactflow';

export type NodeData = {
  label?: string;
  content?: string;
  url?: string;
  imageUrl?: string;
  icon?: string;
  mediaUrl?: string;
  mediaType?: 'video' | 'audio';
  backgroundColor?: string;
  textColor?: string;
  fontSize?: number;
  width?: number;
  height?: number;
  childNodes?: string[]; // Track child node IDs for groups
  fileName?: string;
  fileSize?: number;
  pageCount?: number;
  caption?: string;
  recordingDuration?: number;
  conversationId?: string;
  model?: string;
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
  addChildNode: (parentId: string, type: string, position: { x: number; y: number }, data?: Partial<NodeData>) => void;
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
        ...(type === 'group' ? { childNodes: [] } : {}),
        ...data,
      },
      ...(type === 'group' ? {
        style: {
          width: data.width || 400,
          height: data.height || 300,
        },
      } : {}),
    };
    set({ nodes: [...get().nodes, newNode] });
  },

  addChildNode: (parentId, type, position, data = {}) => {
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
      parentNode: parentId,
      extent: 'parent' as const,
      draggable: true,
    };

    // Update parent to track child
    const updatedNodes = get().nodes.map((node) => {
      if (node.id === parentId) {
        const childNodes = node.data.childNodes || [];
        return {
          ...node,
          data: {
            ...node.data,
            childNodes: [...childNodes, newNode.id],
          },
        };
      }
      return node;
    });

    set({ nodes: [...updatedNodes, newNode] });
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
    const nodeToDelete = get().nodes.find((node) => node.id === nodeId);

    // If deleting a group, also delete all its children
    let nodesToDelete = [nodeId];
    if (nodeToDelete?.data.childNodes) {
      nodesToDelete = [...nodesToDelete, ...nodeToDelete.data.childNodes];
    }

    // If deleting a child, remove it from parent's childNodes array
    const updatedNodes = get().nodes.filter((node) => !nodesToDelete.includes(node.id)).map((node) => {
      if (node.data.childNodes) {
        return {
          ...node,
          data: {
            ...node.data,
            childNodes: node.data.childNodes.filter((childId) => childId !== nodeId),
          },
        };
      }
      return node;
    });

    set({
      nodes: updatedNodes,
      edges: get().edges.filter(
        (edge) => !nodesToDelete.includes(edge.source) && !nodesToDelete.includes(edge.target)
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
        childNodes: [],
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
