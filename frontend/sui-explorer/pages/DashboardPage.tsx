import React, { useMemo, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useProjects } from '../hooks/queries/useProjects';
import { useProjectFilterStore } from '../stores/useProjectFilterStore';
import { useProjectInteractionStore } from '../hooks/queries/useProjectInteractionStore';
import { useWalletStore } from '../stores/useWalletStore';
import ProjectCard from '../components/ui/ProjectCard';
import ProjectCardSkeleton from '../components/ui/skeletons/ProjectCardSkeleton';
import ErrorState from '../components/ui/ErrorState';
import ConnectWalletPlaceholder from '../components/projects/ConnectWalletPlaceholder';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import { FormSelect } from '../components/ui/forms/FormElements';
import TransactionDetailModal from '../components/ui/modals/TransactionDetailModal';
import {
    pageVariants, pageTransition, staggerContainer, itemVariants,
} from '../utils/animations';
import {
    StarIcon, SearchIcon, FilterIcon, XIcon, TrashIcon,
    ArrowUpRightIcon, ArrowDownLeftIcon, ZapIcon, ChevronRightIcon,
} from '../components/icons/MiscIcons';
import { Project, MockTransaction, TransactionType } from '../types/index';
import { SuiClient, getFullnodeUrl } from '@mysten/sui.js/client';

const categories = ['DeFi', 'Gaming', 'NFT', 'Infrastructure'];
const sortOptions = ['Trending', 'TVL', 'Date Added', 'Name', 'Users', 'Reviews'];

// =========================
//  Transaction Fetch (Sui)
// =========================
const client = new SuiClient({ url: getFullnodeUrl('mainnet') });

const fetchTransactionsFromSmartContract = async (address: string): Promise<MockTransaction[]> => {
    console.log(`Fetching transactions for ${address}...`);

    const txs = await client.queryTransactionBlocks({
        filter: { FromAddress: address },
        limit: 10,
        options: {
            showInput: true,
            showEffects: true,
            showEvents: true,
        },
    });

    return txs.data.map(tx => ({
        id: tx.digest,
        type: 'dapp',
        status: tx.effects?.status?.status === 'success' ? 'Success' : 
                  tx.effects?.status?.status === 'failure' ? 'Failed' : 'Pending',
        description: tx.transaction?.data?.transaction?.kind || 'Sui transaction',
        timestamp: tx.timestampMs
            ? new Date(parseInt(tx.timestampMs)).toISOString()
            : new Date().toISOString(),
        amount: 0,
        currency: 'SUI',
        from: address,
        to: tx.transaction?.data?.sender || 'Unknown',
        fee: 0.01,
    }));
};

const useTransactions = () => {
    const { account, isConnected } = useWalletStore();
    return useQuery({
        queryKey: ['transactions', account],
        queryFn: () => account ? fetchTransactionsFromSmartContract(account) : Promise.resolve([]),
        enabled: isConnected && !!account,
    });
};

const parseStat = (stat?: string): number => {
    if (!stat || stat === 'N/A') return -1;
    const value = parseFloat(stat.replace(/[^0-9.]/g, ''));
    if (isNaN(value)) return -1;
    const multiplier = stat.toUpperCase().includes('B')
        ? 1e9
        : stat.toUpperCase().includes('M')
            ? 1e6
            : stat.toUpperCase().includes('K')
                ? 1e3
                : 1;
    return value * multiplier;
};

const calculateTrendingScore = (project: Project): number => {
    const now = new Date();
    const lastActivityDate = new Date(project.lastActivity);
    const daysSinceActivity = (now.getTime() - lastActivityDate.getTime()) / (1000 * 3600 * 24);
    const recencyScore = Math.max(0, 100 - daysSinceActivity * 2);
    return project.popularityScore * 0.7 + recencyScore * 0.3;
};

const ProjectListItem: React.FC<{ project: Project }> = ({ project }) => (
    <Link
        to={`/projects/${project.id}`}
        className="flex items-center p-2 -m-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border/20 transition-colors group"
    >
        <img src={project.logo} alt={project.name} className="w-8 h-8 rounded-full mr-3" />
        <div className="min-w-0">
            <p className="font-semibold text-sm truncate group-hover:text-accent-blue">
                {project.name}
            </p>
            <p className="text-xs truncate">{project.tagline}</p>
        </div>
        <ChevronRightIcon className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
    </Link>
);

