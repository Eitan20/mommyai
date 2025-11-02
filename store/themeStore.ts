import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface ThemeState {
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  setDarkMode: (isDark: boolean) => void;
}

const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      isDarkMode: false, // Default to light mode

      toggleDarkMode: () => set((state) => {
        const newMode = !state.isDarkMode;
        // Update document class for Tailwind dark mode
        if (newMode) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: newMode };
      }),

      setDarkMode: (isDark) => set(() => {
        // Update document class for Tailwind dark mode
        if (isDark) {
          document.documentElement.classList.add('dark');
        } else {
          document.documentElement.classList.remove('dark');
        }
        return { isDarkMode: isDark };
      }),
    }),
    {
      name: 'theme-storage',
    }
  )
);

export default useThemeStore;
