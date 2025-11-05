import React from 'react';

const PostCardSkeleton: React.FC = () => {
  return (
    <div className="bg-indigo-950/20 p-6 rounded-2xl border border-blue-900/30 animate-pulse">
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-full bg-gray-700/50 flex-shrink-0"></div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between">
            <div className="flex items-baseline gap-2">
              <div className="h-5 w-24 bg-gray-700/50 rounded"></div>
              <div className="h-4 w-32 bg-gray-700/50 rounded"></div>
            </div>
          </div>
          <div className="space-y-2 mt-3">
            <div className="h-4 w-full bg-gray-700/50 rounded"></div>
            <div className="h-4 w-5/6 bg-gray-700/50 rounded"></div>
          </div>
          <div className="mt-4 h-48 bg-gray-700/50 rounded-lg"></div>
          <div className="mt-4 flex items-center justify-between">
            <div className="flex items-center gap-6">
                <div className="h-5 w-10 bg-gray-700/50 rounded"></div>
                <div className="h-5 w-10 bg-gray-700/50 rounded"></div>
                <div className="h-5 w-10 bg-gray-700/50 rounded"></div>
            </div>
            <div className="h-5 w-5 bg-gray-700/50 rounded"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCardSkeleton;