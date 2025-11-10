
import React from 'react';

const ImagePlaceholder: React.FC<{ className?: string }> = ({ className }) => (
  <div className={`w-full h-full bg-slate-200 dark:bg-dark-border animate-pulse ${className}`} />
);

export default ImagePlaceholder;
