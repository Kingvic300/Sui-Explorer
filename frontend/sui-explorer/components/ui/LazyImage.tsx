

import React, { useState, useRef } from 'react';
import { m } from 'framer-motion';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';
import ImagePlaceholder from './ImagePlaceholder';

// FIX: Changed interface to an intersection type to correctly merge motion props with custom props.
// This ensures that standard img attributes like `src` and `alt` are recognized by TypeScript.
// This also resolves a type conflict for animation-related event handlers (like onAnimationStart)
// between standard React HTML attributes and Framer Motion's custom props.
type LazyImageProps = {
  placeholderClassName?: string;
  wrapperClassName?: string;
} & React.ComponentProps<typeof m.img>;

const LazyImage: React.FC<LazyImageProps> = ({
  src,
  alt,
  className,
  placeholderClassName,
  wrapperClassName,
  ...props
}) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(imgRef, { rootMargin: '100px' });

  return (
    <div ref={imgRef} className={`relative overflow-hidden ${wrapperClassName}`}>
      {isVisible && (
        <m.img
          src={src}
          alt={alt}
          className={className}
          initial={{ opacity: 0 }}
          animate={{ opacity: isLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          onLoad={() => setIsLoaded(true)}
          {...props}
        />
      )}
      {!isLoaded && isVisible && (
        <div className="absolute inset-0">
          <ImagePlaceholder className={placeholderClassName} />
        </div>
      )}
      {/* Fallback to maintain space before visibility */}
      {!isVisible && <div className="w-full h-full" />}
    </div>
  );
};

export default React.memo(LazyImage);
