import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useToastStore } from '../../stores/useToastStore';
import Toast from './Toast';

const ToastManager: React.FC = () => {
  const { toasts } = useToastStore();

  return (
    <div className="fixed bottom-0 right-0 z-[9999] p-4 space-y-2">
      <AnimatePresence>
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default ToastManager;
