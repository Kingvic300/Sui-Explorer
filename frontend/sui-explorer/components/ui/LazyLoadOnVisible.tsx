
import React, { useRef, Suspense } from 'react';
import { useIntersectionObserver } from '../../hooks/useIntersectionObserver';

interface LazyLoadOnVisibleProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
  rootMargin?: string;
}

const LazyLoadOnVisible: React.FC<LazyLoadOnVisibleProps> = ({
  children,
  fallback = null,
  rootMargin = '200px',
}) => {
  const ref = useRef<HTMLDivElement>(null);
  const isVisible = useIntersectionObserver(ref, { rootMargin });

  return (
    <div ref={ref} style={{ minHeight: isVisible ? 'auto' : '1px' }}>
      {isVisible ? <Suspense fallback={fallback}>{children}</Suspense> : fallback}
    </div>
  );
};

export default LazyLoadOnVisible;
