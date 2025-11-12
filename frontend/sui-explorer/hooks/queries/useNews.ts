import { useQuery } from '@tanstack/react-query';
import { fetchNews } from '../../api';
import { NewsArticle } from '@/types/index';

export const useNews = () => {
    return useQuery<NewsArticle[]>({
        queryKey: ['news'],
        queryFn: fetchNews,
        // Remove the onError property - handle errors in your components instead
    });
};