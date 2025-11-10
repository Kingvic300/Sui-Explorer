import React from 'react';
import { m } from 'framer-motion';
import { Link, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import { UsersIcon, SearchIcon, TrendingUpIcon } from '../components/icons/MiscIcons';
import { pageVariants, pageTransition, staggerContainer, itemVariants } from '../utils/animations';
import { prefetchRouteComponent } from '../utils/prefetch';
import HeroVisuals from '../components/ui/HeroVisuals';
import CommunitySection from '../components/community/CommunitySection';
import CTASection from '../components/ui/CTASection';

const LandingPage: React.FC = () => {
  const navigate = useNavigate();

  const handleNavigateToDashboard = () => {
    prefetchRouteComponent('/projects');
    navigate('/projects');
  };

  return (
    <m.div
      variants={pageVariants}
      transition={pageTransition}
      initial="initial"
      animate="in"
      exit="out"
    >
      <m.div
        className="space-y-16 md:space-y-24"
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
      >
        {/* Hero Section */}
        <m.section variants={staggerContainer} className="relative pt-16 pb-10 text-center overflow-hidden">
          <HeroVisuals />
          <m.h1 variants={itemVariants} className="text-5xl md:text-7xl font-display font-extrabold mb-6 leading-tight text-slate-900 dark:text-white">
            Welcome to the <span className="bg-clip-text text-transparent bg-gradient-to-r from-accent-blue to-accent-indigo">Sui</span> Universe.
          </m.h1>
          <m.p variants={itemVariants} className="text-lg text-slate-900 dark:text-slate-200 max-w-2xl mx-auto mb-8">
            Your hub for everything Sui. Discover top projects, track on-chain trends, and connect with the community building the future of Web3.
          </m.p>
          <m.div variants={itemVariants} className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4">
            <Link to="/projects" onMouseEnter={() => prefetchRouteComponent('/projects')}>
              <Button variant="primary" className="!px-8 !py-4">Launch Explorer</Button>
            </Link>
            <Link to="/submit-project" onMouseEnter={() => prefetchRouteComponent('/submit-project')}>
              <Button variant="outline">List Your Project</Button>
            </Link>
          </m.div>
        </m.section>
        
        {/* Why Sui Explorer Section */}
        <m.section
            variants={staggerContainer}
            className="container mx-auto px-4 sm:px-6 lg:px-8"
        >
            <div className="grid md:grid-cols-2 gap-10 items-center">
                 <m.div variants={itemVariants}>
                    <span className="text-sm font-bold uppercase text-accent-blue tracking-widest">WHY SUI EXPLORER</span>
                    <h2 className="text-3xl md:text-4xl font-display font-bold my-4 text-slate-900 dark:text-white">Your Compass for the Ecosystem.</h2>
                    <p className="text-slate-900 dark:text-slate-200 mb-6 leading-relaxed">
                        Navigating a new blockchain can be tough. We cut through the noise, providing clear, reliable data and community insights to help you find the next big thing on Sui.
                    </p>
                    <div className="space-y-4">
                        <div className="flex items-start space-x-3"><SearchIcon className="w-6 h-6 text-accent-indigo flex-shrink-0 mt-1" /><div><h4 className="font-semibold">Discover with Clarity</h4><p className="text-sm text-slate-800 dark:text-slate-300">Find exactly what you're looking for with powerful search and filters.</p></div></div>
                        <div className="flex items-start space-x-3"><TrendingUpIcon className="w-6 h-6 text-accent-indigo flex-shrink-0 mt-1" /><div><h4 className="font-semibold">Trustworthy Data</h4><p className="text-sm text-slate-800 dark:text-slate-300">Make informed decisions with real-time on-chain analytics.</p></div></div>
                        <div className="flex items-start space-x-3"><UsersIcon className="w-6 h-6 text-accent-indigo flex-shrink-0 mt-1" /><div><h4 className="font-semibold">Powered by Community</h4><p className="text-sm text-slate-800 dark:text-slate-300">Get the real story with genuine user reviews and a live social feed.</p></div></div>
                    </div>
                </m.div>
                <m.div variants={itemVariants} className="relative flex items-center justify-center -rotate-6 transform-gpu perspective-1000">
                    <div className="absolute w-72 h-72 bg-accent-blue/20 dark:bg-accent-blue/30 rounded-full blur-3xl animate-float -z-10"></div>
                    
                    {/* Smartphone Frame */}
                    <m.div 
                        className="phone-glow relative w-[18rem] h-[36rem] bg-slate-900 dark:bg-black p-2 rounded-[2.5rem] shadow-2xl shadow-slate-900/40 dark:shadow-black/60 ring-1 ring-slate-900/20"
                        whileHover={{ rotateY: 10, rotateX: -5, scale: 1.05 }}
                        transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                    >
                        {/* Side buttons */}
                        <div className="absolute left-0 top-20 -ml-1 w-1 h-8 bg-slate-700 rounded-l-lg"></div>
                        <div className="absolute right-0 top-24 -mr-1 w-1 h-8 bg-slate-700 rounded-r-lg"></div>
                        <div className="absolute right-0 top-36 -mr-1 w-1 h-16 bg-slate-700 rounded-r-lg"></div>

                        <div className="relative w-full h-full bg-light-bg dark:bg-dark-bg rounded-[2rem] overflow-hidden">
                            {/* Notch */}
                            <div className="absolute top-2.5 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 dark:bg-black rounded-full z-20"></div>

                            {/* Mockup content */}
                            <div className="absolute inset-0 pt-8 overflow-y-auto scrollbar-hide">
                                {/* Status Bar */}
                                <div className="absolute top-0 left-0 w-full px-4 pt-1.5 flex justify-between items-center text-xs font-bold text-slate-800 dark:text-slate-300 z-10">
                                    <span>9:41</span>
                                    <div className="flex items-center space-x-1">
                                        <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M5 12.55a11 11 0 0 1 14.08 0"></path><path d="M1.42 9a16 16 0 0 1 21.16 0"></path><path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path><line x1="12" y1="20" x2="12.01" y2="20"></line></svg>
                                        <svg className="w-4 h-4 -mr-1" viewBox="0 0 24 24" fill="currentColor"><path d="M4,18H20V6H4ZM20,4H4A2,2,0,0,0,2,6V18a2,2,0,0,0,2,2H20a2,2,0,0,0,2-2V6A2,2,0,0,0,20,4Z"></path><rect x="5" y="7" width="14" height="10" fill="currentColor"></rect></svg>
                                    </div>
                                </div>

                                {/* App content */}
                                <div className="p-3 space-y-3">
                                    <h2 className="text-xl font-bold text-slate-800 dark:text-white mt-2 px-1">Projects</h2>
                                    <div className="flex items-center space-x-3 p-2 rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
                                        <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/sui.svg" className="w-10 h-10 rounded-lg bg-light-bg dark:bg-dark-bg p-1 flex-shrink-0" alt="Sui Name Service Logo" />
                                        <div>
                                            <h5 className="font-semibold text-sm text-slate-800 dark:text-white">Sui Name Service</h5>
                                            <p className="text-xs text-slate-800">Your Web3 identity on Sui.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-2 rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border opacity-90">
                                        <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/btc.svg" className="w-10 h-10 rounded-lg bg-light-bg dark:bg-dark-bg p-1 flex-shrink-0" alt="Cetus Protocol Logo" />
                                        <div>
                                            <h5 className="font-semibold text-sm text-slate-800 dark:text-white">Cetus Protocol</h5>
                                            <p className="text-xs text-slate-800">Pioneer DEX on Sui.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-center space-x-3 p-2 rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border opacity-80">
                                        <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/eth.svg" className="w-10 h-10 rounded-lg bg-light-bg dark:bg-dark-bg p-1 flex-shrink-0" alt="Ethos Wallet Logo" />
                                        <div>
                                            <h5 className="font-semibold text-sm text-slate-800 dark:text-white">Ethos Wallet</h5>
                                            <p className="text-xs text-slate-800">A human-friendly wallet.</p>
                                        </div>
                                    </div>
                                     <div className="flex items-center space-x-3 p-2 rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border opacity-70">
                                        <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/bnb.svg" className="w-10 h-10 rounded-lg bg-light-bg dark:bg-dark-bg p-1 flex-shrink-0" alt="SuiSwap Logo" />
                                        <div>
                                            <h5 className="font-semibold text-sm text-slate-800 dark:text-white">SuiSwap</h5>
                                            <p className="text-xs text-slate-800">Fast and secure token swaps.</p>
                                        </div>
                                    </div>
                                     <div className="flex items-center space-x-3 p-2 rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border opacity-60">
                                        <img src="https://cdn.jsdelivr.net/gh/atomiclabs/cryptocurrency-icons@1a63530be6e374711a8554f31b17e4cb92c25fa5/svg/color/doge.svg" className="w-10 h-10 rounded-lg bg-light-bg dark:bg-dark-bg p-1 flex-shrink-0" alt="SuiFrens Logo" />
                                        <div>
                                            <h5 className="font-semibold text-sm text-slate-800 dark:text-white">SuiFrens</h5>
                                            <p className="text-xs text-slate-800">On-chain companions.</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* Home indicator */}
                            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-28 h-1 bg-slate-400 dark:bg-slate-600 rounded-full"></div>
                        </div>
                    </m.div>
                </m.div>
            </div>
        </m.section>

        {/* Community Pulse Section */}
        <m.div variants={itemVariants}>
          <CommunitySection animatedBackgroundsEnabled={true} />
        </m.div>

        {/* Get Involved Section */}
        <m.section variants={staggerContainer} className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <m.h2 variants={itemVariants} className="text-3xl md:text-4xl font-display font-bold mb-10 text-slate-900 dark:text-white">Get Involved</m.h2>
            <div className="grid md:grid-cols-3 gap-6">
                <m.div variants={itemVariants}>
                    <Card className="h-full !p-8 text-left flex flex-col">
                        <div className="flex-grow">
                            <UsersIcon className="w-8 h-8 mb-4 text-accent-blue" />
                            <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Join the Community</h3>
                            <p className="text-sm text-slate-800 dark:text-slate-300 mb-6">Connect with fellow enthusiasts and builders on Discord and X.</p>
                        </div>
                        <Link to="/community" className="mt-auto">
                            <Button variant="secondary" className="w-full !py-2.5">
                                Start a Conversation
                            </Button>
                        </Link>
                    </Card>
                </m.div>
                <m.div variants={itemVariants}>
                    <Card className="h-full !p-8 text-left flex flex-col">
                        <div className="flex-grow">
                            <SearchIcon className="w-8 h-8 mb-4 text-accent-blue" />
                            <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Explore Projects</h3>
                            <p className="text-sm text-slate-800 dark:text-slate-300 mb-6">Dive into the dApps and tools that make up the Sui ecosystem.</p>
                        </div>
                        <Link to="/projects" className="mt-auto">
                            <Button variant="secondary" className="w-full !py-2.5">
                                Browse dApps
                            </Button>
                        </Link>
                    </Card>
                </m.div>
                <m.div variants={itemVariants}>
                    <Card className="h-full !p-8 text-left flex flex-col">
                        <div className="flex-grow">
                            <TrendingUpIcon className="w-8 h-8 mb-4 text-accent-blue" />
                            <h3 className="font-bold text-lg mb-2 text-slate-900 dark:text-white">Submit Your dApp</h3>
                            <p className="text-sm text-slate-800 dark:text-slate-300 mb-6">Are you building on Sui? Get your project listed and seen by the community.</p>
                        </div>
                        <Link to="/submit-project" className="mt-auto">
                            <Button variant="secondary" className="w-full !py-2.5">
                                Submit Now
                            </Button>
                        </Link>
                    </Card>
                </m.div>
            </div>
        </m.section>

        {/* Final CTA Section */}
        <m.div variants={itemVariants} className="container mx-auto px-4 sm:px-6 lg:px-8">
           <CTASection onNavigateToDashboard={handleNavigateToDashboard} animatedBackgroundsEnabled={true} />
        </m.div>
      </m.div>
    </m.div>
  );
};

export default LandingPage;