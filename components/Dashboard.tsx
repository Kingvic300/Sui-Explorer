

import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Project, Review } from '../data/projects';
import ProjectCard from './dashboard/ProjectCard';
import LiveFeed from './dashboard/LiveFeed';
import { StarIcon, ArrowPathRoundedSquareIcon, MagnifyingGlassCircleIcon, MagnifyingGlassIcon, ArrowUpIcon, ArrowDownIcon, PlusCircleIcon, XCircleIcon } from './Icons';
import ProjectCardSkeleton from './dashboard/ProjectCardSkeleton';
import Pagination from './dashboard/Pagination';

const filterableCategories = ['DeFi', 'Gaming', 'NFT', 'Infrastructure'];
type SortKey = 'date' | 'name' | 'tvl' | 'users' | 'reviews';

interface DashboardProps {
    projects: Project[];
    onAddReview: (projectId: number, review: Omit<Review, 'id' | 'avatar'>) => Promise<void>;
    favoriteProjectIds: Set<number>;
    onToggleFavorite: (projectId: number) => void;
    recentlyViewedProjects: Project[];
    onSelectProject: (project: Project) => void;
    isLoading: boolean;
    projectsError: string | null;
    onSubmitProjectClick: () => void;
    user: { address: string } | null;
    onAuthRequired: (action: () => void) => void;
    showNotification: (message: string, type: 'success' | 'error') => void;
    onRefreshProjects: () => Promise<void>;
}

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

const RangeInput: React.FC<{ label: string, value: string, onChange: (e: React.ChangeEvent<HTMLInputElement>) => void, placeholder: string }> = ({ label, value, onChange, placeholder }) => (
    <div className="flex-1">
        <label className="text-xs text-gray-500">{label}</label>
        <input
            type="text"
            value={value}
            onChange={onChange}
            placeholder={placeholder}
            className="w-full bg-gray-900/70 border border-gray-700/60 rounded-md px-2 py-1 text-white text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 transition-colors"
        />
    </div>
);

const ConnectWalletPrompt: React.FC<{
    icon: React.ReactNode;
    title: string;
    message: string;
    onConnect: () => void;
}> = ({ icon, title, message, onConnect }) => (
    <div className="text-center py-12 bg-indigo-950/20 rounded-2xl border border-dashed border-blue-900/50">
        {icon}
        <h3 className="font-display font-bold text-white text-xl">{title}</h3>
        <p className="text-gray-500 mt-1 mb-4">{message}</p>
        <button onClick={onConnect} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105">
            Connect Wallet
        </button>
    </div>
);

