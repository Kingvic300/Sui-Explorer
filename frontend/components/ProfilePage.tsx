
import React, { useMemo, useState } from 'react';
import { Project, Review } from '../data/projects';
import ProjectCard from './dashboard/ProjectCard';
import { StarIcon, UsersIcon } from './Icons';
import ProjectCardSkeleton from './dashboard/ProjectCardSkeleton';
import { format } from 'date-fns';

interface ProfilePageProps {
    user: { address: string } | null;
    projects: Project[];
    favoriteProjectIds: Set<number>;
    onSelectProject: (project: Project) => void;
    onToggleFavorite: (projectId: number) => void;
    onAuthRequired: (action: () => void) => void;
    isLoading: boolean;
}

const UserReviewCard: React.FC<{ project: Project; review: Review, index: number }> = ({ project, review, index }) => {
    const [isVisible, setIsVisible] = useState(false);

    React.useEffect(() => {
        const timer = setTimeout(() => setIsVisible(true), index * 100);
        return () => clearTimeout(timer);
    }, [index]);

    return (
        <div className={`bg-indigo-950/20 p-5 rounded-2xl border border-blue-900/50 transition-all duration-500 ease-out ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'}`}>
            <div className="flex items-center gap-3 mb-3">
                <img src={project.logo} alt={project.name} className="w-8 h-8 rounded-full" />
                <h4 className="font-bold text-white text-lg">{project.name}</h4>
                <span className="text-xs font-semibold bg-blue-500/20 text-blue-300 px-2 py-1 rounded-full">{project.category}</span>
            </div>
            <div className="flex items-center justify-between mb-2">
                <div className="flex text-yellow-400">
                    {[...Array(review.rating)].map((_,i) => <StarIcon key={`s-${i}`} className="w-5 h-5" solid />)}
                    {[...Array(5-review.rating)].map((_,i) => <StarIcon key={`e-${i}`} className="w-5 h-5 text-gray-600" />)}
                </div>
                <p className="text-xs text-gray-500">{format(new Date(review.id), 'MMMM d, yyyy')}</p>
            </div>
            <p className="text-gray-300 italic">"{review.comment}"</p>
        </div>
    );
}


const ProfilePage: React.FC<ProfilePageProps> = ({ user, projects, favoriteProjectIds, onSelectProject, onToggleFavorite, onAuthRequired, isLoading }) => {
    const [isCopied, setIsCopied] = useState(false);
    
    const favoriteProjects = useMemo(() => 
        projects.filter(p => favoriteProjectIds.has(p.id)), 
        [projects, favoriteProjectIds]
    );

    const userReviews = useMemo(() => {
        if (!user) return [];
        const authorId = `${user.address.slice(0, 6)}...${user.address.slice(-4)}`;
        const foundReviews: { project: Project; review: Review }[] = [];
        projects.forEach(project => {
            project.reviews.forEach(review => {
                if (review.author === authorId) {
                    foundReviews.push({ project, review });
                }
            });
        });
        return foundReviews.sort((a, b) => b.review.id - a.review.id); // Sort by most recent review
    }, [user, projects]);

    const handleCopyAddress = () => {
        if (user) {
            navigator.clipboard.writeText(user.address);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
        }
    };
    
    if (!user) {
        // This should not happen if routed correctly, but as a fallback
        return (
            <div className="min-h-screen pt-32 pb-12 flex items-center justify-center">
                <p className="text-lg text-gray-500">Please connect your wallet to view your profile.</p>
            </div>
        );
    }
    
    const renderSkeletons = (count: number) => (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {Array.from({ length: count }).map((_, index) => <ProjectCardSkeleton key={index} />)}
        </div>
    );

    return (
        <section className={`min-h-screen pt-32 pb-12`}>
            <div className="container mx-auto px-6">
                <div className="mb-12">
                    <div className="flex items-center gap-4">
                        <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-blue-500 rounded-full flex items-center justify-center shadow-lg">
                           <UsersIcon className="w-8 h-8 text-white" />
                        </div>
                        <div>
                            <h1 className="font-display text-4xl md:text-5xl font-bold text-white">My Profile</h1>
                            <div className="flex items-center gap-2 mt-2">
                                <p className="text-gray-400 font-mono text-sm break-all">{user.address}</p>
                                <button 
                                    onClick={handleCopyAddress} 
                                    className="relative text-gray-500 hover:text-white transition-colors"
                                    aria-label="Copy wallet address"
                                >
                                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                    {isCopied && <span className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-2 py-1 bg-green-500 text-white text-xs rounded-md animate-fade-in-down">Copied!</span>}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-16">
                    <h2 className="font-display text-3xl font-bold text-white mb-6">My Favorites ({favoriteProjects.length})</h2>
                    {isLoading ? (
                        renderSkeletons(4)
                    ) : favoriteProjects.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {favoriteProjects.map((project, index) => (
                                <ProjectCard 
                                    key={project.id} 
                                    project={project} 
                                    index={index} 
                                    onSelect={() => onSelectProject(project)}
                                    isFavorite={true}
                                    onToggleFavorite={() => onToggleFavorite(project.id)}
                                    user={user}
                                    onAuthRequired={onAuthRequired}
                                />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-indigo-950/20 rounded-2xl border border-dashed border-blue-900/50">
                            <StarIcon className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <h3 className="font-display font-bold text-white text-xl">No Favorites Yet</h3>
                            <p className="text-gray-500 mt-1">Click the star on any project to add it here.</p>
                        </div>
                    )}
                </div>

                <div>
                    <h2 className="font-display text-3xl font-bold text-white mb-6">My Reviews ({userReviews.length})</h2>
                    {isLoading ? (
                        <p className="text-gray-500">Loading reviews...</p>
                    ) : userReviews.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {userReviews.map(({ project, review }, index) => (
                                <UserReviewCard key={review.id} project={project} review={review} index={index} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12 bg-indigo-950/20 rounded-2xl border border-dashed border-blue-900/50">
                            <svg className="w-12 h-12 text-gray-600 mx-auto mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.76 9.76 0 01-2.53-.375l-4.5 1.5a.5.5 0 01-.625-.625l1.5-4.5A9.76 9.76 0 013 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z" /></svg>
                            <h3 className="font-display font-bold text-white text-xl">No Reviews Submitted</h3>
                            <p className="text-gray-500 mt-1">Your reviews will appear here once you've submitted them on a project's detail page.</p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};

export default ProfilePage;
