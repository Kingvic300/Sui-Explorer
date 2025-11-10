import React from 'react';
import Card from '../Card';

const FeedPostSkeleton: React.FC<{ count?: number }> = ({ count = 1 }) => {
    return (
        <>
            {Array.from({ length: count }).map((_, index) => (
                <Card key={index} className="!p-5 animate-pulse">
                    <div className="flex space-x-4">
                        <div className="w-10 h-10 rounded-full bg-slate-200 dark:bg-dark-border flex-shrink-0"></div>
                        <div className="w-full">
                            <div className="flex justify-between items-center">
                                <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-1/2"></div>
                                <div className="w-4 h-4 bg-slate-200 dark:bg-dark-border rounded"></div>
                            </div>
                            <div className="space-y-2 mt-3">
                                <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-full"></div>
                                <div className="h-4 bg-slate-200 dark:bg-dark-border rounded w-5/6"></div>
                            </div>
                            <div className="aspect-video bg-slate-200 dark:bg-dark-border rounded-lg mt-3"></div>
                            <div className="flex justify-between items-center mt-4 max-w-xs">
                                <div className="h-5 bg-slate-200 dark:bg-dark-border rounded w-10"></div>
                                <div className="h-5 bg-slate-200 dark:bg-dark-border rounded w-10"></div>
                                <div className="h-5 bg-slate-200 dark:bg-dark-border rounded w-10"></div>
                            </div>
                        </div>
                    </div>
                </Card>
            ))}
        </>
    );
};

export default FeedPostSkeleton;
