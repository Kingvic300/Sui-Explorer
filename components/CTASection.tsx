

import React, { useRef, useEffect, useState } from 'react';
import ParticleBackground from './ParticleBackground';

const AnimatedItem: React.FC<{ children: React.ReactNode; delay?: number, className?: string }> = ({ children, delay = 0, className }) => {
    const ref = useRef<HTMLDivElement>(null);
    const [isVisible, setIsVisible] = useState(false);
  
    useEffect(() => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setIsVisible(true);
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
  
      const currentRef = ref.current;
      if (currentRef) {
        observer.observe(currentRef);
      }
  
      return () => {
        if (currentRef) {
          observer.unobserve(currentRef);
        }
      };
    }, []);
  
    return (
      <div ref={ref} className={`transition-all duration-700 ease-out ${className} ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: `${delay}ms` }}>
        {children}
      </div>
    );
  };

const GatewayVisual = () => (
    <div className="relative w-full h-80 lg:h-full flex items-center justify-center [perspective:800px]">
        <div className="absolute w-full h-full animate-gateway-rotate" style={{ transformStyle: 'preserve-3d' }}>
            {/* Rings */}
            <div className="absolute inset-10 border border-blue-500/30 rounded-full animate-spin-slow"></div>
            <div className="absolute inset-20 border border-indigo-500/30 rounded-full animate-spin-slow-reverse"></div>
            <div className="absolute inset-32 border-2 border-blue-500/50 rounded-full animate-spin-slow"></div>
            
            {/* Glows */}
            <div className="absolute w-1/2 h-1/2 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
            <div className="absolute w-1/3 h-1/3 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-indigo-400 rounded-full blur-2xl opacity-40 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

            {/* Central Orb */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-gradient-to-br from-white to-blue-300 rounded-full shadow-2xl shadow-white/50"></div>
        </div>
    </div>
);

interface CTASectionProps {
    onNavigateToDashboard: () => void;
    animatedBackgroundsEnabled: boolean;
}

const CTASection: React.FC<CTASectionProps> = ({ onNavigateToDashboard, animatedBackgroundsEnabled }) => {
  return (
    <>
      <section className="relative py-20 lg:py-32 overflow-hidden">
        {animatedBackgroundsEnabled && <ParticleBackground />}
        <div className="container mx-auto px-6 relative">
            <div className="grid lg:grid-cols-2 gap-16 items-center">
                <div>
                    <AnimatedItem>
                        <h2 className="font-display text-3xl md:text-5xl font-bold text-white mb-6">
                            Step into the Future of dApps.
                        </h2>
                    </AnimatedItem>
                    <AnimatedItem delay={150}>
                        <p className="text-lg text-gray-300 mb-8 max-w-lg">
                           Your journey into the Sui ecosystem begins here. Explore groundbreaking projects, connect with the community, and be part of the decentralized revolution.
                        </p>
                    </AnimatedItem>
                    <AnimatedItem delay={300}>
                        <button 
                            onClick={onNavigateToDashboard}
                            className="group relative inline-block text-lg font-bold text-white bg-blue-600 py-4 px-10 rounded-xl transition-all duration-300 transform hover:scale-105 overflow-hidden shadow-lg shadow-blue-600/30 hover:shadow-blue-500/50">
                            <span className="absolute top-0 -left-full w-full h-full bg-white/20 blur-md opacity-50 -skew-x-12 transform group-hover:left-full transition-all duration-700" />
                            <span className="relative">Start Exploring</span>
                        </button>
                    </AnimatedItem>
                </div>
                <AnimatedItem delay={200} className="lg:h-96">
                    <GatewayVisual />
                </AnimatedItem>
            </div>
        </div>
      </section>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 25s linear infinite; }

        @keyframes gateway-rotate {
            0% { transform: rotateX(60deg) rotateY(0deg) rotateZ(0deg); }
            50% { transform: rotateX(60deg) rotateY(10deg) rotateZ(5deg); }
            100% { transform: rotateX(60deg) rotateY(0deg) rotateZ(0deg); }
        }
        .animate-gateway-rotate {
            animation: gateway-rotate 15s ease-in-out infinite;
        }
      `}</style>
    </>
  );
};

export default CTASection;