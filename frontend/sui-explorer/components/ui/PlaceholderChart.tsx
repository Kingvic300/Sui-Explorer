
import React, { useEffect, useState } from 'react';
import { useThemeStore } from '../../stores/useThemeStore';

const PlaceholderChart: React.FC = () => {
    const { theme } = useThemeStore();
    const [isMounted, setIsMounted] = useState(false);
    
    const lineColor = theme === 'dark' ? '#60A5FA' : '#4F46E5';
    const gridColor = theme === 'dark' ? 'rgba(255, 255, 255, 0.08)' : 'rgba(0, 0, 0, 0.05)';

    useEffect(() => {
        setIsMounted(true);
    }, []);

    if (!isMounted) return null;

    return (
        <div className="w-full h-full opacity-0 animate-fade-in-down" style={{animationDelay: '200ms'}}>
            <svg width="100%" height="100%" viewBox="0 0 400 150" preserveAspectRatio="none">
                <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor={lineColor} stopOpacity={0.2} />
                        <stop offset="100%" stopColor={lineColor} stopOpacity={0} />
                    </linearGradient>
                </defs>
                {/* Grid lines */}
                <g stroke={gridColor} strokeWidth="0.5" strokeDasharray="2,3">
                    {[...Array(5)].map((_, i) => (
                        <line key={`h-${i}`} x1="0" y1={(i * 37.5)} x2="400" y2={(i * 37.5)} />
                    ))}
                    {[...Array(8)].map((_, i) => (
                        <line key={`v-${i}`} x1={((i + 1) * 50)} y1="0" x2={((i + 1) * 50)} y2="150" />
                    ))}
                </g>
                {/* Data line */}
                <path d="M0,100 C50,80 100,120 150,90 S250,20 300,60 S350,110 400,90" fill="none" stroke={lineColor} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="path-animation" />
                {/* Gradient area */}
                <path d="M0,100 C50,80 100,120 150,90 S250,20 300,60 S350,110 400,90 L400,150 L0,150 Z" fill="url(#chartGradient)" />

                <style>
                    {`
                        .path-animation {
                            stroke-dasharray: 800;
                            stroke-dashoffset: 800;
                            animation: dash 2.5s ease-out forwards;
                            animation-delay: 300ms;
                        }
                        @keyframes dash {
                            to {
                                stroke-dashoffset: 0;
                            }
                        }
                    `}
                </style>
            </svg>
        </div>
    );
};

export default PlaceholderChart;
