
import React, { useState } from 'react';
import { XLogo } from '../Icons';

interface ComposerProps {
    user: { address: string } | null;
    onAuthRequired: (action: () => void) => void;
}

const Composer: React.FC<ComposerProps> = ({ user, onAuthRequired }) => {
    const [content, setContent] = useState('');
    const MAX_CHARS = 280;

    const handleTweet = () => {
        if (content.trim()) {
            // Automatically add a hashtag to promote the ecosystem
            const tweetText = `${content} #Sui`;
            const text = encodeURIComponent(tweetText);
            window.open(`https://twitter.com/intent/tweet?text=${text}`, '_blank', 'noopener,noreferrer');
            setContent('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onAuthRequired(handleTweet);
    };

    if (!user) {
        return (
            <div className="bg-indigo-950/40 p-5 rounded-2xl border border-blue-900/50 text-center">
                <h3 className="font-display font-bold text-white text-lg">Share your thoughts on Sui.</h3>
                <p className="text-gray-400 text-sm mt-1 mb-4">Connect your wallet to post to X directly from the app.</p>
                <button 
                    onClick={() => onAuthRequired(() => {})}
                    className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105"
                >
                    Connect Wallet to Post
                </button>
            </div>
        );
    }

    return (
        <div className="bg-indigo-950/40 p-5 rounded-2xl border border-blue-900/50 card-glow-border">
            <form onSubmit={handleSubmit}>
                <textarea
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                    placeholder="What's happening? Post to X from here..."
                    maxLength={MAX_CHARS}
                    className="w-full bg-transparent text-lg text-gray-200 placeholder-gray-500 focus:outline-none resize-none"
                    rows={3}
                    aria-label="Tweet content"
                />
                <div className="flex justify-between items-center mt-3">
                    <p className="text-xs text-gray-500" title="Image uploads are not supported through this feature.">
                        Image uploads not supported.
                    </p>
                    <div className="flex items-center gap-4">
                        <span className="text-sm font-semibold text-gray-500">
                            {MAX_CHARS - content.length}
                        </span>
                        <button 
                            type="submit"
                            disabled={!content.trim()}
                            className="flex items-center gap-2 bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-500 transition-all duration-300 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100"
                        >
                            <XLogo className="w-4 h-4"/>
                            <span>Tweet</span>
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
};

export default Composer;