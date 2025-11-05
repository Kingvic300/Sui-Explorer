import React, { useState, useEffect, useRef } from 'react';

type SortOrder = 'latest' | 'popular' | 'trending';

interface FeedFilterProps {
    sortOrder: SortOrder;
    onSetSortOrder: (order: SortOrder) => void;
}

const sortOptions: { id: SortOrder; name: string }[] = [
    { id: 'latest', name: 'Latest' },
    { id: 'popular', name: 'Most Liked' },
    { id: 'trending', name: 'Trending' },
];

const FeedFilter: React.FC<FeedFilterProps> = ({ sortOrder, onSetSortOrder }) => {
    const [indicatorStyle, setIndicatorStyle] = useState({});
    const buttonsRef = useRef<Record<string, HTMLButtonElement | null>>({});
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const activeButton = buttonsRef.current[sortOrder];
        if (activeButton && containerRef.current) {
            const containerRect = containerRef.current.getBoundingClientRect();
            const buttonRect = activeButton.getBoundingClientRect();
            
            setIndicatorStyle({
                width: `${buttonRect.width}px`,
                transform: `translateX(${buttonRect.left - containerRect.left}px)`,
            });

            // Scroll active button into view if needed
            activeButton.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
        }
    }, [sortOrder]);
    
    useEffect(() => {
        const handleResize = () => {
             const activeButton = buttonsRef.current[sortOrder];
             if (activeButton && containerRef.current) {
                const containerRect = containerRef.current.getBoundingClientRect();
                const buttonRect = activeButton.getBoundingClientRect();
                setIndicatorStyle({
                    width: `${buttonRect.width}px`,
                    transform: `translateX(${buttonRect.left - containerRect.left}px)`,
                });
             }
        };

        window.addEventListener('resize', handleResize);
        const resizeObserver = new ResizeObserver(handleResize);
        if (containerRef.current) {
            resizeObserver.observe(containerRef.current);
        }

        return () => {
            window.removeEventListener('resize', handleResize);
            resizeObserver.disconnect();
        }
    }, [sortOrder]);

    return (
        <div 
            ref={containerRef}
            className="relative w-full sm:w-auto bg-indigo-950/40 border border-blue-900/50 rounded-xl p-1.5 flex items-center gap-2 overflow-x-auto no-scrollbar"
        >
            <style>{`.no-scrollbar::-webkit-scrollbar { display: none; } .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`}</style>
            <div
                className="absolute top-1.5 left-0 h-[calc(100%-0.75rem)] bg-blue-600 rounded-lg shadow-[0_0_15px_theme(colors.blue.500)] transition-all duration-300 ease-out"
                style={indicatorStyle}
            />
            {sortOptions.map((option) => (
                <button
                    key={option.id}
                    ref={(el) => { buttonsRef.current[option.id] = el; }}
                    onClick={() => onSetSortOrder(option.id)}
                    className={`relative z-10 px-4 py-2 text-sm font-semibold rounded-lg transition-colors duration-300 flex-shrink-0
                        ${sortOrder === option.id ? 'text-white' : 'text-gray-400 hover:text-white'}`}
                >
                    {option.name}
                </button>
            ))}
        </div>
    );
};

export default FeedFilter;