import React from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import { useWalletStore } from '../../stores/useWalletStore';
import { WalletIcon } from '../icons/MiscIcons';

interface ConnectWalletPlaceholderProps {
    icon: React.ReactNode;
    title: string;
    description: string;
}

const ConnectWalletPlaceholder: React.FC<ConnectWalletPlaceholderProps> = ({ icon, title, description }) => {
    const { connectWallet } = useWalletStore();

    return (
        <Card variant="dashed" className="p-6">
            <h2 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200 mb-6">
                {icon}
                {title}
            </h2>
            <div className="text-center py-6">
                <div className="w-16 h-16 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-full mx-auto flex items-center justify-center">
                    <WalletIcon className="w-8 h-8 text-slate-400 dark:text-slate-500" />
                </div>
                <h3 className="font-semibold text-slate-800 dark:text-slate-200 mt-4">Connect Your Wallet</h3>
                <p className="text-sm text-slate-800 dark:text-slate-300 mt-1">{description}</p>
                <Button variant="primary" className="!py-2 !px-5 mt-4" onClick={connectWallet}>
                    Connect Wallet
                </Button>
            </div>
        </Card>
    );
};

export default ConnectWalletPlaceholder;