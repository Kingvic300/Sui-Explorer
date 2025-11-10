

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence, m, Variants } from 'framer-motion';
import { ChevronDownIcon } from '../icons/MiscIcons';

interface DropdownMenuProps {
  triggerText: string;
  children: React.ReactNode;
}

const DropdownMenu: React.FC<DropdownMenuProps> = ({ triggerText, children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const dropdownVariants: Variants = {
    hidden: { opacity: 0, y: -10, scale: 0.95 },
    visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.2, ease: 'easeOut' } },
    exit: { opacity: 0, y: -10, scale: 0.95, transition: { duration: 0.15, ease: 'easeIn' } },
  };

  // Close dropdown on clicks outside of the component
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div
      className="relative"
      ref={dropdownRef}
    >
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-1 relative text-sm font-medium transition-colors text-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md focus:outline-none"
        aria-haspopup="true"
        aria-expanded={isOpen}
      >
        {triggerText}
        <m.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDownIcon className="w-4 h-4" />
        </m.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <m.div
            variants={dropdownVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="absolute top-full mt-2 w-48 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg shadow-lg origin-top z-20 overflow-hidden"
          >
            <div className="p-2">
              {React.Children.map(children, (child) => {
                if (React.isValidElement(child)) {
                  // This component is designed to work with children that can accept an onClick prop (like <Link> or <button>).
                  // We clone the element to pass down a function that closes the dropdown.
                  // FIX: Cast child.props to `any` to safely access the `onClick` property, resolving a TypeScript error.
                  const originalOnClick = (child.props as any).onClick;
                  return React.cloneElement(child as React.ReactElement<any>, {
                    onClick: (e: React.MouseEvent<HTMLElement>) => {
                      if (originalOnClick) {
                        originalOnClick(e);
                      }
                      setIsOpen(false);
                    },
                  });
                }
                return child;
              })}
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default DropdownMenu;
