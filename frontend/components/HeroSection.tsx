
import React, { useRef, useEffect } from 'react';
import { DeFiIcon, GamingIcon, NftIcon, CheckCircleIcon, BoltIcon } from './Icons';

interface HeroSectionProps {
    onNavigateToDashboard: () => void;
    onSubmitProjectClick: () => void;
}

const AnimatedSection: React.FC<{ children: React.ReactNode, delay?: string }> = ({ children, delay = '0s' }) => {
    return (
        <div className="opacity-0 animate-[fade-in-up_1s_ease-out_forwards]" style={{ animationDelay: delay }}>
            {children}
        </div>
    );
};

const dApps = [
    { name: 'Aura Finance', category: 'DeFi', icon: <DeFiIcon className="w-6 h-6 text-blue-400" /> },
    { name: 'Cyberscape', category: 'Gaming', icon: <GamingIcon className="w-6 h-6 text-blue-400" /> },
    { name: 'NFT Nexus', category: 'NFTs', icon: <NftIcon className="w-6 h-6 text-blue-400" /> },
    { name: 'SuiSwap', category: 'DeFi', icon: <DeFiIcon className="w-6 h-6 text-blue-400" /> },
    { name: 'PixelVerse', category: 'Gaming', icon: <GamingIcon className="w-6 h-6 text-blue-400" /> },
];

