import React from 'react';
import { m } from 'framer-motion';
import { useMagneticEffect } from '../../hooks/useMagneticEffect';

interface MagneticProps {
  children: React.ReactNode;
  strength?: number;
}

const Magnetic: React.FC<MagneticProps> = ({ children, strength = 25 }) => {
  const { ref, onMouseMove, onMouseLeave, x, y } = useMagneticEffect(strength);

  // FIX: Replaced the flawed `cloneElement` implementation with a simple `m.div` wrapper.
  // The original approach had two issues:
  // 1. It attempted to pass a `ref` via `cloneElement` to children that may not support ref-forwarding, causing errors.
  // 2. It tried to access `children.props.style`, which is not type-safe and caused a type error.
  // This wrapper approach is more robust, works with any child component, and correctly composes transforms.
  return (
    <m.div
      ref={ref}
      onMouseMove={onMouseMove}
      onMouseLeave={onMouseLeave}
      style={{
        x,
        y,
      }}
    >
      {children}
    </m.div>
  );
};

export default Magnetic;