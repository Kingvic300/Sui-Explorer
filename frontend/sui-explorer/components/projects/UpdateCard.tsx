
import React from 'react';
// FIX: Corrected import path for Update type.
import { Update } from '@/types/index.ts';
import Card from '../ui/Card';
import LazyImage from '../ui/LazyImage';

interface UpdateCardProps {
    update: Update;
}

const UpdateCard: React.FC<UpdateCardProps> = ({ update }) => {
    return (
        <a href={update.link} target="_blank" rel="noopener noreferrer" className="block h-full group">
            <Card className="h-full !p-4">
                <div className="flex items-center gap-4">
                    <LazyImage 
                        src={update.image} 
                        alt={update.title}
                        wrapperClassName="w-20 h-20 md:w-24 md:h-24 rounded-lg bg-light-border dark:bg-dark-border flex-shrink-0 overflow-hidden"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="min-w-0">
                        <h4 className="font-semibold leading-snug text-slate-800 dark:text-slate-200 group-hover:text-accent-blue transition-colors line-clamp-3">
                            {update.title}
                        </h4>
                        <p className="text-sm text-slate-800 dark:text-slate-300 mt-2">{update.date}</p>
                    </div>
                </div>
            </Card>
        </a>
    );
};

export default UpdateCard;