"use client";

import { useCallback } from 'react';
import { Trash2, FolderPlus, Unlink } from 'lucide-react';
import useWhiteboardStore from '@/store/whiteboardStore';

interface SelectionToolbarProps {
  selectedNodeIds: string[];
  onClose: () => void;
}

export default function SelectionToolbar({ selectedNodeIds, onClose }: SelectionToolbarProps) {
  const { nodes, deleteNode, addNode, updateNodeData } = useWhiteboardStore();

  const selectedNodes = nodes.filter(node => selectedNodeIds.includes(node.id));

  const handleGroupSelected = useCallback(() => {
    if (selectedNodes.length < 2) return;

    // Calculate bounding box of selected nodes
    const minX = Math.min(...selectedNodes.map((n) => n.position.x));
    const minY = Math.min(...selectedNodes.map((n) => n.position.y));
    const maxX = Math.max(...selectedNodes.map((n) => n.position.x + (n.width || 200)));
    const maxY = Math.max(...selectedNodes.map((n) => n.position.y + (n.height || 100)));

    // Create group node
    const groupId = `group-${Date.now()}`;
    addNode('group',
      { x: minX - 20, y: minY - 20 },
      {
        label: 'Group',
        width: maxX - minX + 40,
        height: maxY - minY + 40,
        childNodes: selectedNodeIds,
      }
    );

    // Update selected nodes to be children of the group
    selectedNodeIds.forEach((nodeId) => {
      const node = nodes.find(n => n.id === nodeId);
      if (node) {
        // Make nodes children of the group
        updateNodeData(nodeId, {});
        // Note: We'll need to update the store to handle parent-child relationships
      }
    });

    onClose();
  }, [selectedNodes, selectedNodeIds, nodes, addNode, updateNodeData, onClose]);

  const handleDetach = useCallback(() => {
    // Find nodes that have a parent
    const nodesToDetach = selectedNodes.filter(node => node.parentNode);

    nodesToDetach.forEach((node) => {
      if (node.parentNode) {
        // Remove from parent's childNodes array
        const parent = nodes.find(n => n.id === node.parentNode);
        if (parent?.data.childNodes) {
          const newChildNodes = parent.data.childNodes.filter(id => id !== node.id);
          updateNodeData(node.parentNode, { childNodes: newChildNodes });
        }
      }
    });

    onClose();
  }, [selectedNodes, nodes, updateNodeData, onClose]);

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
