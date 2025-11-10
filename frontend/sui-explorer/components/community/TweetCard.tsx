import React from 'react';
import { m } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
import Card from '../ui/Card';
import { MessageSquareIcon, RepeatIcon, HeartIcon, XIcon } from '../icons/MiscIcons';
import { Post } from '../../types/index';
import { itemVariants } from '../../utils/animations';
import LazyImage from '../ui/LazyImage';

const TweetCard = React.memo(({ post }: { post: Post }) => {
    const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });

    return (
        <m.div variants={itemVariants} whileHover={{ y: -5, scale: 1.01, transition: { type: 'spring', stiffness: 300 } }} className="h-full">
            <Card className="!p-4 transition-shadow duration-300 h-full">
                <div className="flex space-x-4 h-full">
                    <LazyImage src={post.avatar} alt={post.author} className="w-10 h-10 rounded-full" wrapperClassName="w-10 h-10 rounded-full bg-light-border dark:bg-dark-border flex-shrink-0" loading="lazy" />
                    <div className="w-full min-w-0 flex flex-col">
                        <div>
                            <div className="flex justify-between items-start">
                                <div className="flex items-center space-x-2 text-sm flex-wrap">
                                    <span className="font-bold text-slate-900 dark:text-white truncate">{post.author}</span>
                                    <span className="text-slate-800 dark:text-slate-300 truncate">{post.handle}</span>
                                    <span className="text-slate-800 hidden sm:inline">·</span>
                                    <span className="text-slate-800 flex-shrink-0">{timeAgo}</span>
                                </div>
                                <a href={post.link} target="_blank" rel="noopener noreferrer" className="text-slate-400 hover:text-sky-500 ml-2 flex-shrink-0 transition-colors">
                                <XIcon className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        <div className="flex-grow">
                            <p className="text-slate-900 dark:text-slate-200 mt-2 whitespace-pre-wrap break-words">{post.content}</p>
                            {post.media && (
                                <div className="mt-4 rounded-xl border border-light-border dark:border-dark-border overflow-hidden aspect-video bg-slate-200 dark:bg-dark-border">
                                    <LazyImage src={post.media} alt="Post media" className="w-full h-full object-cover" wrapperClassName="w-full h-full" loading="lazy" />
                                </div>
                            )}
                        </div>

                        <div className="flex justify-start space-x-8 items-center text-slate-800 dark:text-slate-400 mt-4 text-sm">
                            <m.div whileHover={{ scale: 1.1, color: '#60A5FA' }} transition={{ type: 'spring', stiffness: 400, damping: 10 }} className="flex items-center space-x-1.5 cursor-pointer"><MessageSquareIcon className="w-4 h-4" /> <span>{post.comments}</span></m.div>
                            <m.div whileHover={{ scale: 1.1, color: '#4ADE80' }} transition={{ type: 'spring', stiffness: 400, damping: 10 }} className="flex items-center space-x-1.5 cursor-pointer"><RepeatIcon className="w-4 h-4" /> <span>{post.shares}</span></m.div>
                            <m.div whileHover={{ scale: 1.1, color: '#EC4899' }} transition={{ type: 'spring', stiffness: 400, damping: 10 }} className="flex items-center space-x-1.5 cursor-pointer"><HeartIcon className="w-4 h-4" /> <span>{post.likes}</span></m.div>
                        </div>
                    </div>
                </div>
            </Card>
        </m.div>
    );
});

export default TweetCard;