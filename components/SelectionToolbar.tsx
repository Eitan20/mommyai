"use client";

import { useCallback } from 'react';
import { Trash2, FolderPlus, Unlink } from 'lucide-react';
import useWhiteboardStore from '@/store/whiteboardStore';

interface SelectionToolbarProps {
  selectedNodeIds: string[];
  onClose: () => void;
}

export default function SelectionToolbar({ selectedNodeIds, onClose }: SelectionToolbarProps) {
  const { nodes, deleteNode, setNodes } = useWhiteboardStore();

  const selectedNodes = nodes.filter(node => selectedNodeIds.includes(node.id));

  const handleGroupSelected = useCallback(() => {
    if (selectedNodes.length < 2) return;

    // Calculate bounding box of selected nodes
    const minX = Math.min(...selectedNodes.map((n) => n.position.x));
    const minY = Math.min(...selectedNodes.map((n) => n.position.y));
    const maxX = Math.max(...selectedNodes.map((n) => n.position.x + (n.width || 200)));
    const maxY = Math.max(...selectedNodes.map((n) => n.position.y + (n.height || 100)));

    const groupId = `group-${Date.now()}`;
    const groupWidth = maxX - minX + 40;
    const groupHeight = maxY - minY + 40;

    // Create group node
    const groupNode = {
      id: groupId,
      type: 'group',
      position: { x: minX - 20, y: minY - 20 },
      data: {
        label: 'Group',
        width: groupWidth,
        height: groupHeight,
        childNodes: selectedNodeIds,
      },
      style: {
        width: groupWidth,
        height: groupHeight,
        zIndex: 0,
      },
    };

    // Update selected nodes to be children with relative positions
    const updatedNodes = nodes.map(node => {
      if (selectedNodeIds.includes(node.id)) {
        return {
          ...node,
          position: {
            x: node.position.x - (minX - 20),
            y: node.position.y - (minY - 20),
          },
          parentNode: groupId,
          extent: 'parent' as const,
          style: {
            ...node.style,
            zIndex: 10, // Children appear on top
          },
        };
      }
      return node;
    });

    // Add group node
    setNodes([...updatedNodes, groupNode]);
    onClose();
  }, [selectedNodes, selectedNodeIds, nodes, setNodes, onClose]);

  const handleDetach = useCallback(() => {
    // Find nodes that have a parent
    const nodesToDetach = selectedNodes.filter(node => node.parentNode);

    const updatedNodes = nodes.map(node => {
      // If this is a node to detach
      if (nodesToDetach.some(n => n.id === node.id)) {
        const parent = nodes.find(n => n.id === node.parentNode);
        if (parent) {
          // Convert relative position back to absolute
          return {
            ...node,
            position: {
              x: node.position.x + parent.position.x,
              y: node.position.y + parent.position.y,
            },
            parentNode: undefined,
            extent: undefined,
          };
        }
      }
      // If this is a parent, update its childNodes
      if (node.data.childNodes) {
        const newChildNodes = node.data.childNodes.filter(
          id => !nodesToDetach.some(n => n.id === id)
        );
        return {
          ...node,
          data: {
            ...node.data,
            childNodes: newChildNodes,
          },
        };
      }
      return node;
    });

    setNodes(updatedNodes);
    onClose();
  }, [selectedNodes, nodes, setNodes, onClose]);

  const handleDeleteSelected = useCallback(() => {
    selectedNodeIds.forEach(nodeId => {
      deleteNode(nodeId);
    });
    onClose();
  }, [selectedNodeIds, deleteNode, onClose]);

  if (selectedNodes.length === 0) return null;

  return (
    <div className="fixed bottom-8 left-1/2 transform -translate-x-1/2 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-2xl border border-gray-200 dark:border-gray-700 px-4 py-3 flex items-center gap-3">
        <span className="text-sm font-medium text-black mr-2">
          {selectedNodes.length} selected
        </span>

        {selectedNodes.length >= 2 && (
          <button
            onClick={handleGroupSelected}
            className="flex items-center gap-2 px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            <FolderPlus size={16} />
            <span className="text-sm font-medium">Group</span>
          </button>
        )}

        {selectedNodes.some(n => n.parentNode) && (
          <button
            onClick={handleDetach}
            className="flex items-center gap-2 px-3 py-2 bg-orange-100 dark:bg-orange-900 text-orange-700 dark:text-orange-300 rounded-lg hover:bg-orange-200 dark:hover:bg-orange-800 transition-colors"
          >
            <Unlink size={16} />
            <span className="text-sm font-medium">Detach</span>
          </button>
        )}

        <button
          onClick={handleDeleteSelected}
          className="flex items-center gap-2 px-3 py-2 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-800 transition-colors"
        >
          <Trash2 size={16} />
          <span className="text-sm font-medium">Delete</span>
        </button>
      </div>
    </div>
  );
}
