import React, { useMemo, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useProjects } from '../hooks/queries/useProjects';
import { useProjectFilterStore } from '../stores/useProjectFilterStore';
import { useProjectInteractionStore } from '../stores/useProjectInteractionStore';
import ProjectCard from '../components/ui/ProjectCard';
import ProjectCardSkeleton from '../components/ui/skeletons/ProjectCardSkeleton';
import { pageVariants, pageTransition, staggerContainer, itemVariants } from '../utils/animations';
import { RepeatIcon, StarIcon, SearchIcon, FilterIcon, XIcon, CurrencyDollarIcon, UsersIcon, TrashIcon, ArrowUpRightIcon, ArrowDownLeftIcon, ZapIcon, ChevronRightIcon } from '../components/icons/MiscIcons';
import ErrorState from '../components/ui/ErrorState';
import ConnectWalletPlaceholder from '../components/projects/ConnectWalletPlaceholder';
import { useWalletStore } from '../stores/useWalletStore';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { FormSelect } from '../components/ui/forms/FormElements';
import TransactionDetailModal from '../components/ui/modals/TransactionDetailModal';
import { useQuery } from '@tanstack/react-query';
import { Project, MockTransaction, TransactionType } from '../types/index';

const categories = ['DeFi', 'Gaming', 'NFT', 'Infrastructure'];
const sortOptions = ['Trending', 'TVL', 'Date Added', 'Name', 'Users', 'Reviews'];

const mockTransactions: MockTransaction[] = [
    {
        id: '0x123abc...',
        type: 'dapp',
        status: 'Success',
        description: 'Interaction with Cetus Protocol',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
        amount: -10.5,
        currency: 'SUI',
        from: '0xMyWallet...',
        to: '0xCetus...',
        fee: 0.01,
    },
    {
        id: '0x456def...',
        type: 'receive',
        status: 'Success',
        description: 'Received from Staking Rewards',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(),
        amount: 25.2,
        currency: 'SUI',
        from: '0xStaking...',
        to: '0xMyWallet...',
        fee: 0.00,
    },
    {
        id: '0x789ghi...',
        type: 'send',
        status: 'Success',
        description: 'Sent to 0xFriend...',
        timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
        amount: -50,
        currency: 'SUI',
        from: '0xMyWallet...',
        to: '0xFriend...',
        fee: 0.01,
    },
    {
        id: '0xjklmno...',
        type: 'dapp',
        status: 'Pending',
        description: 'Minting SuiFren NFT',
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        amount: -5,
        currency: 'SUI',
        from: '0xMyWallet...',
        to: '0xSuiFrens...',
        fee: 0.02,
    },
];

// Type guard to check if data is an array of Projects
const isProjectArray = (data: unknown): data is Project[] => {
    return Array.isArray(data) && data.every(item =>
        item && typeof item === 'object' && 'id' in item && 'name' in item
    );
};

// Type guard to check if data is an array of MockTransactions
const isTransactionArray = (data: unknown): data is MockTransaction[] => {
    return Array.isArray(data) && data.every(item =>
        item && typeof item === 'object' && 'id' in item && 'type' in item
    );
};

// TODO: This hook logic can be moved to its own file (e.g., hooks/queries/useTransactions.ts)
// TODO: Replace with your actual Sui SDK client and methods
const fetchTransactionsFromSmartContract = async (address: string): Promise<MockTransaction[]> => {
    console.log(`Fetching transactions for ${address} from smart contract...`);
    // This is where you would call your smart contract
    // e.g., const result = await suiClient.queryObjects({ ... });
    // and then parse the result into the MockTransaction format.
    await new Promise(res => setTimeout(res, 1500)); // simulate delay
    return mockTransactions;
};

const useTransactions = () => {
    const { account, isConnected } = useWalletStore();
    return useQuery({
        queryKey: ['transactions', account],
        queryFn: () => {
            if (!account) return Promise.resolve([]);
            // This is the placeholder for your smart contract call to get transactions
            return fetchTransactionsFromSmartContract(account);
        },
        enabled: isConnected && !!account,
    });
};

