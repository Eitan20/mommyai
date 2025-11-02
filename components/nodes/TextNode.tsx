"use client";

import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps, NodeResizer } from 'reactflow';
import { Type, Trash2, Palette, TextCursor } from 'lucide-react';
import useWhiteboardStore, { NodeData } from '@/store/whiteboardStore';

function TextNode({ id, data, selected }: NodeProps<NodeData>) {
  const { updateNodeData, deleteNode } = useWhiteboardStore();
  const [isEditing, setIsEditing] = useState(false);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [showBgPicker, setShowBgPicker] = useState(false);

  const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
    updateNodeData(id, { content: e.target.value });
  }, [id, updateNodeData]);

  const handleFontSizeChange = useCallback((e: React.ChangeEvent<HTMLSelectElement>) => {
    updateNodeData(id, { fontSize: parseInt(e.target.value) });
  }, [id, updateNodeData]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  }, [id, deleteNode]);

  const colors = ['#000000', '#ef4444', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6', '#ec4899'];
  const bgColors = ['#ffffff', '#fef3c7', '#ddd6fe', '#e0f2fe', '#dcfce7', '#fee2e2', '#f3f4f6'];

  return (
    <div
      className="px-4 py-3 rounded-lg shadow-lg min-w-[200px] border-2"
      style={{
        backgroundColor: data.backgroundColor || '#ffffff',
        borderColor: selected ? '#3b82f6' : 'transparent',
      }}
    >
      <NodeResizer
        minWidth={200}
        minHeight={100}
        isVisible={selected}
        lineClassName="border-blue-400"
        handleClassName="h-3 w-3 bg-white border-2 border-blue-400"
      />
      <Handle type="target" position={Position.Right} className="w-2 h-2" />

      {/* Header bar with unique color */}
      <div className="flex items-center justify-between mb-2 -mx-4 -mt-3 px-4 py-2 rounded-t-lg" style={{ backgroundColor: '#10b981' }}>
        <div className="flex items-center gap-2">
          <Type size={16} className="text-white" />
          <span className="font-semibold text-sm text-white">
            Text
          </span>
        </div>
        <div className="flex gap-1">
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowColorPicker(!showColorPicker);
                setShowBgPicker(false);
              }}
              className="p-1 hover:bg-green-600 rounded transition-colors"
              title="Text color"
            >
              <TextCursor size={14} className="text-white" />
            </button>
            {showColorPicker && (
              <div className="absolute top-full mt-1 right-0 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-50 grid grid-cols-4 gap-1">
                {colors.map((color) => (
                  <button
                    key={color}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateNodeData(id, { textColor: color });
                      setShowColorPicker(false);
                    }}
                    className="w-6 h-6 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>
          <div className="relative">
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowBgPicker(!showBgPicker);
                setShowColorPicker(false);
              }}
              className="p-1 hover:bg-green-600 rounded transition-colors"
              title="Background color"
            >
              <Palette size={14} className="text-white" />
            </button>
            {showBgPicker && (
              <div className="absolute top-full mt-1 right-0 p-2 bg-white dark:bg-gray-700 rounded-lg shadow-xl border border-gray-200 dark:border-gray-600 z-50 grid grid-cols-4 gap-1">
                {bgColors.map((color) => (
                  <button
                    key={color}
                    onClick={(e) => {
                      e.stopPropagation();
                      updateNodeData(id, { backgroundColor: color });
                      setShowBgPicker(false);
                    }}
                    className="w-6 h-6 rounded border-2 border-gray-300 hover:scale-110 transition-transform"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            )}
          </div>
          <button
            onClick={handleDelete}
            className="p-1 hover:bg-green-600 rounded transition-colors"
          >
            <Trash2 size={14} className="text-white" />
          </button>
        </div>
      </div>

      <div className="mb-2">
        <select
          value={data.fontSize || 14}
          onChange={handleFontSizeChange}
          className="w-full p-1 text-xs border rounded focus:outline-none focus:ring-1 focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()}
        >
          <option value="12">Small</option>
          <option value="14">Normal</option>
          <option value="16">Medium</option>
          <option value="20">Large</option>
          <option value="24">Extra Large</option>
        </select>
      </div>

      <textarea
        value={data.content || ''}
        onChange={handleContentChange}
        onFocus={() => setIsEditing(true)}
        onBlur={() => setIsEditing(false)}
        placeholder="Type your text here..."
        className="w-full min-h-[80px] p-2 border rounded resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
        style={{
          backgroundColor: 'rgba(255, 255, 255, 0.5)',
          color: data.textColor || '#000000',
          fontSize: `${data.fontSize || 14}px`,
        }}
      />

      <Handle type="source" position={Position.Right} className="w-2 h-2" />
    </div>
  );
}

export default memo(TextNode);
