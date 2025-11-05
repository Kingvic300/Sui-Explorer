
import React, { useState, useEffect } from 'react';
import { SuiLogo, XLogo } from '../Icons';

interface AuthModalProps {
  onClose: () => void;
  onLoginSuccess: (address: string) => void;
}

const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLoginSuccess }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') {
                handleClose();
            }
        };
        document.addEventListener('keydown', handleKeyDown);
        return () => document.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleClose = () => {
        if (isConnecting) return;
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    const handleConnectWallet = () => {
        setIsConnecting(true);
        // Simulate wallet connection
        setTimeout(() => {
            const mockAddress = `0x${[...Array(64)].map(() => Math.floor(Math.random() * 16).toString(16)).join('')}`;
            onLoginSuccess(mockAddress);
            setIsConnecting(false);
        }, 1500);
    };

  return (
    <div 
        className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="auth-modal-title"
    >
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>
      <div className={`relative bg-gray-900 w-full max-w-md rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 transition-transform duration-300 ${isClosing ? 'scale-95' : 'scale-100'}`}>
        <div className="p-8 text-center">
            <div className="w-16 h-16 mx-auto mb-4 bg-indigo-950/40 border border-blue-900/50 rounded-full flex items-center justify-center">
                <SuiLogo className="w-8 h-8"/>
            </div>
            <h2 id="auth-modal-title" className="font-display text-2xl font-bold text-white">Join the Community</h2>
            <p className="text-gray-400 mt-2 text-sm">Connect your wallet to review, follow projects, and post in the community.</p>

            <div className="mt-8 space-y-4">
                <button
                    onClick={handleConnectWallet}
                    disabled={isConnecting}
                    className="w-full bg-blue-600 text-white font-semibold py-3 px-5 rounded-lg hover:bg-blue-500 transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-wait"
                >
                    {isConnecting ? (
                         <>
                            <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            <span>Connecting...</span>
                        </>
                    ) : (
                        <>
                            <SuiLogo className="w-5 h-5"/>
                            <span>Connect Sui Wallet</span>
                        </>
                    )}
                </button>
                <div className="flex items-center gap-4">
                    <div className="flex-grow border-t border-gray-700/60"></div>
                    <span className="text-gray-500 text-xs font-semibold">OR</span>
                    <div className="flex-grow border-t border-gray-700/60"></div>
                </div>
                 <button className="w-full bg-gray-800 text-white font-semibold py-3 px-5 rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-3">
                    <svg className="w-5 h-5" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path fill="#4285F4" d="M43.611 20.083H24v8.52h11.02c-.477 5.48-4.654 9.57-9.94 9.57-6.048 0-10.95-4.902-10.95-10.95s4.902-10.95 10.95-10.95c3.39 0 6.13 1.38 8.14 3.25l6.7-6.7C35.03 2.77 29.89 0 24 0 10.75 0 0 10.75 0 24s10.75 24 24 24c13.75 0 23.3-9.83 23.3-23.5 0-1.55-.13-3.05-.389-4.417z"/>
                        <path fill="#34A853" d="M43.611 20.083H24v8.52h11.02c-.477 5.48-4.654 9.57-9.94 9.57-6.048 0-10.95-4.902-10.95-10.95s4.902-10.95 10.95-10.95c3.39 0 6.13 1.38 8.14 3.25l6.7-6.7C35.03 2.77 29.89 0 24 0 10.75 0 0 10.75 0 24s10.75 24 24 24c13.75 0 23.3-9.83 23.3-23.5 0-1.55-.13-3.05-.389-4.417z" clip-path="url(#__clip0_3030_1000)"/>
                        <path fill-opacity=".2" fill="#000" d="M24 48c13.25 0 24-10.75 24-24 0-.41-.01-.82-.03-1.22l-1.63 1.63c-2.3 2.22-5.36 3.59-8.73 3.59-5.286 0-9.463-4.09-9.94-9.57H24v8.52h11.02c-.477 5.48-4.654 9.57-9.94 9.57-6.048 0-10.95-4.902-10.95-10.95s4.902-10.95 10.95-10.95c3.39 0 6.13 1.38 8.14 3.25l6.7-6.7C35.03 2.77 29.89 0 24 0 10.75 0 0 10.75 0 24s10.75 24 24 24z"/>
                    </svg>
                    Continue with Google
                </button>
                 <button className="w-full bg-gray-800 text-white font-semibold py-3 px-5 rounded-lg hover:bg-gray-700 transition-all duration-300 flex items-center justify-center gap-3">
                    <XLogo className="w-5 h-5"/>
                    Continue with X
                </button>
            </div>

            <p className="text-xs text-gray-500 mt-8">By connecting, you agree to the Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default AuthModal;
