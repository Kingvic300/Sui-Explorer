
import React from 'react';
import { ChevronRight } from '../Icons';

interface PaginationProps {
    currentPage: number;
    totalPages: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({ currentPage, totalPages, onPageChange }) => {
    
    const getPageNumbers = () => {
        const pageNumbers: (number | string)[] = [];
        const maxPagesToShow = 3; 
        const ellipsis = '...';

        if (totalPages <= maxPagesToShow + 2) {
            for (let i = 1; i <= totalPages; i++) {
                pageNumbers.push(i);
            }
        } else {
            pageNumbers.push(1);

            let startPage = Math.max(2, currentPage - Math.floor(maxPagesToShow / 2));
            let endPage = Math.min(totalPages - 1, currentPage + Math.floor(maxPagesToShow / 2));
            
            if (currentPage <= Math.ceil(maxPagesToShow / 2) + 1) {
                endPage = 1 + maxPagesToShow;
            }
            
            if (currentPage >= totalPages - Math.floor(maxPagesToShow / 2) - 1) {
                startPage = totalPages - maxPagesToShow;
            }

            if (startPage > 2) {
                pageNumbers.push(ellipsis);
            }

            for (let i = startPage; i <= endPage; i++) {
                pageNumbers.push(i);
            }

            if (endPage < totalPages - 1) {
                pageNumbers.push(ellipsis);
            }

            pageNumbers.push(totalPages);
        }
        return pageNumbers;
    };

    const pages = getPageNumbers();

    if (totalPages <= 1) return null;

    return (
        <nav aria-label="Project pagination" className="flex justify-center items-center gap-4 mt-12">
            <button
                onClick={() => onPageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-300 bg-indigo-950/30 rounded-lg hover:bg-indigo-950/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Go to previous page"
            >
                <ChevronRight className="w-4 h-4 rotate-180" />
                <span>Previous</span>
            </button>
            
            <div className="hidden sm:flex items-center gap-2">
                {pages.map((page, index) => {
                    if (typeof page === 'string') {
                        return <span key={`ellipsis-${index}`} className="px-2 py-2 text-sm text-gray-500">...</span>
                    }
                    return (
                        <button
                            key={page}
                            onClick={() => onPageChange(page)}
                            className={`w-10 h-10 text-sm font-semibold rounded-lg transition-colors ${
                                currentPage === page 
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                                : 'bg-indigo-950/30 text-gray-300 hover:bg-indigo-950/70'
                            }`}
                            aria-current={currentPage === page ? 'page' : undefined}
                            aria-label={`Go to page ${page}`}
                        >
                            {page}
                        </button>
                    )
                })}
            </div>

            <button
                onClick={() => onPageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex items-center gap-2 px-4 py-2 text-sm font-semibold text-gray-300 bg-indigo-950/30 rounded-lg hover:bg-indigo-950/70 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                aria-label="Go to next page"
            >
                <span>Next</span>
                <ChevronRight className="w-4 h-4" />
            </button>
        </nav>
    );
};

export default Pagination;
