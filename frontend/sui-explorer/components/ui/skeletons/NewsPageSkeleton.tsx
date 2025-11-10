import React from 'react';

const NewsPageSkeleton: React.FC = () => {
  return (
    <div className="grid lg:grid-cols-3 gap-8 items-start animate-pulse">
      <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
        {/* Main Feed Skeletons */}
        {[...Array(4)].map((_, i) => (
          <div key={i} className="space-y-3 rounded-xl bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border p-4">
            <div className="aspect-video bg-slate-200 dark:bg-dark-border rounded-lg"></div>
            <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-1/4"></div>
            <div className="h-6 bg-slate-200 dark:bg-dark-border rounded w-3/4"></div>
            <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-full"></div>
            <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-5/6"></div>
          </div>
        ))}
      </div>
      <div className="lg:col-span-1 space-y-4">
        {/* Sidebar Skeletons */}
        <div className="h-8 bg-slate-200 dark:bg-dark-border rounded w-1/2 mb-4"></div>
        {[...Array(3)].map((_, i) => (
          <div key={i} className="flex items-center space-x-3 p-3 rounded-lg bg-light-card dark:bg-dark-card border border-light-border dark:border-dark-border">
            <div className="w-16 h-16 bg-slate-200 dark:bg-dark-border rounded-md flex-shrink-0"></div>
            <div className="w-full space-y-2">
              <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-full"></div>
              <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-3/4"></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsPageSkeleton;
