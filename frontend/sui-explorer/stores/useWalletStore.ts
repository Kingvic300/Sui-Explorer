// stores/useWalletStore.ts
import { create } from 'zustand';

interface WalletState {
    isConnected: boolean;
    account: string | null;
    connectWallet: () => void;
    disconnectWallet: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
    isConnected: false,
    account: null,
    connectWallet: () => {
        // This will be implemented in components using hooks
        console.log('Connect wallet triggered');
    },
    disconnectWallet: () => {
        // This will be implemented in components using hooks
        console.log('Disconnect wallet triggered');
    },
}));