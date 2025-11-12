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
import { Project } from '@/types/index.ts';
import { TwitterIcon, DiscordIcon, GitHubIcon, GlobeIcon, StarIcon } from '../components/icons/MiscIcons';
import ProjectProductsCard from '../components/projects/ProjectProductsCard';
import UpdateCard from '../components/projects/UpdateCard';
import Magnetic from '../components/ui/Magnetic';
import { useProjectInteractionStore } from '../stores/useProjectInteractionStore';
import ProjectReviewsSection from '../components/projects/ProjectReviewsSection';

// Add type guard functions
const isProject = (data: unknown): data is Project => {
    return (
        typeof data === 'object' &&
        data !== null &&
        'id' in data &&
        'name' in data &&
        'tagline' in data &&
        'description' in data &&
        'category' in data &&
        'logo' in data &&
        'url' in data
    );
};

const isProjectArray = (data: unknown): data is Project[] => {
    return Array.isArray(data) && data.every(isProject);
};

// ExpandableContent Component
interface ExpandableContentProps {
    content: string;
    maxLength?: number;
}

const ExpandableContent: React.FC<ExpandableContentProps> = ({
                                                                 content,
                                                                 maxLength = 500
                                                             }) => {
    const [isExpanded, setIsExpanded] = useState(false);

    const needsTruncation = content.length > maxLength;
    const displayContent = isExpanded || !needsTruncation
        ? content
        : `${content.slice(0, maxLength)}...`;

    return (
        <Card className="p-6">
            <div className="prose dark:prose-invert max-w-none">
                <p className="whitespace-pre-line">{displayContent}</p>
                {needsTruncation && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-4 text-accent-blue hover:text-accent-blue/80 font-medium transition-colors"
                    >
                        {isExpanded ? 'Show Less' : 'Read More'}
                    </button>
                )}
            </div>
        </Card>
    );
};

// RelatedProjectCard Component
interface RelatedProjectCardProps {
    project: Project;
}

const RelatedProjectCard: React.FC<RelatedProjectCardProps> = ({ project }) => {
    return (
        <Card className="p-5 hover:shadow-lg transition-shadow duration-300 group">
            <Link to={`/projects/${project.id}`} className="block">
                <div className="flex items-start gap-4">
                    <LazyImage
                        src={project.logo}
                        alt={`${project.name} logo`}
                        wrapperClassName="w-12 h-12 rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border p-1 flex-shrink-0 group-hover:scale-105 transition-transform"
                        className="w-full h-full object-contain"
                    />
                    <div className="flex-grow min-w-0">
                        <h3 className="font-semibold text-slate-900 dark:text-white truncate group-hover:text-accent-blue transition-colors">
                            {project.name}
                        </h3>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 line-clamp-2">
                            {project.tagline || project.description}
                        </p>
                        <div className="flex items-center justify-between mt-3">
                            <span className="text-xs font-medium text-accent-blue uppercase tracking-wide">
                                {project.category}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-500">
                                View →
                            </span>
                        </div>
                    </div>
                </div>
            </Link>
        </Card>
    );
};

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

    // Use type guards to safely access properties
    const relatedProjects = useMemo(() => {
        if (!project || !isProject(project)) return [];
        const relatedIds = project.relatedProjectIds || [];

        if (!isProjectArray(allProjects)) return [];
        return allProjects.filter(p => relatedIds.includes(p.id));
    }, [project, allProjects]);

    // Create a safe project variable that's verified to be a Project
    const safeProject = isProject(project) ? project : null;

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

    if (!safeProject) {
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
        { href: safeProject.url, icon: GlobeIcon, name: 'Website' },
        { href: safeProject.twitter, icon: TwitterIcon, name: 'Twitter' },
        { href: safeProject.discord, icon: DiscordIcon, name: 'Discord' },
        { href: safeProject.github, icon: GitHubIcon, name: 'GitHub' },
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
                    <Breadcrumb project={safeProject} />
                </m.div>

                <m.header variants={itemVariants} className="flex flex-col items-center">
                    <div className="w-full flex flex-col sm:flex-row items-start sm:items-center gap-6">
                        <LazyImage
                            src={safeProject.logo}
                            alt={`${safeProject.name} logo`}
                            wrapperClassName="w-24 h-24 rounded-2xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border p-2 flex-shrink-0"
                            className="w-full h-full object-contain"
                        />
                        <div className="flex-grow">
                            <span className="text-sm font-bold uppercase text-accent-blue tracking-widest">{safeProject.category}</span>
                            <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 dark:text-white mt-1">{safeProject.name}</h1>
                        </div>
                        <div className="flex items-center gap-2 self-start sm:self-center mt-4 sm:mt-0">
                            <Button
                                variant={isFavorite(safeProject.id) ? 'secondary' : 'outline'}
                                className="!py-2.5"
                                onClick={() => toggleFavorite(safeProject.id)}
                            >
                                <StarIcon className={`w-4 h-4 mr-2 transition-colors ${isFavorite(safeProject.id) ? 'text-yellow-400 fill-yellow-400' : ''}`} />
                                {isFavorite(safeProject.id) ? 'Favorited' : 'Favorite'}
                            </Button>
                            <a href={safeProject.url} target="_blank" rel="noopener noreferrer">
                                <Button variant="primary" className="w-full sm:w-auto !py-2.5">Visit Website</Button>
                            </a>
                        </div>
                    </div>
                    {safeProject.products && safeProject.products.length > 0 && (
                        <div className="mt-4">
                            <Button variant="secondary" onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}>
                                View Packages
                            </Button>
                        </div>
                    )}
                    <p className="text-center text-slate-900 dark:text-slate-200 mt-6 max-w-2xl">{safeProject.description}</p>
                    <div className="flex items-center space-x-3 mt-6">
                        {socialLinks.map(link => link.href && (
                            <Magnetic key={link.name}>
                                <a
                                    href={link.href}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    title={link.name}
                                    className="p-2.5 flex items-center justify-center rounded-full text-slate-800 dark:text-slate-300 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border hover:text-accent-blue dark:hover:border-accent-blue transition-colors"
                                    style={{ overflow: 'visible' }}
                                >
                                    <link.icon className="w-5 h-5" />
                                </a>
                            </Magnetic>
                        ))}
                    </div>
                </m.header>

                <m.section variants={itemVariants}>
                    <ExpandableContent content={safeProject.longDescription || safeProject.description} />
                </m.section>

                <m.section variants={itemVariants} id="reviews">
                    <ProjectReviewsSection reviews={safeProject.reviews} projectName={safeProject.name} projectId={safeProject.id} />
                </m.section>

                {safeProject.products && safeProject.products.length > 0 && (
                    <m.section variants={itemVariants} id="products">
                        <ProjectProductsCard products={safeProject.products} projectId={safeProject.id} />
                    </m.section>
                )}

                {safeProject.updates && safeProject.updates.length > 0 && (
                    <m.section variants={itemVariants} className="space-y-6">
                        <h2 className="text-3xl font-display font-bold text-center">Updates</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            {safeProject.updates.map(update => (
                                <UpdateCard key={update.id} update={update} />
                            ))}
                        </div>
                    </m.section>
                )}

                {relatedProjects.length > 0 && (
                    <m.section variants={itemVariants} className="space-y-6">
                        <h2 className="text-3xl font-display font-bold text-center">Projects Related to {safeProject.name}</h2>
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