const parseStat = (stat: string | undefined): number => {
    if (!stat || stat === 'N/A') return -1;
    const value = parseFloat(stat.replace(/[^0-9.]/g, ''));
    if (isNaN(value)) return -1;
    const multiplier = stat.toUpperCase().includes('B') ? 1e9 : stat.toUpperCase().includes('M') ? 1e6 : stat.toUpperCase().includes('K') ? 1e3 : 1;
    return value * multiplier;
};

const calculateTrendingScore = (project: Project): number => {
    const now = new Date();
    const lastActivityDate = new Date(project.lastActivity);
    const daysSinceActivity = (now.getTime() - lastActivityDate.getTime()) / (1000 * 3600 * 24);

    const recencyScore = Math.max(0, 100 - daysSinceActivity * 2);

    const trendingScore = (project.popularityScore * 0.7) + (recencyScore * 0.3);

    return trendingScore;
};

const ProjectListItem: React.FC<{ project: Project }> = ({ project }) => (
    <Link to={`/projects/${project.id}`} className="flex items-center p-2 -m-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border/20 transition-colors group">
        <img src={project.logo} alt={project.name} className="w-8 h-8 rounded-full mr-3 flex-shrink-0" />
        <div className="min-w-0">
            <p className="font-semibold text-sm text-slate-900 dark:text-white truncate group-hover:text-accent-blue">{project.name}</p>
            <p className="text-xs text-slate-800 dark:text-slate-300 truncate">{project.tagline}</p>
        </div>
        <ChevronRightIcon className="w-4 h-4 text-slate-400 ml-auto flex-shrink-0 group-hover:translate-x-1 transition-transform" />
    </Link>
);

const TransactionIcon: React.FC<{ type: TransactionType }> = ({ type }) => {
    switch (type) {
        case 'send': return <div className="p-2 bg-red-500/10 rounded-full"><ArrowUpRightIcon className="w-4 h-4 text-red-400" /></div>;
        case 'receive': return <div className="p-2 bg-green-500/10 rounded-full"><ArrowDownLeftIcon className="w-4 h-4 text-green-400" /></div>;
        case 'dapp': return <div className="p-2 bg-blue-500/10 rounded-full"><ZapIcon className="w-4 h-4 text-blue-400" /></div>;
        default: return null;
    }
};

