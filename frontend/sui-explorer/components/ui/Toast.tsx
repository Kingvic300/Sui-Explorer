import React, { useEffect } from 'react';
import { m } from 'framer-motion';
import { ToastMessage, useToastStore } from '../../stores/useToastStore';
import { CheckCircleIcon, XIcon, ZapIcon } from '../icons/MiscIcons';

interface ToastProps {
  toast: ToastMessage;
}

const icons = {
  success: <CheckCircleIcon className="w-6 h-6 text-green-500" />,
  error: <div className="p-1 bg-red-500/20 rounded-full"><XIcon className="w-4 h-4 text-red-400" /></div>,
  warning: <ZapIcon className="w-6 h-6 text-yellow-500" />,
  info: <ZapIcon className="w-6 h-6 text-blue-500" />,
};

const Toast: React.FC<ToastProps> = ({ toast }) => {
  const { removeToast } = useToastStore();

  useEffect(() => {
    const timer = setTimeout(() => {
      removeToast(toast.id);
    }, toast.duration || 5000);

    return () => {
      clearTimeout(timer);
    };
  }, [toast, removeToast]);

  return (
    <m.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.3 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.5, transition: { duration: 0.2 } }}
      className="flex items-start w-full max-w-sm p-4 space-x-4 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl shadow-lg"
    >
      <div className="flex-shrink-0">{icons[toast.type]}</div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-slate-800 dark:text-slate-100">{toast.title}</p>
        {toast.message && <p className="text-sm text-slate-800 dark:text-slate-300 mt-1">{toast.message}</p>}
      </div>
      <button onClick={() => removeToast(toast.id)} className="p-1 rounded-full hover:bg-slate-200 dark:hover:bg-dark-border">
        <XIcon className="w-4 h-4 text-slate-500" />
      </button>
    </m.div>
  );
};

export default Toast;