import React, { useEffect, useState, useRef } from 'react';
import { ChevronRightIcon as ChevronRight, StarIcon, TwitterIcon, DiscordIcon, UsersIcon, CurrencyDollarIcon, ChartBarIcon } from '../icons/MiscIcons';
import { useToastStore } from '../../stores/useToastStore';
import { Project, ProjectCardProps } from '../../types/index';

const parseStat = (stat: string): number => {
    if (typeof stat !== 'string' || stat === 'N/A' || stat === 'New' || stat === 'TBD') {
        return -1;
    }
    const lowerStat = stat.toLowerCase().replace(/[^a-z0-9.]/g, '');
    let multiplier = 1;
    let numStr = lowerStat;

    if (lowerStat.endsWith('k')) {
        multiplier = 1000;
        numStr = lowerStat.slice(0, -1);
    } else if (lowerStat.endsWith('m')) {
        multiplier = 1000000;
        numStr = lowerStat.slice(0, -1);
    } else if (lowerStat.endsWith('b')) {
        multiplier = 1000000000;
        numStr = lowerStat.slice(0, -1);
    }
    
    const num = parseFloat(numStr);
    return isNaN(num) ? -1 : num * multiplier;
};

const StatIndicator: React.FC<{ value: string; type: 'tvl' | 'users' | 'volume' }> = ({ value, type }) => {
    const numericValue = parseStat(value);

    let level = 0; // 0 for N/A, 1 for low, 2 for medium, 3 for high

    if (numericValue > -1) {
        if (type === 'tvl') {
            if (numericValue >= 100000000) level = 3; // > 100M
            else if (numericValue >= 10000000) level = 2; // > 10M
            else level = 1;
        } else if (type === 'users') {
            if (numericValue >= 100000) level = 3; // > 100k
            else if (numericValue >= 20000) level = 2; // > 20k
            else level = 1;
        } else if (type === 'volume') {
            if (numericValue >= 500000000) level = 3; // > 500M
            else if (numericValue >= 50000000) level = 2; // > 50M
            else level = 1;
        }
    }
    
    const levelTooltips = {
        tvl: ['N/A', 'Modest TVL', 'Healthy TVL', 'High TVL'],
        users: ['N/A', 'Emerging Userbase', 'Growing Userbase', 'Large Userbase'],
        volume: ['N/A', 'Low Volume', 'Moderate Volume', 'High Volume'],
    };

    return (
        <div className="flex items-end gap-0.5" title={levelTooltips[type][level]} aria-label={levelTooltips[type][level]}>
            <span className={`w-1 h-1 rounded-sm transition-colors ${level >= 1 ? 'bg-blue-500' : 'bg-slate-700'}`}></span>
            <span className={`w-1 h-2 rounded-sm transition-colors ${level >= 2 ? 'bg-green-500' : 'bg-slate-700'}`}></span>
            <span className={`w-1 h-3 rounded-sm transition-colors ${level >= 3 ? 'bg-yellow-400' : 'bg-slate-700'}`}></span>
        </div>
    );
};

