"use client";

import { memo, useState, useCallback } from 'react';
import { Handle, Position, NodeProps } from 'reactflow';
import { FileText, Trash2, Upload, Loader, Sparkles, Eye } from 'lucide-react';
import useWhiteboardStore, { NodeData } from '@/store/whiteboardStore';
import useContentStore from '@/store/contentStore';
import { extractPDFText, formatFileSize } from '@/utils/mediaProcessing';

function DocumentNode({ id, data, selected }: NodeProps<NodeData>) {
  const { updateNodeData, deleteNode } = useWhiteboardStore();
  const { addContent, updateContent, getContent } = useContentStore();

  const [isProcessing, setIsProcessing] = useState(false);
  const [showContent, setShowContent] = useState(false);

  const handleFileUpload = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    updateNodeData(id, { fileName: file.name, fileSize: file.size });

    // Auto-process PDF
    if (file.type === 'application/pdf') {
      setIsProcessing(true);
      addContent(id, {
        id,
        type: 'document',
        fileName: file.name,
        status: 'processing',
      });

      try {
        const result = await extractPDFText(file);

        updateContent(id, {
          status: 'completed',
          extractedText: result.text,
          metadata: {
            pageCount: result.pageCount,
          },
          summary: `Extracted ${result.pageCount} pages from ${file.name}`,
          keyPoints: [
            `Document has ${result.pageCount} pages`,
            'Text extracted and ready for analysis',
            'Available for AI queries',
          ],
        });

        updateNodeData(id, { processed: true, pageCount: result.pageCount });
      } catch (error) {
        updateContent(id, { status: 'error' });
      } finally {
        setIsProcessing(false);
      }
    }
  }, [id, updateNodeData, addContent, updateContent]);

  const handleDelete = useCallback((e: React.MouseEvent) => {
    e.stopPropagation();
    deleteNode(id);
  }, [id, deleteNode]);

  const content = getContent(id);

  return (
    <div
      className="px-4 py-3 rounded-lg shadow-lg min-w-[280px] max-w-[350px] border-2"
      style={{
        backgroundColor: data.backgroundColor || '#ffffff',
        borderColor: selected ? '#3b82f6' : 'transparent',
      }}
    >
      <Handle type="target" position={Position.Right} className="w-2 h-2" />

      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <FileText size={16} style={{ color: data.textColor || '#000000' }} />
          <span className="font-semibold text-sm" style={{ color: data.textColor || '#000000' }}>
            Document
          </span>
          {content?.status === 'completed' && (
            <Sparkles size={14} className="text-green-500" title="Processed" />
          )}
        </div>
        <button
          onClick={handleDelete}
          className="hover:bg-red-100 dark:hover:bg-red-900 p-1 rounded transition-colors"
        >
          <Trash2 size={14} className="text-red-500" />
        </button>
      </div>

      {!data.fileName ? (
        <label className="block">
          <input
            type="file"
            accept=".pdf,.doc,.docx,.txt"
            onChange={handleFileUpload}
            className="hidden"
          />
          <div className="flex flex-col items-center justify-center p-8 border-2 border-dashed rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Upload size={32} className="text-gray-400 mb-2" />
            <p className="text-sm text-gray-600 dark:text-gray-400 text-center">
              Upload PDF, DOC, or TXT
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
              Click to browse files
            </p>
          </div>
        </label>
      ) : (
        <div className="space-y-3">
          <div className="p-3 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-900 dark:to-purple-900 rounded-lg">
            <div className="flex items-start gap-2">
              <FileText size={32} className="text-blue-500 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="font-medium text-sm truncate" title={data.fileName}>
                  {data.fileName}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  {data.fileSize && (
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {formatFileSize(data.fileSize)}
                    </span>
                  )}
                  {data.pageCount && (
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      • {data.pageCount} pages
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>

          {isProcessing && (
            <div className="flex items-center justify-center gap-2 p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <Loader size={16} className="animate-spin text-purple-600" />
              <span className="text-sm text-purple-600 dark:text-purple-400">
                Extracting text...
              </span>
            </div>
          )}

          {content?.extractedText && (
            <div className="space-y-2">
              <button
                onClick={() => setShowContent(!showContent)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-sm hover:bg-green-200 dark:hover:bg-green-800 transition-colors"
              >
                <Eye size={14} />
                {showContent ? 'Hide' : 'View'} Extracted Text
              </button>

              {showContent && (
                <div className="p-3 bg-white dark:bg-gray-700 border rounded text-xs max-h-48 overflow-y-auto">
                  <pre className="whitespace-pre-wrap font-mono">
                    {content.extractedText}
                  </pre>
                </div>
              )}

              <div className="text-xs text-center text-gray-500 dark:text-gray-400">
                ✓ Content available to AI
              </div>
            </div>
          )}

          <label className="block">
            <input
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              className="hidden"
            />
            <button className="w-full px-3 py-2 text-sm bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors">
              Replace Document
            </button>
          </label>
        </div>
      )}

      <Handle type="source" position={Position.Right} className="w-2 h-2" />
    </div>
  );
}

export default memo(DocumentNode);
