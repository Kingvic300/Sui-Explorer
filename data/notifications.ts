import React from 'react';
import { formatDistanceToNow } from 'date-fns';

export interface Notification {
    id: number;
    type: 'new_project' | 'review' | 'update';
    title: string;
    description: string;
    timestamp: string; // ISO 8601 format
    read: boolean;
}

export const notificationsData: Notification[] = [
    {
        id: 1,
        type: 'new_project',
        title: 'New Project: Velocity DEX',
        description: 'A new DeFi project just launched. Check it out!',
        timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(), // 1 hour ago
        read: false,
    },
    {
        id: 2,
        type: 'review',
        title: 'Review on Cyberscape',
        description: '"The best game on Sui!" - says @GameMaster.',
        timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000).toISOString(), // 3 hours ago
        read: false,
    },
    {
        id: 3,
        type: 'update',
        title: 'Platform Update v1.2',
        description: 'We\'ve added new features to the explorer. Enjoy!',
        timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000).toISOString(), // 12 hours ago
        read: false,
    },
    {
        id: 4,
        type: 'new_project',
        title: 'New Project: Sui Pets',
        description: 'A collectible NFT game has been submitted.',
        timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: true,
    },
    {
        id: 5,
        type: 'update',
        title: 'Community Guidelines Updated',
        description: 'Please review our updated community guidelines.',
        timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
        read: true,
    }
];

export const getNotificationIcon = (type: Notification['type']): React.ReactElement => {
    // Fix: Replaced JSX with React.createElement to avoid syntax errors in a .ts file.
    switch (type) {
        case 'new_project':
            return React.createElement('div', { className: "bg-blue-500/20 text-blue-300 p-2 rounded-full" }, 
                React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" },
                    React.createElement('path', { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v2H7a1 1 0 100 2h2v2a1 1 0 102 0v-2h2a1 1 0 100-2h-2V7z", clipRule: "evenodd" })
                )
            );
        case 'review':
            return React.createElement('div', { className: "bg-yellow-500/20 text-yellow-300 p-2 rounded-full" },
                React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" },
                    React.createElement('path', { d: "M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" })
                )
            );
        case 'update':
            return React.createElement('div', { className: "bg-green-500/20 text-green-300 p-2 rounded-full" },
                React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" },
                    React.createElement('path', { fillRule: "evenodd", d: "M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z", clipRule: "evenodd" })
                )
            );
        default:
            return React.createElement('div', { className: "bg-gray-500/20 text-gray-300 p-2 rounded-full" },
                React.createElement('svg', { xmlns: "http://www.w3.org/2000/svg", className: "h-5 w-5", viewBox: "0 0 20 20", fill: "currentColor" },
                    React.createElement('path', { fillRule: "evenodd", d: "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z", clipRule: "evenodd" })
                )
            );
    }
};

export const formatTimeAgo = (timestamp: string): string => {
    return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
};
