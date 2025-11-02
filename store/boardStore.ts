import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Board {
  id: string;
  title: string;
  description?: string;
  createdAt: string;
  updatedAt: string;
  thumbnail?: string;
  nodes: any[];
  edges: any[];
}

interface BoardState {
  boards: Board[];
  currentBoardId: string | null;

  createBoard: (title: string, description?: string) => Board;
  updateBoard: (id: string, updates: Partial<Board>) => void;
  deleteBoard: (id: string) => void;
  setCurrentBoard: (id: string) => void;
  getCurrentBoard: () => Board | null;
  duplicateBoard: (id: string) => Board;
}

const useBoardStore = create<BoardState>()(
  persist(
    (set, get) => ({
      boards: [],
      currentBoardId: null,

      createBoard: (title: string, description?: string) => {
        const newBoard: Board = {
          id: `board-${Date.now()}`,
          title,
          description,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          nodes: [],
          edges: [],
        };

        set((state) => ({
          boards: [...state.boards, newBoard],
          currentBoardId: newBoard.id,
        }));

        return newBoard;
      },

      updateBoard: (id: string, updates: Partial<Board>) => {
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === id
              ? { ...board, ...updates, updatedAt: new Date().toISOString() }
              : board
          ),
        }));
      },

      deleteBoard: (id: string) => {
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
          currentBoardId:
            state.currentBoardId === id ? null : state.currentBoardId,
        }));
      },

      setCurrentBoard: (id: string) => {
        set({ currentBoardId: id });
      },

      getCurrentBoard: () => {
        const { boards, currentBoardId } = get();
        return boards.find((board) => board.id === currentBoardId) || null;
      },

      duplicateBoard: (id: string) => {
        const board = get().boards.find((b) => b.id === id);
        if (!board) throw new Error('Board not found');

        const duplicatedBoard: Board = {
          ...board,
          id: `board-${Date.now()}`,
          title: `${board.title} (Copy)`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          boards: [...state.boards, duplicatedBoard],
        }));

        return duplicatedBoard;
      },
    }),
    {
      name: 'board-storage',
    }
  )
);

export default useBoardStore;
