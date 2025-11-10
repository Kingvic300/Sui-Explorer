
import { create } from 'zustand';
import { walletService } from '../services/walletService';

interface WalletState {
  isConnected: boolean;
  account: string | null;
  connectWallet: () => Promise<void>;
  disconnectWallet: () => void;
}

export const useWalletStore = create<WalletState>((set) => ({
  isConnected: false,
  account: null,
  connectWallet: async () => {
    try {
      const account = await walletService.connect();
      set({ isConnected: true, account });
    } catch (error) {
      console.error("Failed to connect wallet:", error);
      // Optionally handle connection errors (e.g., user rejection)
      set({ isConnected: false, account: null });
    }
  },
  disconnectWallet: () => {
    walletService.disconnect();
    set({ isConnected: false, account: null });
  },
}));
