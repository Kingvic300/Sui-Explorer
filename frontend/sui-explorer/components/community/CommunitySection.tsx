import React, { useState, useEffect } from 'react';
import { tweetsData } from '../../data/tweets';
import { Tweet } from '../../types/index';
import { XIcon as XLogo, ShareIcon } from '../icons/MiscIcons';
import ParticleBackground from '../ui/ParticleBackground';

const TweetCard: React.FC<{ tweet: Tweet }> = ({ tweet }) => {
    const handleShare = (e: React.MouseEvent) => {
        e.stopPropagation();
        const via = "SuiExplorer";
        const hashtags = "Sui,SuiEcosystem";
        const shareText = `"${tweet.text}"`;
        // Estimate max length to avoid exceeding X's limit
        const maxTextLength = 280 - (tweet.link.length + via.length + hashtags.length + 20); 
        const truncatedText = shareText.length > maxTextLength ? `${shareText.substring(0, maxTextLength - 3)}...` : shareText;
    
        const intentUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(truncatedText)}&url=${encodeURIComponent(tweet.link)}&via=${via}&hashtags=${hashtags}`;
        window.open(intentUrl, '_blank', 'noopener,noreferrer');
    };

    return (
        <div
            className="bg-light-card dark:bg-dark-card p-5 rounded-2xl border border-light-border dark:border-dark-border w-full h-full flex flex-col justify-between"
        >
            <div>
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center">
                        <img src={tweet.avatar} alt={tweet.name} className="w-12 h-12 rounded-full mr-3 border-2 border-light-bg dark:border-dark-card" />
                        <div>
                            <p className="font-bold text-slate-900 dark:text-white leading-tight">{tweet.name}</p>
                            <p className="text-sm text-accent-blue dark:text-blue-400 leading-tight">{tweet.handle}</p>
                        </div>
                    </div>
                    <a href={tweet.link} target="_blank" rel="noopener noreferrer" className="text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors" onClick={(e) => e.stopPropagation()} aria-label={`View tweet by ${tweet.handle} on X`}>
                        <XLogo className="w-6 h-6" />
                    </a>
                </div>
                <p className="text-slate-900 dark:text-slate-200 text-sm leading-relaxed">
                    {tweet.text}
                </p>
            </div>
            <div className="mt-4 pt-4 border-t border-light-border dark:border-dark-border/40 flex items-center justify-end">
                <button
                    onClick={handleShare}
                    className="flex items-center gap-2 text-slate-800 dark:text-slate-300 hover:text-accent-blue dark:hover:text-blue-400 transition-colors duration-200"
                    aria-label="Share on X"
                >
                    <ShareIcon className="w-5 h-5" />
                    <span className="text-xs font-semibold">Share</span>
                </button>
            </div>
        </div>
    )
}

interface CommunitySectionProps {
    animatedBackgroundsEnabled: boolean;
}

const CommunitySection: React.FC<CommunitySectionProps> = ({ animatedBackgroundsEnabled }) => {
    const [tweets, setTweets] = useState<Tweet[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [activeIndex, setActiveIndex] = useState(0);

    useEffect(() => {
        setIsLoading(true);
        setTimeout(() => {
            setTweets(tweetsData.slice(0, 3));
            setIsLoading(false);
        }, 500);
    }, []);


    useEffect(() => {
        if (tweets.length === 0) return;
        const interval = setInterval(() => {
            setActiveIndex(current => (current + 1) % tweets.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [tweets]);

    const getTweetClass = (index: number) => {
        if (tweets.length === 0) return 'opacity-0';
        const isActive = index === activeIndex;
        const isPrev = index === (activeIndex - 1 + tweets.length) % tweets.length;

        if (isActive) return 'translate-y-0 opacity-100 z-10';
        if (isPrev) return '-translate-y-full opacity-0 z-0';
        return 'translate-y-full opacity-0 z-0';
    };

  return (
    <section id="community" className="relative py-16 lg:py-20 bg-light-card dark:bg-dark-card/50 transition-colors duration-300 rounded-xl my-12 overflow-hidden">
        {animatedBackgroundsEnabled && <ParticleBackground />}
        <div className="container mx-auto px-6 relative">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-6">
                Community Pulse
              </h2>
              <p className="text-lg text-slate-900 dark:text-slate-300 mb-8">
                Tap into the real-time conversation. See what developers, creators, and enthusiasts are saying across the Sui ecosystem right now.
              </p>
              <div className="flex -space-x-4">
                  <img className="inline-block h-14 w-14 rounded-full ring-2 ring-light-card dark:ring-black" src="https://i.pravatar.cc/150?u=a042581f4e29026701d" alt="User 1" />
                  <img className="inline-block h-14 w-14 rounded-full ring-2 ring-light-card dark:ring-black" src="https://i.pravatar.cc/150?u=a042581f4e29026702d" alt="User 2" />
                  <img className="inline-block h-14 w-14 rounded-full ring-2 ring-light-card dark:ring-black" src="https://i.pravatar.cc/150?u=a042581f4e29026703d" alt="User 3" />
                  <img className="inline-block h-14 w-14 rounded-full ring-2 ring-light-card dark:ring-black" src="https://i.pravatar.cc/150?u=a042581f4e29026706d" alt="User 4" />
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-accent-blue ring-2 ring-light-card dark:ring-black">
                      <span className="font-bold text-white">10k+</span>
                  </div>
              </div>
            </div>
            
            <div className="w-full">
                <div className="flex items-center mb-6">
                    <span className="relative flex h-3 w-3 mr-3">
                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                        <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                    </span>
                    <h3 className="font-display text-xl font-bold text-slate-900 dark:text-white">See What's Happening</h3>
                </div>

                <div className="relative h-[240px] w-full">
                    {isLoading ? (
                        <div className="w-full h-full flex items-center justify-center bg-light-bg dark:bg-dark-card p-5 rounded-2xl border border-light-border dark:border-dark-border">
                            <p className="text-slate-800 dark:text-slate-400">Loading posts...</p>
                        </div>
                    ) : (
                        tweets.map((tweet, index) => (
                            <div
                                key={tweet.id}
                                className={`absolute w-full h-full transition-all duration-700 ease-out ${getTweetClass(index)}`}
                            >
                                <TweetCard tweet={tweet} />
                            </div>
                        ))
                    )}
                </div>
            </div>
            
          </div>
        </div>
    </section>
  );
};

export default CommunitySection;