const Dashboard: React.FC<DashboardProps> = ({ projects, onAddReview, favoriteProjectIds, onToggleFavorite, recentlyViewedProjects, onSelectProject, isLoading, projectsError, onSubmitProjectClick, user, onAuthRequired, showNotification, onRefreshProjects }) => {
  const [selectedCategories, setSelectedCategories] = useState(new Set<string>());
  const [isVisible, setIsVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState<{ key: SortKey; direction: 'asc' | 'desc' }>({ key: 'tvl', direction: 'desc' });
  const [currentPage, setCurrentPage] = useState(1);
  const [tvlRange, setTvlRange] = useState({ min: '', max: '' });
  const [usersRange, setUsersRange] = useState({ min: '', max: '' });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const ITEMS_PER_PAGE = 12;
  const mainContentRef = useRef<HTMLElement>(null);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const areFiltersActive = useMemo(() => {
    return (
        searchQuery.trim() !== '' ||
        selectedCategories.size > 0 ||
        tvlRange.min !== '' ||
        tvlRange.max !== '' ||
        usersRange.min !== '' ||
        usersRange.max !== ''
    );
  }, [searchQuery, selectedCategories, tvlRange, usersRange]);

  const filteredProjects = useMemo(() => {
    let tempProjects = [...projects];

    // Filter by category
    if (selectedCategories.size > 0) {
      tempProjects = tempProjects.filter(p => selectedCategories.has(p.category));
    }

    // Filter by search query
    if (searchQuery.trim() !== '') {
      const lowercasedQuery = searchQuery.toLowerCase();
      tempProjects = tempProjects.filter(p =>
        p.name.toLowerCase().includes(lowercasedQuery) ||
        p.tagline.toLowerCase().includes(lowercasedQuery)
      );
    }
    
    // Filter by TVL
    const minTvl = parseStat(tvlRange.min);
    const maxTvl = parseStat(tvlRange.max);
    if (minTvl > -1 || maxTvl > -1) {
        tempProjects = tempProjects.filter(p => {
            const projectTvl = parseStat(p.stats.tvl);
            if (projectTvl < 0) return false; // Exclude projects with N/A TVL if filter is active
            const minMatch = minTvl > -1 ? projectTvl >= minTvl : true;
            const maxMatch = maxTvl > -1 ? projectTvl <= maxTvl : true;
            return minMatch && maxMatch;
        });
    }

    // Filter by Users
    const minUsers = parseStat(usersRange.min);
    const maxUsers = parseStat(usersRange.max);
    if (minUsers > -1 || maxUsers > -1) {
        tempProjects = tempProjects.filter(p => {
            const projectUsers = parseStat(p.stats.users);
            if (projectUsers < 0) return false;
            const minMatch = minUsers > -1 ? projectUsers >= minUsers : true;
            const maxMatch = maxUsers > -1 ? projectUsers <= maxUsers : true;
            return minMatch && maxMatch;
        });
    }
    
    // Sorting logic
    tempProjects.sort((a, b) => {
        let aValue: string | number;
        let bValue: string | number;

        switch (sortConfig.key) {
            case 'date':
                aValue = a.id;
                bValue = b.id;
                break;
            case 'name':
                aValue = a.name.toLowerCase();
                bValue = b.name.toLowerCase();
                break;
            case 'tvl':
                aValue = parseStat(a.stats.tvl);
                bValue = parseStat(b.stats.tvl);
                break;
            case 'users':
                // FIX: Corrected typo from `p` to `a` and `b` respectively.
                aValue = parseStat(a.stats.users);
                bValue = parseStat(b.stats.users);
                break;
            case 'reviews':
                aValue = a.reviews.length;
                bValue = b.reviews.length;
                break;
            default:
                return 0;
        }

        // Handle N/A values for numeric sorts (tvl, users), pushing them to the end
        if (typeof aValue === 'number' && typeof bValue === 'number') {
            if (aValue === -1 && bValue !== -1) return 1;
            if (aValue !== -1 && bValue === -1) return -1;
            if (aValue === -1 && bValue === -1) return 0;
        }

        if (aValue < bValue) {
            return sortConfig.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
            return sortConfig.direction === 'asc' ? 1 : -1;
        }
        return 0;
    });

    return tempProjects;
  }, [projects, selectedCategories, searchQuery, sortConfig, tvlRange, usersRange]);

  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategories, searchQuery, sortConfig, tvlRange, usersRange]);

  const totalPages = Math.ceil(filteredProjects.length / ITEMS_PER_PAGE);

  const paginatedProjects = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProjects.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [currentPage, filteredProjects]);


  const favoriteProjects = useMemo(() => 
    projects.filter(p => favoriteProjectIds.has(p.id)), 
    [projects, favoriteProjectIds]
  );

  const handleSortRequest = (key: SortKey) => {
    let direction: 'asc' | 'desc' = sortConfig.direction;
    if (sortConfig.key === key) {
        direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    } else {
        switch (key) {
            case 'name': direction = 'asc'; break;
            case 'tvl': case 'users': case 'date': case 'reviews': default: direction = 'desc'; break;
        }
    }
    setSortConfig({ key, direction });
  };

  const handlePageChange = (page: number) => {
    if (page > 0 && page <= totalPages) {
        setCurrentPage(page);
        mainContentRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => {
        const newSet = new Set(prev);
        if (newSet.has(category)) {
            newSet.delete(category);
        } else {
            newSet.add(category);
        }
        return newSet;
    });
  };
  
  const handleRangeChange = (e: React.ChangeEvent<HTMLInputElement>, rangeType: 'tvl' | 'users', bound: 'min' | 'max') => {
    const { value } = e.target;
    if (rangeType === 'tvl') {
        setTvlRange(prev => ({ ...prev, [bound]: value }));
    } else {
        setUsersRange(prev => ({ ...prev, [bound]: value }));
    }
  };

  const handleClearFilters = () => {
    setSearchQuery('');
    setSelectedCategories(new Set());
    setTvlRange({ min: '', max: '' });
    setUsersRange({ min: '', max: '' });
    setSortConfig({ key: 'tvl', direction: 'desc' });
  };
  
  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
        await onRefreshProjects();
        setCurrentPage(1);
        showNotification("Projects updated successfully!", 'success');
    } finally {
        setIsRefreshing(false);
    }
  };

  const sortOptions: { key: SortKey; label: string }[] = [
    { key: 'date', label: 'Date Added' },
    { key: 'name', label: 'Name' },
    { key: 'tvl', label: 'TVL' },
    { key: 'users', label: 'Users' },
    { key: 'reviews', label: 'Reviews' },
  ];

  const renderSkeletons = (count: number) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: count }).map((_, index) => <ProjectCardSkeleton key={index} />)}
    </div>
  );

  const renderProjectGridSkeletons = (count: number) => (
    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
        {Array.from({ length: count }).map((_, index) => <ProjectCardSkeleton key={index} />)}
    </div>
  );

  return (
    <>
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
      <section className={`min-h-screen pt-24 pb-12 transition-opacity duration-1000 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-white">Discover Projects on Sui</h1>
            <p className="text-lg text-gray-400 mt-4 max-w-2xl mx-auto">Discover, review, and engage with the best projects on the Sui network.</p>
            <div className="mt-8 max-w-2xl mx-auto">
                <div className="relative">
                    <input
                        type="text"
                        placeholder="Search by name or tagline..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-indigo-950/30 border border-blue-900/50 rounded-lg pl-12 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all duration-300"
                        aria-label="Search projects"
                    />
                    <div className="absolute inset-y-0 left-0 flex items-center pl-4 pointer-events-none">
                        <MagnifyingGlassIcon className="w-5 h-5 text-gray-400" />
                    </div>
                </div>
            </div>
          </div>
        </div>

        <LiveFeed />

        <div className="container mx-auto px-6 mt-12 mb-16">
            <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <StarIcon className="w-7 h-7 text-yellow-400" solid />
                Your Favorites
            </h2>
            {isLoading ? (
                renderSkeletons(4)
            ) : !user ? (
                <ConnectWalletPrompt
                    icon={<StarIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />}
                    title="Connect Your Wallet"
                    message="Connect to see your favorite projects."
                    onConnect={() => onAuthRequired(() => {})}
                />
            ) : favoriteProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {favoriteProjects.map((project, index) => (
                        <ProjectCard 
                            key={project.id} 
                            project={project} 
                            index={index} 
                            onSelect={() => onSelectProject(project)}
                            isFavorite={favoriteProjectIds.has(project.id)}
                            onToggleFavorite={() => onToggleFavorite(project.id)}
                            user={user}
                            onAuthRequired={onAuthRequired}
                        />
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-indigo-950/20 rounded-2xl border border-dashed border-blue-900/50">
                    <StarIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="font-display font-bold text-white text-xl">No Favorites Yet</h3>
                    <p className="text-gray-500 mt-1">Click the star on any project to add it here.</p>
                </div>
            )}
        </div>

        <div className="container mx-auto px-6 mt-12 mb-16">
            <h2 className="font-display text-2xl font-bold text-white mb-6 flex items-center gap-3">
                <ArrowPathRoundedSquareIcon className="w-7 h-7 text-blue-400" />
                Recently Viewed
            </h2>
            <div className="relative">
                 {isLoading ? (
                    <div className="flex gap-8 -mx-6 px-6">
                        {Array.from({ length: 4 }).map((_, index) => (
                             <div key={index} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)] xl:w-[calc(25%-1.5rem)] flex-shrink-0">
                                <ProjectCardSkeleton />
                            </div>
                        ))}
                    </div>
                 ) : !user ? (
                    <ConnectWalletPrompt
                        icon={<ArrowPathRoundedSquareIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />}
                        title="Connect Your Wallet"
                        message="Connect to see your recently viewed projects."
                        onConnect={() => onAuthRequired(() => {})}
                    />
                 ) : recentlyViewedProjects.length > 0 ? (
                    <>
                        <div className="flex overflow-x-auto gap-8 pb-4 -mx-6 px-6 no-scrollbar">
                            {recentlyViewedProjects.map((project, index) => (
                                <div key={project.id} className="w-full sm:w-[calc(50%-1rem)] lg:w-[calc(33.33%-1.33rem)] xl:w-[calc(25%-1.5rem)] flex-shrink-0">
                                    <ProjectCard 
                                        project={project} 
                                        index={index} 
                                        onSelect={() => onSelectProject(project)}
                                        isFavorite={favoriteProjectIds.has(project.id)}
                                        onToggleFavorite={() => onToggleFavorite(project.id)}
                                        user={user}
                                        onAuthRequired={onAuthRequired}
                                    />
                                </div>
                            ))}
                        </div>
                        <div className="absolute top-0 right-0 h-full w-24 bg-gradient-to-l from-[#0d0c1b] to-transparent pointer-events-none z-10 hidden sm:block" />
                        <div className="absolute top-0 left-0 h-full w-24 bg-gradient-to-r from-[#0d0c1b] to-transparent pointer-events-none z-10 hidden sm:block" />
                    </>
                ) : (
                    <div className="text-center py-12 bg-indigo-950/20 rounded-2xl border border-dashed border-blue-900/50">
                        <ArrowPathRoundedSquareIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                        <h3 className="font-display font-bold text-white text-xl">No Recently Viewed Projects</h3>
                        <p className="text-gray-500 mt-1">Projects you view will appear here.</p>
                    </div>
                )}
            </div>
        </div>

        <div className="container mx-auto px-6 mt-12">
          <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-1/4 lg:w-1/5 flex-shrink-0">
                <div className="md:sticky top-24 space-y-8">
                    <div>
                        <h3 className="font-display text-xl font-bold text-white mb-4">Categories</h3>
                        <div className="space-y-2">
                            {filterableCategories.map(category => (
                                <label key={category} className="flex items-center gap-3 cursor-pointer text-gray-300 hover:text-white transition-colors">
                                    <input
                                        type="checkbox"
                                        checked={selectedCategories.has(category)}
                                        onChange={() => handleCategoryToggle(category)}
                                        className="h-4 w-4 rounded bg-gray-800 border-gray-600 text-blue-500 focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-blue-500/50"
                                        aria-labelledby={`category-label-${category}`}
                                    />
                                    <span id={`category-label-${category}`}>{category}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <h3 className="font-display text-xl font-bold text-white mb-4">Filter by Stats</h3>
                        <div className="space-y-4">
                            <div>
                                <span className="text-sm font-semibold text-gray-400">TVL</span>
                                <div className="flex gap-2 mt-1">
                                    <RangeInput label="Min" value={tvlRange.min} onChange={e => handleRangeChange(e, 'tvl', 'min')} placeholder="e.g., 1M" />
                                    <RangeInput label="Max" value={tvlRange.max} onChange={e => handleRangeChange(e, 'tvl', 'max')} placeholder="e.g., 500M" />
                                </div>
                            </div>
                            <div>
                                <span className="text-sm font-semibold text-gray-400">Users</span>
                                <div className="flex gap-2 mt-1">
                                    <RangeInput label="Min" value={usersRange.min} onChange={e => handleRangeChange(e, 'users', 'min')} placeholder="e.g., 10k" />
                                    <RangeInput label="Max" value={usersRange.max} onChange={e => handleRangeChange(e, 'users', 'max')} placeholder="e.g., 100k" />
                                </div>
                            </div>
                        </div>
                    </div>
                    
                    <div>
                        <button
                            onClick={handleClearFilters}
                            disabled={!areFiltersActive}
                            className={`w-full flex items-center justify-center gap-2 text-center px-4 py-2 rounded-lg transition-all duration-300 text-sm font-semibold border ${
                                areFiltersActive
                                    ? 'bg-indigo-950/30 text-gray-300 hover:bg-red-500/20 hover:text-red-300 border-indigo-900/50 hover:border-red-500/30 cursor-pointer'
                                    : 'bg-transparent text-gray-600 border-gray-800 cursor-not-allowed'
                            }`}
                        >
                            <XCircleIcon className="w-5 h-5" />
                            <span>Clear All Filters</span>
                        </button>
                    </div>
                </div>
            </aside>
            <main className="flex-1" ref={mainContentRef}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <div className="flex items-center gap-4 flex-wrap">
                    <h2 className="font-display text-2xl font-bold text-white mb-4 sm:mb-0">All Projects</h2>
                    <div className="flex items-center gap-2 mb-4 sm:mb-0">
                        <button
                            onClick={handleRefresh}
                            disabled={isLoading || isRefreshing}
                            className="group flex items-center gap-2 bg-indigo-950/40 text-gray-300 border border-indigo-900/50 p-2 rounded-lg text-sm font-semibold hover:bg-indigo-950/80 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-wait"
                            aria-label="Refresh project list"
                            title="Refresh project list"
                        >
                            <ArrowPathRoundedSquareIcon className={`w-5 h-5 transition-transform ${isRefreshing ? 'animate-spin' : 'group-hover:rotate-90'}`} />
                        </button>
                        <button 
                            onClick={onSubmitProjectClick}
                            className="group flex items-center gap-2 bg-blue-600/20 text-blue-300 border border-blue-500/30 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600/40 hover:text-white transition-colors"
                        >
                            <PlusCircleIcon className="w-5 h-5 opacity-70 group-hover:opacity-100 transition-opacity"/>
                            <span>Submit Project</span>
                        </button>
                    </div>
                </div>
                <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-sm font-semibold text-gray-400 mr-2 hidden md:block">Sort by:</span>
                    {sortOptions.map(option => (
                        <button
                            key={option.key}
                            onClick={() => handleSortRequest(option.key)}
                            className={`flex items-center gap-1.5 px-3 py-1.5 text-sm rounded-lg transition-colors duration-200 ${
                                sortConfig.key === option.key
                                    ? 'bg-blue-600 text-white font-semibold'
                                    : 'bg-indigo-950/30 text-gray-300 hover:bg-indigo-950/70 hover:text-white'
                            }`}
                            aria-label={`Sort by ${option.label}`}
                        >
                            {option.label}
                            {sortConfig.key === option.key && (
                                sortConfig.direction === 'asc' 
                                    ? <ArrowUpIcon className="w-3.5 h-3.5" /> 
                                    : <ArrowDownIcon className="w-3.5 h-3.5" />
                            )}
                        </button>
                    ))}
                </div>
              </div>
              {projectsError && (
                <div className="text-center py-16 bg-red-950/20 rounded-2xl border border-dashed border-red-900/50 mb-8">
                    <h3 className="font-display font-bold text-white text-xl">An Error Occurred</h3>
                    <p className="text-red-400 mt-1">{projectsError}</p>
                </div>
              )}
              {isLoading ? (
                renderProjectGridSkeletons(ITEMS_PER_PAGE)
              ) : paginatedProjects.length > 0 ? (
                <>
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
                    {paginatedProjects.map((project, index) => {
                        const rank = (currentPage - 1) * ITEMS_PER_PAGE + index;
                        return (
                            <ProjectCard 
                                key={project.id} 
                                project={project} 
                                index={index}
                                rank={rank}
                                onSelect={() => onSelectProject(project)} 
                                isFavorite={favoriteProjectIds.has(project.id)}
                                onToggleFavorite={() => onToggleFavorite(project.id)}
                                user={user}
                                onAuthRequired={onAuthRequired}
                            />
                        );
                    })}
                    </div>
                    {totalPages > 1 && (
                        <Pagination
                            currentPage={currentPage}
                            totalPages={totalPages}
                            onPageChange={handlePageChange}
                        />
                    )}
                </>
              ) : (
                <div className="text-center py-16 bg-indigo-950/20 rounded-2xl border border-dashed border-blue-900/50">
                    <MagnifyingGlassCircleIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                    <h3 className="font-display font-bold text-white text-xl">No Projects Found</h3>
                    <p className="text-gray-500 mt-1">Try clearing some filters or adjusting your search.</p>
                </div>
              )}
            </main>
          </div>
        </div>
      </section>
    </>
  );
};

export default Dashboard;