const TransactionIcon: React.FC<{ type: TransactionType }> = ({ type }) => {
    switch (type) {
        case 'send':
            return <div className="p-2 bg-red-500/10 rounded-full"><ArrowUpRightIcon className="w-4 h-4 text-red-400" /></div>;
        case 'receive':
            return <div className="p-2 bg-green-500/10 rounded-full"><ArrowDownLeftIcon className="w-4 h-4 text-green-400" /></div>;
        case 'dapp':
            return <div className="p-2 bg-blue-500/10 rounded-full"><ZapIcon className="w-4 h-4 text-blue-400" /></div>;
        default:
            return null;
    }
};

const TransactionListItem: React.FC<{ tx: MockTransaction; onClick: () => void }> = ({ tx, onClick }) => (
    <button
        onClick={onClick}
        className="w-full flex items-center p-2 -m-2 rounded-lg hover:bg-slate-100 dark:hover:bg-dark-border/20 text-left group"
    >
        <TransactionIcon type={tx.type} />
        <div className="min-w-0 ml-3 flex-grow">
            <p className="font-semibold text-sm capitalize truncate">{tx.type} {tx.currency}</p>
            <p className="text-xs truncate">{tx.description}</p>
        </div>
        <div className="text-right ml-2">
            <p className={`font-semibold text-sm ${tx.amount > 0 ? 'text-green-500' : 'text-red-500'}`}>
                {tx.amount > 0 ? '+' : ''}{tx.amount} {tx.currency}
            </p>
            <p className="text-xs">{new Date(tx.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
        </div>
    </button>
);

// ====================================
// Main Component: ProjectsPage
// ====================================
const ProjectsPage: React.FC = () => {
    const { data: allProjects = [] as Project[], isLoading, isError, refetch } = useProjects();
    const {
        activeCategories, toggleCategory, sortBy, setSortBy, tvl, setTvl,
        users, setUsers, clearFilters,
    } = useProjectFilterStore();

    const { account, isConnected } = useWalletStore();
    const {
        getFavorites, toggleFavorite, getRecentlyViewed,
    } = useProjectInteractionStore();
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    const [selectedTx, setSelectedTx] = useState<MockTransaction | null>(null);
    const { data: transactions, isLoading: isLoadingTx } = useTransactions();

    // NOTE: fixed: provide empty string fallback for wallet in store getters
    const favorites = getFavorites(account || '');
    const recentlyViewed = getRecentlyViewed(account || '');

    const favoriteProjects = useMemo(() =>
        (Array.isArray(allProjects) ? allProjects : []).filter(p => favorites.includes(p.id)), [allProjects, favorites]);

    const recentlyViewedProjects = useMemo(() =>
        (recentlyViewed || []).map(id => allProjects.find(p => p.id === id)).filter(Boolean) as Project[], [recentlyViewed, allProjects]);

    const filteredAndSortedProjects = useMemo(() => {
        const tvlMin = parseStat(tvl.min);
        const tvlMax = parseStat(tvl.max);
        const usersMin = parseStat(users.min);
        const usersMax = parseStat(users.max);
        const term = searchTerm.trim().toLowerCase();

        return (Array.isArray(allProjects) ? allProjects : [])
            .filter(p => {
                const matchCategory = !activeCategories.length || activeCategories.includes(p.category);
                const matchSearch = !term || [p.name, p.tagline, p.description].some(f => f.toLowerCase().includes(term));
                const tvlVal = parseStat(p.stats?.tvl);
                const userVal = parseStat(p.stats?.users);
                return (
                    matchCategory &&
                    matchSearch &&
                    (tvlMin < 0 || tvlVal >= tvlMin) &&
                    (tvlMax < 0 || tvlVal <= tvlMax) &&
                    (usersMin < 0 || userVal >= usersMin) &&
                    (usersMax < 0 || userVal <= usersMax)
                );
            })
            .sort((a, b) => {
                switch (sortBy) {
                    case 'Trending': return calculateTrendingScore(b) - calculateTrendingScore(a);
                    case 'Date Added': return new Date(b.lastActivity).getTime() - new Date(a.lastActivity).getTime();
                    case 'Name': return a.name.localeCompare(b.name);
                    case 'TVL': return parseStat(b.stats?.tvl) - parseStat(a.stats?.tvl);
                    case 'Users': return parseStat(b.stats?.users) - parseStat(a.stats?.users);
                    case 'Reviews': return b.popularityScore - a.popularityScore;
                    default: return 0;
                }
            });
    }, [allProjects, searchTerm, activeCategories, sortBy, tvl, users]);

    const FilterSidebar = () => (
        <div className="space-y-8">
            <div>
                <h3 className="font-semibold mb-4">Categories</h3>
                <div className="flex flex-wrap gap-2">
                    {categories.map(category => {
                        const isActive = activeCategories.includes(category);
                        return (
                            <m.button
                                key={category}
                                onClick={() => toggleCategory(category)}
                                className={`px-3 py-1.5 rounded-full text-sm font-medium border-2 transition-colors ${
                                    isActive
                                        ? 'bg-accent-blue/20 border-accent-blue text-accent-blue'
                                        : 'border-transparent hover:border-accent-blue/50'
                                }`}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.95 }}
                            >
                                {category}
                            </m.button>
                        );
                    })}
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-4">TVL</h3>
                <div className="flex items-center gap-2">
                    <FormSelect id="tvl-min" value={tvl.min} onChange={e => setTvl({ ...tvl, min: e.target.value })}>
                        <option value="">Min</option>
                        {['$1M', '$10M', '$50M', '$100M'].map(v => <option key={v}>{v}</option>)}
                    </FormSelect>
                    <span>-</span>
                    <FormSelect id="tvl-max" value={tvl.max} onChange={e => setTvl({ ...tvl, max: e.target.value })}>
                        <option value="">Max</option>
                        {['$10M', '$50M', '$100M', '$500M+'].map(v => <option key={v}>{v}</option>)}
                    </FormSelect>
                </div>
            </div>

            <div>
                <h3 className="font-semibold mb-4">Users</h3>
                <div className="flex items-center gap-2">
                    <FormSelect id="users-min" value={users.min} onChange={e => setUsers({ ...users, min: e.target.value })}>
                        <option value="">Min</option>
                        {['10K', '50K', '100K'].map(v => <option key={v}>{v}</option>)}
                    </FormSelect>
                    <span>-</span>
                    <FormSelect id="users-max" value={users.max} onChange={e => setUsers({ ...users, max: e.target.value })}>
                        <option value="">Max</option>
                        {['50K', '100K', '250K+'].map(v => <option key={v}>{v}</option>)}
                    </FormSelect>
                </div>
            </div>

            <div className="pt-4">
                <Button onClick={clearFilters} variant="secondary" className="w-full">
                    <TrashIcon className="w-4 h-4 mr-2" /> Clear All
                </Button>
            </div>
        </div>
    );

    const PersonalDashboard = () => (
        <Card className="!p-0">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold">
                    <StarIcon className="w-5 h-5 text-yellow-400" /> My Favorite Projects
                </h2>
            </div>
            <div className="p-4 space-y-3 max-h-60 overflow-y-auto">
                {favoriteProjects.length ? (
                    favoriteProjects.map(p => <ProjectListItem key={p.id} project={p} />)
                ) : (
                    <p className="text-center text-sm py-4 text-slate-400">No favorites yet.</p>
                )}
            </div>
        </Card>
    );

    const RecentTransactionsSection = () => (
        <Card className="!p-0">
            <div className="p-4 border-b flex items-center justify-between">
                <h2 className="flex items-center gap-2 font-semibold">
                    <ZapIcon className="w-5 h-5 text-blue-400" /> Recent Transactions
                </h2>
            </div>
            <div className="p-4 space-y-3 min-h-[18rem]">
                {isLoadingTx && <div className="text-center text-sm py-10 text-slate-400">Loading...</div>}
                {!isLoadingTx && transactions?.length
                    ? transactions.map(tx => (
                        <TransactionListItem key={tx.id} tx={tx} onClick={() => setSelectedTx(tx)} />
                    ))
                    : !isLoadingTx && <div className="text-center text-sm py-10 text-slate-400">No recent transactions.</div>}
            </div>
        </Card>
    );

    return (
        <>
            <m.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
                <div className="grid lg:grid-cols-4 gap-8 items-start">
                    <aside className="hidden lg:block col-span-1 space-y-8 sticky top-24">
                        <FilterSidebar />
                        {recentlyViewedProjects.length > 0 && (
                            <Card className="!p-0">
                                <div className="p-4 border-b">
                                    <h2 className="font-semibold">Recently Viewed</h2>
                                </div>
                                <div className="p-4 space-y-3">
                                    {recentlyViewedProjects.map(p => <ProjectListItem key={p.id} project={p} />)}
                                </div>
                            </Card>
                        )}
                    </aside>

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
                                        description="Connect your wallet to track your favorite projects and see your activity."
                                    />
                                </m.div>
                            )}

                            {/* Search + Sort */}
                            <m.div variants={itemVariants} className="flex flex-col sm:flex-row gap-4 justify-between items-center mt-8">
                                <div className="relative w-full">
                                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                                    <input
                                        type="text"
                                        placeholder="Search projects..."
                                        value={searchTerm}
                                        onChange={e => setSearchTerm(e.target.value)}
                                        className="w-full bg-light-card dark:bg-dark-bg/70 border rounded-lg py-3 pl-12 pr-4"
                                    />
                                </div>

                                <div className="flex items-center gap-4 w-full sm:w-auto">
                                    <FormSelect id="sort-by" value={sortBy} onChange={e => setSortBy(e.target.value as any)} className="w-full sm:w-48">
                                        {sortOptions.map(opt => <option key={opt}>{opt}</option>)}
                                    </FormSelect>
                                    <Button variant="secondary" className="!py-3 !px-3.5 lg:hidden" onClick={() => setIsSidebarOpen(true)}>
                                        <FilterIcon className="w-5 h-5" />
                                    </Button>
                                </div>
                            </m.div>

                            {/* Projects Grid */}
                            <m.div layout className="mt-6">
                                {isError ? (
                                    <ErrorState
                                        title="Could not load projects"
                                        message="There was an issue fetching projects."
                                        onRetry={refetch}
                                    />
                                ) : (
                                    <AnimatePresence>
                                        {isLoading ? (
                                            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6"><ProjectCardSkeleton count={6} /></div>
                                        ) : filteredAndSortedProjects && filteredAndSortedProjects.length > 0 ? (
                                            <m.div
                                                layout
                                                variants={staggerContainer}
                                                initial="hidden"
                                                animate="visible"
                                                className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6"
                                            >
                                                {filteredAndSortedProjects.map((project, index) => (
                                                    <m.div key={project.id} variants={itemVariants} layout>
                                                        <ProjectCard
                                                            project={project}
                                                            index={index}
                                                            onSelect={() => {
                                                                // record recently viewed per-wallet (store expected in store file)
                                                                try {
                                                                    // toggleFavorite is not used here; record view could be added to store if available
                                                                } catch (e) {
                                                                    // silent fallback
                                                                }
                                                                navigate(`/projects/${project.id}`);
                                                            }}
                                                            isFavorite={favorites.includes(project.id)}
                                                            onToggleFavorite={() => toggleFavorite(account || '', project.id)}
                                                            user={null}
                                                            onAuthRequired={() => {}}
                                                        />
                                                    </m.div>
                                                ))}
                                            </m.div>
                                        ) : (
                                            <p className="text-center text-sm py-10 text-slate-400">
                                                {isLoading ? 'Loading projects...' : 'No projects found.'}
                                            </p>
                                        )}
                                    </AnimatePresence>
                                )}
                            </m.div>
                        </m.div>
                    </main>
                </div>
            </m.div>

            {/* Sidebar for Mobile Filters */}
            <AnimatePresence>
                {isSidebarOpen && (
                    <m.div
                        className="fixed inset-0 z-50 bg-black/50 flex justify-end"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsSidebarOpen(false)}
                    >
                        <m.div
                            className="bg-light-bg dark:bg-dark-bg w-80 h-full p-6 overflow-y-auto"
                            initial={{ x: '100%' }}
                            animate={{ x: 0 }}
                            exit={{ x: '100%' }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                            onClick={e => e.stopPropagation()}
                        >
                            <div className="flex justify-between items-center mb-6">
                                <h3 className="text-lg font-semibold">Filters</h3>
                                <button onClick={() => setIsSidebarOpen(false)}>
                                    <XIcon className="w-5 h-5" />
                                </button>
                            </div>
                            <FilterSidebar />
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>

            {/* Transaction Detail Modal */}
            {selectedTx && (
                <TransactionDetailModal
                    tx={selectedTx} // fixed: prop name matches expected 'tx'
                    onClose={() => setSelectedTx(null)}
                />
            )}
        </>
    );
};

export default ProjectsPage;
