

import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { m } from 'framer-motion';
import { useProject, useProjects } from '../hooks/queries/useProjects';
import { pageVariants, pageTransition, staggerContainer, itemVariants } from '../utils/animations';
import ProjectDetailSkeleton from '../components/ui/skeletons/ProjectDetailSkeleton';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';
import Breadcrumb from '../components/projects/Breadcrumb';
import ErrorState from '../components/ui/ErrorState';
import LazyImage from '../components/ui/LazyImage';
import { Project } from '../types/index';
import { TwitterIcon, DiscordIcon, GitHubIcon, GlobeIcon, StarIcon } from '../components/icons/MiscIcons';
import ProjectProductsCard from '../components/projects/ProjectProductsCard';
import UpdateCard from '../components/projects/UpdateCard';
import Magnetic from '../components/ui/Magnetic';
import { useProjectInteractionStore } from '../stores/useProjectInteractionStore';
import ProjectReviewsSection from '../components/projects/ProjectReviewsSection';

const ExpandableContent: React.FC<{ content: string }> = ({ content }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const paragraphs = content.split('\n').filter(p => p.trim() !== '');

    return (
        <div>
            <div className={`space-y-4 text-slate-900 dark:text-slate-200 leading-relaxed ${!isExpanded ? 'max-h-48 overflow-hidden relative' : ''}`}>
                {paragraphs.map((p, index) => <p key={index}>{p}</p>)}
                {!isExpanded && <div className="absolute bottom-0 left-0 w-full h-20 bg-gradient-to-t from-light-bg dark:from-dark-bg to-transparent" />}
            </div>
            <div className="text-center mt-4">
                <Button variant="secondary" onClick={() => setIsExpanded(!isExpanded)}>
                    {isExpanded ? 'Show less' : 'Show more'}
                </Button>
            </div>
        </div>
    );
};

const RelatedProjectCard: React.FC<{ project: Project }> = ({ project }) => (
    <Link to={`/projects/${project.id}`} className="block h-full group">
        <Card className="h-full !p-4">
            <div className="flex items-start gap-3">
                <LazyImage
                    src={project.logo}
                    alt={`${project.name} logo`}
                    wrapperClassName="w-12 h-12 rounded-lg bg-light-bg dark:bg-dark-bg border border-light-border dark:border-dark-border flex-shrink-0"
                    className="w-full h-full object-contain"
                />
                <div className="min-w-0">
                    <h4 className="font-bold text-slate-800 dark:text-slate-200 group-hover:text-accent-blue transition-colors">{project.name}</h4>
                    <p className="text-sm text-slate-800 dark:text-slate-300 line-clamp-2 mt-1">{project.tagline}</p>
                </div>
            </div>
            <div className="mt-3 pt-3 border-t border-light-border dark:border-dark-border flex flex-wrap gap-1.5">
                {(project.tags || []).slice(0, 2).map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full text-xs bg-slate-100 dark:bg-dark-border text-slate-800 dark:text-slate-300 font-medium">
                        {tag}
                    </span>
                ))}
            </div>
        </Card>
    </Link>
);


