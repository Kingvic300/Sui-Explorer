
import React from 'react';
import { LazyMotion, domAnimation } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './Router';
import { useThemeStore } from './stores/useThemeStore';
import ToastManager from './components/ui/ToastManager';
import ThemeTransitionProvider from './components/ui/ThemeTransitionProvider';
import ErrorBoundary from './components/ui/ErrorBoundary';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
    },
  },
});

function App() {
  // Initialize theme from Zustand store
  useThemeStore();
  
  return (
    <ErrorBoundary>
      <QueryClientProvider client={queryClient}>
        <LazyMotion features={domAnimation} strict>
          <ThemeTransitionProvider>
            <div className="bg-transparent text-slate-800 dark:text-slate-100 min-h-screen">
              <AppRouter />
              <ToastManager />
            </div>
          </ThemeTransitionProvider>
        </LazyMotion>
      </QueryClientProvider>
    </ErrorBoundary>
  );
}

export default App;