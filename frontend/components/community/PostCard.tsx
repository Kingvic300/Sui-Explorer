import React, { useState, useEffect } from 'react';
import { Post } from '../../data/communityPosts';
import { formatDistanceToNow } from 'date-fns';
import { HeartIcon, ChatBubbleLeftIcon, ArrowPathRoundedSquareIcon, ArrowTopRightOnSquareIcon, XLogo, GlobeAltIcon } from '../Icons';

interface PostCardProps {
    post: Post;
    index: number;
}

const PostCard: React.FC<PostCardProps> = ({ post, index }) => {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), index * 100);
        return () => clearTimeout(timer);
      }, [index]);
    
    const timeAgo = formatDistanceToNow(new Date(post.timestamp), { addSuffix: true });

    const getPlatformIcon = (platform: 'x' | 'web') => {
        switch (platform) {
            case 'x':
                return <XLogo className="w-5 h-5 text-gray-500" />;
            case 'web':
                return <GlobeAltIcon className="w-5 h-5 text-gray-500" />;
            default:
                return null;
        }
    };

    const Stat: React.FC<{ icon: React.ReactNode; count: number; "aria-label": string }> = ({ icon, count, ...props }) => (
        <div className="flex items-center gap-2 text-gray-500" {...props}>
            {icon}
            <span className="text-sm font-semibold tabular-nums">{count > 0 ? count.toLocaleString() : ''}</span>
        </div>
    );

    return (
        <a 
            href={post.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`block bg-indigo-950/20 p-6 rounded-2xl border border-blue-900/50 transition-all duration-500 ease-out hover:border-blue-700/80 hover:bg-indigo-950/40 focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}
        >
            <div className="flex items-start gap-4">
                <img src={post.avatar} alt={post.author} className="w-12 h-12 rounded-full" />
                <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline gap-2 flex-wrap min-w-0">
                            <p className="font-bold text-white text-lg truncate">{post.author}</p>
                            <p className="text-gray-500 truncate">{post.handle}</p>
                            <span className="text-gray-600 hidden sm:inline">·</span>
                            <p className="text-gray-500 text-sm flex-shrink-0">{timeAgo}</p>
                        </div>
                        <div className="flex-shrink-0 ml-2">
                           {getPlatformIcon(post.platform)}
                        </div>
                    </div>
                    <p className="text-gray-300 mt-1 whitespace-pre-wrap">{post.content}</p>

                    {post.media && (
                        <div className="mt-4 rounded-xl border border-blue-900/50 overflow-hidden">
                            <img src={post.media} alt="Post media" className="w-full h-auto object-cover" />
                        </div>
                    )}

                    <div className="mt-4 flex items-center justify-between text-gray-400 pointer-events-none">
                        <div className="flex items-center gap-6">
                            <Stat 
                                icon={<ChatBubbleLeftIcon className="w-5 h-5" />} 
                                count={post.comments} 
                                aria-label={`${post.comments.toLocaleString()} comments`}
                            />
                            <Stat 
                                icon={<ArrowPathRoundedSquareIcon className="w-5 h-5" />} 
                                count={post.shares} 
                                aria-label={`${post.shares.toLocaleString()} shares`}
                            />
                            <Stat 
                                icon={<HeartIcon className="w-5 h-5" />} 
                                count={post.likes} 
                                aria-label={`${post.likes.toLocaleString()} likes`}
                            />
                        </div>
                        <ArrowTopRightOnSquareIcon className="w-5 h-5 text-gray-600" />
                    </div>
                </div>
            </div>
        </a>
    );
};

export default PostCard;