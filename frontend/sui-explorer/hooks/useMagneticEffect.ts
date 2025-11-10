// FIX: Added missing import for React to resolve namespace error.
import React, { useRef } from 'react';
import { useMotionValue, useSpring } from 'framer-motion';

export const useMagneticEffect = (strength: number = 20) => {
  const ref = useRef<HTMLDivElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springConfig = { damping: 15, stiffness: 200, mass: 0.5 };
  const springX = useSpring(x, springConfig);
  const springY = useSpring(y, springConfig);
  
  const onMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return;
    const { clientX, clientY } = e;
    const { width, height, left, top } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    const distanceX = clientX - centerX;
    const distanceY = clientY - centerY;
    
    x.set(distanceX * (strength / 100));
    y.set(distanceY * (strength / 100));
  };

  const onMouseLeave = () => {
    x.set(0);
    y.set(0);
  };
  
  return { ref, onMouseMove, onMouseLeave, x: springX, y: springY };
};
