"use client";

import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { Image as ImageIcon, Trash2, Upload, Sparkles, Loader, Eye } from 'lucide-react';
import useWhiteboardStore, { NodeData } from '@/store/whiteboardStore';
import useContentStore from '@/store/contentStore';
import { analyzeImage } from '@/utils/mediaProcessing';

function ImageNode({ id, data, selected }: NodeProps<NodeData>) {
  const { updateNodeData, deleteNode } = useWhiteboardStore();
  const { addContent, updateContent, getContent } = useContentStore();

  const [imageUrl, setImageUrl] = useState(data.imageUrl || '');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [showAnalysis, setShowAnalysis] = useState(false);

  const handleImageUrlChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const url = e.target.value;
    setImageUrl(url);
    updateNodeData(id, { imageUrl: url });
  }, [id, updateNodeData]);

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setImageUrl(dataUrl);
        updateNodeData(id, { imageUrl: dataUrl, fileName: file.name });
      };
      reader.readAsDataURL(file);
    }
  }, [id, updateNodeData]);

  const handleAnalyzeImage = useCallback(async () => {
    if (!imageUrl) return;

    setIsAnalyzing(true);
    addContent(id, {
      id,
      type: 'image',
      originalUrl: imageUrl,
      fileName: data.fileName,
      status: 'processing',
    });

    try {
      const analysis = await analyzeImage(imageUrl);

      updateContent(id, {
        status: 'completed',
        caption: analysis.caption,
        extractedText: analysis.text,
        summary: analysis.caption,
        keyPoints: analysis.objects.map(obj => `Detected: ${obj}`),
      });

      updateNodeData(id, { processed: true, caption: analysis.caption });
    } catch (error) {
      updateContent(id, { status: 'error' });
    } finally {
      setIsAnalyzing(false);
    }
  }, [imageUrl, id, data.fileName, addContent, updateContent, updateNodeData]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  }, [id, deleteNode]);

  const content = getContent(id);

  return (
    <div
      className="px-4 py-3 rounded-lg shadow-lg min-w-[250px] border-2"
      style={{
        backgroundColor: data.backgroundColor || '#ffffff',
        borderColor: selected ? '#3b82f6' : 'transparent',
      }}
    >
      <Handle type="target" position={Position.Right} className="w-2 h-2" />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ImageIcon size={16} style={{ color: data.textColor || '#000000' }} />
          <span className="font-semibold text-sm" style={{ color: data.textColor || '#000000' }}>
            Image
          </span>
          {content?.status === 'completed' && (
            <Sparkles size={14} className="text-green-500" title="Analyzed" />
          )}
        </div>
        <button
          onClick={handleDelete}
          className="hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded transition-colors"
        >
          <Trash2 size={14} className="text-red-500" />
        </button>
      </div>

      <div className="space-y-2 mb-2">
        <input
          type="text"
          value={imageUrl}
          onChange={handleImageUrlChange}
          placeholder="Enter image URL..."
          className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
        />
        <label className="block">
          <input
            type="file"
            accept="image/*"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="w-full p-2 border border-dashed rounded text-center cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Upload size={16} className="inline mr-2" />
            <span className="text-sm">Or upload file</span>
          </div>
        </label>
      </div>

      {data.imageUrl ? (
        <div className="space-y-2">
          <div className="relative w-full h-48 bg-gray-100 dark:bg-gray-800 rounded overflow-hidden">
            <img
              src={data.imageUrl}
              alt={data.caption || data.label || 'Image'}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100"%3E%3Crect fill="%23ddd" width="100" height="100"/%3E%3Ctext fill="%23999" x="50%25" y="50%25" text-anchor="middle" dy=".3em"%3EError%3C/text%3E%3C/svg%3E';
              }}
            />
          </div>

          {/* Analyze Button */}
          {!content?.caption && (
            <button
              onClick={handleAnalyzeImage}
              disabled={isAnalyzing}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50 transition-colors text-sm"
            >
              {isAnalyzing ? (
                <>
                  <Loader size={14} className="animate-spin" />
                  Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={14} />
                  Analyze with AI
                </>
              )}
            </button>
          )}

          {/* Show Analysis */}
          {content?.caption && (
            <div className="space-y-2">
              <button
                onClick={() => setShowAnalysis(!showAnalysis)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm"
              >
                <Eye size={14} />
                {showAnalysis ? 'Hide' : 'Show'} Analysis
              </button>
              {showAnalysis && (
                <div className="p-3 bg-white dark:bg-gray-700 border rounded text-xs space-y-2">
                  <div>
                    <p className="font-semibold mb-1">Caption:</p>
                    <p className="text-gray-700 dark:text-gray-300">{content.caption}</p>
                  </div>
                  {content.extractedText && (
                    <div>
                      <p className="font-semibold mb-1">Detected Text:</p>
                      <p className="text-gray-700 dark:text-gray-300">{content.extractedText}</p>
                    </div>
                  )}
                  {content.keyPoints && content.keyPoints.length > 0 && (
                    <div>
                      <p className="font-semibold mb-1">Objects:</p>
                      <ul className="list-disc list-inside text-gray-700 dark:text-gray-300">
                        {content.keyPoints.map((point, idx) => (
                          <li key={idx}>{point}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center w-full h-48 bg-gray-100 dark:bg-gray-800 rounded">
          <Upload size={32} className="text-gray-400 mb-2" />
          <p className="text-sm text-gray-500">Enter URL or upload file</p>
        </div>
      )}

      <Handle type="source" position={Position.Right} className="w-2 h-2" />
    </div>
  );
}

export default memo(ImageNode);
