import React, { useState, useEffect, useMemo } from 'react';
import { tweetsData, Tweet } from '../../data/tweets';
import { XLogo } from '../Icons';

const TweetCard: React.FC<{ tweet: Tweet }> = ({ tweet }) => {
    return (
        <div
            className="flex-shrink-0 bg-indigo-950/40 p-5 rounded-2xl border border-blue-900/50 w-[350px] h-full flex flex-col justify-between card-glow-border mx-4"
        >
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <img src={tweet.avatar} alt={tweet.name} className="w-12 h-12 rounded-full mr-3 border-2 border-gray-700" />
                        <div>
                            <p className="font-bold text-white leading-tight">{tweet.name}</p>
                            <p className="text-sm text-blue-400 leading-tight">{tweet.handle}</p>
                        </div>
                    </div>
                    <XLogo className="w-6 h-6 text-gray-500" />
                </div>
                <p className="text-gray-300 text-sm leading-relaxed">
                    {tweet.text}
                </p>
            </div>
        </div>
    );
};

const LiveFeed: React.FC = () => {
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        setIsLoading(true);
        // Use dummy data directly for the live feed to ensure reliability
        setTimeout(() => {
            setTweets(tweetsData);
            setIsLoading(false);
        }, 500);
    }, []);

    const duplicatedTweets = useMemo(() => {
        if (tweets.length === 0) return [];
        return [...tweets, ...tweets];
    }, [tweets]);

    return (
        <div className="py-12">
             <div className="flex items-center justify-between mb-6 container mx-auto px-6">
                <div className="flex items-center">
                    <span className="relative flex h-3 w-3 mr-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <h2 className="font-display text-2xl font-bold text-white">Ecosystem Buzz</h2>
                </div>
                <a href="https://x.com/SuiNetwork" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 transition-colors font-semibold">
                    <span>View on</span>
                    <XLogo className="w-4 h-4" />
                </a>
            </div>
            <div className="relative w-full overflow-hidden group [mask-image:linear-gradient(to_right,transparent,white_20%,white_80%,transparent)]">
                {isLoading ? (
                    <div className="flex justify-center items-center h-48">
                        <p className="text-gray-500">Loading feed...</p>
                    </div>
                ) : tweets.length > 0 ? (
                    <div className="flex animate-marquee group-hover:pause">
                        {duplicatedTweets.map((tweet, index) => (
                            <TweetCard key={`${tweet.id}-${index}`} tweet={tweet} />
                        ))}
                    </div>
                ) : (
                    <div className="flex justify-center items-center h-48">
                        <p className="text-gray-500">Live feed could not be loaded.</p>
                    </div>
                )}
            </div>
            <style>{`
                @keyframes marquee {
                    from { transform: translateX(0); }
                    to { transform: translateX(-50%); }
                }
                .animate-marquee {
                    animation: marquee 70s linear infinite;
                }
                .group:hover .animate-marquee {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
};

export default LiveFeed;
