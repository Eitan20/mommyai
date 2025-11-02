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

  // Simulate active collaborators (in production, this would come from a real-time service)
  useEffect(() => {
    // Mock active users
    const mockUsers = [
      { id: 'user1', name: 'Alice', color: '#ef4444' },
      { id: 'user2', name: 'Bob', color: '#3b82f6' },
    ];

    // Randomly show/hide users to simulate joining/leaving
    const interval = setInterval(() => {
      const randomUser = mockUsers[Math.floor(Math.random() * mockUsers.length)];
      const shouldShow = Math.random() > 0.5;

      if (shouldShow) {
        setActiveUsers((prev) => {
          if (!prev.includes(randomUser.name)) {
            return [...prev, randomUser.name];
          }
          return prev;
        });

        // Simulate cursor movement
        setCursors((prev) => {
          const existing = prev.find((c) => c.name === randomUser.name);
          if (existing) {
            return prev.map((c) =>
              c.name === randomUser.name
                ? {
                    ...c,
                    x: Math.random() * (window.innerWidth - 100),
                    y: Math.random() * (window.innerHeight - 100),
                  }
                : c
            );
          } else {
            return [
              ...prev,
              {
                id: randomUser.id,
                name: randomUser.name,
                color: randomUser.color,
                x: Math.random() * (window.innerWidth - 100),
                y: Math.random() * (window.innerHeight - 100),
              },
            ];
          }
        });
      }
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      {/* Active Users Indicator (Top Right of Canvas) */}
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