const HeroSection: React.FC<HeroSectionProps> = ({ onNavigateToDashboard, onSubmitProjectClick }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let particlesArray: Particle[] = [];
    const numberOfParticles = 200;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    setCanvasSize();

    class Particle {
      x: number;
      y: number;
      size: number;
      speedX: number;
      speedY: number;
      color: string;

      constructor(x: number, y: number, size: number, speedX: number, speedY: number, color: string) {
        this.x = x;
        this.y = y;
        this.size = size;
        this.speedX = speedX;
        this.speedY = speedY;
        this.color = color;
      }
      draw() {
        if (!ctx) return;
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.closePath();
        ctx.fill();
      }
      update() {
        if (this.x > canvas.width || this.x < 0) this.speedX = -this.speedX;
        if (this.y > canvas.height || this.y < 0) this.speedY = -this.speedY;
        this.x += this.speedX;
        this.y += this.speedY;
        this.draw();
      }
    }

    const init = () => {
      particlesArray = [];
      const colors = ['rgba(255, 255, 255, 0.7)', 'rgba(30, 144, 255, 0.5)'];
      for (let i = 0; i < numberOfParticles; i++) {
        const size = Math.random() * 1.2 + 0.5;
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const speedX = Math.random() * 0.2 - 0.1;
        const speedY = Math.random() * 0.2 - 0.1;
        const color = colors[Math.floor(Math.random() * colors.length)];
        particlesArray.push(new Particle(x, y, size, speedX, speedY, color));
      }
    };

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particlesArray.forEach(particle => particle.update());
      requestAnimationFrame(animate);
    };

    init();
    animate();

    const handleResize = () => {
        setCanvasSize();
        init();
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 overflow-hidden bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/30 via-[#0d0c1b] to-[#0d0c1b]">
      <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full z-0 opacity-50" />
      <div className="container mx-auto px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 lg:gap-12 items-center">
              <div className="text-center lg:text-left">
                  <AnimatedSection delay="0.2s">
                    <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-extrabold text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-300 leading-tight mb-4">
                      Discover the Future of the Sui Ecosystem.
                    </h1>
                  </AnimatedSection>
                  <AnimatedSection delay="0.4s">
                    <p className="max-w-xl mx-auto lg:mx-0 text-lg md:text-xl text-zinc-300 mb-8 font-display font-semibold">
                      Explore, learn, and connect with the most innovative dApps on Sui.
                    </p>
                  </AnimatedSection>
                  <AnimatedSection delay="0.5s">
                    <div className="flex items-center justify-center lg:justify-start gap-8 mb-10">
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <CheckCircleIcon className="w-5 h-5 text-blue-500" />
                            <span>Trusted by 100+ dApps</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-400">
                            <BoltIcon className="w-5 h-5 text-blue-500" />
                            <span>Blazing Fast Network</span>
                        </div>
                    </div>
                  </AnimatedSection>
                  <AnimatedSection delay="0.6s">
                    <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                      <button onClick={onNavigateToDashboard} className="bg-blue-600 text-white font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-300 transform hover:scale-105 hover:bg-blue-500">
                        Explore Projects
                      </button>
                      <button onClick={onSubmitProjectClick} className="bg-transparent border border-blue-900/80 text-zinc-300 font-semibold py-3 px-8 rounded-lg text-lg transition-all duration-300 hover:bg-blue-900/30 hover:border-blue-800">
                          Submit Your Project
                      </button>
                    </div>
                  </AnimatedSection>
              </div>

              <div className="relative flex justify-center items-center mt-16 lg:mt-0 animate-[fade-in_2s_ease-out_1s_forwards] opacity-0">
                    <div className="floating-card-1 absolute -top-4 -left-4 sm:-top-8 sm:-left-12 bg-indigo-950/40 backdrop-blur-md p-2 sm:p-3 rounded-xl border border-blue-800/50 shadow-lg z-10">
                        <div className="flex items-center gap-2">
                            <CheckCircleIcon className="w-5 h-5 text-blue-500"/>
                            <span className="text-white font-display font-semibold text-sm">Premium dApps</span>
                        </div>
                    </div>
                    <div className="floating-card-2 absolute -bottom-4 -right-4 sm:-bottom-10 sm:-right-16 bg-indigo-950/40 backdrop-blur-md p-2 sm:p-3 rounded-xl border border-blue-800/50 shadow-lg z-10">
                        <div className="flex items-center gap-2">
                            <GamingIcon className="w-5 h-5 text-blue-500"/>
                            <span className="text-white font-display font-semibold text-sm">Top Tier Gaming</span>
                        </div>
                    </div>
                    <div className="floating-card-3 absolute top-1/2 -left-8 sm:-left-24 bg-indigo-950/40 backdrop-blur-md p-2 sm:p-3 rounded-xl border border-blue-800/50 shadow-lg z-10">
                        <div className="flex items-center gap-2">
                            <DeFiIcon className="w-5 h-5 text-blue-500"/>
                            <span className="text-white font-display font-semibold text-sm">DeFi Leaders</span>
                        </div>
                    </div>

                    <div className="phone-mockup">
                        <div className="phone-frame">
                            <div className="phone-screen p-4 text-white font-body text-sm overflow-y-auto">
                                <div className="text-center mb-4">
                                    <h2 className="font-display font-bold text-lg text-transparent bg-clip-text bg-gradient-to-b from-white to-blue-300">Sui dApps</h2>
                                    <p className="text-xs text-zinc-400">Featured this week</p>
                                </div>
                                <div className="flex justify-around bg-blue-950/30 p-1 rounded-lg mb-4 text-xs">
                                    <button className="bg-blue-600 text-white py-1 px-3 rounded-md">All</button>
                                    <button className="text-zinc-300 py-1 px-3">DeFi</button>
                                    <button className="text-zinc-300 py-1 px-3">Gaming</button>
                                    <button className="text-zinc-300 py-1 px-3">NFTs</button>
                                </div>
                                <div className="space-y-3">
                                    {dApps.map((app, index) => (
                                        <div key={index} className="dapp-item flex items-center bg-blue-950/50 p-3 rounded-lg transition-transform duration-300 hover:scale-105 hover:bg-blue-950/80" style={{ animationDelay: `${index * 100}ms` }}>
                                            <div className="p-2 bg-blue-900/40 rounded-md mr-3">
                                                {app.icon}
                                            </div>
                                            <div>
                                                <p className="font-semibold">{app.name}</p>
                                                <p className="text-xs text-zinc-400">{app.category}</p>
                                            </div>
                                            <div className="ml-auto text-zinc-500">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" /></svg>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
              </div>
          </div>
      </div>
       <style>{`
        @keyframes fade-in-up {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fade-in {
            from { opacity: 0; transform: scale(0.95); }
            to { opacity: 1; transform: scale(1); }
        }
        @keyframes float-animation {
            0% { transform: translateY(0px); }
            50% { transform: translateY(-20px); }
            100% { transform: translateY(0px); }
        }
        @keyframes slide-in-item {
            from { opacity: 0; transform: translateX(-15px); }
            to { opacity: 1; transform: translateX(0); }
        }
        .dapp-item {
            opacity: 0;
            animation: slide-in-item 0.5s ease-out forwards;
        }
        .phone-mockup {
            width: clamp(260px, 70vw, 300px);
            height: clamp(520px, 140vw, 600px);
            animation: float-animation 6s ease-in-out infinite;
            filter: drop-shadow(0 25px 25px rgb(0 0 0 / 0.25));
        }
        .phone-frame {
            position: relative;
            width: 100%;
            height: 100%;
            background: #111;
            border-radius: 40px;
            padding: 12px;
            box-shadow: inset 0 0 2px 2px #222, inset 0 0 0 6px #000;
        }
        .phone-screen {
            width: 100%;
            height: 100%;
            background-color: #050505;
            border-radius: 28px;
            overflow: hidden;
        }
        .phone-screen::-webkit-scrollbar {
            display: none;
        }
        
        @keyframes float-animation-1 {
            0% { transform: translateY(0px) rotate(-15deg); }
            50% { transform: translateY(-15px) rotate(-10deg); }
            100% { transform: translateY(0px) rotate(-15deg); }
        }
        .floating-card-1 {
            animation: float-animation-1 8s ease-in-out infinite;
        }

        @keyframes float-animation-2 {
            0% { transform: translateY(0px) rotate(10deg); }
            50% { transform: translateY(-20px) rotate(15deg); }
            100% { transform: translateY(0px) rotate(10deg); }
        }
        .floating-card-2 {
            animation: float-animation-2 10s ease-in-out infinite;
            animation-delay: 0.5s;
        }

        @keyframes float-animation-3 {
            0% { transform: translateY(0px) rotate(-10deg); }
            50% { transform: translateY(-12px) rotate(-15deg); }
            100% { transform: translateY(0px) rotate(-10deg); }
        }
        .floating-card-3 {
            animation: float-animation-3 9s ease-in-out infinite;
            animation-delay: 1s;
        }
       `}</style>
    </section>
  );
};

export default HeroSection;
