import React from 'react';
import { CardProps } from '../../types/index';

const Card: React.FC<CardProps> = ({ children, className = '', variant = 'default' }) => {
  const baseClasses = 'relative rounded-xl transition-all duration-300 shadow-card hover:shadow-card-hover dark:hover:border-accent-blue/40';
  
  const variantClasses = {
    default: 'bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border',
    dashed: 'bg-light-card dark:bg-dark-card border-2 border-dashed border-slate-300 dark:border-dark-border',
  };

  return (
    <div className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;