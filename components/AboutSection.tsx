import React, { useRef, useEffect, useState } from 'react';
import { DeFiIcon, GamingIcon, NftIcon } from './Icons';
import ParticleBackground from './ParticleBackground';

const AnimatedItem: React.FC<{ children: React.ReactNode; delay?: number }> = ({ children, delay = 0 }) => {
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
    <div ref={ref} className={`transition-all duration-700 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`} style={{ transitionDelay: `${delay}ms` }}>
      {children}
    </div>
  );
};

const VisualCore = () => (
    <div className="relative aspect-square w-full max-w-md mx-auto flex items-center justify-center">
        {/* Pulsing Glow */}
        <div className="absolute w-2/3 h-2/3 bg-blue-500 rounded-full blur-3xl opacity-30 animate-pulse"></div>
        <div className="absolute w-1/2 h-1/2 bg-indigo-500 rounded-full blur-3xl opacity-20 animate-pulse" style={{ animationDelay: '0.5s' }}></div>

        {/* Rotating Rings */}
        <div className="absolute w-full h-full border border-blue-500/20 rounded-full animate-spin-slow"></div>
        <div className="absolute w-3/4 h-3/4 border border-indigo-500/20 rounded-full animate-spin-slow-reverse" style={{ animationDelay: '0.2s' }}></div>
        <div className="absolute w-1/2 h-1/2 border-2 border-blue-500/30 rounded-full animate-spin-slow"></div>

        {/* Central Orb */}
        <div className="relative w-1/4 h-1/4 bg-gradient-to-br from-indigo-400 to-blue-500 rounded-full shadow-2xl shadow-blue-500/50"></div>
    </div>
);

interface AboutSectionProps {
    animatedBackgroundsEnabled: boolean;
}

const AboutSection: React.FC<AboutSectionProps> = ({ animatedBackgroundsEnabled }) => {
  const categories = [
    { name: 'DeFi', icon: <DeFiIcon className="w-8 h-8 text-blue-400" /> },
    { name: 'Gaming', icon: <GamingIcon className="w-8 h-8 text-blue-400" /> },
    { name: 'NFTs', icon: <NftIcon className="w-8 h-8 text-blue-400" /> }
  ];

  return (
    <>
      <section id="about" className="relative py-20 lg:py-32 overflow-hidden">
        {animatedBackgroundsEnabled && <ParticleBackground />}
        <div className="container mx-auto px-6 relative">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <div className="order-2 md:order-1">
              <AnimatedItem>
                <h2 className="font-display text-3xl md:text-4xl font-bold text-white mb-6">
                  Built for Discovery, Powered by Community.
                </h2>
              </AnimatedItem>
              <AnimatedItem delay={150}>
                <p className="text-lg text-gray-400 mb-6">
                  Sui Ecosystem Explorer is your curated gateway to the vibrant world of decentralized applications on the Sui blockchain. We provide the tools and insights you need to navigate this rapidly growing landscape with confidence.
                </p>
              </AnimatedItem>
              <AnimatedItem delay={300}>
                <p className="text-lg text-gray-400">
                  Our mission is to foster a transparent and accessible ecosystem where developers can showcase their innovations and users can discover the next generation of dApps.
                </p>
              </AnimatedItem>
              <AnimatedItem delay={450}>
                <div className="mt-10 flex space-x-8">
                  {categories.map((category) => (
                    <div key={category.name} className="flex flex-col items-center text-center group cursor-pointer">
                      <div className="bg-indigo-900/30 p-4 rounded-full border border-blue-500/30 mb-3 transition-all duration-300 group-hover:bg-blue-500/20 group-hover:scale-110 group-hover:shadow-lg group-hover:shadow-blue-500/20 group-hover:border-blue-500/80">
                        {category.icon}
                      </div>
                      <span className="font-semibold text-gray-300 transition-colors duration-300 group-hover:text-white">{category.name}</span>
                    </div>
                  ))}
                </div>
              </AnimatedItem>
            </div>
            <div className="order-1 md:order-2">
              <AnimatedItem delay={100}>
                <VisualCore />
              </AnimatedItem>
            </div>
          </div>
        </div>
      </section>
      <style>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @keyframes spin-slow-reverse {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow { animation: spin-slow 20s linear infinite; }
        .animate-spin-slow-reverse { animation: spin-slow-reverse 25s linear infinite; }
      `}</style>
    </>
  );
};

export default AboutSection;