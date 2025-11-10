import React, { createContext, useContext } from 'react';

interface ThemeTransitionContextType {
  toggleThemeWithTransition: () => void;
}

export const ThemeTransitionContext = createContext<ThemeTransitionContextType | undefined>(undefined);

export const useThemeTransition = () => {
  const context = useContext(ThemeTransitionContext);
  if (!context) {
    throw new Error('useThemeTransition must be used within a ThemeTransitionProvider');
  }
  return context;
};
