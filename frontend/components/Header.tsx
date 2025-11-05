
import React, { useState, useEffect, useRef } from 'react';
import { SuiLogo, PlusCircleIcon, BellIcon } from './Icons';
import { notificationsData, Notification, getNotificationIcon, formatTimeAgo } from '../data/notifications';

interface HeaderProps {
    page: 'landing' | 'dashboard' | 'community' | 'profile';
    onNavigateToDashboard: () => void;
    onNavigateToCommunity: () => void;
    onNavigateToProfile: () => void;
    onNavigateHome: (hash?: string) => void;
    onSubmitProjectClick: () => void;
    user: { address: string } | null;
    onConnectWallet: () => void;
    onLogout: () => void;
    showNotification: (message: string, type: 'success' | 'error') => void;
}

const Header: React.FC<HeaderProps> = ({ page, onNavigateToDashboard, onNavigateToCommunity, onNavigateToProfile, onNavigateHome, onSubmitProjectClick, user, onConnectWallet, onLogout, showNotification }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);

  const notificationsRef = useRef<HTMLDivElement>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const userMenuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setIsLoadingNotifications(true);
    // Use dummy data directly for notifications to ensure reliability
    setTimeout(() => {
        setNotifications(notificationsData);
        setIsLoadingNotifications(false);
    }, 500);
  }, []);

  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    const hash = e.currentTarget.getAttribute('href');
    if (!hash) return;
    
    if (page === 'landing') {
        const targetId = hash.substring(1);
        const targetElement = document.getElementById(targetId);

        if (targetElement) {
            const headerOffset = 100;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth',
            });
        }
    } else {
        onNavigateHome(hash);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
      
      if (page !== 'landing') {
        setActiveSection('');
        return;
      }

      // Active section highlighting
      const sectionIds = ['about', 'features', 'projects', 'community'];
      let closestSection = '';
      let minDistance = Infinity;
      const offset = 150;

      for (const id of sectionIds) {
          const section = document.getElementById(id);
          if (section) {
              const rect = section.getBoundingClientRect();
              if (rect.top < window.innerHeight && rect.bottom >= offset) {
                  const distance = Math.abs(rect.top - offset);
                  if (distance < minDistance) {
                      minDistance = distance;
                      closestSection = id;
                  }
              }
          }
      }
      setActiveSection(closestSection);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [page]);
  
  // Effect to handle clicks outside the notifications panel and user menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (notificationsRef.current && !notificationsRef.current.contains(event.target as Node)) {
            setIsNotificationsOpen(false);
        }
        if (userMenuRef.current && !userMenuRef.current.contains(event.target as Node)) {
            setIsUserMenuOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
        document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const unreadCount = notifications.filter(n => !n.read).length;

  const toggleNotifications = () => {
      setIsNotificationsOpen(prev => !prev);
  };
  
  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({...n, read: true})));
  };

  const landingNavLinks = [
      { href: '#about', label: 'About', sectionId: 'about', tooltip: 'Learn about our mission and vision.' },
      { href: '#features', label: 'Features', sectionId: 'features', tooltip: 'Explore the powerful platform features.' },
      { href: '#projects', label: 'Projects', sectionId: 'projects', tooltip: 'Discover top-tier dApps in the ecosystem.' },
  ];
  
  const activeLinkClasses = 'text-white [text-shadow:0_0_8px_theme(colors.blue.500)]';
  const truncatedAddress = user ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : '';

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-black/70 backdrop-blur-lg border-b border-indigo-900/50 py-2' : 'bg-black/70 backdrop-blur-lg py-4'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <button onClick={() => onNavigateHome()} className="flex items-center gap-2 cursor-pointer">
          <SuiLogo className="h-8 w-8" />
          <span className="font-display text-xl font-bold text-white">Sui Explorer</span>
        </button>
        
        <nav className="hidden md:flex items-center gap-8">
            {page === 'landing' ? (
                <>
                    {landingNavLinks.map(link => (
                        <a 
                        key={link.href}
                        href={link.href} 
                        onClick={handleNavClick}
                        className={`relative group text-gray-300 hover:text-white transition-colors ${activeSection === link.sectionId ? activeLinkClasses : ''}`}
                        >
                        {link.label}
                        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max bg-gray-900/80 backdrop-blur-sm text-white text-xs rounded-md py-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                            {link.tooltip}
                        </span>
                        </a>
                    ))}
                    <button 
                        onClick={onNavigateToCommunity}
                        className={`relative group text-gray-300 hover:text-white transition-colors ${activeSection === 'community' ? activeLinkClasses : ''}`}
                    >
                        Community
                        <span className="absolute left-1/2 -translate-x-1/2 top-full mt-2 w-max bg-gray-900/80 backdrop-blur-sm text-white text-xs rounded-md py-1 px-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap z-10 shadow-lg">
                            Join the conversation.
                        </span>
                    </button>
                </>
            ) : (
                <>
                    <button 
                        onClick={onNavigateToDashboard}
                        className={`text-gray-300 hover:text-white transition-colors ${page === 'dashboard' ? activeLinkClasses : ''}`}
                    >
                        Explorer
                    </button>
                    <button 
                        onClick={onNavigateToCommunity}
                        className={`text-gray-300 hover:text-white transition-colors ${page === 'community' ? activeLinkClasses : ''}`}
                    >
                        Community
                    </button>
                    {user && 
                        <button 
                            onClick={onNavigateToProfile}
                            className={`text-gray-300 hover:text-white transition-colors ${page === 'profile' ? activeLinkClasses : ''}`}
                        >
                            Profile
                        </button>
                    }
                </>
            )}
        </nav>
        
        <div className="hidden md:flex items-center gap-4">
            {page === 'landing' ? (
                <button onClick={onNavigateToDashboard} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105">
                    Explorer
                </button>
            ) : user ? (
                <>
                 <div className="relative">
                    <button 
                        onClick={toggleNotifications} 
                        className="relative text-gray-300 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors"
                        aria-label={`Notifications (${unreadCount} unread)`}
                    >
                        <BellIcon className="w-6 h-6" />
                        {unreadCount > 0 && (
                            <span className="absolute top-1 right-1 flex h-4 w-4">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500 border-2 border-[#0d0c1b] items-center justify-center text-xs font-bold text-white">
                                    {unreadCount}
                                </span>
                            </span>
                        )}
                    </button>
                    {isNotificationsOpen && (
                        <div 
                            ref={notificationsRef}
                            className="absolute top-full right-0 mt-3 w-80 md:w-96 bg-gray-900/80 backdrop-blur-lg border border-indigo-900/50 rounded-xl shadow-2xl shadow-black/50 overflow-hidden animate-fade-in-down"
                        >
                           <div className="p-4 flex justify-between items-center border-b border-indigo-900/50">
                                <h3 className="font-display font-bold text-white text-lg">Notifications</h3>
                                {unreadCount > 0 && 
                                    <button onClick={markAllAsRead} className="text-xs text-blue-400 hover:underline">Mark all as read</button>
                                }
                            </div>
                            <div className="max-h-96 overflow-y-auto">
                                {isLoadingNotifications ? (
                                    <p className="text-gray-500 text-center py-8">Loading notifications...</p>
                                ) : notifications.length > 0 ? (
                                    notifications.map(notification => (
                                        <div key={notification.id} className={`p-4 flex items-start gap-4 border-b border-indigo-900/30 transition-colors hover:bg-indigo-900/30 ${!notification.read ? 'bg-blue-900/20' : ''}`}>
                                            <div className="flex-shrink-0 mt-1">
                                                {getNotificationIcon(notification.type)}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="font-semibold text-white text-sm truncate">{notification.title}</p>
                                                <p className="text-gray-400 text-sm">{notification.description}</p>
                                                <p className="text-xs text-gray-500 mt-1">{formatTimeAgo(notification.timestamp)}</p>
                                            </div>
                                            {!notification.read && (
                                                <div className="w-2.5 h-2.5 bg-blue-500 rounded-full mt-2 flex-shrink-0 self-center"></div>
                                            )}
                                        </div>
                                    ))
                                ) : (
                                    <p className="text-gray-500 text-center py-8">No new notifications.</p>
                                )}
                            </div>
                        </div>
                    )}
                 </div>
                 <div className="relative" ref={userMenuRef}>
                    <button 
                        onClick={() => setIsUserMenuOpen(prev => !prev)}
                        className="bg-indigo-950/40 border border-blue-900/50 px-4 py-2 rounded-lg text-sm font-semibold text-white flex items-center gap-2 hover:bg-indigo-950/80 transition-colors"
                    >
                        <SuiLogo className="w-4 h-4" />
                        {truncatedAddress}
                    </button>
                    {isUserMenuOpen && (
                        <div className="absolute top-full right-0 mt-2 w-48 bg-gray-900/80 backdrop-blur-lg border border-indigo-900/50 rounded-lg shadow-2xl shadow-black/50 overflow-hidden animate-fade-in-down">
                            <button onClick={() => { onNavigateToProfile(); setIsUserMenuOpen(false); }} className="w-full text-left px-4 py-2 text-sm text-gray-300 hover:bg-white/10 transition-colors">
                                My Profile
                            </button>
                            <button onClick={onLogout} className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-red-500/20 transition-colors">
                                Disconnect
                            </button>
                        </div>
                    )}
                 </div>
                </>
            ) : (
                <button onClick={onConnectWallet} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105">
                    Connect Wallet
                </button>
            )}
        </div>
      </div>
    </header>
  );
};

export default Header;
