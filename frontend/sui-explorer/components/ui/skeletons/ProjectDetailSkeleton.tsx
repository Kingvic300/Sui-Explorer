

import React from 'react';

const ProjectDetailSkeleton: React.FC = () => {
    return (
        <div className="space-y-6 animate-pulse">
            {/* Breadcrumb Skeleton */}
            <div className="h-5 bg-slate-200 dark:bg-dark-border rounded w-1/4 mb-4"></div>

             {/* Header Skeleton */}
            <section>
                <div className="relative h-48 md:h-64 rounded-xl bg-slate-200 dark:bg-dark-border"></div>
                <div className="flex flex-col sm:flex-row sm:items-end justify-between -mt-16 sm:-mt-12 px-4 sm:px-8">
                    <div className="flex items-end space-x-4">
                        <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-xl border-4 border-light-bg dark:border-dark-bg bg-slate-300 dark:bg-dark-card flex-shrink-0"></div>
                        <div className="pb-2 space-y-2">
                            <div className="h-9 bg-slate-200 dark:bg-dark-border rounded w-48"></div>
                            <div className="h-5 bg-slate-200 dark:bg-dark-border rounded w-64"></div>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-4 sm:mt-0 pb-2">
                         <div className="w-9 h-9 bg-slate-200 dark:bg-dark-border rounded-full"></div>
                         <div className="w-9 h-9 bg-slate-200 dark:bg-dark-border rounded-full"></div>
                         <div className="w-9 h-9 bg-slate-200 dark:bg-dark-border rounded-full"></div>
                    </div>
                </div>
            </section>

            {/* Main Content Skeleton */}
            <div className="grid lg:grid-cols-3 gap-8 items-start pt-6">
                <div className="lg:col-span-2 space-y-8">
                    {/* Description */}
                    <div className="p-6 rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
                        <div className="h-6 bg-slate-200 dark:bg-dark-border rounded w-1/4 mb-4"></div>
                        <div className="space-y-2">
                            <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-full"></div>
                            <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-full"></div>
                            <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-5/6"></div>
                        </div>
                    </div>
                    {/* Products */}
                    <div className="p-6 rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
                         <div className="h-6 bg-slate-200 dark:bg-dark-border rounded w-1/3 mb-4"></div>
                         <div className="h-20 bg-slate-200 dark:bg-dark-border rounded-lg mb-4"></div>
                         <div className="h-20 bg-slate-200 dark:bg-dark-border rounded-lg"></div>
                    </div>
                </div>
                <div className="lg:col-span-1 space-y-8">
                    <div className="h-56 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl p-4">
                        <div className="h-6 bg-slate-200 dark:bg-dark-border rounded w-1/2 mb-4"></div>
                        <div className="h-12 bg-slate-200 dark:bg-dark-border rounded w-full mb-4"></div>
                        <div className="h-10 bg-slate-200 dark:bg-dark-border rounded w-full mb-4"></div>
                        <div className="h-10 bg-slate-200 dark:bg-dark-border rounded w-full"></div>
                    </div>
                    <div className="h-48 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl"></div>
                    <div className="h-72 bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border rounded-xl"></div>
                </div>
            </div>
        </div>
    );
};

export default ProjectDetailSkeleton;