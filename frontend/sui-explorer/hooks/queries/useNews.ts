
import { useQuery } from '@tanstack/react-query';
import { fetchNews } from '../../api';

export const useNews = () => {
    return useQuery({
        queryKey: ['news'],
        queryFn: fetchNews,
        onError: (error) => {
            console.error("Error fetching news:", error);
            // Error is handled inline on the NewsPage component
        }
    });
};
