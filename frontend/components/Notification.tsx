
import React from 'react';
import { CheckCircleIcon } from './Icons';

interface NotificationProps {
  message: string;
  isVisible: boolean;
  type?: 'success' | 'error';
}

const ErrorIcon: React.FC<{ className?: string }> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
);


const Notification: React.FC<NotificationProps> = ({ message, isVisible, type = 'success' }) => {
    const isError = type === 'error';

    const containerClasses = isError
      ? 'bg-red-900/80 border-red-700 shadow-red-500/30'
      : 'bg-green-900/80 border-green-700 shadow-green-500/30';
  
    const icon = isError ? <ErrorIcon className="w-6 h-6" /> : <CheckCircleIcon className="w-6 h-6" />;

    return (
        <div
        className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 backdrop-blur-lg text-white py-3 px-6 rounded-lg shadow-lg transition-all duration-300 ease-in-out
            ${containerClasses}
            ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'}`}
        >
        {icon}
        <span className="font-semibold">{message}</span>
        </div>
    );
};

export default Notification;
