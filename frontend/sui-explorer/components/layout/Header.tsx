// components/Header.tsx
import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { SuiLogo } from '../icons/SuiLogo';
import Button from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';
import NotificationBell from '../ui/NotificationBell';
import { prefetchRouteComponent } from '@/utils/prefetch.ts';
import Magnetic from '../ui/Magnetic';
import ParticleBackground from '../ui/ParticleBackground';
import { EnhancedWalletConnect } from '../wallets/EnhancedWalletConnect';

const Header: React.FC = () => {
    const location = useLocation();
    const isLandingPage = location.pathname === '/';
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const navLinkClasses = "relative text-sm font-medium transition-colors text-slate-800 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-md";
    const mobileNavLinkClasses = "block w-full text-left px-4 py-3 text-base font-medium text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border-b border-slate-200 dark:border-slate-700";

    const navLinks = [
        { name: 'Projects', path: '/projects' },
        { name: 'News', path: '/news' },
        { name: 'Community', path: '/community' },
        { name: 'Features', path: '/features' },
        { name: 'About', path: '/about' },
    ];

    // Close mobile menu when route changes
    React.useEffect(() => {
        setIsMobileMenuOpen(false);
    }, [location.pathname]);

    return (
        <header className="sticky top-0 z-50 w-full border-b border-light-border/0 dark:border-dark-border/10 bg-light-bg/80 dark:bg-dark-bg/80 backdrop-blur-lg">
            <ParticleBackground />
            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative">
                <div className="flex items-center justify-between h-16">
                    {/* Logo - Always visible */}
                    <div className="flex items-center flex-shrink-0">
                        <Link to="/" className="flex items-center space-x-2">
                            <SuiLogo className="h-8 w-8 text-accent-indigo" />
                            <span className="font-display font-bold text-xl text-slate-800 dark:text-white">
                                Sui Explorer
                            </span>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Hidden on mobile */}
                    <nav className="hidden lg:flex items-center space-x-1 mx-4 flex-1 justify-center">
                        {navLinks.map(link => (
                            <Magnetic key={link.name}>
                                <Link
                                    to={link.path}
                                    className={navLinkClasses}
                                    onMouseEnter={() => prefetchRouteComponent(link.path)}
                                >
                                    {link.name}
                                </Link>
                            </Magnetic>
                        ))}
                    </nav>

                    {/* Desktop Actions - Hidden on mobile */}
                    <div className="hidden lg:flex items-center space-x-2 flex-shrink-0">
                        <Magnetic>
                            <ThemeToggle />
                        </Magnetic>
                        {!isLandingPage && <NotificationBell />}
                        <Link to="/submit-project" onMouseEnter={() => prefetchRouteComponent('/submit-project')}>
                            <Button variant="outline" className="whitespace-nowrap text-sm">
                                Submit to Directory
                            </Button>
                        </Link>
                        {isLandingPage ? (
                            <Link to="/projects" onMouseEnter={() => prefetchRouteComponent('/projects')}>
                                <Button variant="primary" className="text-sm">
                                    Explorer
                                </Button>
                            </Link>
                        ) : (
                            <EnhancedWalletConnect />
                        )}
                    </div>

                    {/* Mobile Menu Button - Visible only on mobile & tablet */}
                    <div className="flex lg:hidden items-center space-x-3">
                        <ThemeToggle />
                        {!isLandingPage && <NotificationBell />}

                        {/* Show Connect Wallet on tablet, hamburger on all mobile/tablet */}
                        <div className="flex items-center space-x-2">
                            {/* Show wallet connect on medium screens but not small mobile */}
                            <div className="hidden md:block">
                                {!isLandingPage && <EnhancedWalletConnect />}
                            </div>

                            {/* Hamburger Menu Button */}
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 rounded-md text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-slate-200 dark:border-slate-700"
                                aria-label="Toggle menu"
                                aria-expanded={isMobileMenuOpen}
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu - Slides down from header */}
                <div className={`lg:hidden transition-all duration-300 ease-in-out overflow-hidden ${
                    isMobileMenuOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                }`}>
                    <div className="border-t border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-lg">
                        <div className="py-2">
                            {/* Navigation Links */}
                            {navLinks.map(link => (
                                <Link
                                    key={link.name}
                                    to={link.path}
                                    className={mobileNavLinkClasses}
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    {link.name}
                                </Link>
                            ))}

                            {/* Mobile Actions */}
                            <div className="px-4 py-3 space-y-3 border-t border-slate-200 dark:border-slate-700">
                                <Link
                                    to="/submit-project"
                                    className="block w-full"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                >
                                    <Button variant="outline" className="w-full justify-center text-sm">
                                        Submit to Directory
                                    </Button>
                                </Link>

                                {/* Show wallet connect in mobile menu for small screens */}
                                <div className="md:hidden">
                                    {!isLandingPage && (
                                        <div className="pt-2">
                                            <EnhancedWalletConnect />
                                        </div>
                                    )}
                                </div>

                                {isLandingPage && (
                                    <Link
                                        to="/projects"
                                        className="block w-full"
                                        onClick={() => setIsMobileMenuOpen(false)}
                                    >
                                        <Button variant="primary" className="w-full justify-center text-sm">
                                            Explorer
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;