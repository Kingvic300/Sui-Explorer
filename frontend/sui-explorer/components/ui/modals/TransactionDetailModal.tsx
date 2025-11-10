

import React, { useState, useEffect, useCallback } from 'react';
import { m, AnimatePresence } from 'framer-motion';
// FIX: Corrected import of MockTransaction from types/index.ts instead of DashboardPage.
import { MockTransaction } from '../../../types/index';
import { XIcon, ArrowUpRightIcon, ArrowDownLeftIcon, ZapIcon, ClipboardIcon, CheckIcon, ExternalLinkIcon } from '../../icons/MiscIcons';
import { useToastStore } from '../../../stores/useToastStore';
import Button from '../Button';

interface TransactionDetailModalProps {
  tx: MockTransaction;
  onClose: () => void;
}

const TransactionIcon: React.FC<{ type: MockTransaction['type'], size?: 'sm' | 'lg' }> = ({ type, size = 'lg' }) => {
    const sizeClasses = size === 'lg' ? 'w-12 h-12 p-3' : 'w-8 h-8 p-2';
    const iconSizeClasses = size === 'lg' ? 'w-6 h-6' : 'w-4 h-4';

    switch (type) {
        case 'send': return <div className={`${sizeClasses} bg-red-500/10 rounded-full`}><ArrowUpRightIcon className={`${iconSizeClasses} text-red-400`} /></div>;
        case 'receive': return <div className={`${sizeClasses} bg-green-500/10 rounded-full`}><ArrowDownLeftIcon className={`${iconSizeClasses} text-green-400`} /></div>;
        case 'dapp': return <div className={`${sizeClasses} bg-blue-500/10 rounded-full`}><ZapIcon className={`${iconSizeClasses} text-blue-400`} /></div>;
        default: return null;
    }
};

const DetailRow: React.FC<{ label: string, value: string, isAddress?: boolean, onCopy?: (value: string) => void }> = ({ label, value, isAddress = false, onCopy }) => {
    const displayValue = isAddress ? `${value.slice(0, 8)}...${value.slice(-6)}` : value;
    return (
        <div className="flex justify-between items-center py-3 border-b border-dark-border/60">
            <span className="text-sm text-slate-400">{label}</span>
            <div className="flex items-center gap-2">
                <span className="font-mono text-sm text-white font-medium">{displayValue}</span>
                {onCopy && (
                     <button onClick={() => onCopy(value)} className="text-slate-500 hover:text-white transition-colors" aria-label={`Copy ${label}`}>
                        <ClipboardIcon className="w-4 h-4" />
                    </button>
                )}
            </div>
        </div>
    );
};

const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({ tx, onClose }) => {
    const [isClosing, setIsClosing] = useState(false);
    const addToast = useToastStore(state => state.addToast);

    const handleCopy = (value: string, label: string) => {
        navigator.clipboard.writeText(value);
        addToast({
            type: 'success',
            title: 'Copied to Clipboard',
            message: `${label} has been copied.`,
            duration: 2000,
        });
    };

    const handleClose = useCallback(() => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    }, [onClose]);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleClose();
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => {
            document.body.style.overflow = 'auto';
            document.removeEventListener('keydown', handleKeyDown);
        };
    }, [handleClose]);

    const amountColor = tx.amount > 0 ? 'text-green-400' : 'text-red-400';

    return (
        <div className={`fixed inset-0 z-50 flex items-center justify-center p-4 transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>
            <m.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ duration: 0.3, ease: 'easeOut' }}
                role="dialog"
                aria-modal="true"
                aria-labelledby="tx-modal-title"
                className="modal-gradient-bg relative bg-dark-bg w-full max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/10 border border-dark-border"
            >
                <div className="p-6">
                    <div className="flex justify-between items-start">
                        <h2 id="tx-modal-title" className="font-display text-2xl font-bold text-white">Transaction Details</h2>
                        <button onClick={handleClose} aria-label="Close modal" className="p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
                            <XIcon className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="px-6 pb-6 flex flex-col items-center">
                    <TransactionIcon type={tx.type} />
                    <p className={`font-display text-4xl font-bold mt-4 ${amountColor}`}>
                        {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} {tx.currency}
                    </p>
                    <p className="text-slate-300 mt-1 capitalize">{tx.description}</p>
                </div>

                <div className="px-6 pb-6 bg-dark-card/50 border-t border-dark-border">
                    <DetailRow label="Transaction ID" value={tx.id} isAddress onCopy={(val) => handleCopy(val, 'Transaction ID')} />
                    <DetailRow label="Status" value={tx.status} />
                    <DetailRow label="Timestamp" value={new Date(tx.timestamp).toLocaleString()} />
                    <DetailRow label="From" value={tx.from} isAddress onCopy={(val) => handleCopy(val, 'From Address')} />
                    <DetailRow label="To" value={tx.to} isAddress onCopy={(val) => handleCopy(val, 'To Address')} />
                    <DetailRow label="Network Fee" value={`${tx.fee} SUI`} />
                </div>
                 <div className="p-4 bg-dark-bg/80 border-t border-dark-border">
                    <a href={`https://suivision.xyz/txblock/${tx.id}`} target="_blank" rel="noopener noreferrer">
                        <Button variant="secondary" className="w-full">
                            <ExternalLinkIcon className="w-4 h-4 mr-2" />
                            View on SuiVision
                        </Button>
                    </a>
                </div>
            </m.div>
        </div>
    );
};

export default TransactionDetailModal;