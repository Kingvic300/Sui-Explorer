

import React, { useState, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import Button from '../components/ui/Button';
import { XIcon, SearchIcon } from '../components/icons/MiscIcons';
import { pageVariants, pageTransition, staggerContainer, itemVariants } from '../utils/animations';
import { useCommunityPosts } from '../hooks/queries/useCommunityPosts';
import FeedPostSkeleton from '../components/ui/skeletons/FeedPostSkeleton';
import TweetCard from '../components/community/TweetCard';
import ErrorState from '../components/ui/ErrorState';

const CommunityPage: React.FC = () => {
    const { data: communityPostsData = [], isLoading, isError, refetch } = useCommunityPosts();
    const [searchTerm, setSearchTerm] = useState('');
    
    const twitterFeed = useMemo(() => {
        const lowercasedFilter = searchTerm.toLowerCase();
        return communityPostsData
            .filter(post => post.platform === 'x')
            .filter(post => {
                if (!lowercasedFilter) return true;
                return (
                    post.content.toLowerCase().includes(lowercasedFilter) ||
                    post.author.toLowerCase().includes(lowercasedFilter) ||
                    post.handle.toLowerCase().includes(lowercasedFilter)
                );
            })
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [communityPostsData, searchTerm]);

    return (
        <m.div initial="initial" animate="in" exit="out" variants={pageVariants} transition={pageTransition}>
            <div className="max-w-3xl mx-auto">
                <m.div initial="hidden" animate="visible" variants={staggerContainer} className="space-y-6">
                    <m.section variants={itemVariants} className="text-center py-6">
                        <XIcon className="w-10 h-10 mx-auto text-slate-800 dark:text-white mb-4" />
                        <h1 className="text-4xl md:text-5xl font-display font-extrabold mb-4">Join the Conversation</h1>
                        <p className="text-lg text-slate-900 dark:text-slate-200 max-w-2xl mx-auto mb-6">
                            Follow the latest updates, discussions, and alpha from the Sui ecosystem, live from the community on X.
                        </p>
                        <a href="https://x.com/SuiNetwork" target="_blank" rel="noopener noreferrer">
                            <Button variant="primary">
                                Follow @SuiNetwork on X
                            </Button>
                        </a>
                    </m.section>

                    <m.div variants={itemVariants} className="relative w-full">
                        <SearchIcon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                        <input
                            type="text"
                            placeholder="Search feed by content, author, or handle..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full bg-light-card dark:bg-dark-bg/70 border border-light-border dark:border-dark-border/60 rounded-lg py-2.5 pl-11 pr-4 text-slate-900 dark:text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-accent-blue/50 focus:border-accent-blue transition-all duration-300 focus:shadow-[0_0_0_3px_rgba(96,165,250,0.2)]"
                        />
                    </m.div>

                    <m.div layout className="space-y-6">
                        {isError && (
                            <m.div variants={itemVariants}>
                                <ErrorState 
                                    title="Could not load feed"
                                    message="There was an issue fetching the latest community posts."
                                    onRetry={refetch}
                                />
                            </m.div>
                        )}
                        <AnimatePresence>
                            {isLoading ? (
                                <FeedPostSkeleton count={5} />
                            ) : twitterFeed.length > 0 ? (
                                twitterFeed.map((item) => <TweetCard post={item} key={item.id} />)
                            ) : (
                                <m.div variants={itemVariants} className="text-center py-10 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg">
                                    <h3 className="font-bold text-lg">No Results Found</h3>
                                    <p className="text-slate-800 dark:text-slate-300 mt-1">
                                        Your search for "{searchTerm}" did not return any results.
                                    </p>
                                </m.div>
                            )}
                        </AnimatePresence>
                    </m.div>
                </m.div>
            </div>
        </m.div>
    );
};

export default CommunityPage;