const ProjectDetailPage: React.FC = () => {
    const { projectId } = useParams<{ projectId: string }>();
    const numericProjectId = projectId ? parseInt(projectId, 10) : null;
    
    const { data: project, isLoading, isError, refetch } = useProject(numericProjectId);
    const { data: allProjects = [] } = useProjects();
    const { addRecentlyViewed, isFavorite, toggleFavorite } = useProjectInteractionStore();

    useEffect(() => {
        if (numericProjectId) {
            addRecentlyViewed(numericProjectId);
        }
    }, [numericProjectId, addRecentlyViewed]);

    const relatedProjects = useMemo(() => {
        if (!project || !project.relatedProjectIds) return [];
        return allProjects.filter(p => project.relatedProjectIds?.includes(p.id));
    }, [project, allProjects]);

    if (isLoading) {
        return <ProjectDetailSkeleton />;
    }

    if (isError) {
        return (
             <ErrorState 
                title="Could not load project"
                message="There was an issue fetching the project details. It may have been moved or the network is busy."
                onRetry={refetch}
            />
        );
    }
    
    if (!project) {
        return (
            <div className="text-center py-20">
                <h1 className="text-3xl font-bold">Project Not Found</h1>
                <p className="text-slate-500 mt-2">The project you're looking for couldn't be found.</p>
                <Link to="/projects" className="mt-6 inline-block">
                    <Button variant="primary">Back to Projects</Button>
                </Link>
            </div>
        );
    }

    const socialLinks = [
        { href: project.url, icon: GlobeIcon, name: 'Website' },
        { href: project.twitter, icon: TwitterIcon, name: 'Twitter' },
        { href: project.discord, icon: DiscordIcon, name: 'Discord' },
        { href: project.github, icon: GitHubIcon, name: 'GitHub' },
    ].filter(link => link.href);

    return (
        <m.div
            initial="initial"
            animate="in"
            exit="out"
            variants={pageVariants}
            transition={pageTransition}
            className="max-w-4xl mx-auto"
        >
            <m.div
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-10"
            >
                <m.div variants={itemVariants}>
                    <Breadcrumb project={project} />
                </m.div>

                <m.header variants={itemVariants} className="flex flex-col items-center">
                    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <LazyImage 
                            src={project.logo} 
                            alt={`${project.name} logo`}
                            wrapperClassName="w-24 h-24 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border p-2 flex-shrink-0"
                            className="w-full h-full object-contain"
                        />
                        <div className="flex-grow">
                            <span className="text-sm font-bold uppercase text-accent-blue tracking-widest">{project.category}</span>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mt-1">{project.name}</h1>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-center mt-4 sm:mt-0">
                            <Button
                                variant={isFavorite(project.id) ? 'secondary' : 'outline'}
                                className="!py-2.5"
                                onClick={() => toggleFavorite(project.id)}
                            >
                                <StarIcon className={`w-4 h-4 mr-2 transition-colors ${isFavorite(project.id) ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                                {isFavorite(project.id) ? 'Favorited' : 'Favorite'}
                            </Button>
                            <a href={project.url} target="_blank" rel="noopener noreferrer">
                                <Button variant="primary" className="w-full sm:w-auto !py-2.5">Visit Website</Button>
                            </a>
                        </div>
                    </div>
                    {project.products && project.products.length > 0 && (
                        <div className="mt-4">
                             <Button variant="secondary" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
                                View Packages
                            </Button>
                        </div>
                    )}
                    <p className="text-center text-slate-900 dark:text-slate-200 mt-6 max-w-2xl">{project.description}</p>
                    <div className="flex items-center space-x-3 mt-6">
                         {socialLinks.map(link => link.href && (
                          <Magnetic key={link.name}>
                            <a href={link.href} target="_blank" rel="noopener noreferrer" title={link.name} className="p-2.5 rounded-full text-slate-800 dark:text-slate-300 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border hover:text-accent-blue dark:hover:border-accent-blue transition-colors">
                              <link.icon className="w-5 h-5" />
                            </a>
                          </Magnetic>
                        ))}
                    </div>
                </m.header>

                <m.section variants={itemVariants}>
                    <ExpandableContent content={project.longDescription || project.description} />
                </m.section>

                <m.section variants={itemVariants} id="reviews">
                    <ProjectReviewsSection reviews={project.reviews} projectName={project.name} projectId={project.id} />
                </m.section>
                
                {project.products && project.products.length > 0 && (
                     <m.section variants={itemVariants} id="products">
                        <ProjectProductsCard products={project.products} projectId={project.id} />
                    </m.section>
                )}

                {project.updates && project.updates.length > 0 && (
                    <m.section variants={itemVariants} className="space-y-6">
                         <h2 className="text-3xl font-display font-bold text-center">Updates</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {project.updates.map(update => (
                                <UpdateCard key={update.id} update={update} />
                            ))}
                         </div>
                    </m.section>
                )}
                
                {relatedProjects.length > 0 && (
                    <m.section variants={itemVariants} className="space-y-6">
                         <h2 className="text-3xl font-display font-bold text-center">Projects Related to {project.name}</h2>
                         <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {relatedProjects.map(p => (
                                <RelatedProjectCard key={p.id} project={p} />
                            ))}
                         </div>
                    </m.section>
                )}

            </m.div>
        </m.div>
    );
};

export default ProjectDetailPage;