

import React, { useState, useEffect } from 'react';
import { Project, Review } from '../../data/projects';
import { StarIcon, XLogo, DiscordIcon, GlobeAltIcon, GitHubIcon } from '../Icons';

// Star Rating Component (Internal)
const StarRating: React.FC<{ rating: number, setRating: (rating: number) => void, disabled?: boolean }> = ({ rating, setRating, disabled }) => {
    const [hoverRating, setHoverRating] = useState(0);
    return (
        <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
            <svg
                key={star}
                onClick={() => !disabled && setRating(star)}
                onMouseEnter={() => !disabled && setHoverRating(star)}
                onMouseLeave={() => !disabled && setHoverRating(0)}
                className={`w-6 h-6 transition-colors ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} ${
                    (hoverRating || rating) >= star ? 'text-yellow-400' : 'text-gray-600'
                }`}
                fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
            </svg>
        ))}
        </div>
    );
};

// Social Link Component (Internal)
const SocialLink: React.FC<{ href: string; icon: React.ReactNode; text: string }> = ({ href, icon, text }) => (
    <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 bg-indigo-950/40 border border-blue-900/50 text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-indigo-950/80 hover:text-white hover:border-blue-800/80 transition-all duration-300"
    >
        {icon}
        <span>{text}</span>
    </a>
);


interface ProjectModalProps {
  project: Project;
  onClose: () => void;
  onAddReview: (projectId: number, review: Omit<Review, 'id' | 'avatar'>) => Promise<void>;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  user: { address: string } | null;
  onAuthRequired: (action: () => void) => void;
}

