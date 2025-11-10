
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SuiLogo } from '../icons/SuiLogo';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import NotificationBell from '../ui/NotificationBell';
import { prefetchRouteComponent } from '../../utils/prefetch';
import Magnetic from '../ui/Magnetic';
import ParticleBackground from '../ui/ParticleBackground';

const Header: React.FC = () => {
  const location = useLocation();
  const isLandingPage = location.pathname === '/';
  const navLinkClasses = "relative text-sm font-medium transition-colors text-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md";
  
  const navLinks = [
    { name: 'Projects', path: '/projects' },
    { name: 'News', path: '/news' },
    { name: 'Community', path: '/community' },
    { name: 'Features', path: '/features' },
    { name: 'About', path: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-light-border/0 dark:border-dark-border/10 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-lg">
      <ParticleBackground />
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="flex items-center justify-between h-16">
          <div className="flex-1 flex justify-start">
            <Link to="/" className="flex items-center space-x-2">
              <SuiLogo className="h-8 w-8 text-accent-indigo" />
              <span className="font-display font-bold text-xl text-slate-800 dark:text-white">Sui Explorer</span>
            </Link>
          </div>
          
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map(link => (
              <Magnetic key={link.name}>
                <Link to={link.path} className={navLinkClasses} onMouseEnter={() => prefetchRouteComponent(link.path)}>{link.name}</Link>
              </Magnetic>
            ))}
          </nav>

          <div className="flex-1 flex justify-end items-center space-x-2">
            <Magnetic>
              <ThemeToggle />
            </Magnetic>
            {!isLandingPage && <NotificationBell />}
            <Link to="/submit-project" onMouseEnter={() => prefetchRouteComponent('/submit-project')}>
                {/* FIX: Removed invalid className prop. The styling is now part of the Button's internal classes. */}
                <Button variant="outline">
                    Submit to Directory
                </Button>
            </Link>
            {isLandingPage ? (
              <Link to="/projects" onMouseEnter={() => prefetchRouteComponent('/projects')}>
                {/* FIX: Removed invalid className prop. */}
                <Button variant="primary">
                  Explorer
                </Button>
              </Link>
            ) : (
                // FIX: Removed invalid className prop.
                <Button variant="primary" onClick={() => alert('Connect Wallet functionality coming soon!')}>
                Connect Wallet
              </Button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;