
import React, { useState, useMemo, useEffect } from 'react';
import { Post, communityPostsData } from '../data/communityPosts';
import Composer from './community/Composer';
import PostCard from './community/PostCard';
import { BoltIcon } from './Icons';
import PostCardSkeleton from './community/PostCardSkeleton';
import FeedFilter from './community/FeedFilter';
import { apiCall } from '../utils/api';

interface CommunityPageProps {
    user: { address: string } | null;
    onAuthRequired: (action: () => void) => void;
    showNotification: (message: string, type: 'success' | 'error') => void;
}

type SortOrder = 'latest' | 'popular' | 'trending';

const CommunityPage: React.FC<CommunityPageProps> = ({ user, onAuthRequired, showNotification }) => {
    const [posts, setPosts] = useState<Post[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [sortOrder, setSortOrder] = useState<SortOrder>('latest');

    useEffect(() => {
        const fetchPosts = async () => {
            setIsLoading(true);
            const data = await apiCall(() => communityPostsData, showNotification, {
                errorMessage: 'Community feed could not be loaded.',
                errorStatus: 502,
                errorPrefix: 'Failed to fetch posts',
                failChance: 0.1
            });
            if (data) {
                setPosts(data);
            }
            setIsLoading(false);
        };
        fetchPosts();
    }, [showNotification]);

    const sortedPosts = useMemo(() => {
        const sorted = [...posts];
        if (sortOrder === 'latest') {
            return sorted.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
        }
        if (sortOrder === 'popular') {
            return sorted.sort((a, b) => b.likes - a.likes);
        }
        if (sortOrder === 'trending') {
            const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const trendingPosts = sorted.filter(post => new Date(post.timestamp) > twentyFourHoursAgo);
            
            return trendingPosts.sort((a, b) => {
                const scoreA = a.likes + (a.comments * 2) + (a.shares * 3);
                const scoreB = b.likes + (b.comments * 2) + (b.shares * 3);
                return scoreB - scoreA;
            });
        }
        return sorted;
    }, [posts, sortOrder]);

    return (
        <section className={`min-h-screen pt-32 pb-12`}>
            <div className="container mx-auto px-6 max-w-3xl">
                <div className="text-left mb-8">
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white">Ecosystem Pulse</h1>
                    <p className="text-lg text-gray-400 mt-2">The latest conversations about Sui from around the web.</p>
                </div>
                
                <Composer user={user} onAuthRequired={onAuthRequired} />

                <div className="my-8 flex flex-col sm:flex-row items-start sm:items-center justify-between border-y border-indigo-900/50 py-4 gap-4">
                    <h2 className="font-display text-xl font-bold text-white flex-shrink-0">Community Feed</h2>
                    <FeedFilter sortOrder={sortOrder} onSetSortOrder={setSortOrder} />
                </div>


                {isLoading ? (
                    <div className="space-y-6">
                        <PostCardSkeleton />
                        <PostCardSkeleton />
                        <PostCardSkeleton />
                    </div>
                ) : posts.length > 0 ? (
                     sortOrder === 'trending' && sortedPosts.length === 0 ? (
                        <div className="text-center py-16 bg-indigo-950/20 rounded-2xl border border-blue-900/50">
                            <BoltIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="font-display font-bold text-white text-xl">Nothing Trending Right Now</h3>
                            <p className="text-gray-500 mt-1">Check back later to see the latest buzz.</p>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            {sortedPosts.map((post, index) => (
                                <PostCard 
                                    key={post.id} 
                                    post={post} 
                                    index={index} 
                                />
                            ))}
                        </div>
                    )
                ) : (
                    <div className="text-center py-16 bg-indigo-950/20 rounded-2xl border border-dashed border-red-900/50">
                        <h3 className="font-display font-bold text-white text-xl">Could Not Load Feed</h3>
                        <p className="text-red-400 mt-1">There was an error fetching community posts.</p>
                    </div>
                )}
            </div>
        </section>
    );
};

export default CommunityPage;