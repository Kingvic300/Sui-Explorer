import React from 'react';
import { m } from 'framer-motion';

const HeroVisuals: React.FC = () => {
    return (
        <div className="absolute inset-0 -z-10 overflow-hidden" aria-hidden="true">
            <m.div
                className="absolute top-[10%] left-[5%] w-64 h-64 bg-accent-blue/40 rounded-full filter blur-3xl opacity-30"
                animate={{
                    x: [0, 50, 0],
                    y: [0, -30, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 15,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut'
                }}
            />
             <m.div
                className="absolute bottom-[15%] right-[10%] w-72 h-72 bg-accent-indigo/40 rounded-full filter blur-3xl opacity-30"
                animate={{
                    x: [0, -40, 0],
                    y: [0, 60, 0],
                    scale: [1, 0.9, 1],
                }}
                transition={{
                    duration: 20,
                    repeat: Infinity,
                    repeatType: 'reverse',
                    ease: 'easeInOut',
                    delay: 3
                }}
            />
        </div>
    )
}

export default HeroVisuals;
