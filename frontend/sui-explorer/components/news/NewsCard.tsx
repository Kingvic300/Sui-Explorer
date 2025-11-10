import React from 'react';
import { m } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import { NewsArticle } from '../../types/index';
import Card from '../ui/Card';
import LazyImage from '../ui/LazyImage';
import { ChevronRightIcon } from '../icons/MiscIcons';
import { itemVariants } from '../../utils/animations';

const NewsCard: React.FC<{ article: NewsArticle }> = ({ article }) => {
    return (
        <m.div variants={itemVariants} className="h-full">
            <a href={article.link} target="_blank" rel="noopener noreferrer" className="block h-full group">
                <Card className="!p-0 overflow-hidden h-full flex flex-col">
                    <div className="aspect-video w-full relative bg-slate-200 dark:bg-dark-border">
                        <LazyImage
                            src={article.image}
                            alt={article.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                         <div className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs bg-black/50 text-white backdrop-blur-sm font-semibold">
                            {article.category}
                        </div>
                    </div>
                    <div className="p-4 flex flex-col flex-grow">
                        <h3 className="font-bold text-lg text-slate-900 dark:text-white group-hover:text-accent-blue transition-colors leading-tight">
                            {article.title}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-2 flex-grow line-clamp-3">
                            {article.summary}
                        </p>
                        <div className="flex items-center justify-between mt-4 pt-4 border-t border-light-border dark:border-dark-border">
                            <div className="flex items-center space-x-2">
                                <LazyImage
                                    src={article.sourceLogo}
                                    alt={article.sourceName}
                                    className="w-5 h-5 object-contain"
                                    wrapperClassName="w-5 h-5 rounded-full bg-light-bg dark:bg-dark-bg"
                                />
                                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400">{article.sourceName}</span>
                            </div>
                             <span className="text-xs text-slate-500">{formatDistanceToNow(new Date(article.timestamp), { addSuffix: true })}</span>
                        </div>
                    </div>
                </Card>
            </a>
        </m.div>
    );
};

export default NewsCard;