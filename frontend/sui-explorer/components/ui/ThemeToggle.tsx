

import React from 'react';
import { m } from 'framer-motion';
import { useThemeStore } from '../../stores/useThemeStore';
import { useThemeTransition } from '../../contexts/ThemeTransitionContext';
import { SunIcon } from '../icons/SunIcon';
import { MoonIcon } from '../icons/MoonIcon';

const ThemeToggle: React.FC = () => {
  const { theme } = useThemeStore();
  const { toggleThemeWithTransition } = useThemeTransition();

  return (
    <m.button
      onClick={toggleThemeWithTransition}
      className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-indigo transition-all duration-300"
      aria-label="Toggle theme"
      whileHover={{ scale: 1.1, rotate: 15 }}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      {theme === 'light' ? (
        <MoonIcon className="h-5 w-5" />
      ) : (
        <SunIcon className="h-5 w-5" />
      )}
    </m.button>
  );
};

export default ThemeToggle;