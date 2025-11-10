
import React from 'react';

const ProjectCardSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                 <div key={index} className="rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border p-4 shadow-card animate-pulse">
                    <div className="flex justify-between items-start">
                        <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-slate-200 dark:bg-dark-border rounded-lg flex-shrink-0"></div>
                            <div className="w-full pt-1 space-y-2">
                                <div className="h-5 bg-slate-200 dark:bg-dark-border rounded w-32"></div>
                                <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-20"></div>
                            </div>
                        </div>
                        <div className="w-6 h-6 bg-slate-200 dark:bg-dark-border rounded-full"></div>
                    </div>
                    <div className="space-y-2 my-4">
                         <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-full"></div>
                         <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-5/6"></div>
                    </div>
                    <div className="flex items-center justify-between border-t border-light-border dark:border-dark-border pt-3">
                        <div className="flex items-center space-x-2">
                            <div className="w-4 h-4 bg-slate-200 dark:bg-dark-border rounded-full"></div>
                            <div className="w-4 h-4 bg-slate-200 dark:bg-dark-border rounded-full"></div>
                            <div className="w-4 h-4 bg-slate-200 dark:bg-dark-border rounded-full"></div>
                        </div>
                        <div className="flex items-center space-x-3">
                            <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-10"></div>
                            <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-10"></div>
                            <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-10"></div>
                        </div>
                    </div>
                </div>
            ))}
        </>
    );
};

export default ProjectCardSkeleton;