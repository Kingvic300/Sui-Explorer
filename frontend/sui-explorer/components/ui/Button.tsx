
import React from 'react';
import { m } from 'framer-motion';
import Magnetic from './Magnetic';
import { SpinnerIcon } from '../icons/MiscIcons';
import { ButtonProps } from '../../types/index';

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', className = '', isLoading = false, ...props }) => {
  const buttonBaseClasses = 'px-6 py-3 rounded-lg font-semibold transition-all duration-300 transform focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-light-bg dark:focus:ring-offset-dark-bg text-sm inline-flex items-center justify-center';

  const buttonVariantClasses = {
    primary: 'bg-blue-600 hover:bg-blue-700 text-white focus:ring-blue-500 shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40',
    secondary: 'bg-slate-200 dark:bg-dark-card hover:bg-slate-300 dark:hover:bg-dark-border text-slate-800 dark:text-slate-200 focus:ring-slate-500 border border-transparent dark:border-dark-border',
    outline: 'bg-transparent border border-slate-300 dark:border-dark-border hover:bg-slate-100 dark:hover:bg-accent-blue/10 dark:hover:border-accent-blue/30 text-slate-700 dark:text-white focus:ring-accent-blue',
  };
  
  const buttonDisabledClasses = 'opacity-60 cursor-not-allowed';

  return (
    <Magnetic>
      <m.button
        whileHover={!isLoading && !props.disabled ? { scale: 1.05, y: -2 } : {}}
        whileTap={!isLoading && !props.disabled ? { scale: 0.95 } : {}}
        transition={{ type: 'spring', stiffness: 400, damping: 17 }}
        className={`${buttonBaseClasses} ${buttonVariantClasses[variant]} ${className} ${(isLoading || props.disabled) ? buttonDisabledClasses : ''}`}
        disabled={isLoading || props.disabled}
        {...props}
      >
        {isLoading ? <SpinnerIcon className="animate-spin h-5 w-5" /> : children}
      </m.button>
    </Magnetic>
  );
};

export default Button;