const ProjectModal: React.FC<ProjectModalProps> = ({ project, onClose, onAddReview, isFavorite, onToggleFavorite, user, onAuthRequired }) => {
    const [isClosing, setIsClosing] = useState(false);
    const [rating, setRating] = useState(0);
    const [author, setAuthor] = useState('');
    const [comment, setComment] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        document.body.style.overflow = 'hidden';
        return () => {
          document.body.style.overflow = 'auto';
        };
      }, []);

    const handleClose = () => {
        setIsClosing(true);
        setTimeout(onClose, 300);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const reviewData = {
            author: user ? `${user.address.slice(0, 6)}...${user.address.slice(-4)}` : author,
            rating,
            comment
        };
        
        if (rating === 0) {
            setError('Please select a star rating.');
            return;
        }
        if (!comment.trim()) {
            setError('Please fill in your comment.');
            return;
        }

        setError('');
        setIsSubmitting(true);
        try {
            await onAddReview(project.id, reviewData);
            setRating(0);
            setComment('');
        } catch (error) {
            setError('Failed to submit review. Please try again.');
        } finally {
            setIsSubmitting(false);
        }
    }

    const handleFavoriteClick = () => {
        onAuthRequired(() => {
            onToggleFavorite();
        });
    };

  return (
    <div className={`fixed inset-0 z-50 flex items-center justify-center transition-opacity duration-300 ${isClosing ? 'opacity-0' : 'opacity-100'}`}>
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={handleClose}></div>
      <div className={`relative bg-gray-900 w-full max-w-4xl max-h-[90vh] rounded-2xl overflow-hidden shadow-2xl shadow-blue-500/20 flex flex-col transition-transform duration-300 ${isClosing ? 'scale-95' : 'scale-100'}`}>
        <div className="h-48 md:h-64 relative">
          <img src={project.banner} alt={`${project.name} banner`} className="w-full h-full object-cover opacity-50" />
          <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent"></div>
          <button onClick={handleClose} className="absolute top-4 right-4 p-2 bg-black/50 rounded-full text-white hover:bg-black/80 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 md:p-8">
            <div className="flex flex-col sm:flex-row items-center text-center sm:text-left mt-4 sm:mt-6 mb-6 relative z-10">
                <div className="relative flex-shrink-0">
                    <img
                        src={project.logo}
                        alt={`${project.name} logo`}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-gray-800 bg-gray-900 sm:mr-6"
                    />
                </div>
                <div className="min-w-0 flex-1 w-full mt-4 sm:mt-0">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-3 sm:gap-0">
                        <div className="min-w-0">
                            <h2 className="font-display text-3xl sm:text-4xl font-bold text-white leading-tight break-words">
                                {project.name}
                            </h2>
                            <p className="text-gray-400 text-base sm:text-lg mt-1">{project.tagline}</p>
                        </div>

                        <button
                            onClick={handleFavoriteClick}
                            aria-label={isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                            className="p-3 bg-black/30 backdrop-blur-sm rounded-full text-gray-400 hover:text-yellow-400 transition-all duration-200 flex-shrink-0"
                        >
                            <StarIcon
                                className={`w-7 h-7 transition-colors ${isFavorite ? 'text-yellow-400' : ''}`}
                                solid={isFavorite}
                            />
                        </button>
                    </div>
                </div>
            </div>


            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8 text-center">
                <div className="bg-indigo-950/30 p-4 rounded-lg"><div className="text-sm text-gray-400">TVL</div><div className="text-2xl font-bold text-white">{project.stats.tvl}</div></div>
                <div className="bg-indigo-950/30 p-4 rounded-lg"><div className="text-sm text-gray-400">Users</div><div className="text-2xl font-bold text-white">{project.stats.users}</div></div>
                <div className="bg-indigo-950/30 p-4 rounded-lg"><div className="text-sm text-gray-400">Volume (24h)</div><div className="text-2xl font-bold text-white">{project.stats.volume}</div></div>
            </div>
            
            <p className="text-gray-300 mb-8">{project.description}</p>
            
            <div className="mb-8">
                <h3 className="font-display text-lg font-bold text-white mb-3">Official Links</h3>
                <div className="flex flex-wrap gap-4">
                    {project.url && <SocialLink href={project.url} icon={<GlobeAltIcon className="w-5 h-5"/>} text="Website" />}
                    {project.twitter && <SocialLink href={project.twitter} icon={<XLogo className="w-5 h-5"/>} text="X (Twitter)" />}
                    {project.discord && <SocialLink href={project.discord} icon={<DiscordIcon className="w-5 h-5"/>} text="Discord" />}
                    {project.github && <SocialLink href={project.github} icon={<GitHubIcon className="w-5 h-5"/>} text="GitHub" />}
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                    <h3 className="font-display text-2xl font-bold text-white mb-4">Leave a Review</h3>
                    <div className="relative">
                        {!user && (
                            <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm z-10 rounded-lg flex flex-col items-center justify-center text-center p-4">
                                <h4 className="font-display font-bold text-white text-lg">Want to leave a review?</h4>
                                <p className="text-gray-400 text-sm mb-4">Connect your wallet to share your thoughts with the community.</p>
                                <button onClick={() => onAuthRequired(() => {})} className="bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-500 transition-all duration-300">
                                    Connect Wallet to Review
                                </button>
                            </div>
                        )}
                        <form onSubmit={(e) => onAuthRequired(() => handleSubmit(e))} className={`space-y-4 ${!user ? 'filter blur-sm' : ''}`}>
                            <div>
                                <label className="text-sm font-semibold text-gray-400">Your Rating</label>
                                <StarRating rating={rating} setRating={setRating} disabled={!user || isSubmitting} />
                            </div>
                             <div>
                                <label htmlFor="comment" className="text-sm font-semibold text-gray-400">Comment</label>
                                <textarea id="comment" value={comment} onChange={e => setComment(e.target.value)} rows={3} disabled={!user || isSubmitting} className="w-full mt-1 bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50" />
                            </div>
                            {error && <p className="text-sm text-red-400">{error}</p>}
                            <button type="submit" disabled={!user || isSubmitting} className="w-full bg-blue-600 text-white font-semibold py-2 px-5 rounded-lg hover:bg-blue-500 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center">
                                {isSubmitting ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Submitting...
                                    </>
                                ) : "Submit Review"}
                            </button>
                        </form>
                    </div>
                </div>
                <div>
                    <h3 className="font-display text-2xl font-bold text-white mb-4">Community Reviews ({project.reviews.length})</h3>
                    <div className="space-y-4 max-h-80 overflow-y-auto pr-2">
                        {project.reviews.length > 0 ? project.reviews.map(review => (
                            <div key={review.id} className="bg-indigo-950/30 p-4 rounded-lg">
                                <div className="flex items-start">
                                    <img src={review.avatar} alt={review.author} className="w-10 h-10 rounded-full mr-4" />
                                    <div className="flex-1">
                                        <div className="flex justify-between items-center">
                                            <p className="font-bold text-white">{review.author}</p>
                                            <div className="flex text-yellow-400">
                                                {[...Array(review.rating)].map((_,i) => <svg key={i} className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                                                {[...Array(5-review.rating)].map((_,i) => <svg key={i} className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
                                            </div>
                                        </div>
                                        <p className="text-gray-400 mt-2 text-sm">"{review.comment}"</p>
                                    </div>
                                </div>
                            </div>
                        )) : <p className="text-gray-500 text-center py-8">No reviews yet. Be the first!</p>}
                    </div>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectModal;