"use client";

import { useState, useEffect } from 'react';
import { MousePointer2 } from 'lucide-react';

interface CollaborationCursorsProps {
  boardId: string;
}

interface Cursor {
  id: string;
  name: string;
  color: string;
  x: number;
  y: number;
}

export default function CollaborationCursors({ boardId }: CollaborationCursorsProps) {
  const [cursors, setCursors] = useState<Cursor[]>([]);
  const [activeUsers, setActiveUsers] = useState<string[]>([]);

  // Real-time collaboration placeholder
  // In production, integrate with WebSocket service (e.g., Pusher, Ably, Socket.io)
  // or real-time database (e.g., Firebase, Supabase) to track:
  // - Active users on the board
  // - Real-time cursor positions
  // - User presence (online/offline)

  useEffect(() => {
    // TODO: Set up real-time collaboration service
    // Example with WebSocket:
    // const ws = new WebSocket(`wss://your-server.com/boards/${boardId}`);
    // ws.onmessage = (event) => {
    //   const data = JSON.parse(event.data);
    //   if (data.type === 'cursor') {
    //     setCursors(prev => updateCursor(prev, data));
    //   }
    // };
    // return () => ws.close();
  }, [boardId]);

  return (
    <>
      {/* Active Users Indicator */}
      {activeUsers.length > 0 && (
        <div className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 px-3 py-2">
          <div className="flex items-center gap-2">
            <div className="flex -space-x-2">
              {activeUsers.map((user, index) => (
                <div
                  key={user}
                  className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 flex items-center justify-center text-white text-xs font-bold"
                  style={{
                    backgroundColor: index === 0 ? '#ef4444' : '#3b82f6',
                  }}
                  title={user}
                >
                  {user.charAt(0)}
                </div>
              ))}
            </div>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {activeUsers.length} active
            </span>
          </div>
        </div>
      )}

      {/* User Cursors */}
      {cursors.map((cursor) => (
        <div
          key={cursor.id}
          className="fixed pointer-events-none z-50 transition-all duration-300"
          style={{
            left: cursor.x,
            top: cursor.y,
          }}
        >
          <MousePointer2
            size={24}
            style={{ color: cursor.color }}
            className="drop-shadow-lg"
          />
          <div
            className="mt-1 px-2 py-1 rounded text-white text-xs font-medium shadow-lg whitespace-nowrap"
            style={{ backgroundColor: cursor.color }}
          >
            {cursor.name}
          </div>
        </div>
      ))}
    </>
  );
}
