

import React, { useState, useMemo, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { formatDistanceToNow } from 'date-fns';
// FIX: Corrected import path for Review type.
import { Review } from '../../types/index';
import { StarIcon, ThumbsUpIcon, ThumbsDownIcon, ShieldCheckIcon, MessageSquareIcon } from '../icons/MiscIcons';
import { useToastStore } from '../../stores/useToastStore';
import { useWalletStore } from '../../stores/useWalletStore';
import Card from '../ui/Card';
import Button from '../ui/Button';
import LazyImage from '../ui/LazyImage';
import { itemVariants, staggerContainer } from '../../utils/animations';

type SortByType = 'recent' | 'helpful';

// --- Helper Components ---

const StarRating: React.FC<{
    rating: number;
    setRating?: (rating: number) => void;
    interactive?: boolean;
    size?: 'sm' | 'md' | 'lg';
}> = ({ rating, setRating, interactive = false, size = 'md' }) => {
    const [hoverRating, setHoverRating] = useState(0);
    const sizeClasses = { sm: 'w-4 h-4', md: 'w-5 h-5', lg: 'w-6 h-6' };

    const handleRating = (rate: number) => {
        if (interactive && setRating) {
            setRating(rate);
        }
    };

    return (
        <div className="flex items-center gap-0.5">
            {[...Array(5)].map((_, i) => {
                const starValue = i + 1;
                const starRating = hoverRating || rating;
                return (
                    <button
                        key={i}
                        type="button"
                        disabled={!interactive}
                        onClick={() => handleRating(starValue)}
                        onMouseEnter={() => interactive && setHoverRating(starValue)}
                        onMouseLeave={() => interactive && setHoverRating(0)}
                        className={`${interactive ? 'cursor-pointer' : 'cursor-default'} transition-transform duration-200 ${interactive && 'hover:scale-125'}`}
                        aria-label={`Rate ${starValue} star${starValue > 1 ? 's' : ''}`}
                    >
                        <StarIcon
                            className={`${sizeClasses[size]} transition-colors ${
                                starValue <= starRating
                                ? 'text-yellow-400 fill-yellow-400'
                                : 'text-slate-300 dark:text-slate-600'
                            }`}
                        />
                    </button>
                );
            })}
        </div>
    );
};

const ReviewCard: React.FC<{ review: Review }> = ({ review }) => {
    const [helpful, setHelpful] = useState(review.helpful);
    const [voted, setVoted] = useState<'yes' | 'no' | null>(null);

    const handleVote = (type: 'yes' | 'no') => {
        if (voted === type) return; // Allow only one vote
        
        const newHelpful = { ...helpful };
        if (voted) { // User is changing their vote
            newHelpful[voted]--;
        }
        newHelpful[type]++;

        setHelpful(newHelpful);
        setVoted(type);
    }
    
    return (
        <m.div variants={itemVariants} className="py-6 border-b border-light-border dark:border-dark-border/60 last:border-b-0">
            <div className="flex items-start gap-4">
                <LazyImage
                    src={review.author.avatar}
                    alt={review.author.name}
                    wrapperClassName="w-10 h-10 rounded-full bg-light-border dark:bg-dark-border flex-shrink-0"
                />
                <div className="flex-1">
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="flex items-center gap-2">
                                <p className="font-semibold text-slate-800 dark:text-slate-100">{review.author.name}</p>
                                {review.author.isVerified && (
                                    <ShieldCheckIcon className="w-4 h-4 text-accent-blue" title="Verified Developer" />
                                )}
                            </div>
                            <StarRating rating={review.rating} size="sm" />
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 flex-shrink-0">{formatDistanceToNow(new Date(review.timestamp), { addSuffix: true })}</p>
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-white mt-3">{review.title}</h4>
                    <p className="text-slate-700 dark:text-slate-300 text-sm mt-1 whitespace-pre-wrap leading-relaxed">{review.content}</p>

                    <div className="flex items-center gap-4 mt-4">
                        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Was this helpful?</p>
                        <div className="flex items-center gap-3">
                            <button onClick={() => handleVote('yes')} className={`flex items-center gap-1.5 p-1 rounded-md transition-colors ${voted === 'yes' ? 'text-green-500 bg-green-500/10' : 'hover:bg-slate-200 dark:hover:bg-dark-border'}`}>
                                <ThumbsUpIcon className="w-4 h-4" />
                                <span className="text-xs font-semibold">{helpful.yes}</span>
                            </button>
                             <button onClick={() => handleVote('no')} className={`flex items-center gap-1.5 p-1 rounded-md transition-colors ${voted === 'no' ? 'text-red-500 bg-red-500/10' : 'hover:bg-slate-200 dark:hover:bg-dark-border'}`}>
                                <ThumbsDownIcon className="w-4 h-4" />
                                <span className="text-xs font-semibold">{helpful.no}</span>
                            </button>
                        </div>
                    </div>
                    {review.reply && (
                        <div className="mt-4 p-4 rounded-lg bg-slate-100 dark:bg-dark-border/40 border border-light-border dark:border-dark-border/60">
                            <p className="text-sm font-bold text-slate-800 dark:text-white flex items-center gap-2">{review.reply.author}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{formatDistanceToNow(new Date(review.reply.timestamp), { addSuffix: true })}</p>
                            <p className="text-sm text-slate-700 dark:text-slate-300 whitespace-pre-wrap">{review.reply.content}</p>
                        </div>
                    )}
                </div>
            </div>
        </m.div>
    );
};

const ReviewForm: React.FC<{
    projectName: string;
    onAddReview: (review: Review) => void;
    onCancel: () => void;
}> = ({ projectName, onAddReview, onCancel }) => {
    const [rating, setRating] = useState(0);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [errors, setErrors] = useState<{ [key: string]: string }>({});
    const addToast = useToastStore(state => state.addToast);

    const handleSubmit = () => {
        const newErrors: { [key: string]: string } = {};
        if (rating === 0) newErrors.rating = 'Please select a rating.';
        if (!title.trim()) newErrors.title = 'Please enter a title.';
        if (!content.trim()) newErrors.content = 'Please write a review.';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        const newReview: Review = {
            id: Date.now(),
            author: { name: 'New User', avatar: `https://i.pravatar.cc/150?u=${Date.now()}` },
            rating,
            title,
            content,
            timestamp: new Date().toISOString(),
            helpful: { yes: 0, no: 0 },
        };
        onAddReview(newReview);
        addToast({ type: 'success', title: 'Review Submitted!', message: `Thanks for sharing your feedback on ${projectName}.` });
        onCancel();
    };

    return (
         <m.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
            <div className="p-6 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border space-y-4">
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">Write a review for {projectName}</h3>
                <div>
                    <label className="font-semibold text-sm text-slate-700 dark:text-slate-300">Your Rating*</label>
                    <StarRating rating={rating} setRating={setRating} interactive size="lg" />
                    {errors.rating && <p className="text-xs text-red-500 mt-1">{errors.rating}</p>}
                </div>
                <div>
                    <label htmlFor="review-title" className="font-semibold text-sm text-slate-700 dark:text-slate-300">Review Title*</label>
                    <input id="review-title" value={title} onChange={e => setTitle(e.target.value)} type="text" placeholder="e.g., A Game-Changer for DeFi" className="w-full mt-1 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border/80 rounded-md p-2 focus:ring-accent-blue focus:border-accent-blue" />
                    {errors.title && <p className="text-xs text-red-500 mt-1">{errors.title}</p>}
                </div>
                <div>
                    <label htmlFor="review-content" className="font-semibold text-sm text-slate-700 dark:text-slate-300">Your Review*</label>
                    <textarea id="review-content" value={content} onChange={e => setContent(e.target.value)} rows={4} placeholder="Tell us about your experience..." className="w-full mt-1 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border/80 rounded-md p-2 focus:ring-accent-blue focus:border-accent-blue" />
                    {errors.content && <p className="text-xs text-red-500 mt-1">{errors.content}</p>}
                </div>
                <div className="flex justify-end gap-3">
                    <Button variant="secondary" onClick={onCancel}>Cancel</Button>
                    <Button variant="primary" onClick={handleSubmit}>Submit Review</Button>
                </div>
            </div>
        </m.div>
    );
};

// --- Main Component ---

const ProjectReviewsSection: React.FC<{ reviews: Review[] | undefined; projectName: string; projectId: number }> = ({ reviews: initialReviews = [], projectName, projectId }) => {
    const { isConnected, connectWallet } = useWalletStore();
    const [reviews, setReviews] = useState(initialReviews);
    const [sortBy, setSortBy] = useState<SortByType>('helpful');
    const [isWriting, setIsWriting] = useState(false);
    const addToast = useToastStore(state => state.addToast);

    // Update reviews if props change (e.g., navigating between project pages)
    useEffect(() => {
        setReviews(initialReviews);
    }, [initialReviews]);

    const handleWriteReviewClick = () => {
        if (!isConnected) {
            connectWallet();
            addToast({ type: 'info', title: 'Connect Wallet', message: 'Please connect your wallet to leave a review.'});
        } else {
            setIsWriting(true);
        }
    };
    
    const sortedReviews = useMemo(() => {
        return [...reviews].sort((a, b) => {
            if (sortBy === 'recent') {
                return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
            }
            if (sortBy === 'helpful') {
                return (b.helpful.yes - b.helpful.no) - (a.helpful.yes - a.helpful.no);
            }
            return 0;
        });
    }, [reviews, sortBy]);

    const reviewSummary = useMemo(() => {
        if (reviews.length === 0) {
            return {
                average: 0,
                total: 0,
                // FIX: Changed from an array of numbers to an empty array to match the type of the populated distribution, resolving a map error.
                distribution: [],
            };
        }
        const total = reviews.length;
        const sum = reviews.reduce((acc, r) => acc + r.rating, 0);
        const average = sum / total;
        const distribution = [5, 4, 3, 2, 1].map(star => {
            const count = reviews.filter(r => r.rating === star).length;
            return { star, count, percentage: total > 0 ? (count / total) * 100 : 0 };
        });
        return { average, total, distribution };
    }, [reviews]);
    
    if (!initialReviews || initialReviews.length === 0) {
        return (
            <Card className="text-center">
                <MessageSquareIcon className="w-12 h-12 mx-auto text-slate-400 dark:text-slate-500" />
                <h3 className="mt-4 text-xl font-bold">No Reviews Yet</h3>
                <p className="mt-1 text-slate-700 dark:text-slate-300">Be the first to share your thoughts on {projectName}.</p>
                <Button variant="primary" className="mt-4" onClick={handleWriteReviewClick}>Write a Review</Button>
            </Card>
        );
    }

    return (
        <Card>
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left: Summary */}
                <div className="lg:col-span-1 lg:border-r lg:border-light-border dark:lg:border-dark-border lg:pr-8">
                    <h3 className="font-bold text-xl text-slate-800 dark:text-white">Community Reviews</h3>
                    <div className="flex items-center gap-2 mt-2">
                        <p className="font-display text-4xl font-bold text-slate-800 dark:text-white">{reviewSummary.average.toFixed(1)}</p>
                        <div>
                            <StarRating rating={reviewSummary.average} />
                            <p className="text-xs text-slate-500 dark:text-slate-400">based on {reviewSummary.total} reviews</p>
                        </div>
                    </div>
                    <div className="space-y-2 mt-4">
                        {reviewSummary.distribution.map(({ star, count, percentage }) => (
                            <div key={star} className="flex items-center gap-2 text-sm">
                                <span className="font-medium text-slate-500 dark:text-slate-400">{star} star</span>
                                <div className="w-full bg-slate-200 dark:bg-dark-border rounded-full h-2">
                                    <div className="bg-yellow-400 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                                </div>
                                <span className="font-medium text-slate-500 dark:text-slate-400 w-8 text-right">{count}</span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Right: Form & List */}
                <div className="lg:col-span-2">
                    <div className="flex flex-col sm:flex-row justify-between items-baseline mb-4">
                        <div className="flex items-center gap-2 text-sm mb-4 sm:mb-0">
                            <span className="font-semibold text-slate-500 dark:text-slate-400">Sort by:</span>
                            <button onClick={() => setSortBy('helpful')} className={`font-bold ${sortBy === 'helpful' ? 'text-accent-blue' : 'text-slate-600 dark:text-slate-300'}`}>Most Helpful</button>
                            <span className="text-slate-300 dark:text-slate-600">|</span>
                             <button onClick={() => setSortBy('recent')} className={`font-bold ${sortBy === 'recent' ? 'text-accent-blue' : 'text-slate-600 dark:text-slate-300'}`}>Most Recent</button>
                        </div>
                        <Button variant="outline" onClick={handleWriteReviewClick} disabled={isWriting}>
                            Write a Review
                        </Button>
                    </div>

                    <AnimatePresence>
                        {isWriting && (
                            <ReviewForm 
                                projectName={projectName} 
                                onCancel={() => setIsWriting(false)}
                                onAddReview={(newReview) => {
                                    setReviews(prev => [newReview, ...prev]);
                                    setIsWriting(false);
                                }} 
                            />
                        )}
                    </AnimatePresence>

                    <div className="mt-4">
                        <AnimatePresence mode="popLayout">
                            <m.div layout variants={staggerContainer} initial="hidden" animate="visible">
                                {sortedReviews.map(review => (
                                    <ReviewCard key={review.id} review={review} />
                                ))}
                            </m.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </Card>
    );
};

export default ProjectReviewsSection;