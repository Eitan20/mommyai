"use client";

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import useAuthStore from '@/store/authStore';
import useBoardStore from '@/store/boardStore';
import WhiteboardCanvas from '@/components/WhiteboardCanvas';
import ChatPanel from '@/components/ChatPanel';
import BoardHeader from '@/components/BoardHeader';

export default function BoardPage() {
  const router = useRouter();
  const params = useParams();
  const boardId = params.id as string;

  const { isAuthenticated } = useAuthStore();
  const { setCurrentBoard, getCurrentBoard } = useBoardStore();

  const [isChatOpen, setIsChatOpen] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/auth');
      return;
    }

    setCurrentBoard(boardId);
  }, [isAuthenticated, boardId, router, setCurrentBoard]);

  const currentBoard = getCurrentBoard();

  if (!isAuthenticated || !currentBoard) {
    return (
      <div className="h-screen w-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="h-screen w-screen flex flex-col bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      {!isFullscreen && (
        <BoardHeader
          board={currentBoard}
          isChatOpen={isChatOpen}
          onToggleChat={() => setIsChatOpen(!isChatOpen)}
          onToggleFullscreen={() => setIsFullscreen(!isFullscreen)}
        />
      )}

      {/* Main Content: Canvas (Left) + Chat Panel (Right) */}
      <div className="flex-1 flex overflow-hidden">
        {/* Canvas Area */}
        <div
          className={`transition-all ${
            isChatOpen ? 'flex-1' : 'w-full'
          }`}
        >
          <WhiteboardCanvas
            boardId={boardId}
            isFullscreen={isFullscreen}
            onExitFullscreen={() => setIsFullscreen(false)}
          />
        </div>

        {/* Chat Panel (Right) */}
        {isChatOpen && (
          <ChatPanel
            boardId={boardId}
            onClose={() => setIsChatOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
