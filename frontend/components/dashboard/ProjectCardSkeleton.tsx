import React from 'react';

const Shimmer: React.FC = () => (
    <div className="absolute inset-0 -translate-x-full animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
);

const SkeletonElement: React.FC<{ className: string }> = ({ className }) => (
    <div className={`relative overflow-hidden bg-gray-700/50 rounded ${className}`}>
        <Shimmer />
    </div>
);

const ProjectCardSkeleton: React.FC = () => {
  return (
    <div className="w-full bg-indigo-950/20 p-6 rounded-2xl border border-blue-900/30">
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center">
          <div className="relative overflow-hidden w-14 h-14 rounded-full mr-4 bg-gray-700/50 flex-shrink-0">
            <Shimmer />
          </div>
          <div className="flex flex-col gap-2">
            <SkeletonElement className="h-5 w-32" />
            <SkeletonElement className="h-4 w-20" />
          </div>
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <SkeletonElement className="h-4 w-full" />
        <SkeletonElement className="h-4 w-3/4" />
      </div>
      <div className="border-t border-blue-900/40 pt-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
            <div className="relative overflow-hidden h-4 w-4 bg-gray-700/50 rounded-full">
                <Shimmer />
            </div>
            <div className="relative overflow-hidden h-4 w-4 bg-gray-700/50 rounded-full">
                <Shimmer />
            </div>
        </div>
        <div className="flex gap-3">
          <SkeletonElement className="h-4 w-10" />
          <SkeletonElement className="h-4 w-10" />
          <SkeletonElement className="h-4 w-10" />
        </div>
      </div>
    </div>
  );
};

export default ProjectCardSkeleton;