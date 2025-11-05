import React from 'react';
import { SuiLogo } from './Icons';

interface FooterProps {
    animatedBackgroundsEnabled: boolean;
    onToggleAnimatedBackgrounds: () => void;
}

const Footer: React.FC<FooterProps> = () => {
  return (
    <footer className="bg-black/50 border-t border-indigo-900/50">
      <div className="container mx-auto px-6 py-6">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 text-sm">
          <div className="flex items-center gap-3 text-gray-400">
            <SuiLogo className="h-6 w-6 text-white" />
            <p>© {new Date().getFullYear()} Sui Ecosystem Explorer. All rights reserved.</p>
          </div>
          <nav className="flex gap-6 md:gap-8">
            <a href="#about" className="text-gray-300 hover:text-white transition-colors">About</a>
            <a href="#projects" className="text-gray-300 hover:text-white transition-colors">Projects</a>
            <a href="#community" className="text-gray-300 hover:text-white transition-colors">Community</a>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
