// components/wallet/EnhancedWalletConnect.tsx
import React, { useState } from 'react';
import { ConnectButton, useCurrentAccount, useDisconnectWallet } from '@mysten/dapp-kit';
import Button from '../ui/Button';

export const EnhancedWalletConnect = () => {
    const currentAccount = useCurrentAccount();
    const { mutate: disconnect } = useDisconnectWallet();
    const [copied, setCopied] = useState(false);

    const formatAddress = (address: string) => {
        return `${address.slice(0, 6)}...${address.slice(-4)}`;
    };

    const copyAddress = async () => {
        if (currentAccount?.address) {
            await navigator.clipboard.writeText(currentAccount.address);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const handleDisconnect = () => {
        if (disconnect) {
            disconnect();
        }
    };

    if (currentAccount) {
        return (
            <div className="flex items-center gap-2">
                {/* Enhanced Wallet Display */}
                <div className="relative group">
                    <div
                        className="flex items-center gap-2 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-slate-800 dark:to-slate-900 px-4 py-2 rounded-xl border border-blue-200 dark:border-slate-700 cursor-pointer hover:shadow-md transition-all duration-200"
                        onClick={copyAddress}
                    >
                        <div className="flex items-center gap-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            <span className="text-sm font-semibold text-blue-700 dark:text-blue-300">
                                {formatAddress(currentAccount.address)}
                            </span>
                            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                        </div>
                    </div>

                    {/* Tooltip */}
                    <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-slate-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                        {copied ? 'Copied!' : 'Click to copy address'}
                    </div>
                </div>

                {/* Disconnect Button */}
                <Button
                    variant="outline"
                    className="!py-1.5 !px-3 !text-sm hover:!bg-red-50 hover:!text-red-600 hover:!border-red-200 dark:hover:!bg-red-900/20"
                    onClick={handleDisconnect}
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                </Button>
            </div>
        );
    }

    return (
        <ConnectButton
            className="!bg-gradient-to-r !from-blue-600 !to-purple-600 hover:!from-blue-700 hover:!to-purple-700 !border-0 !text-white !font-semibold !px-5 !py-2.5 !rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
        />
    );
};