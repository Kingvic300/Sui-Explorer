import React from 'react';
import { createNetworkConfig, SuiClientProvider, WalletProvider } from '@mysten/dapp-kit';
import { getFullnodeUrl } from '@mysten/sui/client';
import { LazyMotion, domAnimation } from 'framer-motion';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import AppRouter from './Router';
import { useThemeStore } from './stores/useThemeStore';
import ToastManager from './components/ui/ToastManager';
import ThemeTransitionProvider from './components/ui/ThemeTransitionProvider';
import ErrorBoundary from './components/ui/ErrorBoundary';

// Network configuration for Sui
const { networkConfig } = createNetworkConfig({
    localnet: { url: getFullnodeUrl('localnet') },
    testnet: { url: getFullnodeUrl('testnet') },
    mainnet: { url: getFullnodeUrl('mainnet') },
});

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
                <SuiClientProvider networks={networkConfig} defaultNetwork="testnet">
                    <WalletProvider>
                        <LazyMotion features={domAnimation} strict>
                            <ThemeTransitionProvider>
                                <div className="bg-transparent text-slate-800 dark:text-slate-100 min-h-screen">
                                    <AppRouter />
                                    <ToastManager />
                                </div>
                            </ThemeTransitionProvider>
                        </LazyMotion>
                    </WalletProvider>
                </SuiClientProvider>
            </QueryClientProvider>
        </ErrorBoundary>
    );
}

export default App;