const TransactionListItem: React.FC<{ tx: MockTransaction, onClick: () => void }> = ({ tx, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center p-2 -m-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border/20 transition-colors group text-left">
        <TransactionIcon type={tx.type} />
        <div className="min-w-0 ml-3 flex-grow">
            <p className="font-semibold text-sm text-slate-900 dark:text-white truncate capitalize">{tx.type} {tx.currency}</p>
            <p className="text-xs text-slate-800 dark:text-slate-300 truncate">{tx.description}</p>
        </div>
        <div className="text-right flex-shrink-0 ml-2">
            <p className={`font-semibold text-sm ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount.toLocaleString()} {tx.currency}
            </p>
            <p className="text-xs text-slate-800 dark:text-slate-300">{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
    </button>
);

const ProjectsPage: React.FC = () => {
    const { data: allProjects = [], isLoading, isError, refetch } = useProjects();
    const {
        activeCategories, toggleCategory,
        sortBy, setSortBy,
        tvl, setTvl,
        users, setUsers,
        clearFilters,
    } = useProjectFilterStore();
    const { isConnected } = useWalletStore();
    const { favorites, recentlyViewed, isFavorite, toggleFavorite } = useProjectInteractionStore();
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState<MockTransaction | null>(null);

    const { data: transactions, isLoading: isLoadingTransactions } = useTransactions();

    const handleSelectProject = (project: Project) => {
        navigate(`/projects/${project.id}`);
    };

    // Fixed: Properly typed favorite projects
    const favoriteProjects = useMemo(() => {
        return isProjectArray(allProjects)
            ? allProjects.filter(p => favorites.includes(p.id))
            : [];
    }, [allProjects, favorites]);

    // Fixed: Properly typed recently viewed projects
    const recentlyViewedProjects = useMemo(() => {
        if (!isProjectArray(allProjects)) return [];

        return recentlyViewed
            .map(id => allProjects.find(p => p.id === id))
            .filter((p): p is Project => p !== undefined);
    }, [allProjects, recentlyViewed]);

    // Fixed: Properly typed filtered and sorted projects
    const filteredAndSortedProjects = useMemo(() => {
        if (!isProjectArray(allProjects)) return [];

        const tvlMin = parseStat(tvl.min);
        const tvlMax = parseStat(tvl.max);
        const usersMin = parseStat(users.min);
        const usersMax = parseStat(users.max);

        return allProjects
            .filter(project => {
                const categoryMatch = activeCategories.length === 0 || activeCategories.includes(project.category);

                const lowercasedSearchTerm = searchTerm.trim().toLowerCase();
                const searchMatch = lowercasedSearchTerm === '' ||
                    project.name.toLowerCase().includes(lowercasedSearchTerm) ||
                    project.tagline.toLowerCase().includes(lowercasedSearchTerm) ||
                    project.description.toLowerCase().includes(lowercasedSearchTerm) ||
                    (project.tags && project.tags.some(tag => tag.toLowerCase().includes(lowercasedSearchTerm)));

                const projectTvl = parseStat(project.stats?.tvl);
                const tvlMinMatch = tvlMin < 0 || (projectTvl >= 0 && projectTvl >= tvlMin);
                const tvlMaxMatch = tvlMax < 0 || (projectTvl >= 0 && projectTvl <= tvlMax);

                const projectUsers = parseStat(project.stats?.users);
                const usersMinMatch = usersMin < 0 || (projectUsers >= 0 && projectUsers >= usersMin);
                const usersMaxMatch = usersMax < 0 || (projectUsers >= 0 && projectUsers <= usersMax);

                return categoryMatch && searchMatch && tvlMinMatch && tvlMaxMatch && usersMinMatch && usersMaxMatch;
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'Trending':
                        return calculateTrendingScore(b) - calculateTrendingScore(a);
                    case 'Date Added':
                        return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
                    case 'Name':
                        return a.name.localeCompare(b.name);
                    case 'TVL':
                        return parseStat(b.stats?.tvl) - parseStat(a.stats?.tvl);
                    case 'Users':
                        return parseStat(b.stats?.users) - parseStat(a.stats?.users);
                    case 'Reviews':
                        return b.popularityScore - a.popularityScore;
                    default:
                        return 0;
                }
            });
    }, [allProjects, searchTerm, activeCategories, sortBy, tvl, users]);

    const FilterSidebar = () => (
        <div className="space-y-8">
            <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => {
                        const isActive = activeCategories.includes(category);
                        return (
                            <m.button
                                key={category}
                                onClick={() => toggleCategory(category)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-colors border-2 ${
                                    isActive
                                        ? 'bg-accent-blue/20 border-accent-blue/70 text-accent-blue'
                                        : 'bg-light-card dark:bg-dark-border/40 border-transparent hover:border-accent-blue/50 text-slate-800 dark:text-slate-200'
                                }`}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {category}
                            </m.button>
                        )
                    })}
                </div>
            </div>

            <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">TVL</h3>
                <div className="flex items-center gap-2">
                    <FormSelect id="tvl-min" value={tvl.min} onChange={e => setTvl({ ...tvl, min: e.target.value })}>
                        <option value="">Min</option>
                        {['$1M', '$10M', '$50M', '$100M'].map(v => <option key={v} value={v}>{v}</option>)}
                    </FormSelect>
                    <span className="text-slate-500">-</span>
                    <FormSelect id="tvl-max" value={tvl.max} onChange={e => setTvl({ ...tvl, max: e.target.value })}>
                        <option value="">Max</option>
                        {['$10M', '$50M', '$100M', '$500M+'].map(v => <option key={v} value={v}>{v}</option>)}
                    </FormSelect>
                </div>
            </div>
            <div>
                <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Users</h3>
                <div className="flex items-center gap-2">
                    <FormSelect id="users-min" value={users.min} onChange={e => setUsers({ ...users, min: e.target.value })}>
                        <option value="">Min</option>
                        {['10K', '50K', '100K'].map(v => <option key={v} value={v}>{v}</option>)}
                    </FormSelect>
                    <span className="text-slate-500">-</span>
                    <FormSelect id="users-max" value={users.max} onChange={e => setUsers({ ...users, max: e.target.value })}>
                        <option value="">Max</option>
                        {['50K', '100K', '250K+'].map(v => <option key={v} value={v}>{v}</option>)}
                    </FormSelect>
                </div>
            </div>

            <div className="pt-4">
                <Button onClick={clearFilters} variant="secondary" className="w-full">
                    <TrashIcon className="w-4 h-4 mr-2"/> Clear All Filters
                </Button>
            </div>
        </div>
    );

    const PersonalDashboard = () => (
        <Card className="!p-0">
            <div className="p-4 border-b border-light-border dark:border-dark-border flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                    <StarIcon className="w-5 h-5 text-yellow-400"/> My Favorite Projects
                </h2>
                <Button variant="secondary" className="!py-1 !px-3 !text-xs">View All</Button>
            </div>
            <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
                {favoriteProjects.length > 0 ? (
                    favoriteProjects.map(p => <ProjectListItem key={p.id} project={p} />)
                ) : (
                    <p className="text-center text-sm text-slate-800 dark:text-slate-300 py-4">You haven't favorited any projects yet.</p>
                )}
            </div>
        </Card>
    );

    const RecentTransactionsSection = () => {
        // Fixed: Properly typed transactions
        const transactionData = isTransactionArray(transactions) ? transactions : [];

        return (
            <Card className="!p-0">
                <div className="p-4 border-b border-light-border dark:border-dark-border flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-semibold text-slate-800 dark:text-slate-200">
                        <ZapIcon className="w-5 h-5 text-blue-400"/> Recent Network Transactions
                    </h2>
                    <Button variant="secondary" className="!py-1 !px-3 !text-xs" onClick={() => alert('Full transaction history page coming soon!')}>View All</Button>
                </div>
                <div className="p-4 space-y-3 min-h-[18rem]">
                    {isLoadingTransactions && <div className="text-center text-sm text-slate-400 py-10">Loading transactions...</div>}
                    {!isLoadingTransactions && transactionData.length > 0 && (
                        transactionData.map(tx => <TransactionListItem key={tx.id} tx={tx} onClick={() => setSelectedTx(tx)} />)
                    )}
                    {!isLoadingTransactions && transactionData.length === 0 && (
                        <div className="text-center text-sm text-slate-400 py-10">No recent transactions found.</div>
                    )}
                </div>
            </Card>
        );
    };

    return (
        <>
            <m.div
                initial="initial"
                animate="in"
                exit="out"
                variants={pageVariants}
                transition={pageTransition}
            >
                <div className="grid lg:grid-cols-4 gap-8 items-start">
                    {/* Sidebar */}
                    <aside className="hidden lg:block lg:col-span-1 space-y-8 self-start sticky top-24">
                        <FilterSidebar />
                        {recentlyViewedProjects.length > 0 && (
                            <Card className="!p-0">
                                <div className="p-4 border-b border-light-border dark:border-dark-border">
                                    <h2 className="font-semibold text-slate-800 dark:text-slate-200">Recently Viewed</h2>
                                </div>
                                <div className="p-4 space-y-3">
                                    {recentlyViewedProjects.map(p => <ProjectListItem key={p.id} project={p} />)}
                                </div>
                            </Card>
                        )}
                    </aside>

                    {/* Main Content */}
                    <main className="lg:col-span-3 space-y-6">
                        <m.div initial="hidden" animate="visible" variants={staggerContainer}>
                            {isConnected ? (
                                <div className="space-y-6">
                                    <m.div variants={itemVariants}><PersonalDashboard /></m.div>
                                    <m.div variants={itemVariants}><RecentTransactionsSection /></m.div>
                                </div>
                            ) : (
                                <m.div variants={itemVariants}>
                                    <ConnectWalletPlaceholder
                                        icon={<StarIcon className="w-5 h-5 text-yellow-400" />}
                                        title="Personalize Your Dashboard"
                                        description="Connect your wallet to track your favorite projects and see your personalized activity."
                                    />
                                </m.div>
                            )}

                            {/* Search and Sort Controls */}
                            <m.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8">
                                <m.div variants={itemVariants} className="relative w-full">
                                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none z-10" />
                                    <input
                                        type="text"
                                        placeholder="Search by name, description, or tags..."
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        className="w-full bg-light-card dark:bg-dark-bg/70 border border-light-border dark:border-dark-border/60 rounded-lg py-3 pl-12 pr-4 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(96,165,250,0.2)]"
                                    />
                                </m.div>

                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <FormSelect id="sort-by" value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="w-full sm:w-48">
                                        {sortOptions.map(opt => <option key={opt} value={opt}>Sort by: {opt}</option>)}
                                    </FormSelect>
                                    <Button variant="secondary" className="!py-3 !px-3.5 lg:hidden" onClick={() => setIsSidebarOpen(true)}>
                                        <FilterIcon className="w-5 h-5"/>
                                    </Button>
                                </div>
                            </m.div>

                            {/* Project Grid */}
                            <m.div layout className="mt-6">
                                {isError ? (
                                    <m.div variants={itemVariants}>
                                        <ErrorState
                                            title="Could not load projects"
                                            message="There was an issue fetching the latest projects from the network."
                                            onRetry={refetch}
                                        />
                                    </m.div>
                                ) : (
                                    <AnimatePresence>
                                        {isLoading ? (
                                            <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                                <ProjectCardSkeleton count={6} />
                                            </div>
                                        ) : filteredAndSortedProjects.length > 0 ? (
                                            <div className="grid sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                                                {filteredAndSortedProjects.map((project, index) => (
                                                    <ProjectCard
                                                        key={project.id}
                                                        project={project}
                                                        index={index}
                                                        onSelect={handleSelectProject}
                                                        isFavorite={isFavorite(project.id)}
                                                        onToggleFavorite={() => toggleFavorite(project.id)}
                                                        user={null} // Simplified for this view
                                                        onAuthRequired={() => {}} // Simplified for this view
                                                    />
                                                ))}
                                            </div>
                                        ) : (
                                            <m.div variants={itemVariants} className="text-center py-16 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg">
                                                <SearchIcon className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto mb-4" />
                                                <h3 className="font-bold text-xl">No Projects Found</h3>
                                                <p className="text-slate-800 dark:text-slate-300 mt-2 max-w-sm mx-auto">
                                                    Your search and filter combination for "{searchTerm}" did not return any results. Try adjusting your criteria.
                                                </p>
                                                <Button variant="secondary" className="mt-4" onClick={() => { setSearchTerm(''); clearFilters(); }}>
                                                    Clear Search & Filters
                                                </Button>
                                            </m.div>
                                        )}
                                    </AnimatePresence>
                                )}
                            </m.div>
                        </m.div>
                    </main>
                </div>
                {/* Mobile Filter Sidebar */}
                <AnimatePresence>
                    {isSidebarOpen && (
                        <m.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            onClick={() => setIsSidebarOpen(false)}
                            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                        >
                            <m.div
                                initial={{ x: '-100%' }}
                                animate={{ x: '0%' }}
                                exit={{ x: '-100%' }}
                                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                                onClick={(e) => e.stopPropagation()}
                                className="absolute top-0 left-0 bottom-0 w-full max-w-xs bg-light-bg dark:bg-dark-bg p-6"
                            >
                                <div className="flex justify-between items-center mb-6">
                                    <h2 className="text-xl font-bold">Filters</h2>
                                    <Button variant="secondary" className="!p-2" onClick={() => setIsSidebarOpen(false)}>
                                        <XIcon className="w-5 h-5" />
                                    </Button>
                                </div>
                                <FilterSidebar />
                            </m.div>
                        </m.div>
                    )}
                </AnimatePresence>
            </m.div>

            {selectedTx && (
                <TransactionDetailModal tx={selectedTx} onClose={() => setSelectedTx(null)} />
            )}
        </>
    );
};

export default ProjectsPage;