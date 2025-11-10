import React from 'react';
import { m } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { NewsArticle } from '../../types/index';
import LazyImage from '../ui/LazyImage';

const TopStoryCard: React.FC<{ article: NewsArticle }> = ({ article }) => {
    return (
        <m.div 
            whileHover={{ scale: 1.02, transition: { type: 'spring', stiffness: 400, damping: 10 } }}
            className="w-full"
        >
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="block p-3 rounded-lg bg-light-card dark:bg-dark-card/50 border border-light-border dark:border-dark-border hover:border-accent-blue transition-colors group">
                <div className="flex items-center space-x-4">
                    <LazyImage
                        src={article.image}
                        alt={article.title}
                        className="w-full h-full object-cover"
                        wrapperClassName="w-16 h-16 rounded-md bg-slate-200 dark:bg-dark-border flex-shrink-0"
                    />
                    <div className="min-w-0">
                        <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200 group-hover:text-accent-blue transition-colors line-clamp-2 leading-tight">
                            {article.title}
                        </h4>
                        <p className="text-xs text-slate-800 dark:text-slate-300 mt-1">
                            {article.sourceName} &middot; {formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })}
                        </p>
                    </div>
                </div>
            </a>
        </m.div>
    );
};

export default TopStoryCard;