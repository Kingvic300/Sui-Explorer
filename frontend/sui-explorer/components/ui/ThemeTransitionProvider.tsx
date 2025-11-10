import React, { useState, useCallback, useMemo } from 'react';
import { createPortal } from 'react-dom';
import { useThemeStore } from '../../stores/useThemeStore';
// FIX: Corrected import path for Theme type.
import { Theme } from '../../types/index';
import { ThemeTransitionContext } from '../../contexts/ThemeTransitionContext';

const FADE_IN_DURATION = 300;
const FADE_OUT_DURATION = 400;

const ThemeTransitionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { theme, setTheme } = useThemeStore();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [isOverlayVisible, setOverlayVisible] = useState(false);
  const [overlayColor, setOverlayColor] = useState('');

  const toggleThemeWithTransition = useCallback(() => {
    if (isTransitioning) return;

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const nextTheme: Theme = theme === 'light' ? 'dark' : 'light';

    if (prefersReducedMotion) {
      setTheme(nextTheme);
      return;
    }
    
    setIsTransitioning(true);
    setOverlayColor(nextTheme === 'dark' ? 'var(--dark-overlay)' : 'var(--light-overlay)');
    setOverlayVisible(true); // Start fade in

    // 1. After fade in, change theme
    setTimeout(() => {
      setTheme(nextTheme);
      // 2. After theme change, start fade out
      setTimeout(() => {
        setOverlayVisible(false);
        // 3. After fade out, reset transition state
        setTimeout(() => {
          setIsTransitioning(false);
        }, FADE_OUT_DURATION);
      }, 50); // Small delay for styles to apply
    }, FADE_IN_DURATION);
  }, [theme, setTheme, isTransitioning]);

  const contextValue = useMemo(() => ({
    toggleThemeWithTransition
  }), [toggleThemeWithTransition]);

  return (
    <ThemeTransitionContext.Provider value={contextValue}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: overlayColor,
            opacity: isOverlayVisible ? 1 : 0,
            transition: `opacity ${isOverlayVisible ? FADE_IN_DURATION : FADE_OUT_DURATION}ms ease-in-out`,
            zIndex: 99999,
            pointerEvents: 'none',
          }}
          aria-hidden="true"
        />,
        document.body
      )}
    </ThemeTransitionContext.Provider>
  );
};

export default ThemeTransitionProvider;