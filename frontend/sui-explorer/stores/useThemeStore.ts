import { create } from 'zustand';
import { persist } from 'zustand/middleware';
// FIX: Corrected import path for Theme type.
import { Theme } from '../types/index';

interface ThemeState {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      theme: 'light',
      toggleTheme: () =>
        set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' })),
      setTheme: (theme) => set({ theme }),
    }),
    {
      name: 'sui-explorer-theme',
      onRehydrateStorage: () => (state) => {
        if (state) {
            const isDark = state.theme === 'dark';
            if (isDark) {
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
            }
        }
      },
    }
  )
);

// Update document class whenever theme changes
useThemeStore.subscribe((state) => {
    const isDark = state.theme === 'dark';
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
});