const ProjectCard: React.FC<ProjectCardProps> = ({ project, index, rank, onSelect, isFavorite, onToggleFavorite, user, onAuthRequired }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const addToast = useToastStore(state => state.addToast);

  const RECENT_THRESHOLD_DAYS = 3;
  const activityDate = new Date(project.lastActivity);
  const now = new Date();
  const isRecent = (now.getTime() - activityDate.getTime()) / (1000 * 3600 * 24) < RECENT_THRESHOLD_DAYS;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;
    const observer = new IntersectionObserver(
        ([entry]) => {
            if (entry.isIntersecting) {
                timer = setTimeout(() => {
                    setIsVisible(true);
                }, index * 100);
                observer.disconnect();
            }
        },
        { threshold: 0.1 }
    );
    
    const currentRef = cardRef.current;
    if (currentRef) {
        observer.observe(currentRef);
    }
    
    return () => {
        if (currentRef) {
            observer.unobserve(currentRef);
        }
        if (timer) {
            clearTimeout(timer);
        }
    };
  }, [index]);

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAuthRequired(() => {
        onToggleFavorite();
        addToast({
            id: `fav-toast-${project.id}-${Date.now()}`,
            type: !isFavorite ? 'success' : 'info',
            title: !isFavorite ? 'Added to Favorites' : 'Removed from Favorites',
            message: `${project.name} has been ${!isFavorite ? 'added to' : 'removed from'} your favorites.`,
            duration: 3000,
        });
        setIsAnimating(true);
        // Reset animation class after it completes
        setTimeout(() => {
            setIsAnimating(false);
        }, 300);
    });
  };

  const handleShareClick = (e: React.MouseEvent, platform: 'twitter' | 'discord') => {
    e.stopPropagation();
    const shareText = `Check out ${project.name} on the Sui Ecosystem Explorer! ${project.tagline}`;
    const shareUrl = `${window.location.origin}/#/projects/${project.id}`;

    if (platform === 'twitter') {
      const twitterIntentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}&hashtags=Sui`;
      window.open(twitterIntentUrl, '_blank', 'noopener,noreferrer');
    } else if (platform === 'discord') {
      const discordText = `Check out ${project.name} on the Sui Ecosystem Explorer!\n${shareUrl}`;
      navigator.clipboard.writeText(discordText).then(() => {
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2000);
      });
    }
  };
  
  const favoriteButtonClasses = isFavorite
    ? 'bg-yellow-400/20 text-yellow-500 border border-yellow-500/30'
    : 'bg-white/50 dark:bg-black/30 backdrop-blur-sm text-slate-500 dark:text-slate-400 hover:text-yellow-400';

  return (
    <div
      ref={cardRef}
      className={`group relative text-left w-full bg-light-card dark:bg-dark-card p-6 rounded-2xl border border-light-border dark:border-dark-border transition-all duration-500 ease-out flex flex-col justify-between overflow-hidden shadow-card hover:shadow-card-hover hover:scale-105
        ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}
        ${isRecent ? 'card-recent-glow' : ''}`}
      style={{ willChange: 'transform' }}
    >
        {isRecent && (
            <div className="recent-activity-tag">
                <span className="relative flex h-2 w-2 mr-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                </span>
                Recent
            </div>
        )}
        {rank !== undefined && (
            <div
                aria-hidden="true"
                className="absolute inset-0 flex items-center justify-center font-display text-[10rem] font-black text-slate-500/5 dark:text-slate-500/10 pointer-events-none transition-all duration-300 group-hover:text-blue-400/10 dark:group-hover:text-blue-400/20 group-hover:[text-shadow:0_0_60px_theme(colors.blue.400/80)] z-0"
            >
                {rank + 1}
            </div>
        )}
      
      <div className="absolute top-4 right-4 z-20 group/favorite">
        <button 
            onClick={handleFavoriteClick}
            aria-label={isFavorite ? `Remove ${project.name} from favorites` : `Add ${project.name} to favorites`}
            aria-pressed={isFavorite}
            className={`p-2 rounded-full transition-all duration-200 ${favoriteButtonClasses}`}
        >
            <StarIcon className={`w-5 h-5 transition-colors ${isAnimating ? 'animate-favorite-pop' : ''}`} solid={isFavorite} />
        </button>
        <div className="absolute top-full mt-2 left-1/2 -translate-x-1/2 whitespace-nowrap px-2 py-1 bg-slate-900 dark:bg-black text-white text-xs font-semibold rounded-md opacity-0 group-hover/favorite:opacity-100 transition-opacity duration-300 pointer-events-none shadow-lg z-30">
            {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
            <div className="absolute bottom-full left-1/2 -translate-x-1/2 w-0 h-0 border-x-4 border-x-transparent border-b-4 border-b-slate-900 dark:border-b-black"></div>
        </div>
      </div>

      {/* Animated Shimmer Effect */}
      <div className="absolute top-0 left-0 w-full h-full rounded-2xl overflow-hidden pointer-events-none z-10">
        <div className="absolute top-0 -left-full w-1/2 h-full bg-gradient-to-r from-transparent via-white/10 to-transparent blur-sm transition-all duration-500 ease-in-out group-hover:left-full group-focus-within:left-full" />
      </div>
      
      <div className="relative z-10 flex flex-col h-full justify-between">
        <button
          onClick={() => onSelect(project)}
          aria-label={`View details for ${project.name}`}
          className="block w-full text-left focus:outline-none"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="flex items-center min-w-0">
              <img src={project.logo} alt={`${project.name} logo`} className="w-14 h-14 rounded-full mr-4 border-2 border-white/20 dark:border-white/20 transition-transform duration-300 group-hover:scale-110 flex-shrink-0" />
              <div className="flex flex-col items-start min-w-0">
                <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white truncate" aria-hidden="true">{project.name}</h3>
                <span className="mt-1 text-xs font-semibold bg-blue-100 dark:bg-blue-500/20 text-blue-600 dark:text-blue-300 px-2 py-1 rounded-full transition-all duration-300 group-hover:bg-blue-200 dark:group-hover:bg-blue-500/40 group-hover:shadow-[0_0_10px_theme(colors.blue.500)]">{project.category}</span>
              </div>
            </div>
            {/* "View More" icon appears on hover/focus */}
            <div className="text-slate-400 dark:text-slate-500 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transform translate-x-2 group-hover:translate-x-0 group-focus-within:translate-x-0 transition-all duration-300 ease-out pr-12" aria-hidden="true">
              <ChevronRight className="w-7 h-7" />
            </div>
          </div>
          <p className="text-slate-800 dark:text-slate-300 text-sm mb-4 min-h-[40px]">{project.tagline}</p>
        </button>

        <div className="border-t border-light-border dark:border-blue-900/40 pt-4 flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
            <div className="flex items-center gap-3">
                <button
                    onClick={(e) => handleShareClick(e, 'twitter')}
                    className="text-slate-500 hover:text-sky-500 dark:text-slate-500 dark:hover:text-sky-400"
                    aria-label={`Share ${project.name} on Twitter`}
                >
                    <TwitterIcon className="w-4 h-4" />
                </button>
                <div className="relative flex items-center">
                    <button
                        onClick={(e) => handleShareClick(e, 'discord')}
                        className="text-slate-500 hover:text-indigo-500 dark:text-slate-500 dark:hover:text-indigo-400"
                        aria-label={`Copy link for ${project.name} to share on Discord`}
                    >
                        <DiscordIcon className="w-4 h-4" />
                    </button>
                    {isCopied && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-green-500 text-white text-xs rounded-md animate-fade-in-down whitespace-nowrap shadow-lg" role="status">
                            Copied!
                        </div>
                    )}
                </div>
            </div>
            <div className="flex gap-4 text-xs text-slate-800 dark:text-slate-400 self-end sm:self-auto">
                <div className="flex items-center gap-1.5" aria-label={`Total Value Locked: ${project.stats?.tvl}`}>
                    <CurrencyDollarIcon className="w-4 h-4 text-green-600 dark:text-green-400/80" aria-hidden="true" />
                    <span className="font-semibold text-slate-900 dark:text-slate-300">{project.stats?.tvl}</span>
                    <StatIndicator value={project.stats?.tvl || 'N/A'} type="tvl" />
                </div>
                <div className="flex items-center gap-1.5" aria-label={`Users: ${project.stats?.users}`}>
                    <UsersIcon className="w-4 h-4 text-blue-600 dark:text-blue-400/80" aria-hidden="true" />
                    <span className="font-semibold text-slate-900 dark:text-slate-300">{project.stats?.users}</span>
                    <StatIndicator value={project.stats?.users || 'N/A'} type="users" />
                </div>
                <div className="flex items-center gap-1.5" aria-label={`Volume (24h): ${project.stats?.volume}`}>
                    <ChartBarIcon className="w-4 h-4 text-indigo-600 dark:text-indigo-400/80" aria-hidden="true" />
                    <span className="font-semibold text-slate-900 dark:text-slate-300">{project.stats?.volume}</span>
                    <StatIndicator value={project.stats?.volume || 'N/A'} type="volume" />
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;