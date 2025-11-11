// services/walletService.ts
import { useConnectModal, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';

export const walletService = {
    async connect(): Promise<string> {
        const { openConnectModal } = useConnectModal.getState();

        return new Promise((resolve, reject) => {
            if (openConnectModal) {
                // Open the wallet connection modal
                openConnectModal();

                // You might want to set up an event listener or polling
                // to detect when the wallet is actually connected
                // This is a simplified version - you may need more complex logic
                const checkConnection = setInterval(() => {
                    const currentAccount = useCurrentAccount.getState();
                    if (currentAccount) {
                        clearInterval(checkConnection);
                        resolve(currentAccount.address);
                    }
                }, 500);

                // Timeout after 30 seconds
                setTimeout(() => {
                    clearInterval(checkConnection);
                    reject(new Error('Connection timeout'));
                }, 30000);
            } else {
                reject(new Error('Connect modal not available'));
            }
        });
    },

    disconnect(): void {
        const { mutate: disconnect } = useDisconnectWallet.getState();
        if (disconnect) {
            disconnect();
        }
    },
};