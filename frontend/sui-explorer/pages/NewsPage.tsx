import React, { useState, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useNews } from '../hooks/queries/useNews';
import { pageVariants, pageTransition, staggerContainer, itemVariants } from '../utils/animations';
import NewsCard from '../components/news/NewsCard';
import TopStoryCard from '../components/news/TopStoryCard';
import NewsPageSkeleton from '../components/ui/skeletons/NewsPageSkeleton';
import ErrorState from '../components/ui/ErrorState';
import { ZapIcon } from '../components/icons/MiscIcons';

const categories = ['All', 'Ecosystem', 'Product Launches', 'Dev Updates', 'Community'];

const NewsPage: React.FC = () => {
    const { data: allNews = [], isLoading, isError, refetch } = useNews();
    const [activeCategory, setActiveCategory] = useState('All');

    const sortedNews = useMemo(() => {
        return allNews.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
    }, [allNews]);

    const filteredNews = useMemo(() => {
        const nonFeatured = sortedNews.filter(n => !n.featured);
        if (activeCategory === 'All') return nonFeatured;
        return nonFeatured.filter(n => n.category === activeCategory);
    }, [sortedNews, activeCategory]);

    const topStories = useMemo(() => {
        return sortedNews.filter(n => n.featured);
    }, [sortedNews]);

    return (
        <m.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
        >
            <m.section variants={itemVariants} className="text-center mb-10">
                <h1 className="text-4xl md:text-5xl font-display font-bold mb-3">Sui News Hub</h1>
                <p className="text-slate-900 dark:text-slate-200 max-w-2xl mx-auto">
                    The latest updates, announcements, and insights from across the Sui ecosystem.
                </p>
            </m.section>

            {/* Filter Controls */}
            <m.div variants={itemVariants} className="flex justify-center flex-wrap gap-2 mb-10">
                {categories.map(category => (
                    <m.button
                        key={category}
                        onClick={() => setActiveCategory(category)}
                        className={`px-4 py-2 rounded-full text-sm font-semibold transition-all duration-300 ${activeCategory === category ? 'bg-accent-blue text-white shadow-md shadow-accent-blue/20' : 'bg-light-card dark:bg-dark-card hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-slate-200'}`}
                        whileHover={{ y: -2 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        {category}
                    </m.button>
                ))}
            </m.div>

            {isLoading ? (
                <NewsPageSkeleton />
            ) : isError ? (
                <ErrorState 
                    title="Could Not Load News"
                    message="There was an issue fetching the latest articles. Please try again."
                    onRetry={refetch}
                />
            ) : (
                <div className="grid lg:grid-cols-3 gap-8 items-start">
                    {/* Main Feed */}
                    <AnimatePresence mode="wait">
                        <m.div
                            key={activeCategory}
                            variants={staggerContainer}
                            initial="hidden"
                            animate="visible"
                            className="lg:col-span-2 grid md:grid-cols-2 gap-6"
                        >
                            {filteredNews.length > 0 ? (
                                filteredNews.map(article => <NewsCard key={article.id} article={article} />)
                            ) : (
                                <div className="md:col-span-2 text-center py-20 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-lg">
                                    <h3 className="font-bold text-xl">No Articles Found</h3>
                                    <p className="text-slate-800 dark:text-slate-300 mt-2">There are no articles in this category yet.</p>
                                </div>
                            )}
                        </m.div>
                    </AnimatePresence>
                    
                    {/* Sidebar */}
                    <aside className="lg:col-span-1 space-y-5 lg:sticky top-24">
                         <m.div variants={staggerContainer} initial="hidden" animate="visible">
                            <m.h2 variants={itemVariants} className="text-2xl font-display font-bold flex items-center gap-2 mb-4">
                                <ZapIcon className="w-6 h-6 text-accent-blue" />
                                Top Stories
                            </m.h2>
                            <div className="space-y-4">
                                {topStories.map(article => (
                                    <m.div key={article.id} variants={itemVariants}>
                                        <TopStoryCard article={article} />
                                    </m.div>
                                ))}
                            </div>
                        </m.div>
                    </aside>
                </div>
            )}
        </m.div>
    );
};

export default NewsPage;