

import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { getNotificationIcon, formatTimeAgo } from '../../data/notifications';
import { BellIcon } from '../icons/MiscIcons';
import { useNotificationStore } from '../../stores/useNotificationStore';
import Magnetic from './Magnetic';

const NotificationBell: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { notifications, unreadCount, markAllAsRead } = useNotificationStore();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const shouldAnimateJiggle = unreadCount > 0 && !isOpen;

  return (
    <div className="relative" ref={dropdownRef}>
      <Magnetic>
        <m.button
          onClick={() => setIsOpen(!isOpen)}
          className="relative p-2 rounded-full text-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent-indigo transition-all duration-300"
          aria-label="Toggle notifications"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          animate={shouldAnimateJiggle ? { rotate: [0, -10, 10, -10, 10, 0] } : { rotate: 0 }}
          transition={shouldAnimateJiggle ? { duration: 0.6, delay: 2, repeat: Infinity, repeatDelay: 5 } : { type: 'spring', stiffness: 300 }}
        >
          <BellIcon className="h-5 w-5" />
          {unreadCount > 0 && (
            <span className="absolute top-1.5 right-1.5 block h-2 w-2 rounded-full bg-red-500 ring-2 ring-light-bg dark:ring-dark-bg" />
          )}
        </m.button>
      </Magnetic>
      <AnimatePresence>
        {isOpen && (
          <m.div
            initial={{ opacity: 0, y: -10, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.98 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className="absolute right-0 mt-2 w-80 sm:w-96 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-2xl z-50 overflow-hidden origin-top-right"
          >
            <div className="p-4 flex justify-between items-center border-b border-light-border dark:border-dark-border">
              <h3 className="font-bold text-base text-slate-800 dark:text-slate-100">Notifications</h3>
              {unreadCount > 0 && (
                <button onClick={markAllAsRead} className="text-xs font-medium text-accent-blue hover:underline focus:outline-none">Mark all as read</button>
              )}
            </div>
            <div className="max-h-96 overflow-y-auto">
              {notifications.length > 0 ? (
                notifications.map(notification => (
                  <div key={notification.id} className={`relative p-4 flex items-start space-x-4 border-b border-light-border dark:border-dark-border/50 last:border-b-0 hover:bg-slate-100/50 dark:hover:bg-dark-border/20 transition-colors duration-200 cursor-pointer`}>
                    {!notification.read && (
                      <div className="absolute left-1.5 top-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-accent-blue" aria-hidden="true" />
                    )}
                    <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification.type)}</div>
                    <div className="min-w-0">
                      <p className={`text-sm font-semibold truncate ${!notification.read ? 'text-slate-900 dark:text-white' : 'text-slate-900 dark:text-slate-200'}`}>{notification.title}</p>
                      <p className="text-sm text-slate-800 dark:text-slate-300 mt-1 break-words">{notification.description}</p>
                      <p className="text-xs text-slate-800 dark:text-slate-400 mt-2">{formatTimeAgo(notification.timestamp)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-8 text-center text-sm text-slate-800 dark:text-slate-300 flex flex-col items-center">
                    <BellIcon className="w-10 h-10 text-slate-500 dark:text-slate-600 mb-4" />
                    <h4 className="font-semibold text-slate-900 dark:text-slate-200">All caught up!</h4>
                    <p>You have no new notifications.</p>
                </div>
              )}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBell;